'use client';
import { useState, useEffect } from 'react';
import DashboardNav from '../components/DashboardNav';
import { createBrowserClient } from '@supabase/ssr';

type MessageRecord = {
  id: string;
  numericId: number;
  text: string;
};

type SessionGroup = {
  sessionId: string;
  messages: MessageRecord[];
};

function formatMessage(value: unknown): string {
  if (typeof value === 'string') {
    return value.trim();
  }
  
  if (typeof value === 'object' && value !== null) {
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      
      if (parsed && typeof parsed === 'object') {
        if ('text' in parsed && typeof parsed.text === 'string') {
          return parsed.text.trim();
        }
        if ('message' in parsed && typeof parsed.message === 'string') {
          return parsed.message.trim();
        }
        if ('content' in parsed && typeof parsed.content === 'string') {
          return parsed.content.trim();
        }
      }
      
      return JSON.stringify(parsed, null, 2);
    } catch {
      return String(value).trim();
    }
  }
  
  return String(value || 'Boş mesaj').trim();
}

function normalizeId(value: unknown): { text: string; numeric: number } {
  const text = String(value ?? 'unknown');
  
  const numericMatch = text.match(/\d+/);
  const numeric = numericMatch ? parseInt(numericMatch[0], 10) : Number.MAX_SAFE_INTEGER;
  
  return {
    text,
    numeric: Number.isFinite(numeric) ? numeric : Number.MAX_SAFE_INTEGER
  };
}

