'use client';

import { motion } from 'framer-motion';

export default function PricingSection() {
  const handleGetStarted = () => {
    const demoSection = document.getElementById('demo-form');
    demoSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
      </div>
    </section>
  );
}