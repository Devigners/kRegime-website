import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmation',
  description: 'Thank you for your order! Your Korean skincare regime is on its way.',
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
