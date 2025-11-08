import { supabase, supabaseClient } from '@/lib/supabase';
import { convertOrderRowToOrder, convertRegimeRowToRegime } from '@/models/database';
import { sendOrderStatusUpdateEmail } from '@/lib/email';
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

    // Get the current order to compare status changes
    const { data: currentOrderData, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (fetchError) {
      console.error('Error fetching current order:', fetchError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch current order' },
        { status: 500 }
      );
    }

    const currentOrder = convertOrderRowToOrder(currentOrderData);
    const isStatusChanging = updateData.status && updateData.status !== currentOrder.status;

    // Convert camelCase fields to snake_case for database
    const finalUpdateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    // Map fields from camelCase to snake_case
    if (updateData.status !== undefined) {
      finalUpdateData.status = updateData.status;
    }
    if (updateData.trackingNumber !== undefined) {
      finalUpdateData.tracking_number = updateData.trackingNumber;
    }

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

    // Send status update email if order status was changed
    if (isStatusChanging) {
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

        // Send the status update email
        const emailResult = await sendOrderStatusUpdateEmail({
          order: convertedOrder,
          regime,
          trackingNumber: updateData.trackingNumber, // Pass tracking number if provided
        });

        if (!emailResult.success) {
          console.error('Failed to send order status update email:', emailResult.error);
          // Don't fail the order update if email fails, just log it
        } else {
          console.log(`Order status update email sent successfully for status "${convertedOrder.status}":`, emailResult.id);
        }
      } catch (emailError) {
        console.error('Error sending order status update email:', emailError);
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
