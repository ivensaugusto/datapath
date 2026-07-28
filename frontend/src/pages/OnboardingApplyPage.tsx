import React, { useState } from 'react';
import { api } from '../services/api';

interface OnboardingApplyPageProps {
  onNavigate: (page: string) => void;
}

export const OnboardingApplyPage: React.FC<OnboardingApplyPageProps> = ({ onNavigate }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [institutionAndDepartment, setInstitutionAndDepartment] = useState('');
  const [modality, setModality] = useState('IniciacaoCientifica');
  const [researchTitle, setResearchTitle] = useState('');
  const [hasEthicsApproval, setHasEthicsApproval] = useState(true);
  const [requestScanner3DHistech, setRequestScanner3DHistech] = useState(true);
  const [requestPcrRealTime7500, setRequestPcrRealTime7500] = useState(false);
  const [requestedStoragePolicy, setRequestedStoragePolicy] = useState('PrivateTemporary');
  const [ethicsFiles, setEthicsFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
      if (selected.length + ethicsFiles.length > 5) {
        alert('Você só pode anexar no máximo 5 arquivos PDF de comprovação ética.');
        return;
      }
      setEthicsFiles(prev => [...prev, ...selected]);
    }
  };

  const removeFile = (index: number) => {
    setEthicsFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('institutionAndDepartment', institutionAndDepartment);
      formData.append('modality', modality);
      formData.append('researchTitle', researchTitle);
      formData.append('hasEthicsApproval', String(hasEthicsApproval));
      formData.append('requestScanner3DHistech', String(requestScanner3DHistech));
      formData.append('requestPcrRealTime7500', String(requestPcrRealTime7500));
      formData.append('requestedStoragePolicy', requestedStoragePolicy);

      ethicsFiles.forEach(file => {
        formData.append('ethicsFiles', file);
      });

      await api.submitOnboarding(formData);
      setSubmittedSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Erro ao submeter solicitação de onboarding.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto text-3xl shadow-xl shadow-blue-500/10">
          ✓
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Solicitação de Onboarding Enviada!</h1>
        <p className="text-slate-300 leading-relaxed text-base">
          Sua solicitação de acesso aos equipamentos do laboratório foi recebida com sucesso.
          Nossa equipe analisará a documentação de aprovação CEP/CEUA e enviará o parecer de liberação para <strong className="text-blue-400">{email}</strong>.
        </p>
        <div className="pt-4">
          <button
            onClick={() => onNavigate('login')}
            className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30"
          >
            Voltar para a Tela de Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-slate-900/40 p-8 rounded-2xl border border-blue-500/20 backdrop-blur-xl shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
              <span>🔬 Formulário Oficial de Parceiros</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Onboarding & Digitalização de Lâminas
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Solicite acesso ao <strong className="text-blue-400">Scanner 3DHISTECH</strong> e serviços de Patologia Digital Mini-PACS.
            </p>
          </div>
          <div>
            <button
              onClick={() => onNavigate('login')}
              className="px-5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-bold transition-all whitespace-nowrap shadow-md"
            >
              Já possui conta? Entrar →
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SEÇÃO 1: Identificação Cadastral */}
        <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800/90 backdrop-blur-xl space-y-6 hover:border-slate-700/80 transition-all">
          <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-mono font-bold text-sm">
              01
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Identificação Cadastral</h2>
              <p className="text-xs text-slate-400">Dados do pesquisador ou responsável técnico</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Ex: Dra. Ana Paula Vasconcelos"
                className="w-full h-11 px-4 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                E-mail Institucional / Principal *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ana.vasconcelos@universidade.edu.br"
                className="w-full h-11 px-4 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Telefone / WhatsApp com DDD *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full h-11 px-4 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Instituição & Departamento *
              </label>
              <input
                type="text"
                required
                value={institutionAndDepartment}
                onChange={e => setInstitutionAndDepartment(e.target.value)}
                placeholder="Ex: USP - Faculdade de Medicina / Patologia"
                className="w-full h-11 px-4 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: Perfil & Modalidade */}
        <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800/90 backdrop-blur-xl space-y-6 hover:border-slate-700/80 transition-all">
          <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-mono font-bold text-sm">
              02
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Perfil & Modalidade do Projeto</h2>
              <p className="text-xs text-slate-400">Vínculo de pesquisa e finalidade do uso</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Modalidade de Vínculo *
              </label>
              <select
                value={modality}
                onChange={e => setModality(e.target.value)}
                className="w-full h-11 px-4 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              >
                <option value="IniciacaoCientifica">🎓 Iniciação Científica (Digipath)</option>
                <option value="Mestrado">🎓 Mestrado (Digipath)</option>
                <option value="Doutorado">🎓 Doutorado (Digipath)</option>
                <option value="PosDoc">🔬 Pós-Doutorado (Digipath)</option>
                <option value="ParceiroClinico">🏥 Parceiro Clínico / Hospitalar (dataPATH)</option>
                <option value="Outro">🌐 Outro Parceiro Institucional</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Título do Projeto ou Finalidade *
              </label>
              <input
                type="text"
                required
                value={researchTitle}
                onChange={e => setResearchTitle(e.target.value)}
                placeholder="Ex: Análise histopatológica de carcinoma mamário"
                className="w-full h-11 px-4 text-sm bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 3: Aprovação Ética CEP/CEUA */}
        <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800/90 backdrop-blur-xl space-y-6 hover:border-slate-700/80 transition-all">
          <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-mono font-bold text-sm">
              03
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Documentação Ética (CEP / CEUA)</h2>
              <p className="text-xs text-slate-400">Anexo obrigatório de comprovação comitê de ética</p>
            </div>
          </div>

          <label className="flex items-center space-x-3 cursor-pointer p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all">
            <input
              type="checkbox"
              checked={hasEthicsApproval}
              onChange={e => setHasEthicsApproval(e.target.checked)}
              className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-semibold text-slate-200">
              O projeto possui aprovação formal do Comitê de Ética em Pesquisa (CEP / CEUA)
            </span>
          </label>

          {hasEthicsApproval && (
            <div className="space-y-3 pt-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Parecer de Aprovação Ética (PDF)
              </label>

              <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-6 text-center bg-slate-950/40 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer space-y-2 block">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto text-xl">
                    📄
                  </div>
                  <span className="text-sm font-semibold text-blue-400 block">Clique para anexar os arquivos PDF de aprovação</span>
                  <span className="text-xs text-slate-500 block">Máximo de 5 arquivos (até 10MB por arquivo)</span>
                </label>
              </div>

              {ethicsFiles.length > 0 && (
                <div className="space-y-2 pt-2">
                  {ethicsFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <span className="text-slate-200 font-mono font-semibold truncate">{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-slate-400 hover:text-rose-400 font-bold px-2 transition-colors"
                      >
                        ✕ Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* SEÇÃO 4: Equipamentos & Política de Armazenamento */}
        <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800/90 backdrop-blur-xl space-y-6 hover:border-slate-700/80 transition-all">
          <div className="flex items-center space-x-3 border-b border-slate-800/80 pb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-mono font-bold text-sm">
              04
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Equipamentos & Política de Privacidade</h2>
              <p className="text-xs text-slate-400">Escolha de aparelhos e retenção de arquivos</p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Equipamentos Solicitados no Laboratório:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                className={`flex items-start space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                  requestScanner3DHistech
                    ? 'bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={requestScanner3DHistech}
                  onChange={e => setRequestScanner3DHistech(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-bold text-white block">🔬 Scanner 3DHISTECH</span>
                  <span className="text-xs text-slate-400">Digitalização WSI de lâminas histológicas em altíssima resolução</span>
                </div>
              </label>

              <label
                className={`flex items-start space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                  requestPcrRealTime7500
                    ? 'bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={requestPcrRealTime7500}
                  onChange={e => setRequestPcrRealTime7500(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-bold text-white block">🧬 Real Time 7500 PCR</span>
                  <span className="text-xs text-slate-400">Termociclador para análise de quantificação molecular</span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Política de Armazenamento e Privacidade Desejada:
            </label>
            <div className="space-y-3">
              <label
                className={`flex items-start space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                  requestedStoragePolicy === 'PrivateTemporary'
                    ? 'bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="storagePolicy"
                  value="PrivateTemporary"
                  checked={requestedStoragePolicy === 'PrivateTemporary'}
                  onChange={e => setRequestedStoragePolicy(e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-bold text-white block">🔒 Privada Temporária (Expurgo Automático em 30 Dias)</span>
                  <span className="text-xs text-slate-400">Privacidade total/segredo industrial. O arquivo é excluído fisicamente após a emissão do laudo.</span>
                </div>
              </label>

              <label
                className={`flex items-start space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                  requestedStoragePolicy === 'PrivatePersistent'
                    ? 'bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="storagePolicy"
                  value="PrivatePersistent"
                  checked={requestedStoragePolicy === 'PrivatePersistent'}
                  onChange={e => setRequestedStoragePolicy(e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-bold text-white block">📁 Privada Persistente (Guarda Longa no Acervo)</span>
                  <span className="text-xs text-slate-400">Mantido no acervo privado da sua instituição durante a vigência do projeto.</span>
                </div>
              </label>

              <label
                className={`flex items-start space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                  requestedStoragePolicy === 'PublicRepository'
                    ? 'bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="storagePolicy"
                  value="PublicRepository"
                  checked={requestedStoragePolicy === 'PublicRepository'}
                  onChange={e => setRequestedStoragePolicy(e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-bold text-white block">🌐 Repositório Público (Open Science / Ensino)</span>
                  <span className="text-xs text-slate-400">Acervo anonimizado compartilhado abertamente com a comunidade científica.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <span>Submetendo Solicitação...</span>
            ) : (
              <>
                <span>Enviar Solicitação de Onboarding</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
