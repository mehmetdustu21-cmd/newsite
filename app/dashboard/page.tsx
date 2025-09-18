import Link from 'next/link';
import Navbar from '../components/Navbar';
import { supabaseServerClient } from '../../lib/supabaseServer';

type MessageRecord = {
  id: string;
  numericId: number;
  text: string;
};

type SessionPreview = {
  sessionId: string;
  totalMessages: number;
  preview: string;
};

function tryParseJson(raw: string): unknown {
  const trimmed = raw.trim();
  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      return JSON.parse(trimmed);
    } catch (error) {
      return raw;
    }
  }
  return raw;
}

function formatMessage(value: unknown, depth = 0): string {
  if (depth > 6) {
    return 'Mesaj çok derin bir yapıda, özetlenemedi.';
  }

  if (value === null || value === undefined) {
    return 'Mesaj bulunamadı';
  }

  if (typeof value === 'string') {
    const parsed = tryParseJson(value);
    if (typeof parsed === 'string') {
      const trimmed = parsed.trim();
      return trimmed.length > 0 ? trimmed : 'Mesaj bulunamadı';
    }
    return formatMessage(parsed, depth + 1);
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => formatMessage(item, depth + 1))
      .filter((part) => part.length > 0);

    const joined = parts.join('\n\n');
    return joined.length > 0 ? joined : 'Mesaj bulunamadı';
  }

  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;

    if (typeof obj.content === 'string' || typeof obj.content === 'object') {
      return formatMessage(obj.content, depth + 1);
    }

    if (typeof obj.text === 'string' || typeof obj.text === 'object') {
      return formatMessage(obj.text, depth + 1);
    }

    if (typeof obj.message === 'string' || typeof obj.message === 'object') {
      return formatMessage(obj.message, depth + 1);
    }

    if (typeof obj.data === 'string' || typeof obj.data === 'object') {
      return formatMessage(obj.data, depth + 1);
    }

    try {
      return JSON.stringify(obj, null, 2);
    } catch (error) {
      return String(obj);
    }
  }

  return String(value);
}

function normalizeId(value: unknown): { text: string; numeric: number } {
  const text = value?.toString() ?? Math.random().toString(36).slice(2);
  const numeric = Number(text);
  return {
    text,
    numeric: Number.isFinite(numeric) ? numeric : Number.MAX_SAFE_INTEGER
  };
}

async function fetchRecentSessions(): Promise<{ sessions: SessionPreview[]; totals: { totalRecords: number; totalSessions: number; singleMessageSessions: number } }> {
  try {
    const supabase = supabaseServerClient();
    const { data, error } = await supabase
      .from('n8n_chat_histories_wp')
      .select('id, session_id, message')
      .order('session_id', { ascending: true })
      .order('id', { ascending: true })
      .limit(400);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return { sessions: [], totals: { totalRecords: 0, totalSessions: 0, singleMessageSessions: 0 } };
    }

    const sessionMap = new Map<string, MessageRecord[]>();

    for (const row of data) {
      const idInfo = normalizeId(row.id);
      const sessionId = row.session_id?.toString() ?? 'Tanımsız oturum';
      const messageText = formatMessage(row.message);

      const record: MessageRecord = {
        id: idInfo.text,
        numericId: idInfo.numeric,
        text: messageText
      };

      if (!sessionMap.has(sessionId)) {
        sessionMap.set(sessionId, []);
      }

      sessionMap.get(sessionId)!.push(record);
    }

    const previews: SessionPreview[] = Array.from(sessionMap.entries()).map(([sessionId, records]) => {
      const sorted = records.sort((a, b) => a.numericId - b.numericId);
      const lastMessage = sorted[sorted.length - 1]?.text ?? 'Mesaj bulunamadı';
      const preview = lastMessage.replace(/\s+/g, ' ').slice(0, 96);
      return {
        sessionId,
        totalMessages: sorted.length,
        preview
      };
    });

    previews.sort((a, b) => b.totalMessages - a.totalMessages);

    const singleMessageSessions = previews.filter((item) => item.totalMessages <= 1).length;

    return {
      sessions: previews.slice(0, 4),
      totals: {
        totalRecords: data.length,
        totalSessions: previews.length,
        singleMessageSessions
      }
    };
  } catch (error) {
    console.error('Dashboard oturumları alınamadı:', error);
    return { sessions: [], totals: { totalRecords: 0, totalSessions: 0, singleMessageSessions: 0 } };
  }
}

const quickActions = [
  {
    title: 'Canlı sohbeti aç',
    description: 'Web widget üzerinden anlık sohbet başlatın.',
    href: '/chat-history',
    accent: 'bg-emerald-500 text-white hover:bg-emerald-600'
  },
  {
    title: 'Yeni otomasyon oluştur',
    description: 'n8n akışına yeni bir senaryo ekleyin.',
    href: '#',
    accent: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
  },
  {
    title: 'Görev atayın',
    description: 'Destek ekibine takip görevi oluşturun.',
    href: '#',
    accent: 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
  }
];

