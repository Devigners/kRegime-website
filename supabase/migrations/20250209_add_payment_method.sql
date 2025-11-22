-- Add payment_method and bank_reference_id columns to orders table
ALTER TABLE orders
ADD COLUMN payment_method VARCHAR(20) DEFAULT 'stripe' CHECK (payment_method IN ('stripe', 'bank_transfer')),
ADD COLUMN bank_reference_id VARCHAR(8);

-- Create index for bank_reference_id for faster lookups
CREATE INDEX idx_orders_bank_reference_id ON orders(bank_reference_id);

-- Add comment to explain the columns
COMMENT ON COLUMN orders.payment_method IS 'Payment method used: stripe (card/apple pay/google pay) or bank_transfer';
COMMENT ON COLUMN orders.bank_reference_id IS 'Unique 8-digit reference ID for bank transfer payments';
