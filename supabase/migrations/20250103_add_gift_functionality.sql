-- Add gift-related columns to orders table
ALTER TABLE orders
ADD COLUMN is_gift BOOLEAN DEFAULT FALSE,
ADD COLUMN gift_giver_name TEXT,
ADD COLUMN gift_giver_email TEXT,
ADD COLUMN gift_giver_phone TEXT,
ADD COLUMN gift_token TEXT UNIQUE,
ADD COLUMN gift_claimed BOOLEAN DEFAULT FALSE,
ADD COLUMN gift_claimed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN gift_recipient_name TEXT,
ADD COLUMN gift_recipient_email TEXT;

-- Create index on gift_token for faster lookups
CREATE INDEX idx_orders_gift_token ON orders(gift_token) WHERE gift_token IS NOT NULL;

-- Create index on is_gift for filtering gift orders
CREATE INDEX idx_orders_is_gift ON orders(is_gift) WHERE is_gift = TRUE;

-- Add comment to explain the gift flow
COMMENT ON COLUMN orders.is_gift IS 'Indicates if this order is a gift. Gift orders have a two-step process: 1) Giver pays, 2) Recipient fills form and provides shipping address';
COMMENT ON COLUMN orders.gift_token IS 'Unique token used to claim the gift. Generated when gift order is created';
COMMENT ON COLUMN orders.gift_claimed IS 'Indicates if the gift has been claimed by the recipient';
COMMENT ON COLUMN orders.gift_claimed_at IS 'Timestamp when the gift was claimed by the recipient';
