'use client';

import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Ahmet Yılmaz",
    company: "Digital Ajans CEO",
    text: "EasyChat ile müşteri memnuniyetimiz %40 arttı. Artık hiçbir mesaj kaçmıyor!",
    rating: 5,
    avatar: "AY"
  },
  {
    name: "Zeynep Kaya", 
    company: "Kuaför Salonu Sahibi",
    text: "Randevu sistemimizi tamamen otomatikleştirdik. Günde 50+ randevu otomatik alıyoruz.",
    rating: 5,
    avatar: "ZK"
  },
  {
    name: "Mehmet Demir",
    company: "E-ticaret Mağazası",
    text: "24/7 müşteri desteği artık gerçek! Satışlarımız %60 arttı. Harika bir sistem!",
    rating: 5,
    avatar: "MD"
  },
  {
    name: "Fatma Özkan",
    company: "Restoran Sahibi",
    text: "Müşteri siparişlerini otomatik alıyoruz. Personel maliyetimiz %30 azaldı.",
    rating: 5,
    avatar: "FÖ"
  },
  {
    name: "Can Aydın",
    company: "Emlak Danışmanı",
    text: "Potansiyel müşterilerle 7/24 iletişim kuruyorum. Satış oranım %50 arttı.",
    rating: 5,
    avatar: "CA"
  },
  {
    name: "Elif Şahin",
    company: "Spa Merkezi",
    text: "Randevu iptalleri %80 azaldı. Müşterilerimiz çok memnun!",
    rating: 5,
    avatar: "EŞ"
  }
];

const stats = [
  { value: "500+", label: "Aktif Müşteri" },
  { value: "10K+", label: "Günlük Mesaj" },
  { value: "%95", label: "Memnuniyet Oranı" },
  { value: "24/7", label: "Kesintisiz Hizmet" }
];

export default function SocialProofSection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-light font-poppins mb-6 text-slate-800">
            <span className="font-semibold text-indigo-600">Müşterilerimiz</span> Ne Diyor?
          </h2>
          <p className="text-lg text-slate-600 font-poppins max-w-3xl mx-auto">
            Binlerce işletme EasyChat ile dijital dönüşümünü tamamladı
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                {stat.value}
              </div>
              <div className="text-slate-600 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 h-full">
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-slate-700 font-poppins leading-relaxed mb-6 text-sm">
                  "{testimonial.text}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 font-poppins text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-slate-500 font-poppins">
                      {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-slate-500 font-poppins mb-8">
            Güvenilir teknoloji partneriniz
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold text-slate-400">Supabase</div>
            <div className="text-2xl font-bold text-slate-400">Next.js</div>
            <div className="text-2xl font-bold text-slate-400">OpenAI</div>
            <div className="text-2xl font-bold text-slate-400">WhatsApp API</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
