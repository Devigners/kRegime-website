import { generateEmailTemplate } from './emailTemplate';
import { Order, Regime } from '@/models/database';

export interface NewOrderAdminTemplateProps {
  order: Order;
  regime?: Regime;
}

export function generateNewOrderAdminEmail({
  order,
  regime,
}: NewOrderAdminTemplateProps): string {
  const fullName = order.shippingAddress
    ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
    : 'Customer';
  
  const regimeName = regime?.name || 'a regime';
  
  const purchaseOption = order.subscriptionType === 'one-time' 
    ? 'one-time purchase' 
    : order.subscriptionType === '3-months'
    ? '3-months subscription'
    : order.subscriptionType === '6-months'
    ? '6-months subscription'
    : order.subscriptionType;

  return generateEmailTemplate({
    title: `New Order #${order.id} received`,
    heading: `Order #${order.id} Received`,
    subheading: `A new order (#${order.id}) has been placed from ${fullName} for a ${regimeName} with ${purchaseOption} option for ${order.finalAmount} AED. Please process the order by logging into your admin panel.`,
    ctaButton: {
      text: 'View Order in Admin Panel',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/orders`,
    },
    footerNote: 'This is an automated notification from your KREGIME store.',
  });
}
