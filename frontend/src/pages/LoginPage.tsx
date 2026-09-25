import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Microscope, ShieldCheck, ArrowRight, UserCheck, Home } from 'lucide-react';

interface LoginPageProps {
  onNavigate?: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      if (onNavigate) {
        onNavigate('dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao efetuar login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickUser = (userEmail: string) => {
    setEmail(userEmail);
    setPassword('DataPath@2026');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 relative overflow-hidden antialiased">
      {/* Glow Backdrops */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(900px 500px at 12% -8%, rgba(2, 132, 199, 0.1), transparent 70%), radial-gradient(800px 480px at 92% 0%, rgba(15, 118, 110, 0.1), transparent 70%)',
        }}
      />

      <div className="w-full max-w-md space-y-6 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 p-8 sm:p-10 rounded-3xl relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-sky-600 to-teal-600 text-white shadow-md shadow-sky-500/20 mx-auto">
            <Microscope className="h-6 w-6" />
          </span>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            data<span className="text-sky-600">PATH</span>
          </h2>
          <p className="text-xs font-semibold text-slate-500">Plataforma de Patologia Digital & Mini-PACS</p>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-200 bg-teal-50 px-3 py-0.5 text-[11px] font-bold text-teal-800">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-600" /> LGPD Compliant (Lei 13.709/2018)
          </div>
        </div>

        {/* Quick Demo User Buttons */}
        <div className="space-y-2 pt-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
            Acesso Rápido de Teste (Dev)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillQuickUser('maria.silva@datapath.local')}
              className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold transition-all text-center"
            >
              🧪 Equipe técnica
            </button>
            <button
              type="button"
              onClick={() => fillQuickUser('carlos.mendes@datapath.local')}
              className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-bold transition-all text-center"
            >
              🔬 Usuário
            </button>
            <button
              type="button"
              onClick={() => fillQuickUser('admin@datapath.local')}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition-all text-center"
            >
              👑 Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
              E-mail Profissional
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@datapath.local"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
              Senha de Acesso
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 px-6 text-sm font-bold text-white shadow-md shadow-sky-600/20 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>Entrar na Plataforma</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 text-center space-y-2.5">
          <p className="text-xs text-slate-500">
            Deseja solicitar digitalização de lâminas ou parceria?
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('onboarding-apply');
                else window.location.href = '/onboarding';
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold transition-all shadow-xs"
            >
              <UserCheck className="h-4 w-4" /> Formulário de Parceiros
            </button>

            <button
              type="button"
              onClick={() => {
                if (onNavigate) onNavigate('home');
                else window.location.href = '/';
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs"
            >
              <Home className="h-4 w-4" /> Portal Institucional
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

