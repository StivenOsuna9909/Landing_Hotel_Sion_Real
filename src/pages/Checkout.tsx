import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, ArrowLeft, Shield, Loader2, Mail, User, Phone } from 'lucide-react';
import Header from '@/components/hotel/Header';
import Footer from '@/components/hotel/Footer';
import { createWompiTransaction, generateTransactionReference } from '@/services/wompi';
import { saveReservation } from '@/services/reservations';
import { useToast } from '@/hooks/use-toast';

interface BookingData {
  checkIn: string;
  checkOut: string;
  guests: string;
  room: string;
  nights: number;
  pricePerNight: number;
  total: number;
  roomName: string;
}

interface CustomerData {
  email: string;
  fullName: string;
  phoneNumber: string;
  legalId?: string;
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const bookingData = location.state as BookingData | null;
  
  const [customerData, setCustomerData] = useState<CustomerData>({
    email: '',
    fullName: '',
    phoneNumber: '',
    legalId: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerData, string>>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'PSE' | 'NEQUI' | null>(null);

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="font-display text-2xl mb-4">No hay datos de reserva</h2>
            <button
              onClick={() => navigate('/#reservar')}
              className="btn-gold rounded"
            >
              Volver al formulario
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const validateCustomerData = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerData, string>> = {};
    
    if (!customerData.email || !customerData.email.includes('@')) {
      newErrors.email = 'Ingrese un email válido';
    }
    
    if (!customerData.fullName || customerData.fullName.trim().length < 3) {
      newErrors.fullName = 'Ingrese su nombre completo';
    }
    
    if (!customerData.phoneNumber || customerData.phoneNumber.length < 10) {
      newErrors.phoneNumber = 'Ingrese un número de teléfono válido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async (method: 'PSE' | 'NEQUI') => {
    if (!validateCustomerData()) {
      toast({
        title: 'Error de validación',
        description: 'Por favor, complete todos los campos correctamente',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setSelectedPaymentMethod(method);

    try {
      const wompiPublicKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY;
      
      if (!wompiPublicKey) {
        throw new Error('Configuración de Wompi no encontrada. Por favor, contacte al administrador.');
      }

      // Generar referencia única para la transacción
      const reference = generateTransactionReference(
        `${bookingData!.checkIn}-${bookingData!.checkOut}-${Date.now()}`
      );

      // Crear transacción en Wompi
      const paymentUrl = await createWompiTransaction(
        {
          amount_in_cents: bookingData!.total * 100, // Wompi espera el monto en centavos
          currency: 'COP',
          customer_email: customerData.email,
          payment_method: {
            type: method,
          },
          reference: reference,
          customer_data: {
            full_name: customerData.fullName,
            phone_number: customerData.phoneNumber,
            legal_id: customerData.legalId || customerData.phoneNumber, // Usar teléfono si no hay cédula
          },
          // Shipping address no es requerido para PSE y Nequi
          // shipping_address: {
          //   address_line_1: 'Calle 7 No. 3-24 Barrio Centro',
          //   city: 'Neiva',
          //   country: 'CO',
          //   region: 'Huila',
          // },
        },
        wompiPublicKey
      );

      // Guardar reserva como pendiente antes de redirigir
      await saveReservation({
        checkIn: bookingData!.checkIn,
        checkOut: bookingData!.checkOut,
        guests: parseInt(bookingData!.guests),
        roomType: bookingData!.room,
        roomName: bookingData!.roomName,
        nights: bookingData!.nights,
        pricePerNight: bookingData!.pricePerNight,
        total: bookingData!.total,
        customerEmail: customerData.email,
        customerName: customerData.fullName,
        customerPhone: customerData.phoneNumber,
        customerLegalId: customerData.legalId,
        paymentMethod: method,
        status: 'pending',
        transactionId: reference,
      });

      // Redirigir al usuario a la URL de pago de Wompi
      window.location.href = paymentUrl;
    } catch (error) {
      console.error('Error al procesar pago:', error);
      setIsProcessing(false);
      setSelectedPaymentMethod(null);
      
      // Si hay error, redirigir a WhatsApp como fallback
      const phoneNumber = '573133505180';
      const message = encodeURIComponent(
        `Reserva Hotel Sion Real\n\n` +
        `Fecha de entrada: ${new Date(bookingData!.checkIn).toLocaleDateString('es-CO')}\n` +
        `Fecha de salida: ${new Date(bookingData!.checkOut).toLocaleDateString('es-CO')}\n` +
        `Número de huéspedes: ${bookingData!.guests}\n` +
        `Tipo de habitación: ${bookingData!.roomName}\n` +
        `Noches: ${bookingData!.nights}\n` +
        `Total: COP $${bookingData!.total.toLocaleString('es-CO')}\n\n` +
        `Método de pago seleccionado: ${method}\n\n` +
        `Cliente: ${customerData.fullName}\n` +
        `Email: ${customerData.email}\n` +
        `Teléfono: ${customerData.phoneNumber}\n\n` +
        `Por favor, confirme la disponibilidad y proceda con el pago.`
      );
      
      toast({
        title: 'Error al procesar pago',
        description: error instanceof Error ? error.message : 'Redirigiendo a WhatsApp para confirmar el pago',
        variant: 'destructive',
      });
      
      // Guardar reserva como pendiente cuando se usa WhatsApp como fallback
      try {
        await saveReservation({
          checkIn: bookingData!.checkIn,
          checkOut: bookingData!.checkOut,
          guests: parseInt(bookingData!.guests),
          roomType: bookingData!.room,
          roomName: bookingData!.roomName,
          nights: bookingData!.nights,
          pricePerNight: bookingData!.pricePerNight,
          total: bookingData!.total,
          customerEmail: customerData.email,
          customerName: customerData.fullName,
          customerPhone: customerData.phoneNumber,
          customerLegalId: customerData.legalId,
          paymentMethod: 'WHATSAPP',
          status: 'pending',
        });
      } catch (saveError) {
        console.error('Error al guardar reserva:', saveError);
      }

      setTimeout(() => {
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <button
            onClick={() => navigate('/#reservar')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-body">Volver al formulario</span>
          </button>

          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
              Procesar Pago
            </h1>
            <p className="font-body text-muted-foreground">
              Seleccione su método de pago preferido
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Resumen de Reserva */}
            <div className="bg-card rounded-xl shadow-elegant p-6">
              <h2 className="font-display text-2xl text-foreground mb-6">Resumen de Reserva</h2>
              <div className="space-y-4 font-body">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo de habitación:</span>
                  <span className="text-foreground font-medium">{bookingData.roomName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha de entrada:</span>
                  <span className="text-foreground font-medium">
                    {new Date(bookingData.checkIn).toLocaleDateString('es-CO', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha de salida:</span>
                  <span className="text-foreground font-medium">
                    {new Date(bookingData.checkOut).toLocaleDateString('es-CO', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Huéspedes:</span>
                  <span className="text-foreground font-medium">{bookingData.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Noches:</span>
                  <span className="text-foreground font-medium">{bookingData.nights}</span>
                </div>
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">
                      {bookingData.nights} noche{bookingData.nights > 1 ? 's' : ''} x COP ${bookingData.pricePerNight.toLocaleString('es-CO')}
                    </span>
                    <span className="text-foreground font-medium">
                      COP ${(bookingData.nights * bookingData.pricePerNight).toLocaleString('es-CO')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="font-display text-lg text-foreground">Total:</span>
                    <span className="font-display text-2xl text-primary">
                      COP ${bookingData.total.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario de Datos del Cliente y Métodos de Pago */}
            <div className="space-y-6">
              <h2 className="font-display text-2xl text-foreground mb-6">Datos de Contacto</h2>
              
              {/* Formulario de datos del cliente */}
              <div className="bg-card rounded-xl shadow-elegant p-6 space-y-4">
                <div>
                  <label className="flex items-center gap-2 font-body text-sm font-medium text-foreground mb-2">
                    <Mail size={16} />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={customerData.email}
                    onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.email ? 'border-destructive' : 'border-input'
                    }`}
                    placeholder="tu@email.com"
                    disabled={isProcessing}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 font-body text-sm font-medium text-foreground mb-2">
                    <User size={16} />
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={customerData.fullName}
                    onChange={(e) => setCustomerData({ ...customerData, fullName: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.fullName ? 'border-destructive' : 'border-input'
                    }`}
                    placeholder="Juan Pérez"
                    disabled={isProcessing}
                  />
                  {errors.fullName && (
                    <p className="text-destructive text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 font-body text-sm font-medium text-foreground mb-2">
                    <Phone size={16} />
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={customerData.phoneNumber}
                    onChange={(e) => setCustomerData({ ...customerData, phoneNumber: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border bg-background text-foreground font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.phoneNumber ? 'border-destructive' : 'border-input'
                    }`}
                    placeholder="3133505180"
                    disabled={isProcessing}
                  />
                  {errors.phoneNumber && (
                    <p className="text-destructive text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 font-body text-sm font-medium text-foreground mb-2">
                    <User size={16} />
                    Cédula (Opcional)
                  </label>
                  <input
                    type="text"
                    value={customerData.legalId || ''}
                    onChange={(e) => setCustomerData({ ...customerData, legalId: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground font-body transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="1234567890"
                    disabled={isProcessing}
                  />
                </div>
              </div>

              <h2 className="font-display text-2xl text-foreground mb-6 mt-8">Métodos de Pago</h2>
              
              {/* PSE */}
              <button
                onClick={() => handlePayment('PSE')}
                disabled={isProcessing}
                className={`w-full bg-card rounded-xl shadow-elegant p-6 hover:shadow-xl transition-all text-left group ${
                  isProcessing && selectedPaymentMethod !== 'PSE' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      {isProcessing && selectedPaymentMethod === 'PSE' ? (
                        <Loader2 className="text-primary animate-spin" size={24} />
                      ) : (
                        <CreditCard className="text-primary" size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-foreground mb-1">PSE</h3>
                      <p className="font-body text-sm text-muted-foreground">
                        Pago Seguro en Línea
                      </p>
                    </div>
                  </div>
                  <ArrowLeft className="text-muted-foreground group-hover:text-foreground rotate-180 transition-colors" size={20} />
                </div>
              </button>

              {/* Nequi */}
              <button
                onClick={() => handlePayment('NEQUI')}
                disabled={isProcessing}
                className={`w-full bg-card rounded-xl shadow-elegant p-6 hover:shadow-xl transition-all text-left group ${
                  isProcessing && selectedPaymentMethod !== 'NEQUI' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#D62631]/10 rounded-lg flex items-center justify-center group-hover:bg-[#D62631]/20 transition-colors">
                      {isProcessing && selectedPaymentMethod === 'NEQUI' ? (
                        <Loader2 className="text-[#D62631] animate-spin" size={24} />
                      ) : (
                        <Shield className="text-[#D62631]" size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-display text-xl text-foreground mb-1">Nequi</h3>
                      <p className="font-body text-sm text-muted-foreground">
                        Pago rápido y seguro
                      </p>
                    </div>
                  </div>
                  <ArrowLeft className="text-muted-foreground group-hover:text-foreground rotate-180 transition-colors" size={20} />
                </div>
              </button>

              <div className="bg-secondary rounded-lg p-4 mt-6">
                <p className="font-body text-xs text-muted-foreground text-center">
                  <Shield size={14} className="inline mr-1" />
                  Sus datos están protegidos. El pago se procesará de forma segura mediante Wompi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;

