import { generateEmailTemplate } from './emailTemplate';
import { Order, Regime } from '@/models/database';

export interface OrderStatusUpdateTemplateProps {
  order: Order;
  regime?: Regime;
  customerName: string;
  previousStatus?: Order['status'];
  trackingNumber?: string;
}

export function generateOrderStatusUpdateEmail({
  order,
  customerName,
}: OrderStatusUpdateTemplateProps): string {
  // Status configuration for email content
  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return {
          title: 'Your order is being processed!',
          description:
            `Hi ${customerName}, Our skincare experts are carefully curating your products based on your skin profile.`,
        };
      case 'shipped':
        return {
          title: 'Your order is on its way!',
          description:
            `Hi ${customerName}, Your KREGIME package has been shipped and is heading to your doorstep.`,
        };
      case 'completed':
        return {
          title: 'Your order has been delivered!',
          description:
            `Hi ${customerName}, Welcome to your new skincare routine! Time to start your transformation.`,
        };
      case 'cancelled':
        return {
          title: 'Your order has been cancelled',
          description:
            `Hi ${customerName}, We've processed the cancellation of your order and will refund you shortly.`,
        };
      case 'payment_verified':
        return {
          title: 'Your payment has been verified!',
          description:
            `Hi ${customerName}, We've successfully verified your payment. Your order is now being processed.`,
        };
      default:
        return {
          title: 'Order status updated',
          description: `Hi ${customerName}, There's been an update to your order status.`,
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);


  return generateEmailTemplate({
    title: `Order #${order.id} - ${statusConfig.title}`,
    heading: statusConfig.title,
    subheading: statusConfig.description,
    ctaButton: {
      text: 'Track Your Order',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/confirmation?orderId=${order.id}`,
    },
    footerNote: `Or contact us at <a href="mailto:care@kregime.com" style="color: #ef7e71; text-decoration: none;">care@kregime.com</a>`,
  });
}
