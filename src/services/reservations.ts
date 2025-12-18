/**
 * Servicio para manejar reservas usando Supabase
 */

import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/database.types';

type ReservationRow = Database['public']['Tables']['reservations']['Row'];
type ReservationInsert = Database['public']['Tables']['reservations']['Insert'];
type ReservationUpdate = Database['public']['Tables']['reservations']['Update'];

export interface MinorInfo {
  name: string;
  identityCard: string;
}

export interface ForeignerInfo {
  name: string;
  foreignerId: string;
}

export interface Reservation {
  id: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  children: number;
  roomType: string;
  roomName: string;
  nights: number;
  pricePerNight: number;
  total: number;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerLegalId?: string;
  minorsInfo?: MinorInfo[];
  foreignersInfo?: ForeignerInfo[];
  paymentMethod: 'PSE' | 'NEQUI' | 'WHATSAPP';
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  createdAt: string;
  transactionId?: string;
}

/**
 * Convierte una fila de la base de datos a la interfaz Reservation
 */
function mapRowToReservation(row: ReservationRow): Reservation {
  return {
    id: row.id,
    checkIn: row.check_in,
    checkOut: row.check_out,
    guests: row.guests,
    children: (row as any).children || 0,
    roomType: row.room_type,
    roomName: row.room_name,
    nights: row.nights,
    pricePerNight: row.price_per_night,
    total: row.total,
    customerEmail: row.customer_email,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerLegalId: row.customer_legal_id || undefined,
    minorsInfo: (row as any).minors_info ? JSON.parse((row as any).minors_info) : undefined,
    foreignersInfo: (row as any).foreigners_info ? JSON.parse((row as any).foreigners_info) : undefined,
    paymentMethod: row.payment_method,
    status: row.status,
    createdAt: row.created_at,
    transactionId: row.transaction_id || undefined,
  };
}

/**
 * Convierte una Reservation a formato de inserción en la base de datos
 */
function mapReservationToInsert(reservation: Omit<Reservation, 'id' | 'createdAt'>): ReservationInsert {
  return {
    check_in: reservation.checkIn,
    check_out: reservation.checkOut,
    guests: reservation.guests,
    children: (reservation.children || 0) as any,
    room_type: reservation.roomType,
    room_name: reservation.roomName,
    nights: reservation.nights,
    price_per_night: reservation.pricePerNight,
    total: reservation.total,
    customer_email: reservation.customerEmail,
    customer_name: reservation.customerName,
    customer_phone: reservation.customerPhone,
    customer_legal_id: reservation.customerLegalId || null,
    minors_info: reservation.minorsInfo ? JSON.stringify(reservation.minorsInfo) : null,
    foreigners_info: reservation.foreignersInfo ? JSON.stringify(reservation.foreignersInfo) : null,
    payment_method: reservation.paymentMethod,
    status: reservation.status || 'pending',
    transaction_id: reservation.transactionId || null,
  } as any;
}

/**
 * Obtiene todas las reservas
 */
export async function getReservations(): Promise<Reservation[]> {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener reservas:', error);
      throw error;
    }

    return (data || []).map(mapRowToReservation);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    return [];
  }
}

/**
 * Guarda una nueva reserva
 */
export async function saveReservation(
  reservation: Omit<Reservation, 'id' | 'createdAt'>
): Promise<Reservation> {
  try {
    const insertData = mapReservationToInsert(reservation);
    
    const { data, error } = await supabase
      .from('reservations')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error al guardar reserva:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No se recibieron datos al guardar la reserva');
    }

    return mapRowToReservation(data);
  } catch (error) {
    console.error('Error al guardar reserva:', error);
    throw error;
  }
}

/**
 * Actualiza el estado de una reserva
 */
export async function updateReservationStatus(
  id: string,
  status: Reservation['status']
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error al actualizar estado de reserva:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error al actualizar estado de reserva:', error);
    return false;
  }
}

/**
 * Obtiene reservas por rango de fechas
 */
export async function getReservationsByDateRange(
  startDate: string,
  endDate: string
): Promise<Reservation[]> {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .lte('check_in', endDate)
      .gte('check_out', startDate)
      .order('check_in', { ascending: true });

    if (error) {
      console.error('Error al obtener reservas por rango:', error);
      return [];
    }

    return (data || []).map(mapRowToReservation);
  } catch (error) {
    console.error('Error al obtener reservas por rango:', error);
    return [];
  }
}

/**
 * Obtiene reservas confirmadas/pagadas
 */
export async function getConfirmedReservations(): Promise<Reservation[]> {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .in('status', ['confirmed', 'paid'])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener reservas confirmadas:', error);
      return [];
    }

    return (data || []).map(mapRowToReservation);
  } catch (error) {
    console.error('Error al obtener reservas confirmadas:', error);
    return [];
  }
}

/**
 * Verifica disponibilidad para un rango de fechas
 */
export async function checkAvailability(checkIn: string, checkOut: string): Promise<boolean> {
  try {
    // Buscar reservas confirmadas o pagadas que se solapen con el período
    const { data, error } = await supabase
      .from('reservations')
      .select('id')
      .in('status', ['confirmed', 'paid'])
      .lte('check_in', checkOut)
      .gte('check_out', checkIn)
      .limit(1);

    if (error) {
      console.error('Error al verificar disponibilidad:', error);
      return false;
    }

    // Si hay al menos una reserva, no hay disponibilidad
    return (data || []).length === 0;
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    return false;
  }
}

/**
 * Obtiene estadísticas de reservas
 */
export async function getReservationStats() {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('status, total');

    if (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        total: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        totalRevenue: 0,
      };
    }

    const reservations = data || [];
    const confirmed = reservations.filter(r => r.status === 'confirmed' || r.status === 'paid');
    const pending = reservations.filter(r => r.status === 'pending');
    const cancelled = reservations.filter(r => r.status === 'cancelled');
    
    const totalRevenue = confirmed.reduce((sum, r) => sum + (r.total || 0), 0);

    return {
      total: reservations.length,
      confirmed: confirmed.length,
      pending: pending.length,
      cancelled: cancelled.length,
      totalRevenue,
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      total: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      totalRevenue: 0,
    };
  }
}

/**
 * Obtiene una reserva por ID
 */
export async function getReservationById(id: string): Promise<Reservation | null> {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error al obtener reserva:', error);
      return null;
    }

    if (!data) return null;

    return mapRowToReservation(data);
  } catch (error) {
    console.error('Error al obtener reserva:', error);
    return null;
  }
}

/**
 * Obtiene una reserva por transaction_id
 */
export async function getReservationByTransactionId(
  transactionId: string
): Promise<Reservation | null> {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();

    if (error) {
      console.error('Error al obtener reserva por transaction_id:', error);
      return null;
    }

    if (!data) return null;

    return mapRowToReservation(data);
  } catch (error) {
    console.error('Error al obtener reserva por transaction_id:', error);
    return null;
  }
}
