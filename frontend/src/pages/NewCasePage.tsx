import React, { useState } from 'react';
import { api } from '../services/api';
import { ArrowLeft, Microscope, UploadCloud, ShieldCheck } from 'lucide-react';

interface NewCasePageProps {
  onNavigate: (page: string, caseId?: string) => void;
}

export const NewCasePage: React.FC<NewCasePageProps> = ({ onNavigate }) => {
  const [organSite, setOrganSite] = useState('Pele');
  const [stainingType, setStainingType] = useState('HE');
  const [clinicalSummary, setClinicalSummary] = useState('');
  const [patientBiologicalSex, setPatientBiologicalSex] = useState('F');
  const [patientAgeAtBiopsy, setPatientAgeAtBiopsy] = useState<number | ''>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      setUploadProgress('Cadastrando metadados anonimizados...');
      const newCase = await api.createCase({
        organSite,
        stainingType,
        clinicalSummary,
        patientBiologicalSex,
        patientAgeAtBiopsy: patientAgeAtBiopsy === '' ? undefined : Number(patientAgeAtBiopsy),
      });

      if (selectedFile) {
        setUploadProgress(`Enviando arquivo WSI (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)...`);
        await api.uploadSlide(newCase.caseId, selectedFile);
      }

      onNavigate('case-detail', newCase.caseId);
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar caso ou enviar lâmina.');
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate('dashboard')}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">Cadastrar Nova Biópsia (Mini-PACS)</h1>
          <p className="text-sm text-slate-400 mt-0.5">Preencha a anamnese anonimizada e anexe o arquivo de lâmina gigapixel.</p>
        </div>
      </div>

      {/* LGPD Banner */}
      <div className="flex items-start gap-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-xs text-cyan-300">
        <ShieldCheck className="h-5 w-5 shrink-0 text-cyan-400 mt-0.5" />
        <div>
          <strong className="block text-cyan-200 font-bold">Garantia de Anonimização LGPD:</strong>
          Nunca insira CPF, nome completo ou contato direto do paciente. O sistema gera automaticamente um código único pseudonimizado (ex: DP-2026-0003).
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs font-semibold text-rose-300">
          ⚠️ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
              Órgão / Sítio Anatômico *
            </label>
            <select
              value={organSite}
              onChange={(e) => setOrganSite(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 text-sm text-white outline-none focus:border-cyan-500/60"
            >
              <option value="Pele">Pele</option>
              <option value="Mama">Mama</option>
              <option value="Próstata">Próstata</option>
              <option value="Pulmão">Pulmão</option>
              <option value="Intestino">Intestino</option>
              <option value="Tiróide">Tiróide</option>
              <option value="Rim">Rim</option>
              <option value="Fígado">Fígado</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
              Tipo de Coloração Histológica *
            </label>
            <select
              value={stainingType}
              onChange={(e) => setStainingType(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 text-sm text-white outline-none focus:border-cyan-500/60"
            >
              <option value="HE">Hematoxilina-Eosina (HE)</option>
              <option value="Imuno-histoquímica">Imuno-histoquímica (IHQ)</option>
              <option value="Grocott">Grocott (Fungos)</option>
              <option value="PAS">PAS (Polissacarídeos)</option>
              <option value="Ziehl-Neelsen">Ziehl-Neelsen (BAAR)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
              Sexo Biológico (Opcional)
            </label>
            <select
              value={patientBiologicalSex}
              onChange={(e) => setPatientBiologicalSex(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 text-sm text-white outline-none focus:border-cyan-500/60"
            >
              <option value="F">Feminino</option>
              <option value="M">Masculino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
              Idade à Biópsia (Anos)
            </label>
            <input
              type="number"
              min="0"
              max="130"
              value={patientAgeAtBiopsy}
              onChange={(e) => setPatientAgeAtBiopsy(e.target.value ? Number(e.target.value) : '')}
              placeholder="Ex: 45"
              className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">
            Resumo Clínico / Anamnese Anonimizada *
          </label>
          <textarea
            required
            rows={5}
            value={clinicalSummary}
            onChange={(e) => setClinicalSummary(e.target.value)}
            placeholder="Descreva a história clínica, suspeita diagnóstica e achados macroscópicos..."
            className="w-full min-h-[140px] p-4 text-sm text-white leading-relaxed rounded-xl border border-slate-800 bg-slate-950/80 placeholder-slate-500 outline-none focus:border-cyan-500/60"
          />
        </div>

        {/* WSI File Upload */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-400">
            Arquivo de Lâmina WSI Gigapixel (.svs, .tif, .ndpi, .mrxs)
          </label>
          
          <label className="grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/40 p-8 text-center transition-colors hover:border-cyan-500/50">
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <UploadCloud className="h-8 w-8 text-cyan-400 mb-2" />
            {selectedFile ? (
              <div>
                <p className="text-sm font-bold text-cyan-400">{selectedFile.name}</p>
                <p className="text-xs text-slate-400 mt-1">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-slate-200">Clique para selecionar ou arraste o arquivo WSI</p>
                <p className="text-xs text-slate-500 mt-1">Formatos suportados: .svs, .tiff, .ndpi, .mrxs, .jpg, .png</p>
              </div>
            )}
          </label>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="h-11 rounded-xl border border-slate-800 bg-slate-900 px-5 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 text-xs font-bold text-slate-950 transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <span>{uploadProgress || 'Salvando...'}</span>
            ) : (
              <>
                <Microscope className="h-4 w-4" />
                <span>Concluir Cadastro</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
