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
    return <div className="py-12 text-center text-sm text-slate-400">Carregando lâmina e detalhes do caso...</div>;
  }

  if (!caseData) {
    return <div className="py-12 text-center text-sm text-rose-400">Caso clínico não encontrado.</div>;
  }

  const isDoctorOrAdmin = user?.role === 'SpecialistDoctor' || user?.role === 'Admin';

  return (
    <div className="space-y-6">
      {/* Top Bar Header */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white transition-colors"
            title="Voltar ao Painel"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate font-mono text-xl font-extrabold text-white sm:text-2xl">
              {caseData.internalCaseCode}
            </h1>
            <p className="truncate text-xs text-slate-400 mt-0.5">
              {caseData.organSite} • Coloração {caseData.stainingType} • Criado em{' '}
              {new Date(caseData.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <StatusBadge status={caseData.status} />

          <a
            href={api.getReportUrl(caseData.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all"
          >
            <Download className="h-3.5 w-3.5" /> Laudo PDF
          </a>

          {isDoctorOrAdmin && (
            <button
              onClick={() => setDrawerOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 text-xs font-bold text-slate-950 hover:opacity-90 shadow-md shadow-cyan-500/20 transition-all"
            >
              <FileCheck className="h-4 w-4" /> Emitir Parecer
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-[32%_1fr]">
        <aside className="space-y-4">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold tracking-wide text-slate-400 uppercase">Metadados Clínicos (LGPD)</h2>
            <dl className="space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <dt className="text-slate-400">Código do Caso</dt>
                <dd className="font-mono font-bold text-cyan-400">{caseData.internalCaseCode}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <dt className="text-slate-400">Órgão / Tecido</dt>
                <dd className="font-medium text-slate-200">{caseData.organSite}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <dt className="text-slate-400">Coloração Histológica</dt>
                <dd className="font-medium text-slate-200">{caseData.stainingType}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <dt className="text-slate-400">Sexo Biológico</dt>
                <dd className="font-medium text-slate-200">{caseData.patientBiologicalSex || 'Não informado'}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-2">
                <dt className="text-slate-400">Idade à Biópsia</dt>
                <dd className="font-medium text-slate-200">
                  {caseData.patientAgeAtBiopsy ? `${caseData.patientAgeAtBiopsy} anos` : 'Não informada'}
                </dd>
              </div>
              <div className="flex justify-between pb-1">
                <dt className="text-slate-400">Cadastrado por</dt>
                <dd className="font-medium text-slate-200">{caseData.createdByUserName}</dd>
              </div>
            </dl>
          </div>

          <div className="glass-card rounded-2xl p-6 space-y-3">
            <h2 className="text-xs font-bold tracking-wide text-slate-400 uppercase">Resumo Clínico / Anamnese</h2>
            <p className="text-xs leading-relaxed text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              {caseData.clinicalSummary}
            </p>
          </div>

          {/* Opinions History */}
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <h2 className="text-xs font-bold tracking-wide text-slate-400 uppercase">Pareceres Médicos ({caseData.opinions.length})</h2>
            {caseData.opinions.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Nenhum parecer técnico emitido até o momento.</p>
            ) : (
              <div className="space-y-3">
                {caseData.opinions.map((op) => (
                  <div key={op.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-cyan-400">Dr. {op.issuedByUserName}</span>
                      <span className="text-slate-500">{new Date(op.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <p className="text-xs text-slate-200 font-semibold">{op.diagnosticImpression}</p>
                    {op.isSigned && (
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
                        <CheckCircle2 className="h-3 w-3" /> Assinado Digitalmente
                      </div>
                    )}
                    {!op.isSigned && isDoctorOrAdmin && (
                      <button
                        onClick={() => handleSignOpinion(op.id)}
                        className="mt-2 w-full py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/30"
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
        <section className="glass-card overflow-hidden rounded-2xl space-y-0 flex flex-col">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-4 bg-slate-950/60">
            <div className="flex flex-wrap items-center gap-1">
              {tools.map((t) => (
                <button
                  key={t.label}
                  onClick={() => setTool(t.label)}
                  title={t.label}
                  className={`grid h-9 w-9 place-items-center rounded-lg border transition-colors ${
                    tool === t.label
                      ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400'
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <t.icon className="h-4 w-4" />
                </button>
              ))}
              <span className="ml-2 text-xs text-slate-400 hidden sm:inline">{tool}</span>
            </div>

            <div className="flex items-center gap-1">
              {[10, 20, 40].map((z) => (
                <button
                  key={z}
                  onClick={() => setZoom(z)}
                  className={`h-9 rounded-lg border px-3 text-xs font-bold transition-all ${
                    zoom === z
                      ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-400'
                      : 'border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {z}x
                </button>
              ))}
              <button
                onClick={() => setZoom((z) => Math.max(5, z - 5))}
                className="grid h-9 w-9 place-items-center rounded-lg border border-slate-800 text-slate-400 hover:text-white"
                title="Reduzir zoom"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(60, z + 5))}
                className="grid h-9 w-9 place-items-center rounded-lg border border-slate-800 text-slate-400 hover:text-white"
                title="Aumentar zoom"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCompare((v) => !v)}
                className={`grid h-9 w-9 place-items-center rounded-lg border ${
                  compare
                    ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-400'
                    : 'border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Comparar colorações side-by-side"
              >
                <SplitSquareHorizontal className="h-4 w-4" />
              </button>
              <button
                onClick={() => document.documentElement.requestFullscreen?.()}
                className="grid h-9 w-9 place-items-center rounded-lg border border-slate-800 text-slate-400 hover:text-white"
                title="Tela cheia"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* WSI Area */}
          <div className="relative flex-1 bg-slate-950 p-6 flex flex-col justify-center items-center min-h-[500px]">
            <div className={`w-full grid gap-4 ${compare ? 'md:grid-cols-2' : ''}`}>
              <figure className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-2">
                <div className="aspect-[4/3] overflow-hidden rounded-lg">
                  <SlideThumb
                    stain={caseData.stainingType || 'HE'}
                    seed={caseData.id}
                    cells={90}
                    className="h-full w-full object-cover transition-transform duration-500"
                  />
                </div>
                <figcaption className="absolute bottom-4 left-4 rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1 font-mono text-[11px] text-slate-300 backdrop-blur">
                  {caseData.stainingType} • {zoom}x zoom • Campo de Visão
                </figcaption>
                <span className="pointer-events-none absolute inset-8 rounded-lg border-2 border-dashed border-cyan-500/60" />
              </figure>

              {compare && (
                <figure className="relative overflow-hidden rounded-xl border border-indigo-500/40 bg-slate-900/60 p-2">
                  <div className="aspect-[4/3] overflow-hidden rounded-lg">
                    <SlideThumb stain="HE" seed={`${caseData.id}-he`} cells={90} className="h-full w-full object-cover" />
                  </div>
                  <figcaption className="absolute bottom-4 left-4 rounded-lg border border-slate-800 bg-slate-950/80 px-2.5 py-1 font-mono text-[11px] text-indigo-300 backdrop-blur">
                    HE (Referência Comparativa) • {zoom}x
                  </figcaption>
                </figure>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 w-full text-xs text-slate-400">
              <div className="flex gap-2">
                <span className="rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 font-mono text-[11px]">
                  Escala: 1 px ≈ 0,25 µm
                </span>
                <span className="rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 font-mono text-[11px]">
                  Região Selecionada: 1.240 × 880 µm
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400 font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" /> Acesso auditado e registrado no banco (LGPD)
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
          <div className="glass-card h-full w-full max-w-lg overflow-y-auto rounded-none p-6 sm:rounded-l-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-extrabold text-white">Emitir Parecer Técnico / 2ª Opinião</h2>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-xs font-semibold text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
              >
                Fechar ✕
              </button>
            </div>

            <form onSubmit={handleCreateOpinion} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">
                  Impressão Diagnóstica *
                </label>
                <textarea
                  required
                  rows={4}
                  value={diagnosticImpression}
                  onChange={(e) => setDiagnosticImpression(e.target.value)}
                  placeholder="Material histológico evidenciando..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">
                  Descrição Microscópica
                </label>
                <textarea
                  rows={4}
                  value={microscopicDescription}
                  onChange={(e) => setMicroscopicDescription(e.target.value)}
                  placeholder="Achados citoarquiteturais, estroma, mitoses..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold uppercase mb-1">
                  Observações Adicionais
                </label>
                <textarea
                  rows={2}
                  value={additionalComments}
                  onChange={(e) => setAdditionalComments(e.target.value)}
                  placeholder="Recomendações técnicas..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold uppercase mb-1">Prioridade</label>
                  <select
                    value={priorityLevel}
                    onChange={(e) => setPriorityLevel(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-800 bg-slate-950 px-3 text-slate-300 outline-none"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgente">Urgente</option>
                    <option value="Critica">Crítica</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 space-y-1">
                <p className="text-xs font-bold text-emerald-400">Carimbo Digital do Patologista</p>
                <p className="text-[11px] text-slate-400">
                  {user?.fullName} • {user?.email}
                </p>
              </div>

              <button
                type="submit"
                disabled={submittingOpinion}
                className="h-11 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-sm font-bold text-slate-950 hover:opacity-90 disabled:opacity-50 transition-opacity"
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
