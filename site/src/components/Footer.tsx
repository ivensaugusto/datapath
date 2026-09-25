import { MapPin, Mail } from 'lucide-react'
import logoSelo from '../assets/logos/logo_selo_circular.png'

type Page = 'home' | 'sobre' | 'datapath' | 'noticias'

interface FooterProps {
  onNavigate: (page: Page) => void
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gradient-footer text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Coluna 1: Logo e Descrição */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={logoSelo} alt="DigiPath" className="h-12 w-12 rounded-full bg-white p-1" />
              <div>
                <h3 className="text-lg font-bold">digiPATH</h3>
                <p className="text-xs text-slate-400">Patologia Digital</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Plataforma de Patologia Digital e Banco de Imagens para digitalização
              de lâminas histopatológicas em altíssima resolução.
            </p>
          </div>

          {/* Coluna 2: Navegação */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Navegação
            </h4>
            <ul className="space-y-2">
              {[
                { id: 'home' as Page, label: 'Início' },
                { id: 'sobre' as Page, label: 'Sobre o Projeto' },
                { id: 'datapath' as Page, label: 'Galeria de Lâminas' },
                { id: 'noticias' as Page, label: 'Notícias' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="text-sm text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <a
                  href="https://datapath.produtoweb.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Sistema dataPATH ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Parceiros */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Parceiros e Fomento
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>UFES — PPGBiotec</li>
              <li>AFECC — Hospital Santa Rita</li>
              <li>FAPES</li>
              <li>CNPq</li>
            </ul>
          </div>

          {/* Coluna 4: Contato */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Contato
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-slate-300">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                <span>
                  UFES — Campus Maruípe, CCS<br />
                  Vitória, ES — Brasil
                </span>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <Mail className="w-4 h-4 shrink-0 text-slate-400" />
                <a href="mailto:projetodigipath@gmail.com" className="hover:text-white transition-colors">
                  projetodigipath@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-300">
                <span className="font-bold w-4 h-4 shrink-0 text-slate-400 flex items-center justify-center">@</span>
                <a
                  href="https://www.instagram.com/projetodigipath/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @projetodigipath
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="mt-10 pt-6 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} DigiPath — Plataforma de Patologia Digital. Todos os direitos reservados.
          </p>
          <p className="text-xs text-slate-500">
            Projeto financiado pela FAPES — Edital de Extensão Tecnológica
          </p>
        </div>
      </div>
    </footer>
  )
}
