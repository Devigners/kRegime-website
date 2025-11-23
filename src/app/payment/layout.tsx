import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Checkout',
  description:
    'Complete your order securely with our encrypted payment system.',
  openGraph: {
    type: 'website',
    url: 'https://kregime.com/payment',
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
    images: ['/meta-image.png'],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
