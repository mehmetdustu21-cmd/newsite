"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Session } from "@supabase/supabase-js";
import { supabaseBrowserClient } from "../../lib/supabaseClient";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AssistantPage() {
  const supabase = useMemo(() => supabaseBrowserClient(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session ?? null);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, newSession) => {
      setSession(newSession);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleEmailChange = (field: "email" | "password") => (event: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleEmailLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email.trim(),
      password: credentials.password,
    });

    if (error) {
      setAuthError(error.message);
      return;
    }

    setAuthOpen(false);
    setCredentials({ email: "", password: "" });
  };

  const handleGoogleLogin = async () => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMessages([]);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session || !question.trim()) {
      return;
    }

    const newQuestion = question.trim();
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", content: newQuestion }]);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: newQuestion }),
      });

      if (!response.ok) {
        throw new Error("Yanıt alınamadı");
      }

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer ?? "Yanıt alınamadı." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error instanceof Error ? error.message : "Beklenmedik bir hata oluştu.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Image src="/easychat-logo.svg" alt="EasyChat" width={32} height={32} />
          EasyChat Asistanı
        </Link>
        <div className="flex items-center gap-3">
          {session ? (
            <button
              onClick={handleLogout}
              className="rounded-full border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-400 hover:text-white"
            >
              Oturumu kapat
            </button>
          ) : (
            <button
              onClick={() => {
                setAuthOpen(true);
                setAuthError(null);
              }}
              className="rounded-full bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-400"
            >
              Giriş Yap
            </button>
          )}
        </div>
      </header>

      <main className="flex flex-col items-center px-4 py-16">
        <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 shadow-2xl">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-slate-900/70 backdrop-blur">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-200">
              <path
                d="M12 12c2.761 0 5-2.239 5-5S14.761 2 12 2 7 4.239 7 7s2.239 5 5 5Zm0 2c-4.336 0-8 2.016-8 4.5V21h16v-2.5c0-2.484-3.664-4.5-8-4.5Z"
                fill="currentColor"
                opacity={0.85}
              />
            </svg>
          </div>
        </div>

        <div className="mt-8 w-full max-w-3xl">
          <div className="mx-auto rounded-3xl border border-indigo-500/30 bg-slate-900/60 p-6 shadow-2xl backdrop-blur">
            <div className="min-h-[120px] space-y-4">
              {messages.length === 0 && (
                <div className="rounded-2xl bg-slate-800/80 p-4 text-sm text-slate-200">
                  {session ? (
                    <p>Merhaba! Ben EasyChat asistanınızım. Aşağıya sorunuzu yazın, size yardımcı olayım.</p>
                  ) : (
                    <p>Devam etmek için giriş yapın. Üstteki "Giriş Yap" butonunu kullanabilirsiniz.</p>
                  )}
                </div>
              )}
              {messages.map((message, index) => (
                <div key={${message.role}-} className={lex }>
                  <div
                    className={max-w-xl rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg }
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-slate-800/80 px-4 py-3 text-sm text-slate-300">
                    <span className="h-2 w-2 animate-ping rounded-full bg-indigo-400"></span>
                    Yanıt hazırlanıyor...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder={session ? "Sorunuzu yazın" : "Giriş yapmadan soru gönderemezsiniz"}
                disabled={!session || loading}
                className="flex-1 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder-slate-500 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!session || loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-indigo-400 hover:via-purple-400 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Gönder
              </button>
            </form>
          </div>
        </div>
      </main>

      {authOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur">
          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">EasyChat hesabına giriş yap</h2>
              <button
                onClick={() => {
                  setAuthOpen(false);
                  setAuthError(null);
                }}
                className="rounded-full border border-slate-600 p-1 text-slate-400 transition hover:text-white"
                aria-label="Kapat"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEmailLogin} className="mt-6 space-y-4">
              <div>
                <label htmlFor="login-email" className="text-xs font-medium uppercase tracking-wide text-slate-400">E-posta</label>
                <input
                  id="login-email"
                  type="email"
                  value={credentials.email}
                  onChange={handleEmailChange("email")}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="örnek@easychat.ai"
                />
              </div>
              <div>
                <label htmlFor="login-password" className="text-xs font-medium uppercase tracking-wide text-slate-400">Parola</label>
                <input
                  id="login-password"
                  type="password"
                  value={credentials.password}
                  onChange={handleEmailChange("password")}
                  required
                  className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                />
              </div>
              {authError && <p className="text-sm text-rose-400">{authError}</p>}
              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                E-posta ile giriş yap
              </button>
            </form>

            <div className="my-4 flex items-center gap-4 text-xs uppercase tracking-widest text-slate-500">
              <span className="h-px flex-1 bg-slate-700"></span>
              veya
              <span className="h-px flex-1 bg-slate-700"></span>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full inline-flex items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.49 12.27c0-.78-.07-1.53-.2-2.27H12v4.29h6.48c-.28 1.45-1.12 2.68-2.39 3.51v2.91h3.87c2.26-2.08 3.56-5.14 3.56-8.44Z" fill="#4285F4" />
                <path d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.87-2.91c-1.07.72-2.44 1.15-4.08 1.15-3.13 0-5.79-2.11-6.74-4.95H1.25v3.11C3.24 21.78 7.27 24 12 24Z" fill="#34A853" />
                <path d="M5.26 14.38c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.71H1.25C.45 8.35 0 10.13 0 12c0 1.87.45 3.65 1.25 5.29l4.01-2.91Z" fill="#FBBC05" />
                <path d="M12 4.77c1.76 0 3.33.6 4.56 1.78l3.41-3.41C17.96 1.21 15.24 0 12 0 7.27 0 3.24 2.22 1.25 5.71l4.01 3.11C6.21 6.88 8.87 4.77 12 4.77Z" fill="#EA4335" />
              </svg>
              Google ile giriş yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
