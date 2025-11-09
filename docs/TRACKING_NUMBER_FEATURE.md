# Tracking Number Feature Implementation

## Overview
This document describes the implementation of the tracking number feature that allows admins to add tracking information for shipped orders, which customers can use to track their parcels.

## Changes Made

### 1. Database Schema
**File**: `supabase/migrations/20250108000000_add_tracking_number.sql`
- Added `tracking_number` column to the `orders` table (TEXT, nullable)

### 2. TypeScript Types
**File**: `src/types/database.ts`
- Updated `orders` table Row, Insert, and Update types to include `tracking_number` field

**File**: `src/models/database.ts`
- Added `trackingNumber?: string` to the `Order` interface
- Updated `convertOrderRowToOrder()` to map `tracking_number` from database
- Updated `convertOrderToOrderInsert()` to include `tracking_number` in inserts

### 3. Admin Panel Updates
**File**: `src/app/admin/orders/page.tsx`
- Added `trackingNumber` state to store the tracking number input
- Updated `confirmStatusUpdate()` to send tracking number when status is "shipped"
- Modified the status update confirmation modal to:
  - Show tracking number input field when "shipped" status is selected
  - Mark tracking number as required (with asterisk)
  - Disable the "Update Status" button until tracking number is entered
  - Clear tracking number after successful update

### 4. Email Template Updates
**File**: `src/emails/templates/orderStatusUpdateTemplate.ts`
- Updated `generateOrderStatusUpdateEmail()` to accept `trackingNumber` parameter
- Modified CTA button logic:
  - When status is "shipped" and tracking number exists: Link to Jeebly tracking page
  - Otherwise: Link to confirmation page
- Tracking URL format: `https://myjeebly.jeebly.com/shipment-tracking/?uae=uae&service_type=Scheduled&awb=<TRACKING-NUMBER>`

**File**: `src/lib/email.ts`
- Already supports passing `trackingNumber` to the email template via the API route

### 5. Confirmation Page Updates
**File**: `src/app/confirmation/page.tsx`
- Added "Track Your Parcel" button (purple color) in the quick actions section
- Button only shows when:
  - Order status is "shipped"
  - Order has a tracking number
  - Order is not a gift OR gift has been claimed
- Button opens Jeebly tracking page in new tab with the tracking number

## User Flow

### Admin Workflow
1. Admin views orders in the admin panel
2. Admin selects "Shipped" from the status dropdown
3. Confirmation modal appears with a tracking number input field
4. Admin enters the tracking number (required field)
5. "Update Status" button is only enabled after entering a tracking number
6. Admin clicks "Update Status"
7. Order status is updated and customer receives email with tracking link

### Customer Workflow
1. Customer receives "Order Shipped" email
2. Email contains "Track Your Order" button linking to Jeebly tracking page
3. Customer can also visit the confirmation page
4. On confirmation page, customer sees:
   - "Copy URL" button (to share confirmation link)
   - "Send to WhatsApp" button (to share on WhatsApp)
   - **"Track Your Parcel" button** (purple, links to Jeebly tracking)
   - "Manage Subscription" button (if applicable)

## Technical Details

### Tracking URL Structure
```
https://myjeebly.jeebly.com/shipment-tracking/?uae=uae&service_type=Scheduled&awb=<TRACKING-NUMBER>
```

### Database Migration
Run the following command to apply the migration:
```bash
npx supabase db push
```

Or manually run the migration SQL:
```sql
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS tracking_number TEXT;
```

## Testing Checklist
- [ ] Run database migration successfully
- [ ] Admin can see tracking number input when selecting "shipped" status
- [ ] "Update Status" button is disabled without tracking number
- [ ] Order updates successfully with tracking number
- [ ] Customer receives email with correct tracking link
- [ ] Confirmation page shows "Track Your Parcel" button for shipped orders
- [ ] Tracking link opens Jeebly page with correct AWB number
- [ ] Button only appears for shipped orders with tracking numbers
- [ ] Works correctly for both regular orders and claimed gift orders

## Future Enhancements
- Add tracking number to admin order details view
- Show tracking history/status updates
- Add ability to update/change tracking number
- Send automated tracking status updates
- Support multiple courier services
