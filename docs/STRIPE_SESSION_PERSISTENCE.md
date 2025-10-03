# Stripe Session ID Persistence Implementation

## Overview
This document describes the implementation of persistent Stripe session ID storage for enabling Stripe Customer Portal access from order confirmation pages, even after the user returns later.

## Problem Solved
Previously, the Stripe Customer Portal integration relied on localStorage (`last_checkout_session_key`), which only worked immediately after purchase. If a user navigated away and returned to the confirmation page later, they couldn't access the Customer Portal to manage their subscription.

## Solution
We now persist the Stripe Checkout Session ID in the database alongside each order, enabling reliable Customer Portal access at any time.

---

## Changes Made

### 1. Database Migration
**File:** `supabase/migrations/20250128_add_stripe_session_id.sql`

Added a new column to the `orders` table:
- Column name: `stripe_session_id`
- Type: `TEXT` (nullable)
- Indexed for faster lookups
- Stores the Stripe Checkout Session ID associated with each order

```sql
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id 
ON public.orders(stripe_session_id);
```

### 2. Database Types Update
**File:** `src/types/database.ts`

Updated the TypeScript types for the `orders` table to include the new field:
- Added `stripe_session_id: string | null` to `Row`, `Insert`, and `Update` types

### 3. Order Model Update
**File:** `src/models/database.ts`

#### Order Interface
Added `stripeSessionId` field to the `Order` interface:
```typescript
export interface Order {
  // ... existing fields
  stripeSessionId?: string | null;
  // ... remaining fields
}
```

#### Converter Functions
Updated both converter functions to handle the new field:

**`convertOrderRowToOrder`:**
```typescript
return {
  // ... existing mappings
  stripeSessionId: row.stripe_session_id,
  // ... remaining mappings
};
```

**`convertOrderToOrderInsert`:**
```typescript
return {
  // ... existing mappings
  stripe_session_id: order.stripeSessionId,
  // ... remaining mappings
};
```

### 4. Payment Success Page
**File:** `src/app/payment/success/page.tsx`

The page already passes `stripeSessionId: sessionId` when creating orders. No changes needed - this now properly saves to the database thanks to the model updates.

### 5. Stripe Customer Portal API
**File:** `src/app/api/stripe/create-portal-session/route.ts`

**Complete refactor** to use database lookup instead of localStorage:

**Before:**
- Accepted `sessionId` from request body (from localStorage)
- Required recent purchase session in localStorage

**After:**
- Accepts `orderId` from request body
- Fetches `stripe_session_id` from database using the order ID
- Creates Customer Portal session using the persisted session ID

**Key Changes:**
```typescript
// Now accepts orderId instead of sessionId
const { orderId, returnUrl } = body;

// Fetch stripe_session_id from database
const { data: orderData } = await supabase
  .from('orders')
  .select('stripe_session_id')
  .eq('id', orderId)
  .single();

// Use persisted session ID
const checkoutSession = await stripe.checkout.sessions.retrieve(
  orderData.stripe_session_id
);
```

### 6. Confirmation Page
**File:** `src/app/confirmation/page.tsx`

**Simplified** the `openStripeCustomerPortal` function:

**Before:**
- Checked localStorage for `last_checkout_session_key`
- Fell back to mailto link if no localStorage entry
- Cleared localStorage after use

**After:**
- Uses the `orderId` from URL params
- Sends `orderId` to the API endpoint
- No localStorage dependency
- Cleaner error handling

**Key Changes:**
```typescript
const openStripeCustomerPortal = async () => {
  // ... validation checks
  
  const response = await fetch('/api/stripe/create-portal-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: orderId,  // Changed from sessionId
      returnUrl: `${window.location.origin}/confirmation?orderId=${orderId}`,
    }),
  });
  
  // ... handle response
};
```

---

## Migration Applied

The database migration was successfully applied using:
```bash
sudo npx supabase db reset
```

This command:
1. Reset the local Supabase database
2. Applied all migrations in order, including the new `20250128_add_stripe_session_id.sql`
3. Reseeded the database with initial data

---

## Benefits

### 1. **Persistent Access**
Users can return to their order confirmation page anytime and access the Stripe Customer Portal, not just immediately after purchase.

