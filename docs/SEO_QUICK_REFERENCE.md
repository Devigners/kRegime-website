# SEO Quick Reference Guide

## Quick Links

- **Sitemap**: https://kregime.com/sitemap.xml
- **Robots.txt**: https://kregime.com/robots.txt
- **Admin Panel**: Hidden from search engines ✓

## Testing URLs

### Validation Tools
1. **Rich Results Test**: https://search.google.com/test/rich-results
   - Test your homepage: https://kregime.com
   
2. **Mobile-Friendly Test**: https://search.google.com/test/mobile-friendly
   - Test all pages
   
3. **PageSpeed Insights**: https://pagespeed.web.dev/
   - Test performance
   
4. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
   - Test Open Graph tags
   
5. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
   - Test Twitter cards

## Files to Update

### 1. Add Google Site Verification
**File**: `/src/app/layout.tsx`
**Line**: Look for `<meta name="google-site-verification" content="" />`
**Action**: Add your verification code from Google Search Console

### 2. Add Social Media Links
**File**: `/src/app/layout.tsx`
**Section**: `jsonLd` object, in the `sameAs` array
**Action**: Uncomment and add your social media URLs:
```typescript
sameAs: [
  'https://www.instagram.com/kregime',
  'https://www.facebook.com/kregime',
  'https://twitter.com/kregime',
],
```

## Page Index Status

| Page | Indexed? | Reason |
|------|----------|--------|
| Homepage (/) | ✅ Yes | Main page |
| /regime-form | ❌ No | User customization |
| /cart | ❌ No | Transactional |
| /payment | ❌ No | Secure/Private |
| /confirmation | ❌ No | User-specific |
| /privacy | ✅ Yes | Legal/Important |
| /terms | ✅ Yes | Legal/Important |
| /admin/* | ❌ No | Internal use only |
| /api/* | ❌ No | Backend endpoints |

## Metadata Summary

### Homepage
- **Title**: KREGIME - Handpicked Korean Skincare Regimes Simplified
- **Description**: Discover your perfect Korean skincare routine with our expertly curated 3, 5, or 7 steps regime boxes featuring premium Korean skincare products. Free delivery across UAE within 2 days.
- **Structured Data**: Organization, Website, Product Catalog

### Privacy Policy
- **Title**: Privacy Policy | KREGIME
- **Canonical**: https://kregime.com/privacy

### Terms of Service
- **Title**: Terms of Service | KREGIME
- **Canonical**: https://kregime.com/terms

## Keywords Targeting

### Primary
- Korean skincare
- Skincare routine
- Personalized skincare
- Korean beauty products

### UAE-Specific
- K-beauty UAE
- Korean skincare Dubai
- Skincare delivery UAE

## Next Steps After Deployment

1. **Submit to Google Search Console**
   - Go to: https://search.google.com/search-console
   - Add property: https://kregime.com
   - Verify ownership (add verification code to layout.tsx)
   - Submit sitemap: https://kregime.com/sitemap.xml

2. **Submit to Bing Webmaster Tools**
   - Go to: https://www.bing.com/webmasters
   - Add and verify site
   - Submit sitemap

3. **Set Up Analytics**
   - Google Analytics 4
   - Google Tag Manager (optional)
   - Microsoft Clarity (optional)

4. **Monitor Performance**
   - Check Search Console weekly
   - Review analytics monthly
   - Update content quarterly

## Common Commands

### Test locally
```bash
npm run dev
# Visit http://localhost:3000/sitemap.xml
# Visit http://localhost:3000/robots.txt
```

### Build and test
```bash
npm run build
npm run start
```

## Troubleshooting

### Sitemap not showing?
- Check `/src/app/sitemap.ts` exists
- Rebuild the project: `npm run build`
- Clear browser cache

### Admin showing in search results?
- Check robots.txt has `/admin/` in disallow
- Check admin layout has `noindex` in metadata
- Request removal in Google Search Console if needed

### Meta tags not updating?
- Clear browser cache
- Check layout.tsx has correct metadata
- Verify page-specific layouts are working

## Contact & Support

- **Email**: care@kregime.com
- **Documentation**: See `/docs/SEO_IMPLEMENTATION.md` for full details
