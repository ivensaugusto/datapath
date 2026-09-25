import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Microscope, Layers, PlusCircle, UserCheck, ShieldCheck, ExternalLink, LogOut, Menu, X, Home, BookOpen, FileDown } from 'lucide-react';

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
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">Admin</span>;
      case 'TechTeam':
      case 'LabOperator':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-100 text-teal-800 border border-teal-200">Equipe técnica</span>;
      case 'User':
      case 'SpecialistDoctor':
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Usuário</span>;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto max-w-[1500px] px-4 py-3 sm:px-8 flex items-center justify-between">
        {/* Brand logo */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-sky-600 to-teal-600 text-white shadow-sm shadow-sky-500/20">
              <Microscope className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  data<span className="text-sky-600">PATH</span>
                </span>
                <span className="rounded-full border border-sky-200 bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                  Mini-PACS v2.0
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">Patologia Digital & 2ª Opinião Remota</p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                currentPage === 'home'
                  ? 'bg-sky-100 text-sky-800 border border-sky-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Home className="h-4 w-4" /> Portal Institucional
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                currentPage === 'dashboard'
                  ? 'bg-sky-100 text-sky-800 border border-sky-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Layers className="h-4 w-4" /> Painel de Casos
            </button>

            {(user?.role === 'TechTeam' || user?.role === 'LabOperator' || user?.role === 'Admin') && (
              <>
                <button
                  onClick={() => onNavigate('new-case')}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    currentPage === 'new-case'
                      ? 'bg-sky-100 text-sky-800 border border-sky-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <PlusCircle className="h-4 w-4" /> Cadastrar Biópsia
                </button>

                <button
                  onClick={() => onNavigate('onboarding-management')}
                  className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                    currentPage === 'onboarding-management'
                      ? 'bg-sky-100 text-sky-800 border border-sky-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
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
                    ? 'bg-sky-100 text-sky-800 border border-sky-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="h-4 w-4" /> Auditoria LGPD
              </button>
            )}

            <button
              onClick={() => onNavigate('onboarding-apply')}
              className="flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all ml-2"
            >
              <ExternalLink className="h-4 w-4" /> Form. Parceiros
            </button>

            <div className="flex items-stretch ml-1 rounded-xl border border-slate-200 overflow-hidden">
              <a
                href="/manual.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all"
                title="Abrir Manual Online em nova aba"
              >
                <BookOpen className="h-4 w-4 text-sky-600" /> Manual
              </a>
              <div className="w-px bg-slate-200"></div>
              <a
                href="/manual-dataPATH-oficial.pdf"
                download
                className="flex items-center px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                title="Baixar Manual Oficial em PDF"
              >
                <FileDown className="h-4 w-4" />
              </a>
            </div>
          </nav>
        </div>

        {/* User profile & actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 shadow-2xs">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-tr from-sky-600 to-teal-600 text-xs font-bold text-white shadow-xs">
              {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'US'}
            </span>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">{user?.fullName}</span>
                {getRoleBadge(user?.role)}
              </div>
              <span className="block text-[10px] text-slate-500">{user?.email}</span>
            </div>
          </div>

          <button
            onClick={logout}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 shadow-2xs"
            title="Sair da plataforma"
          >
            <LogOut className="h-4 w-4" />
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 lg:hidden shadow-2xs"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-2 shadow-lg">
          <button
            onClick={() => { onNavigate('home'); setMobileOpen(false); }}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            <Home className="h-4 w-4 text-sky-600" /> Portal Institucional
          </button>
          <button
            onClick={() => { onNavigate('dashboard'); setMobileOpen(false); }}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            <Layers className="h-4 w-4 text-sky-600" /> Painel de Casos
          </button>
          {(user?.role === 'TechTeam' || user?.role === 'LabOperator' || user?.role === 'Admin') && (
            <>
              <button
                onClick={() => { onNavigate('new-case'); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <PlusCircle className="h-4 w-4 text-sky-600" /> Cadastrar Biópsia
              </button>
              <button
                onClick={() => { onNavigate('onboarding-management'); setMobileOpen(false); }}
                className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                <UserCheck className="h-4 w-4 text-sky-600" /> Gestão de Parceiros
              </button>
            </>
          )}
          {user?.role === 'Admin' && (
            <button
              onClick={() => { onNavigate('audit-logs'); setMobileOpen(false); }}
              className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <ShieldCheck className="h-4 w-4 text-teal-600" /> Auditoria LGPD
            </button>
          )}
          <button
            onClick={() => { onNavigate('onboarding-apply'); setMobileOpen(false); }}
            className="w-full flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-sky-700 bg-sky-50"
          >
            <ExternalLink className="h-4 w-4" /> Form. Público de Parceiros
          </button>
          <div className="grid grid-cols-2 gap-2">
            <a
              href="/manual.html"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200"
            >
              <BookOpen className="h-4 w-4 text-sky-600" /> Manual Online
            </a>
            <a
              href="/manual-dataPATH-oficial.pdf"
              download
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200"
            >
              <FileDown className="h-4 w-4 text-teal-600" /> Baixar PDF
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
