import { useState, useEffect } from 'react'
import { Newspaper, Search, Loader2 } from 'lucide-react'
import NewsCard from '../components/NewsCard'
// We keep the local JSON as fallback/mock if API fails or is empty initially
import fallbackNewsData from '../data/news.json'

const CATEGORIES = ['Todas', 'Tecnologia', 'Pesquisa', 'Eventos', 'Editais']

interface ApiNews {
  id: string
  title: string
  summary: string
  content: string
  coverImageUrl?: string
  publishedAt: string
}

export default function NewsPage() {
  const [category, setCategory] = useState('Todas')
  const [search, setSearch] = useState('')
  const [newsList, setNewsList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/sistema/api/news')
        if (res.ok) {
          const data: ApiNews[] = await res.json()
          // Convert to UI format
          const mappedNews = data.map((n, idx) => ({
            id: n.id,
            title: n.title,
            summary: n.summary,
            date: n.publishedAt,
            category: 'Notícia',
            imageColor: ['#0284c7', '#0f766e', '#6366f1'][idx % 3], // Cycle colors
            tags: [],
            imageUrl: n.coverImageUrl
          }))
          
          if (mappedNews.length > 0) {
            setNewsList(mappedNews)
          } else {
            setNewsList(fallbackNewsData)
          }
        } else {
          setNewsList(fallbackNewsData)
        }
      } catch (e) {
        console.error("Erro ao carregar notícias, usando fallback local.", e)
        setNewsList(fallbackNewsData)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchNews()
  }, [])

  const filtered = newsList.filter((news) => {
    const matchCategory = category === 'Todas' || news.category === category
    const matchSearch = search === '' ||
      news.title.toLowerCase().includes(search.toLowerCase()) ||
      news.summary.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-hero py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6 backdrop-blur-sm border border-white/20 shadow-lg">
            <Newspaper className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md">
            Notícias e <span className="text-[var(--color-primary-light)]">Atualizações</span>
          </h1>
          <p className="text-xl text-[var(--color-primary-light)] max-w-2xl mx-auto leading-relaxed drop-shadow">
            Fique por dentro das últimas novidades da plataforma dataPATH, avanços em patologia digital e eventos científicos.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 pb-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar notícias..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm shadow-sm transition-all"
              />
            </div>

            {/* Categories */}
            <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    category === cat
                      ? 'bg-sky-600 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300 hover:text-sky-700 hover:bg-sky-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-500">
              <Loader2 className="w-10 h-10 animate-spin text-sky-600 mb-4" />
              <p>Carregando novidades...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((news) => (
                <NewsCard key={news.id || news.title} {...news} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhuma notícia encontrada</h3>
              <p className="text-slate-500">
                Tente ajustar sua busca ou limpar os filtros para encontrar o que procura.
              </p>
              <button 
                onClick={() => { setSearch(''); setCategory('Todas') }}
                className="mt-6 px-6 py-2 bg-sky-50 text-sky-700 font-semibold rounded-lg hover:bg-sky-100 transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
