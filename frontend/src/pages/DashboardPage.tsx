import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { BiopsyCaseSummary } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { KpiCard } from '../components/KpiCard';
import { StatusBadge } from '../components/StatusBadge';
import { SlideThumb } from '../components/SlideThumb';
import { Layers, Users2, FileCheck2, ScanLine, Database, Microscope, Activity, Search, Plus } from 'lucide-react';

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

  // Compute Organ Breakdown Stats
  const organCounts = cases.reduce<Record<string, number>>((acc, c) => {
    const organ = c.organSite || 'Outros';
    acc[organ] = (acc[organ] || 0) + 1;
    return acc;
  }, {});

  const pendingCount = cases.filter(c => c.status === 'Pending').length;
  const laudadoCount = cases.filter(c => c.status === 'Laudado').length;
  const inReviewCount = cases.filter(c => c.status === 'InReview').length;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Painel do Mini-PACS dataPATH
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Gestão de lâminas histopatológicas gigapixel e telepatologia diagnóstica em tempo real
          </p>
        </div>
        {(user?.role === 'LabOperator' || user?.role === 'Admin') && (
          <button
            onClick={() => onNavigate('new-case')}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 px-5 text-sm font-bold text-white shadow-md shadow-sky-600/20 transition-all"
          >
            <Plus className="h-4 w-4" /> Cadastrar Biópsia
          </button>
        )}
      </div>

      {/* KPI Metrics Row */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          label="Total de casos"
          value={totalItems}
          icon={Layers}
          tone="cyan"
          hint="Biópsias no acervo ativo"
        />
        <KpiCard
          label="Aguardando parecer"
          value={pendingCount}
          icon={Users2}
          tone="indigo"
          hint="2ª opinião pendente"
        />
        <KpiCard
          label="Laudos concluídos"
          value={laudadoCount}
          icon={FileCheck2}
          tone="emerald"
          hint="Assinados digitalmente"
        />
        <KpiCard
          label="Em análise técnica"
          value={inReviewCount}
          icon={ScanLine}
          tone="amber"
          hint="Em triagem laboratorial"
        />
        <KpiCard
          label="Armazenamento WSI"
          value="1.42"
          unit="TB"
          icon={Database}
          tone="rose"
          hint={`${totalItems} lâminas gigapixel no NAS`}
        />
      </section>

      {/* Main Grid: Cases List + Organ Breakdown */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-slate-900">Casos Clínicos & Lâminas</h2>
              <p className="text-xs text-slate-500">Dados histopatológicos anonimizados em conformidade com a LGPD</p>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 sm:w-56">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Buscar código ou órgão..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white transition-all"
                />
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              </div>

              <select
                value={organFilter}
                onChange={(e) => { setOrganFilter(e.target.value); setPage(1); }}
                className="h-9 rounded-xl bg-slate-50 border border-slate-200 px-3 text-xs font-medium text-slate-700 outline-none focus:border-sky-500 focus:bg-white transition-all"
              >
                <option value="">Todos Órgãos</option>
                <option value="Próstata">Próstata</option>
                <option value="Mama">Mama</option>
                <option value="Tiróide">Tiróide</option>
                <option value="Pele">Pele</option>
                <option value="Pulmão">Pulmão</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="h-9 rounded-xl bg-slate-50 border border-slate-200 px-3 text-xs font-medium text-slate-700 outline-none focus:border-sky-500 focus:bg-white transition-all"
              >
                <option value="">Todos Status</option>
                <option value="Pending">Pendente</option>
                <option value="InReview">Em Revisão</option>
                <option value="Laudado">Laudado</option>
                <option value="ReadyForArchive">Arquivado</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-sm font-medium text-slate-500">Carregando acervo de lâminas...</div>
          ) : cases.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Microscope className="mx-auto h-10 w-10 text-slate-300" />
              <p className="text-sm font-bold text-slate-700">Nenhum caso clínico encontrado</p>
              <p className="text-xs text-slate-500">Tente ajustar os filtros ou pesquisar por outro termo.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {cases.map((c) => (
                <li
                  key={c.id}
                  onClick={() => onNavigate('case-detail', c.id)}
                  className="group flex items-center justify-between gap-4 py-3.5 px-3 rounded-2xl transition-all hover:bg-sky-50/50 cursor-pointer"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <SlideThumb
                      stain={c.stainingType || 'HE'}
                      seed={c.id}
                      className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 object-cover shadow-2xs group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0">
                      <span className="block truncate font-mono text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {c.internalCaseCode}
                      </span>
                      <p className="truncate text-xs text-slate-500 mt-0.5">
                        {c.organSite} • Coloração {c.stainingType} • {c.slideCount} lâmina(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <StatusBadge status={c.status} />
                    <span className="text-xs font-bold text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all">→</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-medium text-slate-500">
              <span>Página {page} de {totalPages}</span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40 shadow-2xs font-semibold"
                >
                  Anterior
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40 shadow-2xs font-semibold"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Organ Distribution & Scanner Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-bold tracking-wide text-slate-500 uppercase">Carga por Órgão / Tecido</h2>
            <ul className="space-y-3.5">
              {Object.keys(organCounts).length === 0 ? (
                <li className="text-xs text-slate-500">Sem dados estatísticos.</li>
              ) : (
                Object.entries(organCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([organ, count]) => (
                    <li key={organ}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{organ}</span>
                        <span className="tabular-nums font-bold text-slate-500">{count} caso(s)</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-500 to-teal-600"
                          style={{ width: `${Math.min(100, (count / (totalItems || 1)) * 100)}%` }}
                        />
                      </div>
                    </li>
                  ))
              )}
            </ul>

            <div className="mt-6 flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800 font-medium">
              <Activity className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>Scanner 3DHISTECH Operacional • Fila de digitalização pronta</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

