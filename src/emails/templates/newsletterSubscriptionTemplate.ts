import { generateEmailTemplate } from './emailTemplate';

export interface NewsletterSubscriptionTemplateProps {
  email: string;
}

export function generateNewsletterSubscriptionEmail({
  email,
}: NewsletterSubscriptionTemplateProps): string {

  return generateEmailTemplate({
    title: 'Welcome to the Glow Community! 💌',
    heading: 'Welcome to the Glow Community from KREGIME!',
    subheading: `Thank you for subscribing to our newsletter! You'll now receive exclusive skincare tips, product launches, special offers, and expert advice on achieving your best skin ever.`,
    ctaButton: {
      text: 'Explore Our Regimes',
      url: `${process.env.NEXT_PUBLIC_APP_URL}/#regimes`,
    },
    footerNote: `You're receiving this email because you subscribed to KREGIME newsletter with ${email}. You can unsubscribe anytime.`,
  });
}
