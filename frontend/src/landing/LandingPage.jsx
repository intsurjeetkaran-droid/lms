import { useEffect } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import PricingSection from './PricingSection';
import ProviderSection from './ProviderSection';
import CTASection from './CTASection';
import Footer from './Footer';

const LandingPage = () => {
  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <PricingSection />
      <ProviderSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default LandingPage;
