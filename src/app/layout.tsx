import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import '../styles/globals.css';
import ConditionalLayout from '@/components/ConditionalLayout';
import { Toaster } from 'sonner';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kregime.com'),
  title: {
    default: 'KREGIME - Handpicked Korean Skincare Regimes Simplified',
    template: '%s | KREGIME',
  },
  description:
    'Discover your perfect Korean skincare routine with our expertly curated 3, 5, or 7 steps regime boxes featuring premium Korean skincare products. Free delivery across UAE within 2 days.',
  keywords: [
    'Korean skincare',
    'Korean skin care',
    'skincare routine',
    'Handpicked',
    'personalized skincare',
    'Korean beauty products',
    'skincare regime',
    'beauty subscription',
    'K-beauty UAE',
    'Korean skincare Dubai',
    'Korean beauty box',
    'customized skincare',
    'skincare delivery UAE',
  ],
  authors: [{ name: 'KREGIME', url: 'https://kregime.com' }],
  creator: 'KREGIME',
  publisher: 'KREGIME',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'KREGIME - Handpicked Korean Skincare Regimes Simplified',
    description:
      'Discover your perfect Korean skincare routine with our expertly curated 3, 5, or 7 steps regime boxes featuring premium Korean skincare products.',
    type: 'website',
    locale: 'en_US',
    url: 'https://kregime.com',
    siteName: 'KREGIME',
    images: [
      {
        url: '/meta-image.png',
        width: 1200,
        height: 628,
        alt: 'KREGIME - Korean Skincare Made Simple',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KREGIME - Handpicked Korean Skincare Regimes',
    description:
      'Discover your perfect Korean skincare routine with Handpicked regime boxes.',
    images: ['/meta-image.png'],
    creator: '@kregime',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://kregime.com',
  },
  category: 'Beauty & Personal Care',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'KREGIME',
    url: 'https://kregime.com',
    logo: 'https://kregime.com/logo.svg',
    description: 'Handpicked Korean Skincare Regimes Simplified',
    sameAs: [
      'https://www.instagram.com/kregime',
      'https://www.facebook.com/kregime',
      'https://www.tiktok.com/@kregime.official',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'care@kregime.com',
      contactType: 'Customer Service',
      areaServed: 'AE',
      availableLanguage: ['English'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AE',
      addressRegion: 'Dubai',
    },
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'KREGIME',
    url: 'https://kregime.com',
    description:
      'Discover your perfect Korean skincare routine with our expertly curated regime boxes',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://kregime.com/?s={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="apple-mobile-web-app-title" content="KREGIME" />
        <meta name="theme-color" content="#EF7E71" />
        <meta name="google-site-verification" content="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${dmSans.variable} ${playfairDisplay.variable} font-sans antialiased`}
      >
        <ConditionalLayout>{children}</ConditionalLayout>
        <Toaster position="bottom-right" richColors theme="light" closeButton />
      </body>
    </html>
  );
}
