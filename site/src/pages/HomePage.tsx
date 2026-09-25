import { Microscope, Users, Building2, Award, ArrowRight, Layers, ShieldCheck, Zap } from 'lucide-react'
import NewsCard from '../components/NewsCard'
import newsData from '../data/news.json'
import logoHero from '../assets/logos/logo_digipath_fundo_lilas.png'

type Page = 'home' | 'sobre' | 'datapath' | 'noticias'

interface HomePageProps {
  onNavigate: (page: Page) => void
}

const stats = [
  { icon: Microscope, value: '2.000+', label: 'Lâminas Digitalizadas', color: '#0284c7' },
  { icon: Users, value: '15+', label: 'Pesquisadores Ativos', color: '#0f766e' },
  { icon: Building2, value: '5', label: 'Instituições Parceiras', color: '#7c3aed' },
  { icon: Award, value: '3', label: 'Editais Aprovados', color: '#d97706' },
]

const features = [
  {
    icon: Layers,
    title: 'Whole Slide Imaging',
    desc: 'Digitalização de lâminas em resolução gigapixel com o scanner 3DHISTECH Pannoramic, permitindo análise microscópica detalhada de qualquer lugar.',
    color: '#0284c7',
  },
  {
    icon: ShieldCheck,
    title: 'Conformidade LGPD',
    desc: 'Todos os dados clínicos são rigorosamente anonimizados. O sistema registra trilha de auditoria imutável para cada acesso a informações sensíveis.',
    color: '#0f766e',
  },
  {
    icon: Zap,
    title: '2ª Opinião Remota',
    desc: 'Patologistas podem emitir laudos de segunda opinião remotamente, agilizando o diagnóstico e reduzindo o tempo até o início do tratamento oncológico.',
    color: '#7c3aed',
  },
]

export default function HomePage({ onNavigate }: HomePageProps) {
  const recentNews = newsData.slice(0, 3)

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="bg-gradient-hero py-16 sm:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] text-sm font-semibold mb-6">
                <Microscope className="w-4 h-4" />
                Plataforma de Patologia Digital
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
                <span className="text-gradient">digiPATH</span>
                <br />
                <span className="text-[var(--color-text)]">Inovação Oncológica</span>
              </h1>
              <p className="text-lg text-[var(--color-text-muted)] leading-relaxed mb-8 max-w-lg">
                Transformando o diagnóstico histopatológico através da digitalização de lâminas
                em altíssima resolução. Uma parceria entre a{' '}
                <strong className="text-[var(--color-text)]">UFES</strong> e a{' '}
                <strong className="text-[var(--color-text)]">AFECC — Hospital Santa Rita</strong>.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://datapath.produtoweb.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:bg-sky-700 transition-colors"
                >
                  Acessar dataPATH
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => onNavigate('sobre')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-[var(--color-border)] text-[var(--color-text)] font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Conhecer o Projeto
                </button>
              </div>
            </div>

            <div className="flex justify-center animate-fade-in-up animate-delay-200">
              <div className="relative">
                <div className="absolute -inset-4 bg-[var(--color-accent)] rounded-full opacity-10 blur-3xl" />
                <img
                  src={logoHero}
                  alt="DigiPath — Plataforma de Patologia Digital"
                  className="relative w-64 sm:w-80 h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MÉTRICAS ===== */}
      <section className="py-12 bg-white border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: stat.color + '15', color: stat.color }}
                >
                  <stat.icon className="w-6 h-6" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-[var(--color-text)] tabular-nums">
                  {stat.value}
                </p>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== O QUE É O DIGIPATH ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--color-text)] mb-4">
              O que é o <span className="text-gradient">DigiPath</span>?
            </h2>
            <p className="text-lg text-[var(--color-text-muted)] leading-relaxed">
              O DigiPath é uma plataforma de patologia digital que permite a digitalização,
              armazenamento e análise remota de lâminas histopatológicas, criando um ambiente
              interativo e colaborativo que facilita o diagnóstico, a colaboração científica
              interinstitucional e a educação de qualidade em saúde.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <div
                key={i}
                className="glass-card glass-card-hover p-6 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: feat.color + '15', color: feat.color }}
                >
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">{feat.title}</h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NOTÍCIAS RECENTES ===== */}
      <section className="py-16 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-text)]">
              Últimas Notícias
            </h2>
            <button
              onClick={() => onNavigate('noticias')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:text-sky-700 transition-colors cursor-pointer"
            >
              Ver todas <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentNews.map((news) => (
              <NewsCard key={news.id} {...news} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== PARCEIROS ===== */}
      <section className="py-12 bg-white border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-8">
            Parceiros e Fomento
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {['UFES', 'AFECC', 'FAPES', 'CNPq', 'PPGBiotec'].map((partner) => (
              <div
                key={partner}
                className="px-6 py-3 rounded-xl border border-[var(--color-border)] text-[var(--color-text-muted)] font-semibold text-sm hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
