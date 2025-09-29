'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === 'true';
  
  // Check if we're on an admin route
  const isAdminRoute = pathname?.startsWith('/admin');

  // If it's an admin route, just render children without header/footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // For non-admin routes, render with header and footer
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1">{children}</main>
      {!isComingSoon && <Footer />}
    </div>
  );
}