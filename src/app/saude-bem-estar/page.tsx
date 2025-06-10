"use client";

import { useState, useEffect } from "react";
import { healthProducts, addToCart } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

export default function SaudeBemEstarPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "" });
  const { refreshCart } = useCart();

  useEffect(() => {
    setIsLoaded(true);
    
    // Verificar se há um hash na URL e rolar para a seção correspondente
    if (typeof window !== 'undefined' && window.location.hash) {
      const targetId = window.location.hash.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }
  }, []);

  // Função para esconder a notificação após alguns segundos
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  const handleAddToCart = (productId: string) => {
    const product = healthProducts.find(p => p.id === productId);
    if (product) {
      addToCart(product, 1);
      
      // Atualizar o contador global do carrinho
      refreshCart();
      
      // Mostrar notificação não intrusiva
      setNotification({
        show: true,
        message: `${product.name} adicionado ao carrinho!`
      });
      
      // Disparar evento personalizado para atualizar o carrinho em outras páginas
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cartUpdated'));
      }
    }
  };

  return (
    <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Notificação flutuante */}
      {notification.show && (
        <div className="notification-toast">
          <div className="notification-content">
            <span>✅</span>
            <p>{notification.message}</p>
          </div>
        </div>
      )}
      
      <div className="container">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <a href="/" className="breadcrumb-item">Início</a>
          <span className="breadcrumb-item">Saúde e Bem-Estar</span>
        </div>
        
        {/* Hero da categoria */}
        <div className="hero" style={{backgroundImage: "linear-gradient(to right, rgba(58, 125, 68, 0.8), rgba(74, 144, 167, 0.8)), url('/images/categories/saude_bem_estar.jpg')"}}>
          <div className="hero-content">
            <h1>Saúde e Bem-Estar</h1>
            <p>Produtos naturais para cuidar da sua saúde física e mental, promovendo equilíbrio e tranquilidade no seu dia a dia.</p>
          </div>
        </div>
        
        {/* Subcategorias */}
        <section className="section">
          <h2 className="section-title">Categorias</h2>
          
          <div className="categories">
            <div className="category-card">
              <div className="category-image" style={{backgroundImage: "url('/images/products/aromaterapia.jpg')"}}></div>
              <div className="category-content">
                <h3 className="category-title">Aromaterapia</h3>
                <p className="category-description">Óleos essenciais, difusores e produtos para criar um ambiente tranquilo.</p>
                <a href="#aromaterapia" className="btn btn-primary btn-sm">Explorar</a>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-image" style={{backgroundImage: "url('/images/categories/saude_bem_estar.jpg')"}}></div>
              <div className="category-content">
                <h3 className="category-title">Fitness e Yoga</h3>
                <p className="category-description">Acessórios para prática de yoga, meditação e exercícios leves.</p>
                <a href="#fitness" className="btn btn-primary btn-sm">Explorar</a>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-image" style={{backgroundImage: "url('/images/banners/zen_stones_banner.jpg')"}}></div>
              <div className="category-content">
                <h3 className="category-title">Meditação</h3>
                <p className="category-description">Produtos para auxiliar na prática da meditação e mindfulness.</p>
                <a href="#meditacao" className="btn btn-primary btn-sm">Explorar</a>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-image" style={{backgroundImage: "url('/images/banners/lotus_banner.jpg')"}}></div>
              <div className="category-content">
                <h3 className="category-title">Home Office</h3>
                <p className="category-description">Acessórios ergonômicos para melhorar seu ambiente de trabalho.</p>
                <a href="#home-office" className="btn btn-primary btn-sm">Explorar</a>
              </div>
            </div>
          </div>
        </section>
        
        {/* Lista de produtos por categoria */}
        <section className="section" id="aromaterapia">
          <h2 className="section-title">Aromaterapia</h2>
          <p className="section-subtitle">Produtos para criar um ambiente relaxante e harmonioso em sua casa.</p>
          
          <div className="products-grid">
            {healthProducts
              .filter(product => product.subcategory === 'aromaterapia')
              .map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image" style={{backgroundImage: `url('${product.images[0] || '/images/products/aromaterapia.jpg'}')`}}>
                    {product.featured && <span className="product-badge">Destaque</span>}
                  </div>
                  <div className="product-content">
                    <div className="product-category">Aromaterapia</div>
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-description">{product.description.substring(0, 100)}...</p>
                    <div className="product-footer">
                      <div className="product-price">R$ {product.price.toFixed(2)}</div>
                      <div className="product-actions">
                        <a href={`/produto/${product.id}`} className="btn btn-secondary btn-sm">Ver</a>
                        <button 
                          onClick={() => handleAddToCart(product.id)}
                          className="btn btn-accent btn-sm"
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
        
        <section className="section" id="fitness">
          <h2 className="section-title">Fitness e Yoga</h2>
          <p className="section-subtitle">Acessórios para prática de yoga, meditação e exercícios leves em casa.</p>
          
          <div className="products-grid">
            {healthProducts
              .filter(product => product.subcategory === 'fitness')
              .map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image" style={{backgroundImage: `url('${product.images[0] || '/images/products/fitness.jpg'}')`}}>
                    {product.featured && <span className="product-badge">Destaque</span>}
                  </div>
                  <div className="product-content">
                    <div className="product-category">Fitness e Yoga</div>
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-description">{product.description.substring(0, 100)}...</p>
                    <div className="product-footer">
                      <div className="product-price">R$ {product.price.toFixed(2)}</div>
                      <div className="product-actions">
                        <a href={`/produto/${product.id}`} className="btn btn-secondary btn-sm">Ver</a>
                        <button 
                          onClick={() => handleAddToCart(product.id)}
                          className="btn btn-accent btn-sm"
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
        
        <section className="section" id="meditacao">
          <h2 className="section-title">Meditação</h2>
          <p className="section-subtitle">Produtos para auxiliar na prática da meditação e mindfulness.</p>
          
          <div className="products-grid">
            {healthProducts
              .filter(product => product.subcategory === 'meditacao')
              .map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image" style={{backgroundImage: `url('${product.images[0] || '/images/products/meditacao.jpg'}')`}}>
                    {product.featured && <span className="product-badge">Destaque</span>}
                  </div>
                  <div className="product-content">
                    <div className="product-category">Meditação</div>
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-description">{product.description.substring(0, 100)}...</p>
                    <div className="product-footer">
                      <div className="product-price">R$ {product.price.toFixed(2)}</div>
                      <div className="product-actions">
                        <a href={`/produto/${product.id}`} className="btn btn-secondary btn-sm">Ver</a>
                        <button 
                          onClick={() => handleAddToCart(product.id)}
                          className="btn btn-accent btn-sm"
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
        
        <section className="section" id="home-office">
          <h2 className="section-title">Home Office</h2>
          <p className="section-subtitle">Acessórios ergonômicos para melhorar seu ambiente de trabalho.</p>
          
          <div className="products-grid">
            {healthProducts
              .filter(product => product.subcategory === 'home-office')
              .map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image" style={{backgroundImage: `url('${product.images[0] || '/images/products/home-office.jpg'}')`}}>
                    {product.featured && <span className="product-badge">Destaque</span>}
                  </div>
                  <div className="product-content">
                    <div className="product-category">Home Office</div>
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-description">{product.description.substring(0, 100)}...</p>
                    <div className="product-footer">
                      <div className="product-price">R$ {product.price.toFixed(2)}</div>
                      <div className="product-actions">
                        <a href={`/produto/${product.id}`} className="btn btn-secondary btn-sm">Ver</a>
                        <button 
                          onClick={() => handleAddToCart(product.id)}
                          className="btn btn-accent btn-sm"
                        >
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
        
        {/* Seção informativa */}
        <section className="section">
          <div className="newsletter">
            <h2>Por que escolher produtos naturais?</h2>
            <p>Produtos naturais são desenvolvidos com ingredientes provenientes da natureza, minimamente processados e livres de químicos sintéticos. Eles são mais gentis com o seu corpo e com o meio ambiente.</p>
            <p>No MundoPetZen, selecionamos cuidadosamente produtos que promovem bem-estar e equilíbrio, respeitando os princípios da sustentabilidade e do consumo consciente.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
