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

const MainApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  useEffect(() => {
    const handleCustomNav = (e: any) => {
      if (e.detail) setCurrentPage(e.detail);
    };
    window.addEventListener('navigate', handleCustomNav);
    return () => window.removeEventListener('navigate', handleCustomNav);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Carregando dataPATH...
      </div>
    );
  }

  if (currentPage === 'onboarding-apply') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
        <div className="flex-1 max-w-4xl w-full mx-auto px-6 sm:px-8 py-10">
          <OnboardingApplyPage onNavigate={page => setCurrentPage(page)} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const handleNavigate = (page: string, caseId?: string) => {
    setCurrentPage(page);
    if (caseId) {
      setSelectedCaseId(caseId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white flex flex-col">
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {currentPage === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
        {currentPage === 'new-case' && <NewCasePage onNavigate={handleNavigate} />}
        {currentPage === 'case-detail' && selectedCaseId && (
          <CaseDetailPage caseId={selectedCaseId} onNavigate={handleNavigate} />
        )}
        {currentPage === 'audit-logs' && <AuditLogsPage />}
        {currentPage === 'onboarding-management' && <OnboardingManagementPage />}
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
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
