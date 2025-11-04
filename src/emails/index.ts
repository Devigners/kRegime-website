// Legacy React Email components (kept for backwards compatibility if needed)
export { OrderReceivedEmail } from './OrderReceivedEmail';
export { OrderStatusUpdateEmail } from './OrderStatusUpdateEmail';
export { NewOrderAdminEmail } from './NewOrderAdminEmail';
export { BaseEmailLayout } from './components/BaseEmailLayout';
export { GiftNotificationEmail, sendGiftNotificationEmail } from './GiftNotificationEmail';

// New HTML template generators
export {
  generateEmailTemplate,
  generateOrderReceivedEmail,
  generateNewOrderAdminEmail,
  generateOrderStatusUpdateEmail,
  generateGiftNotificationEmail,
  generateNewsletterSubscriptionEmail,
} from './templates';

export type {
  EmailTemplateOptions,
  OrderReceivedTemplateProps,
  NewOrderAdminTemplateProps,
  OrderStatusUpdateTemplateProps,
  GiftNotificationTemplateProps,
  NewsletterSubscriptionTemplateProps,
} from './templates';