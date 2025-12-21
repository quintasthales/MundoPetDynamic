// src/app/admin/page.tsx - Admin Dashboard
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { getAllReviews } from "@/lib/reviews";
import { getWishlistCount } from "@/lib/wishlist";

export default function AdminDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalReviews: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    setIsLoaded(true);
    loadStats();
  }, []);

  const loadStats = () => {
    const products = getAllProducts();
    const allReviews = products.flatMap(p => getAllReviews(p.id));
    
    // Mock order data (in production, this would come from database)
    const mockOrders = 47;
    const mockRevenue = 12450.50;

    setStats({
      totalProducts: products.length,
      totalReviews: allReviews.length,
      totalOrders: mockOrders,
      totalRevenue: mockRevenue,
    });
  };

  return (
    <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="admin-container">
        {/* Admin Header */}
        <header className="admin-header">
          <div>
            <h1 className="admin-title">Painel Administrativo</h1>
            <p className="admin-subtitle">Bem-vindo ao painel de controle da MundoPetZen</p>
          </div>
          <Link href="/" className="btn btn-secondary">
            ← Voltar para Loja
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{background: '#4a90a4'}}>📦</div>
            <div className="stat-content">
              <div className="stat-label">Total de Produtos</div>
              <div className="stat-value">{stats.totalProducts}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: '#10b981'}}>🛒</div>
            <div className="stat-content">
              <div className="stat-label">Pedidos</div>
              <div className="stat-value">{stats.totalOrders}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: '#f59e0b'}}>⭐</div>
            <div className="stat-content">
              <div className="stat-label">Avaliações</div>
              <div className="stat-value">{stats.totalReviews}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: '#8b5cf6'}}>💰</div>
            <div className="stat-content">
              <div className="stat-label">Receita Total</div>
              <div className="stat-value">R$ {stats.totalRevenue.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <section className="admin-section">
          <h2 className="section-title">Ações Rápidas</h2>
          <div className="actions-grid">
            <Link href="/admin/produtos" className="action-card">
              <div className="action-icon">📦</div>
              <h3>Gerenciar Produtos</h3>
              <p>Adicionar, editar ou remover produtos do catálogo</p>
            </Link>

            <Link href="/admin/pedidos" className="action-card">
              <div className="action-icon">🛒</div>
              <h3>Pedidos</h3>
              <p>Visualizar e gerenciar pedidos dos clientes</p>
            </Link>

            <Link href="/admin/avaliacoes" className="action-card">
              <div className="action-icon">⭐</div>
              <h3>Avaliações</h3>
              <p>Moderar e responder avaliações de produtos</p>
            </Link>

            <Link href="/admin/relatorios" className="action-card">
              <div className="action-icon">📊</div>
              <h3>Relatórios</h3>
              <p>Análises de vendas e desempenho</p>
            </Link>

            <Link href="/admin/clientes" className="action-card">
              <div className="action-icon">👥</div>
              <h3>Clientes</h3>
              <p>Gerenciar cadastro de clientes</p>
            </Link>

            <Link href="/admin/configuracoes" className="action-card">
              <div className="action-icon">⚙️</div>
              <h3>Configurações</h3>
              <p>Configurações gerais da loja</p>
            </Link>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="admin-section">
          <h2 className="section-title">Atividade Recente</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">🛒</div>
              <div className="activity-content">
                <div className="activity-title">Novo pedido #1047</div>
                <div className="activity-time">Há 5 minutos</div>
              </div>
              <div className="activity-value">R$ 259,90</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">⭐</div>
              <div className="activity-content">
                <div className="activity-title">Nova avaliação no Difusor Aromático</div>
                <div className="activity-time">Há 1 hora</div>
              </div>
              <div className="activity-rating">★★★★★</div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">📦</div>
              <div className="activity-content">
                <div className="activity-title">Produto adicionado: Tapete de Yoga Premium</div>
                <div className="activity-time">Há 3 horas</div>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">🛒</div>
              <div className="activity-content">
                <div className="activity-title">Pedido #1046 enviado</div>
                <div className="activity-time">Há 5 horas</div>
              </div>
              <div className="activity-status">Enviado</div>
            </div>
          </div>
        </section>
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
          align-items: center;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .admin-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .admin-subtitle {
          color: #718096;
          font-size: 1.1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #718096;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: #2d3748;
        }

        .admin-section {
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1.5rem;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .action-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          text-decoration: none;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .action-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.15);
          border-color: #4a90a4;
        }

        .action-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .action-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .action-card p {
          color: #718096;
          line-height: 1.5;
        }

        .activity-list {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .activity-item:last-child {
          border-bottom: none;
        }

        .activity-icon {
          width: 48px;
          height: 48px;
          background: #f7fafc;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .activity-content {
          flex: 1;
        }

        .activity-title {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .activity-time {
          font-size: 0.875rem;
          color: #a0aec0;
        }

        .activity-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #10b981;
        }

        .activity-rating {
          color: #f59e0b;
          font-size: 1.1rem;
        }

        .activity-status {
          padding: 0.5rem 1rem;
          background: #d1fae5;
          color: #065f46;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .admin-container {
            padding: 1rem;
          }

          .admin-title {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
