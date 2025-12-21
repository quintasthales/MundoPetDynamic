// src/components/ProductReviews.tsx - Product Reviews Display Component
"use client";

import { useState, useEffect } from "react";
import { getAllReviews, getReviewStats, addReview, markReviewHelpful, type Review } from "@/lib/reviews";

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0, ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  
  // Form state
  const [formData, setFormData] = useState({
    userName: '',
    rating: 5,
    title: '',
    comment: '',
  });

  useEffect(() => {
    loadReviews();
  }, [productId, sortBy]);

  const loadReviews = () => {
    let loadedReviews = getAllReviews(productId);
    
    // Sort reviews
    if (sortBy === 'helpful') {
      loadedReviews = loadedReviews.sort((a, b) => b.helpful - a.helpful);
    } else if (sortBy === 'rating') {
      loadedReviews = loadedReviews.sort((a, b) => b.rating - a.rating);
    }
    
    setReviews(loadedReviews);
    setStats(getReviewStats(productId));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newReview = addReview({
      productId,
      userId: `user-${Date.now()}`,
      userName: formData.userName,
      rating: formData.rating,
      title: formData.title,
      comment: formData.comment,
      verified: false,
    });
    
    setReviews([newReview, ...reviews]);
    setStats(getReviewStats(productId));
    setShowReviewForm(false);
    setFormData({ userName: '', rating: 5, title: '', comment: '' });
  };

  const handleHelpful = (reviewId: string) => {
    markReviewHelpful(reviewId);
    loadReviews();
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizes = { sm: '14px', md: '18px', lg: '24px' };
    return (
      <div className="stars" style={{ fontSize: sizes[size] }}>
        {[1, 2, 3, 4, 5].map(star => (
          <span key={star} className={star <= rating ? 'star filled' : 'star'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  const renderRatingBar = (rating: number) => {
    const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
    const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
    
    return (
      <div className="rating-bar-row">
        <span className="rating-label">{rating} ★</span>
        <div className="rating-bar">
          <div className="rating-bar-fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <span className="rating-count">{count}</span>
      </div>
    );
  };

  return (
    <div className="product-reviews">
      {/* Reviews Summary */}
      <div className="reviews-summary">
        <div className="summary-left">
          <div className="average-rating-display">
            <div className="average-number">{stats.averageRating.toFixed(1)}</div>
            {renderStars(Math.round(stats.averageRating), 'lg')}
            <div className="total-reviews">{stats.totalReviews} avaliações</div>
          </div>
        </div>
        
        <div className="summary-right">
          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map(rating => renderRatingBar(rating))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="reviews-actions">
        <button 
          className="btn btn-primary"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          {showReviewForm ? 'Cancelar' : 'Escrever Avaliação'}
        </button>
        
        <select 
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="recent">Mais Recentes</option>
          <option value="helpful">Mais Úteis</option>
          <option value="rating">Maior Avaliação</option>
        </select>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <h3>Escreva sua Avaliação</h3>
          
          <div className="form-group">
            <label>Seu Nome *</label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              required
              placeholder="Digite seu nome"
            />
          </div>

          <div className="form-group">
            <label>Avaliação *</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`star-button ${star <= formData.rating ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, rating: star })}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Resuma sua experiência"
            />
          </div>

          <div className="form-group">
            <label>Comentário *</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              required
              rows={5}
              placeholder="Conte-nos mais sobre sua experiência com o produto"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Publicar Avaliação
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <div className="no-reviews">
            <p>Seja o primeiro a avaliar este produto!</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="review-author">
                  <div className="author-avatar">{review.userName[0].toUpperCase()}</div>
                  <div>
                    <div className="author-name">
                      {review.userName}
                      {review.verified && <span className="verified-badge">✓ Compra Verificada</span>}
                    </div>
                    <div className="review-date">{new Date(review.createdAt).toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>
                {renderStars(review.rating, 'sm')}
              </div>
              
              <h4 className="review-title">{review.title}</h4>
              <p className="review-comment">{review.comment}</p>
              
              <div className="review-footer">
                <button 
                  className="helpful-button"
                  onClick={() => handleHelpful(review.id)}
                >
                  👍 Útil ({review.helpful})
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .product-reviews {
          margin-top: 3rem;
        }

        .reviews-summary {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 3rem;
          padding: 2rem;
          background: #f9fafb;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .reviews-summary {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }

        .average-rating-display {
          text-align: center;
        }

        .average-number {
          font-size: 4rem;
          font-weight: 700;
          color: #2d3748;
          line-height: 1;
        }

        .total-reviews {
          margin-top: 0.5rem;
          color: #718096;
        }

        .rating-bar-row {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .rating-label {
          width: 40px;
          font-size: 0.9rem;
          color: #4a5568;
        }

        .rating-bar {
          flex: 1;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .rating-bar-fill {
          height: 100%;
          background: #f59e0b;
          transition: width 0.3s;
        }

        .rating-count {
          width: 30px;
          text-align: right;
          font-size: 0.9rem;
          color: #718096;
        }

        .reviews-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .sort-select {
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
        }

        .review-form {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }

        .review-form h3 {
          margin-bottom: 1.5rem;
          color: #2d3748;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #2d3748;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
        }

        .rating-input {
          display: flex;
          gap: 0.5rem;
        }

        .star-button {
          font-size: 2rem;
          background: none;
          border: none;
          color: #e2e8f0;
          cursor: pointer;
          transition: color 0.2s;
        }

        .star-button.active,
        .star-button:hover {
          color: #f59e0b;
        }

        .reviews-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .no-reviews {
          text-align: center;
          padding: 3rem;
          color: #718096;
        }

        .review-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .review-author {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .author-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #4a90a4;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .author-name {
          font-weight: 600;
          color: #2d3748;
        }

        .verified-badge {
          margin-left: 0.5rem;
          font-size: 0.75rem;
          color: #10b981;
          font-weight: 500;
        }

        .review-date {
          font-size: 0.875rem;
          color: #718096;
        }

        .stars {
          display: flex;
          gap: 2px;
        }

        .star {
          color: #e2e8f0;
        }

        .star.filled {
          color: #f59e0b;
        }

        .review-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .review-comment {
          color: #4a5568;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .review-footer {
          display: flex;
          gap: 1rem;
        }

        .helpful-button {
          padding: 0.5rem 1rem;
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .helpful-button:hover {
          background: #edf2f7;
          border-color: #cbd5e0;
        }
      `}</style>
    </div>
  );
}
