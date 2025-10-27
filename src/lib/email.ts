import { render } from '@react-email/render';
import { resend } from './resend';
import { OrderReceivedEmail } from '@/emails/OrderReceivedEmail';
import { OrderStatusUpdateEmail } from '@/emails/OrderStatusUpdateEmail';
import { Order, Regime } from '@/models/database';

export interface SendOrderReceivedEmailProps {
  order: Order;
  regime?: Regime;
  customerName?: string;
}

export interface SendOrderStatusUpdateEmailProps {
  order: Order;
  regime?: Regime;
  customerName?: string;
  previousStatus?: Order['status'];
  trackingNumber?: string;
}

export interface EmailResponse {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Send order receipt confirmation email to customer
 */
export async function sendOrderReceivedEmail({
  order,
  regime,
  customerName,
}: SendOrderReceivedEmailProps): Promise<EmailResponse> {
  try {
    // Generate customer name from order data if not provided
    const displayName = 
      customerName || 
      order.shippingAddress.firstName || 
      order.contactInfo.email.split('@')[0];

    // Render the email template
    const emailHtml = await render(
      OrderReceivedEmail({
        order,
        regime,
        customerName: displayName,
      })
    );

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'KREGIME <care@kregime.com>',
      to: [order.contactInfo.email],
      subject: `Order Confirmed #${order.id} - Your KREGIME journey begins! 🌟`,
      html: emailHtml,
    });

    if (error) {
      console.error('Failed to send order received email:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }

    console.log('Order received email sent successfully:', data?.id);
    return {
      success: true,
      id: data?.id,
    };
  } catch (error) {
    console.error('Error in sendOrderReceivedEmail:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Send order status update email to customer
 */
export async function sendOrderStatusUpdateEmail({
  order,
  regime,
  customerName,
  trackingNumber,
}: SendOrderStatusUpdateEmailProps): Promise<EmailResponse> {
  try {
    // Generate customer name from order data if not provided
    const displayName = 
      customerName || 
      order.shippingAddress.firstName || 
      order.contactInfo.email.split('@')[0];

    // Generate subject line based on status
    const getSubjectLine = (status: Order['status']) => {
      switch (status) {
        case 'processing':
          return `Order #${order.id} is being processed! ⚡`;
        case 'shipped':
          return `Order #${order.id} has shipped! 🚚`;
        case 'completed':
          return `Order #${order.id} delivered! Your skincare journey begins ✨`;
        case 'cancelled':
          return `Order #${order.id} has been cancelled`;
        default:
          return `Order #${order.id} status update`;
      }
    };

    // Render the email template
    const emailHtml = await render(
      OrderStatusUpdateEmail({
        order,
        regime,
        customerName: displayName,
        trackingNumber,
      })
    );

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'KREGIME <care@kregime.com>',
      to: [order.contactInfo.email],
      subject: getSubjectLine(order.status),
      html: emailHtml,
    });

    if (error) {
      console.error('Failed to send order status update email:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }

    console.log(`Order status update email sent successfully for status "${order.status}":`, data?.id);
    return {
      success: true,
      id: data?.id,
    };
  } catch (error) {
    console.error('Error in sendOrderStatusUpdateEmail:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Email service configuration
 */
export const emailConfig = {
  from: 'KREGIME <care@kregime.com>',
  replyTo: 'care@kregime.com',
};