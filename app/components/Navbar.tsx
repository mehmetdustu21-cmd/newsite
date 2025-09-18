'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const navigationLinks = [
  { href: '#features', label: 'Ozellikler' },
  { href: '#demo-form', label: 'Iletisim' },
  { href: '/chat-history', label: 'Sohbet Gecmisi' },
  { href: '/login', label: 'Giris Yap' }
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDemoRequest = () => {
    const demoSection = document.getElementById('demo-form');
    demoSection?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  const toggleMobileMenu = () => setMobileOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity duration-200"
              onClick={closeMobileMenu}
            >
              <img src="/easychat-logo.svg" alt="EasyChat Logo" className="h-10 w-auto" />
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors duration-200 font-poppins"
              >
                {item.label}
              </a>
            ))}
          </div>

          <motion.button
            onClick={handleDemoRequest}
            className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 ease-out hover:shadow-lg hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Demo Talep Et
          </motion.button>

          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={handleDemoRequest}
              className="mr-2 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Demo
            </button>
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white p-2 text-slate-600 shadow-sm transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Mobil menuyu ac"
              aria-expanded={mobileOpen}
            >
              <span className="sr-only">Menu</span>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-sm shadow-lg"
          >
            <div className="px-4 py-4 space-y-2">
              {navigationLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={handleDemoRequest}
                className="mt-2 w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Demo Talep Et
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
