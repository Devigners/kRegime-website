import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmation',
  description:
    'Thank you for your order! Your Korean skincare regime is on its way.',
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

export default function ConfirmationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
