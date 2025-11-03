import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const {
      regimeId,
      subscriptionType,
      quantity,
      contactInfo,
      userDetails,
      shippingAddress,
      giftToken,
    } = payload;

    // Validate gift token and check if it exists
    const { data: giftOrder, error: giftError } = await supabase
      .from('orders')
      .select('*')
      .eq('giftToken', giftToken)
      .eq('isGift', true)
      .single();

    if (giftError || !giftOrder) {
      return NextResponse.json(
        { error: 'Invalid gift token' },
        { status: 404 }
      );
    }

    // Check if gift has already been claimed
    if (giftOrder.gift_claimed) {
      return NextResponse.json(
        { error: 'This gift has already been claimed' },
        { status: 400 }
      );
    }

    // Create the recipient's order
    const { data: newOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        regime_id: regimeId,
        subscription_type: subscriptionType,
        quantity,
        contact_info: contactInfo,
        user_details: userDetails,
        shipping_address: shippingAddress,
        total_amount: 0, // Gift is already paid
        final_amount: 0,
        status: 'pending',
        is_gift: true,
        gift_token: giftToken,
        gift_recipient_name: shippingAddress.firstName + (shippingAddress.lastName ? ' ' + shippingAddress.lastName : ''),
        gift_recipient_email: contactInfo.email,
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating recipient order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Mark the original gift order as claimed
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        gift_claimed: true,
        gift_claimed_at: new Date().toISOString(),
      })
      .eq('id', giftOrder.id);

    if (updateError) {
      console.error('Error marking gift as claimed:', updateError);
      // Don't fail the order creation if we can't mark it as claimed
    }

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
    });
  } catch (error) {
    console.error('Error redeeming gift:', error);
    return NextResponse.json(
      { error: 'Failed to redeem gift' },
      { status: 500 }
    );
  }
}
