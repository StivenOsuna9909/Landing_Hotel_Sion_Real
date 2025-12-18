-- Tabla para almacenar PQRS (Peticiones, Quejas, Reclamos y Sugerencias)
CREATE TABLE IF NOT EXISTS public.pqrs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('peticion', 'queja', 'reclamo', 'sugerencia')),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar las consultas
CREATE INDEX IF NOT EXISTS idx_pqrs_status ON public.pqrs(status);
CREATE INDEX IF NOT EXISTS idx_pqrs_created_at ON public.pqrs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pqrs_email ON public.pqrs(email);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_pqrs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_pqrs_updated_at
  BEFORE UPDATE ON public.pqrs
  FOR EACH ROW
  EXECUTE FUNCTION update_pqrs_updated_at();

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.pqrs ENABLE ROW LEVEL SECURITY;

-- Política: Cualquiera puede insertar PQRS
CREATE POLICY "Anyone can insert PQRS"
  ON public.pqrs
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política: Solo usuarios autenticados pueden leer PQRS (para administradores)
-- Nota: Debes crear una función o política más específica según tu sistema de autenticación
CREATE POLICY "Authenticated users can read PQRS"
  ON public.pqrs
  FOR SELECT
  TO authenticated
  USING (true);

-- Comentarios en la tabla
COMMENT ON TABLE public.pqrs IS 'Tabla para almacenar Peticiones, Quejas, Reclamos y Sugerencias de los usuarios';
COMMENT ON COLUMN public.pqrs.type IS 'Tipo de PQRS: peticion, queja, reclamo, sugerencia';
COMMENT ON COLUMN public.pqrs.status IS 'Estado del PQRS: pending, in_progress, resolved, closed';

