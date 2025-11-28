// src/app/busca/page.tsx - Página de Resultados de Busca
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getAllProducts, addToCart } from "@/lib/products";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    setIsLoaded(true);
    
    if (query) {
      const allProducts = getAllProducts();
      const searchQuery = query.toLowerCase();
      
      const filtered = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery) ||
        product.subcategory.toLowerCase().includes(searchQuery)
      );
      
      setResults(filtered);
    }
  }, [query]);

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    alert(`${product.name} adicionado ao carrinho!`);
    
    // Trigger cart update event
    const event = new Event('cartUpdated');
    window.dispatchEvent(event);
  };

  return (
    <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container">
        <section className="section">
          <h1 className="page-title">Resultados da Busca</h1>
          {query && (
            <p className="text-center text-gray-600 mb-8">
              Buscando por: <strong>"{query}"</strong>
            </p>
          )}

          {!query ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">
                Digite algo no campo de busca para encontrar produtos
              </p>
              <Link href="/" className="btn btn-primary">
                Voltar para Home
              </Link>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-semibold mb-4">Nenhum produto encontrado</h2>
              <p className="text-gray-600 mb-6">
                Não encontramos produtos correspondentes à sua busca.
                <br />
                Tente usar palavras-chave diferentes ou navegue pelas categorias.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/" className="btn btn-primary">
                  Ver Todos os Produtos
                </Link>
                <Link href="/contato" className="btn btn-secondary">
                  Fale Conosco
                </Link>
              </div>
            </div>
          ) : (
            <>
              <p className="text-center text-gray-600 mb-8">
                Encontramos <strong>{results.length}</strong> {results.length === 1 ? 'produto' : 'produtos'}
              </p>
              
              <div className="products-grid">
                {results.map((product) => (
                  <div key={product.id} className="product-card">
                    <div 
                      className="product-image" 
                      style={{backgroundImage: `url('${product.images[0] || '/images/placeholder.jpg'}')`}}
                    >
                      {product.featured && <span className="product-badge">Destaque</span>}
                      {product.originalPrice && (
                        <span className="product-discount-badge">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                    <div className="product-content">
                      <div className="product-category">
                        {product.category === 'saude' ? 'Saúde e Bem-Estar' : 'Produtos para Pets'}
                      </div>
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-description">
                        {product.description.substring(0, 100)}...
                      </p>
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
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container section text-center">Carregando...</div>}>
      <SearchResults />
    </Suspense>
  );
}
