import { supabase, supabaseClient } from '@/lib/supabase';
import { convertOrderRowToOrder, convertRegimeRowToRegime } from '@/models/database';
import { sendOrderCompleteEmail } from '@/lib/email';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }

      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch order' },
        { status: 500 }
      );
    }

    const convertedOrder = convertOrderRowToOrder(order);

    return NextResponse.json({ success: true, data: convertedOrder });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const updateData = await request.json();

    // Check if status is being updated to 'completed'
    const isOrderCompleted = updateData.status === 'completed';

    // Add updated_at timestamp
    const finalUpdateData = {
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    // Use raw supabase query without strict typing for update
    const { data, error } = await supabaseClient
      .from('orders')
      .update(finalUpdateData)
      .eq('id', orderId)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }

      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update order' },
        { status: 500 }
      );
    }

    const convertedOrder = convertOrderRowToOrder(data);

    // Send order completion email if order status was updated to 'completed'
    if (isOrderCompleted) {
      try {
        // Fetch regime details for the email
        let regime = undefined;
        if (convertedOrder.regimeId) {
          const { data: regimeData } = await supabase
            .from('regimes')
            .select('*')
            .eq('id', convertedOrder.regimeId)
            .single();

          if (regimeData) {
            regime = convertRegimeRowToRegime(regimeData);
          }
        }

        // Send the completion email
        const emailResult = await sendOrderCompleteEmail({
          order: convertedOrder,
          regime,
        });

        if (!emailResult.success) {
          console.error('Failed to send order completion email:', emailResult.error);
          // Don't fail the order update if email fails, just log it
        } else {
          console.log('Order completion email sent successfully:', emailResult.id);
        }
      } catch (emailError) {
        console.error('Error sending order completion email:', emailError);
        // Don't fail the order update if email fails, just log it
      }
    }

    return NextResponse.json({ success: true, data: convertedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
