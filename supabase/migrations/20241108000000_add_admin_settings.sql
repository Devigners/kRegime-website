-- Create admin_settings table
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_holder_name TEXT,
  bank_name TEXT,
  account_number TEXT,
  iban TEXT,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add comment to table
COMMENT ON TABLE public.admin_settings IS 'Stores admin settings including bank account information and security settings';

-- Create index on updated_at for faster queries
CREATE INDEX IF NOT EXISTS admin_settings_updated_at_idx ON public.admin_settings(updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is admin-only and protected by API auth)
CREATE POLICY "Allow all operations on admin_settings" ON public.admin_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Insert a default row if none exists
INSERT INTO public.admin_settings (id)
SELECT gen_random_uuid()
WHERE NOT EXISTS (SELECT 1 FROM public.admin_settings LIMIT 1);
