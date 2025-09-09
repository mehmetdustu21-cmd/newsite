'use client';

import { motion } from 'framer-motion';

const features = [
  {
    title: 'Hızlı Yanıt',
    description: 'Müşterilerinizin sorularına milisaniyeler içinde yanıt verin. AI destekli sistem anında çözüm sunar.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: '7/24 Asistan',
    description: 'Hiç durmayan AI asistanınız her zaman hazır. Gece gündüz müşteri memnuniyeti için çalışır.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Kolay Entegrasyon',
    description: 'Mevcut sisteminize dakikalar içinde entegre edin. Kod yazmaya gerek yok, sadece takın ve kullanın.',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    gradient: 'from-emerald-500 to-green-500',
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-orbitron mb-6">
            <span className="glow-text">Güçlü Özellikler</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-inter">
            EasyChat ile müşteri deneyimini bir üst seviyeye taşıyın
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Card */}
              <div className="relative h-full p-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300 group-hover:scale-105">
                {/* Gradient border effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[1px]">
                  <div className={`h-full w-full rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-20`} />
                </div>

                {/* Icon */}
                <motion.div 
                  className={`inline-flex items-center justify-center w-16 h-16 mb-6 rounded-xl bg-gradient-to-r ${feature.gradient} text-white relative z-10`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {feature.icon}
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 text-white font-orbitron">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed font-inter">
                    {feature.description}
                  </p>
                </div>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="mt-20 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 rounded-full" />
        </div>
      </div>
    </section>
  );
}