function useChatHistory() {
  const [sessions, setSessions] = useState<SessionGroup[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchChatHistory = async () => {
    try {
      console.log('🔍 Chat History Environment check:');
      console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET ✅' : 'MISSING ❌');
      console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET ✅' : 'MISSING ❌');

      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.log('⚠️ Environment variables missing, using mock data');
        // Mock data for fallback
        const mockSessions: SessionGroup[] = [
          {
            sessionId: 'mock-session-1',
            messages: [
              { id: '1', numericId: 1, text: 'Merhaba, yardım alabilir miyim?' },
              { id: '2', numericId: 2, text: 'Tabii ki! Size nasıl yardımcı olabilirim?' }
            ]
          }
        ];
        setSessions(mockSessions);
        setTotalRecords(2);
        setLastUpdated(new Date());
        return;
      }

      console.log('✅ Supabase chat history bağlantısı kuruluyor...');
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      
      console.log('🔓 RLS kapatıldı, normal anon key ile bağlanıyor...');

      const { data, error } = await supabase
        .from('n8n_chat_histories_wp')
        .select('id, session_id, message')
        .order('session_id', { ascending: true })
        .order('id', { ascending: true })
        .limit(500);

      if (error) {
        console.error('❌ Supabase error:', error);
        console.error('❌ Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        setError(error.message);
        return;
      }

      console.log('📊 Chat History Supabase\'den gelen veri:', data?.length || 0, 'kayıt');
      console.log('📊 İlk 3 kayıt örneği:', data?.slice(0, 3));

      if (!data || data.length === 0) {
        setSessions([]);
        setTotalRecords(0);
        setLastUpdated(new Date());
        return;
      }

      console.log('✅ Chat History veriler işleniyor...');
      const sessionMap = new Map<string, MessageRecord[]>();

      for (const row of data) {
        const idInfo = normalizeId(row.id);
        const sessionId = row.session_id?.toString() ?? 'Bilinmeyen oturum';
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

      const processedSessions: SessionGroup[] = Array.from(sessionMap.entries()).map(([sessionId, records]) => {
        const sorted = records.sort((a, b) => a.numericId - b.numericId);
        return {
          sessionId,
          messages: sorted
        };
      });

      processedSessions.sort((a, b) => {
        const lastA = a.messages[a.messages.length - 1]?.numericId ?? -Infinity;
        const lastB = b.messages[b.messages.length - 1]?.numericId ?? -Infinity;
        return lastB - lastA;
      });

      setSessions(processedSessions);
      setTotalRecords(data.length);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('❌ Chat History fetch error:', err);
      setError(err instanceof Error ? err.message : 'Supabase bağlantısı sağlanamadı.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatHistory();

    // Real-time subscription setup
    let subscription: any;
    let interval: NodeJS.Timeout;

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      );
      
      subscription = supabase
        .channel('chat-history-updates')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'n8n_chat_histories_wp'
        }, (payload) => {
          console.log('🔄 Chat History Real-time event:', payload.eventType, payload);
          console.log('🔄 Chat History yeni veri algılandı, güncelleniyor...');
          fetchChatHistory();
        })
        .subscribe((status) => {
          console.log('📡 Chat History Real-time subscription status:', status);
          if (status === 'SUBSCRIBED') {
            console.log('✅ Chat History Real-time dinleme aktif!');
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Chat History Real-time bağlantı hatası');
          }
        });

      // Fallback: Periodic refresh every 30 seconds
      interval = setInterval(() => {
        console.log('⏰ Chat History otomatik güncelleme...');
        fetchChatHistory();
      }, 30000);
    }

    return () => {
      clearInterval(interval);
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return { sessions, totalRecords, loading, error, lastUpdated, refetch: fetchChatHistory };
}

function buildSummary(sessions: SessionGroup[], totalRecords: number) {
  const sessionCount = sessions.length;
  const activeSessionCount = Math.min(sessionCount, 12);
  const singleMessageSessions = sessions.filter((session) => session.messages.length <= 1).length;
  
  const previews = sessions.slice(0, 3).map((session) => {
    const lastMessage = session.messages[session.messages.length - 1];
    return lastMessage ? lastMessage.text.slice(0, 20) + '...' : '';
  });
  const latestPreview = previews.length > 0 ? previews[0] : '';

  return [
    { label: 'Toplam kayıt', value: totalRecords.toString(), change: '' },
    { label: 'Oturum sayısı', value: sessionCount.toString(), change: sessionCount > 0 ? 'Aktif' : '' },
    { label: 'Aktif oturum (son 12)', value: activeSessionCount.toString(), change: latestPreview },
    { label: 'Tek mesajlık oturum', value: singleMessageSessions.toString(), change: singleMessageSessions > 0 ? 'Önlem alın' : '' }
  ];
}

export default function ChatHistoryPage() {
  const { sessions, totalRecords, loading, error, lastUpdated } = useChatHistory();
  const summaryMetrics = buildSummary(sessions, totalRecords);

  return (
    <main className="min-h-screen bg-slate-50">
      <DashboardNav active="chat-history" />
      <section className="px-4 pb-16 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-10">
          <header className="flex flex-col gap-6">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-600">
                Sohbet oturumları
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">Oturum bazlı sohbet geçmişi</h1>
              <p className="text-lg text-slate-600">
                Session ID bazında gruplanmış mesajları düzenli, WhatsApp benzeri bir arayüzde inceleyin. Kartları açarak tüm mesajları kronolojik sırayla görüntüleyin.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {summaryMetrics.map((metric) => (
                <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{metric.label}</p>
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-2xl font-semibold text-slate-900">
                      {loading ? '...' : metric.value}
                    </span>
                    {metric.change && <span className="text-xs font-semibold text-emerald-600">{metric.change}</span>}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Real-time Status */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-slate-600">
                  {loading ? 'Veriler yükleniyor...' : 'Real-time aktif'}
                </span>
              </div>
              {lastUpdated && (
                <span className="text-slate-500">
                  Son güncelleme: {lastUpdated.toLocaleTimeString('tr-TR')}
                </span>
              )}
            </div>
          </header>

          <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl">
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                Supabase'ten veri çekilirken hata oluştu: {error}
              </div>
            )}

            {loading ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <div className="animate-pulse">
                  <div className="text-lg text-slate-500">🔄 Sohbet geçmişi yükleniyor...</div>
                  <div className="mt-2 text-sm text-slate-400">WhatsApp mesajları kontrol ediliyor</div>
                </div>
              </div>
            ) : sessions.length === 0 && !error ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <div className="text-lg text-slate-500">📱 Henüz WhatsApp mesajı bulunamadı</div>
                <div className="mt-2 text-sm text-slate-400">WhatsApp'dan mesaj geldiğinde burada görünecek</div>
              </div>
            ) : null}

            {!loading && sessions.length > 0 && (
              <div className="mt-6 space-y-4">
                {sessions.map((session) => {
                const lastMessage = session.messages[session.messages.length - 1]?.text ?? 'Mesaj yok';
                const preview = lastMessage.replace(/\s+/g, ' ').slice(0, 96);

                return (
                  <details
                    key={session.sessionId}
                    className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 shadow-sm transition-all hover:shadow-md"
                  >
                    <summary className="flex cursor-pointer items-center justify-between p-6 transition-colors hover:bg-slate-50/80">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            💬
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-slate-900">Oturum: {session.sessionId}</h3>
                            <p className="text-sm text-slate-500">{session.messages.length} mesaj</p>
                          </div>
                        </div>
                        <p className="ml-13 text-sm text-slate-600">{preview}</p>
                      </div>
                      <div className="ml-4 flex items-center text-slate-400 transition-transform group-open:rotate-180">
                        ▼
                      </div>
                    </summary>
                    <div className="border-t border-slate-100 px-6 pb-6">
                      <div className="mt-6">
                        <div className="space-y-4">
                          <div className="space-y-3">
                            {session.messages.map((message, index) => {
                              const isOutbound = index % 2 === 1;
                              return (
                                <div key={message.id} className="w-full">
                                  <div className={`flex w-full ${isOutbound ? 'justify-end' : 'justify-start'}`}>
                                    <div
                                      className={`flex w-full max-w-[380px] flex-col gap-2 rounded-2xl px-4 py-3 text-sm leading-relaxed shadow transition ${
                                        isOutbound
                                          ? 'ml-auto mr-0 bg-emerald-500 text-white shadow-emerald-500/30'
                                          : 'mr-auto ml-0 bg-slate-100 text-slate-700 shadow-slate-200'
                                      }`}
                                    >
                                      <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                                      <div
                                        className={`flex items-center justify-between text-[11px] tracking-wide ${
                                          isOutbound ? 'text-emerald-100/90' : 'text-slate-400'
                                        }`}
                                      >
                                        <span>Mesaj #{index + 1}</span>
                                        <span>ID: {message.id}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </details>
                );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}