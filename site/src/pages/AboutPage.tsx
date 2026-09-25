import { Target, Eye, BookOpen, ShieldCheck, FlaskConical, MonitorSmartphone, HardDrive, Scan } from 'lucide-react'

const equipment = [
  {
    icon: Scan,
    name: 'Scanner 3DHISTECH Pannoramic',
    desc: 'Scanner de lâminas de alta velocidade capaz de digitalizar tecidos em resolução gigapixel (Whole Slide Imaging). Permite a criação de imagens digitais fiéis das lâminas histopatológicas para análise remota.',
    specs: ['Resolução: até 0.12 µm/pixel', 'Capacidade: 250 lâminas por carregamento', 'Formatos: .mrxs, .svs, .tiff'],
  },
  {
    icon: FlaskConical,
    name: 'Real Time 7500 PCR',
    desc: 'Sistema de PCR em tempo real para análises moleculares complementares ao diagnóstico histopatológico, permitindo a detecção quantitativa de sequências específicas de DNA/RNA.',
    specs: ['96 poços por corrida', 'Detecção multicanal', 'Curvas de amplificação em tempo real'],
  },
  {
    icon: HardDrive,
    name: 'NAS QNAP — Banco de Imagens',
    desc: 'Servidor de armazenamento em rede (Network Attached Storage) dedicado ao banco de imagens WSI, garantindo backup redundante, acesso remoto seguro e escalabilidade para petabytes de dados histopatológicos.',
    specs: ['Armazenamento escalável', 'RAID com redundância', 'Acesso remoto via API'],
  },
  {
    icon: MonitorSmartphone,
    name: 'Plataforma dataPATH (Mini-PACS)',
    desc: 'Sistema web desenvolvido internamente para gestão, visualização e emissão de laudos de segunda opinião. Permite que patologistas analisem lâminas digitalizadas remotamente com ferramentas de zoom e navegação.',
    specs: ['Visualização gigapixel no navegador', '2ª opinião remota assíncrona', 'Auditoria LGPD completa'],
  },
]

const values = [
  {
    icon: Target,
    title: 'Missão',
    desc: 'Democratizar o acesso à patologia digital de excelência no Sistema Único de Saúde (SUS), reduzindo o tempo entre a biópsia e o início do tratamento oncológico.',
  },
  {
    icon: Eye,
    title: 'Visão',
    desc: 'Ser referência nacional em patologia digital e inteligência artificial aplicada ao diagnóstico histopatológico, formando uma rede colaborativa interinstitucional.',
  },
  {
    icon: BookOpen,
    title: 'Valores',
    desc: 'Inovação responsável, ética em pesquisa, privacidade de dados (LGPD), colaboração científica aberta e compromisso com a saúde pública.',
  },
]

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            Sobre o <span className="text-gradient">DigiPath</span>
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Conheça o projeto que está transformando o diagnóstico histopatológico
            no Espírito Santo através da tecnologia.
          </p>
        </div>
      </section>

      {/* O Projeto */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)] mb-4">
                O Projeto
              </h2>
              <div className="space-y-4 text-[var(--color-text-muted)] leading-relaxed">
                <p>
                  O <strong className="text-[var(--color-text)]">DigiPath</strong> (Plataforma de Patologia Digital e
                  Banco de Imagens) é uma iniciativa conjunta do{' '}
                  <strong className="text-[var(--color-text)]">Programa de Pós-Graduação em Biotecnologia (PPGBiotec)</strong>{' '}
                  da Universidade Federal do Espírito Santo (UFES) e da{' '}
                  <strong className="text-[var(--color-text)]">Associação Feminina de Educação e Combate ao Câncer (AFECC)</strong>{' '}
                  — Hospital Santa Rita de Cássia, referência oncológica no estado.
                </p>
                <p>
                  O projeto tem como objetivo central a criação de uma infraestrutura completa para a
                  digitalização de lâminas histopatológicas em altíssima resolução (Whole Slide Imaging — WSI),
                  permitindo o armazenamento seguro, a visualização remota e a emissão de segundas opiniões
                  diagnósticas por médicos patologistas de forma assíncrona.
                </p>
                <p>
                  Financiado pela <strong className="text-[var(--color-text)]">FAPES</strong> (Fundação de Amparo à
                  Pesquisa e Inovação do Espírito Santo) através do Edital de Extensão Tecnológica, o DigiPath
                  contribui diretamente para a agilização do diagnóstico oncológico de pacientes atendidos pelo SUS,
                  encurtando o intervalo entre a biópsia e o início do tratamento.
                </p>
              </div>
            </div>

            {/* Placeholder de foto do laboratório */}
            <div className="glass-card overflow-hidden flex items-center justify-center bg-slate-50 min-h-[300px]">
              <div className="text-center p-8">
                <ShieldCheck className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <p className="text-sm text-[var(--color-text-muted)]">
                  📷 Foto do Laboratório de Patologia Digital
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  UFES — Campus Maruípe, CCS
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão, Valores */}
      <section className="py-16 bg-white border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((item, i) => (
              <div key={i} className="glass-card p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipamentos e Infraestrutura */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[var(--color-text)] mb-4">
              Equipamentos e Infraestrutura
            </h2>
            <p className="text-[var(--color-text-muted)] max-w-2xl mx-auto">
              O laboratório conta com equipamentos de ponta para digitalização e análise
              de lâminas histopatológicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {equipment.map((eq, i) => (
              <div key={i} className="glass-card glass-card-hover p-6">
                <div className="flex items-start gap-4">
                  {/* Placeholder de foto do equipamento */}
                  <div className="w-16 h-16 rounded-xl bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center shrink-0">
                    <eq.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[var(--color-text)] mb-1">{eq.name}</h3>
                    <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-3">{eq.desc}</p>
                    <ul className="space-y-1">
                      {eq.specs.map((spec, si) => (
                        <li key={si} className="text-xs text-[var(--color-text-muted)] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governança */}
      <section className="py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
                  Governança, Ética e LGPD
                </h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed mb-4">
                  O DigiPath opera em total conformidade com a{' '}
                  <strong className="text-[var(--color-text)]">Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018)</strong>{' '}
                  e com as normas dos Comitês de Ética em Pesquisa (CEP/CONEP).
                </p>
                <ul className="space-y-2 text-sm text-[var(--color-text-muted)]">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    Todos os dados clínicos são rigorosamente anonimizados — nenhum nome, CPF ou contato de paciente é armazenado
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    Trilha de auditoria imutável registra cada acesso a informações sensíveis (IP, horário, ação)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    Controle de acesso baseado em perfis (RBAC) com autenticação segura via token JWT
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    Links temporários com expiração automática para compartilhamento seguro de lâminas digitalizadas
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
