// src/components/QuickViewModal.tsx - Quick View Product Modal
"use client";

import { useState } from "react";
import Link from "next/link";
import { addToCart } from "@/lib/products";
import { getReviewStats } from "@/lib/reviews";
import WishlistButton from "./WishlistButton";

interface QuickViewModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const stats = getReviewStats(product.id);

  if (!isOpen) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    alert(`${quantity} unidade(s) de ${product.name} adicionado(s) ao carrinho!`);
    window.dispatchEvent(new Event('cartUpdated'));
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-grid">
          {/* Image Gallery */}
          <div className="modal-gallery">
            <img 
              src={product.images[activeImage] || '/images/placeholder.jpg'} 
              alt={product.name}
              className="modal-main-image"
            />
            {product.images.length > 1 && (
              <div className="modal-thumbnails">
                {product.images.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    className={`modal-thumbnail ${activeImage === index ? 'active' : ''}`}
                    onClick={() => setActiveImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="modal-info">
            <div className="modal-category">
              {product.category === 'saude' ? 'Saúde e Bem-Estar' : 'Produtos para Pets'}
            </div>
            
            <h2 className="modal-title">{product.name}</h2>
            
            {stats.totalReviews > 0 && (
              <div className="modal-rating">
                <span className="stars">{'★'.repeat(Math.round(stats.averageRating))}</span>
                <span className="rating-text">
                  {stats.averageRating.toFixed(1)} ({stats.totalReviews} avaliações)
                </span>
              </div>
            )}

            <div className="modal-price-container">
              <div className="modal-price">R$ {product.price.toFixed(2)}</div>
              {product.originalPrice && (
                <>
                  <div className="modal-original-price">R$ {product.originalPrice.toFixed(2)}</div>
                  <div className="modal-discount">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                  </div>
                </>
              )}
            </div>

            <p className="modal-description">{product.description}</p>

            {product.features && product.features.length > 0 && (
              <div className="modal-features">
                <h4>Características:</h4>
                <ul>
                  {product.features.slice(0, 3).map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="modal-actions">
              <div className="quantity-selector">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="10"
                />
                <button 
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>

              <button className="btn btn-accent" onClick={handleAddToCart}>
                Adicionar ao Carrinho
              </button>

              <WishlistButton productId={product.id} size="lg" showText={true} />
            </div>

            <Link href={`/produto/${product.id}`} className="view-full-details" onClick={onClose}>
              Ver Detalhes Completos →
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 1000px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 40px;
          height: 40px;
          border: none;
          background: white;
          border-radius: 50%;
          font-size: 1.5rem;
          cursor: pointer;
          z-index: 10;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: #f7fafc;
          transform: rotate(90deg);
        }

        .modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .modal-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        .modal-gallery {
          position: sticky;
          top: 2rem;
        }

        .modal-main-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .modal-thumbnails {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
        }

        .modal-thumbnail {
          width: 80px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
          cursor: pointer;
          opacity: 0.6;
          transition: all 0.2s;
          border: 2px solid transparent;
        }

        .modal-thumbnail:hover,
        .modal-thumbnail.active {
          opacity: 1;
          border-color: #4a90a4;
        }

        .modal-category {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: #edf2f7;
          color: #4a5568;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .modal-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1rem;
          line-height: 1.2;
        }

        .modal-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .stars {
          color: #f59e0b;
          font-size: 1.1rem;
        }

        .rating-text {
          color: #718096;
          font-size: 0.9rem;
        }

        .modal-price-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .modal-price {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
        }

        .modal-original-price {
          font-size: 1.25rem;
          color: #a0aec0;
          text-decoration: line-through;
        }

        .modal-discount {
          padding: 0.5rem 1rem;
          background: #e53e3e;
          color: white;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .modal-description {
          color: #4a5568;
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }

        .modal-features {
          margin-bottom: 2rem;
        }

        .modal-features h4 {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.75rem;
        }

        .modal-features ul {
          list-style: none;
          padding: 0;
        }

        .modal-features li {
          padding: 0.5rem 0;
          color: #4a5568;
          display: flex;
          align-items: center;
        }

        .modal-features li:before {
          content: "✓";
          color: #10b981;
          font-weight: bold;
          margin-right: 0.75rem;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
        }

        .quantity-selector button {
          width: 40px;
          height: 48px;
          border: none;
          background: #f7fafc;
          cursor: pointer;
          font-size: 1.25rem;
          transition: background 0.2s;
        }

        .quantity-selector button:hover:not(:disabled) {
          background: #edf2f7;
        }

        .quantity-selector button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-selector input {
          width: 60px;
          height: 48px;
          border: none;
          text-align: center;
          font-size: 1rem;
          font-weight: 600;
        }

        .view-full-details {
          display: inline-block;
          color: #4a90a4;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s;
        }

        .view-full-details:hover {
          color: #3a7a8a;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
