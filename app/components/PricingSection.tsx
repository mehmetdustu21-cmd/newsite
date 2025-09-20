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
        {/* CTA Section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold font-poppins text-slate-800 mb-4">
              Siz de Dijital Dönüşümünüze Başlayın
            </h3>
            <p className="text-slate-600 font-poppins mb-6">
              Ücretsiz analiz ve kişiselleştirilmiş demo için hemen iletişime geçin
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={handleGetStarted}
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Demo Talep Et
              </motion.button>
              
              <a 
                href="tel:08503463864"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-all duration-200"
              >
                📞 0850 346 3864
              </a>
            </div>

            <div className="mt-4 text-sm text-slate-500 font-poppins">
              Email: hello@easychat.com.tr
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}