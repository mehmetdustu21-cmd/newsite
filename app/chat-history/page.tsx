import Navbar from '../components/Navbar';
import { supabaseServerClient } from '../../lib/supabaseServer';

type MessageRecord = {
  id: string;
  numericId: number;
  text: string;
};

type SessionGroup = {
  sessionId: string;
  messages: MessageRecord[];
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

async function fetchChatHistory(): Promise<{
  sessions: SessionGroup[];
  totalRecords: number;
  error?: string;
}> {
  try {
    const supabase = supabaseServerClient();
    const { data, error } = await supabase
      .from('n8n_chat_histories_wp')
      .select('id, session_id, message')
      .order('session_id', { ascending: true })
      .order('id', { ascending: true })
      .limit(500);

    if (error) {
      return { sessions: [], totalRecords: 0, error: error.message };
    }

    if (!data || data.length === 0) {
      return { sessions: [], totalRecords: 0 };
    }

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

    const sessions: SessionGroup[] = Array.from(sessionMap.entries()).map(([sessionId, records]) => {
      const sorted = records.sort((a, b) => a.numericId - b.numericId);
      return {
        sessionId,
        messages: sorted
      };
    });

    sessions.sort((a, b) => {
      const lastA = a.messages[a.messages.length - 1]?.numericId ?? -Infinity;
      const lastB = b.messages[b.messages.length - 1]?.numericId ?? -Infinity;
      return lastB - lastA;
    });

    return {
      sessions,
      totalRecords: data.length
    };
  } catch (err) {
    return {
      sessions: [],
      totalRecords: 0,
      error: err instanceof Error ? err.message : 'Supabase bağlantısı sağlanamadı.'
    };
  }
}

function buildSummary(sessions: SessionGroup[], totalRecords: number) {
  const sessionCount = sessions.length;
  const activeSessionCount = Math.min(sessionCount, 12);
  const singleMessageSessions = sessions.filter((session) => session.messages.length <= 1).length;
  const latestSession = sessions[0];
  const latestPreview = latestSession
    ? latestSession.messages[latestSession.messages.length - 1]?.text.replace(/\s+/g, ' ').slice(0, 48) ?? 'Kayıt yok'
    : 'Kayıt yok';

  return [
    { label: 'Toplam kayıt', value: totalRecords.toString(), change: '' },
    { label: 'Toplam oturum', value: sessionCount.toString(), change: '' },
    { label: 'Aktif oturum (son 12)', value: activeSessionCount.toString(), change: latestPreview },
    { label: 'Tek mesajlık oturum', value: singleMessageSessions.toString(), change: singleMessageSessions > 0 ? 'Önlem alın' : '' }
  ];
}

export const metadata = {
  title: 'EasyChat | Sohbet Geçmişi',
  description: 'Supabase tablonuzdaki sohbet oturumlarını inceleyin.'
};

export default async function ChatHistoryPage() {
  const { sessions, totalRecords, error } = await fetchChatHistory();
  const summaryMetrics = buildSummary(sessions, totalRecords);

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <section className="pt-28 pb-16 px-4">
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
                    <span className="text-2xl font-semibold text-slate-900">{metric.value}</span>
                    {metric.change && <span className="text-xs font-semibold text-emerald-600">{metric.change}</span>}
                  </div>
                </div>
              ))}
            </div>
          </header>

          <div className="rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-xl">
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                Supabase'ten veri çekilirken hata oluştu: {error}
              </div>
            )}

            {sessions.length === 0 && !error && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
                Gösterilecek oturum bulunamadı. Supabase tablonuza veri eklendiğinde bu alan güncellenecek.
              </div>
            )}

            <div className="mt-6 space-y-4">
              {sessions.map((session) => {
                const lastMessage = session.messages[session.messages.length - 1]?.text ?? 'Mesaj yok';
                const preview = lastMessage.replace(/\s+/g, ' ').slice(0, 96);

                return (
                  <details
                    key={session.sessionId}
                    className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-emerald-300 hover:shadow-xl"
                  >
                    <summary className="flex cursor-pointer flex-col gap-3 rounded-2xl px-6 py-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Oturum</span>
                        <h2 className="text-xl font-bold text-slate-900">{session.sessionId}</h2>
                      </div>
                      <div className="flex flex-1 flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-end">
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 font-medium text-emerald-600">
                          {session.messages.length} mesaj
                        </span>
                        <span className="hidden sm:block text-slate-300">|</span>
                        <span className="max-w-lg truncate text-slate-500">
                          Son mesaj: {preview.length > 0 ? preview : 'Mesaj yok'}
                        </span>
                      </div>
                    </summary>

                    <div className="border-t border-slate-200 bg-gradient-to-b from-slate-50 via-white to-slate-50 px-0 py-6 sm:px-6">
                      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
                        <div className="mx-auto flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                          Sohbet kaydı
                        </div>
                        <div className="w-full rounded-3xl border border-slate-200 bg-white p-4 shadow-inner">
                          <div className="flex flex-col gap-3">
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
          </div>
        </div>
      </section>
    </main>
  );
}

