import { generateEmailTemplate } from './emailTemplate';
import { Order, Regime } from '@/models/database';

export interface GiftRecipientOrderTemplateProps {
  order: Order;
  regime?: Regime;
  recipientName: string;
  giftGiverName: string;
}

export function generateGiftRecipientOrderEmail({
  order,
  recipientName,
  giftGiverName,
}: GiftRecipientOrderTemplateProps): string {
  return generateEmailTemplate({
    title: 'Gift Order Claimed! 🎁',
    heading: `You have claimed your gift! 🎉`,
    subheading: `Hey ${recipientName}, <strong>${giftGiverName}</strong> sent you a personalized skincare regime! Your order has been claimed and is being prepared for shipment. We're excited for you to start your skin transformation journey!`,
    ctaButton: {
      text: 'Track Your Order',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/confirmation?orderId=${order.id}`,
    },
    footerNote: `This special gift from ${giftGiverName} is on its way to you! Thank you for choosing KREGIME!`,
  });
}