### 2. **Reliable Data Source**
Database storage is more reliable than localStorage, which can be cleared by users or browsers.

### 3. **Better User Experience**
- No need to contact support for subscription management
- Direct access to Stripe's Customer Portal for:
  - Viewing subscription details
  - Updating payment methods
  - Canceling subscriptions
  - Viewing invoices

### 4. **Simpler Implementation**
Removed localStorage fallback logic and complex error handling, making the code more maintainable.

---

## Data Flow

### Order Creation Flow
1. User completes checkout on Stripe
2. Payment success page receives `session_id` from Stripe
3. Order is created with `stripeSessionId: session_id`
4. Database stores the session ID in `orders.stripe_session_id`

### Customer Portal Access Flow
1. User clicks "Manage Subscription" on confirmation page
2. Frontend sends `orderId` to `/api/stripe/create-portal-session`
3. API fetches `stripe_session_id` from database using order ID
4. API retrieves Stripe Checkout Session using session ID
5. API creates Customer Portal session with customer ID
6. User is redirected to Stripe Customer Portal

---

## Testing Checklist

- [ ] Create a new subscription order
- [ ] Verify `stripe_session_id` is saved in the database
- [ ] Click "Manage Subscription" on confirmation page immediately after purchase
- [ ] Verify successful redirect to Stripe Customer Portal
- [ ] Navigate away from confirmation page
- [ ] Return to confirmation page using the order ID in URL
- [ ] Click "Manage Subscription" again
- [ ] Verify it still works (this was broken before)
- [ ] Test with different subscription types (3-months, 6-months)
- [ ] Test with one-time purchase (button should be hidden)

---

## Production Considerations

### 1. Stripe Customer Portal Configuration
Ensure the Stripe Customer Portal is properly configured in your Stripe Dashboard:
- Enable subscription management features
- Configure business information
- Set up allowed actions (cancel, update payment method, etc.)
- Configure return URLs

### 2. Environment Variables
Ensure these are set in production:
- `NEXT_PUBLIC_APP_URL` - Your production domain
- `STRIPE_SECRET_KEY` - Production Stripe secret key

### 3. Security
- The `stripe_session_id` is treated as sensitive data
- Only authenticated admin users should be able to view it directly
- The API endpoint validates order existence before creating portal sessions

### 4. Database Backups
The `stripe_session_id` field should be included in database backups to maintain Customer Portal access for historical orders.

---

## Future Enhancements

### 1. Direct Customer ID Storage
Consider storing the Stripe Customer ID directly in the orders table:
```sql
ALTER TABLE orders ADD COLUMN stripe_customer_id TEXT;
```
This would eliminate the need to retrieve the checkout session first.

### 2. Session Expiration Handling
Stripe Checkout Sessions expire after 24 hours. Consider adding:
- Timestamp for when the session was created
- Fallback to customer ID lookup if session is expired
- Error handling for expired sessions

### 3. Subscription Status Sync
Add a webhook handler to sync subscription status from Stripe to the database:
- Update order status when subscription is canceled
- Store subscription ID for direct subscription management
- Track subscription renewal dates

---

## Related Files

### Modified Files
1. `supabase/migrations/20250128_add_stripe_session_id.sql` (new)
2. `src/types/database.ts`
3. `src/models/database.ts`
4. `src/app/api/stripe/create-portal-session/route.ts`
5. `src/app/confirmation/page.tsx`

### Referenced Files
- `src/app/payment/success/page.tsx` (no changes needed)
- `src/app/api/orders/route.ts` (already handles the field)
- `src/lib/stripe.ts` (Stripe client configuration)

---

## Rollback Instructions

If you need to rollback this change:

1. **Remove the database column:**
```sql
ALTER TABLE public.orders DROP COLUMN IF EXISTS stripe_session_id;
DROP INDEX IF EXISTS idx_orders_stripe_session_id;
```

2. **Revert code changes:**
```bash
git revert <commit-hash>
```

3. **Redeploy the application**

Note: This will break Customer Portal access for all existing orders with stored session IDs.

---

## Date Implemented
January 28, 2025

## Developer Notes
- All TypeScript types are properly synchronized
- Build completes successfully with no errors
- ESLint and type checking pass
- Database migration tested on local Supabase instance
