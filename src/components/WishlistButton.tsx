// src/components/WishlistButton.tsx - Wishlist Toggle Button
"use client";

import { useState, useEffect } from "react";
import { isInWishlist, toggleWishlist } from "@/lib/wishlist";

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function WishlistButton({ productId, size = 'md', showText = false }: WishlistButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsFavorite(isInWishlist(productId));

    const handleWishlistUpdate = () => {
      setIsFavorite(isInWishlist(productId));
    };

    window.addEventListener('wishlistUpdated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlistUpdated', handleWishlistUpdate);
  }, [productId]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = toggleWishlist(productId);
    setIsFavorite(newState);
    setIsAnimating(true);
    
    setTimeout(() => setIsAnimating(false), 600);
  };

  const sizes = {
    sm: { button: '32px', icon: '16px', text: '0.75rem' },
    md: { button: '40px', icon: '20px', text: '0.875rem' },
    lg: { button: '48px', icon: '24px', text: '1rem' },
  };

  return (
    <button
      className={`wishlist-button ${isFavorite ? 'active' : ''} ${isAnimating ? 'animating' : ''} ${showText ? 'with-text' : ''}`}
      onClick={handleClick}
      aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
    >
      <span className="heart-icon">{isFavorite ? '❤️' : '🤍'}</span>
      {showText && <span className="wishlist-text">{isFavorite ? 'Favoritado' : 'Favoritar'}</span>}

      <style jsx>{`
        .wishlist-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: ${showText ? 'auto' : sizes[size].button};
          height: ${sizes[size].button};
          padding: ${showText ? '0.5rem 1rem' : '0'};
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: ${showText ? '8px' : '50%'};
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .wishlist-button:hover {
          border-color: #fc8181;
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(252, 129, 129, 0.2);
        }

        .wishlist-button.active {
          border-color: #fc8181;
          background: #fff5f5;
        }

        .wishlist-button.animating {
          animation: heartBeat 0.6s ease;
        }

        .heart-icon {
          font-size: ${sizes[size].icon};
          line-height: 1;
          transition: transform 0.3s ease;
        }

        .wishlist-button:hover .heart-icon {
          transform: scale(1.2);
        }

        .wishlist-text {
          font-size: ${sizes[size].text};
          font-weight: 500;
          color: #4a5568;
          white-space: nowrap;
        }

        .wishlist-button.active .wishlist-text {
          color: #e53e3e;
        }

        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(1.1); }
          75% { transform: scale(1.2); }
        }
      `}</style>
    </button>
  );
}
