/**
 * Servicio para integración con Wompi
 * Wompi es el gateway de pagos de Bancolombia que soporta PSE y Nequi
 * 
 * Documentación: https://docs.wompi.co/
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
  };
}

export interface WompiResponse {
  data: {
    id: string;
    status: string;
    payment_method_type: string;
    payment_method: {
      type: string;
      extra: {
        async_payment_url?: string;
        redirect_url?: string;
      };
    };
    redirect_url?: string;
  };
}

/**
 * Crea una transacción en Wompi y retorna la URL de pago
 * 
 * Nota: Para usar Wompi necesitas:
 * 1. Registrarte en https://comercios.wompi.co/
 * 2. Obtener tu clave pública (puede estar en el frontend)
 * 3. Configurar webhooks en tu backend para recibir confirmaciones de pago
 */
export async function createWompiTransaction(
  transaction: WompiTransaction,
  publicKey: string
): Promise<string> {
  // Usar sandbox para pruebas, producción para producción
  const WOMPI_API_URL = import.meta.env.VITE_WOMPI_API_URL || 'https://production.wompi.co/v1';
  
  try {
    // Primero necesitamos obtener el acceptance_token
    // En producción, esto debería venir de tu backend por seguridad
    const acceptanceToken = import.meta.env.VITE_WOMPI_ACCEPTANCE_TOKEN || '';
    
    // Estructura de transacción según documentación de Wompi
    // Para PSE y Nequi, requerimos redirect_url después del pago
    const redirectUrl = `${window.location.origin}/payment/success`;
    
    // Para PSE, Wompi requiere shipping_address con phone_number
    const needsShippingAddress = transaction.payment_method.type === 'PSE' || transaction.payment_method.type === 'NEQUI';
    
    const wompiTransaction = {
      amount_in_cents: transaction.amount_in_cents,
      currency: transaction.currency,
      customer_email: transaction.customer_email,
      payment_method: {
        type: transaction.payment_method.type,
        ...(transaction.payment_method.installments && {
          installments: transaction.payment_method.installments
        }),
      },
      reference: transaction.reference,
      redirect_url: redirectUrl,
      ...(transaction.customer_data && {
        customer_data: transaction.customer_data
      }),
      // Para PSE, shipping_address es requerido con phone_number
      ...(needsShippingAddress && transaction.customer_data ? {
        shipping_address: {
          ...(transaction.shipping_address || {}),
          phone_number: transaction.customer_data.phone_number,
          // Valores por defecto si no se proporcionan
          address_line_1: transaction.shipping_address?.address_line_1 || 'Calle 7 No. 3-24 Barrio Centro',
          city: transaction.shipping_address?.city || 'Neiva',
          country: transaction.shipping_address?.country || 'CO',
          region: transaction.shipping_address?.region || 'Huila',
        }
      } : transaction.shipping_address ? {
        shipping_address: transaction.shipping_address
      } : {}),
    };

    console.log('Enviando transacción a Wompi:', {
      url: `${WOMPI_API_URL}/transactions`,
      transaction: wompiTransaction
    });

    const response = await fetch(`${WOMPI_API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicKey}`,
      },
      body: JSON.stringify(wompiTransaction),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error completo de Wompi:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      });
      
      // Mensajes más descriptivos según el tipo de error
      let errorMessage = errorData.error?.message || errorData.message;
      
      if (response.status === 422) {
        errorMessage = errorData.error?.message || 
                      'Los datos de la transacción no son válidos. Verifica que todos los campos requeridos estén completos.';
        console.error('Errores de validación:', errorData.error?.details || errorData);
      } else if (response.status === 401) {
        errorMessage = 'Error de autenticación con Wompi. Verifica las credenciales.';
      } else if (response.status === 400) {
        errorMessage = errorData.error?.message || 'Solicitud incorrecta a Wompi.';
      }
      
      throw new Error(errorMessage || `Error al crear transacción: ${response.status} ${response.statusText}`);
    }

    const data: WompiResponse = await response.json();
    
    // Para Nequi, la URL puede estar en diferentes lugares según la versión de la API
    // Intentamos múltiples ubicaciones posibles
    const paymentUrl = 
      data.data.payment_method?.extra?.async_payment_url ||
      data.data.payment_method?.extra?.redirect_url ||
      data.data.redirect_url ||
      (data.data as any).payment_link_url;

    if (!paymentUrl) {
      console.error('Respuesta completa de Wompi:', data);
      throw new Error('No se recibió URL de pago de Wompi. Verifica la configuración.');
    }

    return paymentUrl;
  } catch (error) {
    console.error('Error al crear transacción en Wompi:', error);
    throw error;
  }
}

/**
 * Genera una referencia única para la transacción
 */
export function generateTransactionReference(bookingId: string): string {
  const timestamp = Date.now();
  return `HOTEL-SION-${bookingId}-${timestamp}`;
}

