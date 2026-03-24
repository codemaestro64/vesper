import HeroSection from '@/components/sections/Hero';
import HowItWorks from '@/components/sections/HowItWorks';
import TemplatesShowcase from '@/components/sections/TemplatesShowcase';
import CompareSection from '@/components/sections/Compare';
import FeaturesSection from '@/components/sections/Features';
import AudienceSection from '@/components/sections/Audience';
import TrustSection from '@/components/sections/Trust';
import CTASection from '@/components/sections/CTA';

export default function Home() {
  return (
    <div className="bg-background pt-16">
      <HeroSection />
      <HowItWorks />
      <TemplatesShowcase />
      <CompareSection />
      <FeaturesSection />
      <AudienceSection />
      <TrustSection />
      <CTASection />
    </div>
  );
}
