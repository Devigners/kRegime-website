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
  title: 'Kregime - Handpicked Korean Skincare Regimes Simplified',
  description:
    'Discover your perfect Korean skincare routine with our expertly curated 3, 5, or 7 steps regime boxes featuring premium Korean skincare products.',
  keywords: [
    'Korean skincare',
    'K-beauty',
    'skincare routine',
    'Handpicked',
    'personalized skincare',
    'Korean beauty products',
    'skincare regime',
    'beauty subscription',
  ],
  authors: [{ name: 'Kregime' }],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'Kregime - Handpicked Korean Skincare Regimes Simplified',
    description:
      'Discover your perfect Korean skincare routine with our expertly curated 3, 5, or 7 steps regime boxes featuring premium Korean skincare products.',
    type: 'website',
    locale: 'en_US',
    url: 'https://kregime.com',
    siteName: 'Kregime',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'Kregime - Korean Skincare Made Simple',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kregime - Handpicked Korean Skincare Regimes',
    description:
      'Discover your perfect Korean skincare routine with Handpicked regime boxes.',
    images: ['/logo.svg'],
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
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="apple-mobile-web-app-title" content="Kregime" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${dmSans.variable} ${playfairDisplay.variable} font-sans antialiased`}
      >
        <ConditionalLayout>{children}</ConditionalLayout>
        <Toaster 
          position="bottom-right" 
          richColors 
          theme="light"
          closeButton
        />
      </body>
    </html>
  );
}
