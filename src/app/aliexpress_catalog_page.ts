// src/app/catalogo-aliexpress/page.tsx
"use client";

import { useState, useEffect } from 'react';
import './catalog.css';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: string;
  category: string;
  source: string;
}

export default function AliExpressCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('pet products');
  const [page, setPage] = useState(1);

  const fetchProducts = async (search: string = searchTerm, pageNum: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`Fetching products: "${search}", page ${pageNum}`);
      
      const response = await fetch(
        `/api/aliexpress/search-products?keywords=${encodeURIComponent(search)}&page=${pageNum}&pageSize=20`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch products');
      }

      const data = await response.json();
      console.log(`Received ${data.products.length} products`);
      
      setProducts(data.products);
      setPage(pageNum);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchTerm, 1);
  };

  const handleNextPage = () => {
    fetchProducts(searchTerm, page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      fetchProducts(searchTerm, page - 1);
    }
  };

  const calculateFinalPrice = (aliexpressPrice: number) => {
    const markup = 1.5; // 50% profit
    const shipping = 15.90; // Estimated shipping
    return (aliexpressPrice * markup + shipping).toFixed(2);
  };

  return (
    <div className="catalog-page">
      <div className="container">
        {/* Header */}
        <div className="catalog-header">
          <h1>🌏 Catálogo AliExpress</h1>
          <p>Produtos importados diretamente da China</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar produtos..."
            className="search-input-large"
          />
          <button type="submit" className="search-button" disabled={loading}>
            {loading ? '🔄 Buscando...' : '🔍 Buscar'}
          </button>
        </form>

        {/* Quick Filters */}
        <div className="quick-filters">
          <button onClick={() => { setSearchTerm('pet toys'); fetchProducts('pet toys', 1); }}>
            🐕 Brinquedos
          </button>
          <button onClick={() => { setSearchTerm('pet bed'); fetchProducts('pet bed', 1); }}>
            🛏️ Camas
          </button>
          <button onClick={() => { setSearchTerm('pet collar'); fetchProducts('pet collar', 1); }}>
            🦴 Coleiras
          </button>
          <button onClick={() => { setSearchTerm('cat feeder'); fetchProducts('cat feeder', 1); }}>
            🍽️ Comedouros
          </button>
          <button onClick={() => { setSearchTerm('wellness'); fetchProducts('wellness', 1); }}>
            🧘 Bem-Estar
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            <p>⚠️ {error}</p>
            <button onClick={() => fetchProducts()}>Tentar Novamente</button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Carregando produtos do AliExpress...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card-ali">
                  <div className="product-image-wrapper">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.jpg';
                      }}
                    />
                    {product.discount && (
                      <span className="discount-badge">-{product.discount}</span>
                    )}
                    <span className="source-badge">AliExpress</span>
                  </div>
                  
                  <div className="product-info">
                    <h3 className="product-title">{product.name}</h3>
                    
                    <div className="price-section">
                      <div className="price-row">
                        <span className="label">AliExpress:</span>
                        <span className="aliexpress-price">
                          ${product.price.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="price-row">
                        <span className="label">Seu preço:</span>
                        <span className="final-price">
                          R$ {calculateFinalPrice(product.price)}
                        </span>
                      </div>
                      
                      <div className="profit-info">
                        💰 Lucro: ~R$ {(parseFloat(calculateFinalPrice(product.price)) - product.price * 5).toFixed(2)}
                      </div>
                    </div>

                    <div className="product-actions">
                      <button className="btn-view">👁️ Ver Detalhes</button>
                      <button className="btn-import">⬇️ Importar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="pagination">
              <button 
                onClick={handlePrevPage} 
                disabled={page === 1}
                className="pagination-btn"
              >
                ← Anterior
              </button>
              
              <span className="page-info">Página {page}</span>
              
              <button 
                onClick={handleNextPage}
                className="pagination-btn"
              >
                Próxima →
              </button>
            </div>
          </>
        )}

        {/* No Results */}
        {!loading && !error && products.length === 0 && (
          <div className="no-results">
            <p>🔍 Nenhum produto encontrado para "{searchTerm}"</p>
            <button onClick={() => { setSearchTerm('pet products'); fetchProducts('pet products', 1); }}>
              Buscar Produtos Para Pets
            </button>
          </div>
        )}
      </div>
    </div>
  );
}