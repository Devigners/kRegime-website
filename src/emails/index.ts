// HTML template generators
export {
  generateEmailTemplate,
  generateOrderReceivedEmail,
  generateOrderReceivedGiftEmail,
  generateNewOrderAdminEmail,
  generateOrderStatusUpdateEmail,
  generateGiftNotificationEmail,
  generateGiftClaimedEmail,
  generateGiftRecipientOrderEmail,
  generateNewsletterSubscriptionEmail,
} from './templates';

export type {
  EmailTemplateOptions,
  OrderReceivedTemplateProps,
  OrderReceivedGiftTemplateProps,
  NewOrderAdminTemplateProps,
  OrderStatusUpdateTemplateProps,
  GiftNotificationTemplateProps,
  GiftClaimedTemplateProps,
  GiftRecipientOrderTemplateProps,
  NewsletterSubscriptionTemplateProps,
} from './templates';