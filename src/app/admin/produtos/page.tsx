// src/app/admin/produtos/page.tsx - Admin Products Management
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";

export default function AdminProdutosPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [products, setProducts] = useState(getAllProducts());
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="admin-container">
        {/* Header */}
        <header className="admin-header">
          <div>
            <Link href="/admin" className="breadcrumb">← Painel Admin</Link>
            <h1 className="admin-title">Gerenciar Produtos</h1>
            <p className="admin-subtitle">{filteredProducts.length} produtos no catálogo</p>
          </div>
          <button className="btn btn-primary">
            + Adicionar Produto
          </button>
        </header>

        {/* Filters */}
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Buscar produtos..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Todas as Categorias</option>
            <option value="saude">Saúde e Bem-Estar</option>
            <option value="pets">Produtos para Pets</option>
          </select>
        </div>

        {/* Products Table */}
        <div className="table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img 
                      src={product.images[0] || '/images/placeholder.jpg'} 
                      alt={product.name}
                      className="product-thumbnail"
                    />
                  </td>
                  <td>
                    <div className="product-name">{product.name}</div>
                    <div className="product-id">ID: {product.id}</div>
                  </td>
                  <td>
                    <span className="category-badge">
                      {product.category === 'saude' ? 'Saúde' : 'Pets'}
                    </span>
                  </td>
                  <td>
                    <div className="price-cell">
                      <div className="current-price">R$ {product.price.toFixed(2)}</div>
                      {product.originalPrice && (
                        <div className="original-price">R$ {product.originalPrice.toFixed(2)}</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="stock-badge in-stock">Em estoque</span>
                  </td>
                  <td>
                    <span className="status-badge active">Ativo</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="Editar">✏️</button>
                      <button className="btn-icon" title="Visualizar">👁️</button>
                      <button className="btn-icon danger" title="Excluir">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .admin-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .breadcrumb {
          color: #4a90a4;
          text-decoration: none;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          display: inline-block;
        }

        .breadcrumb:hover {
          text-decoration: underline;
        }

        .admin-title {
          font-size: 2rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .admin-subtitle {
          color: #718096;
        }

        .filters-bar {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .search-input {
          flex: 1;
          min-width: 300px;
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow-x: auto;
        }

        .products-table {
          width: 100%;
          border-collapse: collapse;
        }

        .products-table thead {
          background: #f7fafc;
        }

        .products-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #4a5568;
          border-bottom: 2px solid #e2e8f0;
        }

        .products-table td {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .products-table tbody tr:hover {
          background: #f7fafc;
        }

        .product-thumbnail {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 8px;
        }

        .product-name {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .product-id {
          font-size: 0.75rem;
          color: #a0aec0;
        }

        .category-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: #edf2f7;
          color: #4a5568;
          border-radius: 12px;
          font-size: 0.875rem;
        }

        .price-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .current-price {
          font-weight: 600;
          color: #2d3748;
        }

        .original-price {
          font-size: 0.875rem;
          color: #a0aec0;
          text-decoration: line-through;
        }

        .stock-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .stock-badge.in-stock {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .status-badge.active {
          background: #dbeafe;
          color: #1e40af;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          width: 36px;
          height: 36px;
          border: none;
          background: #f7fafc;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 1rem;
        }

        .btn-icon:hover {
          background: #edf2f7;
          transform: scale(1.1);
        }

        .btn-icon.danger:hover {
          background: #fee2e2;
        }

        @media (max-width: 768px) {
          .admin-container {
            padding: 1rem;
          }

          .search-input {
            min-width: 100%;
          }

          .table-container {
            overflow-x: scroll;
          }
        }
      `}</style>
    </div>
  );
}
