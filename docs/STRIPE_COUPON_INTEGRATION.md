# Stripe Coupon Integration - Implementation Summary

## Overview
Implemented automated Stripe coupon synchronization with discount codes, ensuring that discount codes affect actual payment amounts in Stripe checkout.

## Database Changes

### Migration: `20250207_add_stripe_coupon_id.sql`
- Added `stripe_coupon_id` column (TEXT NULL) to `discount_codes` table
- Created index on `stripe_coupon_id` for faster lookups
- **Status**: Created, needs to be pushed with `supabase db push`

## Type Updates

### `src/types/database.ts`
- Added `stripe_coupon_id` to `discount_codes` Row, Insert, and Update types

### `src/models/database.ts`
- Added `stripeCouponId?: string | null` to `DiscountCode` interface
- Updated `convertDiscountCodeRowToDiscountCode` to include `stripeCouponId`
- Updated `convertDiscountCodeToDiscountCodeInsert` to include `stripeCouponId`

### `src/lib/pricing.ts`
- Added `stripeCouponId?: string` to `DiscountCodeInfo` interface

## API Changes

### 1. `src/app/api/discount-codes/route.ts` (POST - Create)
**What it does**: When admin creates a discount code, automatically creates a Stripe coupon

**Implementation**:
```typescript
const stripeCoupon = await stripe.coupons.create({
  name: code.toUpperCase(),
  percent_off: parseInt(percentageOff),
  duration: 'forever',
  currency: 'aed',
  metadata: {
    source: 'kregime_admin',
    is_recurring: isRecurring.toString()
  }
});

// Rollback Stripe coupon if database insert fails
```

**Features**:
- Creates Stripe coupon with same percentage discount
- Stores Stripe coupon ID in database
- Includes rollback logic: if database insert fails, deletes the Stripe coupon
- Adds metadata to identify coupon source

### 2. `src/app/api/discount-codes/[id]/route.ts` (PUT - Update)
**What it does**: When admin edits discount code percentage or code, recreates the Stripe coupon

**Implementation**:
```typescript
// If code or percentage changed
if (needsStripeCouponUpdate && currentCode.stripe_coupon_id) {
  // Delete old Stripe coupon
  await stripe.coupons.del(currentCode.stripe_coupon_id);
  
  // Create new Stripe coupon with updated values
  const newStripeCoupon = await stripe.coupons.create({...});
  
  updateData.stripe_coupon_id = newStripeCoupon.id;
}
```

**Features**:
- Only updates Stripe coupon if code or percentage changes
- Deletes old coupon and creates new one (Stripe coupons are immutable)
- Updates database with new coupon ID
- Returns error if Stripe coupon update fails

### 3. `src/app/api/discount-codes/[id]/route.ts` (DELETE - Delete)
**What it does**: When admin deletes discount code, also deletes the Stripe coupon

**Implementation**:
```typescript
// Get discount code to access stripe_coupon_id
const { data: discountCode } = await supabaseClient
  .from('discount_codes')
  .select('*')
  .eq('id', id)
  .single();

// Delete Stripe coupon if it exists
if (discountCode.stripe_coupon_id) {
  await stripe.coupons.del(discountCode.stripe_coupon_id);
}

// Continue with database deletion
```

**Features**:
- Deletes Stripe coupon before deleting database record
- Continues with database deletion even if Stripe deletion fails
- Prevents orphaned coupons in Stripe

### 4. `src/app/api/discount-codes/validate/route.ts` (POST)
**What it does**: Returns `stripeCouponId` along with discount code details

**Updated Response**:
```typescript
{
  success: true,
  discountCode: {
    id: string,
    code: string,
    percentageOff: number,
    isRecurring: boolean,
    stripeCouponId: string  // NEW
  }
}
```

### 5. `src/app/api/stripe/checkout/route.ts` (POST)
**What it does**: Applies Stripe coupon to checkout session if discount code is used

**Changes**:
- Added `stripeCouponId?: string` to `CheckoutRequestBody` interface
- Extracts `stripeCouponId` from request body
- Applies coupon to session config:
  ```typescript
  if (stripeCouponId) {
    sessionConfig.discounts = [
      {
        coupon: stripeCouponId,
      },
    ];
  }
  ```

**Result**: Stripe checkout page now shows the discounted price automatically

## Frontend Changes

### `src/app/payment/page.tsx`
**What it does**: Passes `stripeCouponId` to checkout API

**Changes**:
- Updated `CartData.discountCode` interface to include `stripeCouponId`
- Passes `stripeCouponId` in checkout payload:
  ```typescript
  const checkoutPayload = {
    ...
    stripeCouponId: cartData.discountCode?.stripeCouponId,
    ...
  };
  ```

