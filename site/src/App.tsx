import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import GalleryPage from './pages/GalleryPage'
import NewsPage from './pages/NewsPage'

type Page = 'home' | 'sobre' | 'datapath' | 'noticias'

function getInitialPage(): Page {
  const path = window.location.pathname.toLowerCase()
  if (path === '/sobre' || path === '/about') return 'sobre'
  if (path === '/datapath' || path === '/galeria') return 'datapath'
  if (path === '/noticias' || path === '/news') return 'noticias'
  return 'home'
}

function getPagePath(page: Page): string {
  switch (page) {
    case 'sobre': return '/sobre'
    case 'datapath': return '/datapath'
    case 'noticias': return '/noticias'
    default: return '/'
  }
}

function getPageTitle(page: Page): string {
  switch (page) {
    case 'sobre': return 'Sobre — DigiPath'
    case 'datapath': return 'Galeria de Lâminas — DigiPath'
    case 'noticias': return 'Notícias — DigiPath'
    default: return 'DigiPath — Plataforma de Patologia Digital'
  }
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(getInitialPage)

  const navigate = (page: Page) => {
    setCurrentPage(page)
    const path = getPagePath(page)
    window.history.pushState({ page }, '', path)
    document.title = getPageTitle(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    document.title = getPageTitle(currentPage)

    const handlePopState = (e: PopStateEvent) => {
      if (e.state?.page) {
        setCurrentPage(e.state.page)
      } else {
        setCurrentPage(getInitialPage())
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [currentPage])

  const renderPage = () => {
    switch (currentPage) {
      case 'sobre': return <AboutPage />
      case 'datapath': return <GalleryPage />
      case 'noticias': return <NewsPage />
      default: return <HomePage onNavigate={navigate} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  )
}
