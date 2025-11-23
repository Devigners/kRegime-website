import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customize Your Skincare Regime',
  description:
    'Answer a few questions to get your personalized Korean skincare regime tailored to your skin type and concerns.',
  openGraph: {
    images: ['/meta-image.webp'],
  },
  twitter: {
    images: ['/meta-image.webp'],
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
