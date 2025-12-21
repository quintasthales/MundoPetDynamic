// src/app/favoritos/page.tsx - Wishlist/Favorites Page
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getWishlist, removeFromWishlist } from "@/lib/wishlist";
import { getProductById, addToCart } from "@/lib/products";
import WishlistButton from "@/components/WishlistButton";

export default function FavoritosPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);

  useEffect(() => {
    setIsLoaded(true);
    loadWishlist();

    const handleWishlistUpdate = () => {
      loadWishlist();
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, []);

  const loadWishlist = () => {
    const wishlistIds = getWishlist();
    const products = wishlistIds
      .map(id => getProductById(id))
      .filter(product => product !== null);
    
    setWishlistItems(products);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    alert(`${product.name} adicionado ao carrinho!`);
    
    const event = new Event('cartUpdated');
    window.dispatchEvent(event);
  };

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
  };

  return (
    <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container">
        <section className="section">
          <h1 className="page-title">Meus Favoritos</h1>
          <p className="page-subtitle">
            {wishlistItems.length > 0 
              ? `Você tem ${wishlistItems.length} ${wishlistItems.length === 1 ? 'produto favorito' : 'produtos favoritos'}`
              : 'Você ainda não tem produtos favoritos'
            }
          </p>

          {wishlistItems.length === 0 ? (
            <div className="empty-wishlist">
              <div className="empty-icon">💝</div>
              <h2>Sua lista de favoritos está vazia</h2>
              <p>
                Explore nossos produtos e adicione seus favoritos clicando no ícone de coração!
              </p>
              <Link href="/" className="btn btn-primary">
                Explorar Produtos
              </Link>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlistItems.map((product) => (
                <div key={product.id} className="wishlist-card">
                  <div className="wishlist-card-image">
                    <Link href={`/produto/${product.id}`}>
                      <img 
                        src={product.images[0] || '/images/placeholder.jpg'} 
                        alt={product.name}
                      />
                    </Link>
                    <div className="wishlist-badge">
                      <WishlistButton productId={product.id} size="sm" />
                    </div>
                    {product.originalPrice && (
                      <div className="discount-badge">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>

                  <div className="wishlist-card-content">
                    <div className="product-category-badge">
                      {product.category === 'saude' ? 'Saúde e Bem-Estar' : 'Produtos para Pets'}
                    </div>
                    
                    <Link href={`/produto/${product.id}`}>
                      <h3 className="wishlist-card-title">{product.name}</h3>
                    </Link>
                    
                    <p className="wishlist-card-description">
                      {product.description.substring(0, 120)}...
                    </p>

                    <div className="wishlist-card-footer">
                      <div className="price-container">
                        <div className="current-price">R$ {product.price.toFixed(2)}</div>
                        {product.originalPrice && (
                          <div className="original-price">R$ {product.originalPrice.toFixed(2)}</div>
                        )}
                      </div>

                      <div className="action-buttons">
                        <button 
                          className="btn btn-accent btn-sm"
                          onClick={() => handleAddToCart(product)}
                        >
                          🛒 Adicionar
                        </button>
                        <Link 
                          href={`/produto/${product.id}`}
                          className="btn btn-secondary btn-sm"
                        >
                          Ver Detalhes
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <style jsx>{`
        .empty-wishlist {
          text-align: center;
          padding: 4rem 2rem;
          max-width: 500px;
          margin: 0 auto;
        }

        .empty-icon {
          font-size: 5rem;
          margin-bottom: 1.5rem;
        }

        .empty-wishlist h2 {
          font-size: 1.75rem;
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .empty-wishlist p {
          color: #718096;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        @media (max-width: 768px) {
          .wishlist-grid {
            grid-template-columns: 1fr;
          }
        }

        .wishlist-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .wishlist-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        }

        .wishlist-card-image {
          position: relative;
          width: 100%;
          height: 250px;
          overflow: hidden;
          background: #f7fafc;
        }

        .wishlist-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .wishlist-card:hover .wishlist-card-image img {
          transform: scale(1.05);
        }

        .wishlist-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          z-index: 10;
        }

        .discount-badge {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: #e53e3e;
          color: white;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .wishlist-card-content {
          padding: 1.5rem;
        }

        .product-category-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #edf2f7;
          color: #4a5568;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          margin-bottom: 0.75rem;
        }

        .wishlist-card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.75rem;
          line-height: 1.3;
          transition: color 0.2s;
        }

        .wishlist-card-title:hover {
          color: #4a90a4;
        }

        .wishlist-card-description {
          color: #718096;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .wishlist-card-footer {
          border-top: 1px solid #e2e8f0;
          padding-top: 1rem;
        }

        .price-container {
          margin-bottom: 1rem;
        }

        .current-price {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2d3748;
        }

        .original-price {
          font-size: 1rem;
          color: #a0aec0;
          text-decoration: line-through;
          margin-top: 0.25rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.75rem;
        }

        .action-buttons .btn {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
