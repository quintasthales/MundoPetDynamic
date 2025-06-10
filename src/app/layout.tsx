// src/app/layout.tsx - Layout profissional com header e footer modernos
import './globals.css'
import { Montserrat, Playfair_Display } from 'next/font/google'
import { CartProvider } from '@/components/CartProvider'
import CartHeader from '@/components/CartHeader'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
})

export const metadata = {
  title: 'MundoPetZen | Produtos para Pets e Bem-Estar',
  description: 'Descubra produtos que promovem o bem-estar e a tranquilidade para você e seu companheiro animal.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${montserrat.variable} ${playfair.variable}`}>
      <body>
        <CartProvider>
          <header className="site-header">
            <div className="container">
              <nav className="navbar">
                <a href="/" className="logo">
                  <span>MundoPetZen</span>
                </a>
                
                <ul className="nav-menu">
                  <li>
                    <a href="/" className="nav-link">
                      Início
                    </a>
                  </li>
                  <li>
                    <a href="/saude-bem-estar" className="nav-link">
                      Saúde e Bem-Estar
                    </a>
                  </li>
                  <li>
                    <a href="/produtos-para-pets" className="nav-link">
                      Produtos para Pets
                    </a>
                  </li>
                  <li>
                    <a href="/sobre" className="nav-link">
                      Sobre Nós
                    </a>
                  </li>
                  <li>
                    <a href="/contato" className="nav-link">
                      Contato
                    </a>
                  </li>
                </ul>
                
                <div className="header-actions">
                  <div className="search-bar">
                    <span className="search-icon">🔍</span>
                    <input type="text" className="search-input" placeholder="Buscar produtos..." />
                  </div>
                  
                  <CartHeader />
                </div>
              </nav>
            </div>
          </header>
          
          <main>
            {children}
          </main>
          
          <footer className="footer">
            <div className="container">
              <div className="footer-grid">
                <div>
                  <div className="footer-logo">MundoPetZen</div>
                  <p className="footer-description">
                    Produtos selecionados para promover o bem-estar e a harmonia para você e seu pet.
                  </p>
                  <div className="social-links">
                    <a href="#" className="social-link">f</a>
                    <a href="#" className="social-link">t</a>
                    <a href="#" className="social-link">in</a>
                    <a href="#" className="social-link">ig</a>
                  </div>
                </div>
                
                <div>
                  <h3 className="footer-heading">Categorias</h3>
                  <ul className="footer-links">
                    <li className="footer-link"><a href="/saude-bem-estar">Saúde e Bem-Estar</a></li>
                    <li className="footer-link"><a href="/produtos-para-pets">Produtos para Pets</a></li>
                    <li className="footer-link"><a href="/aromaterapia">Aromaterapia</a></li>
                    <li className="footer-link"><a href="/acessorios">Acessórios</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="footer-heading">Informações</h3>
                  <ul className="footer-links">
                    <li className="footer-link"><a href="/sobre">Sobre Nós</a></li>
                    <li className="footer-link"><a href="/politica-de-privacidade">Política de Privacidade</a></li>
                    <li className="footer-link"><a href="/termos-de-uso">Termos de Uso</a></li>
                    <li className="footer-link"><a href="/faq">Perguntas Frequentes</a></li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="footer-heading">Contato</h3>
                  <ul className="footer-links">
                    <li className="footer-link">📧 contato@mundopetzen.shop</li>
                    <li className="footer-link">📱 (11) 99999-9999</li>
                    <li className="footer-link">🏠 São Paulo, SP - Brasil</li>
                  </ul>
                </div>
              </div>
              
              <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} MundoPetZen. Todos os direitos reservados.</p>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}
