'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './admin.css';

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

export default function AdminImport() {
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
    const markup = 1.5; // 50% profit
    const shipping = 15.90;
    
    const priceInBRL = usdPrice * exchangeRate;
    const finalPrice = (priceInBRL * markup) + shipping;
    
    return {
      costPrice: priceInBRL.toFixed(2),
      sellPrice: finalPrice.toFixed(2),
      profit: ((finalPrice - priceInBRL - shipping)).toFixed(2)
    };
  };

  const handleBuyFromSupplier = (productUrl: string) => {
    window.open(productUrl, '_blank', 'noopener,noreferrer');
  };

  const handleImportProduct = async (product: AliExpressProduct) => {
    const pricing = calculateBrazilianPrice(product.sale_price);
    
    // TODO: Save to your database
    const productData = {
      name: product.product_title,
      image: product.product_main_image_url,
      price: parseFloat(pricing.sellPrice),
      costPrice: parseFloat(pricing.costPrice),
      profit: parseFloat(pricing.profit),
      supplierUrl: product.product_detail_url,
      supplierId: product.product_id,
      inStock: true,
    };

    // For now, show success message
    alert(`✅ Produto importado!\n\nPreço de Venda: R$ ${pricing.sellPrice}\nLucro: R$ ${pricing.profit}`);
    
    console.log('Product to import:', productData);
    // await fetch('/api/products', { method: 'POST', body: JSON.stringify(productData) });
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div className="admin-nav">
          <Link href="/" className="back-link">← Voltar</Link>
          <Link href="/produtos" className="nav-link">Ver Loja</Link>
        </div>
        
        <h1>🔒 Painel Admin - Importar Produtos</h1>
        <p className="warning">⚠️ PÁGINA PRIVADA - Não compartilhe este link</p>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar produtos para importar..."
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
          <p>Buscando produtos no fornecedor...</p>
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
                        <span className="price-label">💰 Custo:</span>
                        <span className="cost-price">R$ {pricing.costPrice}</span>
                      </div>

                      <div className="price-row">
                        <span className="price-label">💵 Vender por:</span>
                        <span className="sell-price">R$ {pricing.sellPrice}</span>
                      </div>

                      <div className="profit-info">
                        ✅ Lucro: R$ {pricing.profit}
                      </div>
                    </div>

                    <div className="product-actions">
                      <button 
                        className="btn-view-supplier"
                        onClick={() => handleBuyFromSupplier(product.product_detail_url)}
                        title="Ver no Fornecedor"
                      >
                        🔗 Ver Fornecedor
                      </button>
                      <button 
                        className="btn-import"
                        onClick={() => handleImportProduct(product)}
                        title="Adicionar à Loja"
                      >
                        ➕ Adicionar à Loja
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
          <p>😔 Nenhum produto encontrado</p>
          <button onClick={() => handleQuickSearch('pet products')}>
            Tentar busca padrão
          </button>
        </div>
      )}
    </div>
  );
}
