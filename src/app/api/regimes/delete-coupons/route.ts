import { NextRequest, NextResponse } from 'next/server';
import { deleteRegimeCoupon } from '@/lib/regimeCoupons';

// POST /api/regimes/delete-coupons - Delete Stripe coupons for regime
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { couponIds } = body;

    if (!couponIds || !Array.isArray(couponIds)) {
      return NextResponse.json(
        { success: false, error: 'Invalid coupon IDs' },
        { status: 400 }
      );
    }

    // Delete all coupons
    await Promise.all(
      couponIds.map((couponId: string) => deleteRegimeCoupon(couponId))
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting regime coupons:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete Stripe coupons' },
      { status: 500 }
    );
  }
}
