import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { BiopsyCaseDetail, SlideFile } from '../types/api';
import { useAuth } from '../context/AuthContext';

interface CaseDetailPageProps {
  caseId: string;
  onNavigate: (page: string) => void;
}

export const CaseDetailPage: React.FC<CaseDetailPageProps> = ({ caseId, onNavigate }) => {
  const { user } = useAuth();
  const [caseData, setCaseData] = useState<BiopsyCaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState<SlideFile | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Form State for Opinion
  const [diagnosticImpression, setDiagnosticImpression] = useState('');
  const [microscopicDescription, setMicroscopicDescription] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [priorityLevel, setPriorityLevel] = useState('Normal');
  const [submittingOpinion, setSubmittingOpinion] = useState(false);

  const fetchCase = async () => {
    setLoading(true);
    try {
      const data = await api.getCaseById(caseId);
      setCaseData(data);
      if (data.slideFiles.length > 0) {
        setActiveSlide(data.slideFiles[0]);
      }
    } catch (err) {
      console.error('Erro ao carregar detalhes do caso:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCase();
  }, [caseId]);

  const handleCreateOpinion = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingOpinion(true);
    try {
      await api.createOpinion(caseId, {
        diagnosticImpression,
        microscopicDescription,
        additionalComments,
        priorityLevel,
      });
      alert('Parecer clínico registrado com sucesso!');
      await fetchCase();
    } catch (err: any) {
      alert(err.message || 'Erro ao registrar parecer.');
    } finally {
      setSubmittingOpinion(false);
    }
  };

  const handleSignOpinion = async (opinionId: string) => {
    if (!confirm('Deseja realmente assinar digitalmente este parecer? O caso será concluído como Laudado.')) return;

    try {
      await api.signOpinion(opinionId);
      alert('Parecer assinado com sucesso!');
      await fetchCase();
    } catch (err: any) {
      alert(err.message || 'Erro ao assinar parecer.');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-400">Carregando detalhes do caso médico...</div>;
  }

  if (!caseData) {
    return <div className="p-12 text-center text-rose-400">Caso clínico não encontrado.</div>;
  }

  const isDoctorOrAdmin = user?.role === 'SpecialistDoctor' || user?.role === 'Admin';
  const latestOpinion = caseData.opinions[caseData.opinions.length - 1];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            ← Voltar
          </button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black text-white font-mono">{caseData.internalCaseCode}</h1>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                {caseData.organSite} ({caseData.stainingType})
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Cadastrado em {new Date(caseData.createdAt).toLocaleDateString('pt-BR')} por {caseData.createdByUserName}
            </p>
          </div>
        </div>

        {/* Report Export Button */}
        <a
          href={api.getReportUrl(caseData.id)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-sm font-semibold transition-all flex items-center justify-center space-x-2"
        >
          <span>📄 Relatório de Segunda Opinião</span>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Anamnese & Slides */}
        <div className="lg:col-span-1 space-y-6">
          {/* Anamnese Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Resumo Clínico / Anamnese</span>
              <span className="text-xs text-blue-400 font-normal">🔒 LGPD Anonimizado</span>
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-800/60 text-xs">
                <span className="text-slate-400">Sexo Biológico:</span>
                <span className="text-slate-200 font-semibold">{caseData.patientBiologicalSex || 'Não informado'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60 text-xs">
                <span className="text-slate-400">Idade à Biópsia:</span>
                <span className="text-slate-200 font-semibold">
                  {caseData.patientAgeAtBiopsy ? `${caseData.patientAgeAtBiopsy} anos` : 'Não informada'}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {caseData.clinicalSummary}
            </p>
          </div>

          {/* WSI Slides Card */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Lâminas WSI Vinculadas ({caseData.slideFiles.length})
            </h2>

            {caseData.slideFiles.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Nenhuma lâmina WSI anexada a este caso.</p>
            ) : (
              <div className="space-y-3">
                {caseData.slideFiles.map((slide) => (
                  <div
                    key={slide.id}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      activeSlide?.id === slide.id
                        ? 'bg-blue-600/10 border-blue-500/40 text-blue-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                    onClick={() => setActiveSlide(slide)}
                  >
                    <div className="space-y-0.5 overflow-hidden pr-2">
                      <p className="text-xs font-bold truncate text-white">{slide.originalFileName}</p>
                      <p className="text-[10px] text-slate-400">{(slide.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSlide(slide);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-all flex items-center space-x-1 shrink-0"
                    >
                      <span>🔬 Visualizar</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive WSI Viewer & Second Opinion Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive WSI Viewer Canvas Simulation */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🔬</span>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Visualizador de Lâmina WSI {activeSlide ? `— ${activeSlide.originalFileName}` : ''}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.5))}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                >
                  -
                </button>
                <span className="text-xs font-mono text-blue-400 font-bold px-2">{zoomLevel * 10}x Zoom</span>
                <button
                  onClick={() => setZoomLevel(z => Math.min(4, z + 0.5))}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Viewer Stage */}
            <div className="relative w-full h-[650px] min-h-[70vh] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center group shadow-inner">
              <div
                className="transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing text-center p-8"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <div className="w-64 h-44 rounded-xl bg-gradient-to-tr from-purple-950/80 via-pink-900/60 to-rose-950/80 border-2 border-pink-500/30 mx-auto shadow-2xl flex items-center justify-center p-4">
                  <div className="space-y-2">
                    <span className="text-sm font-mono text-pink-300 font-bold block">Histopatologia WSI</span>
                    <span className="text-xs text-pink-400/80 block">Coloração {caseData.stainingType}</span>
                    <div className="w-16 h-16 rounded-full bg-pink-500/20 ring-4 ring-pink-400/40 mx-auto animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 px-4 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md text-xs text-slate-300 border border-slate-800 font-mono shadow-lg">
                📍 Resolução Gigapixel • Pan & Zoom Ativo
              </div>
            </div>
          </div>

          {/* Clinical Opinion Section */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-white flex items-center justify-between">
              <span> Parecer Técnico (2ª Opinião Médica Remota)</span>
              {latestOpinion?.isSigned && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ✓ Assinado Digitalmente
                </span>
              )}
            </h2>

            {/* Existing Opinions List */}
            {caseData.opinions.length > 0 && (
              <div className="space-y-4">
                {caseData.opinions.map((op) => (
                  <div key={op.id} className="p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                      <span className="font-semibold text-blue-300">
                        👨‍⚕️ {op.issuedByUserName} ({op.issuedByUserSpecialty || 'Patologista'})
                      </span>
                      <span>{new Date(op.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Impressão Diagnóstica:</span>
                      <p className="text-sm font-semibold text-emerald-300 bg-emerald-950/30 p-3 rounded-lg border border-emerald-800/40">
                        {op.diagnosticImpression}
                      </p>
                    </div>

                    {op.microscopicDescription && (
                      <div>
                        <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Descrição Microscópica:</span>
                        <p className="text-xs text-slate-300 leading-relaxed">{op.microscopicDescription}</p>
                      </div>
                    )}

                    {!op.isSigned && isDoctorOrAdmin && (
                      <button
                        onClick={() => handleSignOpinion(op.id)}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20"
                      >
                        🖋️ Assinar Digitalmente e Concluir Laudo
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* New Opinion Form (Available for Specialist Doctor or Admin) */}
            {isDoctorOrAdmin && (!latestOpinion || !latestOpinion.isSigned) && (
              <form onSubmit={handleCreateOpinion} className="space-y-6 pt-2 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Emitir Novo Parecer Técnico
                </h3>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Impressão Diagnóstica *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={diagnosticImpression}
                    onChange={(e) => setDiagnosticImpression(e.target.value)}
                    placeholder="Ex: Carcinoma ductal invasivo, grau histológico II..."
                    className="w-full min-h-[160px] p-4 leading-relaxed rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Descrição Microscópica
                  </label>
                  <textarea
                    rows={4}
                    value={microscopicDescription}
                    onChange={(e) => setMicroscopicDescription(e.target.value)}
                    placeholder="Detalhes histológicos, mitoses, estroma..."
                    className="w-full min-h-[160px] p-4 leading-relaxed rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Observações Complementares
                  </label>
                  <textarea
                    rows={3}
                    value={additionalComments}
                    onChange={(e) => setAdditionalComments(e.target.value)}
                    placeholder="Recomendações adicionais ou observações gerais..."
                    className="w-full min-h-[120px] p-4 leading-relaxed rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-base"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <select
                    value={priorityLevel}
                    onChange={(e) => setPriorityLevel(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
                  >
                    <option value="Normal">Prioridade: Normal</option>
                    <option value="Urgente">Prioridade: Urgente</option>
                    <option value="Critica">Prioridade: Crítica</option>
                  </select>

                  <button
                    type="submit"
                    disabled={submittingOpinion}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                  >
                    {submittingOpinion ? 'Registrando...' : 'Registrar Parecer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
