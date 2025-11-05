import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { 
  sendGiftRecipientOrderEmail, 
  sendGiftClaimedEmail, 
  sendNewOrderAdminEmail 
} from '@/lib/email';
import { 
  convertOrderRowToOrder, 
  convertRegimeRowToRegime 
} from '@/models/database';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    console.log('Gift redemption request received:', JSON.stringify(payload, null, 2));
    
    const {
      regimeId,
      contactInfo,
      userDetails,
      shippingAddress,
      giftToken,
    } = payload;

    console.log('Looking up gift token:', giftToken);

    // Validate gift token and check if it exists
    const { data: giftOrder, error: giftError } = await supabase
      .from('orders')
      .select('*')
      .eq('gift_token', giftToken)
      .eq('is_gift', true)
      .single();

    if (giftError) {
      console.error('Error looking up gift token:', giftError);
    }

    if (giftError || !giftOrder) {
      console.error('Gift token not found or invalid');
      return NextResponse.json(
        { error: 'Invalid gift token' },
        { status: 404 }
      );
    }

    console.log('Found gift order:', giftOrder.id);

    // Check if gift has already been claimed
    if (giftOrder.gift_claimed) {
      console.error('Gift already claimed');
      return NextResponse.json(
        { error: 'This gift has already been claimed' },
        { status: 400 }
      );
    }

    // Update the existing gift order with recipient information
    const recipientName = shippingAddress.firstName + (shippingAddress.lastName ? ' ' + shippingAddress.lastName : '');
    console.log('Updating gift order with recipient information for:', recipientName);
    
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update({
        // Add recipient contact and shipping info
        contact_info: contactInfo,
        user_details: userDetails,
        shipping_address: shippingAddress,
        // Mark as claimed
        gift_claimed: true,
        gift_claimed_at: new Date().toISOString(),
        // Update status to pending since we now have all info needed
        status: 'pending',
      })
      .eq('id', giftOrder.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating gift order with recipient info:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order', details: updateError.message },
        { status: 500 }
      );
    }

    console.log('Successfully updated gift order:', updatedOrder.id, '- claimed at:', updatedOrder.gift_claimed_at);

    // Fetch regime details for emails
    const { data: regimeData } = await supabase
      .from('regimes')
      .select('*')
      .eq('id', regimeId)
      .single();

    const regime = regimeData ? convertRegimeRowToRegime(regimeData) : undefined;
    const order = convertOrderRowToOrder(updatedOrder);

    // Send email notifications (don't fail if emails fail)
    console.log('Sending email notifications...');
    try {
      // 1. Send confirmation email to gift recipient
      console.log('Sending gift recipient order email...');
      await sendGiftRecipientOrderEmail({
        order,
        regime,
        recipientName,
        giftGiverName: giftOrder.gift_giver_name || 'Someone special',
      });

      // 2. Send notification to gift giver that their gift was claimed
      if (giftOrder.gift_giver_email) {
        console.log('Sending gift claimed notification to giver...');
        await sendGiftClaimedEmail({
          order,
          giftGiverEmail: giftOrder.gift_giver_email,
          giftGiverName: giftOrder.gift_giver_name || 'there',
          recipientName,
        });
      }

      // 3. Send notification to admin
      console.log('Sending admin notification...');
      await sendNewOrderAdminEmail({
        order,
        regime,
      });
      
      console.log('All emails sent successfully');
    } catch (emailError) {
      console.error('Error sending gift redemption emails:', emailError);
      // Don't fail the order creation if emails fail
    }

    console.log('Gift redemption completed successfully');
    return NextResponse.json({
      success: true,
      orderId: updatedOrder.id,
    });
  } catch (error) {
    console.error('Error redeeming gift:', error);
    return NextResponse.json(
      { error: 'Failed to redeem gift', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
