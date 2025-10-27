-- Add discount fields to regimes table
ALTER TABLE regimes
ADD COLUMN discount_one_time DECIMAL(5,2) DEFAULT 0 CHECK (discount_one_time >= 0 AND discount_one_time <= 100),
ADD COLUMN discount_3_months DECIMAL(5,2) DEFAULT 0 CHECK (discount_3_months >= 0 AND discount_3_months <= 100),
ADD COLUMN discount_6_months DECIMAL(5,2) DEFAULT 0 CHECK (discount_6_months >= 0 AND discount_6_months <= 100),
ADD COLUMN discount_reason_one_time TEXT DEFAULT NULL,
ADD COLUMN discount_reason_3_months TEXT DEFAULT NULL,
ADD COLUMN discount_reason_6_months TEXT DEFAULT NULL;

-- Add comments for documentation
COMMENT ON COLUMN regimes.discount_one_time IS 'Discount percentage for one-time purchase (0-100)';
COMMENT ON COLUMN regimes.discount_3_months IS 'Discount percentage for 3-month subscription (0-100)';
COMMENT ON COLUMN regimes.discount_6_months IS 'Discount percentage for 6-month subscription (0-100)';
COMMENT ON COLUMN regimes.discount_reason_one_time IS 'Reason for one-time purchase discount (e.g., "Eid Sale")';
COMMENT ON COLUMN regimes.discount_reason_3_months IS 'Reason for 3-month subscription discount (e.g., "Limited Offer")';
COMMENT ON COLUMN regimes.discount_reason_6_months IS 'Reason for 6-month subscription discount (e.g., "Summer Special")';
