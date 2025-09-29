import AdminLayout from '@/components/AdminLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - kRegime',
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}