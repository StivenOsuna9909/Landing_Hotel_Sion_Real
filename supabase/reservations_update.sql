-- Actualizar tabla de reservas para agregar campos de niños, menores y extranjeros
-- Ejecuta este SQL en el SQL Editor de Supabase

-- Agregar columna de niños
ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS children INTEGER DEFAULT 0 CHECK (children >= 0);

-- Agregar columna para información de menores (JSON)
ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS minors_info JSONB;

-- Agregar columna para información de extranjeros (JSON)
ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS foreigners_info JSONB;

-- Comentarios
COMMENT ON COLUMN public.reservations.children IS 'Número de niños en la reserva';
COMMENT ON COLUMN public.reservations.minors_info IS 'Información de menores de edad: [{"name": "...", "identityCard": "..."}]';
COMMENT ON COLUMN public.reservations.foreigners_info IS 'Información de extranjeros: [{"name": "...", "foreignerId": "..."}]';