const supportTickets = [
  {
    id: 'TCK-1045',
    title: 'KVKK aydınlatma metni güncellemesi',
    owner: 'Ayşe Yılmaz',
    due: 'Bugün',
    status: 'Öncelik: Yüksek'
  },
  {
    id: 'TCK-1032',
    title: 'Instagram DM entegrasyon testi',
    owner: 'Mert Kaya',
    due: '2 gün kaldı',
    status: 'Devam ediyor'
  },
  {
    id: 'TCK-1028',
    title: 'WhatsApp şablon onayı bekleniyor',
    owner: 'Selin Aydın',
    due: '5 gün kaldı',
    status: 'Beklemede'
  }
];

const integrationStatus = [
  {
    name: 'WhatsApp Business API',
    status: 'Aktif',
    description: '24 saatlik pencere içinde 4 açık konuşma var.',
    pill: 'bg-emerald-500/10 text-emerald-600'
  },
  {
    name: 'n8n otomasyon akışı',
    status: 'Uyarı',
    description: 'Son akışta 2 başarısız node tespit edildi. Loglara göz atın.',
    pill: 'bg-amber-500/10 text-amber-600'
  },
  {
    name: 'CRM entegrasyonu',
    status: 'Planlanıyor',
    description: 'Pazartesi günü sandbox bağlantısı yapılacak.',
    pill: 'bg-slate-200 text-slate-600'
  }
];

export const metadata = {
  title: 'EasyChat | Kontrol Paneli',
  description: 'Sohbet operasyonlarınızı tek ekrandan yönetin.'
};

export default async function DashboardPage() {
  const { sessions, totals } = await fetchRecentSessions();

  const overviewCards = [
    {
      label: 'Toplam kayıt',
      value: totals.totalRecords.toString(),
      helper: 'Son 7 gün'
    },
    {
      label: 'Aktif oturumlar',
      value: totals.totalSessions.toString(),
      helper: 'Otomatik güncellenir'
    },
    {
      label: 'Tek mesajlık oturum',
      value: totals.singleMessageSessions.toString(),
      helper: totals.singleMessageSessions > 0 ? 'Takip önerilir' : 'Hepsi yanıtlandı'
    },
    {
      label: 'Memnuniyet puanı',
      value: '4.7 / 5',
      helper: 'Son anketlerden'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="pt-24 pb-16 px-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <header className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Kontrol paneli</h1>
                <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-600">
                  Sohbet kanallarınızı izleyin, ekibin durumunu görün ve kritik aksiyonlara tek tıkla ulaşın.
                </p>
              </div>
              <Link
                href="/chat-history"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
              >
                Sohbet geçmişini aç
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {overviewCards.map((card) => (
                <div key={card.label} className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">{card.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{card.helper}</p>
                </div>
              ))}
            </div>
          </header>

          <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Hızlı aksiyonlar</h2>
                    <p className="text-sm text-slate-500">Rutin işlerinizi hızlandırın.</p>
                  </div>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {quickActions.map((action) => (
                    <Link
                      key={action.title}
                      href={action.href}
                      className={`rounded-2xl p-5 text-left transition shadow-sm ${action.accent}`}
                    >
                      <h3 className="text-base font-semibold">{action.title}</h3>
                      <p className="mt-2 text-sm opacity-80">{action.description}</p>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Son sohbet oturumları</h2>
                    <p className="text-sm text-slate-500">En güncel müşteri etkileşimlerinden öne çıkanlar.</p>
                  </div>
                  <Link href="/chat-history" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Tümünü gör
                  </Link>
                </div>
                <div className="mt-6 space-y-4">
                  {sessions.length === 0 && (
                    <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                      Gösterilecek oturum bulunamadı. Supabase tablonuza veri eklendiğinde ön izleme burada görünecek.
                    </p>
                  )}
                  {sessions.map((session) => (
                    <div key={session.sessionId} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <span>Oturum: {session.sessionId}</span>
                        <span>{session.totalMessages} mesaj</span>
                      </div>
                      <p className="mt-3 text-sm text-slate-700">{session.preview || 'Ön izleme bulunamadı'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Görevler</h2>
                <p className="text-sm text-slate-500">Takip gerektiren önemli aksiyonlar.</p>
                <div className="mt-5 space-y-4">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                        <span>{ticket.id}</span>
                        <span>{ticket.status}</span>
                      </div>
                      <p className="mt-2 text-sm font-medium text-slate-800">{ticket.title}</p>
                      <p className="text-xs text-slate-500">Sorumlu: {ticket.owner} · {ticket.due}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Entegrasyon durumu</h2>
                <p className="text-sm text-slate-500">Altyapı ve otomasyon bileşenlerinin son durumu.</p>
                <div className="mt-5 space-y-4">
                  {integrationStatus.map((integration) => (
                    <div key={integration.name} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-slate-800">{integration.name}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${integration.pill}`}>
                          {integration.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{integration.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
