import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Microscope, Layers, PlusCircle, UserCheck, ShieldCheck, ExternalLink, LogOut, Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated) return null;

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'Admin':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Admin</span>;
      case 'LabOperator':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">Técnico Lab</span>;
      case 'SpecialistDoctor':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Patologista</span>;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1500px] px-4 py-3 sm:px-8 flex items-center justify-between">
        {/* Brand logo */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 glow-cyan">
              <Microscope className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  data<span className="text-gradient">PATH</span>
                </span>
                <span className="rounded-full border border-indigo-500/40 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
                  Mini-PACS v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Patologia Digital & 2ª Opinião Remota</p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                currentPage === 'dashboard'
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <Layers className="h-4 w-4" /> Painel de Casos
            </button>

            {(user?.role === 'LabOperator' || user?.role === 'Admin') && (
              <>
                <button
                  onClick={() => onNavigate('new-case')}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    currentPage === 'new-case'
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <PlusCircle className="h-4 w-4" /> Cadastrar Biópsia
                </button>

                <button
                  onClick={() => onNavigate('onboarding-management')}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    currentPage === 'onboarding-management'
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <UserCheck className="h-4 w-4" /> Gestão de Parceiros
                </button>
              </>
            )}

            {user?.role === 'Admin' && (
              <button
                onClick={() => onNavigate('audit-logs')}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  currentPage === 'audit-logs'
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <ShieldCheck className="h-4 w-4" /> Auditoria LGPD
              </button>
            )}

            <button
              onClick={() => onNavigate('onboarding-apply')}
              className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all ml-2"
            >
              <ExternalLink className="h-4 w-4" /> Form. Parceiros
            </button>
          </nav>
        </div>

        {/* User profile & actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 text-xs font-bold text-slate-950">
              {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'US'}
            </span>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{user?.fullName}</span>
                {getRoleBadge(user?.role)}
              </div>
              <span className="block text-[10px] text-slate-400">{user?.email}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 transition-colors hover:text-rose-400 hover:border-rose-500/40"
            title="Sair da plataforma"
          >
            <LogOut className="h-4 w-4" />
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-2">
          <button
            onClick={() => { onNavigate('dashboard'); setMobileOpen(false); }}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800"
          >
            <Layers className="h-4 w-4 text-cyan-400" /> Painel de Casos
          </button>
          {(user?.role === 'LabOperator' || user?.role === 'Admin') && (
            <>
              <button
                onClick={() => { onNavigate('new-case'); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                <PlusCircle className="h-4 w-4 text-cyan-400" /> Cadastrar Biópsia
              </button>
              <button
                onClick={() => { onNavigate('onboarding-management'); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800"
              >
                <UserCheck className="h-4 w-4 text-cyan-400" /> Gestão de Parceiros
              </button>
            </>
          )}
          {user?.role === 'Admin' && (
            <button
              onClick={() => { onNavigate('audit-logs'); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              <ShieldCheck className="h-4 w-4 text-indigo-400" /> Auditoria LGPD
            </button>
          )}
          <button
            onClick={() => { onNavigate('onboarding-apply'); setMobileOpen(false); }}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-cyan-400 bg-cyan-500/10"
          >
            <ExternalLink className="h-4 w-4" /> Form. Público de Parceiros
          </button>
        </div>
      )}
    </header>
  );
};
