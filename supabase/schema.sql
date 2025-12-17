-- Tabla de reservas para Hotel Sion Real
-- Ejecuta este SQL en el SQL Editor de Supabase

-- Crear la tabla de reservas
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INTEGER NOT NULL CHECK (guests > 0),
  room_type TEXT NOT NULL,
  room_name TEXT NOT NULL,
  nights INTEGER NOT NULL CHECK (nights > 0),
  price_per_night INTEGER NOT NULL CHECK (price_per_night >= 0),
  total INTEGER NOT NULL CHECK (total >= 0),
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_legal_id TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('PSE', 'NEQUI', 'WHATSAPP')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'paid', 'cancelled')),
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_reservations_check_in ON public.reservations(check_in);
CREATE INDEX IF NOT EXISTS idx_reservations_check_out ON public.reservations(check_out);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_customer_email ON public.reservations(customer_email);
CREATE INDEX IF NOT EXISTS idx_reservations_transaction_id ON public.reservations(transaction_id);
CREATE INDEX IF NOT EXISTS idx_reservations_created_at ON public.reservations(created_at DESC);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar updated_at
CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON public.reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Política: Permitir lectura pública (para el dashboard del admin)
-- En producción, deberías restringir esto y usar autenticación
CREATE POLICY "Allow public read access" ON public.reservations
  FOR SELECT
  USING (true);

-- Política: Permitir inserción pública (para que los clientes puedan crear reservas)
CREATE POLICY "Allow public insert" ON public.reservations
  FOR INSERT
  WITH CHECK (true);

-- Política: Permitir actualización pública (para actualizar estados de pago)
-- En producción, deberías restringir esto más
CREATE POLICY "Allow public update" ON public.reservations
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Comentarios en la tabla
COMMENT ON TABLE public.reservations IS 'Tabla de reservas del Hotel Sion Real';
COMMENT ON COLUMN public.reservations.status IS 'Estado de la reserva: pending, confirmed, paid, cancelled';
COMMENT ON COLUMN public.reservations.payment_method IS 'Método de pago: PSE, NEQUI, WHATSAPP';

