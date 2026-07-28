import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
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
  return { page: 'dashboard' };
}

function updateBrowserUrl(page: string, caseId?: string) {
  let targetPath = '/';
  if (page === 'onboarding-apply') targetPath = '/onboarding';
  else if (page === 'login') targetPath = '/login';
  else if (page === 'new-case') targetPath = '/novo-caso';
  else if (page === 'case-detail' && caseId) targetPath = `/caso/${caseId}`;
  else if (page === 'onboarding-management') targetPath = '/gestao-onboarding';
  else if (page === 'audit-logs') targetPath = '/auditoria';
  else if (page === 'dashboard') targetPath = '/';

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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-slate-400">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-ping" />
          <span className="text-sm font-semibold tracking-wide text-slate-300">Carregando dataPATH...</span>
        </div>
      </div>
    );
  }

  // Direct public access to Onboarding Apply Page
  if (route.page === 'onboarding-apply') {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans flex flex-col antialiased">
        <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <OnboardingApplyPage onNavigate={page => handleNavigate(page)} />
        </div>
        <footer className="border-t border-slate-900 bg-[#090d16] py-6 text-center text-xs text-slate-500">
          Plataforma dataPATH — Mini-PACS & Onboarding • LGPD Compliant (Lei 13.709/2018)
        </footer>
      </div>
    );
  }

  // If not logged in, force Login Page
  if (!isAuthenticated) {
    return <LoginPage onNavigate={handleNavigate} />;
  }

  // If authenticated but page was set to 'login', default to dashboard
  const activePage = route.page === 'login' ? 'dashboard' : route.page;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-blue-600 selection:text-white flex flex-col antialiased">
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

      <footer className="border-t border-slate-900 bg-[#090d16] py-6 text-center text-xs text-slate-500">
        Plataforma dataPATH — Mini-PACS de Patologia Digital • LGPD Compliant (Lei 13.709/2018)
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
