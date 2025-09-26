import { render } from '@react-email/render';
import { resend } from './resend';
import { OrderCompleteEmail } from '@/emails/OrderCompleteEmail';
import { Order, Regime } from '@/models/database';

export interface SendOrderCompleteEmailProps {
  order: Order;
  regime?: Regime;
  customerName?: string;
}

export interface EmailResponse {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Send order completion email to customer
 */
export async function sendOrderCompleteEmail({
  order,
  regime,
  customerName,
}: SendOrderCompleteEmailProps): Promise<EmailResponse> {
  try {
    // Generate customer name from order data if not provided
    const displayName = 
      customerName || 
      order.shippingAddress.firstName || 
      order.contactInfo.email.split('@')[0];

    // Render the email template
    const emailHtml = await render(
      OrderCompleteEmail({
        order,
        regime,
        customerName: displayName,
      })
    );

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'kRegime <noreply@kregime.com>',
      to: [order.contactInfo.email],
      subject: `Order Confirmed #${order.id} - Your kRegime journey begins! 🌟`,
      html: emailHtml,
    });

    if (error) {
      console.error('Failed to send order complete email:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }

    console.log('Order complete email sent successfully:', data?.id);
    return {
      success: true,
      id: data?.id,
    };
  } catch (error) {
    console.error('Error in sendOrderCompleteEmail:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Send order status update email (for future use)
 */
export async function sendOrderStatusUpdateEmail({
  order,
  status,
  trackingNumber,
}: {
  order: Order;
  status: Order['status'];
  trackingNumber?: string;
}): Promise<EmailResponse> {
  // This can be implemented later for order status updates
  // For now, we'll just return a placeholder
  console.log('Order status update email functionality - to be implemented', {
    orderId: order.id,
    status,
    trackingNumber,
  });
  return { success: true };
}

/**
 * Email service configuration
 */
export const emailConfig = {
  from: 'kRegime <noreply@kregime.com>',
  replyTo: 'care@kregime.com',
};