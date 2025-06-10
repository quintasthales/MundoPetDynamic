"use client";

import { useEffect, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { useRouter } from 'next/navigation';

export default function ClientHeader() {
  const { cartItemsCount, refreshCart } = useCart();
  const [count, setCount] = useState(0);
  const router = useRouter();
  
  // Garantir que o contador seja atualizado quando o componente montar e quando cartItemsCount mudar
  useEffect(() => {
    refreshCart(); // Forçar atualização do carrinho ao montar
    setCount(cartItemsCount);
    
    // Adicionar listener para eventos de atualização do carrinho
    const handleCartUpdate = () => {
      refreshCart();
      setCount(cartItemsCount);
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [cartItemsCount, refreshCart]);

  // Função para navegação
  const handleNavigation = (path: string) => {
    router.push(path);
  };
  
  return (
    <header className="site-header">
      <div className="container">
        <nav className="navbar">
          <a href="/" className="logo" onClick={(e) => {
            e.preventDefault();
            handleNavigation('/');
          }}>
            <span>MundoPetZen</span>
          </a>
          
          <ul className="nav-menu">
            <li>
              <a href="/" className="nav-link" onClick={(e) => {
                e.preventDefault();
                handleNavigation('/');
              }}>
                Início
              </a>
            </li>
            <li>
              <a href="/saude-bem-estar" className="nav-link" onClick={(e) => {
                e.preventDefault();
                handleNavigation('/saude-bem-estar');
              }}>
                Saúde e Bem-Estar
              </a>
            </li>
            <li>
              <a href="/produtos-para-pets" className="nav-link" onClick={(e) => {
                e.preventDefault();
                handleNavigation('/produtos-para-pets');
              }}>
                Produtos para Pets
              </a>
            </li>
            <li>
              <a href="/sobre" className="nav-link" onClick={(e) => {
                e.preventDefault();
                handleNavigation('/sobre');
              }}>
                Sobre Nós
              </a>
            </li>
            <li>
              <a href="/contato" className="nav-link" onClick={(e) => {
                e.preventDefault();
                handleNavigation('/contato');
              }}>
                Contato
              </a>
            </li>
          </ul>
          
          <div className="header-actions">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input type="text" className="search-input" placeholder="Buscar produtos..." />
            </div>
            
            <a href="/carrinho" className="cart-button" onClick={(e) => {
              e.preventDefault();
              handleNavigation('/carrinho');
            }}>
              🛒
              {count > 0 && (
                <span className="cart-count">{count}</span>
              )}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
