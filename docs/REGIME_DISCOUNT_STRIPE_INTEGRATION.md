# Regime Discount Stripe Integration

## Overview
Implemented automatic Stripe coupon synchronization for regime-specific discounts. When admins add/edit/delete discounts on regime pricing (one-time, 3-month, or 6-month), the system automatically creates/updates/deletes corresponding Stripe coupons. These coupons are automatically applied during checkout, ensuring customers see the discounted price on the Stripe payment page.

## Database Changes

### Migration: `20250208_add_regime_stripe_coupon_ids.sql`
Added three new columns to the `regimes` table:
- `stripe_coupon_id_one_time` (TEXT NULL)
- `stripe_coupon_id_3_months` (TEXT NULL)
- `stripe_coupon_id_6_months` (TEXT NULL)

Each column stores the Stripe coupon ID for its respective subscription type.

**Status**: Created, needs to be pushed with `supabase db push`

## Type Updates

### `src/types/database.ts`
Updated `regimes` table types:
- Added `stripe_coupon_id_one_time`, `stripe_coupon_id_3_months`, `stripe_coupon_id_6_months` to Row, Insert, and Update types

### `src/models/database.ts`
Updated `Regime` interface and converter functions:
- Added `stripeCouponIdOneTime`, `stripeCouponId3Months`, `stripeCouponId6Months` fields
- Updated `convertRegimeRowToRegime` to include coupon IDs
- Updated `convertRegimeToRegimeInsert` to include coupon IDs

## New Files

### `src/lib/regimeCoupons.ts`
Helper functions for managing regime Stripe coupons:

**`createOrUpdateRegimeCoupon()`**: 
- Creates or updates Stripe coupon for regime discount
- Deletes old coupon if exists (coupons are immutable)
- Returns new coupon ID or null if no discount
- Coupon naming format: `REGIMENAME_SUBSCRIPTIONTYPE_DISCOUNT` (e.g., `TRIBOX_ONE_TIME_10`)

