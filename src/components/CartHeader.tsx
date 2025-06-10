"use client";

import { useEffect, useState } from 'react';
import { useCart } from '@/components/CartProvider';

export default function CartHeader() {
  const { cartItemsCount, refreshCart } = useCart();
  const [count, setCount] = useState(0);
  
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
  
  return (
    <a href="/carrinho" className="cart-button">
      🛒
      {count > 0 && (
        <span className="cart-count">{count}</span>
      )}
    </a>
  );
}
