/**
 * Servicio para manejar PQRS (Peticiones, Quejas, Reclamos y Sugerencias)
 */

import { supabase } from '@/lib/supabase';

export interface PQRS {
  type: 'peticion' | 'queja' | 'reclamo' | 'sugerencia';
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface PQRSRow {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
}

/**
 * Envía un PQRS a la base de datos
 */
export async function submitPQRS(pqrs: PQRS): Promise<PQRSRow> {
  try {
    const { data, error } = await supabase
      .from('pqrs')
      .insert({
        type: pqrs.type,
        name: pqrs.name,
        email: pqrs.email,
        phone: pqrs.phone || null,
        subject: pqrs.subject,
        message: pqrs.message,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Error al guardar PQRS:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No se recibieron datos al guardar el PQRS');
    }

    return data as PQRSRow;
  } catch (error) {
    console.error('Error al guardar PQRS:', error);
    throw error;
  }
}

/**
 * Obtiene todos los PQRS (solo para administradores)
 */
export async function getPQRS(): Promise<PQRSRow[]> {
  try {
    const { data, error } = await supabase
      .from('pqrs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener PQRS:', error);
      throw error;
    }

    return (data || []) as PQRSRow[];
  } catch (error) {
    console.error('Error al obtener PQRS:', error);
    return [];
  }
}

/**
 * Actualiza el estado de un PQRS
 */
export async function updatePQRSStatus(
  id: string,
  status: 'pending' | 'in_progress' | 'resolved' | 'closed'
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('pqrs')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error al actualizar estado de PQRS:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error al actualizar estado de PQRS:', error);
    return false;
  }
}

