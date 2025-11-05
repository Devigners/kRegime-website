import { generateEmailTemplate } from './emailTemplate';
import { Order, Regime } from '@/models/database';

export interface GiftClaimedTemplateProps {
  order: Order;
  giftGiverName: string;
  recipientName: string;
}

export function generateGiftClaimedEmail({
  order,
  giftGiverName,
  recipientName,
}: GiftClaimedTemplateProps): string {
  return generateEmailTemplate({
    title: 'Your Gift Has Been Claimed! 🎉',
    heading: `Great news ${giftGiverName}! 🎁`,
    subheading: `<strong>${recipientName}</strong> has claimed your thoughtful gift! Their personalized skincare regime is being prepared and will be shipped to them soon.`,
    ctaButton: {
      text: 'View Order Details',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/confirmation?orderId=${order.id}`,
    },
    footerNote: `Thank you for spreading the gift of great skin! Questions? <a href="mailto:care@kregime.com" style="text-decoration: none;">Contact us at care@kregime.com</a>`,
  });
}
