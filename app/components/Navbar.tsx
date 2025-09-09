'use client';

import { motion } from 'framer-motion';

export default function Navbar() {
  const handleDemoRequest = () => {
    const demoSection = document.getElementById('demo-form');
    demoSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Sol tarafta */}
          <div className="flex items-center">
            <a href="/" className="flex items-center hover:opacity-80 transition-opacity duration-200">
              <img 
                src="/easychat-logo.svg"
                alt="EasyChat Logo"
                className="h-10 w-auto"
              />
            </a>
          </div>

          {/* Navigation Menu - Ortada */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors duration-200 font-poppins">
              Özellikler
            </a>
            <a href="#demo-form" className="text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors duration-200 font-poppins">
              İletişim
            </a>
          </div>

          {/* CTA Button - Sağ tarafta */}
          <motion.button
            onClick={handleDemoRequest}
            className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 ease-out hover:shadow-lg hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Demo Talep Et
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
