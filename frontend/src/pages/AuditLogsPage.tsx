import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { AuditLog } from '../types/api';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAuditLogs(page);
      setLogs(res.items);
      setTotalPages(res.totalPages);
      setTotalItems(res.totalItems);
    } catch (err) {
      console.error('Erro ao carregar logs de auditoria:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'READ':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">READ</span>;
      case 'CREATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">CREATE</span>;
      case 'UPDATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">UPDATE</span>;
      case 'DELETE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">DELETE</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-400">{action}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-3">
            <span>🔒 Trilha de Auditoria LGPD</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Admin Only
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Registro imutável de acessos, uploads e consultas a metadados clínicos e arquivos WSI (Lei 13.709/2018).
          </p>
        </div>

        <div className="text-right">
          <span className="text-2xl font-black text-white">{totalItems}</span>
          <span className="block text-xs text-slate-400">Registros de Auditoria</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Carregando trilha de auditoria...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Nenhum registro de auditoria encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3">Horário (UTC)</th>
                  <th className="px-5 py-3">Ação</th>
                  <th className="px-5 py-3">Entidade</th>
                  <th className="px-5 py-3">Usuário</th>
                  <th className="px-5 py-3">Endereço IP</th>
                  <th className="px-5 py-3">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-slate-400">
                      {new Date(log.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-5 py-3">{getActionBadge(log.action)}</td>
                    <td className="px-5 py-3 font-semibold text-white">
                      {log.entityName} {log.entityId ? <span className="font-mono text-slate-500">[{log.entityId.substring(0, 8)}...]</span> : ''}
                    </td>
                    <td className="px-5 py-3">
                      <span className="font-medium text-slate-200">{log.userName}</span>
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-400">{log.ipAddress}</td>
                    <td className="px-5 py-3 text-slate-400 max-w-xs truncate">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-slate-950/40 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Página {page} de {totalPages}</span>
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
