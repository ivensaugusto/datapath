import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden antialiased">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 bg-slate-900/60 p-8 sm:p-10 rounded-2xl border border-slate-800/90 backdrop-blur-2xl shadow-2xl shadow-blue-600/5 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/30 ring-1 ring-blue-400/30 mb-1">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white font-sans">
            data<span className="text-blue-400">PATH</span>
          </h2>
          <p className="text-sm text-slate-400">Plataforma de Patologia Digital Mini-PACS</p>
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-300">
            🔒 Conformidade LGPD Rigorosa (Lei 13.709)
          </div>
        </div>

        {/* Quick Demo User Presets */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 text-center">
            Acesso Rápido de Teste (Dev)
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillQuickUser('maria.silva@datapath.local')}
              className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 text-xs font-medium transition-all text-center"
            >
              👩‍🔬 Técnico Lab
            </button>
            <button
              type="button"
              onClick={() => fillQuickUser('carlos.mendes@datapath.local')}
              className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 text-xs font-medium transition-all text-center"
            >
              👨‍⚕️ Patologista
            </button>
            <button
              type="button"
              onClick={() => fillQuickUser('admin@datapath.local')}
              className="p-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-medium transition-all text-center"
            >
              👑 Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center space-x-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              E-mail Profissional
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@datapath.local"
              className="w-full h-12 py-3 px-4 text-sm rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 py-3 px-4 text-sm rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 text-sm"
          >
            {loading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <span>Entrar no Sistema</span>
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800/80 text-center space-y-2">
          <p className="text-xs text-slate-400">
            É uma universidade ou laboratório parceiro?
          </p>
          <button
            type="button"
            onClick={() => {
              if (onNavigate) {
                onNavigate('onboarding-apply');
              } else {
                window.location.href = '/onboarding';
              }
            }}
            className="inline-block px-4 py-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all"
          >
            🚀 Solicitar Cadastro / Onboarding Nativo
          </button>
        </div>

        <p className="text-center text-xs text-slate-500">
          Senha padrão de teste: <code className="text-blue-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded">DataPath@2026</code>
        </p>
      </div>
    </div>
  );
};
