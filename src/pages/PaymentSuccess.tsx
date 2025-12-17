import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Calendar, Loader2 } from 'lucide-react';
import Header from '@/components/hotel/Header';
import Footer from '@/components/hotel/Footer';
import { getReservationByTransactionId, updateReservationStatus, Reservation } from '@/services/reservations';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const reference = searchParams.get('reference');
  const status = searchParams.get('status');

  useEffect(() => {
    const processPayment = async () => {
      if (reference && status === 'APPROVED') {
        try {
          // Buscar la reserva por referencia de transacción
          const foundReservation = await getReservationByTransactionId(reference);
          
          if (foundReservation) {
            // Actualizar estado a pagado
            await updateReservationStatus(foundReservation.id, 'paid');
            setReservation({ ...foundReservation, status: 'paid' });
          }
        } catch (error) {
          console.error('Error al procesar pago:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    processPayment();
  }, [reference, status]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="font-body text-muted-foreground">Procesando pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-padding">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-card rounded-xl shadow-elegant p-8 text-center space-y-6">
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

            {reservation && (
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
              <button
                onClick={() => window.print()}
                className="px-6 py-3 rounded-lg border border-input bg-background hover:bg-secondary transition-colors font-body"
              >
                <Calendar className="inline mr-2" size={18} />
                Imprimir Reserva
              </button>
            </div>

            <p className="font-body text-sm text-muted-foreground pt-4">
              Recibirás un correo de confirmación en {reservation?.customerEmail || 'tu email'}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;

