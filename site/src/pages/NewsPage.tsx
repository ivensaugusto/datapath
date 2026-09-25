import { useState } from 'react'
import { Newspaper, Search } from 'lucide-react'
import NewsCard from '../components/NewsCard'
import newsData from '../data/news.json'

const CATEGORIES = ['Todas', 'Tecnologia', 'Pesquisa', 'Eventos', 'Editais']

export default function NewsPage() {
  const [category, setCategory] = useState('Todas')
  const [search, setSearch] = useState('')

  const filtered = newsData.filter((news) => {
    const matchCategory = category === 'Todas' || news.category === category
    const matchSearch = search === '' ||
      news.title.toLowerCase().includes(search.toLowerCase()) ||
      news.summary.toLowerCase().includes(search.toLowerCase()) ||
      news.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchCategory && matchSearch
  })

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] text-sm font-semibold mb-4">
            <Newspaper className="w-4 h-4" />
            Blog
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            <span className="text-gradient">Notícias</span>
          </h1>
          <p className="text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto">
            Fique por dentro das novidades do projeto DigiPath, eventos acadêmicos,
            publicações científicas e editais de fomento.
          </p>
        </div>
      </section>

      {/* Filtros e Busca */}
      <section className="py-6 bg-white border-b border-[var(--color-border)] sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Categorias */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`
                    px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer
                    ${category === cat
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-slate-100 text-[var(--color-text-muted)] hover:bg-slate-200'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Busca */}
            <div className="relative flex-1 w-full sm:max-w-xs sm:ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Buscar notícias..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-[var(--color-border)] bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feed de Notícias */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((news) => (
                <NewsCard key={news.id} {...news} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Newspaper className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <p className="text-[var(--color-text-muted)]">
                Nenhuma notícia encontrada para os filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Aviso sobre futuro dashboard */}
      <section className="py-8 bg-slate-50/50 border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              📢 Em breve, as notícias serão gerenciadas através de um painel administrativo dedicado.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Acompanhe também nossas atualizações no{' '}
              <a
                href="https://www.instagram.com/projetodigipath/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-primary)] hover:underline"
              >
                Instagram @projetodigipath
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
