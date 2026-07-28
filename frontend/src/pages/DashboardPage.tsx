import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { BiopsyCaseSummary } from '../types/api';
import { useAuth } from '../context/AuthContext';

interface DashboardPageProps {
  onNavigate: (page: string, caseId?: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [cases, setCases] = useState<BiopsyCaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [organFilter, setOrganFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const res = await api.getCases({
        search,
        organSite: organFilter,
        status: statusFilter,
        page,
      });
      setCases(res.items);
      setTotalPages(res.totalPages);
      setTotalItems(res.totalItems);
    } catch (err) {
      console.error('Erro ao buscar casos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [search, organFilter, statusFilter, page]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">🟡 Pendente</span>;
      case 'InReview':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-500/30">🔵 Em Revisão</span>;
      case 'Laudado':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/40">🟢 Laudado</span>;
      case 'ReadyForArchive':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">📦 Arquivado</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-900/40 p-8 rounded-2xl border border-blue-500/20 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Dashboard de Casos Histopatológicos</h1>
          <p className="text-sm text-slate-300 mt-1">
            Visualização anonimizada e compartilhamento de lâminas WSI em alta resolução para 2ª opinião.
          </p>
        </div>
        {(user?.role === 'LabOperator' || user?.role === 'Admin') && (
          <button
            onClick={() => onNavigate('new-case')}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-2 text-sm whitespace-nowrap"
          >
            <span>➕ Novo Caso Clínico</span>
          </button>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/90 backdrop-blur-xl space-y-3 hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registrado</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400">📊</span>
          </div>
          <p className="text-3xl font-black text-white">{totalItems}</p>
          <p className="text-xs text-slate-400">Casos na base de dados</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/90 backdrop-blur-xl space-y-3 hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Pendentes</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400">⏳</span>
          </div>
          <p className="text-3xl font-black text-blue-300">{cases.filter(c => c.status === 'Pending').length}</p>
          <p className="text-xs text-slate-400">Aguardando parecer</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/90 backdrop-blur-xl space-y-3 hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Em Revisão</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400">🔬</span>
          </div>
          <p className="text-3xl font-black text-blue-400">{cases.filter(c => c.status === 'InReview').length}</p>
          <p className="text-xs text-slate-400">Em análise técnica</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/90 backdrop-blur-xl space-y-3 hover:border-slate-700/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Laudados</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400">✅</span>
          </div>
          <p className="text-3xl font-black text-blue-200">{cases.filter(c => c.status === 'Laudado').length}</p>
          <p className="text-xs text-slate-400">Laudo emitido e assinado</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/90 backdrop-blur-xl flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Buscar por código (ex: DP-2026-0001) ou órgão..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm transition-all"
          />
          <span className="absolute left-3.5 top-3 text-slate-500">🔍</span>
        </div>

        {/* Organ Filter */}
        <select
          value={organFilter}
          onChange={(e) => { setOrganFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm transition-all"
        >
          <option value="">Todos os Órgãos</option>
          <option value="Pele">Pele</option>
          <option value="Mama">Mama</option>
          <option value="Próstata">Próstata</option>
          <option value="Pulmão">Pulmão</option>
          <option value="Intestino">Intestino</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm transition-all"
        >
          <option value="">Todos os Status</option>
          <option value="Pending">Pendente</option>
          <option value="InReview">Em Revisão</option>
          <option value="Laudado">Laudado</option>
          <option value="ReadyForArchive">Arquivado</option>
        </select>
      </div>

      {/* Cases Table */}
      <div className="bg-slate-900/50 rounded-2xl border border-slate-800/90 backdrop-blur-xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Carregando casos clínicos...</div>
        ) : cases.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <p className="text-2xl">🔬</p>
            <p className="text-base font-semibold">Nenhum caso clínico encontrado.</p>
            <p className="text-xs text-slate-500">Tente ajustar os filtros ou cadastrar um novo caso.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Código do Caso (LGPD)</th>
                  <th className="px-6 py-4">Órgão / Coloração</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Lâminas WSI</th>
                  <th className="px-6 py-4">Data Registro</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {cases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onNavigate('case-detail', c.id)}
                    className="hover:bg-blue-600/10 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 font-mono font-bold text-blue-400 group-hover:text-blue-300 flex items-center space-x-2">
                      <span>{c.internalCaseCode}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{c.organSite}</div>
                      <div className="text-xs text-slate-400">{c.stainingType}</div>
                    </td>

                    <td className="px-6 py-4">{getStatusBadge(c.status)}</td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-medium text-slate-300">
                        <span>🖼️</span>
                        <span>{c.slideCount} arquivo(s)</span>
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('case-detail', c.id);
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all"
                      >
                        Abrir Caso →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Página {page} de {totalPages} ({totalItems} casos no total)
            </span>
            <div className="flex space-x-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 text-xs font-semibold"
              >
                ← Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 text-xs font-semibold"
              >
                Próxima →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
