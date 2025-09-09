'use client';

import { motion } from 'framer-motion';

const benefits = [
  {
    title: 'Anında Yanıt',
    description: 'Müşterilerinizin sorularına saniyeler içinde yanıt verin. AI destekli sistem 7/24 aktif.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    gradient: 'from-purple-500 to-pink-500',
    features: ['Saniyeler içinde cevap', 'AI destekli yanıtlar', 'Çoklu dil desteği']
  },
  {
    title: 'Randevu Yönetimi',
    description: 'Google Calendar entegrasyonu ile otomatik randevu planlaması. Müşteriler direkt slot seçebilir.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    gradient: 'from-blue-500 to-cyan-500',
    features: ['Google Calendar sync', 'Otomatik hatırlatma', 'Esnek zaman slotları']
  },
  {
    title: 'Kolay Entegrasyon',
    description: 'WhatsApp, Web, CRM sistemlerinize dakikalar içinde entegre edin. Kod yazmaya gerek yok.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    gradient: 'from-emerald-500 to-green-500',
    features: ['WhatsApp Business', 'Website widget', 'CRM entegrasyonu']
  },
];

export default function BenefitCards() {
  return (
    <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-light font-poppins mb-6 text-slate-800">
            Neden <span className="font-semibold text-indigo-600">EasyChat?</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto font-poppins leading-relaxed">
            İşinizi büyütecek güçlü özelliklerle donatılmış akıllı asistan çözümü
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Card */}
              <div className="h-full p-8 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all duration-200 hover:shadow-lg group-hover:shadow-xl">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200">
                  {benefit.icon}
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-slate-800 font-poppins">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-6 font-poppins">
                    {benefit.description}
                  </p>

                  {/* Features list */}
                  <ul className="space-y-3">
                    {benefit.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-slate-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
