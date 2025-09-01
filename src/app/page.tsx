import {
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  KoreanBrandsSection,
  ProductsSection,
  ReviewsSection,
  TransformationsSection,
} from '@/components/sections';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <KoreanBrandsSection />
      <TransformationsSection />
      <ProductsSection />
      <HowItWorksSection />
      <ReviewsSection />
    </>
  );
}
