-- Add tracking_number column to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS tracking_number TEXT;

-- Add comment to the column
COMMENT ON COLUMN orders.tracking_number IS 'Shipping tracking number for the order';
