"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { petProducts, addToCart } from "@/lib/products";
import { useCart } from "@/components/CartProvider";

export default function ProdutosParaPetsPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "" });
  const { refreshCart } = useCart();

  useEffect(() => {
    setIsLoaded(true);
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
    const product = petProducts.find(p => p.id === productId);
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
          <Link href="/" className="breadcrumb-item">Início</Link>
          <span className="breadcrumb-item">Produtos para Pets</span>
        </div>
        
        {/* Hero da categoria */}
        <div className="hero" style={{backgroundImage: "linear-gradient(to right, rgba(58, 125, 68, 0.8), rgba(74, 144, 167, 0.8)), url('/images/categories/produtos_para_pets.jpg')"}}>
          <div className="hero-content">
            <h1>Produtos para Pets</h1>
            <p>Descubra produtos de qualidade para o bem-estar, conforto e diversão do seu companheiro de quatro patas.</p>
          </div>
        </div>
        
        {/* Subcategorias */}
        <section className="section">
          <h2 className="section-title">Categorias</h2>
          
          <div className="categories">
            <div className="category-card">
              <div className="category-image" style={{backgroundImage: "url('/images/products/pet_brinquedo.jpg')"}}></div>
              <div className="category-content">
                <h3 className="category-title">Brinquedos</h3>
                <p className="category-description">Brinquedos interativos e enriquecimento ambiental para o bem-estar do seu pet.</p>
                <Link href="#brinquedos" className="btn btn-primary btn-sm">Explorar</Link>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-image" style={{backgroundImage: "url('/images/categories/produtos_para_pets.jpg')"}}></div>
              <div className="category-content">
                <h3 className="category-title">Acessórios</h3>
                <p className="category-description">Coleiras, guias, comedouros e outros acessórios essenciais.</p>
                <Link href="#acessorios" className="btn btn-primary btn-sm">Explorar</Link>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-image" style={{backgroundImage: "url('/images/products/aromaterapia.jpg')"}}></div>
              <div className="category-content">
                <h3 className="category-title">Higiene e Cuidados</h3>
                <p className="category-description">Produtos naturais para a higiene e cuidados com seu pet.</p>
                <Link href="#higiene" className="btn btn-primary btn-sm">Explorar</Link>
              </div>
            </div>
            
            <div className="category-card">
              <div className="category-image" style={{backgroundImage: "url('/images/banners/zen_stones_banner.jpg')"}}></div>
              <div className="category-content">
                <h3 className="category-title">Conforto e Descanso</h3>
                <p className="category-description">Camas, almofadas e acessórios para o conforto do seu pet.</p>
                <Link href="#conforto" className="btn btn-primary btn-sm">Explorar</Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Lista de produtos */}
        <section className="section" id="produtos">
          <h2 className="section-title">Nossos Produtos</h2>
          <p className="section-subtitle">Produtos cuidadosamente selecionados para o bem-estar e felicidade do seu pet.</p>
          
          <div className="products-grid">
            {petProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image" style={{backgroundImage: `url('${product.images[0] || '/images/products/pet_brinquedo.jpg'}')`}}>
                  {product.featured && <span className="product-badge">Destaque</span>}
                </div>
                <div className="product-content">
                  <div className="product-category">Produtos para Pets</div>
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.description.substring(0, 100)}...</p>
                  <div className="product-footer">
                    <div className="product-price">R$ {product.price.toFixed(2)}</div>
                    <div className="product-actions">
                      <Link href={`/produto/${product.id}`} className="btn btn-secondary btn-sm">Ver</Link>
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
            <h2>A importância do bem-estar animal</h2>
            <p>Assim como nós, os pets precisam de cuidados especiais para manter sua saúde física e mental. Brinquedos interativos, acessórios confortáveis e produtos de higiene adequados são essenciais para garantir a qualidade de vida do seu companheiro.</p>
            <p>No MundoPetZen, selecionamos produtos que promovem o bem-estar animal, respeitando suas necessidades naturais e contribuindo para uma convivência harmoniosa entre você e seu pet.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
