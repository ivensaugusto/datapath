import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ApplicationBadge } from '../components/StatusBadge';
import { FileText } from 'lucide-react';

export const OnboardingManagementPage: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [expectedSlidesCount, setExpectedSlidesCount] = useState(10);
  const [reviewNotes, setReviewNotes] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await api.getOnboardingRequests(statusFilter, equipmentFilter);
      setRequests(data.items || []);
    } catch (err) {
      console.error('Erro ao buscar solicitações:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, equipmentFilter]);

  const handleApprove = async () => {
    if (!selectedRequest) return;
    setSubmittingAction(true);
    try {
      await api.approveOnboardingRequest(selectedRequest.id, {
        reviewNotes,
        expectedSlidesCount,
      });
      alert('Solicitação APROVADA com sucesso! Ordem de Digitalização gerada.');
      setSelectedRequest(null);
      await fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Erro ao aprovar solicitação.');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    if (!reviewNotes) {
      alert('Informe a justificativa de rejeição nas notas de revisão.');
      return;
    }
    setSubmittingAction(true);
    try {
      await api.rejectOnboardingRequest(selectedRequest.id, reviewNotes);
      alert('Solicitação REJEITADA com sucesso.');
      setSelectedRequest(null);
      await fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Erro ao rejeitar solicitação.');
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">Gestão de Parceiros</h1>
          <p className="text-sm text-slate-400 mt-1">
            Análise das solicitações de onboarding e controle de cotas de uso dos equipamentos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-300 outline-none"
          >
            <option value="">Todos Status</option>
            <option value="Pending">Pendente</option>
            <option value="Approved">Aprovado</option>
            <option value="Rejected">Rejeitado</option>
          </select>

          <select
            value={equipmentFilter}
            onChange={e => setEquipmentFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-xs text-slate-300 outline-none"
          >
            <option value="">Todos Equipamentos</option>
            <option value="scanner">Scanner 3DHISTECH</option>
            <option value="pcr">PCR Real Time 7500</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <section className="glass-card overflow-x-auto rounded-2xl p-4 sm:p-6">
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-400">Carregando solicitações de parceiros...</div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">Nenhuma solicitação encontrada.</div>
        ) : (
          <table className="w-full border-separate border-spacing-y-2 text-xs">
            <thead>
              <tr className="text-left text-slate-400 font-bold uppercase tracking-wider">
                <th className="px-4 pb-2">Pesquisador</th>
                <th className="px-4 pb-2">Projeto & Modalidade</th>
                <th className="px-4 pb-2">Equipamentos</th>
                <th className="px-4 pb-2">Parecer CEP</th>
                <th className="px-4 pb-2">Status</th>
                <th className="px-4 pb-2 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((a) => (
                <tr key={a.id} className="bg-slate-900/40 hover:bg-slate-800/40 transition-colors">
                  <td className="rounded-l-xl border-y border-l border-slate-800 px-4 py-3">
                    <div className="font-bold text-white text-sm">{a.fullName}</div>
                    <div className="text-slate-400 mt-0.5">{a.email}</div>
                    <div className="text-cyan-400 font-semibold mt-0.5">{a.institutionAndDepartment}</div>
                  </td>
                  <td className="border-y border-slate-800 px-4 py-3 max-w-xs">
                    <span className="rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-bold inline-block mb-1">
                      {a.modality}
                    </span>
                    <p className="text-slate-300 truncate">{a.researchTitle}</p>
                  </td>
                  <td className="border-y border-slate-800 px-4 py-3 space-y-1">
                    {a.requestScanner3DHistech && (
                      <span className="text-emerald-400 font-semibold block">🔬 Scanner 3DHISTECH</span>
                    )}
                    {a.requestPcrRealTime7500 && (
                      <span className="text-cyan-400 font-semibold block">🧬 PCR 7500</span>
                    )}
                  </td>
                  <td className="border-y border-slate-800 px-4 py-3">
                    {a.hasEthicsApproval ? (
                      <div>
                        <span className="text-emerald-400 font-bold block">✓ CEP Aprovado</span>
                        {a.ethicsDocumentsCount > 0 && (
                          <button
                            onClick={() => setPdfPreviewUrl(api.getOnboardingDocumentUrl(a.id, 0))}
                            className="inline-flex items-center gap-1 text-cyan-400 hover:underline font-mono text-[11px] mt-1"
                          >
                            <FileText className="h-3 w-3" /> Ver PDF Parecer ({a.ethicsDocumentsCount})
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-amber-400 font-semibold">⚠️ Sem parecer prévio</span>
                    )}
                  </td>
                  <td className="border-y border-slate-800 px-4 py-3">
                    <ApplicationBadge status={a.status === 'Pending' ? 'Em Análise' : a.status === 'Approved' ? 'Aprovado' : 'Rejeitado'} />
                  </td>
                  <td className="rounded-r-xl border-y border-r border-slate-800 px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedRequest(a);
                        setReviewNotes(a.reviewNotes || '');
                      }}
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-3.5 text-xs font-bold text-slate-950 hover:opacity-90 transition-opacity"
                    >
                      Avaliar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Modal Evaluation */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="glass-card w-full max-w-xl rounded-2xl p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white">Avaliar Solicitação de Onboarding</h2>
                <p className="text-xs text-slate-400">{selectedRequest.fullName} • {selectedRequest.institutionAndDepartment}</p>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="text-xs text-slate-400 hover:text-white">
                Fechar ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Qtd. Lâminas Estimadas para Escaneamento</label>
                <input
                  type="number"
                  min={1}
                  value={expectedSlidesCount}
                  onChange={e => setExpectedSlidesCount(parseInt(e.target.value) || 1)}
                  className="h-10 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 text-sm text-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 uppercase mb-1">Notas de Revisão / Justificativa</label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  placeholder="Justificativa da aprovação ou rejeição..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleReject}
                disabled={submittingAction}
                className="h-10 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 text-xs font-bold text-rose-300 hover:bg-rose-500/20"
              >
                Rejeitar Parceria
              </button>

              <button
                onClick={handleApprove}
                disabled={submittingAction}
                className="h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-6 text-xs font-bold text-slate-950 hover:opacity-90"
              >
                {submittingAction ? 'Processando...' : 'Aprovar Solicitação'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {pdfPreviewUrl && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="glass-card h-[80vh] w-full max-w-4xl rounded-2xl p-4 flex flex-col space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white">Visualizador do Parecer CEP/CEUA PDF</span>
              <button onClick={() => setPdfPreviewUrl(null)} className="text-xs text-slate-400 hover:text-white">
                Fechar ✕
              </button>
            </div>
            <iframe src={pdfPreviewUrl} className="flex-1 w-full rounded-xl bg-white" title="PDF CEP" />
          </div>
        </div>
      )}
    </div>
  );
};
