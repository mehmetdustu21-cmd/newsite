import Navbar from '../components/Navbar';

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
            <form className="space-y-5" noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-600">Is e-posta adresi</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="ornek@easychat.ai"
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-600">Parola</label>
                  <a href="/reset-password" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">Parolami unuttum</a>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Guclu bir parola girin"
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  Beni hatirla
                </label>
                <a href="/#demo-form" className="text-sm font-medium text-slate-500 hover:text-slate-700">Satis ekibine ulas</a>
              </div>
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Giris Yap
              </button>
            </form>
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
