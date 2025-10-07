-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL CHECK (source IN ('footer', 'coming_soon', 'checkout', 'manual')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_source ON subscribers(source);
CREATE INDEX IF NOT EXISTS idx_subscribers_is_active ON subscribers(is_active);

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_subscribers_updated_at BEFORE UPDATE ON subscribers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for admin operations
CREATE POLICY "Allow all access to subscribers" ON subscribers
    FOR ALL USING (true);