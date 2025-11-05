-- Add is_recurring and usage_count columns to discount_codes table
ALTER TABLE discount_codes ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT true;
ALTER TABLE discount_codes ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;

-- Add comments to new columns
COMMENT ON COLUMN discount_codes.is_recurring IS 'Whether the discount code can be used multiple times (true) or only once (false)';
COMMENT ON COLUMN discount_codes.usage_count IS 'Number of times this discount code has been used';

-- Create index for faster lookups of recurring codes
CREATE INDEX IF NOT EXISTS idx_discount_codes_recurring ON discount_codes(is_recurring);
