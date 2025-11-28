// src/app/sobre/page.tsx - Página Sobre Nós
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container">
        {/* Hero Section */}
        <section className="section text-center">
          <h1 className="page-title">Sobre a MundoPetZen</h1>
          <p className="page-subtitle">
            Promovendo harmonia e bem-estar para você e seu pet desde 2024
          </p>
        </section>

        {/* Nossa História */}
        <section className="section">
          <div className="content-grid">
            <div className="content-text">
              <h2 className="section-title">Nossa História</h2>
              <p>
                A MundoPetZen nasceu da paixão por promover o bem-estar integral, tanto para os humanos quanto para seus companheiros de quatro patas. Acreditamos que a harmonia em casa começa quando todos os membros da família, incluindo os pets, estão felizes, saudáveis e em equilíbrio.
              </p>
              <p>
                Nossa jornada começou quando percebemos a falta de um espaço que unisse produtos de qualidade para o bem-estar pessoal e para os cuidados com os animais de estimação. Decidimos criar uma loja que oferecesse essa experiência única, onde você pode encontrar desde produtos de aromaterapia e meditação até brinquedos interativos e acessórios premium para pets.
              </p>
            </div>
            <div className="content-image">
              <img 
                src="/images/banners/zen_stones_flowers.jpg" 
                alt="Zen e Harmonia" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Nossa Missão */}
        <section className="section bg-light">
          <div className="text-center">
            <h2 className="section-title">Nossa Missão</h2>
            <p className="text-lg max-w-3xl mx-auto">
              Proporcionar produtos de qualidade que promovam o equilíbrio, a saúde e a tranquilidade para toda a família, criando um ambiente harmonioso onde humanos e pets possam viver em pleno bem-estar.
            </p>
          </div>
        </section>

        {/* Nossos Valores */}
        <section className="section">
          <h2 className="section-title text-center">Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="value-card">
              <div className="value-icon">🌿</div>
              <h3 className="value-title">Naturalidade</h3>
              <p className="value-description">
                Priorizamos produtos naturais, sustentáveis e seguros para você e seu pet.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3 className="value-title">Amor aos Animais</h3>
              <p className="value-description">
                Cada produto é escolhido pensando no bem-estar e felicidade dos pets.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">✨</div>
              <h3 className="value-title">Qualidade</h3>
              <p className="value-description">
                Selecionamos cuidadosamente cada item para garantir a melhor experiência.
              </p>
            </div>
            
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3 className="value-title">Confiança</h3>
              <p className="value-description">
                Transparência e honestidade em todas as nossas relações com clientes.
              </p>
            </div>
          </div>
        </section>

        {/* O Que Oferecemos */}
        <section className="section bg-light">
          <h2 className="section-title text-center">O Que Oferecemos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="offer-card">
              <h3 className="text-xl font-semibold mb-3">Para Você</h3>
              <ul className="space-y-2">
                <li>✓ Produtos de aromaterapia e óleos essenciais</li>
                <li>✓ Acessórios para yoga e meditação</li>
                <li>✓ Itens para home office ergonômico</li>
                <li>✓ Produtos naturais para bem-estar</li>
              </ul>
            </div>
            
            <div className="offer-card">
              <h3 className="text-xl font-semibold mb-3">Para Seu Pet</h3>
              <ul className="space-y-2">
                <li>✓ Brinquedos interativos e educativos</li>
                <li>✓ Camas e acessórios de conforto</li>
                <li>✓ Produtos de higiene natural</li>
                <li>✓ Acessórios premium e seguros</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Nosso Compromisso */}
        <section className="section">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="section-title">Nosso Compromisso</h2>
            <p className="mb-4">
              Na MundoPetZen, nos comprometemos a oferecer não apenas produtos, mas uma experiência completa de bem-estar. Cada item em nossa loja é cuidadosamente selecionado, testado e aprovado para garantir que atenda aos nossos altos padrões de qualidade.
            </p>
            <p className="mb-6">
              Trabalhamos constantemente para expandir nosso catálogo com produtos inovadores que façam a diferença na vida de nossos clientes e seus pets. Sua satisfação e o bem-estar da sua família são nossa prioridade número um.
            </p>
            <Link href="/" className="btn btn-primary">
              Conheça Nossos Produtos
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }
        
        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .content-text p {
          margin-bottom: 1rem;
          line-height: 1.8;
        }
        
        .content-image img {
          width: 100%;
          height: auto;
        }
        
        .bg-light {
          background-color: #f9fafb;
          padding: 4rem 0;
        }
        
        .value-card {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        
        .value-card:hover {
          transform: translateY(-5px);
        }
        
        .value-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .value-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #2d3748;
        }
        
        .value-description {
          color: #718096;
          line-height: 1.6;
        }
        
        .offer-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .offer-card ul {
          list-style: none;
          padding: 0;
        }
        
        .offer-card li {
          color: #4a5568;
          padding: 0.5rem 0;
        }
      `}</style>
    </div>
  );
}
