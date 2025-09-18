'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowserClient } from '../../lib/supabaseClient';

type FormState = {
  email: string;
  password: string;
};

type SubmitState = {
  loading: boolean;
  error: string | null;
  success: string | null;
};

export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [state, setState] = useState<SubmitState>({ loading: false, error: null, success: null });

  const handleChange = (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState({ loading: true, error: null, success: null });

    try {
      const supabase = supabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password
      });

      if (error) {
        setState({ loading: false, error: error.message, success: null });
        return;
      }

      setState({ loading: false, error: null, success: 'Giriş başarılı. Yönlendiriliyorsunuz...' });
      setTimeout(() => router.push('/dashboard'), 800);
    } catch (err) {
      setState({
        loading: false,
        error: err instanceof Error ? err.message : 'Beklenmedik bir hata oluştu.',
        success: null
      });
    }
  };

  return (
    <form className="space-y-5" noValidate onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-600">İş e-posta adresi</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ornek@easychat.ai"
          className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
          value={form.email}
          onChange={handleChange('email')}
          required
        />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-slate-600">Parola</label>
          <a href="/reset-password" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">Parolamı unuttum</a>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Güçlü bir parola girin"
          className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
          value={form.password}
          onChange={handleChange('password')}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
          Beni hatırla
        </label>
        <a href="/#demo-form" className="text-sm font-medium text-slate-500 hover:text-slate-700">Satış ekibine ulaş</a>
      </div>
      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={state.loading}
      >
        {state.loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
      </button>
      {state.error && (
        <p className="text-sm font-medium text-rose-600">{state.error}</p>
      )}
      {state.success && (
        <p className="text-sm font-medium text-emerald-600">{state.success}</p>
      )}
    </form>
  );
}
