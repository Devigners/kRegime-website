import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Secure Checkout',
  description:
    'Complete your order securely with our encrypted payment system.',
  openGraph: {
    images: ['/meta-image.webp'],
  },
  twitter: {
    images: ['/meta-image.webp'],
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
