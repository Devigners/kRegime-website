-- Add stripe_coupon_id columns for each subscription type discount
ALTER TABLE regimes
ADD COLUMN stripe_coupon_id_one_time TEXT NULL,
ADD COLUMN stripe_coupon_id_3_months TEXT NULL,
ADD COLUMN stripe_coupon_id_6_months TEXT NULL;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_regimes_stripe_coupon_id_one_time ON regimes(stripe_coupon_id_one_time);
CREATE INDEX IF NOT EXISTS idx_regimes_stripe_coupon_id_3_months ON regimes(stripe_coupon_id_3_months);
CREATE INDEX IF NOT EXISTS idx_regimes_stripe_coupon_id_6_months ON regimes(stripe_coupon_id_6_months);

-- Add comments
COMMENT ON COLUMN regimes.stripe_coupon_id_one_time IS 'Stripe coupon ID for one-time purchase discount';
COMMENT ON COLUMN regimes.stripe_coupon_id_3_months IS 'Stripe coupon ID for 3-month subscription discount';
COMMENT ON COLUMN regimes.stripe_coupon_id_6_months IS 'Stripe coupon ID for 6-month subscription discount';
