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
      <div className="max-w-3xl mx-auto py-16 px-6 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto text-3xl">
          ✓
        </div>
        <h1 className="text-3xl font-black text-white">Solicitação de Cadastro Enviada!</h1>
        <p className="text-slate-300 leading-relaxed text-base">
          Sua solicitação de acesso aos equipamentos do laboratório e cadastro no sistema foi recebida com sucesso.
          Nossa equipe técnica analisará a documentação do parecer CEP/CEUA e enviará as credenciais de acesso para o e-mail cadastrado (<strong className="text-blue-400">{email}</strong>).
        </p>
        <button
          onClick={() => onNavigate('login')}
          className="mt-4 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30"
        >
          Voltar para a Tela de Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Módulo de Onboarding & Captação de Parceiros</h1>
          <p className="text-sm text-slate-400 mt-1">
            Cadastre-se para solicitar digitalização de lâminas no Scanner 3DHISTECH ou uso da plataforma de Patologia Digital.
          </p>
        </div>
        <button
          onClick={() => onNavigate('login')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
        >
          Já possui conta? Entrar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SEÇÃO 1: Identificação */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-mono font-bold">1</span>
              <span>Identificação Cadastral</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                className="w-full h-12 py-3 px-4 text-base bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                className="w-full h-12 py-3 px-4 text-base bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                className="w-full h-12 py-3 px-4 text-base bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                className="w-full h-12 py-3 px-4 text-base bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: Perfil e Modalidade */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-mono font-bold">2</span>
              <span>Perfil & Modalidade da Solicitação</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Modalidade de Vínculo *
              </label>
              <select
                value={modality}
                onChange={e => setModality(e.target.value)}
                className="w-full h-12 py-3 px-4 text-base bg-slate-950/80 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                Título do Projeto ou Finalidade Clínica *
              </label>
              <input
                type="text"
                required
                value={researchTitle}
                onChange={e => setResearchTitle(e.target.value)}
                placeholder="Ex: Análise histopatológica de carcinoma mamário"
                className="w-full h-12 py-3 px-4 text-base bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 3: Documentação Ética (CEP/CEUA) */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-mono font-bold">3</span>
              <span>Aprovação Ética (CEP / CEUA)</span>
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-3 cursor-pointer text-sm text-slate-300">
              <input
                type="checkbox"
                checked={hasEthicsApproval}
                onChange={e => setHasEthicsApproval(e.target.checked)}
                className="w-5 h-5 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-blue-500"
              />
              <span>Projeto possui aprovação formal do Comitê de Ética em Pesquisa (CEP / CEUA)</span>
            </label>
          </div>

          {hasEthicsApproval && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Anexo do Parecer de Aprovação em PDF (Até 5 arquivos, máx 10 MB cada)
              </label>

              <div className="border-2 border-dashed border-slate-800 hover:border-blue-500/50 rounded-xl p-6 text-center bg-slate-950/60 transition-colors">
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer space-y-2 block">
                  <span className="text-2xl block">📄</span>
                  <span className="text-sm font-semibold text-blue-400 block">Clique para selecionar os PDFs de aprovação</span>
                  <span className="text-xs text-slate-500 block">Formato aceito: .pdf apenas</span>
                </label>
              </div>

              {ethicsFiles.length > 0 && (
                <div className="space-y-2 pt-2">
                  {ethicsFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs">
                      <span className="text-slate-200 font-mono font-semibold truncate">{file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="text-rose-400 hover:text-rose-300 font-bold px-2"
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

        {/* SEÇÃO 4: Equipamentos & Política de Storage */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <span className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-mono font-bold">4</span>
              <span>Equipamentos & Política de Armazenamento</span>
            </h2>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Equipamentos Solicitados no Laboratório:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex items-center space-x-3 p-4 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requestScanner3DHistech}
                  onChange={e => setRequestScanner3DHistech(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-bold text-white block">🔬 Scanner 3DHISTECH</span>
                  <span className="text-xs text-slate-400">Digitalização WSI de lâminas histológicas</span>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-4 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requestPcrRealTime7500}
                  onChange={e => setRequestPcrRealTime7500(e.target.checked)}
                  className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <span className="text-sm font-bold text-white block">🧬 Real Time 7500 PCR</span>
                  <span className="text-xs text-slate-400">Termociclador para análise molecular</span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Política de Armazenamento e Privacidade Desejada:
            </label>
            <div className="space-y-3">
              <label className="flex items-start space-x-3 p-4 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="radio"
                  name="storagePolicy"
                  value="PrivateTemporary"
                  checked={requestedStoragePolicy === 'PrivateTemporary'}
                  onChange={e => setRequestedStoragePolicy(e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600"
                />
                <div>
                  <span className="text-sm font-bold text-white block">🔒 Privada Temporária (Exclusão Automática em 30 Dias)</span>
                  <span className="text-xs text-slate-400">Privacidade total/segredo industrial. O arquivo é excluído fisicamente após o expurgo.</span>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-4 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="radio"
                  name="storagePolicy"
                  value="PrivatePersistent"
                  checked={requestedStoragePolicy === 'PrivatePersistent'}
                  onChange={e => setRequestedStoragePolicy(e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600"
                />
                <div>
                  <span className="text-sm font-bold text-white block">📁 Privada Persistente (Guarda Longa no QNAP NAS)</span>
                  <span className="text-xs text-slate-400">Mantido no acervo privado da sua instituição durante a vigência da pesquisa.</span>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-4 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <input
                  type="radio"
                  name="storagePolicy"
                  value="PublicRepository"
                  checked={requestedStoragePolicy === 'PublicRepository'}
                  onChange={e => setRequestedStoragePolicy(e.target.value)}
                  className="mt-1 w-4 h-4 text-blue-600"
                />
                <div>
                  <span className="text-sm font-bold text-white block">🌐 Repositório Público (Open Science / Ensino)</span>
                  <span className="text-xs text-slate-400">Acervo anonimizado compartilhado abertamente com a comunidade científica.</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base transition-all shadow-xl shadow-blue-600/30 disabled:opacity-50"
          >
            {submitting ? 'Submetendo Solicitação...' : '🚀 Enviar Solicitação de Onboarding'}
          </button>
        </div>
      </form>
    </div>
  );
};
