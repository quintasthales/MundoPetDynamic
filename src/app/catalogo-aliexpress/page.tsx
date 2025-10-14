'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './catalog.css';

interface AliExpressProduct {
  product_id: string;
  product_title: string;
  product_main_image_url: string;
  target_sale_price: string;
  target_sale_price_currency: string;
  target_original_price: string;
  discount: string;
  product_detail_url: string;
  sale_price: number;
}

export default function AliExpressCatalog() {
  const [products, setProducts] = useState<AliExpressProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('pet products');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async (search: string, pageNum: number) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `/api/aliexpress/search-products?query=${encodeURIComponent(search)}&page=${pageNum}`
      );

      if (!response.ok) {
        throw new Error('Falha ao buscar produtos');
      }

      const data = await response.json();
      
      if (data.products && data.products.length > 0) {
        setProducts(data.products);
        setHasMore(data.products.length === 20);
      } else {
        setProducts([]);
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(searchTerm, page);
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts(searchTerm, 1);
  };

  const handleQuickSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
    fetchProducts(term, 1);
  };

  const calculateBrazilianPrice = (usdPrice: number) => {
    const exchangeRate = 5.25;
    const markup = 1.5;
    const shipping = 15.90;
    
    const priceInBRL = usdPrice * exchangeRate;
    const finalPrice = (priceInBRL * markup) + shipping;
    
    return {
      aliexpressPrice: priceInBRL.toFixed(2),
      finalPrice: finalPrice.toFixed(2),
      profit: ((finalPrice - priceInBRL - shipping)).toFixed(2)
    };
  };

  const handleBuyNow = (productUrl: string) => {
    window.open(productUrl, '_blank', 'noopener,noreferrer');
  };

  const handleImportProduct = async (product: AliExpressProduct) => {
    alert(`Produto "${product.product_title}" será importado para seu catálogo!`);
  };

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <div className="nav-links">
          <Link href="/" className="back-link">← Voltar para Home</Link>
          <Link href="/produtos" className="nav-link">Meus Produtos</Link>
          <Link href="/carrinho" className="nav-link">🛒 Carrinho</Link>
        </div>
        
        <h1>🐾 Catálogo AliExpress</h1>
        <p>Encontre produtos para importar e revender em sua loja</p>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar produtos... (ex: coleira, ração, brinquedo)"
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? '🔄 Buscando...' : '🔍 Buscar'}
          </button>
        </form>

        <div className="quick-filters">
          <button onClick={() => handleQuickSearch('dog toys')}>🐕 Brinquedos</button>
          <button onClick={() => handleQuickSearch('cat bed')}>🛏️ Camas</button>
          <button onClick={() => handleQuickSearch('pet collar')}>🦴 Coleiras</button>
          <button onClick={() => handleQuickSearch('pet food bowl')}>🍽️ Comedouros</button>
          <button onClick={() => handleQuickSearch('pet grooming')}>✂️ Higiene</button>
          <button onClick={() => handleQuickSearch('pet wellness')}>💊 Saúde</button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={() => fetchProducts(searchTerm, page)}>Tentar Novamente</button>
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Buscando produtos no AliExpress...</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <>
          <div className="results-info">
            <p>✅ Encontrados {products.length} produtos - Página {page}</p>
          </div>

          <div className="products-grid">
            {products.map((product) => {
              const pricing = calculateBrazilianPrice(product.sale_price);
              
              return (
                <div key={product.product_id} className="product-card">
                  <div className="product-image">
                    <img 
                      src={product.product_main_image_url} 
                      alt={product.product_title}
                      loading="lazy"
                    />
                    {product.discount && (
                      <span className="discount-badge">-{product.discount}%</span>
                    )}
                  </div>

                  <div className="product-info">
                    <h3 className="product-title">{product.product_title}</h3>

                    <div className="price-section">
                      <div className="price-row">
                        <span className="price-label">AliExpress:</span>
                        <span className="aliexpress-price">
                          R$ {pricing.aliexpressPrice}
                        </span>
                      </div>

                      <div className="price-row">
                        <span className="price-label">Seu Preço:</span>
                        <span className="final-price">R$ {pricing.finalPrice}</span>
                      </div>

                      <div className="profit-info">
                        💰 Lucro estimado: R$ {pricing.profit}
                      </div>
                    </div>

                    <div className="product-actions">
                      <button 
                        className="btn-buy"
                        onClick={() => handleBuyNow(product.product_detail_url)}
                        title="Comprar no AliExpress"
                      >
                        🛒 Comprar Agora
                      </button>
                      <button 
                        className="btn-import"
                        onClick={() => handleImportProduct(product)}
                        title="Importar para meu catálogo"
                      >
                        📥 Importar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pagination">
            <button 
              className="pagination-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
            >
              ← Anterior
            </button>
            
            <span className="page-info">Página {page}</span>
            
            <button 
              className="pagination-btn"
              onClick={() => setPage(p => p + 1)}
              disabled={!hasMore || loading}
            >
              Próxima →
            </button>
          </div>
        </>
      )}

      {!loading && products.length === 0 && !error && (
        <div className="no-results">
          <p>😔 Nenhum produto encontrado para "{searchTerm}"</p>
          <button onClick={() => handleQuickSearch('pet products')}>
            Tentar busca padrão
          </button>
        </div>
      )}
    </div>
  );
}
