import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { giftToken, method, recipientEmail, recipientName } = await request.json();

    if (!giftToken) {
      return NextResponse.json(
        { error: 'Gift token is required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Verify gift exists and is not claimed
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, regimes(*)')
      .eq('gift_token', giftToken)
      .eq('is_gift', true)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Invalid gift token' },
        { status: 404 }
      );
    }

    if (order.gift_claimed) {
      return NextResponse.json(
        { error: 'This gift has already been claimed' },
        { status: 400 }
      );
    }

    const giftLink = `${process.env.NEXT_PUBLIC_SITE_URL}/gift/${giftToken}`;

    if (method === 'email' && recipientEmail) {
      // TODO: Create proper email template
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@kregime.com',
        to: recipientEmail,
        subject: `🎁 You've Received a Gift from ${order.gift_giver_name}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #EF7E71;">You've Received a Gift! 🎁</h1>
            <p>Hi ${recipientName || 'there'}!</p>
            <p><strong>${order.gift_giver_name}</strong> has gifted you a personalized skincare regime from kRegime.</p>
            <p>Your gift: <strong>${order.regimes?.name}</strong></p>
            <p>${order.regimes?.description}</p>
            <div style="margin: 30px 0;">
              <a href="${giftLink}" style="background-color: #EF7E71; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Claim Your Gift
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">
              Click the button above to customize your skincare routine and provide your shipping address.
            </p>
            <p style="color: #666; font-size: 14px;">
              Or copy this link: ${giftLink}
            </p>
          </div>
        `,
      });

      return NextResponse.json({
        success: true,
        message: 'Gift email sent successfully',
        giftLink,
      });
    }

    // If not sending email, just return the link
    return NextResponse.json({
      success: true,
      giftLink,
    });
  } catch (error) {
    console.error('Error sending gift:', error);
    return NextResponse.json(
      { error: 'Failed to send gift' },
      { status: 500 }
    );
  }
}
