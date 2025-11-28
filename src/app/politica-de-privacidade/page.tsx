// src/app/politica-de-privacidade/page.tsx - Política de Privacidade
"use client";

import { useState, useEffect } from "react";

export default function PrivacyPolicyPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container">
        <section className="section">
          <h1 className="page-title">Política de Privacidade</h1>
          <p className="text-center text-gray-600 mb-8">Última atualização: Novembro de 2024</p>

          <div className="policy-content">
            <section className="policy-section">
              <h2>1. Introdução</h2>
              <p>
                A MundoPetZen ("nós", "nosso" ou "nossa") está comprometida em proteger a privacidade e segurança dos dados pessoais de nossos usuários ("você" ou "seu"). Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nosso site e serviços.
              </p>
              <p>
                Ao utilizar nosso site, você concorda com a coleta e uso de informações de acordo com esta política. Se você não concordar com os termos desta Política de Privacidade, por favor, não utilize nosso site.
              </p>
            </section>

            <section className="policy-section">
              <h2>2. Informações que Coletamos</h2>
              <h3>2.1 Informações Fornecidas por Você</h3>
              <p>Coletamos informações que você nos fornece diretamente, incluindo:</p>
              <ul>
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Número de telefone</li>
                <li>CPF</li>
                <li>Endereço de entrega</li>
                <li>Informações de pagamento (processadas de forma segura pelo PagSeguro)</li>
              </ul>

              <h3>2.2 Informações Coletadas Automaticamente</h3>
              <p>Quando você visita nosso site, coletamos automaticamente:</p>
              <ul>
                <li>Endereço IP</li>
                <li>Tipo de navegador e dispositivo</li>
                <li>Páginas visitadas e tempo de navegação</li>
                <li>Cookies e tecnologias similares</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>3. Como Usamos Suas Informações</h2>
              <p>Utilizamos as informações coletadas para:</p>
              <ul>
                <li>Processar e entregar seus pedidos</li>
                <li>Enviar confirmações de pedidos e atualizações de entrega</li>
                <li>Processar pagamentos de forma segura</li>
                <li>Responder a suas perguntas e solicitações</li>
                <li>Enviar comunicações de marketing (com seu consentimento)</li>
                <li>Melhorar nosso site e serviços</li>
                <li>Prevenir fraudes e garantir a segurança</li>
                <li>Cumprir obrigações legais</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>4. Compartilhamento de Informações</h2>
              <p>Não vendemos suas informações pessoais. Podemos compartilhar suas informações com:</p>
              <ul>
                <li><strong>Processadores de Pagamento:</strong> PagSeguro para processar transações</li>
                <li><strong>Serviços de Entrega:</strong> Correios e transportadoras para entregar seus pedidos</li>
                <li><strong>Prestadores de Serviços:</strong> Empresas que nos auxiliam na operação do site</li>
                <li><strong>Autoridades Legais:</strong> Quando exigido por lei ou para proteger nossos direitos</li>
              </ul>
            </section>

            <section className="policy-section">
              <h2>5. Cookies</h2>
              <p>
                Utilizamos cookies e tecnologias similares para melhorar sua experiência em nosso site. Cookies são pequenos arquivos armazenados em seu dispositivo que nos ajudam a:
              </p>
              <ul>
                <li>Lembrar suas preferências</li>
                <li>Manter itens no carrinho de compras</li>
                <li>Analisar o tráfego do site</li>
                <li>Personalizar conteúdo e anúncios</li>
              </ul>
              <p>
                Você pode configurar seu navegador para recusar cookies, mas isso pode afetar a funcionalidade do site.
              </p>
            </section>

            <section className="policy-section">
              <h2>6. Segurança dos Dados</h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui:
              </p>
              <ul>
                <li>Criptografia SSL/TLS para transmissão de dados</li>
                <li>Armazenamento seguro de dados</li>
                <li>Acesso restrito a informações pessoais</li>
                <li>Monitoramento regular de segurança</li>
              </ul>
              <p>
                No entanto, nenhum método de transmissão pela internet é 100% seguro, e não podemos garantir segurança absoluta.
              </p>
            </section>

            <section className="policy-section">
              <h2>7. Seus Direitos</h2>
              <p>De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:</p>
              <ul>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos ou desatualizados</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Revogar consentimento para uso de dados</li>
                <li>Solicitar portabilidade de dados</li>
                <li>Opor-se ao processamento de dados</li>
              </ul>
              <p>
                Para exercer esses direitos, entre em contato conosco através do e-mail: contato@mundopetzen.com.br
              </p>
            </section>

            <section className="policy-section">
              <h2>8. Retenção de Dados</h2>
              <p>
                Mantemos suas informações pessoais pelo tempo necessário para cumprir os propósitos descritos nesta política, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
              </p>
            </section>

            <section className="policy-section">
              <h2>9. Menores de Idade</h2>
              <p>
                Nosso site não é direcionado a menores de 18 anos. Não coletamos intencionalmente informações pessoais de crianças. Se você é pai ou responsável e acredita que seu filho nos forneceu informações pessoais, entre em contato conosco.
              </p>
            </section>

            <section className="policy-section">
              <h2>10. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações significativas publicando a nova política em nosso site com uma data de "última atualização" revisada. Recomendamos que você revise esta política regularmente.
              </p>
            </section>

            <section className="policy-section">
              <h2>11. Contato</h2>
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade ou sobre como tratamos seus dados pessoais, entre em contato conosco:
              </p>
              <ul>
                <li><strong>E-mail:</strong> contato@mundopetzen.com.br</li>
                <li><strong>Telefone:</strong> (11) 99999-9999</li>
                <li><strong>Endereço:</strong> São Paulo - SP, Brasil</li>
              </ul>
            </section>
          </div>
        </section>
      </div>

      <style jsx>{`
        .policy-content {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          padding: 3rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .policy-section {
          margin-bottom: 2.5rem;
        }
        
        .policy-section:last-child {
          margin-bottom: 0;
        }
        
        .policy-section h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #4a90a4;
        }
        
        .policy-section h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #2d3748;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .policy-section p {
          color: #4a5568;
          line-height: 1.8;
          margin-bottom: 1rem;
        }
        
        .policy-section ul {
          list-style: disc;
          padding-left: 2rem;
          margin-bottom: 1rem;
        }
        
        .policy-section li {
          color: #4a5568;
          line-height: 1.8;
          margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .policy-content {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
