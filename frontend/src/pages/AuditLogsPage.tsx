import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { AuditLog } from '../types/api';
import { ShieldCheck, Search } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAuditLogs(page);
      setLogs(res.items);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Erro ao carregar logs de auditoria:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const filteredLogs = logs.filter(l =>
    [l.userName, l.action, l.ipAddress, l.entityName, l.details]
      .join(' ')
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'READ':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-200">READ</span>;
      case 'CREATE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">CREATE</span>;
      case 'UPDATE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">UPDATE</span>;
      case 'DELETE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">DELETE</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{action}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl flex items-center gap-3">
            Governança & Auditoria LGPD
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Registro imutável de acessos, uploads e emissões de laudo • retenção de 5 anos (Lei 13.709/2018)
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-bold text-teal-800 shadow-xs">
          <ShieldCheck className="h-4 w-4 text-teal-600" /> 100% dos eventos auditados
        </span>
      </div>

      {/* Audit Table */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute top-3 left-3.5 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por usuário, ação, IP ou recurso..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white transition-all"
          />
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-medium text-slate-500">Carregando trilha de auditoria...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-y-2 text-xs">
              <thead>
                <tr className="text-left text-slate-500 font-bold uppercase tracking-wider">
                  <th className="px-4 pb-2">Data / Hora</th>
                  <th className="px-4 pb-2">Usuário</th>
                  <th className="px-4 pb-2">Ação</th>
                  <th className="px-4 pb-2">Recurso / Entidade</th>
                  <th className="px-4 pb-2">Endereço IP</th>
                  <th className="px-4 pb-2">Conformidade</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((l) => (
                  <tr key={l.id} className="bg-slate-50 hover:bg-sky-50/50 transition-colors">
                    <td className="rounded-l-2xl border-y border-l border-slate-200 px-4 py-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {new Date(l.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="border-y border-slate-200 px-4 py-3">
                      <div className="font-bold text-slate-900">{l.userName}</div>
                    </td>
                    <td className="border-y border-slate-200 px-4 py-3 whitespace-nowrap">{getActionBadge(l.action)}</td>
                    <td className="border-y border-slate-200 px-4 py-3 font-mono text-slate-700">
                      {l.entityName} {l.entityId && <span className="text-slate-400">[{l.entityId.slice(0, 8)}]</span>}
                    </td>
                    <td className="border-y border-slate-200 px-4 py-3 font-mono text-slate-600 whitespace-nowrap">{l.ipAddress}</td>
                    <td className="rounded-r-2xl border-y border-r border-slate-200 px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-[10px] font-bold text-teal-800">
                        <ShieldCheck className="h-3 w-3 text-teal-600" /> Auditado
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                      Nenhum registro de auditoria encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-3 text-xs font-medium text-slate-500 border-t border-slate-100">
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
      </section>
    </div>
  );
};

