import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewCasePage } from './pages/NewCasePage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { OnboardingApplyPage } from './pages/OnboardingApplyPage';
import { OnboardingManagementPage } from './pages/OnboardingManagementPage';

function getInitialRoute(): { page: string; caseId?: string } {
  const path = window.location.pathname.toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);

  if (path === '/onboarding' || path === '/cadastrar' || searchParams.get('page') === 'onboarding-apply') {
    return { page: 'onboarding-apply' };
  }
  if (path === '/login') {
    return { page: 'login' };
  }
  if (path === '/sistema' || path === '/dashboard' || searchParams.get('page') === 'dashboard') {
    return { page: 'dashboard' };
  }
  if (path === '/novo-caso') {
    return { page: 'new-case' };
  }
  if (path.startsWith('/caso/')) {
    const id = path.split('/caso/')[1];
    return { page: 'case-detail', caseId: id };
  }
  if (path === '/gestao-onboarding') {
    return { page: 'onboarding-management' };
  }
  if (path === '/auditoria') {
    return { page: 'audit-logs' };
  }
  if (path === '/' || path === '/home') {
    return { page: 'home' };
  }
  return { page: 'home' };
}

function updateBrowserUrl(page: string, caseId?: string) {
  let targetPath = '/';
  if (page === 'home') targetPath = '/';
  else if (page === 'onboarding-apply') targetPath = '/onboarding';
  else if (page === 'login') targetPath = '/login';
  else if (page === 'dashboard') targetPath = '/dashboard';
  else if (page === 'new-case') targetPath = '/novo-caso';
  else if (page === 'case-detail' && caseId) targetPath = `/caso/${caseId}`;
  else if (page === 'onboarding-management') targetPath = '/gestao-onboarding';
  else if (page === 'audit-logs') targetPath = '/auditoria';

  if (window.location.pathname !== targetPath) {
    window.history.pushState({}, '', targetPath);
  }
}

const MainApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [route, setRoute] = useState(() => getInitialRoute());

  useEffect(() => {
    const handlePopState = () => {
      setRoute(getInitialRoute());
    };
    const handleCustomNav = (e: any) => {
      if (e.detail) {
        handleNavigate(e.detail.page || e.detail, e.detail.caseId);
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('navigate', handleCustomNav);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('navigate', handleCustomNav);
    };
  }, []);

  const handleNavigate = (page: string, caseId?: string) => {
    setRoute({ page, caseId });
    updateBrowserUrl(page, caseId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        <div className="flex items-center space-x-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
          <div className="w-4 h-4 rounded-full bg-sky-600 animate-ping" />
          <span className="text-sm font-bold tracking-wide text-slate-800">Carregando dataPATH...</span>
        </div>
      </div>
    );
  }

  // 1. Landing Page Institucional Pública
  if (route.page === 'home') {
    return <HomePage onNavigate={handleNavigate} />;
  }

  // 2. Direct Public Access to Onboarding / Digitalization Form
  if (route.page === 'onboarding-apply') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
        <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <OnboardingApplyPage onNavigate={page => handleNavigate(page)} />
        </div>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          Plataforma digiPATH • dataPATH Mini-PACS & Onboarding • UFES & AFECC • FAPES (Edital 09/2024)
        </footer>
      </div>
    );
  }

  // 3. Login Page
  if (route.page === 'login' && !isAuthenticated) {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  // If not logged in and tried to access authenticated pages, show Login Page
  if (!isAuthenticated) {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  // Authenticated Portal (Mini-PACS, Biopsias, Auditoria, Gestao)
  const activePage = route.page;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-sky-500 selection:text-white flex flex-col antialiased">
      <Navbar onNavigate={handleNavigate} currentPage={activePage} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activePage === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
        {activePage === 'new-case' && <NewCasePage onNavigate={handleNavigate} />}
        {activePage === 'case-detail' && route.caseId && (
          <CaseDetailPage caseId={route.caseId} onNavigate={handleNavigate} />
        )}
        {activePage === 'audit-logs' && <AuditLogsPage />}
        {activePage === 'onboarding-management' && <OnboardingManagementPage />}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        Plataforma dataPATH — Mini-PACS de Patologia Digital • UFES & AFECC • LGPD Compliant (Lei 13.709/2018)
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

