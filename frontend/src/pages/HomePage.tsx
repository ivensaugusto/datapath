import React from 'react';
import {
  Microscope,
  FileSpreadsheet,
  Layers,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Activity,
  CheckCircle2,
  Users,
  Sparkles,
  BookOpen,
  Lock,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string, caseId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-sky-500 selection:text-white flex flex-col">
      {/* Top Notification Bar */}
      <div className="bg-sky-900 text-sky-100 px-4 py-2 text-xs font-medium text-center border-b border-sky-800 flex items-center justify-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1 bg-sky-800 text-sky-200 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider">
          Edital FAPES Nº 09/2024
        </span>
        <span>Plataforma de Patologia Digital e Banco de Imagens — UFES & AFECC Hospital Santa Rita</span>
        <a
          href="https://www.instagram.com/projetodigipath/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-bold hover:text-white inline-flex items-center gap-1 ml-1"
        >
          @projetodigipath <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Microscope className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  digi<span className="text-sky-600">PATH</span>
                </span>
                <span className="text-slate-300 font-light text-xl">|</span>
                <span className="text-lg font-bold tracking-tight text-teal-700">
                  data<span className="text-slate-900">PATH</span>
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 hidden sm:block">
                Plataforma de Patologia Digital & Repositório de Imagens
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <a href="#sobre" className="hover:text-sky-600 transition-colors">Sobre</a>
            <a href="#servicos" className="hover:text-sky-600 transition-colors">Equipamentos & WSI</a>
            <a href="#solicitar" className="hover:text-sky-600 transition-colors">Solicitar Digitalização</a>
            <a href="#minipacs" className="hover:text-sky-600 transition-colors">Mini-PACS</a>
            <a href="#equipe" className="hover:text-sky-600 transition-colors">Equipe & Governança</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('onboarding-apply')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200 text-xs font-bold hover:bg-sky-100 hover:border-sky-300 transition-all shadow-xs"
            >
              <FileSpreadsheet className="h-4 w-4 text-sky-600" />
              Pedir Digitalização
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 text-white text-xs font-bold hover:from-sky-700 hover:to-teal-700 shadow-md shadow-sky-600/20 transition-all"
            >
              <Layers className="h-4 w-4" />
              Acessar Sistema
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-sky-50/40 to-slate-50 pt-12 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-800 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs">
                <Sparkles className="h-4 w-4 text-teal-600" />
                Inovação em Patologia Computacional & Inteligência Artificial
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Digitalização de lâminas e diagnóstico de precisão para a saúde e a ciência no Espírito Santo
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                O <strong>digiPATH</strong> e o <strong>dataPATH</strong> conectam pesquisadores, médicos e estudantes a uma infraestrutura avançada de escaneamento de lâminas inteiras (<em>Whole Slide Imaging</em>), visualização gigapixel e suporte a estudos multicêntricos.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => onNavigate('onboarding-apply')}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-lg shadow-sky-600/25 transition-all"
                >
                  <FileSpreadsheet className="h-5 w-5" />
                  Solicitar Digitalização de Lâminas
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => onNavigate('dashboard')}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-xs transition-all"
                >
                  <Microscope className="h-5 w-5 text-teal-600" />
                  Abrir Banco de Imagens (Mini-PACS)
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4 text-left">
                <div>
                  <span className="block text-2xl font-black text-slate-900">116x</span>
                  <span className="text-xs text-slate-500 font-medium">Ampliação Óptica Máxima</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-sky-600">+300</span>
                  <span className="text-xs text-slate-500 font-medium">Lâminas Gigapixel WSI</span>
                </div>
                <div>
                  <span className="block text-2xl font-black text-teal-600">100%</span>
                  <span className="text-xs text-slate-500 font-medium">Conformidade LGPD & CEP</span>
                </div>
              </div>
            </div>

            {/* Right Card / Interactive Preview Mockup */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Scanner 3DHISTECH Ativo
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold bg-sky-50 text-sky-700 px-2.5 py-1 rounded-lg border border-sky-100">
                    20x / 40x WSI
                  </span>
                </div>

                {/* Simulated Gigapixel Slide */}
                <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video border border-slate-200 shadow-inner group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-900/40 via-purple-900/30 to-sky-900/40 flex items-center justify-center p-4">
                    <div className="text-center text-white space-y-2">
                      <Microscope className="h-10 w-10 mx-auto text-sky-300 animate-pulse" />
                      <div className="font-mono text-xs font-bold text-sky-200">
                        SlideViewer — Varredura Panorâmica
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Resolução: 0.25 µm/pixel • Foco Contínuo XYZ
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-mono text-teal-300 border border-slate-700">
                    HE • Mama Carcinoma #DP-2026-089
                  </div>

                  <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[10px]">
                    2ª Opinião Disponível
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => onNavigate('onboarding-apply')}
                    className="p-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-left border border-sky-100 transition-colors"
                  >
                    <span className="block text-xs font-bold text-sky-900">Novo Pesquisador?</span>
                    <span className="text-[11px] text-sky-700 font-medium">Cadastre seu projeto e anexe o CEP →</span>
                  </button>

                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="p-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-left border border-teal-100 transition-colors"
                  >
                    <span className="block text-xs font-bold text-teal-900">Médico Patologista?</span>
                    <span className="text-[11px] text-teal-700 font-medium">Acesse as lâminas para laudo →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Cards: The 2 Core Pillars */}
      <section id="solicitar" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600">Serviços Integrados</h2>
            <h3 className="text-3xl font-extrabold text-slate-900">
              Duas Soluções Principais para a Comunidade Científica e Médica
            </h3>
            <p className="text-slate-600 text-sm">
              Desenvolvidas para atender às exigências de extensão tecnológica da FAPES, integrando a UFES e a AFECC.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: Formulário de Solicitação & Onboarding */}
            <div className="bg-gradient-to-br from-sky-50/50 via-white to-sky-50/30 rounded-3xl p-8 border border-sky-200 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-sky-300 transition-all">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/20">
                  <FileSpreadsheet className="h-6 w-6" />
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-100/80 px-3 py-1 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5 text-sky-600" />
                  Módulo 1: Captação de Parceiros
                </div>
                <h4 className="text-2xl font-extrabold text-slate-900">
                  Formulário para Pedir Digitalizações & Uso de Equipamentos
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Fluxo 100% digital e transparente para solicitar o escaneamento de lâminas histológicas e uso dos equipamentos do laboratório (Scanner 3DHISTECH e PCR Real-Time 7500).
                </p>

                <ul className="space-y-2.5 pt-2 text-xs font-semibold text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[10px]">1</span>
                    Identificação do pesquisador (IC, Mestrado, Doutorado, Pós-Doc ou Clínico)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[10px]">2</span>
                    Seleção de aparelhos e quantidade de lâminas estimadas
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[10px]">3</span>
                    Upload do Parecer Ético (CEP / CEUA) em PDF
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[10px]">4</span>
                    Acordo de Transferência de Dados e SLA de retenção
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onNavigate('onboarding-apply')}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-md shadow-sky-600/20 transition-all"
                >
                  Preencher Formulário de Solicitação
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Feature 2: Sistema de Controle de Arquivos & Mini-PACS */}
            <div id="minipacs" className="bg-gradient-to-br from-teal-50/50 via-white to-teal-50/30 rounded-3xl p-8 border border-teal-200 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:border-teal-300 transition-all">
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20">
                  <Layers className="h-6 w-6" />
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-teal-100/80 px-3 py-1 rounded-full">
                  <ShieldCheck className="h-3.5 w-3.5 text-teal-600" />
                  Módulo 2: dataPATH Mini-PACS
                </div>
                <h4 className="text-2xl font-extrabold text-slate-900">
                  Sistema de Controle de Arquivos & Visualizador WSI
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Repositório de lâminas histopatológicas em alta definição, com visualizador gigapixel interativo, ferramentas de anotação/medida, laudos e auditoria LGPD.
                </p>

                <ul className="space-y-2.5 pt-2 text-xs font-semibold text-slate-700">
                  <li className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[10px]">✓</span>
                    Painel com métricas em tempo real e filtros por órgão e coloração (HE, IHQ, etc.)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[10px]">✓</span>
                    Visualizador WSI com zoom até 40x/116x, réguas (µm) e ROI
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[10px]">✓</span>
                    Emissão e assinatura digital de laudos de 2ª opinião técnica
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-[10px]">✓</span>
                    Trilha de auditoria imutável (LGPD - Lei 13.709/2018)
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md shadow-teal-700/20 transition-all"
                >
                  Acessar Mini-PACS e Casos Clínicos
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology & Infrastructure Section */}
      <section id="servicos" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-teal-700">Infraestrutura Tecnológica</h2>
            <h3 className="text-3xl font-extrabold text-slate-900">
              Equipamentos de Última Geração para Pesquisa e Diagnóstico
            </h3>
            <p className="text-slate-600 text-sm">
              Recursos adquiridos e mantidos com apoio da FAPES, UFES e AFECC para fomentar a biotecnologia e a medicina de precisão.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tech 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Microscope className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Scanner 3DHISTECH Pannoramic DESK II</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Varredura contínua de lâminas histopatológicas em alta velocidade, com ampliação de até 116x e foco tridimensional contínuo em toda a superfície do tecido.
              </p>
            </div>

            {/* Tech 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <Activity className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">PCR Real Time 7500 StepOne</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Termociclador de alta sensibilidade para análise quantitativa e identificação de biomarcadores moleculares e virológicos (HPV oncogênico e perfis genômicos).
              </p>
            </div>

            {/* Tech 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <Lock className="h-5 w-5" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Armazenamento NAS & Backup Seguro</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unidade central de armazenamento com 20TB de capacidade, criptografia, redundância e controle de acesso exclusivo por login e senha.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About the Project & Governance */}
      <section id="sobre" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                <BookOpen className="h-3.5 w-3.5 text-sky-600" />
                Histórico & Relevância Científica
              </div>

              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Democratizando o Conhecimento em Patologia no Espírito Santo
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                Tradicionalmente, o diagnóstico histopatológico dependia de lâminas físicas de vidro sob microscópio óptico. O projeto <strong>digiPATH</strong> introduziu a patologia digital em 2023 através da primeira parceria de Tecnologia Social entre a UFES e a AFECC (Hospital Santa Rita de Cássia).
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                Com a expansão no <strong>Edital FAPES 09/2024</strong>, o <strong>dataPATH</strong> estabelece o Banco de Imagens Digitais para preservar, desenvolver e permitir o acesso seguro de cientistas aos dados histopatológicos, viabilizando o treinamento de modelos de Inteligência Artificial e a realização de discussões clínicas multicêntricas.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h5 className="font-bold text-sm text-slate-900">Educação e Treinamento</h5>
                  <p className="text-xs text-slate-500 mt-1">Formação de alunos de graduação e pós-graduação em Biotecnologia.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h5 className="font-bold text-sm text-slate-900">Comitê de Uso de Dados</h5>
                  <p className="text-xs text-slate-500 mt-1">Governança transparente e revisão trimestral das propostas de pesquisa.</p>
                </div>
              </div>
            </div>

            <div id="equipe" className="lg:col-span-6">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-6">
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-sky-600" />
                  Corpo Docente & Coordenação
                </h4>

                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block">
                      Coordenadora do Projeto
                    </span>
                    <strong className="text-sm text-slate-900 block mt-0.5">
                      Profa. Dra. Sandra Lúcia Ventorin Von Zeidler
                    </strong>
                    <p className="text-slate-600 mt-1">
                      Universidade Federal do Espírito Santo (UFES) • Departamento de Patologia / Programa de Pós-Graduação em Biotecnologia.
                    </p>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                      Instituições Parceiras
                    </span>
                    <ul className="mt-1 space-y-1 text-slate-700 font-medium">
                      <li>• <strong>UFES</strong> — Universidade Federal do Espírito Santo</li>
                      <li>• <strong>AFECC</strong> — Associação Feminina de Educação e Combate ao Câncer (Hospital Santa Rita)</li>
                      <li>• <strong>FAPES</strong> — Fundação de Amparo à Pesquisa e Inovação do ES</li>
                      <li>• <strong>IFES</strong> — Instituto Federal do Espírito Santo</li>
                    </ul>
                  </div>
                </div>

                {/* Social Instagram Box */}
                <div className="p-4 bg-gradient-to-r from-sky-600 to-teal-600 rounded-2xl text-white flex items-center justify-between shadow-md">
                  <div>
                    <span className="text-xs font-bold block">Acompanhe no Instagram</span>
                    <span className="text-[11px] text-sky-100">Divulgações, eventos e open spaces</span>
                  </div>
                  <a
                    href="https://www.instagram.com/projetodigipath/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
                  >
                    @projetodigipath <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold">
                <Microscope className="h-5 w-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight">digiPATH • dataPATH</span>
                <p className="text-[11px] text-slate-400">Plataforma de Patologia Digital & Repositório de Lâminas</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-semibold">
              <button onClick={() => onNavigate('onboarding-apply')} className="hover:text-white transition-colors">
                Solicitar Digitalização
              </button>
              <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                Acessar Mini-PACS
              </button>
              <button onClick={() => onNavigate('login')} className="hover:text-white transition-colors">
                Área Restrita (Login)
              </button>
              <a
                href="https://www.instagram.com/projetodigipath/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Instagram Oficial
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>
              © {new Date().getFullYear()} digiPATH / dataPATH • Desenvolvido com apoio da FAPES (Edital 09/2024). Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Conformidade com a LGPD (Lei nº 13.709/2018) e Resolução CNS 466/2012</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
