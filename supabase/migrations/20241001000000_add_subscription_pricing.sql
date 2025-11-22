-- Add subscription pricing to regimes table
-- This migration adds one-time, 3-month subscription, and 6-month subscription pricing fields

-- Add subscription pricing columns to regimes table
ALTER TABLE regimes 
ADD COLUMN IF NOT EXISTS price_one_time INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_3_months INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS price_6_months INTEGER NOT NULL DEFAULT 0;

-- Update existing records to use current price as one-time price
UPDATE regimes 
SET 
  price_one_time = price,
  price_3_months = price - 30, -- Default to 30 AED less for 3-month subscription
  price_6_months = price - 50  -- Default to 50 AED less for 6-month subscription
WHERE price_one_time = 0;

-- Drop the old price column (we'll keep it for backward compatibility during transition)
-- ALTER TABLE regimes DROP COLUMN price;

-- Add check constraints to ensure pricing makes sense
ALTER TABLE regimes ADD CONSTRAINT check_pricing_positive CHECK (
  price_one_time > 0 AND 
  price_3_months > 0 AND 
  price_6_months > 0
);

ALTER TABLE regimes ADD CONSTRAINT check_subscription_pricing CHECK (
  price_6_months <= price_3_months AND 
  price_3_months <= price_one_time
);

-- Create index for pricing queries
CREATE INDEX IF NOT EXISTS idx_regimes_pricing ON regimes(price_one_time, price_3_months, price_6_months);

-- Update the regimes table with the specific pricing requested
UPDATE regimes SET 
  price_one_time = 359,
  price_3_months = 319,
  price_6_months = 299
WHERE id = 'tribox';

UPDATE regimes SET 
  price_one_time = 549,
  price_3_months = 519,
  price_6_months = 499
WHERE id = 'pentabox';

UPDATE regimes SET 
  price_one_time = 749,
  price_3_months = 719,
  price_6_months = 699
WHERE id = 'septabox';