-- Add stripe_coupon_id column to discount_codes table to store Stripe coupon reference
ALTER TABLE discount_codes ADD COLUMN IF NOT EXISTS stripe_coupon_id TEXT;

-- Add comment to the new column
COMMENT ON COLUMN discount_codes.stripe_coupon_id IS 'Stripe coupon ID for syncing with Stripe payment system';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_discount_codes_stripe_coupon_id ON discount_codes(stripe_coupon_id);
