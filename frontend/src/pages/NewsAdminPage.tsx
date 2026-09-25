import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react'

// Mock fetching or replace with real fetch calls
const API_URL = (typeof window !== 'undefined' && window.location.port === '5173' ? 'http://localhost:5000/api' : '/api') + '/news'

interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  coverImageUrl?: string
  publishedAt: string
  isActive: boolean
  authorName: string
}

export default function NewsAdminPage() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form state
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [coverImage, setCoverImage] = useState<File | null>(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('datapath_token')
      const res = await fetch(API_URL + '?includeInactive=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setNews(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('datapath_token')
      
      let articleId = editingId
      if (!editingId) {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': Bearer  },
          body: JSON.stringify({ title, summary, content })
        })
        if (!res.ok) {
            const t = await res.text()
            throw new Error('Erro ao criar: ' + res.status + ' ' + t)
        }
        const data = await res.json()
        articleId = data.id
      } else {
        const res = await fetch(${API_URL}/, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': Bearer  },
          body: JSON.stringify({ title, summary, content, isActive })
        })
        if (!res.ok) throw new Error('Erro ao atualizar: ' + res.status)
      }

      if (coverImage && articleId) {
        const formData = new FormData()
        formData.append('file', coverImage)
        const uRes = await fetch(${API_URL}//upload-image, {
          method: 'POST',
          headers: { 'Authorization': Bearer  },
          body: formData
        })
        if (!uRes.ok) throw new Error('Erro imagem: ' + uRes.status)
      }

      setIsModalOpen(false)
      fetchNews()
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Erro ao salvar notícia.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja apagar esta notÃ­cia?")) return
    const token = localStorage.getItem('datapath_token')
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    fetchNews()
  }

  const openNew = () => {
    setEditingId(null)
    setTitle('')
    setSummary('')
    setContent('')
    setIsActive(true)
    setCoverImage(null)
    setIsModalOpen(true)
  }

  const openEdit = (article: NewsArticle) => {
    setEditingId(article.id)
    setTitle(article.title)
    setSummary(article.summary)
    setContent(article.content)
    setIsActive(article.isActive)
    setCoverImage(null)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">GestÃ£o de NotÃ­cias</h1>
          <p className="text-sm text-slate-500 mt-1">Publique novidades para o site vitrine.</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova NotÃ­cia
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Capa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">TÃ­tulo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">AÃ§Ãµes</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {news.map(article => (
              <tr key={article.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {article.coverImageUrl ? (
                    <img src={article.coverImageUrl} alt="Capa" className="h-10 w-16 object-cover rounded" />
                  ) : (
                    <div className="h-10 w-16 bg-slate-100 flex items-center justify-center rounded text-slate-400">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-900">{article.title}</div>
                  <div className="text-xs text-slate-500 truncate max-w-xs">{article.summary}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {new Date(article.publishedAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${article.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {article.isActive ? 'Ativo' : 'Oculto'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openEdit(article)} className="text-sky-600 hover:text-sky-900 mr-3">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {news.length === 0 && !isLoading && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  Nenhuma notÃ­cia publicada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar NotÃ­cia' : 'Nova NotÃ­cia'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">TÃ­tulo</label>
                <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Resumo (Max 500 char)</label>
                <textarea required value={summary} onChange={e => setSummary(e.target.value)} rows={2} className="mt-1 input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">ConteÃºdo</label>
                <textarea required value={content} onChange={e => setContent(e.target.value)} rows={8} className="mt-1 input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Imagem de Capa (Opcional)</label>
                <input type="file" accept="image/*" onChange={e => setCoverImage(e.target.files ? e.target.files[0] : null)} className="mt-1" />
              </div>
              {editingId && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} id="isActive" />
                  <label htmlFor="isActive" className="text-sm font-medium text-slate-700">NotÃ­cia Ativa (VisÃ­vel na Vitrine)</label>
                </div>
              )}
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Salvar NotÃ­cia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}



