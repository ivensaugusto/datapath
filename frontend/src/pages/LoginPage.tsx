import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Microscope, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden antialiased">
      {/* Glow Backdrops */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(900px 500px at 12% -8%, rgba(6, 182, 212, 0.15), transparent 70%), radial-gradient(800px 480px at 92% 0%, rgba(99, 102, 241, 0.15), transparent 70%)',
        }}
      />

      <div className="w-full max-w-md space-y-6 glass-card p-8 sm:p-10 rounded-2xl relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 glow-cyan mx-auto">
            <Microscope className="h-6 w-6" />
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">
            data<span className="text-gradient">PATH</span>
          </h2>
          <p className="text-xs text-slate-400">Plataforma de Patologia Digital Mini-PACS</p>
          <div className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-[11px] font-bold text-emerald-400">
            <ShieldCheck className="h-3 w-3" /> LGPD Compliant (Lei 13.709/2018)
          </div>
        </div>

        {/* Quick Demo User Buttons */}
        <div className="space-y-2 pt-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center">
            Acesso Rápido de Teste (Dev)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillQuickUser('maria.silva@datapath.local')}
              className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 text-xs font-semibold transition-all text-center"
            >
              👩‍🔬 Técnico
            </button>
            <button
              type="button"
              onClick={() => fillQuickUser('carlos.mendes@datapath.local')}
              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-300 text-xs font-semibold transition-all text-center"
            >
              👨‍⚕️ Patologista
            </button>
            <button
              type="button"
              onClick={() => fillQuickUser('admin@datapath.local')}
              className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 text-xs font-semibold transition-all text-center"
            >
              👑 Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
              E-mail Profissional
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@datapath.local"
              className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 text-sm font-bold text-slate-950 transition-opacity hover:opacity-90 disabled:opacity-50"
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

        <div className="pt-2 border-t border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-400">
            Pesquisador ou instituição parceira?
          </p>
          <button
            type="button"
            onClick={() => {
              if (onNavigate) onNavigate('onboarding-apply');
              else window.location.href = '/onboarding';
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all"
          >
            <UserCheck className="h-4 w-4" /> Solicitado Cadastro / Onboarding
          </button>
        </div>
      </div>
    </div>
  );
};
