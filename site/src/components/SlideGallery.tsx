import { useState } from 'react'
import { Filter } from 'lucide-react'

interface SlideItem {
  id: string
  code: string
  organ: string
  staining: string
  colors: string[]
  bgColor: string
  imageUrl?: string // Preparado para receber imagens reais (AVIF/WebP) da equipe
}

/* Dados mockup de lâminas — futuramente virão do QNAP */
const MOCK_SLIDES: SlideItem[] = [
  { id: '1', code: 'DP-2026-0001', organ: 'Pele', staining: 'HE', colors: ['#f0c8dd', '#b3559b', '#5b1f57', '#e8b4d0', '#8a3d6e'], bgColor: '#fdf2f8' },
  { id: '2', code: 'DP-2026-0002', organ: 'Mama', staining: 'HE', colors: ['#f0c8dd', '#d4829f', '#5b1f57', '#c96b8a', '#7a2d52'], bgColor: '#fdf2f8' },
  { id: '3', code: 'DP-2026-0003', organ: 'Fígado', staining: 'Ki-67', colors: ['#f6dcc0', '#c07a3a', '#5c3313', '#e0a060', '#8b5020'], bgColor: '#fffbeb' },
  { id: '4', code: 'DP-2026-0004', organ: 'Pulmão', staining: 'HER2', colors: ['#c9e4f6', '#3d8fbd', '#173d5c', '#6bb0d4', '#2a6a94'], bgColor: '#eff6ff' },
  { id: '5', code: 'DP-2026-0005', organ: 'Tireoide', staining: 'HE', colors: ['#f0c8dd', '#a0456d', '#5b1f57', '#d490b0', '#6e2845'], bgColor: '#fdf2f8' },
  { id: '6', code: 'DP-2026-0006', organ: 'Rim', staining: 'PAS', colors: ['#fde8e8', '#e06060', '#8b2020', '#f09090', '#a03030'], bgColor: '#fef2f2' },
  { id: '7', code: 'DP-2026-0007', organ: 'Cólon', staining: 'HE', colors: ['#f0c8dd', '#c46a8b', '#5b1f57', '#e0a0b8', '#8a3055'], bgColor: '#fdf2f8' },
  { id: '8', code: 'DP-2026-0008', organ: 'Estômago', staining: 'Giemsa', colors: ['#d8d0f0', '#6050a0', '#302060', '#a090c0', '#483878'], bgColor: '#f5f3ff' },
  { id: '9', code: 'DP-2026-0009', organ: 'Próstata', staining: 'Ki-67', colors: ['#f6dcc0', '#d09050', '#5c3313', '#b87840', '#7a4518'], bgColor: '#fffbeb' },
  { id: '10', code: 'DP-2026-0010', organ: 'Linfonodo', staining: 'HER2', colors: ['#c9e4f6', '#5098c0', '#173d5c', '#80b8d8', '#3870a0'], bgColor: '#eff6ff' },
  { id: '11', code: 'DP-2026-0011', organ: 'Pâncreas', staining: 'HE', colors: ['#f0c8dd', '#b8608a', '#5b1f57', '#d098b0', '#9a4068'], bgColor: '#fdf2f8' },
  { id: '12', code: 'DP-2026-0012', organ: 'Bexiga', staining: 'PAS', colors: ['#fde8e8', '#d05050', '#8b2020', '#e87878', '#b03838'], bgColor: '#fef2f2' },
]

const STAININGS = ['Todos', 'HE', 'Ki-67', 'HER2', 'PAS', 'Giemsa']

/* Miniatura SVG procedural — baseada no SlideThumb.tsx do sistema dataPATH */
function SlideThumbnail({ colors, bgColor }: { colors: string[]; bgColor: string }) {
  // Gerar posições pseudo-aleatórias para manchas celulares
  const spots = colors.flatMap((color, ci) =>
    Array.from({ length: 6 }, (_, i) => ({
      cx: 15 + ((ci * 37 + i * 23) % 70),
      cy: 15 + ((ci * 29 + i * 41) % 70),
      r: 3 + ((ci + i * 7) % 8),
      color,
      opacity: 0.4 + ((ci + i) % 4) * 0.15,
    }))
  )

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ backgroundColor: bgColor }}>
      {spots.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.color} opacity={s.opacity} />
      ))}
    </svg>
  )
}

export default function SlideGallery() {
  const [filter, setFilter] = useState('Todos')

  const filtered = filter === 'Todos'
    ? MOCK_SLIDES
    : MOCK_SLIDES.filter(s => s.staining === filter)

  return (
    <div>
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <Filter className="w-4 h-4 text-[var(--color-text-muted)]" />
        {STAININGS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer
              ${filter === s
                ? 'bg-[var(--color-accent)] text-white'
                : 'bg-slate-100 text-[var(--color-text-muted)] hover:bg-slate-200'
              }
            `}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filtered.map((slide) => (
          <div key={slide.id} className="glass-card glass-card-hover overflow-hidden group">
            <div className="aspect-square overflow-hidden bg-slate-100 flex items-center justify-center">
              {slide.imageUrl ? (
                <img 
                  src={slide.imageUrl} 
                  alt={`Lâmina ${slide.code}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <SlideThumbnail colors={slide.colors} bgColor={slide.bgColor} />
              )}
            </div>
            <div className="p-3">
              <p className="text-xs font-mono font-bold text-[var(--color-text)] truncate">
                {slide.code}
              </p>
              <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                {slide.organ} • {slide.staining}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-[var(--color-text-muted)]">
          <p>Nenhuma lâmina encontrada com o filtro selecionado.</p>
        </div>
      )}
    </div>
  )
}