## Flow Diagram

### Discount Code Creation
```
Admin creates discount code
  ↓
POST /api/discount-codes
  ↓
Create Stripe coupon
  ↓
Save coupon ID to database
  ↓
(If DB fails, delete Stripe coupon)
```

### Discount Code Update
```
Admin edits code/percentage
  ↓
PUT /api/discount-codes/[id]
  ↓
Delete old Stripe coupon
  ↓
Create new Stripe coupon
  ↓
Update database with new coupon ID
```

### Discount Code Deletion
```
Admin deletes discount code
  ↓
DELETE /api/discount-codes/[id]
  ↓
Delete Stripe coupon
  ↓
Delete database record
```

### Customer Checkout Flow
```
Customer applies discount code
  ↓
Validate code (returns stripeCouponId)
  ↓
Store stripeCouponId in cart data
  ↓
Customer clicks "Complete Order"
  ↓
POST /api/stripe/checkout with stripeCouponId
  ↓
Create session with discounts: [{ coupon: stripeCouponId }]
  ↓
Redirect to Stripe (shows discounted price)
```

## Testing Checklist

### Admin Panel
- [ ] Create one-time discount code → Check Stripe Dashboard for coupon
- [ ] Create recurring discount code → Check Stripe Dashboard for coupon
- [ ] Edit discount code percentage → Verify old coupon deleted, new coupon created
- [ ] Edit discount code name → Verify old coupon deleted, new coupon created
- [ ] Delete unused discount code → Verify coupon deleted from Stripe
- [ ] Try to delete used discount code → Should be blocked by admin UI

### Customer Flow
- [ ] Apply discount code in cart
- [ ] Proceed to payment page
- [ ] Click "Complete Order"
- [ ] Verify discounted price shows in Stripe checkout page
- [ ] Complete payment
- [ ] Verify order has correct discount in database

### Edge Cases
- [ ] Create discount code when Stripe API fails → Should show error
- [ ] Apply discount code without stripe_coupon_id → Should still work (graceful fallback)
- [ ] Delete discount code when Stripe API fails → Should still delete from database
- [ ] Update discount code with only is_active change → Should NOT recreate Stripe coupon

## Next Steps

1. **Push Database Migration**:
   ```bash
   supabase db push
   ```

2. **Test Discount Code Creation**:
   - Create a test discount code in admin panel
   - Check Stripe Dashboard to confirm coupon was created
   - Note the Stripe coupon ID

3. **Test Full Checkout Flow**:
   - Add item to cart
   - Apply the test discount code
   - Proceed to payment
   - Verify Stripe checkout shows discounted price

4. **Test Update/Delete**:
   - Edit the discount code
   - Verify old coupon deleted and new one created in Stripe
   - Delete an unused discount code
   - Verify coupon removed from Stripe

## Known Limitations

1. **Stripe Coupons are Immutable**: 
   - Cannot update existing Stripe coupons
   - Must delete and recreate when code or percentage changes
   - This means historical orders may show deleted coupons in Stripe Dashboard

2. **No Stripe Coupon for Existing Codes**: 
   - Discount codes created before this implementation won't have `stripe_coupon_id`
   - These codes will work in admin panel but won't affect Stripe checkout
   - Consider running a migration script to create Stripe coupons for existing codes

3. **Currency Hardcoded**:
   - Stripe coupons use `currency: 'aed'`
   - If you need multi-currency support, this needs to be made dynamic

4. **One-Time vs Recurring in Stripe**:
   - Both one-time and recurring discount codes create Stripe coupons with `duration: 'forever'`
   - One-time logic is handled in our database (usage_count check)
   - Could optionally use Stripe's `max_redemptions: 1` for one-time codes

## Benefits of This Implementation

1. **Price Accuracy**: Stripe checkout shows the actual discounted price, not full price
2. **Payment Intent Consistency**: Stripe payment intents have correct amounts from the start
3. **Automated Sync**: No manual Stripe coupon management needed
4. **Audit Trail**: Stripe Dashboard shows all coupon usage and history
5. **Error Prevention**: Rollback logic prevents orphaned coupons or database inconsistencies

## Files Modified

- `supabase/migrations/20250207_add_stripe_coupon_id.sql` (NEW)
- `src/types/database.ts`
- `src/models/database.ts`
- `src/lib/pricing.ts`
- `src/app/api/discount-codes/route.ts`
- `src/app/api/discount-codes/[id]/route.ts`
- `src/app/api/discount-codes/validate/route.ts`
- `src/app/api/stripe/checkout/route.ts`
- `src/app/payment/page.tsx`
