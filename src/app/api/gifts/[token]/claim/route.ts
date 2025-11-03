import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    
    const {
      formData,
      shippingAddress,
      contactInfo,
    } = await request.json();

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify gift exists and is not claimed
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('gift_token', token)
      .eq('is_gift', true)
      .single();

    if (fetchError || !order) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      );
    }

    if (order.gift_claimed) {
      return NextResponse.json(
        { error: 'This gift has already been claimed' },
        { status: 400 }
      );
    }

    // Update order with recipient information
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        user_details: formData,
        shipping_address: shippingAddress,
        contact_info: contactInfo,
        gift_claimed: true,
        gift_claimed_at: new Date().toISOString(),
        gift_recipient_name: `${contactInfo.firstName} ${contactInfo.lastName}`,
        gift_recipient_email: contactInfo.email,
        status: 'confirmed', // Since it's already paid
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to claim gift' },
        { status: 500 }
      );
    }

    // Send notification email to gift giver
    try {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@kregime.com',
        to: order.gift_giver_email!,
        subject: '🎉 Your Gift Has Been Claimed!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #EF7E71;">Great News! 🎉</h1>
            <p>Hi ${order.gift_giver_name}!</p>
            <p>Your gift has been claimed by <strong>${contactInfo.firstName} ${contactInfo.lastName}</strong>!</p>
            <p>They've customized their skincare routine and provided their shipping address.</p>
            <p>The order will be processed and shipped soon.</p>
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
              Thank you for choosing kRegime for your gift!
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
    });
  } catch (error) {
    console.error('Error claiming gift:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
