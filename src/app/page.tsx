// src/app/page.tsx - Página inicial com design profissional
"use client";

import { useState, useEffect } from "react";
import { getFeaturedProducts, addToCart } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const featuredProducts = getFeaturedProducts();
  const { refreshCart } = useCart();
  
  // Função para adicionar produto ao carrinho
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate newsletter subscription
    console.log('Newsletter subscription:', newsletterEmail);
    
    // In production, this would send to an email service API
    setNewsletterStatus('success');
    setNewsletterEmail('');
    
    // Reset message after 5 seconds
    setTimeout(() => setNewsletterStatus('idle'), 5000);
  };

  const handleAddToCart = (productId: string) => {
    const product = featuredProducts.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
      refreshCart();
      
      // Disparar evento personalizado para notificar a atualização do carrinho
      const event = new Event('cartUpdated');
      window.dispatchEvent(event);
      
      // Mostrar notificação de sucesso
      alert(`${product.name} adicionado ao carrinho!`);
    }
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Hero Section */}
      <section className="hero" style={{backgroundImage: "url('/images/banners/lotus_banner.jpg')"}}>
        <div className="hero-content">
          <h1>Harmonia e Bem-Estar para Você e Seu Pet</h1>
          <p>Descubra produtos cuidadosamente selecionados que promovem equilíbrio, saúde e tranquilidade para toda a família, incluindo seus companheiros de quatro patas.</p>
          <div className="hero-buttons">
            <a href="/saude-bem-estar" className="btn btn-primary btn-lg">
              Produtos para Bem-Estar
            </a>
            <a href="/produtos-para-pets" className="btn btn-outline btn-lg">
              Produtos para Pets
            </a>
          </div>
        </div>
      </section>

      {/* Categorias em Destaque */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Nossas Categorias</h2>
          <p className="section-subtitle">Explore nossa seleção de produtos para promover o bem-estar e a harmonia para você e seu pet.</p>
          
          <div className="categories">
            <div className="category-card">
              <div className="category-image" style={{backgroundImage: "url('/images/products/aromaterapia.jpg')"}}></div>
              <div className="category-content">
                <h3 className="category-title">Aromaterapia e Relaxamento</h3>
                <p className="category-description">Óleos essenciais, difusores e produtos para criar um ambiente tranquilo e harmonioso.</p>
                <a href="/saude-bem-estar#aromaterapia" className="btn btn-primary btn-sm">Explorar</a>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-image" style={{backgroundImage: "url('/images/categories/saude_bem_estar.jpg')"}}></div>
              <div className="category-content">
                <h3 className="category-title">Fitness e Meditação</h3>
                <p className="category-description">Acessórios para prática de yoga, meditação e exercícios leves em casa.</p>
                <a href="/saude-bem-estar#fitness" className="btn btn-primary btn-sm">Explorar</a>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-image" style={{backgroundImage: "url('/images/products/pet_brinquedo.jpg')"}}></div>
              <div className="category-content">
                <h3 className="category-title">Brinquedos para Pets</h3>
                <p className="category-description">Brinquedos interativos e enriquecimento ambiental para o bem-estar do seu pet.</p>
                <a href="/produtos-para-pets#brinquedos" className="btn btn-primary btn-sm">Explorar</a>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-image" style={{backgroundImage: "url('/images/categories/produtos_para_pets.jpg')"}}></div>
              <div className="category-content">
                <h3 className="category-title">Conforto e Descanso</h3>
                <p className="category-description">Camas, almofadas e acessórios para o conforto e bem-estar do seu pet.</p>
                <a href="/produtos-para-pets#conforto" className="btn btn-primary btn-sm">Explorar</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="section" style={{backgroundImage: "url('/images/banners/zen_stones_banner.jpg')", backgroundAttachment: "fixed", backgroundPosition: "center", backgroundSize: "cover"}}>
        <div className="container">
          <h2 className="section-title text-white">Produtos em Destaque</h2>
          <p className="section-subtitle text-white">Conheça nossos produtos mais populares, selecionados com carinho para você e seu pet.</p>
          
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image" style={{backgroundImage: `url('${product.images[0] || '/images/products/aromaterapia.jpg'}')`}}>
                  {product.featured && <span className="product-badge">Destaque</span>}
                </div>
                <div className="product-content">
                  <div className="product-category">{product.category === 'saude' ? 'Saúde e Bem-Estar' : 'Produtos para Pets'}</div>
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.description.substring(0, 100)}...</p>
                  <div className="product-footer">
                    <div className="product-price">R$ {product.price.toFixed(2)}</div>
                    <div className="product-actions">
                      <a href={`/produto/${product.id}`} className="btn btn-secondary btn-sm">Ver</a>
                      <button 
                        className="btn btn-accent btn-sm"
                        onClick={() => handleAddToCart(product.id)}
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <a href="/produtos" className="btn btn-primary">Ver Todos os Produtos</a>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Por Que Escolher MundoPetZen?</h2>
          
          <div className="features">
            <div className="feature">
              <div className="feature-icon">🌿</div>
              <h3 className="feature-title">Produtos Naturais</h3>
              <p className="feature-description">Selecionamos produtos com ingredientes naturais, seguros para você e seu pet.</p>
            </div>
            
            <div className="feature">
              <div className="feature-icon">🚚</div>
              <h3 className="feature-title">Entrega Rápida</h3>
              <p className="feature-description">Enviamos seu pedido com agilidade para todo o Brasil.</p>
            </div>
            
            <div className="feature">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Preço Justo</h3>
              <p className="feature-description">Oferecemos produtos de qualidade com preços acessíveis.</p>
            </div>
            
            <div className="feature">
              <div className="feature-icon">❤️</div>
              <h3 className="feature-title">Atendimento Humanizado</h3>
              <p className="feature-description">Estamos sempre prontos para ajudar você e seu pet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">O Que Nossos Clientes Dizem</h2>
          
          <div className="testimonials">
            <div className="testimonial-grid">
              <div className="testimonial">
                <p className="testimonial-content">Os produtos de aromaterapia são incríveis! Minha casa está sempre com um aroma agradável e meu gato também parece mais tranquilo.</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{backgroundColor: "#f0f0f0"}}>👩</div>
                  <div className="testimonial-info">
                    <h4>Ana Silva</h4>
                    <p>São Paulo, SP</p>
                  </div>
                </div>
              </div>
              
              <div className="testimonial">
                <p className="testimonial-content">A cama ortopédica para meu cachorro idoso fez toda a diferença. Ele dorme muito melhor e parece ter menos dores nas articulações.</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{backgroundColor: "#f0f0f0"}}>👨</div>
                  <div className="testimonial-info">
                    <h4>Carlos Oliveira</h4>
                    <p>Rio de Janeiro, RJ</p>
                  </div>
                </div>
              </div>
              
              <div className="testimonial">
                <p className="testimonial-content">Os brinquedos interativos mantêm meu pet entretido por horas! A qualidade é excelente e o preço é justo.</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{backgroundColor: "#f0f0f0"}}>👩</div>
                  <div className="testimonial-info">
                    <h4>Mariana Costa</h4>
                    <p>Belo Horizonte, MG</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section">
        <div className="container">
          <div className="newsletter">
            <h2>Fique por dentro das novidades</h2>
            <p>Cadastre-se para receber ofertas exclusivas, dicas de bem-estar e novidades sobre nossos produtos.</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                className="newsletter-input" 
                placeholder="Seu melhor e-mail" 
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" className="newsletter-button">Inscrever-se</button>
            </form>
            {newsletterStatus === 'success' && (
              <p className="newsletter-message success">✓ Obrigado! Você foi inscrito com sucesso.</p>
            )}
            {newsletterStatus === 'error' && (
              <p className="newsletter-message error">✗ Erro ao inscrever. Tente novamente.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
