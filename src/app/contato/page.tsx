// src/app/contato/page.tsx - Página de Contato
"use client";

import { useState, useEffect } from "react";

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }, 1500);
  };

  return (
    <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container">
        {/* Hero Section */}
        <section className="section text-center">
          <h1 className="page-title">Entre em Contato</h1>
          <p className="page-subtitle">
            Estamos aqui para ajudar você e seu pet. Envie sua mensagem!
          </p>
        </section>

        <div className="contact-grid">
          {/* Contact Form */}
          <div className="contact-form-section">
            <h2 className="section-title">Envie uma Mensagem</h2>
            
            {submitStatus === 'success' && (
              <div className="alert alert-success">
                ✓ Mensagem enviada com sucesso! Entraremos em contato em breve.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="alert alert-error">
                ✗ Erro ao enviar mensagem. Por favor, tente novamente.
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Nome Completo *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">E-mail *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="seu@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Telefone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Assunto *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="duvida">Dúvida sobre Produto</option>
                  <option value="pedido">Status do Pedido</option>
                  <option value="troca">Troca ou Devolução</option>
                  <option value="sugestao">Sugestão</option>
                  <option value="reclamacao">Reclamação</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Mensagem *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="form-input"
                  placeholder="Escreva sua mensagem aqui..."
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="contact-info-section">
            <h2 className="section-title">Informações de Contato</h2>
            
            <div className="contact-info-card">
              <div className="contact-info-item">
                <div className="contact-icon">📧</div>
                <div>
                  <h3>E-mail</h3>
                  <p>contato@mundopetzen.com.br</p>
                  <p className="text-sm text-gray-600">Respondemos em até 24 horas</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">📱</div>
                <div>
                  <h3>WhatsApp</h3>
                  <p>(11) 99999-9999</p>
                  <p className="text-sm text-gray-600">Seg-Sex: 9h às 18h</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">🕐</div>
                <div>
                  <h3>Horário de Atendimento</h3>
                  <p>Segunda a Sexta: 9h às 18h</p>
                  <p>Sábado: 9h às 13h</p>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h3>Endereço</h3>
                  <p>São Paulo - SP</p>
                  <p className="text-sm text-gray-600">Atendimento online em todo Brasil</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
              <div className="social-icons">
                <a href="#" className="social-icon" aria-label="Facebook">
                  <span>f</span>
                </a>
                <a href="#" className="social-icon" aria-label="Instagram">
                  <span>ig</span>
                </a>
                <a href="#" className="social-icon" aria-label="Twitter">
                  <span>t</span>
                </a>
                <a href="#" className="social-icon" aria-label="LinkedIn">
                  <span>in</span>
                </a>
              </div>
            </div>

            <div className="faq-link">
              <p>Procurando respostas rápidas?</p>
              <a href="/faq" className="btn btn-secondary">
                Visite nossa FAQ
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 3rem;
          margin-top: 2rem;
        }
        
        @media (max-width: 968px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .contact-form {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .form-group {
          margin-bottom: 1.5rem;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        @media (max-width: 640px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
        
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #2d3748;
        }
        
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #4a90a4;
        }
        
        .contact-info-card {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }
        
        .contact-info-item {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .contact-info-item:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .contact-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }
        
        .contact-info-item h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #2d3748;
        }
        
        .contact-info-item p {
          color: #4a5568;
          margin: 0.25rem 0;
        }
        
        .social-links {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          margin-bottom: 2rem;
        }
        
        .social-icons {
          display: flex;
          gap: 1rem;
        }
        
        .social-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #4a90a4;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          transition: transform 0.3s, background-color 0.3s;
        }
        
        .social-icon:hover {
          transform: translateY(-3px);
          background: #3a7a8a;
        }
        
        .faq-link {
          background: #f7fafc;
          padding: 2rem;
          border-radius: 12px;
          text-align: center;
        }
        
        .faq-link p {
          margin-bottom: 1rem;
          color: #4a5568;
        }
        
        .alert {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }
        
        .alert-success {
          background: #c6f6d5;
          color: #22543d;
          border: 1px solid #9ae6b4;
        }
        
        .alert-error {
          background: #fed7d7;
          color: #742a2a;
          border: 1px solid #fc8181;
        }
      `}</style>
    </div>
  );
}
