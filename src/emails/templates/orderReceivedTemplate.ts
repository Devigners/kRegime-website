import { generateEmailTemplate } from './emailTemplate';
import { Order, Regime } from '@/models/database';

export interface OrderReceivedTemplateProps {
  order: Order;
  regime?: Regime;
  customerName: string;
}

export function generateOrderReceivedEmail({
  order,
  customerName,
}: OrderReceivedTemplateProps): string {

  return generateEmailTemplate({
    title: 'Order Confirmation',
    heading: `Thank you for your order 🎉`,
    subheading: `Hey ${customerName}, Your personalized skincare regime is being prepared and will be shipped to you soon. We're excited for you to start your skin transformation journey!`,
    ctaButton: {
      text: 'Track Your Order',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/confirmation?orderId=${order.id}`,
    },
    footerNote: 'Thank you for choosing KREGIME! Your journey to healthier skin starts now.',
  });
}
