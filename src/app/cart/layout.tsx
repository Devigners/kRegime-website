import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description:
    'Review your Korean skincare regime selection and proceed to checkout.',
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

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
