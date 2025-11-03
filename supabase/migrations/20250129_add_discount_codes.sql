-- Create discount_codes table
CREATE TABLE IF NOT EXISTS discount_codes (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  percentage_off INTEGER NOT NULL CHECK (percentage_off > 0 AND percentage_off <= 100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add discount_code_id column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_code_id TEXT REFERENCES discount_codes(id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_discount_code ON orders(discount_code_id);

-- Add comment to columns
COMMENT ON COLUMN discount_codes.code IS 'Unique discount code (e.g., EIDSALE25)';
COMMENT ON COLUMN discount_codes.percentage_off IS 'Percentage discount to apply (1-100)';
COMMENT ON COLUMN discount_codes.is_active IS 'Whether the discount code is currently active and can be used';
COMMENT ON COLUMN orders.discount_code_id IS 'Reference to discount code used for this order (if any)';
