// src/app/faq/page.tsx - Página de Perguntas Frequentes
"use client";

import { useState, useEffect } from "react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const faqData: FAQItem[] = [
    {
      category: 'pedidos',
      question: 'Como faço para realizar um pedido?',
      answer: 'Para realizar um pedido, basta navegar pelo site, adicionar os produtos desejados ao carrinho e seguir para o checkout. Preencha seus dados de entrega e pagamento para finalizar a compra.'
    },
    {
      category: 'pedidos',
      question: 'Qual o prazo de entrega?',
      answer: 'O prazo de entrega varia de 2 a 5 dias úteis para a região Sudeste e de 5 a 10 dias úteis para as demais regiões do Brasil. O prazo começa a contar após a confirmação do pagamento.'
    },
    {
      category: 'pedidos',
      question: 'Como acompanho meu pedido?',
      answer: 'Após a confirmação do pagamento, você receberá um e-mail com o código de rastreamento. Você pode acompanhar seu pedido através do site dos Correios ou da transportadora responsável.'
    },
    {
      category: 'pagamento',
      question: 'Quais formas de pagamento são aceitas?',
      answer: 'Aceitamos pagamento via cartão de crédito (Visa, Mastercard, Elo), boleto bancário e PIX. Todas as transações são processadas de forma segura através do PagSeguro.'
    },
    {
      category: 'pagamento',
      question: 'O pagamento é seguro?',
      answer: 'Sim! Utilizamos o PagSeguro, uma das plataformas de pagamento mais seguras do Brasil. Seus dados são criptografados e protegidos durante toda a transação.'
    },
    {
      category: 'pagamento',
      question: 'Posso parcelar minha compra?',
      answer: 'Sim! Aceitamos parcelamento em até 12x sem juros no cartão de crédito para compras acima de R$ 100,00.'
    },
    {
      category: 'entrega',
      question: 'Qual o valor do frete?',
      answer: 'O valor do frete é calculado automaticamente no checkout com base no CEP de entrega e no peso dos produtos. Oferecemos frete grátis para compras acima de R$ 150,00.'
    },
    {
      category: 'entrega',
      question: 'Vocês entregam em todo o Brasil?',
      answer: 'Sim! Realizamos entregas para todos os estados brasileiros através dos Correios e transportadoras parceiras.'
    },
    {
      category: 'entrega',
      question: 'Posso retirar o pedido pessoalmente?',
      answer: 'No momento, trabalhamos apenas com entregas. Não temos loja física para retirada de pedidos.'
    },
    {
      category: 'produtos',
      question: 'Os produtos são originais?',
      answer: 'Sim! Todos os nossos produtos são originais e de alta qualidade. Trabalhamos apenas com fornecedores confiáveis e certificados.'
    },
    {
      category: 'produtos',
      question: 'Os produtos para pets são seguros?',
      answer: 'Absolutamente! Todos os produtos para pets são testados, atóxicos e seguros para uso. Selecionamos cuidadosamente cada item pensando no bem-estar dos animais.'
    },
    {
      category: 'produtos',
      question: 'Posso solicitar um produto que não está no site?',
      answer: 'Sim! Entre em contato conosco através do formulário de contato ou WhatsApp com sua sugestão. Estamos sempre expandindo nosso catálogo.'
    },
    {
      category: 'trocas',
      question: 'Qual a política de troca e devolução?',
      answer: 'Você tem até 7 dias após o recebimento do produto para solicitar troca ou devolução, conforme o Código de Defesa do Consumidor. O produto deve estar em perfeito estado, na embalagem original.'
    },
    {
      category: 'trocas',
      question: 'Como solicito uma troca?',
      answer: 'Entre em contato conosco através do e-mail contato@mundopetzen.com.br ou WhatsApp informando o número do pedido e o motivo da troca. Nossa equipe irá orientá-lo sobre os próximos passos.'
    },
    {
      category: 'trocas',
      question: 'Quem paga o frete da troca?',
      answer: 'Se o produto apresentar defeito ou vier errado, nós arcamos com o frete. Em caso de arrependimento, o frete de devolução fica por conta do cliente.'
    }
  ];

  const categories = [
    { id: 'all', name: 'Todas' },
    { id: 'pedidos', name: 'Pedidos' },
    { id: 'pagamento', name: 'Pagamento' },
    { id: 'entrega', name: 'Entrega' },
    { id: 'produtos', name: 'Produtos' },
    { id: 'trocas', name: 'Trocas e Devoluções' }
  ];

  const filteredFAQ = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container">
        {/* Hero Section */}
        <section className="section text-center">
          <h1 className="page-title">Perguntas Frequentes</h1>
          <p className="page-subtitle">
            Encontre respostas rápidas para as dúvidas mais comuns
          </p>
        </section>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <section className="section">
          <div className="faq-container">
            {filteredFAQ.map((item, index) => (
              <div key={index} className="faq-item">
                <button
                  className={`faq-question ${activeIndex === index ? 'active' : ''}`}
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{item.question}</span>
                  <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
                </button>
                <div className={`faq-answer ${activeIndex === index ? 'active' : ''}`}>
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="section text-center bg-light">
          <h2 className="section-title">Não encontrou sua resposta?</h2>
          <p className="mb-6">
            Nossa equipe está pronta para ajudar você!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/contato" className="btn btn-primary">
              Entre em Contato
            </a>
            <a href="https://wa.me/5511999999999" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
          </div>
        </section>
      </div>

      <style jsx>{`
        .category-filter {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin: 2rem 0;
        }
        
        .category-btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid #e2e8f0;
          background: white;
          border-radius: 25px;
          font-weight: 500;
          color: #4a5568;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .category-btn:hover {
          border-color: #4a90a4;
          color: #4a90a4;
        }
        
        .category-btn.active {
          background: #4a90a4;
          border-color: #4a90a4;
          color: white;
        }
        
        .faq-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .faq-item {
          background: white;
          border-radius: 12px;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .faq-question {
          width: 100%;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          border: none;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d3748;
          text-align: left;
          transition: background-color 0.3s;
        }
        
        .faq-question:hover {
          background: #f7fafc;
        }
        
        .faq-question.active {
          background: #f7fafc;
          color: #4a90a4;
        }
        
        .faq-icon {
          font-size: 1.5rem;
          font-weight: 300;
          color: #4a90a4;
          flex-shrink: 0;
          margin-left: 1rem;
        }
        
        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }
        
        .faq-answer.active {
          max-height: 500px;
        }
        
        .faq-answer p {
          padding: 0 1.5rem 1.5rem 1.5rem;
          color: #4a5568;
          line-height: 1.8;
        }
        
        .bg-light {
          background: #f7fafc;
          padding: 3rem 0;
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}
