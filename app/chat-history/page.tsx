import Navbar from '../components/Navbar';

const summaryMetrics = [
  { label: 'Aylik konusma', value: '1.245', change: '+18%' },
  { label: 'Cozum suresi ort.', value: '7 dk', change: '-22%' },
  { label: 'Memnuniyet skoru', value: '4.7/5', change: '+0.3' },
  { label: 'Aktif ajansayisi', value: '12', change: '+2' }
];

const sentimentStyles: Record<string, string> = {
  Pozitif: 'border-emerald-100 bg-emerald-50 text-emerald-700',
  Notr: 'border-slate-200 bg-slate-100 text-slate-700',
  Negatif: 'border-rose-100 bg-rose-50 text-rose-700'
};

const conversations = [
  {
    id: 'EC-2025-001',
    customer: 'Ayse Yilmaz',
    platform: 'WhatsApp',
    lastMessage: 'Tesekkur ederim, gerekli bilgileri aldim. Odemeyi birazdan tamamlayacagim.',
    agent: 'Mert Kaya',
    sentiment: 'Pozitif',
    updatedAt: '18 Eyl 2025 - 10:24',
    duration: '12 dk',
    tags: ['VIP', 'Fatura', 'Yenileme']
  },
  {
    id: 'EC-2025-014',
    customer: 'Baris Demir',
    platform: 'Web Widget',
    lastMessage: 'Tarifeyi degistirmek istiyorum fakat fiyatlari bulamiyorum. Yardimci olur musunuz?',
    agent: 'Selin Aydin',
    sentiment: 'Notr',
    updatedAt: '18 Eyl 2025 - 09:58',
    duration: '9 dk',
    tags: ['Satis', 'Bilgilendirme']
  },
  {
    id: 'EC-2025-021',
    customer: 'Dilan Koc',
    platform: 'Instagram DM',
    lastMessage: 'Gonderdigim ekran goruntusundeki hata halen devam ediyor. Cozum suresi nedir?',
    agent: 'Okan Er',
    sentiment: 'Negatif',
    updatedAt: '18 Eyl 2025 - 09:12',
    duration: '21 dk',
    tags: ['Destek', 'Hata kaydi', 'Oncelik: Yuksek']
  },
  {
    id: 'EC-2025-037',
    customer: 'Gamze Cinar',
    platform: 'WhatsApp',
    lastMessage: 'Kampanyaniz ile ilgili detayli bilgi almak istiyorum. Beni arayabilir misiniz?',
    agent: 'Bahar Y.',
    sentiment: 'Pozitif',
    updatedAt: '17 Eyl 2025 - 18:47',
    duration: '6 dk',
    tags: ['Pazarlama', 'Cagrilar']
  }
];

export const metadata = {
  title: 'EasyChat | Sohbet Gecmisi',
  description: 'Musteri diyaloglarinizin tam kaydina erisin ve ekip performansini analiz edin.'
};

export default function ChatHistoryPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="pt-28 pb-16 px-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <header className="flex flex-col gap-6">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-indigo-600">
                Sohbet kayitlari
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">Tum kanal gecmisi tek ekranda</h1>
              <p className="text-lg text-slate-600">
                WhatsApp, web widget ve sosyal medya kanallarinizdaki tum konusmalari kronolojik olarak inceleyin.
                Ajansal performansi takip edin, ekipler arasi devretme sureclerini kaydetin ve kritik musterileri kaybetmeyin.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {summaryMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{metric.label}</p>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-2xl font-semibold text-slate-900">{metric.value}</span>
                    <span className="text-xs font-semibold text-emerald-600">{metric.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </header>

          <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M18 11a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  placeholder="Musteri ya da konusma ID'si ile arayin"
                  className="w-full border-0 bg-transparent text-sm text-slate-600 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200">
                  <option value="tum">Tum kanallar</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="web">Web widget</option>
                  <option value="instagram">Instagram DM</option>
                </select>
                <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200">
                  <option value="7">Son 7 gun</option>
                  <option value="30">Son 30 gun</option>
                  <option value="90">Son 90 gun</option>
                  <option value="custom">Ozel tarih araligi</option>
                </select>
                <button className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition hover:border-indigo-300 hover:text-indigo-700">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 15l-6-6-6 6" />
                  </svg>
                  Sirala
                </button>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {conversations.map((conversation) => (
                <article
                  key={conversation.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{conversation.platform}</span>
                        <span className="rounded-full border border-slate-200 px-3 py-1 text-slate-500">{conversation.id}</span>
                        <span className="rounded-full border border-slate-200 px-3 py-1 text-slate-500">Sure: {conversation.duration}</span>
                      </div>
                      <h3 className="mt-4 text-xl font-semibold text-slate-900">{conversation.customer}</h3>
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{conversation.lastMessage}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {conversation.tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-2 text-sm text-slate-600 md:items-end md:text-right">
                      <span className="font-semibold text-slate-800">Sorumlu: {conversation.agent}</span>
                      <span className="text-xs text-slate-500">Guncellendi: {conversation.updatedAt}</span>
                      <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${sentimentStyles[conversation.sentiment] ?? 'border-slate-200 bg-slate-100 text-slate-700'}`}>
                        <span className="h-2 w-2 rounded-full bg-current"></span>
                        Duygu: {conversation.sentiment}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
