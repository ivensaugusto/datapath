import { Calendar, Tag } from 'lucide-react'

interface NewsCardProps {
  title: string
  summary: string
  date: string
  category: string
  imageColor: string
  tags: string[]
  imageUrl?: string
}

export default function NewsCard({ title, summary, date, category, imageColor, tags, imageUrl }: NewsCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <article className="glass-card glass-card-hover overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div
        className="h-48 flex items-center justify-center relative overflow-hidden bg-slate-100"
      >
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
            style={{ backgroundColor: imageColor || '#0284c7' }}
          >
            {category?.charAt(0) || 'N'}
          </div>
        )}
        {/* Badge de categoria */}
        <span
          className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
          style={{ backgroundColor: imageColor || '#0284c7' }}
        >
          {category || 'Notícia'}
        </span>
      </div>

      {/* Conteúdo */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-[var(--color-text)] mb-2 leading-snug line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-4 leading-relaxed line-clamp-3 flex-1">
          {summary}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
          {tags && tags.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
              <Tag className="w-3.5 h-3.5" />
              <span>{tags.length} tags</span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
