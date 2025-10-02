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

export default function Home() {
  // Check if coming soon mode is enabled
  const isComingSoon = process.env.NEXT_PUBLIC_COMING_SOON === 'true';

  // If coming soon mode is enabled, show the ComingSoon component
  if (isComingSoon) {
    return <ComingSoon />;
  }

  // Otherwise, show the regular homepage content
  return (
    <>
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
