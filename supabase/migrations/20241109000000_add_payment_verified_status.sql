-- Add 'payment_verified' status to the orders table status check constraint
-- First, drop the existing constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add the new constraint with 'payment_verified' status included
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('pending', 'payment_verified', 'processing', 'shipped', 'completed', 'cancelled'));
