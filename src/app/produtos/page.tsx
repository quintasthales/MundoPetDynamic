// src/app/produtos/page.tsx - All Products with Filtering and Sorting
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllProducts, addToCart } from "@/lib/products";
import { getReviewStats } from "@/lib/reviews";
import WishlistButton from "@/components/WishlistButton";

export default function ProdutosPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [products, setProducts] = useState(getAllProducts());
  const [filteredProducts, setFilteredProducts] = useState(getAllProducts());
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [minRating, setMinRating] = useState<number>(0);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCategory, selectedSubcategory, priceRange, sortBy, minRating]);

  const applyFilters = () => {
    let filtered = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Subcategory filter
    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(p => p.subcategory === selectedSubcategory);
    }

    // Price range filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(p => {
        const stats = getReviewStats(p.id);
        return stats.averageRating >= minRating;
      });
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'rating':
        filtered.sort((a, b) => {
          const statsA = getReviewStats(a.id);
          const statsB = getReviewStats(b.id);
          return statsB.averageRating - statsA.averageRating;
        });
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    alert(`${product.name} adicionado ao carrinho!`);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setPriceRange([0, 500]);
    setSortBy('featured');
    setMinRating(0);
  };

  const categories = [
    { id: 'all', name: 'Todas as Categorias' },
    { id: 'saude', name: 'Saúde e Bem-Estar' },
    { id: 'pets', name: 'Produtos para Pets' },
  ];

  const subcategories = [
    { id: 'all', name: 'Todas as Subcategorias' },
    { id: 'aromaterapia', name: 'Aromaterapia' },
    { id: 'yoga', name: 'Yoga e Meditação' },
    { id: 'home-office', name: 'Home Office' },
    { id: 'brinquedos', name: 'Brinquedos' },
    { id: 'conforto', name: 'Conforto' },
    { id: 'higiene', name: 'Higiene' },
    { id: 'alimentacao', name: 'Alimentação' },
  ];

  return (
    <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container">
        <section className="section">
          <h1 className="page-title">Todos os Produtos</h1>
          <p className="page-subtitle">
            Explore nossa coleção completa de {filteredProducts.length} produtos
          </p>

          <div className="catalog-layout">
            {/* Filters Sidebar */}
            <aside className="filters-sidebar">
              <div className="filters-header">
                <h3>Filtros</h3>
                <button className="reset-filters-btn" onClick={resetFilters}>
                  Limpar
                </button>
              </div>

              {/* Category Filter */}
              <div className="filter-group">
                <h4>Categoria</h4>
                {categories.map(cat => (
                  <label key={cat.id} className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      value={cat.id}
                      checked={selectedCategory === cat.id}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>

              {/* Subcategory Filter */}
              <div className="filter-group">
                <h4>Subcategoria</h4>
                {subcategories.map(sub => (
                  <label key={sub.id} className="filter-option">
                    <input
                      type="radio"
                      name="subcategory"
                      value={sub.id}
                      checked={selectedSubcategory === sub.id}
                      onChange={(e) => setSelectedSubcategory(e.target.value)}
                    />
                    <span>{sub.name}</span>
                  </label>
                ))}
              </div>

              {/* Price Range Filter */}
              <div className="filter-group">
                <h4>Faixa de Preço</h4>
                <div className="price-range-display">
                  R$ {priceRange[0]} - R$ {priceRange[1]}
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="price-slider"
                />
              </div>

              {/* Rating Filter */}
              <div className="filter-group">
                <h4>Avaliação Mínima</h4>
                {[4, 3, 2, 1, 0].map(rating => (
                  <label key={rating} className="filter-option">
                    <input
                      type="radio"
                      name="rating"
                      value={rating}
                      checked={minRating === rating}
                      onChange={(e) => setMinRating(parseInt(e.target.value))}
                    />
                    <span>
                      {rating > 0 ? `${rating}+ ★` : 'Todas'}
                    </span>
                  </label>
                ))}
              </div>
            </aside>

            {/* Products Grid */}
            <div className="products-section">
              {/* Sort Controls */}
              <div className="sort-controls">
                <div className="results-count">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
                </div>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Destaques</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="name">Nome (A-Z)</option>
                  <option value="rating">Melhor Avaliação</option>
                </select>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="no-products">
                  <div className="no-products-icon">🔍</div>
                  <h3>Nenhum produto encontrado</h3>
                  <p>Tente ajustar os filtros para ver mais resultados.</p>
                  <button className="btn btn-primary" onClick={resetFilters}>
                    Limpar Filtros
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {filteredProducts.map((product) => {
                    const stats = getReviewStats(product.id);
                    return (
                      <div key={product.id} className="product-card">
                        <div className="product-image" style={{backgroundImage: `url('${product.images[0] || '/images/placeholder.jpg'}')`}}>
                          {product.featured && <span className="product-badge">Destaque</span>}
                          {product.originalPrice && (
                            <span className="discount-badge">
                              {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                            </span>
                          )}
                          <div className="wishlist-button-container">
                            <WishlistButton productId={product.id} size="sm" />
                          </div>
                        </div>
                        <div className="product-content">
                          <div className="product-category">
                            {product.category === 'saude' ? 'Saúde e Bem-Estar' : 'Produtos para Pets'}
                          </div>
                          <h3 className="product-title">
                            <Link href={`/produto/${product.id}`}>{product.name}</Link>
                          </h3>
                          <p className="product-description">
                            {product.description.substring(0, 100)}...
                          </p>
                          {stats.totalReviews > 0 && (
                            <div className="product-rating">
                              <span className="stars">{'★'.repeat(Math.round(stats.averageRating))}</span>
                              <span className="rating-text">
                                {stats.averageRating.toFixed(1)} ({stats.totalReviews})
                              </span>
                            </div>
                          )}
                          <div className="product-footer">
                            <div className="product-price-container">
                              <div className="product-price">R$ {product.price.toFixed(2)}</div>
                              {product.originalPrice && (
                                <div className="product-original-price">
                                  R$ {product.originalPrice.toFixed(2)}
                                </div>
                              )}
                            </div>
                            <div className="product-actions">
                              <Link href={`/produto/${product.id}`} className="btn btn-secondary btn-sm">
                                Ver
                              </Link>
                              <button 
                                className="btn btn-accent btn-sm"
                                onClick={() => handleAddToCart(product)}
                              >
                                Comprar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <style jsx>{`
        .catalog-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }

        @media (max-width: 968px) {
          .catalog-layout {
            grid-template-columns: 1fr;
          }
          .filters-sidebar {
            position: sticky;
            top: 80px;
            z-index: 10;
          }
        }

        .filters-sidebar {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          height: fit-content;
          position: sticky;
          top: 100px;
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .filters-header h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d3748;
        }

        .reset-filters-btn {
          padding: 0.5rem 1rem;
          background: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .reset-filters-btn:hover {
          background: #edf2f7;
        }

        .filter-group {
          margin-bottom: 2rem;
        }

        .filter-group h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 1rem;
        }

        .filter-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
          cursor: pointer;
          transition: color 0.2s;
        }

        .filter-option:hover {
          color: #4a90a4;
        }

        .filter-option input[type="radio"] {
          cursor: pointer;
        }

        .price-range-display {
          font-weight: 600;
          color: #4a90a4;
          margin-bottom: 0.75rem;
        }

        .price-slider {
          width: 100%;
          cursor: pointer;
        }

        .sort-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .results-count {
          font-size: 1rem;
          color: #718096;
        }

        .sort-select {
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
        }

        .no-products {
          text-align: center;
          padding: 4rem 2rem;
        }

        .no-products-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .no-products h3 {
          font-size: 1.5rem;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .no-products p {
          color: #718096;
          margin-bottom: 2rem;
        }

        .product-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0.5rem 0;
        }

        .stars {
          color: #f59e0b;
          font-size: 0.875rem;
        }

        .rating-text {
          font-size: 0.875rem;
          color: #718096;
        }
      `}</style>
    </div>
  );
}
