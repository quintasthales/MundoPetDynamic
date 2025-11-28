// src/app/termos-de-uso/page.tsx - Termos de Uso
"use client";

import { useState, useEffect } from "react";

export default function TermsOfUsePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container">
        <section className="section">
          <h1 className="page-title">Termos de Uso</h1>
          <p className="text-center text-gray-600 mb-8">Última atualização: Novembro de 2024</p>

          <div className="terms-content">
            <section className="terms-section">
              <h2>1. Aceitação dos Termos</h2>
              <p>
                Bem-vindo à MundoPetZen. Ao acessar e usar este site, você aceita e concorda em cumprir estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá usar nosso site.
              </p>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação no site. É sua responsabilidade revisar periodicamente estes termos.
              </p>
            </section>

            <section className="terms-section">
              <h2>2. Uso do Site</h2>
              <h3>2.1 Elegibilidade</h3>
              <p>
                Você deve ter pelo menos 18 anos de idade para fazer compras em nosso site. Ao usar este site, você declara que tem pelo menos 18 anos e capacidade legal para celebrar contratos vinculativos.
              </p>

              <h3>2.2 Conta de Usuário</h3>
              <p>
                Para realizar compras, você pode precisar criar uma conta. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorram em sua conta.
              </p>

              <h3>2.3 Uso Proibido</h3>
              <p>Você concorda em não:</p>
              <ul>
                <li>Usar o site para qualquer finalidade ilegal ou não autorizada</li>
                <li>Violar quaisquer leis locais, estaduais, nacionais ou internacionais</li>
                <li>Transmitir vírus, malware ou qualquer código destrutivo</li>
                <li>Coletar informações de outros usuários sem consentimento</li>
                <li>Interferir ou interromper o funcionamento do site</li>
                <li>Fazer engenharia reversa de qualquer parte do site</li>
              </ul>
            </section>

            <section className="terms-section">
              <h2>3. Produtos e Preços</h2>
              <h3>3.1 Descrição de Produtos</h3>
              <p>
                Fazemos todos os esforços para exibir com precisão as cores, características e detalhes dos produtos. No entanto, não garantimos que as descrições ou outros conteúdos sejam precisos, completos ou livres de erros.
              </p>

              <h3>3.2 Preços</h3>
              <p>
                Todos os preços estão em Reais (R$) e estão sujeitos a alterações sem aviso prévio. Reservamo-nos o direito de modificar ou descontinuar produtos a qualquer momento. Os preços não incluem frete, que será calculado no checkout.
              </p>

              <h3>3.3 Disponibilidade</h3>
              <p>
                Todos os produtos estão sujeitos à disponibilidade. Reservamo-nos o direito de limitar quantidades de qualquer produto ou descontinuar qualquer produto a qualquer momento.
              </p>
            </section>

            <section className="terms-section">
              <h2>4. Pedidos e Pagamento</h2>
              <h3>4.1 Processamento de Pedidos</h3>
              <p>
                Ao fazer um pedido, você concorda em fornecer informações precisas e completas. Reservamo-nos o direito de recusar ou cancelar qualquer pedido por qualquer motivo, incluindo disponibilidade de produto, erros de preço ou suspeita de fraude.
              </p>

              <h3>4.2 Confirmação de Pedido</h3>
              <p>
                Após fazer um pedido, você receberá um e-mail de confirmação. Este e-mail é apenas um reconhecimento de que recebemos seu pedido. A aceitação do pedido e a conclusão do contrato ocorrem quando enviamos o produto.
              </p>

              <h3>4.3 Pagamento</h3>
              <p>
                O pagamento deve ser feito no momento da compra através dos métodos disponíveis (cartão de crédito, boleto ou PIX). Todas as transações são processadas de forma segura pelo PagSeguro.
              </p>
            </section>

            <section className="terms-section">
              <h2>5. Entrega</h2>
              <h3>5.1 Prazos de Entrega</h3>
              <p>
                Os prazos de entrega são estimados e começam a contar após a confirmação do pagamento. Não nos responsabilizamos por atrasos causados por transportadoras ou eventos fora de nosso controle.
              </p>

              <h3>5.2 Frete</h3>
              <p>
                Os custos de frete são calculados com base no peso do produto e no CEP de entrega. Oferecemos frete grátis para compras acima de R$ 150,00.
              </p>

              <h3>5.3 Recebimento</h3>
              <p>
                É sua responsabilidade inspecionar os produtos no momento da entrega. Qualquer dano ou produto errado deve ser relatado imediatamente.
              </p>
            </section>

            <section className="terms-section">
              <h2>6. Trocas e Devoluções</h2>
              <p>
                De acordo com o Código de Defesa do Consumidor, você tem o direito de desistir da compra no prazo de 7 dias corridos a partir do recebimento do produto, sem necessidade de justificativa.
              </p>
              <p>Condições para troca e devolução:</p>
              <ul>
                <li>O produto deve estar em perfeito estado, sem sinais de uso</li>
                <li>Embalagem original intacta</li>
                <li>Todos os acessórios e manuais incluídos</li>
                <li>Nota fiscal original</li>
              </ul>
              <p>
                Para solicitar uma troca ou devolução, entre em contato através do e-mail contato@mundopetzen.com.br ou WhatsApp.
              </p>
            </section>

            <section className="terms-section">
              <h2>7. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo deste site, incluindo textos, gráficos, logos, imagens e software, é propriedade da MundoPetZen ou de seus fornecedores de conteúdo e é protegido por leis de direitos autorais.
              </p>
              <p>
                Você não pode reproduzir, distribuir, modificar ou criar trabalhos derivados de qualquer conteúdo sem nossa permissão expressa por escrito.
              </p>
            </section>

            <section className="terms-section">
              <h2>8. Limitação de Responsabilidade</h2>
              <p>
                Na extensão máxima permitida por lei, a MundoPetZen não será responsável por quaisquer danos indiretos, incidentais, especiais ou consequenciais resultantes do uso ou incapacidade de usar nosso site ou produtos.
              </p>
              <p>
                Nossa responsabilidade total não excederá o valor pago pelo produto em questão.
              </p>
            </section>

            <section className="terms-section">
              <h2>9. Indenização</h2>
              <p>
                Você concorda em indenizar e isentar a MundoPetZen de quaisquer reivindicações, danos, obrigações, perdas, responsabilidades, custos ou dívidas resultantes de:
              </p>
              <ul>
                <li>Seu uso do site</li>
                <li>Violação destes Termos de Uso</li>
                <li>Violação de direitos de terceiros</li>
              </ul>
            </section>

            <section className="terms-section">
              <h2>10. Lei Aplicável</h2>
              <p>
                Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. Qualquer disputa relacionada a estes termos será resolvida nos tribunais competentes de São Paulo, SP.
              </p>
            </section>

            <section className="terms-section">
              <h2>11. Contato</h2>
              <p>
                Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
              </p>
              <ul>
                <li><strong>E-mail:</strong> contato@mundopetzen.com.br</li>
                <li><strong>Telefone:</strong> (11) 99999-9999</li>
                <li><strong>Endereço:</strong> São Paulo - SP, Brasil</li>
              </ul>
            </section>

            <section className="terms-section">
              <h2>12. Disposições Gerais</h2>
              <p>
                Se qualquer disposição destes termos for considerada inválida ou inexequível, as disposições restantes permanecerão em pleno vigor e efeito.
              </p>
              <p>
                Nossa falha em fazer cumprir qualquer direito ou disposição destes termos não constituirá uma renúncia a tal direito ou disposição.
              </p>
            </section>
          </div>
        </section>
      </div>

      <style jsx>{`
        .terms-content {
          max-width: 900px;
          margin: 0 auto;
          background: white;
          padding: 3rem;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .terms-section {
          margin-bottom: 2.5rem;
        }
        
        .terms-section:last-child {
          margin-bottom: 0;
        }
        
        .terms-section h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #4a90a4;
        }
        
        .terms-section h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #2d3748;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        
        .terms-section p {
          color: #4a5568;
          line-height: 1.8;
          margin-bottom: 1rem;
        }
        
        .terms-section ul {
          list-style: disc;
          padding-left: 2rem;
          margin-bottom: 1rem;
        }
        
        .terms-section li {
          color: #4a5568;
          line-height: 1.8;
          margin-bottom: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .terms-content {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
