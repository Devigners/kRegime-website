-- Add stripe_session_id column to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Add index for faster lookups by stripe_session_id
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id 
ON public.orders(stripe_session_id);

-- Add comment to document the column
COMMENT ON COLUMN public.orders.stripe_session_id IS 'Stripe Checkout Session ID for accessing Customer Portal';
