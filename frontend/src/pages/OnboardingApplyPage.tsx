import React, { useState } from 'react';
import { api } from '../services/api';
import { Microscope, CheckCircle2, UploadCloud, ArrowRight, ArrowLeft, ShieldCheck, Home, FileText } from 'lucide-react';

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
        <div className="w-20 h-20 rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Solicitação Enviada com Sucesso!</h1>
        <p className="text-slate-600 leading-relaxed text-sm">
          Sua solicitação de digitalização e acesso aos equipamentos foi recebida com sucesso.
          Nossa equipe do comitê dataPATH analisará a documentação ética (CEP/CEUA) e enviará a confirmação para <strong className="text-sky-600 font-bold">{email}</strong>.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 text-sm font-bold transition-all shadow-xs"
          >
            <Home className="h-4 w-4" /> Ir para a Página Inicial
          </button>
          <button
            onClick={() => onNavigate('login')}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 px-6 text-sm font-bold text-white shadow-md shadow-sky-600/20 transition-all"
          >
            Acessar Área Restrita (Login)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-sky-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao Portal
        </button>

        <button
          onClick={() => onNavigate('login')}
          className="text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 border border-sky-200 px-4 py-2 rounded-xl shadow-xs transition-colors"
        >
          Já possui cadastro? Entrar →
        </button>
      </div>

      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700 mb-1">
          <Microscope className="h-3.5 w-3.5" /> Formulário Oficial de Parcerias & Extensão Tecnológica
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Solicitação de Digitalização de Lâminas (WSI) & Equipamentos
        </h1>
        <p className="text-sm text-slate-600">
          Preencha os dados do projeto para solicitar o uso do <strong className="text-sky-700">Scanner 3DHISTECH Pannoramic DESK II</strong> e do <strong className="text-teal-700">PCR Real Time 7500</strong> do Laboratório de Patologia Molecular (UFES/AFECC).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-sky-100 font-mono text-sm font-bold text-sky-700">
              01
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Identificação Cadastral</h2>
              <p className="text-xs text-slate-500">Dados do pesquisador ou profissional solicitante</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Ex: Dra. Ana Paula Vasconcelos"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
                E-mail Institucional *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ana.vasconcelos@universidade.edu.br"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
                Telefone com DDD *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="(27) 98765-4321"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
                Instituição / Centro / Hospital *
              </label>
              <input
                type="text"
                required
                value={institutionAndDepartment}
                onChange={e => setInstitutionAndDepartment(e.target.value)}
                placeholder="Ex: UFES - Programa de Pós-Graduação em Biotecnologia"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-sky-100 font-mono text-sm font-bold text-sky-700">
              02
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Perfil & Título da Pesquisa</h2>
              <p className="text-xs text-slate-500">Vínculo institucional e tema da investigação</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
                Modalidade de Vínculo *
              </label>
              <select
                value={modality}
                onChange={e => setModality(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 outline-none focus:border-sky-500 focus:bg-white transition-all"
              >
                <option value="IniciacaoCientifica">🎓 Iniciação Científica (Bolsista/Voluntário)</option>
                <option value="Mestrado">🎓 Mestrado Acadêmico / Profissional</option>
                <option value="Doutorado">🎓 Doutorado</option>
                <option value="PosDoc">🔬 Pós-Doutorado / Pesquisador Visitante</option>
                <option value="ParceiroClinico">🏥 Médico / Parceiro Clínico (AFECC / SUS)</option>
                <option value="Outro">🌐 Outro Pesquisador Externo</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
                Título do Projeto de Pesquisa *
              </label>
              <input
                type="text"
                required
                value={researchTitle}
                onChange={e => setResearchTitle(e.target.value)}
                placeholder="Ex: Análise histopatológica e biomarcadores em câncer de cabeça e pescoço"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-sky-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-sky-100 font-mono text-sm font-bold text-sky-700">
              03
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Documentação Ética (CEP / CEUA)</h2>
              <p className="text-xs text-slate-500">Conformidade obrigatória com a Resolução CNS 466/2012 e LGPD</p>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={hasEthicsApproval}
              onChange={e => setHasEthicsApproval(e.target.checked)}
              className="h-4 w-4 rounded text-sky-600 focus:ring-sky-500"
            />
            <span className="text-xs font-semibold text-slate-800">
              Declaro que o projeto possui aprovação formal do Comitê de Ética em Pesquisa (CEP com Seres Humanos ou CEUA)
            </span>
          </label>

          {hasEthicsApproval && (
            <div className="space-y-3">
              <label className="grid cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-sky-300 bg-sky-50/50 p-8 text-center transition-all hover:bg-sky-50 hover:border-sky-400">
                <input type="file" accept=".pdf" multiple onChange={handleFileChange} className="hidden" />
                <UploadCloud className="h-8 w-8 text-sky-600 mb-2" />
                <p className="text-sm font-bold text-slate-800">Clique para anexar o Parecer Consubstanciado CEP/CEUA em PDF</p>
                <p className="text-xs text-slate-500 mt-1">Formatos aceitos: arquivos .PDF (até 5 documentos)</p>
              </label>

              {ethicsFiles.length > 0 && (
                <div className="space-y-2">
                  {ethicsFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="h-4 w-4 text-sky-600 shrink-0" />
                        <span className="text-slate-800 font-semibold truncate">{file.name}</span>
                        <span className="text-slate-400 text-[11px]">({(file.size / 1024).toFixed(0)} KB)</span>
                      </div>
                      <button type="button" onClick={() => removeFile(idx)} className="text-rose-600 hover:text-rose-800 font-bold px-2">
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
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-sky-100 font-mono text-sm font-bold text-sky-700">
              04
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Equipamentos Solicitados & Termos de Uso</h2>
              <p className="text-xs text-slate-500">Selecione os recursos para inclusão no fluxo de agendamento</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className={`flex items-start gap-3.5 p-5 rounded-2xl border transition-all cursor-pointer ${
              requestScanner3DHistech ? 'border-sky-300 bg-sky-50/60 shadow-xs' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}>
              <input
                type="checkbox"
                checked={requestScanner3DHistech}
                onChange={e => setRequestScanner3DHistech(e.target.checked)}
                className="mt-1 h-4 w-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <div>
                <span className="text-sm font-bold text-slate-900 block">🔬 Scanner 3DHISTECH Pannoramic</span>
                <span className="text-xs text-slate-600 mt-1 block">
                  Digitalização em alta resolução (WSI) com objetivas 20x/40x (ampliação total até 116x) e foco contínuo.
                </span>
              </div>
            </label>

            <label className={`flex items-start gap-3.5 p-5 rounded-2xl border transition-all cursor-pointer ${
              requestPcrRealTime7500 ? 'border-teal-300 bg-teal-50/60 shadow-xs' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
            }`}>
              <input
                type="checkbox"
                checked={requestPcrRealTime7500}
                onChange={e => setRequestPcrRealTime7500(e.target.checked)}
                className="mt-1 h-4 w-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <div>
                <span className="text-sm font-bold text-slate-900 block">🧬 PCR Real Time 7500 StepOne</span>
                <span className="text-xs text-slate-600 mt-1 block">
                  Termociclador para quantificação molecular e perfil de expressão gênica e viral.
                </span>
              </div>
            </label>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
            <ShieldCheck className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
            <p>
              Ao submeter esta proposta, você concorda com o <strong>Termo de Transferência e Armazenamento de Dados do dataPATH</strong> em observância à LGPD (Lei 13.709/2018). As lâminas físicas deverão ser entregues acondicionadas em caixas porta-lâminas limpas e devidamente identificadas.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 px-8 text-sm font-bold text-white shadow-lg shadow-sky-600/25 disabled:opacity-50 transition-all"
          >
            {submitting ? 'Submetendo solicitação...' : 'Enviar Solicitação de Digitalização'} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

