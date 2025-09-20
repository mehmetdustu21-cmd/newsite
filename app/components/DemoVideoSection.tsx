'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function DemoVideoSection() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-light font-poppins mb-6 text-slate-800">
            <span className="font-semibold text-indigo-600">Canlı Demo</span> İzleyin
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto font-poppins leading-relaxed">
            EasyChat'in nasıl çalıştığını 2 dakikada görün
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Video Placeholder - Replace with actual video */}
            <div className="relative aspect-video bg-gradient-to-br from-indigo-900 to-purple-900">
              {!isPlaying ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    onClick={handlePlay}
                    className="group flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg 
                      className="w-8 h-8 text-white ml-1" 
                      fill="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </motion.button>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-lg">Demo video yükleniyor...</p>
                    <p className="text-sm text-gray-300 mt-2">Gerçek video burada görünecek</p>
                  </div>
                </div>
              )}
              
              {/* Video overlay info */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                  <p className="text-white text-sm font-medium">EasyChat Demo</p>
                  <p className="text-gray-300 text-xs">2:30 dakika</p>
                </div>
                <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                  <p className="text-white text-sm">HD</p>
                </div>
              </div>
            </div>

            {/* Video description */}
            <div className="p-8">
              <h3 className="text-2xl font-semibold text-slate-800 mb-4 font-poppins">
                EasyChat Nasıl Çalışır?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">Kurulum</h4>
                    <p className="text-slate-600 text-sm">WhatsApp ve web sitenize 1 dakikada entegre edin</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">AI Eğitimi</h4>
                    <p className="text-slate-600 text-sm">Asistanınızı işinize özel olarak eğitin</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">Otomatik Yanıt</h4>
                    <p className="text-slate-600 text-sm">Müşterilerinizle 7/24 otomatik iletişim</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => {
              const demoSection = document.getElementById('demo-form');
              demoSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200 ease-out hover:shadow-lg hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center gap-2">
              Hemen Deneyin
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
