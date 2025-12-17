// Supabase Edge Function para recibir webhooks de Wompi
// Esta función se ejecuta cuando Wompi notifica sobre el estado de un pago

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WompiWebhookData {
  event: string;
  data: {
    transaction: {
      id: string;
      status: string;
      reference: string;
      amount_in_cents: number;
      currency: string;
      payment_method_type: string;
      created_at: string;
      finalized_at?: string;
    };
  };
}

serve(async (req) => {
  // Manejar CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Obtener las credenciales de Supabase desde las variables de entorno
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parsear el body del webhook
    const webhookData: WompiWebhookData = await req.json();

    console.log("Webhook recibido de Wompi:", JSON.stringify(webhookData, null, 2));

    // Verificar que sea un evento de transacción
    if (webhookData.event !== "transaction.updated") {
      return new Response(
        JSON.stringify({ message: "Evento no manejado" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    const transaction = webhookData.data.transaction;
    const reference = transaction.reference;
    const status = transaction.status;

    // Mapear el estado de Wompi al estado de nuestra reserva
    let reservationStatus: "pending" | "confirmed" | "paid" | "cancelled" = "pending";

    switch (status) {
      case "APPROVED":
        reservationStatus = "paid";
        break;
      case "PENDING":
        reservationStatus = "pending";
        break;
      case "DECLINED":
      case "VOIDED":
        reservationStatus = "cancelled";
        break;
      default:
        reservationStatus = "pending";
    }

    // Buscar la reserva por transaction_id (reference)
    const { data: reservation, error: findError } = await supabase
      .from("reservations")
      .select("id, status")
      .eq("transaction_id", reference)
      .single();

    if (findError || !reservation) {
      console.error("Reserva no encontrada:", findError);
      return new Response(
        JSON.stringify({ 
          message: "Reserva no encontrada",
          error: findError?.message 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Actualizar el estado de la reserva
    const { error: updateError } = await supabase
      .from("reservations")
      .update({ 
        status: reservationStatus,
        updated_at: new Date().toISOString()
      })
      .eq("id", reservation.id);

    if (updateError) {
      console.error("Error al actualizar reserva:", updateError);
      return new Response(
        JSON.stringify({ 
          message: "Error al actualizar reserva",
          error: updateError.message 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    console.log(`Reserva ${reservation.id} actualizada a estado: ${reservationStatus}`);

    return new Response(
      JSON.stringify({ 
        message: "Webhook procesado correctamente",
        reservationId: reservation.id,
        newStatus: reservationStatus
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error procesando webhook:", error);
    return new Response(
      JSON.stringify({ 
        message: "Error procesando webhook",
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

