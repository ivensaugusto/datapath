import React, { useState } from 'react';
import { api } from '../services/api';

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
      // 1. Cadastrar Caso Clínico
      setUploadProgress('Cadastrando metadados anonimizados...');
      const newCase = await api.createCase({
        organSite,
        stainingType,
        clinicalSummary,
        patientBiologicalSex,
        patientAgeAtBiopsy: patientAgeAtBiopsy === '' ? undefined : Number(patientAgeAtBiopsy),
      });

      // 2. Upload da Lâmina WSI (se selecionada)
      if (selectedFile) {
        setUploadProgress(`Enviando arquivo WSI (${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB)...`);
        await api.uploadSlide(newCase.caseId, selectedFile);
      }

      // Redirecionar para os detalhes do caso recém-criado
      onNavigate('case-detail', newCase.caseId);
    } catch (err: any) {
      setError(err.message || 'Erro ao cadastrar caso ou enviar lâmina.');
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
        <button
          onClick={() => onNavigate('dashboard')}
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-black text-white">Cadastrar Nova Biópsia (Mini-PACS)</h1>
          <p className="text-sm text-slate-400">Preencha os metadados clínicos anonimizados e anexe a lâmina WSI.</p>
        </div>
      </div>

      {/* Notice LGPD */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-start space-x-3">
        <span className="text-lg">🔒</span>
        <div>
          <strong className="block text-blue-200">Garantia de Anonimização LGPD:</strong>
          Nunca insira CPF, nome completo ou endereço do paciente. O sistema gera automaticamente um código único pseudonimizado (ex: DP-2026-0003).
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Organ Site */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Órgão / Sítio Anatômico *
            </label>
            <select
              value={organSite}
              onChange={(e) => setOrganSite(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
            >
              <option value="Pele">Pele</option>
              <option value="Mama">Mama</option>
              <option value="Próstata">Próstata</option>
              <option value="Pulmão">Pulmão</option>
              <option value="Intestino">Intestino</option>
              <option value="Tireoide">Tireoide</option>
              <option value="Rim">Rim</option>
              <option value="Fígado">Fígado</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          {/* Staining Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Tipo de Coloração *
            </label>
            <select
              value={stainingType}
              onChange={(e) => setStainingType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
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
          {/* Biological Sex */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Sexo Biológico (Opcional)
            </label>
            <select
              value={patientBiologicalSex}
              onChange={(e) => setPatientBiologicalSex(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
            >
              <option value="F">Feminino</option>
              <option value="M">Masculino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Idade à Biópsia (Anos)
            </label>
            <input
              type="number"
              min="0"
              max="130"
              value={patientAgeAtBiopsy}
              onChange={(e) => setPatientAgeAtBiopsy(e.target.value ? Number(e.target.value) : '')}
              placeholder="Ex: 45"
              className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
            />
          </div>
        </div>

        {/* Clinical Summary */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
            Resumo Clínico / Anamnese Anonimizada *
          </label>
          <textarea
            required
            rows={4}
            value={clinicalSummary}
            onChange={(e) => setClinicalSummary(e.target.value)}
            placeholder="Descreva a história clínica, suspeita diagnóstica e achados macroscópicos..."
            className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
          />
        </div>

        {/* WSI Slide Upload Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Arquivo de Lâmina WSI (Aperio .svs, .tif, .ndpi ou amostra)
          </label>
          
          <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 text-center transition-all bg-slate-950/40">
            <input
              type="file"
              id="wsi-file"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <label htmlFor="wsi-file" className="cursor-pointer space-y-2 block">
              <div className="text-3xl">🖼️</div>
              {selectedFile ? (
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-blue-400">{selectedFile.name}</p>
                  <p className="text-xs text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-300">Clique para selecionar o arquivo de lâmina WSI</p>
                  <p className="text-xs text-slate-500">Formatos aceitos: .svs, .tiff, .ndpi, .jpg, .png</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-all"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all text-sm disabled:opacity-50 flex items-center space-x-2"
          >
            {loading ? (
              <span>{uploadProgress || 'Processando...'}</span>
            ) : (
              <>
                <span>Cadastrar e Concluir</span>
                <span>✓</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
