import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Calendar, Loader2, XCircle, Clock, AlertCircle } from 'lucide-react';
import Header from '@/components/hotel/Header';
import Footer from '@/components/hotel/Footer';
import { getReservationByTransactionId, updateReservationStatus, Reservation } from '@/services/reservations';
import { getWompiTransactionStatus } from '@/services/wompi';

type PaymentStatus = 'loading' | 'approved' | 'pending' | 'declined' | 'error' | 'not_found';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const transactionId = searchParams.get('id'); // ID de transacción de Wompi
  const reference = searchParams.get('reference'); // Referencia alternativa
  const wompiPublicKey = import.meta.env.VITE_WOMPI_PUBLIC_KEY;

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Si tenemos el ID de transacción de Wompi, consultar el estado real
        if (transactionId && wompiPublicKey) {
          const transactionStatus = await getWompiTransactionStatus(transactionId, wompiPublicKey);
          
          if (transactionStatus.approved) {
            // Pago aprobado - buscar reserva y actualizar estado
            const transactionRef = reference || transactionId;
            const foundReservation = await getReservationByTransactionId(transactionRef);
            
            if (foundReservation) {
              await updateReservationStatus(foundReservation.id, 'paid');
              setReservation({ ...foundReservation, status: 'paid' });
              setPaymentStatus('approved');
            } else {
              setPaymentStatus('not_found');
              setErrorMessage('No se encontró la reserva asociada a esta transacción.');
            }
          } else if (transactionStatus.status === 'PENDING') {
            // Pago pendiente (común en Nequi)
            setPaymentStatus('pending');
            setErrorMessage('Tu pago está pendiente de confirmación. Recibirás una notificación cuando se confirme.');
          } else if (transactionStatus.status === 'DECLINED' || transactionStatus.status === 'VOIDED') {
            // Pago rechazado o cancelado
            setPaymentStatus('declined');
            setErrorMessage('El pago fue rechazado o cancelado. Por favor, intenta nuevamente.');
          } else {
            // Error o estado desconocido
            setPaymentStatus('error');
            setErrorMessage(transactionStatus.error || 'No se pudo verificar el estado del pago.');
          }
        } else if (reference) {
          // Fallback: si solo tenemos la referencia, buscar la reserva
          const foundReservation = await getReservationByTransactionId(reference);
          
          if (foundReservation) {
            // Si no tenemos ID de Wompi, asumimos que está pendiente
            // (el webhook actualizará el estado cuando se confirme)
            setReservation(foundReservation);
            if (foundReservation.status === 'paid') {
              setPaymentStatus('approved');
            } else {
              setPaymentStatus('pending');
              setErrorMessage('Tu pago está pendiente de confirmación. Recibirás una notificación cuando se confirme.');
            }
          } else {
            setPaymentStatus('not_found');
            setErrorMessage('No se encontró la reserva asociada a esta transacción.');
          }
        } else {
          // No hay información suficiente
          setPaymentStatus('error');
          setErrorMessage('No se pudo verificar el estado del pago. Por favor, contacta al hotel.');
        }
      } catch (error) {
        console.error('Error al procesar pago:', error);
        setPaymentStatus('error');
        setErrorMessage('Ocurrió un error al verificar el estado del pago. Por favor, contacta al hotel.');
      }
    };

    processPayment();
  }, [transactionId, reference, wompiPublicKey]);

  // Mostrar diferentes estados según el resultado del pago
  const renderContent = () => {
    if (paymentStatus === 'loading') {
      return (
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="font-body text-muted-foreground">Verificando estado del pago...</p>
        </div>
      );
    }

    if (paymentStatus === 'approved') {
      return (
        <>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full">
            <CheckCircle className="text-green-500" size={48} />
          </div>
          
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
              ¡Pago Exitoso!
            </h1>
            <p className="font-body text-muted-foreground">
              Tu reserva ha sido confirmada
            </p>
          </div>
        </>
      );
    }

    if (paymentStatus === 'pending') {
      return (
        <>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500/10 rounded-full">
            <Clock className="text-yellow-500" size={48} />
          </div>
          
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
              Pago Pendiente
            </h1>
            <p className="font-body text-muted-foreground">
              {errorMessage || 'Tu pago está siendo procesado. Recibirás una notificación cuando se confirme.'}
            </p>
          </div>
        </>
      );
    }

    if (paymentStatus === 'declined') {
      return (
        <>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full">
            <XCircle className="text-red-500" size={48} />
          </div>
          
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
              Pago Rechazado
            </h1>
            <p className="font-body text-muted-foreground">
              {errorMessage || 'El pago no pudo ser procesado. Por favor, intenta nuevamente.'}
            </p>
          </div>
        </>
      );
    }

    // Error o not_found
    return (
      <>
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/10 rounded-full">
          <AlertCircle className="text-red-500" size={48} />
        </div>
        
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
            {paymentStatus === 'not_found' ? 'Reserva No Encontrada' : 'Error al Verificar Pago'}
          </h1>
          <p className="font-body text-muted-foreground">
            {errorMessage || 'No se pudo verificar el estado del pago. Por favor, contacta al hotel.'}
          </p>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-padding">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-card rounded-xl shadow-elegant p-8 text-center space-y-6">
            {renderContent()}

            {reservation && paymentStatus === 'approved' && (
              <div className="bg-secondary rounded-lg p-6 space-y-4 text-left">
                <h2 className="font-display text-xl text-foreground mb-4">Detalles de tu Reserva</h2>
                <div className="space-y-2 font-body">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cliente:</span>
                    <span className="text-foreground font-medium">{reservation.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Habitación:</span>
                    <span className="text-foreground font-medium">{reservation.roomName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha de entrada:</span>
                    <span className="text-foreground font-medium">
                      {new Date(reservation.checkIn).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fecha de salida:</span>
                    <span className="text-foreground font-medium">
                      {new Date(reservation.checkOut).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-foreground font-semibold">Total pagado:</span>
                    <span className="text-primary font-display text-lg">
                      COP ${reservation.total.toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => navigate('/')}
                className="btn-gold rounded-lg px-6 py-3 font-body"
              >
                <Home className="inline mr-2" size={18} />
                Volver al Inicio
              </button>
              {paymentStatus === 'approved' && reservation && (
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 rounded-lg border border-input bg-background hover:bg-secondary transition-colors font-body"
                >
                  <Calendar className="inline mr-2" size={18} />
                  Imprimir Reserva
                </button>
              )}
              {(paymentStatus === 'declined' || paymentStatus === 'error') && (
                <button
                  onClick={() => navigate('/checkout')}
                  className="px-6 py-3 rounded-lg border border-input bg-background hover:bg-secondary transition-colors font-body"
                >
                  Intentar Nuevamente
                </button>
              )}
            </div>

            {paymentStatus === 'approved' && reservation && (
              <p className="font-body text-sm text-muted-foreground pt-4">
                Recibirás un correo de confirmación en {reservation.customerEmail}
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;

