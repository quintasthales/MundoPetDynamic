"use client";

import { useState, useEffect } from "react";
import { getCart, updateCartItemQuantity, removeFromCart } from "@/lib/products";

export default function CartPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [cart, setCart] = useState({items: [], subtotal: 0, shipping: 0, total: 0});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    setIsClient(true);
    
    // Obter o carrinho atualizado do localStorage
    const currentCart = getCart();
    setCart(currentCart);
    
    // Adicionar listener para eventos de atualização do carrinho
    const handleCartUpdate = () => {
      const updatedCart = getCart();
      setCart(updatedCart);
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'cart') {
        handleCartUpdate();
      }
    });
    
    // Forçar uma atualização após um pequeno atraso para garantir que o localStorage foi carregado
    setTimeout(() => {
      const refreshedCart = getCart();
      setCart(refreshedCart);
      console.log('Carrinho atualizado na página de carrinho:', refreshedCart);
    }, 100);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
    };
  }, []);

  const handleQuantityChange = (productId: string, change: number) => {
    updateCartItemQuantity(productId, change);
    
    // Atualizar o estado local
    setCart(getCart());
    
    // Disparar evento para atualizar outros componentes
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    
    // Atualizar o estado local
    setCart(getCart());
    
    // Disparar evento para atualizar outros componentes
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container">
        <div className="cart-page">
          <h1 className="cart-title">Seu Carrinho</h1>
          
          {!isClient || cart.items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <h2>Seu carrinho está vazio</h2>
              <p>Adicione produtos ao seu carrinho para continuar.</p>
              <a href="/" className="btn btn-primary">Continuar Comprando</a>
            </div>
          ) : (
            <div className="cart-grid">
              <div className="cart-items">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="cart-item">
                    <img 
                      src={item.product.images[0] || '/images/placeholder.jpg'} 
                      alt={item.product.name} 
                      className="cart-item-image"
                    />
                    
                    <div className="cart-item-details">
                      <h3 className="cart-item-title">{item.product.name}</h3>
                      <p className="cart-item-category">
                        {item.product.category === 'saude' ? 'Saúde e Bem-Estar' : 'Produtos para Pets'}
                      </p>
                    </div>
                    
                    <div className="cart-item-quantity">
                      <button 
                        className="quantity-btn" 
                        onClick={() => handleQuantityChange(item.product.id, -1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        className="quantity-input" 
                        value={item.quantity} 
                        readOnly
                      />
                      <button 
                        className="quantity-btn" 
                        onClick={() => handleQuantityChange(item.product.id, 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="cart-item-price">
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </div>
                    
                    <button 
                      className="cart-item-remove"
                      onClick={() => handleRemoveItem(item.product.id)}
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="cart-summary">
                <h2 className="summary-title">Resumo do Pedido</h2>
                
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>R$ {cart.subtotal.toFixed(2)}</span>
                </div>
                
                <div className="summary-row">
                  <span>Frete</span>
                  <span>R$ {cart.shipping.toFixed(2)}</span>
                </div>
                
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>R$ {cart.total.toFixed(2)}</span>
                </div>
                
                <a href="/checkout" className="btn btn-accent checkout-button">
                  Finalizar Compra
                </a>
                
                <a href="/" className="continue-shopping">
                  Continuar Comprando
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
