import { generateEmailTemplate } from './emailTemplate';
import { Order, Regime } from '@/models/database';

export interface OrderReceivedGiftTemplateProps {
  order: Order;
  regime?: Regime;
  giftGiverName: string;
  giftLink: string;
}

export function generateOrderReceivedGiftEmail({
  order,
  giftGiverName,
  giftLink,
}: OrderReceivedGiftTemplateProps): string {

  return generateEmailTemplate({
    title: 'Thanks for your order! 🎁',
    heading: `Hey ${giftGiverName},`,
    subheading: `We have received a gift order from you for your loved ones. Please do not forget to share the gift link with them so they can claim the gift.`,
    ctaButton: {
      text: 'Track Your Gift',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/confirmation?orderId=${order.id}`,
    },
    footerNote: `Share this link with your loved one so they can claim their personalized skincare regime!`,
  });
}
