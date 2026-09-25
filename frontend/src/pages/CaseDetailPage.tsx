import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { BiopsyCaseDetail } from '../types/api';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { SlideThumb } from '../components/SlideThumb';
import {
  ArrowLeft,
  MousePointer2,
  PenLine,
  Ruler,
  Pin,
  Crosshair,
  ZoomIn,
  ZoomOut,
  SplitSquareHorizontal,
  Maximize2,
  ShieldCheck,
  FileCheck,
  Download,
  CheckCircle2,
} from 'lucide-react';

interface CaseDetailPageProps {
  caseId: string;
  onNavigate: (page: string) => void;
}

const tools = [
  { icon: MousePointer2, label: 'Selecionar' },
  { icon: PenLine, label: 'Desenhar região ROI' },
  { icon: Ruler, label: 'Medir (µm)' },
  { icon: Pin, label: 'Fixar nota' },
  { icon: Crosshair, label: 'Centralizar' },
];

export const CaseDetailPage: React.FC<CaseDetailPageProps> = ({ caseId, onNavigate }) => {
  const { user } = useAuth();
  const [caseData, setCaseData] = useState<BiopsyCaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(20);
  const [tool, setTool] = useState('Selecionar');
  const [compare, setCompare] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
      setDrawerOpen(false);
      await fetchCase();
    } catch (err: any) {
      alert(err.message || 'Erro ao registrar parecer.');
    } finally {
      setSubmittingOpinion(false);
    }
  };

  const handleSignOpinion = async (opinionId: string) => {
    if (!confirm('Deseja assinar digitalmente este parecer? O caso será concluído como Laudado.')) return;
    try {
      await api.signOpinion(opinionId);
      alert('Parecer assinado com sucesso!');
      await fetchCase();
    } catch (err: any) {
      alert(err.message || 'Erro ao assinar parecer.');
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-sm font-semibold text-slate-500">Carregando lâmina e detalhes do caso...</div>;
  }

  if (!caseData) {
    return <div className="py-12 text-center text-sm font-bold text-rose-600">Caso clínico não encontrado.</div>;
  }

  const isDoctorOrAdmin = user?.role === 'User' || user?.role === 'SpecialistDoctor' || user?.role === 'Admin';

  return (
    <div className="space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shadow-2xs"
            title="Voltar ao Painel"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1 className="truncate font-mono text-xl font-black text-slate-900 sm:text-2xl">
                {caseData.internalCaseCode}
              </h1>
              <StatusBadge status={caseData.status} />
            </div>
            <p className="truncate text-xs text-slate-500 mt-1">
              {caseData.organSite} • Coloração {caseData.stainingType} • Registrado em{' '}
              {new Date(caseData.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={api.getReportUrl(caseData.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-4 text-xs font-bold text-teal-800 hover:bg-teal-100 transition-all shadow-xs"
          >
            <Download className="h-3.5 w-3.5" /> Laudo em PDF
          </a>

          {isDoctorOrAdmin && (
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 px-4 text-xs font-bold text-white shadow-md shadow-sky-600/20 transition-all"
            >
              <FileCheck className="h-4 w-4" /> Emitir Parecer
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-[32%_1fr]">
        <aside className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold tracking-wide text-slate-500 uppercase">Metadados Clínicos (LGPD)</h2>
            <dl className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-500">Código Pseudonimizado</dt>
                <dd className="font-mono font-bold text-sky-700">{caseData.internalCaseCode}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-500">Órgão / Sítio</dt>
                <dd className="font-semibold text-slate-800">{caseData.organSite}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-500">Coloração</dt>
                <dd className="font-semibold text-slate-800">{caseData.stainingType}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-500">Sexo Biológico</dt>
                <dd className="font-semibold text-slate-800">{caseData.patientBiologicalSex || 'Não informado'}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-slate-500">Idade à Biópsia</dt>
                <dd className="font-semibold text-slate-800">
                  {caseData.patientAgeAtBiopsy ? `${caseData.patientAgeAtBiopsy} anos` : 'Não informada'}
                </dd>
              </div>
              <div className="flex justify-between pb-1">
                <dt className="text-slate-500">Cadastrado por</dt>
                <dd className="font-semibold text-slate-800">{caseData.createdByUserName}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-xs font-bold tracking-wide text-slate-500 uppercase">Resumo Clínico / Anamnese</h2>
            <p className="text-xs leading-relaxed text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {caseData.clinicalSummary}
            </p>
          </div>

          {/* Opinions History */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-xs font-bold tracking-wide text-slate-500 uppercase">Pareceres Médicos ({caseData.opinions.length})</h2>
            {caseData.opinions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Nenhum parecer técnico emitido até o momento.</p>
            ) : (
              <div className="space-y-3">
                {caseData.opinions.map((op) => (
                  <div key={op.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-sky-800">Dr. {op.issuedByUserName}</span>
                      <span className="text-slate-400">{new Date(op.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <p className="text-xs text-slate-800 font-semibold">{op.diagnosticImpression}</p>
                    {op.isSigned && (
                      <div className="flex items-center gap-1.5 text-[10px] text-teal-700 font-bold">
                        <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" /> Assinado Digitalmente
                      </div>
                    )}
                    {!op.isSigned && isDoctorOrAdmin && (
                      <button
                        onClick={() => handleSignOpinion(op.id)}
                        className="mt-2 w-full py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 shadow-xs transition-colors"
                      >
                        Assinar Parecer agora
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Right Column: WSI Viewer */}
        <section className="bg-white border border-slate-200 shadow-xs overflow-hidden rounded-3xl space-y-0 flex flex-col">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4 bg-slate-50">
            <div className="flex flex-wrap items-center gap-1">
              {tools.map((t) => (
                <button
                  key={t.label}
                  onClick={() => setTool(t.label)}
                  title={t.label}
                  className={`grid h-9 w-9 place-items-center rounded-xl border transition-all ${
                    tool === t.label
                      ? 'border-sky-300 bg-sky-100 text-sky-800 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <t.icon className="h-4 w-4" />
                </button>
              ))}
              <span className="ml-2 text-xs font-bold text-slate-500 hidden sm:inline">{tool}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {[10, 20, 40].map((z) => (
                <button
                  key={z}
                  onClick={() => setZoom(z)}
                  className={`h-9 rounded-xl border px-3 text-xs font-bold transition-all ${
                    zoom === z
                      ? 'border-sky-300 bg-sky-600 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {z}x
                </button>
              ))}
              <button
                onClick={() => setZoom((z) => Math.max(5, z - 5))}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                title="Reduzir zoom"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(60, z + 5))}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                title="Aumentar zoom"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCompare((v) => !v)}
                className={`grid h-9 w-9 place-items-center rounded-xl border ${
                  compare
                    ? 'border-teal-300 bg-teal-50 text-teal-800 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                }`}
                title="Comparar colorações side-by-side"
              >
                <SplitSquareHorizontal className="h-4 w-4" />
              </button>
              <button
                onClick={() => document.documentElement.requestFullscreen?.()}
                className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                title="Tela cheia"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* WSI Area */}
          <div className="relative flex-1 bg-slate-100 p-6 flex flex-col justify-center items-center min-h-[520px]">
            <div className={`w-full grid gap-4 ${compare ? 'md:grid-cols-2' : ''}`}>
              <figure className="relative overflow-hidden rounded-2xl border border-slate-300 bg-white p-2 shadow-sm">
                <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-200">
                  <SlideThumb
                    stain={caseData.stainingType || 'HE'}
                    seed={caseData.id}
                    cells={90}
                    className="h-full w-full object-cover transition-transform duration-500"
                  />
                </div>
                <figcaption className="absolute bottom-4 left-4 rounded-xl border border-slate-200 bg-white/95 px-3 py-1 font-mono text-[11px] font-bold text-slate-800 shadow-xs backdrop-blur">
                  {caseData.stainingType} • {zoom}x zoom • Campo Microscópico
                </figcaption>
                <span className="pointer-events-none absolute inset-8 rounded-xl border-2 border-dashed border-sky-600/70" />
              </figure>

              {compare && (
                <figure className="relative overflow-hidden rounded-2xl border border-teal-300 bg-white p-2 shadow-sm">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-slate-200">
                    <SlideThumb stain="HE" seed={`${caseData.id}-he`} cells={90} className="h-full w-full object-cover" />
                  </div>
                  <figcaption className="absolute bottom-4 left-4 rounded-xl border border-teal-200 bg-white/95 px-3 py-1 font-mono text-[11px] font-bold text-teal-800 shadow-xs backdrop-blur">
                    HE (Referência Comparativa) • {zoom}x
                  </figcaption>
                </figure>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 w-full text-xs text-slate-600">
              <div className="flex gap-2">
                <span className="rounded-xl border border-slate-200 bg-white px-3 py-1 font-mono text-[11px] font-semibold text-slate-700 shadow-2xs">
                  Escala: 1 px ≈ 0,25 µm
                </span>
                <span className="rounded-xl border border-slate-200 bg-white px-3 py-1 font-mono text-[11px] font-semibold text-slate-700 shadow-2xs">
                  Área ROI: 1.240 × 880 µm
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50 px-3 py-1 text-xs text-teal-800 font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" /> Acesso auditado (LGPD)
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white h-full w-full max-w-lg overflow-y-auto rounded-none p-6 sm:rounded-l-3xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900">Emitir Parecer Técnico / 2ª Opinião</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-slate-100"
              >
                ✕ Fechar
              </button>
            </div>

            <form onSubmit={handleCreateOpinion} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1.5">
                  Impressão Diagnóstica *
                </label>
                <textarea
                  required
                  rows={4}
                  value={diagnosticImpression}
                  onChange={(e) => setDiagnosticImpression(e.target.value)}
                  placeholder="Material histológico evidenciando..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1.5">
                  Descrição Microscópica
                </label>
                <textarea
                  rows={4}
                  value={microscopicDescription}
                  onChange={(e) => setMicroscopicDescription(e.target.value)}
                  placeholder="Achados citoarquiteturais, estroma, mitoses..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase mb-1.5">
                  Observações Adicionais
                </label>
                <textarea
                  rows={2}
                  value={additionalComments}
                  onChange={(e) => setAdditionalComments(e.target.value)}
                  placeholder="Recomendações técnicas ou correlação clínica..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1.5">Prioridade</label>
                  <select
                    value={priorityLevel}
                    onChange={(e) => setPriorityLevel(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-800 font-medium outline-none focus:border-sky-500"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgente">Urgente</option>
                    <option value="Critica">Crítica</option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-teal-200 bg-teal-50 p-4 space-y-1">
                <p className="text-xs font-bold text-teal-900">Carimbo Digital do Patologista</p>
                <p className="text-[11px] text-teal-700">
                  {user?.fullName} • {user?.email}
                </p>
              </div>

              <button
                type="submit"
                disabled={submittingOpinion}
                className="h-11 w-full rounded-xl bg-sky-600 hover:bg-sky-700 text-sm font-bold text-white shadow-md shadow-sky-600/20 disabled:opacity-50 transition-all"
              >
                {submittingOpinion ? 'Salvando Parecer...' : 'Salvar e Publicar Parecer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

