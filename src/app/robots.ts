import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/cart', '/payment', '/confirmation'],
      },
    ],
    sitemap: 'https://kregime.com/sitemap.xml',
  };
}
