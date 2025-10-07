-- Supabase SQL Schema for kRegime Website
-- Initial migration to create the database tables

-- Create regimes table
CREATE TABLE IF NOT EXISTS regimes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER NOT NULL,
  steps TEXT[] NOT NULL,
  image TEXT NOT NULL,
  step_count INTEGER NOT NULL CHECK (step_count IN (3, 5, 7)),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  regime_id TEXT NOT NULL,
  user_details JSONB NOT NULL,
  contact_info JSONB NOT NULL,
  shipping_address JSONB NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount INTEGER NOT NULL,
  final_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  avatar TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_regimes_is_active ON regimes(is_active);
CREATE INDEX IF NOT EXISTS idx_regimes_step_count ON regimes(step_count);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_reviews_is_approved ON reviews(is_approved);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at timestamp
DROP TRIGGER IF EXISTS update_regimes_updated_at ON regimes;
CREATE TRIGGER update_regimes_updated_at BEFORE UPDATE ON regimes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE regimes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
DROP POLICY IF EXISTS "Allow public read access to active regimes" ON regimes;
CREATE POLICY "Allow public read access to active regimes" ON regimes
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Allow public read access to approved reviews" ON reviews;
CREATE POLICY "Allow public read access to approved reviews" ON reviews
    FOR SELECT USING (is_approved = true);

-- Create policies for orders (you can modify these based on your auth requirements)
DROP POLICY IF EXISTS "Allow all access to orders" ON orders;
CREATE POLICY "Allow all access to orders" ON orders
    FOR ALL USING (true);

-- Create policies for admin operations (you can modify these based on your auth requirements)
DROP POLICY IF EXISTS "Allow all access to regimes" ON regimes;
CREATE POLICY "Allow all access to regimes" ON regimes
    FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all access to reviews" ON reviews;
CREATE POLICY "Allow all access to reviews" ON reviews
    FOR ALL USING (true);

-- Note: In production, you should implement proper authentication and authorization
-- These policies are permissive for development purposes.