# SEO Post-Deployment Checklist

## Immediate Actions (Within 24 Hours)

- [ ] **Verify sitemap is accessible**
  - Visit: https://kregime.com/sitemap.xml
  - Should display XML with all pages listed
  
- [ ] **Verify robots.txt is accessible**
  - Visit: https://kregime.com/robots.txt
  - Should show disallow rules for /admin/, /api/, etc.

- [ ] **Test admin route protection**
  - Visit: https://kregime.com/admin
  - Page should load but have `<meta name="robots" content="noindex, nofollow">`
  - View page source to confirm

- [ ] **Add Google Search Console**
  - Go to: https://search.google.com/search-console
  - Add property for https://kregime.com
  - Get verification code
  - Add code to `/src/app/layout.tsx` (line with google-site-verification)
  - Redeploy
  - Verify in Search Console

- [ ] **Submit sitemap to Google**
  - In Search Console, go to Sitemaps
  - Submit: https://kregime.com/sitemap.xml
  - Wait for processing (can take hours to days)

- [ ] **Test meta tags**
  - Use browser inspector (F12) on homepage
  - Check `<head>` section has:
    - Title tag
    - Meta description
    - Open Graph tags (og:title, og:description, og:image)
    - Twitter card tags
    - Canonical URL

- [ ] **Test structured data**
  - Go to: https://search.google.com/test/rich-results
  - Enter: https://kregime.com
  - Should show Organization and WebSite schema
  - No errors should appear

## Within First Week

- [ ] **Test Open Graph**
  - Go to: https://developers.facebook.com/tools/debug/
  - Enter: https://kregime.com
  - Click "Scrape Again"
  - Check preview looks correct
  - Test sharing on Facebook

- [ ] **Test Twitter Cards**
  - Go to: https://cards-dev.twitter.com/validator
  - Enter: https://kregime.com
  - Preview should show large image card
  - Test sharing on Twitter

- [ ] **Mobile-friendly test**
  - Go to: https://search.google.com/test/mobile-friendly
  - Enter: https://kregime.com
  - Should pass with no issues

- [ ] **PageSpeed test**
  - Go to: https://pagespeed.web.dev/
  - Test: https://kregime.com
  - Review suggestions (aim for 80+ score)

- [ ] **Add to Bing Webmaster Tools**
  - Go to: https://www.bing.com/webmasters
  - Add and verify site
  - Submit sitemap

- [ ] **Set up Google Analytics 4** (if not done)
  - Create GA4 property
  - Add tracking code to site
  - Verify data is coming in

- [ ] **Check indexing status**
  - Google: `site:kregime.com`
  - Should see homepage (may take days)
  - Should NOT see /admin pages

## Within First Month

- [ ] **Update social media profiles**
  - Add website URL to all profiles
  - Ensure profile names match brand
  - Update structured data with social URLs

- [ ] **Monitor Search Console**
  - Check for crawl errors
  - Review which pages are indexed
  - Check for mobile usability issues
  - Review security issues (should be none)

- [ ] **Create Google Business Profile**
  - Add business to Google Maps
  - Add photos
  - Add business hours
  - Verify location

- [ ] **Analyze initial traffic**
  - Review GA4 data
  - Check which pages are visited
  - Review traffic sources
  - Check bounce rate

- [ ] **Content audit**
  - Review all page content
  - Check for spelling/grammar
  - Ensure CTAs are clear
  - Verify all links work

- [ ] **Create content calendar**
  - Plan blog posts (if applicable)
  - Schedule product launches
  - Plan social media content

## Ongoing (Monthly)

- [ ] **Review Search Console**
  - Check for new crawl errors
  - Review search queries
  - Monitor click-through rates
  - Check for manual actions

- [ ] **Analyze competitors**
  - Research competing keywords
  - Check their meta descriptions
  - Review their content strategy
  - Identify gaps and opportunities

- [ ] **Update content**
  - Refresh old content
  - Add new keywords naturally
  - Update product descriptions
  - Add new blog posts (if applicable)

- [ ] **Check backlinks**
  - Monitor new backlinks
  - Disavow spam links if needed
  - Reach out for guest posting

- [ ] **Review analytics**
  - Check traffic trends
  - Review conversion rates
  - Identify top-performing pages
  - Optimize underperforming pages

## Quarterly Review

- [ ] **Comprehensive SEO audit**
  - Review all meta tags
  - Check for broken links
  - Review page speed
  - Check mobile compatibility
  - Review structured data

- [ ] **Keyword research**
  - Find new keyword opportunities
  - Check keyword rankings
  - Update keyword strategy
  - Optimize for new trends

- [ ] **Content strategy review**
  - Review content performance
  - Update editorial calendar
  - Plan new content types
  - Review user engagement

- [ ] **Technical SEO check**
  - Verify sitemap is up-to-date
  - Check robots.txt is correct
  - Review canonical URLs
  - Check for duplicate content

## Annual Review

- [ ] **Full website audit**
  - Comprehensive SEO audit
  - User experience review
  - Conversion rate optimization
  - Technical performance review

- [ ] **Strategy update**
  - Review yearly goals
  - Update SEO strategy
  - Plan for next year
  - Budget review

- [ ] **Competitor analysis**
  - In-depth competitor research
  - Market trend analysis
  - New opportunity identification

## Notes

### Important Reminders
- SEO is a long-term strategy (takes 3-6 months to see results)
- Focus on quality content over quantity
- Never buy links or use black-hat techniques
- Mobile optimization is critical
- Page speed matters for rankings

### When to Update SEO Settings
- New products launched: Update sitemap
- New pages added: Add to sitemap
- Content refreshed: Update meta descriptions
- Business info changes: Update structured data

### Red Flags to Watch For
- Sudden traffic drops (check Search Console)
- Manual actions (check Search Console)
- Security warnings (fix immediately)
- Crawl errors (investigate and fix)
- Duplicate content (use canonical tags)

## Resources

### Tools
- Google Search Console: https://search.google.com/search-console
- Google Analytics: https://analytics.google.com/
- PageSpeed Insights: https://pagespeed.web.dev/
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- Rich Results Test: https://search.google.com/test/rich-results

### Documentation
- Full SEO docs: `/docs/SEO_IMPLEMENTATION.md`
- Quick reference: `/docs/SEO_QUICK_REFERENCE.md`

### Support
- Email: care@kregime.com
- Website: https://kregime.com
