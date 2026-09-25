import { Layers, Info } from 'lucide-react'
import SlideGallery from '../components/SlideGallery'

export default function GalleryPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] text-sm font-semibold mb-4">
            <Layers className="w-4 h-4" />
            Banco de Imagens
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            Galeria <span className="text-gradient">Datapath</span>
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Explore o acervo de lâminas histopatológicas digitalizadas em resolução gigapixel.
            Filtre por tipo de coloração para encontrar imagens específicas.
          </p>
        </div>
      </section>

      {/* Info Box */}
      <section className="py-6 bg-white border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-sky-50 border border-sky-200">
            <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-sky-800 font-medium">
                Sobre as imagens
              </p>
              <p className="text-sm text-sky-700 mt-1">
                As miniaturas abaixo representam lâminas digitalizadas no laboratório de Patologia Digital da UFES
                utilizando o scanner 3DHISTECH Pannoramic. Todos os dados clínicos associados são anonimizados
                em conformidade com a LGPD. Para acessar as imagens em resolução completa, utilize o{' '}
                <a
                  href="https://datapath.produtoweb.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline hover:text-sky-900"
                >
                  Sistema dataPATH
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SlideGallery />
        </div>
      </section>

      {/* Tipos de Coloração */}
      <section className="py-12 bg-white border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--color-text)] mb-6 text-center">
            Tipos de Coloração Histológica
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'HE (Hematoxilina e Eosina)', desc: 'Coloração padrão-ouro em histopatologia. Hematoxilina cora núcleos em azul/roxo, eosina cora citoplasma e matrix em rosa.', colors: ['#b3559b', '#f0c8dd'] },
              { name: 'Ki-67', desc: 'Marcador de proliferação celular. Indica a fração de células em divisão ativa, essencial para avaliação prognóstica de tumores.', colors: ['#c07a3a', '#f6dcc0'] },
              { name: 'HER2', desc: 'Marcador do receptor 2 do fator de crescimento epidérmico humano. Fundamental no diagnóstico e tratamento do câncer de mama.', colors: ['#3d8fbd', '#c9e4f6'] },
              { name: 'PAS', desc: 'Ácido Periódico de Schiff. Destaca glicogênio, mucinas e membranas basais em magenta. Usado em patologias renais e hepáticas.', colors: ['#e06060', '#fde8e8'] },
              { name: 'Giemsa', desc: 'Coloração para identificação de microrganismos, parasitas e tipagem de leucócitos. Produz tons de azul e púrpura.', colors: ['#6050a0', '#d8d0f0'] },
              { name: 'Imuno-histoquímica', desc: 'Técnicas que utilizam anticorpos marcados para identificar proteínas específicas nos tecidos, auxiliando na classificação de tumores.', colors: ['#0284c7', '#e0f2fe'] },
            ].map((staining, i) => (
              <div key={i} className="glass-card p-4 flex items-start gap-3">
                <div className="flex gap-1 shrink-0 mt-1">
                  {staining.colors.map((c, ci) => (
                    <div key={ci} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text)]">{staining.name}</h3>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">{staining.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
