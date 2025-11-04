import { generateEmailTemplate } from './emailTemplate';

export interface GiftNotificationTemplateProps {
  recipientName: string;
  senderName: string;
  giftMessage?: string;
  giftUrl: string;
}

export function generateGiftNotificationEmail({
  recipientName,
  senderName,
  giftMessage,
  giftUrl,
}: GiftNotificationTemplateProps): string {

  return generateEmailTemplate({
    title: `${senderName} sent you a special skincare gift! 🎁`,
    heading: `Hi ${recipientName}! 👋`,
    subheading: `<strong>${senderName}</strong> has gifted you a personalized Korean skincare regime from KREGIME!`,
    ctaButton: {
      text: '🎁 Claim Your Gift Now',
      url: giftUrl,
    },
    footerNote: `This link is unique to your gift and can only be used once. Questions? <a href="mailto:care@kregime.com" style="color: #9333ea; text-decoration: none;">Contact us at care@kregime.com</a>`,
  });
}
