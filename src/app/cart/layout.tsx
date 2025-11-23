import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description:
    'Review your Korean skincare regime selection and proceed to checkout.',
  openGraph: {
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

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
