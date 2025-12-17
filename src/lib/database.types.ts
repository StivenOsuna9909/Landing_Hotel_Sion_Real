export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      reservations: {
        Row: {
          id: string
          check_in: string
          check_out: string
          guests: number
          room_type: string
          room_name: string
          nights: number
          price_per_night: number
          total: number
          customer_email: string
          customer_name: string
          customer_phone: string
          customer_legal_id: string | null
          payment_method: 'PSE' | 'NEQUI' | 'WHATSAPP'
          status: 'pending' | 'confirmed' | 'paid' | 'cancelled'
          transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          check_in: string
          check_out: string
          guests: number
          room_type: string
          room_name: string
          nights: number
          price_per_night: number
          total: number
          customer_email: string
          customer_name: string
          customer_phone: string
          customer_legal_id?: string | null
          payment_method: 'PSE' | 'NEQUI' | 'WHATSAPP'
          status?: 'pending' | 'confirmed' | 'paid' | 'cancelled'
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          check_in?: string
          check_out?: string
          guests?: number
          room_type?: string
          room_name?: string
          nights?: number
          price_per_night?: number
          total?: number
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          customer_legal_id?: string | null
          payment_method?: 'PSE' | 'NEQUI' | 'WHATSAPP'
          status?: 'pending' | 'confirmed' | 'paid' | 'cancelled'
          transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

