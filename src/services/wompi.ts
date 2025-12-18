/**
 * Servicio para integración con Wompi usando Web Checkout
 * Wompi es el gateway de pagos de Bancolombia que soporta PSE y Nequi
 * 
 * Documentación: https://docs.wompi.co/docs/colombia/widget-checkout-web/
 */

export interface WompiTransaction {
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  payment_method: {
    type: 'NEQUI' | 'PSE';
    installments?: number;
  };
  reference: string;
  customer_data?: {
    full_name: string;
    phone_number: string;
    legal_id: string;
  };
  shipping_address?: {
    address_line_1: string;
    city: string;
    country: string;
    region: string;
    phone_number?: string;
  };
}

/**
 * Genera la firma de integridad SHA256 para Wompi
 * Formato: SHA256(reference + amount_in_cents + currency + integrity_secret)
 */
async function generateIntegritySignature(
  reference: string,
  amountInCents: number,
  currency: string,
  integritySecret: string
): Promise<string> {
  const message = `${reference}${amountInCents}${currency}${integritySecret}`;
  
  // Usar Web Crypto API para generar SHA256
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Genera la URL del Web Checkout de Wompi
 * Según documentación: https://docs.wompi.co/docs/colombia/widget-checkout-web/
 */
export async function createWompiCheckoutUrl(
  transaction: WompiTransaction,
  publicKey: string
): Promise<string> {
  try {
    // Obtener el secreto de integridad de las variables de entorno
    const integritySecret = import.meta.env.VITE_WOMPI_INTEGRITY_SECRET || '';
    
    if (!integritySecret) {
      throw new Error('VITE_WOMPI_INTEGRITY_SECRET no está configurado. Necesitas configurarlo en Vercel.');
    }

    // Generar la firma de integridad (requerida por Wompi)
    const signature = await generateIntegritySignature(
      transaction.reference,
      transaction.amount_in_cents,
      transaction.currency,
      integritySecret
    );

    // URL de redirección después del pago
    const redirectUrl = `${window.location.origin}/payment/success`;

    // Formatear el número de teléfono para Wompi
    const formatPhoneNumber = (phone: string): string => {
      let cleaned = phone.replace(/\s+/g, '').replace(/[-\+()]/g, '');
      // Wompi espera el número sin código de país para shipping_address
      // Pero con código de país para customer_data
      return cleaned;
    };

    // Construir la URL del Web Checkout de Wompi
    const baseUrl = 'https://checkout.wompi.co/p/';
    const params = new URLSearchParams();

    // Parámetros OBLIGATORIOS
    params.append('public-key', publicKey);
    params.append('currency', transaction.currency);
    params.append('amount-in-cents', transaction.amount_in_cents.toString());
    params.append('reference', transaction.reference);
    params.append('signature:integrity', signature);
    params.append('redirect-url', redirectUrl);

    // Parámetros OPCIONALES - Customer Data
    // Siempre incluir customer_email si está disponible
    if (transaction.customer_email) {
      params.append('customer-data:email', transaction.customer_email);
    }
    
    if (transaction.customer_data) {
      const phoneNumber = formatPhoneNumber(transaction.customer_data.phone_number);
      // Agregar código de país si no lo tiene
      const customerPhone = phoneNumber.startsWith('57') ? phoneNumber : '57' + phoneNumber;
      
      if (transaction.customer_data.full_name) {
        params.append('customer-data:full-name', transaction.customer_data.full_name);
      }
      params.append('customer-data:phone-number', customerPhone);
      if (transaction.customer_data.legal_id) {
        params.append('customer-data:legal-id', transaction.customer_data.legal_id);
        params.append('customer-data:legal-id-type', 'CC'); // Cédula de Ciudadanía
      }
    }

    // Parámetros OPCIONALES - Shipping Address (requerido para PSE/NEQUI)
    if (transaction.payment_method.type === 'PSE' || transaction.payment_method.type === 'NEQUI') {
      const shippingPhone = transaction.shipping_address?.phone_number 
        ? formatPhoneNumber(transaction.shipping_address.phone_number)
        : transaction.customer_data 
          ? formatPhoneNumber(transaction.customer_data.phone_number)
          : '';
      
      // Para shipping_address, Wompi espera el número SIN código de país
      const shippingPhoneFormatted = shippingPhone.startsWith('57') ? shippingPhone.substring(2) : shippingPhone;

      params.append('shipping-address:address-line-1', 
        transaction.shipping_address?.address_line_1 || 'Calle 7 No. 3-24 Barrio Centro');
      params.append('shipping-address:city', transaction.shipping_address?.city || 'Neiva');
      params.append('shipping-address:country', transaction.shipping_address?.country || 'CO');
      params.append('shipping-address:region', transaction.shipping_address?.region || 'Huila');
      params.append('shipping-address:phone-number', shippingPhoneFormatted);
    } else if (transaction.shipping_address) {
      // Para otros métodos de pago
      params.append('shipping-address:address-line-1', transaction.shipping_address.address_line_1);
      params.append('shipping-address:city', transaction.shipping_address.city);
      params.append('shipping-address:country', transaction.shipping_address.country);
      params.append('shipping-address:region', transaction.shipping_address.region);
      if (transaction.shipping_address.phone_number) {
        const shippingPhone = formatPhoneNumber(transaction.shipping_address.phone_number);
        const shippingPhoneFormatted = shippingPhone.startsWith('57') ? shippingPhone.substring(2) : shippingPhone;
        params.append('shipping-address:phone-number', shippingPhoneFormatted);
      }
    }

    const checkoutUrl = `${baseUrl}?${params.toString()}`;
    
    console.log('URL de Checkout Wompi generada:', checkoutUrl);
    
    return checkoutUrl;
  } catch (error) {
    console.error('Error al generar URL de checkout de Wompi:', error);
    throw error;
  }
}

/**
 * @deprecated Usar createWompiCheckoutUrl en su lugar
 * Mantenido por compatibilidad
 */
export async function createWompiTransaction(
  transaction: WompiTransaction,
  publicKey: string
): Promise<string> {
  return createWompiCheckoutUrl(transaction, publicKey);
}

/**
 * Genera una referencia única para la transacción
 */
export function generateTransactionReference(bookingId: string): string {
  const timestamp = Date.now();
  return `HOTEL-SION-${bookingId}-${timestamp}`;
}

