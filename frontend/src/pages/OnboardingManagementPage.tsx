import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

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
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-black text-white">Gestão de Onboarding & Ordens de Serviço</h1>
          <p className="text-xs text-slate-400 mt-1">
            Avalie solicitações de acesso ao laboratório, analise documentos do CEP/CEUA e gere ordens de digitalização.
          </p>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
          >
            <option value="">Todos os Status</option>
            <option value="Pending">Pendentes</option>
            <option value="Approved">Aprovados</option>
            <option value="Rejected">Rejeitados</option>
          </select>

          <select
            value={equipmentFilter}
            onChange={e => setEquipmentFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
          >
            <option value="">Todos os Equipamentos</option>
            <option value="scanner">Scanner 3DHISTECH</option>
            <option value="pcr">PCR Real Time 7500</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Carregando solicitações de cadastro...</div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-slate-500">Nenhuma solicitação encontrada para os filtros selecionados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800 font-mono">
                <tr>
                  <th className="p-4">Solicitante / Instituição</th>
                  <th className="p-4">Modalidade & Projeto</th>
                  <th className="p-4">Equipamentos</th>
                  <th className="p-4">Parecer Ético</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white">{req.fullName}</div>
                      <div className="text-xs text-slate-400">{req.email} • {req.phone}</div>
                      <div className="text-xs text-blue-400 mt-0.5 font-semibold">{req.institutionAndDepartment}</div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 block w-max mb-1">
                        {req.modality}
                      </span>
                      <div className="text-xs text-slate-200 line-clamp-2">{req.researchTitle}</div>
                    </td>
                    <td className="p-4 text-xs space-y-1">
                      {req.requestScanner3DHistech && (
                        <div className="text-emerald-400 font-semibold flex items-center space-x-1">
                          <span>🔬</span> <span>Scanner 3DHISTECH</span>
                        </div>
                      )}
                      {req.requestPcrRealTime7500 && (
                        <div className="text-blue-400 font-semibold flex items-center space-x-1">
                          <span>🧬</span> <span>PCR 7500</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-xs">
                      {req.hasEthicsApproval ? (
                        <div className="space-y-1">
                          <span className="text-emerald-400 font-semibold block">✓ Aprovado CEP/CEUA</span>
                          {req.ethicsDocumentsCount > 0 && (
                            <button
                              onClick={() => setPdfPreviewUrl(api.getOnboardingDocumentUrl(req.id, 0))}
                              className="text-blue-400 hover:underline flex items-center space-x-1 font-mono"
                            >
                              <span>📄 Ver PDF Parecer ({req.ethicsDocumentsCount})</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-amber-400 font-semibold">⚠️ Sem parecer prévio</span>
                      )}
                    </td>
                    <td className="p-4">
                      {req.status === 'Pending' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Pendente
                        </span>
                      )}
                      {req.status === 'Approved' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          ✓ Aprovado
                        </span>
                      )}
                      {req.status === 'Rejected' && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          ✕ Rejeitado
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedRequest(req);
                          setReviewNotes(req.reviewNotes || '');
                        }}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20"
                      >
                        Avaliar / Gerar Ordem
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Avaliação & Aprovação */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white">Avaliar Solicitação de Onboarding</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div><strong className="text-slate-400">Solicitante:</strong> <span className="text-white font-bold">{selectedRequest.fullName}</span> ({selectedRequest.email})</div>
              <div><strong className="text-slate-400">Instituição:</strong> <span className="text-blue-300">{selectedRequest.institutionAndDepartment}</span></div>
              <div><strong className="text-slate-400">Projeto:</strong> <span className="text-slate-200">{selectedRequest.researchTitle}</span></div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Quantidade Estimada de Lâminas para Digitalização (Ordem de Trabalho)
                </label>
                <input
                  type="number"
                  min={1}
                  value={expectedSlidesCount}
                  onChange={e => setExpectedSlidesCount(parseInt(e.target.value) || 1)}
                  className="w-full h-12 py-3 px-4 text-base bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Notas de Revisão / Observações Técnicas
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  placeholder="Ex: Documentação CEP validada. Ordem de trabalho autorizada para escaneamento no 3DHISTECH."
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={handleReject}
                disabled={submittingAction}
                className="px-4 py-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold"
              >
                ✕ Rejeitar Solicitação
              </button>

              <button
                type="button"
                onClick={handleApprove}
                disabled={submittingAction}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20"
              >
                {submittingAction ? 'Processando...' : '✓ Aprovar e Gerar Ordem (ORD-2026-XXXX)'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pré-visualização de PDF */}
      {pdfPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full h-[80vh] flex flex-col p-4 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white">Visualização de Documento CEP/CEUA</h3>
              <button
                onClick={() => setPdfPreviewUrl(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕ Fechar
              </button>
            </div>

            <iframe
              src={pdfPreviewUrl}
              className="w-full flex-1 rounded-xl border border-slate-800 bg-white"
              title="Pré-visualização CEP/CEUA PDF"
            />
          </div>
        </div>
      )}
    </div>
  );
};
