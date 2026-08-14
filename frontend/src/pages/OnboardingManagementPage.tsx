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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Gestão de Parceiros</h1>
          <p className="text-sm text-slate-600 mt-1">
            Análise das solicitações de onboarding e controle de cotas de uso dos equipamentos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none shadow-2xs focus:border-sky-500"
          >
            <option value="">Todos Status</option>
            <option value="Pending">Pendente</option>
            <option value="Approved">Aprovado</option>
            <option value="Rejected">Rejeitado</option>
          </select>

          <select
            value={equipmentFilter}
            onChange={e => setEquipmentFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none shadow-2xs focus:border-sky-500"
          >
            <option value="">Todos Equipamentos</option>
            <option value="scanner">Scanner 3DHISTECH</option>
            <option value="pcr">PCR Real Time 7500</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="py-12 text-center text-sm font-medium text-slate-500">Carregando solicitações de parceiros...</div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center text-sm font-medium text-slate-400">Nenhuma solicitação encontrada.</div>
        ) : (
          <table className="w-full border-separate border-spacing-y-2 text-xs">
            <thead>
              <tr className="text-left text-slate-500 font-bold uppercase tracking-wider">
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
                <tr key={a.id} className="bg-slate-50 hover:bg-sky-50/50 transition-colors">
                  <td className="rounded-l-2xl border-y border-l border-slate-200 px-4 py-3">
                    <div className="font-bold text-slate-900 text-sm">{a.fullName}</div>
                    <div className="text-slate-500 mt-0.5">{a.email}</div>
                    <div className="text-sky-700 font-semibold mt-0.5">{a.institutionAndDepartment}</div>
                  </td>
                  <td className="border-y border-slate-200 px-4 py-3 max-w-xs">
                    <span className="rounded-full bg-sky-100 text-sky-800 border border-sky-200 px-2.5 py-0.5 text-[10px] font-bold inline-block mb-1">
                      {a.modality}
                    </span>
                    <p className="text-slate-700 truncate font-medium">{a.researchTitle}</p>
                  </td>
                  <td className="border-y border-slate-200 px-4 py-3 space-y-1">
                    {a.requestScanner3DHistech && (
                      <span className="text-teal-800 font-bold block">🔬 Scanner 3DHISTECH</span>
                    )}
                    {a.requestPcrRealTime7500 && (
                      <span className="text-sky-800 font-bold block">🧬 PCR 7500</span>
                    )}
                  </td>
                  <td className="border-y border-slate-200 px-4 py-3">
                    {a.hasEthicsApproval ? (
                      <div>
                        <span className="text-teal-800 font-bold block">✓ CEP Aprovado</span>
                        {a.ethicsDocumentsCount > 0 && (
                          <button
                            onClick={() => setPdfPreviewUrl(api.getOnboardingDocumentUrl(a.id, 0))}
                            className="inline-flex items-center gap-1 text-sky-700 hover:text-sky-900 font-semibold text-[11px] mt-1"
                          >
                            <FileText className="h-3.5 w-3.5 text-sky-600" /> Ver PDF Parecer ({a.ethicsDocumentsCount})
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-amber-800 font-bold">⚠️ Sem parecer prévio</span>
                    )}
                  </td>
                  <td className="border-y border-slate-200 px-4 py-3">
                    <ApplicationBadge status={a.status === 'Pending' ? 'Em Análise' : a.status === 'Approved' ? 'Aprovado' : 'Rejeitado'} />
                  </td>
                  <td className="rounded-r-2xl border-y border-r border-slate-200 px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedRequest(a);
                        setReviewNotes(a.reviewNotes || '');
                      }}
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 px-4 text-xs font-bold text-white shadow-xs transition-colors"
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
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Avaliar Solicitação de Onboarding</h2>
                <p className="text-xs text-slate-500">{selectedRequest.fullName} • {selectedRequest.institutionAndDepartment}</p>
              </div>
              <button onClick={() => setSelectedRequest(null)} className="text-xs font-bold text-slate-500 hover:text-slate-900 px-2 py-1 rounded-lg bg-slate-100">
                ✕ Fechar
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">Qtd. Lâminas Estimadas para Escaneamento</label>
                <input
                  type="number"
                  min={1}
                  value={expectedSlidesCount}
                  onChange={e => setExpectedSlidesCount(parseInt(e.target.value) || 1)}
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1.5">Notas de Revisão / Justificativa</label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  placeholder="Justificativa da aprovação ou orientações para o pesquisador..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-900 outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={handleReject}
                disabled={submittingAction}
                className="h-11 rounded-xl border border-rose-200 bg-rose-50 px-5 text-xs font-bold text-rose-800 hover:bg-rose-100"
              >
                Rejeitar Parceria
              </button>

              <button
                onClick={handleApprove}
                disabled={submittingAction}
                className="h-11 rounded-xl bg-teal-600 hover:bg-teal-700 px-6 text-xs font-bold text-white shadow-md shadow-teal-600/20"
              >
                {submittingAction ? 'Processando...' : 'Aprovar Solicitação'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Modal */}
      {pdfPreviewUrl && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="bg-white h-[85vh] w-full max-w-4xl rounded-3xl p-6 flex flex-col space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-sm font-black text-slate-900">Visualizador do Parecer CEP/CEUA PDF</span>
              <button onClick={() => setPdfPreviewUrl(null)} className="text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-slate-100">
                ✕ Fechar
              </button>
            </div>
            <iframe src={pdfPreviewUrl} className="flex-1 w-full rounded-2xl border border-slate-200 bg-slate-50" title="PDF CEP" />
          </div>
        </div>
      )}
    </div>
  );
};

