// src/app/produto/[id]/page.tsx - Página de detalhes do produto com design profissional
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProductById, addToCart } from "@/lib/products";
import ProductReviews from "@/components/ProductReviews";
import WishlistButton from "@/components/WishlistButton";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = getProductById(productId);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!product) {
    return (
      <div className="container">
        <div className="section">
          <h1>Produto não encontrado</h1>
          <p>O produto que você está procurando não existe ou foi removido.</p>
          <Link href="/" className="btn btn-primary">Voltar para a página inicial</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!product) {
      console.error("Product is undefined when adding to cart.");
      return;
    }
    addToCart(product, quantity);
    alert(`${quantity} unidade(s) de ${product.name} adicionado(s) ao carrinho!`);
  };
  const handleQuantityChange = (value: number) => {
    const newQuantity = quantity + value;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container">
        {/* Breadcrumbs */}
        <div className="breadcrumbs">
          <Link href="/" className="breadcrumb-item">Início</Link>
          <Link href={product.category === 'saude' ? '/saude-bem-estar' : '/produtos-para-pets'} className="breadcrumb-item">
            {product.category === 'saude' ? 'Saúde e Bem-Estar' : 'Produtos para Pets'}
          </Link>
          <span className="breadcrumb-item">{product.name}</span>
        </div>
        
        {/* Detalhes do produto */}
        <div className="product-page">
          <div className="product-detail">
            <div className="product-gallery">
              <img 
                src={product.images[activeImage] || '/images/placeholder.jpg'} 
                alt={product.name} 
                className="product-main-image"
              />
              
              {product.images.length > 1 && (
                <div className="product-thumbnails">
                  {product.images.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`${product.name} - imagem ${index + 1}`} 
                      className={`product-thumbnail ${activeImage === index ? 'active' : ''}`}
                      onClick={() => setActiveImage(index)}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="product-info">
              <h1>{product.name}</h1>
              
              <div className="product-meta">
                <div className="product-rating">
                  ★★★★★ 
                </div>
                <div className="product-reviews">
                  (12 avaliações)
                </div>
              </div>
              
              <div className="product-price-container">
                <span className="product-price">R$ {product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <>
                    <span className="product-original-price">R$ {product.originalPrice.toFixed(2)}</span>
                    <span className="product-discount">
                      {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              
              <div className="product-description">
                <p>{product.description}</p>
              </div>
              
              {product.features && (
                <div className="product-features">
                  <h3>Características</h3>
                  <ul>
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="product-actions">
                <WishlistButton productId={productId} size="lg" showText={true} />
                
                <div className="quantity-selector">
                  <button 
                    className="quantity-btn" 
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    className="quantity-input" 
                    value={quantity} 
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    min="1"
                    max="10"
                  />
                  <button 
                    className="quantity-btn" 
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                  >
                    +
                  </button>
                </div>
                
                <button 
                  className="btn btn-accent add-to-cart-btn"
                  onClick={handleAddToCart}
                >
                  Adicionar ao Carrinho
                </button>
              </div>
              
              <div className="product-meta-info">
                <div className="meta-item">
                  <div className="meta-icon">🚚</div>
                  <div className="meta-text">
                    <h4>Entrega Rápida</h4>
                    <p>2-5 dias úteis</p>
                  </div>
                </div>
                
                <div className="meta-item">
                  <div className="meta-icon">💰</div>
                  <div className="meta-text">
                    <h4>Pagamento Seguro</h4>
                    <p>Diversas formas de pagamento</p>
                  </div>
                </div>
                
                <div className="meta-item">
                  <div className="meta-icon">🔄</div>
                  <div className="meta-text">
                    <h4>Garantia de Satisfação</h4>
                    <p>7 dias para devolução</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Reviews */}
          <section className="section">
            <h2 className="section-title">Avaliações dos Clientes</h2>
            <ProductReviews productId={productId} />
          </section>

          {/* Produtos relacionados */}
          <section className="section">
            <h2 className="section-title">Produtos Relacionados</h2>
            
            <div className="products-grid">
              {/* Exibir 4 produtos relacionados da mesma categoria */}
              {product.relatedProducts && product.relatedProducts.slice(0, 4).map((relatedProduct) => (
                <div key={relatedProduct.id} className="product-card">
                  <div className="product-image" style={{backgroundImage: `url('${relatedProduct.images[0] || '/images/placeholder.jpg'}')`}}>
                    {relatedProduct.featured && <span className="product-badge">Destaque</span>}
                  </div>
                  <div className="product-content">
                    <div className="product-category">
                      {relatedProduct.category === 'saude' ? 'Saúde e Bem-Estar' : 'Produtos para Pets'}
                    </div>
                    <h3 className="product-title">{relatedProduct.name}</h3>
                    <p className="product-description">{relatedProduct.description.substring(0, 100)}...</p>
                    <div className="product-footer">
                      <div className="product-price">R$ {relatedProduct.price.toFixed(2)}</div>
                      <div className="product-actions">
                        <Link href={`/produto/${relatedProduct.id}`} className="btn btn-secondary btn-sm">Ver</Link>
                        <button className="btn btn-accent btn-sm">Comprar</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
