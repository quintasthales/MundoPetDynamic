'use client';

import Link from 'next/link';
import { useState } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="main-navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          <span className="logo-icon">🐾</span>
          <span className="logo-text">MundoPet</span>
        </Link>

        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            🏠 Home
          </Link>
          <Link href="/produtos" onClick={() => setIsMenuOpen(false)}>
            🐾 Produtos
          </Link>
          <Link href="/sobre" onClick={() => setIsMenuOpen(false)}>
            ℹ️ Sobre
          </Link>
          <Link href="/carrinho" onClick={() => setIsMenuOpen(false)}>
            🛒 Carrinho
          </Link>
          <Link href="/contato" onClick={() => setIsMenuOpen(false)}>
            📞 Contato
          </Link>
        </div>
      </div>
    </nav>
  );
}
