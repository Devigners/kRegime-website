import {
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  KoreanBrandsSection,
  ProductsSection,
  ReviewsSection,
  TransformationsSection,
} from '@/components/sections';
import ComingSoon from '@/components/ComingSoon';
import BackToTop from '@/components/BackToTop';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KREGIME - Handpicked Korean Skincare Regimes Simplified',
  description: 'Discover your perfect Korean skincare routine with our expertly curated 3, 5, or 7 steps regime boxes featuring premium Korean skincare products. Free delivery across UAE within 2 days.',
  openGraph: {
    title: 'KREGIME - Handpicked Korean Skincare Regimes Simplified',
    description: 'Discover your perfect Korean skincare routine with our expertly curated regime boxes',
    images: ['/logo.svg'],
  },
  alternates: {
    canonical: 'https://kregime.com',
  },
};

export default function Home() {
  // Check if coming soon mode is enabled
  const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === 'true';

  // Add structured data for the homepage
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: 'KREGIME',
    description: 'Handpicked Korean Skincare Regimes Simplified',
    url: 'https://kregime.com',
    logo: 'https://kregime.com/logo.svg',
    image: 'https://kregime.com/logo.svg',
    priceRange: 'AED',
    servesCuisine: 'Korean Beauty Products',
    areaServed: {
      '@type': 'Country',
      name: 'United Arab Emirates',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Skincare Regimes',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: '3-Step Korean Skincare Regime',
            description: 'Curated 3-step Korean skincare routine',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: '5-Step Korean Skincare Regime',
            description: 'Curated 5-step Korean skincare routine',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: '7-Step Korean Skincare Regime',
            description: 'Curated 7-step Korean skincare routine',
          },
        },
      ],
    },
  };

  // If coming soon mode is enabled, show the ComingSoon component
  if (isComingSoon) {
    return <ComingSoon />;
  }

  // Otherwise, show the regular homepage content
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <FeaturesSection />
      <KoreanBrandsSection />
      <TransformationsSection />
      <ProductsSection />
      <HowItWorksSection />
      <ReviewsSection />
      <BackToTop />
    </>
  );
}
