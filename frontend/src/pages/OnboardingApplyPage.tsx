import React, { useState } from 'react';
import { api } from '../services/api';
import { Microscope, CheckCircle2, UploadCloud, ArrowRight } from 'lucide-react';

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
  const [requestedStoragePolicy] = useState('PrivateTemporary');
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
        <div className="w-20 h-20 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-3xl shadow-xl shadow-emerald-500/10">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Solicitação Enviada com Sucesso!</h1>
        <p className="text-slate-300 leading-relaxed text-sm">
          Sua solicitação de acesso aos equipamentos do laboratório foi recebida com sucesso.
          Nossa equipe analisará a documentação de aprovação CEP/CEUA e enviará o parecer para <strong className="text-cyan-400">{email}</strong>.
        </p>
        <div className="pt-4">
          <button
            onClick={() => onNavigate('login')}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-8 text-sm font-bold text-slate-950 hover:opacity-90 shadow-lg shadow-cyan-500/20"
          >
            Voltar para a Tela de Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="glass-card rounded-2xl p-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 mb-2">
              <Microscope className="h-3.5 w-3.5" /> Formulário Oficial de Parceiros de Pesquisa
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">
              Onboarding & Digitalização de Lâminas
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Solicite reserva do <strong className="text-cyan-400">Scanner 3DHISTECH</strong> e do <strong className="text-indigo-400">Real Time 7500 PCR</strong>.
            </p>
          </div>
          <div>
            <button
              onClick={() => onNavigate('login')}
              className="h-10 rounded-xl border border-slate-800 bg-slate-900 px-4 text-xs font-bold text-slate-300 hover:text-white transition-colors whitespace-nowrap"
            >
              Já possui conta? Entrar →
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1 */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 font-mono text-sm font-bold text-cyan-400">
              01
            </span>
            <div>
              <h2 className="text-base font-bold text-white">Identificação Cadastral</h2>
              <p className="text-xs text-slate-400">Dados do pesquisador responsável</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">Nome Completo *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Ex: Dra. Ana Paula Vasconcelos"
                className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">E-mail Institucional *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ana.vasconcelos@universidade.edu.br"
                className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">Telefone com DDD *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="(11) 98765-4321"
                className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">Instituição / Departamento *</label>
              <input
                type="text"
                required
                value={institutionAndDepartment}
                onChange={e => setInstitutionAndDepartment(e.target.value)}
                placeholder="Ex: USP - Faculdade de Medicina / Patologia"
                className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
              />
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 font-mono text-sm font-bold text-cyan-400">
              02
            </span>
            <div>
              <h2 className="text-base font-bold text-white">Perfil & Modalidade do Projeto</h2>
              <p className="text-xs text-slate-400">Vínculo de pesquisa e projeto</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">Modalidade de Vínculo *</label>
              <select
                value={modality}
                onChange={e => setModality(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 text-sm text-white outline-none focus:border-cyan-500/60"
              >
                <option value="IniciacaoCientifica">🎓 Iniciação Científica (Digipath)</option>
                <option value="Mestrado">🎓 Mestrado (Digipath)</option>
                <option value="Doutorado">🎓 Doutorado (Digipath)</option>
                <option value="PosDoc">🔬 Pós-Doutorado (Digipath)</option>
                <option value="ParceiroClinico">🏥 Parceiro Clínico / Hospitalar (dataPATH)</option>
                <option value="Outro">🌐 Outro Parceiro Institucional</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-400 mb-1.5">Título do Projeto *</label>
              <input
                type="text"
                required
                value={researchTitle}
                onChange={e => setResearchTitle(e.target.value)}
                placeholder="Ex: Análise histopatológica de carcinoma mamário"
                className="h-11 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500/60"
              />
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 font-mono text-sm font-bold text-cyan-400">
              03
            </span>
            <div>
              <h2 className="text-base font-bold text-white">Documentação Ética (CEP / CEUA)</h2>
              <p className="text-xs text-slate-400">Upload de aprovação ética em PDF</p>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-4 rounded-xl border border-slate-800 bg-slate-950/60">
            <input
              type="checkbox"
              checked={hasEthicsApproval}
              onChange={e => setHasEthicsApproval(e.target.checked)}
              className="h-4 w-4 rounded accent-cyan"
            />
            <span className="text-xs font-semibold text-slate-200">
              O projeto possui aprovação formal do Comitê de Ética em Pesquisa (CEP / CEUA)
            </span>
          </label>

          {hasEthicsApproval && (
            <div className="space-y-3">
              <label className="grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-slate-800 bg-slate-950/40 p-8 text-center transition-colors hover:border-cyan-500/50">
                <input type="file" accept=".pdf" multiple onChange={handleFileChange} className="hidden" />
                <UploadCloud className="h-8 w-8 text-cyan-400 mb-2" />
                <p className="text-sm font-bold text-slate-200">Clique para anexar o Parecer CEP/CEUA em PDF</p>
                <p className="text-xs text-slate-500 mt-1">Máximo de 5 arquivos PDF</p>
              </label>

              {ethicsFiles.length > 0 && (
                <div className="space-y-2">
                  {ethicsFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <span className="text-slate-200 font-mono font-semibold truncate">{file.name}</span>
                      <button type="button" onClick={() => removeFile(idx)} className="text-rose-400 font-bold px-2">
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 4 */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <span className="grid h-8 w-8 place-items-center rounded-xl border border-cyan-500/40 bg-cyan-500/10 font-mono text-sm font-bold text-cyan-400">
              04
            </span>
            <div>
              <h2 className="text-base font-bold text-white">Equipamentos Solicitados & Privacidade</h2>
              <p className="text-xs text-slate-400">Seleção de aparelhos e retenção de dados</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
              requestScanner3DHistech ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-slate-800 bg-slate-950/60'
            }`}>
              <input
                type="checkbox"
                checked={requestScanner3DHistech}
                onChange={e => setRequestScanner3DHistech(e.target.checked)}
                className="mt-1 h-4 w-4 rounded accent-cyan"
              />
              <div>
                <span className="text-sm font-bold text-white block">🔬 Scanner 3DHISTECH</span>
                <span className="text-xs text-slate-400 mt-1 block">Digitalização gigapixel 20x/40x de lâminas histológicas</span>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
              requestPcrRealTime7500 ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-slate-800 bg-slate-950/60'
            }`}>
              <input
                type="checkbox"
                checked={requestPcrRealTime7500}
                onChange={e => setRequestPcrRealTime7500(e.target.checked)}
                className="mt-1 h-4 w-4 rounded accent-cyan"
              />
              <div>
                <span className="text-sm font-bold text-white block">🧬 Real Time 7500 PCR</span>
                <span className="text-xs text-slate-400 mt-1 block">Termociclador para quantificação molecular</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-8 text-sm font-bold text-slate-950 hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {submitting ? 'Submetendo...' : 'Enviar Solicitação de Onboarding'} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
