'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const faqs = [
  {
    question: 'Kurulum zor mu?',
    answer: 'Hayır, 1 saatte aktif oluyor. Teknik bilgi gerektirmez, sadece birkaç tıkla WhatsApp ve web sitenize entegre edebilirsiniz.',
  },
  {
    question: 'Hangi platformları destekliyorsunuz?',
    answer: 'WhatsApp Business, website chat widget, Facebook Messenger, Instagram DM ve popüler CRM sistemleri (HubSpot, Salesforce, vb.) destekleniyor.',
  },
  {
    question: 'AI ne kadar doğru yanıt veriyor?',
    answer: 'AI asistanımız %95 doğruluk oranıyla çalışır. Anlayamadığı durumları size yönlendirir ve her gün öğrenmeye devam eder.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-light font-poppins mb-6 text-slate-800">
            <span className="font-semibold text-indigo-600">Sık Sorulan</span> Sorular
          </h2>
          <p className="text-lg text-slate-600 font-poppins">
            Merak ettiklerinizin cevapları burada
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-white rounded-lg border border-slate-200 hover:border-slate-300 transition-all duration-200 overflow-hidden hover:shadow-md">
                {/* Question */}
                <motion.button
                  onClick={() => toggleFAQ(index)}
                  className="w-full p-6 text-left flex items-center justify-between focus:outline-none hover:bg-slate-50"
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-semibold text-slate-800 font-poppins pr-8">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <svg 
                      className="w-5 h-5 text-slate-500 transition-colors duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.div>
                </motion.button>

                {/* Answer */}
                <motion.div
                  initial={false}
                  animate={{
                    height: openIndex === index ? 'auto' : 0,
                    opacity: openIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6">
                    <div className="border-t border-slate-200 pt-4">
                      <p className="text-slate-600 leading-relaxed font-poppins">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Gradient border effect on hover */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact for more questions */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 font-poppins mb-6">
            Başka sorularınız mı var?
          </p>
          <motion.a
            href="#demo-form"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-300 font-poppins"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            Bizimle iletişime geçin
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
