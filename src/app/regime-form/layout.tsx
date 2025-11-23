import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customize Your Skincare Regime',
  description:
    'Answer a few questions to get your personalized Korean skincare regime tailored to your skin type and concerns.',
  openGraph: {
    type: 'website',
    url: 'https://kregime.com/regime-form',
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
    follow: true,
  },
};

export default function RegimeFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
