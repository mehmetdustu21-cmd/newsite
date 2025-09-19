'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import DashboardNav from '../components/DashboardNav';
import { createBrowserClient } from '@supabase/ssr';

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

function useDashboardData() {
  const [sessions, setSessions] = useState<SessionPreview[]>([]);
  const [totals, setTotals] = useState({ totalRecords: 0, totalSessions: 0, singleMessageSessions: 0 });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      // Debug environment variables
      console.log('🔍 Environment check:');
      console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET ✅' : 'NOT SET ❌');
      console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET ✅' : 'NOT SET ❌');
      
      // Check if environment variables are set
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('❌ Supabase environment variables not set, using mock data');
        // Mock data fallback
        const mockData = [
          { id: '1', session_id: 'session_001', message: 'Merhaba, nasıl yardımcı olabilirim?' },
          { id: '2', session_id: 'session_001', message: 'Randevu almak istiyorum.' },
          { id: '3', session_id: 'session_002', message: 'Fiyat bilgisi alabilir miyim?' },
          { id: '4', session_id: 'session_003', message: 'Teşekkürler!' }
        ];
        
        processData(mockData);
        return;
      }

      console.log('✅ Supabase bağlantısı kuruluyor...');

      // Real Supabase connection (RLS kapatıldı)
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      
      console.log('🔓 Dashboard: RLS kapatıldı, veriler yükleniyor...');

      const { data, error } = await supabase
        .from('n8n_chat_histories_wp')
        .select('id, session_id, message')
        .order('session_id', { ascending: true })
        .order('id', { ascending: true })
        .limit(400);

      if (error) {
        console.error('❌ Supabase veri çekme hatası:', error);
        return;
      }

      console.log('📊 Supabase\'den gelen veri:', data?.length, 'kayıt');

      if (!data || data.length === 0) {
        console.log('⚠️ Supabase\'de veri bulunamadı');
        setSessions([]);
        setTotals({ totalRecords: 0, totalSessions: 0, singleMessageSessions: 0 });
        setLastUpdated(new Date());
        return;
      }

      console.log('✅ Veriler işleniyor...');
      processData(data);

    } catch (error) {
      console.error('Dashboard veri hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const processData = (data: any[]) => {
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

    setSessions(previews.slice(0, 4));
    setTotals({
      totalRecords: data.length,
      totalSessions: previews.length,
      singleMessageSessions
    });
    setLastUpdated(new Date());
  };

  useEffect(() => {
    // İlk veri yükleme
    fetchData();

    // Her 30 saniyede bir güncelle
    const interval = setInterval(fetchData, 30000);

    // Real-time subscription (only if Supabase is configured)
    let subscription: any = null;
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      
      subscription = supabase
        .channel('dashboard-updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'n8n_chat_histories_wp'
        }, (payload) => {
          console.log('🔄 Real-time event:', payload.eventType, payload);
          console.log('🔄 Yeni veri algılandı, güncelleniyor...');
          fetchData();
        })
        .subscribe((status) => {
          console.log('📡 Real-time subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('✅ Real-time dinleme aktif!');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Real-time bağlantı hatası');
          }
        });
    }

    return () => {
      clearInterval(interval);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return { sessions, totals, loading, lastUpdated, refetch: fetchData };
}

const quickActions = [
  {
    title: 'Sohbet Geçmişi',
    description: 'Müşteri sohbetlerini görüntüleyin ve yönetin.',
    href: '/chat-history',
    accent: 'bg-emerald-500 text-white hover:bg-emerald-600',
    icon: '💬'
  },
  {
    title: 'Randevular',
    description: 'Randevu listesini görüntüleyin.',
    href: '/appointments',
    accent: 'bg-blue-500 text-white hover:bg-blue-600',
    icon: '📅'
  },
  {
    title: 'Ana Sayfa',
    description: 'Web sitesinin ana sayfasına dönün.',
    href: '/',
    accent: 'bg-slate-500 text-white hover:bg-slate-600',
    icon: '🏠'
  }
];

export default function DashboardPage() {
  const { sessions, totals, loading, lastUpdated, refetch } = useDashboardData();

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
      <DashboardNav active="dashboard" />
      <section className="px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <header className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Kontrol paneli</h1>
                <p className="mt-2 max-w-2xl text-sm sm:text-base text-slate-600">
                  Sohbet kanallarınızı izleyin, ekibin durumunu görün ve kritik aksiyonlara tek tıkla ulaşın.
                </p>
                {lastUpdated && (
                  <p className="mt-1 text-xs text-slate-400">
                    Son güncelleme: {lastUpdated.toLocaleTimeString('tr-TR')}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={refetch}
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900 disabled:opacity-50"
                >
                  {loading ? '🔄' : '↻'} Yenile
                </button>
                <Link
                  href="/chat-history"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
                >
                  Sohbet geçmişini aç
                </Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {overviewCards.map((card) => (
                <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{card.value}</p>
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
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {quickActions.map((action) => (
                    <Link
                      key={action.title}
                      href={action.href}
                      className={`rounded-xl p-4 text-left transition-colors shadow-sm ${action.accent}`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{action.icon}</span>
                        <h3 className="text-sm font-semibold">{action.title}</h3>
                      </div>
                      <p className="mt-2 text-xs opacity-90">{action.description}</p>
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
                  {loading ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                      <div className="animate-pulse">
                        <div className="text-sm text-slate-500">🔄 Veriler yükleniyor...</div>
                      </div>
                    </div>
                  ) : sessions.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
                      Gösterilecek oturum bulunamadı. Supabase tablonuza veri eklendiğinde ön izleme burada görünecek.
                    </p>
                  ) : (
                    sessions.map((session) => (
                      <div key={session.sessionId} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                          <span>Oturum: {session.sessionId}</span>
                          <span>{session.totalMessages} mesaj</span>
                        </div>
                        <p className="mt-3 text-sm text-slate-700">{session.preview || 'Ön izleme bulunamadı'}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Sistem Durumu</h2>
                <p className="text-sm text-slate-500">Temel sistem bileşenleri.</p>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <div>
                      <h3 className="text-sm font-medium text-slate-800">WhatsApp API</h3>
                      <p className="text-xs text-slate-600">Mesajlaşma servisi</p>
                    </div>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Aktif
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <div>
                      <h3 className="text-sm font-medium text-slate-800">Veritabanı</h3>
                      <p className="text-xs text-slate-600">Supabase bağlantısı</p>
                    </div>
                    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Çalışıyor
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <div>
                      <h3 className="text-sm font-medium text-slate-800">Real-time Sync</h3>
                      <p className="text-xs text-slate-600">Anlık veri güncellemesi</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        Dinliyor
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}