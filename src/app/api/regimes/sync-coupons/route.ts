import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateRegimeCoupon } from '@/lib/regimeCoupons';

// POST /api/regimes/sync-coupons - Sync Stripe coupons for regime discounts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { regimeId, regimeName, discounts } = body;

    if (!regimeId || !regimeName || !discounts) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sync one-time purchase coupon
    const oneTimeCouponId = await createOrUpdateRegimeCoupon(
      {
        regimeId,
        regimeName,
        subscriptionType: 'one-time',
        discount: discounts.oneTime.discount,
        discountReason: discounts.oneTime.discountReason,
      },
      discounts.oneTime.existingCouponId
    );

    // Sync 3-month subscription coupon
    const threeMonthsCouponId = await createOrUpdateRegimeCoupon(
      {
        regimeId,
        regimeName,
        subscriptionType: '3-months',
        discount: discounts.threeMonths.discount,
        discountReason: discounts.threeMonths.discountReason,
      },
      discounts.threeMonths.existingCouponId
    );

    // Sync 6-month subscription coupon
    const sixMonthsCouponId = await createOrUpdateRegimeCoupon(
      {
        regimeId,
        regimeName,
        subscriptionType: '6-months',
        discount: discounts.sixMonths.discount,
        discountReason: discounts.sixMonths.discountReason,
      },
      discounts.sixMonths.existingCouponId
    );

    return NextResponse.json({
      success: true,
      couponIds: {
        oneTime: oneTimeCouponId,
        threeMonths: threeMonthsCouponId,
        sixMonths: sixMonthsCouponId,
      },
    });
  } catch (error) {
    console.error('Error syncing regime coupons:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync Stripe coupons' },
      { status: 500 }
    );
  }
}