**`deleteRegimeCoupon()`**:
- Deletes a Stripe coupon by ID
- Gracefully handles errors (doesn't throw)

**`getRegimeCouponId()`**:
- Helper to get the appropriate coupon ID based on regime and subscription type

### `src/app/api/regimes/sync-coupons/route.ts`
API endpoint to sync regime discount coupons with Stripe:
- **Method**: POST
- **Purpose**: Create/update Stripe coupons for all three subscription types
- **Request Body**:
  ```json
  {
    "regimeId": "regime_123",
    "regimeName": "Tribox",
    "discounts": {
      "oneTime": {
        "discount": 10,
        "discountReason": "Eid Sale",
        "existingCouponId": "coupon_abc"
      },
      "threeMonths": {...},
      "sixMonths": {...}
    }
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "couponIds": {
      "oneTime": "coupon_xyz",
      "threeMonths": "coupon_abc",
      "sixMonths": null
    }
  }
  ```

### `src/app/api/regimes/delete-coupons/route.ts`
API endpoint to delete regime coupons:
- **Method**: POST
- **Purpose**: Delete multiple Stripe coupons when regime is deleted
- **Request Body**:
  ```json
  {
    "couponIds": ["coupon_xyz", "coupon_abc"]
  }
  ```

## Modified Files

### `src/app/admin/regimes/page.tsx`

**`handleSubmit()`**:
- Added Stripe coupon sync before saving regime
- Calls `/api/regimes/sync-coupons` to create/update coupons
- Includes coupon IDs in regime data before database save
- Shows error alert if coupon sync fails

**`handleDelete()`**:
- Added Stripe coupon cleanup before deleting regime
- Calls `/api/regimes/delete-coupons` to remove coupons
- Continues with regime deletion even if coupon deletion fails

### `src/app/api/stripe/checkout/route.ts`

**Regime Discount Application**:
- Fetches regime data from database to get coupon IDs
- Determines appropriate coupon based on subscription type
- Applies regime coupon automatically if no discount code is provided
- Priority: Discount code coupon > Regime discount coupon > No coupon

**Logic**:
```typescript
// Fetch regime data
const regimeData = await supabaseClient
  .from('regimes')
  .select('stripe_coupon_id_one_time, stripe_coupon_id_3_months, stripe_coupon_id_6_months')
  .eq('id', regimeId)
  .single();

// Get regime coupon based on subscription type
let regimeCouponId = null;
switch (subscriptionType) {
  case 'one-time': regimeCouponId = regimeData.stripe_coupon_id_one_time; break;
  case '3-months': regimeCouponId = regimeData.stripe_coupon_id_3_months; break;
  case '6-months': regimeCouponId = regimeData.stripe_coupon_id_6_months; break;
}

// Apply discount code coupon OR regime coupon
const appliedCouponId = stripeCouponId || regimeCouponId;
```

## Flow Diagrams

### Regime Creation/Update with Discount
```
Admin sets regime discount
  ↓
Click "Create/Update Regime"
  ↓
POST /api/regimes/sync-coupons
  ↓
For each subscription type:
  - Delete old Stripe coupon (if exists)
  - Create new Stripe coupon (if discount > 0)
  - Return coupon IDs
  ↓
Save regime to database (with coupon IDs)
  ↓
Success
```

### Regime Deletion
```
Admin clicks delete regime
  ↓
Find regime's coupon IDs
  ↓
POST /api/regimes/delete-coupons
  ↓
Delete all Stripe coupons
  ↓
Delete regime from database
  ↓
Success
```

### Customer Checkout with Regime Discount
```
Customer adds regime to cart
  ↓
Proceeds to payment
  ↓
POST /api/stripe/checkout
  ↓
Fetch regime data (including coupon IDs)
  ↓
Determine coupon: discount code > regime discount
  ↓
Apply coupon to session config
  ↓
Redirect to Stripe (shows discounted price)
```

## Coupon Priority System

When creating a Stripe checkout session, coupons are applied in this order:
1. **Discount Code Coupon** (if customer applied a code)
2. **Regime Discount Coupon** (automatic, based on regime and subscription type)
3. **No Coupon** (full price)

Only ONE coupon can be applied per checkout session (Stripe limitation).

## Stripe Coupon Naming Convention

Format: `{REGIME_NAME}_{SUBSCRIPTION_TYPE}_{DISCOUNT}`

Examples:
- `TRIBOX_ONE_TIME_10` - Tribox one-time purchase with 10% discount
- `PENTABOX_3_MONTHS_15` - Pentabox 3-month subscription with 15% discount
- `SEPTABOX_6_MONTHS_20` - Septabox 6-month subscription with 20% discount

This naming makes coupons easily identifiable in Stripe Dashboard.

## Testing Checklist

### Admin Panel - Create Regime
- [ ] Create regime with 10% one-time discount → Check Stripe Dashboard for coupon
- [ ] Create regime with 15% 3-month discount → Check Stripe Dashboard for coupon
- [ ] Create regime with 20% 6-month discount → Check Stripe Dashboard for coupon
- [ ] Create regime with discounts on all three types → Verify 3 coupons created
- [ ] Create regime with no discounts → Verify no coupons created

### Admin Panel - Edit Regime
- [ ] Edit regime discount from 10% to 15% → Verify old coupon deleted, new coupon created
- [ ] Edit regime name → Verify coupon names updated
- [ ] Remove discount (set to 0) → Verify coupon deleted
- [ ] Add discount to regime that had none → Verify coupon created
- [ ] Edit regime without changing discounts → Verify coupons unchanged

### Admin Panel - Delete Regime
- [ ] Delete regime with discounts → Verify all coupons deleted from Stripe
- [ ] Delete regime without discounts → Should complete without errors

### Customer Flow - One-time Purchase
- [ ] View regime with 10% discount in cart → Should show discounted price
- [ ] Proceed to Stripe checkout → Verify discounted price displays
- [ ] Complete payment → Verify order has correct amount

### Customer Flow - 3-Month Subscription
- [ ] Select 3-month subscription with 15% discount
- [ ] Proceed to Stripe checkout → Verify monthly price is discounted
- [ ] Complete payment → Verify subscription has correct amount

### Customer Flow - 6-Month Subscription
- [ ] Select 6-month subscription with 20% discount
- [ ] Proceed to Stripe checkout → Verify monthly price is discounted
- [ ] Complete payment → Verify subscription has correct amount

### Customer Flow - Discount Code + Regime Discount
- [ ] Apply discount code to regime that also has regime discount
- [ ] Proceed to checkout → Verify discount code coupon is applied (higher priority)
- [ ] Remove discount code → Verify regime discount coupon is applied automatically

## Edge Cases Handled

1. **No Discount**: If discount is 0 or not set, no Stripe coupon is created (null stored in DB)
2. **Discount Code Priority**: Discount code coupons override regime discount coupons
3. **Coupon Name Conflicts**: Using regime ID in metadata prevents conflicts
4. **Failed Coupon Creation**: Shows error to admin, prevents regime save
5. **Failed Coupon Deletion**: Logs error but continues with regime deletion
6. **Legacy Regimes**: Regimes without coupon IDs still work (no coupon applied)

## Known Limitations

1. **Single Coupon Per Checkout**: Stripe only allows one coupon per session
   - Cannot stack discount code + regime discount
   - Discount code takes priority if both exist

2. **Coupon Immutability**: Stripe coupons cannot be edited
   - Must delete old coupon and create new one when discount changes
   - Historical orders may show deleted coupons in Stripe Dashboard

3. **Manual Stripe Coupon Deletion**: If admin manually deletes coupon in Stripe Dashboard
   - Database still has coupon ID reference
   - Checkout will fail until admin re-saves regime (to recreate coupon)
   - Consider adding validation/recovery logic

4. **Currency Hardcoded**: All coupons use 'aed' currency
   - Need to update for multi-currency support

## Benefits

1. **Automatic Sync**: No manual Stripe Dashboard management required
2. **Accurate Pricing**: Customers see correct discounted prices immediately
3. **Audit Trail**: Stripe Dashboard shows all coupon usage
4. **Consistent Experience**: Same discount applies whether user applies manually or automatically
5. **Error Prevention**: Validation ensures coupons match regime settings
6. **Admin Friendly**: Single interface to manage discounts (no Stripe Dashboard needed)

## Next Steps

1. **Push Database Migration**:
   ```bash
   supabase db push
   ```

2. **Test Regime Creation**:
   - Edit existing regime with discount
   - Check Stripe Dashboard for created coupons
   - Note the coupon IDs

3. **Test Checkout Flow**:
   - Add regime to cart (one with discount)
   - Proceed to payment
   - Verify discounted price in Stripe checkout

4. **Test Discount Code Priority**:
   - Apply discount code to regime with discount
   - Verify discount code coupon is used (not regime coupon)

5. **Monitor Stripe Dashboard**:
   - Check for orphaned coupons
   - Verify coupon naming convention
   - Review coupon redemption analytics

## Migration Path for Existing Regimes

If you have existing regimes with discounts but no Stripe coupons:

1. **Option 1 - Bulk Update**: Create a migration script to generate coupons for all existing regimes with discounts

2. **Option 2 - Lazy Update**: Coupons will be created next time admin edits each regime

3. **Option 3 - Manual**: Admin can edit and save each regime to trigger coupon creation

Recommendation: Use Option 2 (lazy update) for simplicity, or Option 1 if you have many regimes.

## Files Modified Summary

**Created**:
- `supabase/migrations/20250208_add_regime_stripe_coupon_ids.sql`
- `src/lib/regimeCoupons.ts`
- `src/app/api/regimes/sync-coupons/route.ts`
- `src/app/api/regimes/delete-coupons/route.ts`
- `docs/REGIME_DISCOUNT_STRIPE_INTEGRATION.md`

**Modified**:
- `src/types/database.ts`
- `src/models/database.ts`
- `src/app/admin/regimes/page.tsx`
- `src/app/api/stripe/checkout/route.ts`

## Troubleshooting

**Problem**: Checkout fails with "Invalid coupon"
- **Cause**: Coupon was manually deleted from Stripe Dashboard
- **Solution**: Re-save regime in admin panel to recreate coupon

**Problem**: Discount not showing in Stripe checkout
- **Cause**: Regime discount coupon not created (null in database)
- **Solution**: Edit regime and ensure discount > 0, then save

**Problem**: Wrong discount applied
- **Cause**: Discount code coupon is overriding regime coupon
- **Solution**: This is expected behavior (discount code has priority)

**Problem**: Error when creating regime
- **Cause**: Stripe API failure (network issue, invalid Stripe key, etc.)
- **Solution**: Check Stripe API key in environment variables, check network connection

**Problem**: Coupon showing 0 redemptions in Stripe Dashboard
- **Cause**: Coupon just created, no orders yet
- **Solution**: This is normal, redemptions will show after first order
