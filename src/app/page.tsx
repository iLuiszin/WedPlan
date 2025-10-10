'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { PricingSection } from '@/components/sections/pricing-section';
import { Footer } from '@/components/layouts/footer';
import { Section } from '@/components/layouts/section';
import { CreateProjectModal } from '@/features/projects/components/create-project-modal';
import { LoginModal } from '@/components/auth/login-modal';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'create' | 'access'>('create');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Using id-based scrolling; ref not required

  const handleCreateProject = () => {
    setIsCreateModalOpen(true);
  };

  const handleLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleScrollToFeatures = () => {
    // Prefer target by id to avoid ref coupling and honor sticky header height
    const target = document.getElementById('features');
    if (!target) return;

    const header = document.querySelector('header') as HTMLElement | null;
    const headerHeight = header?.offsetHeight ?? 80; // fallback if header not found

    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8; // small extra gap
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* Hero - Full viewport height */}
      <HeroSection
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onCreateProject={handleCreateProject}
        onLogin={handleLogin}
        onScrollToNext={handleScrollToFeatures}
      />

      {/* Features */}
      <Section
        id="features"
        ariaLabelledBy="features-heading"
        width="wide"
        padding="md"
        backgroundClassName="bg-gradient-to-b from-white to-cream"
      >
        <FeaturesSection />
      </Section>

      {/* Testimonials */}
      <Section
        ariaLabelledBy="testimonials-heading"
        width="wide"
        padding="md"
        backgroundClassName="bg-gradient-to-b from-cream to-white"
      >
        <TestimonialsSection />
      </Section>

      {/* Pricing - Enhanced with CTA elements */}
      <Section
        id="pricing"
        ariaLabelledBy="pricing-heading"
        width="wide"
        padding="md"
        backgroundClassName="bg-gradient-to-b from-white to-cream"
      >
        <PricingSection onGetStarted={handleCreateProject} />
      </Section>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <CreateProjectModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
