import AdminLayout from '@/components/AdminLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - KREGIME',
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
