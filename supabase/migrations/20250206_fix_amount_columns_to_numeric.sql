-- Change total_amount and final_amount from INTEGER to NUMERIC to support decimal values
-- This is necessary because discount codes can result in prices with decimals (e.g., 314.1 AED)

ALTER TABLE orders 
  ALTER COLUMN total_amount TYPE NUMERIC(10, 2) USING total_amount::NUMERIC(10, 2);

ALTER TABLE orders 
  ALTER COLUMN final_amount TYPE NUMERIC(10, 2) USING final_amount::NUMERIC(10, 2);

-- Add comments
COMMENT ON COLUMN orders.total_amount IS 'Total order amount before discount (supports decimals for accurate pricing)';
COMMENT ON COLUMN orders.final_amount IS 'Final order amount after discount (supports decimals for accurate pricing)';
