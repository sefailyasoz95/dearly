import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { PricingSection } from '@/components/sections/pricing-section';
import { CallToActionSection } from '@/components/sections/cta-section';

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <CallToActionSection />
    </div>
  );
}