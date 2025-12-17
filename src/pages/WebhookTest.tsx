/**
 * Página temporal para probar webhooks de Wompi en desarrollo
 * Esta página solo debe usarse en modo desarrollo/sandbox
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { updateReservationStatus, getReservationByTransactionId } from '@/services/reservations';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import Header from '@/components/hotel/Header';
import Footer from '@/components/hotel/Footer';

const WebhookTest = () => {
  const [searchParams] = useSearchParams();
  const [logs, setLogs] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  // Procesar parámetros de URL (simulando webhook)
  useEffect(() => {
    const reference = searchParams.get('reference');
    const status = searchParams.get('status');

    if (reference && status) {
      processWebhook(reference, status);
    }
  }, [searchParams]);

  const processWebhook = async (reference: string, status: string) => {
    setProcessing(true);
    const timestamp = new Date().toLocaleTimeString();
    
    try {
      addLog(`[${timestamp}] Webhook recibido: ${reference} - Estado: ${status}`);

      // Buscar la reserva
      const reservation = await getReservationByTransactionId(reference);
      
      if (!reservation) {
        addLog(`[${timestamp}] ⚠️ Reserva no encontrada para referencia: ${reference}`);
        setProcessing(false);
        return;
      }

      addLog(`[${timestamp}] ✅ Reserva encontrada: ${reservation.id}`);

      // Mapear estado de Wompi al estado de reserva
      let reservationStatus: 'pending' | 'confirmed' | 'paid' | 'cancelled' = 'pending';
      
      switch (status.toUpperCase()) {
        case 'APPROVED':
          reservationStatus = 'paid';
          break;
        case 'PENDING':
          reservationStatus = 'pending';
          break;
        case 'DECLINED':
        case 'VOIDED':
          reservationStatus = 'cancelled';
          break;
        default:
          reservationStatus = 'pending';
      }

      // Actualizar estado
      const success = await updateReservationStatus(reservation.id, reservationStatus);
      
      if (success) {
        addLog(`[${timestamp}] ✅ Reserva actualizada a: ${reservationStatus}`);
      } else {
        addLog(`[${timestamp}] ❌ Error al actualizar reserva`);
      }
    } catch (error) {
      addLog(`[${timestamp}] ❌ Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setProcessing(false);
    }
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
    console.log(message);
  };

  const simulateWebhook = async () => {
    const reference = prompt('Ingresa la referencia de transacción (transaction_id):');
    const status = prompt('Ingresa el estado (APPROVED, PENDING, DECLINED):');
    
    if (reference && status) {
      await processWebhook(reference, status);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  if (import.meta.env.PROD) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-display mb-2">Acceso Restringido</h1>
          <p className="text-muted-foreground">Esta página solo está disponible en modo desarrollo</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-padding">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-card rounded-xl shadow-elegant p-6 space-y-6">
            <div>
              <h1 className="font-display text-3xl mb-2">Webhook Test - Wompi Sandbox</h1>
              <p className="font-body text-muted-foreground">
                Página de prueba para simular webhooks de Wompi en desarrollo
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="font-body text-sm text-yellow-600 dark:text-yellow-400">
                ⚠️ Esta página solo funciona en modo desarrollo. En producción, usa Supabase Edge Functions.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={simulateWebhook}
                disabled={processing}
                className="btn-gold rounded-lg px-6 py-3 font-body disabled:opacity-50"
              >
                {processing ? 'Procesando...' : 'Simular Webhook'}
              </button>
              <button
                onClick={clearLogs}
                className="px-6 py-3 rounded-lg border border-input bg-background hover:bg-secondary transition-colors font-body"
              >
                Limpiar Logs
              </button>
            </div>

            <div className="bg-secondary rounded-lg p-4">
              <h2 className="font-display text-lg mb-4">Logs de Webhooks</h2>
              <div className="bg-background rounded p-4 max-h-96 overflow-y-auto font-mono text-sm space-y-1">
                {logs.length === 0 ? (
                  <p className="text-muted-foreground">No hay logs aún. Simula un webhook o espera a recibir uno.</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-foreground">
                      {log.includes('✅') && <CheckCircle className="inline w-4 h-4 text-green-500 mr-2" />}
                      {log.includes('❌') && <XCircle className="inline w-4 h-4 text-red-500 mr-2" />}
                      {log.includes('⚠️') && <AlertCircle className="inline w-4 h-4 text-yellow-500 mr-2" />}
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-secondary rounded-lg p-4">
              <h2 className="font-display text-lg mb-4">Cómo usar</h2>
              <div className="space-y-2 font-body text-sm text-muted-foreground">
                <p>1. <strong>Simular webhook manualmente</strong>: Haz clic en "Simular Webhook" e ingresa la referencia y estado</p>
                <p>2. <strong>Desde URL</strong>: Accede a esta página con parámetros: <code className="bg-background px-2 py-1 rounded">/webhook-test?reference=XXX&status=APPROVED</code></p>
                <p>3. <strong>Con ngrok</strong>: Configura ngrok y apunta el webhook de Wompi a: <code className="bg-background px-2 py-1 rounded">https://tu-url.ngrok.io/webhook-test</code></p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WebhookTest;

