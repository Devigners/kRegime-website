-- Add subscription type to orders table
ALTER TABLE orders 
ADD COLUMN subscription_type TEXT CHECK (subscription_type IN ('one-time', '3-months', '6-months')) DEFAULT 'one-time';

-- Add comment for documentation
COMMENT ON COLUMN orders.subscription_type IS 'The subscription type selected by the customer: one-time, 3-months, or 6-months';