# Deployment Checklist - Stripe Environment Configuration

Use this checklist when deploying with the new Stripe environment configuration.

## 🧪 Staging/Testing Deployment

### Environment Variables
- [ ] Set `NEXT_PUBLIC_STRIPE_ENV=test`
- [ ] Verify test Stripe publishable key: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`
- [ ] Verify test Stripe secret key: `STRIPE_SECRET_KEY=sk_test_...`
- [ ] Verify test webhook secret: `STRIPE_WEBHOOK_SECRET=whsec_test_...`

### Pre-Deployment
- [ ] Clear `.next` build directory
- [ ] Run `npm run build` successfully
- [ ] No TypeScript compilation errors
- [ ] No ESLint errors (warnings are okay)

### Post-Deployment Testing
- [ ] Open browser console and check: `console.log(process.env.NEXT_PUBLIC_STRIPE_ENV)`
  - Should show: `"test"`
- [ ] Initiate a test checkout
- [ ] Check Network tab → `/api/stripe/checkout` request
  - Product IDs should start with `prod_TM6...`
  - Price IDs should start with `price_1SPN...` or `price_1SPO...`
- [ ] Complete checkout with test card: `4242 4242 4242 4242`
- [ ] Verify order created successfully
- [ ] Check Stripe Dashboard (Test mode) for payment

### Verification Points
- [ ] ✅ Using test Stripe products
- [ ] ✅ Using test API keys
- [ ] ✅ Test webhook receiving events
- [ ] ✅ No real money charged

---

## 🚀 Production Deployment

### Environment Variables
- [ ] Set `NEXT_PUBLIC_STRIPE_ENV=production`
- [ ] Verify live Stripe publishable key: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
- [ ] Verify live Stripe secret key: `STRIPE_SECRET_KEY=sk_live_...`
- [ ] Verify live webhook secret: `STRIPE_WEBHOOK_SECRET=whsec_live_...`
- [ ] Set correct production URL: `NEXT_PUBLIC_APP_URL=https://yourproductiondomain.com`

### Pre-Deployment
- [ ] Test thoroughly in staging first
- [ ] Backup database
- [ ] Clear `.next` build directory
- [ ] Run `npm run build` successfully
- [ ] No TypeScript compilation errors
- [ ] Review all code changes

### Stripe Dashboard Verification
- [ ] All production products exist in Stripe Dashboard
- [ ] All production prices are correct
- [ ] Production webhook endpoint configured
- [ ] Webhook endpoint URL is correct: `https://yourproductiondomain.com/api/stripe/webhook`
- [ ] Webhook events configured correctly:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

### Post-Deployment Testing
- [ ] Open browser console and check: `console.log(process.env.NEXT_PUBLIC_STRIPE_ENV)`
  - Should show: `"production"`
- [ ] Initiate a test checkout
- [ ] Check Network tab → `/api/stripe/checkout` request
  - Product IDs should start with `prod_TM9...`
  - Price IDs should start with `price_1SPRc...`
- [ ] **IMPORTANT**: Complete a small real transaction to verify
  - Use a real payment method (will charge actual money)
  - Use the smallest possible amount for testing
  - Verify order created successfully
  - Verify payment received in Stripe Dashboard (Live mode)
  - Verify webhook received and processed
  - Verify email notifications sent

### Verification Points
- [ ] ✅ Using production Stripe products
- [ ] ✅ Using live API keys
- [ ] ✅ Live webhook receiving events
- [ ] ✅ Real payments processing correctly
- [ ] ✅ Order confirmation emails sending
- [ ] ✅ Database orders recording correctly

### Monitoring (First 24 Hours)
- [ ] Monitor Stripe Dashboard for incoming payments
- [ ] Check webhook event logs for any failures
- [ ] Monitor server logs for errors
- [ ] Check database for order consistency
- [ ] Verify customer emails are being delivered

---

## 🔄 Environment Switching

### Switching from Test to Production
- [ ] Update `NEXT_PUBLIC_STRIPE_ENV=production`
- [ ] Update all Stripe API keys (pk_live, sk_live, whsec_live)
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Rebuild application
- [ ] Redeploy
- [ ] Test with real transaction

### Switching from Production to Test
- [ ] Update `NEXT_PUBLIC_STRIPE_ENV=test`
- [ ] Update all Stripe API keys (pk_test, sk_test, whsec_test)
- [ ] Update `NEXT_PUBLIC_APP_URL` to staging domain
- [ ] Rebuild application
- [ ] Redeploy
- [ ] Test with test card (4242...)

---

## 🚨 Troubleshooting

### Wrong Products Being Used

**Problem**: Seeing test product IDs in production (or vice versa)

**Solutions**:
1. Check environment variable: `echo $NEXT_PUBLIC_STRIPE_ENV`
2. Verify in browser console: `console.log(process.env.NEXT_PUBLIC_STRIPE_ENV)`
3. Clear build and rebuild: `rm -rf .next && npm run build`
4. Restart server/redeploy

### API Key Mismatch

**Problem**: Errors like "No such product" or "Invalid API key"

**Solutions**:
1. Verify API keys match environment:
   - Test environment → pk_test_ and sk_test_
   - Production environment → pk_live_ and sk_live_
2. Check Stripe Dashboard mode matches environment
3. Verify product IDs exist in the correct Stripe account mode

### Webhook Not Receiving Events

**Problem**: Orders not updating, emails not sending

**Solutions**:
1. Verify webhook endpoint URL is correct in Stripe Dashboard
2. Check webhook secret matches environment
3. Test webhook endpoint manually in Stripe Dashboard
4. Check server logs for webhook errors
5. Verify webhook events are configured correctly

### Build Failures

**Problem**: TypeScript or build errors

**Solutions**:
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear Next.js cache: `rm -rf .next`
3. Check for TypeScript errors: `npm run build`
4. Verify all imports are correct

---

## 📝 Notes

- **Always test in staging first** before deploying to production
- **Keep environment variables secure** - never commit `.env.local` or `.env.production`
- **Monitor closely** after production deployment
- **Have rollback plan ready** in case of issues
- **Document any issues** encountered for future reference

---

## ✅ Sign-off

### Staging Deployment
- [ ] All tests passed
- [ ] Environment verified
- [ ] Ready for production

**Deployed by**: _______________  
**Date**: _______________  
**Time**: _______________

### Production Deployment
- [ ] All tests passed
- [ ] Real transaction verified
- [ ] Monitoring in place
- [ ] Team notified

**Deployed by**: _______________  
**Date**: _______________  
**Time**: _______________  
**Initial monitoring period**: _______________ hours
