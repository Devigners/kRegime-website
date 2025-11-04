# Email Templates - Quick Reference

## Import Templates

```typescript
import {
  generateOrderReceivedEmail,
  generateNewOrderAdminEmail,
  generateOrderStatusUpdateEmail,
  generateGiftNotificationEmail,
} from '@/emails/templates';
```

## Order Received Email (Customer)

```typescript
const html = generateOrderReceivedEmail({
  order: Order,           // Required
  regime: Regime,         // Optional
  customerName: string,   // Required
});
```

**When to use:** After customer completes checkout
**Subject:** `Order Confirmed #${orderId} - Your KREGIME journey begins! 🌟`

---

## New Order Admin Email (Admin)

```typescript
const html = generateNewOrderAdminEmail({
  order: Order,           // Required
  regime: Regime,         // Optional
});
```

**When to use:** When new order is placed
**Subject:** `🔔 New Order #${orderId} - ${customerName}`
**Recipient:** Admin team

---

## Order Status Update Email (Customer)

```typescript
const html = generateOrderStatusUpdateEmail({
  order: Order,                    // Required
  regime: Regime,                  // Optional
  customerName: string,            // Required
  trackingNumber: string,          // Optional
});
```

**When to use:** Order status changes (processing, shipped, completed, cancelled)
**Subject:** Dynamic based on status
- Processing: `Order #${orderId} is being processed! ⚡`
- Shipped: `Order #${orderId} has shipped! 🚚`
- Completed: `Order #${orderId} delivered! Your skincare journey begins ✨`
- Cancelled: `Order #${orderId} has been cancelled`

---

## Gift Notification Email (Recipient)

```typescript
const html = generateGiftNotificationEmail({
  recipientName: string,    // Required
  senderName: string,       // Required
  giftMessage: string,      // Optional
  giftUrl: string,          // Required
});
```

**When to use:** Someone sends a gift
**Subject:** `${senderName} sent you a special skincare gift! 🎁`

---

## Complete Send Example

```typescript
import { resend } from '@/lib/resend';
import { generateOrderReceivedEmail } from '@/emails/templates';

async function sendOrderConfirmation(order: Order, regime?: Regime) {
  const emailHtml = generateOrderReceivedEmail({
    order,
    regime,
    customerName: order.shippingAddress?.firstName || 'Valued Customer',
  });

  const { data, error } = await resend.emails.send({
    from: 'KREGIME <care@kregime.com>',
    to: order.contactInfo.email,
    subject: `Order Confirmed #${order.id} - Your KREGIME journey begins! 🌟`,
    html: emailHtml,
  });

  if (error) {
    console.error('Failed to send email:', error);
    throw error;
  }

  return data;
}
```

---

## Design Tokens

```typescript
// Colors
PRIMARY = '#ef7e71'      // Coral/salmon
ACCENT = '#ffe066'       // Yellow
SUCCESS = '#10b981'      // Green
INFO = '#3b82f6'         // Blue
WARNING = '#f59e0b'      // Amber
ERROR = '#ef4444'        // Red

// Typography
HEADING_FONT = 'DM Sans'
BODY_FONT = 'DM Sans'
MONO_FONT = 'Courier New'

// Layout
MAX_WIDTH = 600px
PADDING_DESKTOP = 32px
PADDING_MOBILE = 20px
BORDER_RADIUS = 12px-16px
```

---

## Common Props Types

```typescript
interface Order {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  totalAmount: number;
  finalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  subscriptionType: string;
  shippingAddress: Address;
  contactInfo: ContactInfo;
}

interface Regime {
  name: string;
  description: string;
  stepCount: number;
  steps: string[];
  priceOneTime: number;
  price3Months: number;
  price6Months: number;
}
```

---

## Testing Checklist

- [ ] Send test email to yourself
- [ ] Check Gmail (web, mobile)
- [ ] Check Outlook (desktop, web)
- [ ] Check Apple Mail (macOS, iOS)
- [ ] Verify all links work
- [ ] Check mobile responsiveness
- [ ] Verify images load
- [ ] Check spam score

---

## Files Location

```
src/emails/
├── templates/
│   ├── emailTemplate.ts              # Base template
│   ├── orderReceivedTemplate.ts      # Order confirmation
│   ├── newOrderAdminTemplate.ts      # Admin notification
│   ├── orderStatusUpdateTemplate.ts  # Status updates
│   ├── giftNotificationTemplate.ts   # Gift notifications
│   └── index.ts                      # Exports
├── README.md                         # Full documentation
├── PREVIEW.html                      # Visual preview
└── template.html                     # Original HTML template
```

---

## Support

📧 Questions? Check `src/emails/README.md` or contact the dev team
