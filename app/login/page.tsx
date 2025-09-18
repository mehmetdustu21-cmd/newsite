import Navbar from '../components/Navbar';
import LoginForm from './LoginForm';

const loginHighlights = [
  {
    title: 'Kurumsal Güvenlik',
    description: 'IP kısıtlama, cihaz doğrulama ve oturum izleme ile yetkisiz erişimleri engelleyin.'
  },
  {
    title: 'Yetki Seviyeleri',
    description: 'Satış, destek ve operasyon ekipleri için farklı rol ve izinler oluşturun.'
  },
  {
    title: 'Gerçek Zamanlı İzleme',
    description: 'Canlı sohbet performansını, ajana göre yanıt sürelerini ve memnuniyet puanlarını takip edin.'
  },
  {
    title: 'Modern Deneyim',
    description: 'Dinamik oturum kartları ile müşterilerinizin konuşmalarına saniyeler içinde ulaşın.'
  }
];

export const metadata = {
  title: 'EasyChat | Giriş',
  description: 'EasyChat paneline giriş yapın ve sohbet asistanınızı yönetin.'
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[1.15fr_0.85fr] items-start">
          <div className="space-y-8">
            <div>
              <span className="text-sm font-semibold tracking-wide text-indigo-600 uppercase">Yönetici paneli</span>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-slate-900">Kontrol paneline giriş yapın</h1>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl">
                EasyChat ile bütün kanal konuşmalarınızı tek noktadan yönetin. Güvenli giriş akışı,
                veri gizliliği ve kurumsal raporlamaya hazır altyapıyla müşterilerinize daha hızlı dönüş yapın.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {loginHighlights.map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/95 backdrop-blur-sm shadow-xl border border-slate-200 rounded-2xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-900">Hesabınıza giriş yapın</h2>
              <p className="mt-2 text-sm text-slate-500">
                Şifrenizi hatırlamıyor musunuz?{' '}
                <a href="mailto:support@easychat.ai" className="font-medium text-indigo-600 hover:text-indigo-500">Destek ekibi ile iletişim kurun</a>.
              </p>
            </div>
            <LoginForm />
            <div className="mt-6 rounded-lg border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700">
              Hesabınız yok mu?{' '}
              <a href="/#demo-form" className="font-semibold underline decoration-indigo-400/70 hover:decoration-indigo-600">EasyChat ile tanışın</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

