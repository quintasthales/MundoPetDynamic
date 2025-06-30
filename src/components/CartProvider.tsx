"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { loadCartFromStorage, Cart } from '@/lib/products';

// Criar contexto para o carrinho
interface CartContextType {
  cart: Cart;
  cartItemsCount: number;
  refreshCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cart: { items: [], subtotal: 0, shipping: 0, total: 0 },
  cartItemsCount: 0,
  refreshCart: () => {}
});

// Hook personalizado para usar o contexto do carrinho
export const useCart = () => useContext(CartContext);

// Provedor do contexto do carrinho
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, shipping: 0, total: 0 });
  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Função para atualizar o carrinho usando useCallback para evitar re-criação
  const refreshCart = useCallback(() => {
    const currentCart = loadCartFromStorage();
    setCart(currentCart);
    
    // Calcular o número total de itens no carrinho
    const itemCount = currentCart.items.reduce((total, item) => total + item.quantity, 0);
    setCartItemsCount(itemCount);
  }, []);

  // Atualizar o carrinho quando o componente montar
  useEffect(() => {
    refreshCart();
    
    // Adicionar listener para eventos de atualização do carrinho
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'cart') {
        refreshCart();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Criar um evento personalizado para atualizações do carrinho
    const handleCartUpdate = () => refreshCart();
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cart, cartItemsCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

