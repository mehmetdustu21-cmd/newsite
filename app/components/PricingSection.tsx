'use client';

import { motion } from 'framer-motion';

export default function PricingSection() {
  const handleGetStarted = () => {
    const demoSection = document.getElementById('demo-form');
    demoSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    'Sınırsız chat',
    'Google Calendar entegrasyonu',
    'WhatsApp Business API',
    'Website widget',
    'CRM entegrasyonu',
    '7/24 AI asistan',
    'Çoklu dil desteği',
    'Analytics dashboard',
    'Öncelikli destek'
  ];

  const testimonials = [
    {
      name: "Ahmet Yılmaz",
      company: "Digital Ajans CEO",
      text: "EasyChat ile müşteri memnuniyetimiz %40 arttı. Artık hiçbir mesaj kaçmıyor!",
      rating: 5
    },
    {
      name: "Zeynep Kaya", 
      company: "Kuaför Salonu Sahibi",
      text: "Randevu sistemimizi tamamen otomatikleştirdik. Günde 50+ randevu otomatik alıyoruz.",
      rating: 5
    },
    {
      name: "Mehmet Demir",
      company: "E-ticaret Mağazası",
      text: "24/7 müşteri desteği artık gerçek! Satışlarımız %60 arttı. Harika bir sistem!",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-light font-poppins mb-6 text-slate-800">
            <span className="font-semibold text-indigo-600">Müşterilerimiz</span> Ne Diyor?
          </h2>
          <p className="text-lg text-slate-600 font-poppins max-w-2xl mx-auto">
            Binlerce işletme EasyChat ile dijital dönüşümünü tamamladı
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-slate-700 font-poppins leading-relaxed mb-6">
                "{testimonial.text}"
              </blockquote>

              {/* Author */}
              <div className="border-t border-slate-100 pt-4">
                <div className="font-semibold text-slate-800 font-poppins">
                  {testimonial.name}
                </div>
                <div className="text-sm text-slate-500 font-poppins">
                  {testimonial.company}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
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
