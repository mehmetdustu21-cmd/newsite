import Navbar from '../components/Navbar';
import LoginForm from './LoginForm';

const loginHighlights = [
  {
    title: 'Kurumsal Guvenlik',
    description: 'IP kisitlama, cihaz dogrulama ve oturum izleme ile yetkisiz erisimleri engelleyin.'
  },
  {
    title: 'Yetki Seviyeleri',
    description: 'Satis, destek ve operasyon ekipleri icin farkli rol ve izinler olusturun.'
  },
  {
    title: 'Gercek Zamanli Izleme',
    description: 'Canli sohbet performansini, ajana gore yanit surelerini ve memnuniyet puanlarini takip edin.'
  },
  {
    title: 'Modern Deneyim',
    description: 'Dinamik oturum kartlari ile musterilerinizin konusmalarina saniyeler icinde ulasin.'
  }
];

export const metadata = {
  title: 'EasyChat | Giris',
  description: 'EasyChat paneline giris yapin ve sohbet asistaninizi yonetin.'
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-[1.15fr_0.85fr] items-start">
          <div className="space-y-8">
            <div>
              <span className="text-sm font-semibold tracking-wide text-indigo-600 uppercase">Yonetici paneli</span>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-slate-900">Kontrol paneline giris yapin</h1>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl">
                EasyChat ile butun kanal konusmalarinizi tek noktadan yonetin. Guvenli giris akisi,
                veri gizliligi ve kurumsal raporlamaya hazir altyapiyla musterilerinize daha hizli donus yapin.
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
              <h2 className="text-2xl font-semibold text-slate-900">Hesabiniza giris yapin</h2>
              <p className="mt-2 text-sm text-slate-500">
                Sifrenizi hatirlamiyor musunuz?{' '}
                <a href="mailto:support@easychat.ai" className="font-medium text-indigo-600 hover:text-indigo-500">Destek ekibi ile iletisim kurun</a>.
              </p>
            </div>
            <LoginForm />
            <div className="mt-6 rounded-lg border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-700">
              Hesabiniz yok mu?{' '}
              <a href="/#demo-form" className="font-semibold underline decoration-indigo-400/70 hover:decoration-indigo-600">EasyChat ile tanisin</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
