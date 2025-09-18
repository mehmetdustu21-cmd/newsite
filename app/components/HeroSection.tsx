'use client';

import { motion } from 'framer-motion';
import FuturisticBackground from './FuturisticBackground';

export default function HeroSection() {
  const handleDemoRequest = () => {
    const demoSection = document.getElementById('demo-form');
    demoSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHowItWorks = () => {
    const featuresSection = document.getElementById('features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0">
        <FuturisticBackground />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 font-space-grotesk leading-[0.9] tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-slate-900 block font-extrabold">İletişiminizi</span>
            <span className="text-indigo-600 font-black block">Dijitalleştirin</span>
            <span className="text-slate-700 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium block mt-6 font-poppins">
              EasyChat ile 7/24 Müşteri Desteği
            </span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl lg:text-2xl mb-12 text-slate-600 font-poppins font-normal max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            WhatsApp, web ve mobil platformlarda
            <span className="text-slate-800 font-medium"> akıllı chat asistanı</span>
            ile müşteri deneyiminizi üst seviyeye taşıyın.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button
              onClick={handleDemoRequest}
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 ease-out hover:shadow-lg hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="flex items-center gap-2">
                Demo Talep Et
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <button
              onClick={handleHowItWorks}
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all duration-200 ease-out hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                Özellikler
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <div className="flex flex-col items-center text-gray-400">
          <span className="text-sm mb-2 font-poppins">Keşfet</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gradient-to-b from-purple-500 to-transparent rounded-full animate-pulse mt-2"></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
