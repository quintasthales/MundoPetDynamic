"use client";

import { useEffect, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import './checkout.css';

declare var PagSeguroDirectPayment: any;

export default function CheckoutPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("boleto");
  const [cardBrand, setCardBrand] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const { cart, refreshCart } = useCart();

  const isSandbox = process.env.NEXT_PUBLIC_PAGSEGURO_ENV === 'sandbox';

  useEffect(() => {
    setIsClient(true);
    refreshCart();
    
    const script = document.createElement('script');
    const scriptUrl = isSandbox
      ? "https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js"
      : "https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js";
    
    script.src = scriptUrl;
    script.async = true;
    script.onload = async () => {
      console.log("PagSeguro DirectPayment JS loaded.");
      try {
        const response = await fetch("/api/pagseguro/create-session", { 
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ cart: cart })
        });
        
        if (!response.ok) {
          throw new Error("Failed to get PagSeguro session ID");
        }
        
        const data = await response.json();
        setSessionId(data.sessionId);
        console.log("PagSeguro Session ID:", data.sessionId);
        
        if (typeof PagSeguroDirectPayment !== "undefined" && data.sessionId) {
          PagSeguroDirectPayment.setSessionId(data.sessionId);
          console.log("PagSeguro session ID set in DirectPayment.");
        }
      } catch (error) {
        console.error("Error setting up PagSeguro:", error);
        setPaymentError("Erro ao conectar com o gateway de pagamento. Por favor, tente novamente mais tarde.");
      }
    };
    
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [refreshCart]);

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("=== INICIANDO PAGAMENTO ===");
    console.log("Carrinho original:", cart);
    
    setPaymentError(null);
    setIsProcessing(true);
    
    try {
      if (!sessionId || typeof PagSeguroDirectPayment === "undefined") {
        throw new Error("PagSeguro session or DirectPayment not ready.");
      }

      // Obter dados do formulário
      const email = (document.getElementById("email") as HTMLInputElement)?.value;
      const name = (document.getElementById("nomeCompleto") as HTMLInputElement)?.value;
      const cpf = (document.getElementById("cpf") as HTMLInputElement)?.value;
      const cep = (document.getElementById("cep") as HTMLInputElement)?.value;
      
      if (!email || !name || !cpf || !cep) {
        throw new Error("Por favor, preencha todos os campos obrigatórios.");
      }

      // Obter hash do comprador
      let senderHash = '';
      try {
        senderHash = PagSeguroDirectPayment.getSenderHash();
      } catch (error) {
        console.error("Erro ao obter sender hash:", error);
        throw new Error("Não foi possível obter a identificação segura. Recarregue a página e tente novamente.");
      }

      // Dados do cliente
      const customerData = {
        name,
        email,
        cpf,
        phone: "41991960911",
      };

      // Dados de envio
      const shippingData = {
        street: "Rua Exemplo",
        number: "123",
        complement: "",
        district: "Centro",
        city: "São Paulo",
        state: "SP",  // Será convertido para uppercase no backend
        postalCode: cep.replace(/\D/g, ''),  // Remove tudo exceto números
      };

      // CORREÇÃO: Normalizar estrutura do carrinho
      const normalizedCart = {
        items: cart.items || [],
        subtotal: cart.subtotal || 0,
        shipping: cart.shipping || 0,
        total: cart.total || 0
      };

      console.log("Carrinho normalizado:", normalizedCart);

      if (paymentMethod === "creditCard") {
        const cardNumber = (document.getElementById("cardNumber") as HTMLInputElement)?.value;
        const cardCvv = (document.getElementById("cardCvv") as HTMLInputElement)?.value;
        const cardExpirationMonth = (document.getElementById("cardExpirationMonth") as HTMLInputElement)?.value;
        const cardExpirationYear = (document.getElementById("cardExpirationYear") as HTMLInputElement)?.value;
        const cardHolderName = (document.getElementById("cardHolderName") as HTMLInputElement)?.value;

        if (!cardNumber || !cardCvv || !cardExpirationMonth || !cardExpirationYear || !cardHolderName) {
          throw new Error("Por favor, preencha todos os dados do cartão.");
        }

        if (!cardBrand) {
          throw new Error("Aguarde a identificação da bandeira do cartão.");
        }

        PagSeguroDirectPayment.createCardToken({
          cardNumber: cardNumber.replace(/\s/g, ''),
          brand: cardBrand,
          cvv: cardCvv,
          expirationMonth: cardExpirationMonth,
          expirationYear: cardExpirationYear,
          success: async function(response: any) {
            const cardToken = response.card.token;
            console.log("Card Token:", cardToken);
            
            try {
              const paymentResponse = await fetch("/api/pagseguro/process-payment", {
                method: "POST",
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  paymentMethod: "creditCard",
                  cardToken,
                  senderHash,
                  cart: normalizedCart,  // ← AQUI: Carrinho normalizado
                  customerData: {
                    ...customerData,
                    cardHolderName
                  },
                  shippingData
                })
              });
              
              const result = await paymentResponse.json();
              
              if (result.error) {
                setPaymentError(result.error);
                setIsProcessing(false);
                return;
              }
              
              setPaymentResult(result);
              setPaymentSuccess(true);
              setIsProcessing(false);
            } catch (error: any) {
              console.error("Erro ao processar pagamento:", error);
              setPaymentError(error.message || "Erro ao processar pagamento. Tente novamente.");
              setIsProcessing(false);
            }
          },
          error: function(response: any) {
            console.error("Error creating card token:", response);
            setPaymentError("Erro ao processar dados do cartão. Verifique os dados e tente novamente.");
            setIsProcessing(false);
          }
        });
      } else if (paymentMethod === "boleto" || paymentMethod === "pix") {
        try {
          console.log("Enviando para API:", {
            paymentMethod,
            senderHash,
            cart: normalizedCart,  // ← AQUI: Carrinho normalizado
            customerData,
            shippingData
          });

          const paymentResponse = await fetch("/api/pagseguro/process-payment", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              paymentMethod,
              senderHash,
              cart: normalizedCart,  // ← AQUI: Carrinho normalizado
              customerData,
              shippingData
            })
          });
          
          const result = await paymentResponse.json();
          
          if (result.error) {
            setPaymentError(result.error);
            setIsProcessing(false);
            return;
          }
          
          setPaymentResult(result);
          setPaymentSuccess(true);
          setIsProcessing(false);
        } catch (error: any) {
          console.error("Erro ao processar pagamento:", error);
          setPaymentError(error.message || "Erro ao processar pagamento. Tente novamente.");
          setIsProcessing(false);
        }
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setPaymentError(error.message || "Erro ao processar pagamento. Tente novamente.");
      setIsProcessing(false);
    }
  };

  const getCardBrand = (cardNumber: string) => {
    if (cardNumber.length >= 6 && typeof PagSeguroDirectPayment !== "undefined") {
      PagSeguroDirectPayment.getBrand({
        cardBin: cardNumber.substring(0, 6),
        success: function(response: any) {
          console.log("Card Brand:", response.brand.name);
          setCardBrand(response.brand.name);
        },
        error: function(response: any) {
          console.error("Error getting card brand:", response);
          setCardBrand(null);
        }
      });
    }
  };

  if (paymentSuccess) {
    return (
      <div className="payment-success">
        <h1>Pagamento Processado com Sucesso!</h1>
        <div className="success-icon">✅</div>
        <p>Seu pedido foi recebido e está sendo processado.</p>
        <p>Você receberá um e-mail de confirmação em breve.</p>
        
        {paymentMethod === 'boleto' && paymentResult?.paymentLink && (
          <div className="boleto-info">
            <p>Clique no botão abaixo para visualizar e imprimir seu boleto:</p>
            <a href={paymentResult.paymentLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Visualizar Boleto
            </a>
          </div>
        )}
        
        {paymentMethod === 'pix' && paymentResult?.pixQrCode && (
          <div className="pix-info">
            <p>Escaneie o QR Code abaixo para realizar o pagamento via PIX:</p>
            <div className="pix-qrcode">
              <img src={`data:image/png;base64,${paymentResult.pixQrCode}`} alt="QR Code PIX" />
            </div>
            {paymentResult.pixCode && (
              <div className="pix-code">
                <p>Ou copie o código PIX:</p>
                <textarea readOnly value={paymentResult.pixCode}></textarea>
                <button onClick={() => navigator.clipboard.writeText(paymentResult.pixCode)}>
                  Copiar Código
                </button>
              </div>
            )}
          </div>
        )}
        
        <a href="/" className="btn btn-primary">Voltar para a Loja</a>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Finalizar Compra</h1>
      
      {isSandbox && (
        <div className="sandbox-warning">
          ⚠️ AMBIENTE DE TESTES - Nenhuma transação real será processada
        </div>
      )}
      
      {!sessionId && !paymentError && (
        <div className="loading-payment">
          <p>Carregando informações de pagamento...</p>
          <div className="spinner"></div>
        </div>
      )}
      
      {paymentError && (
        <div className="error-message">
          <p>{paymentError}</p>
          <button onClick={() => window.location.reload()}>Tentar Novamente</button>
        </div>
      )}

      <div className="checkout-container">
        <form onSubmit={handlePayment} className="checkout-form">
          <section className="checkout-section">
            <h2>1. Identificação</h2>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" required defaultValue="thales.quintas@gmail.com" />
            </div>
          </section>

          <section className="checkout-section">
            <h2>2. Endereço de Entrega</h2>
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="nomeCompleto">Nome Completo:</label>
                <input type="text" id="nomeCompleto" name="nomeCompleto" required defaultValue="Thales Ferreira Quintas" />
              </div>
              <div className="form-group">
                <label htmlFor="cpf">CPF:</label>
                <input type="text" id="cpf" name="cpf" required defaultValue="06353226926" />
              </div>
              <div className="form-group">
                <label htmlFor="cep">CEP:</label>
                <input type="text" id="cep" name="cep" required defaultValue="82900000" />
              </div>
            </div>
          </section>

          <section className="checkout-section">
            <h2>3. Opção de Frete</h2>
            <p>Frete Padrão Internacional - Grátis - Prazo 15-30 dias</p>
          </section>

          <section className="checkout-section">
            <h2>4. Pagamento</h2>
            <p className="secure-payment">🔒 Todos os pagamentos são processados de forma segura.</p>
            
            <div className="payment-methods">
              <label className="payment-method-option">
                <input type="radio" name="paymentMethod" value="creditCard" 
                  checked={paymentMethod === "creditCard"} 
                  onChange={() => setPaymentMethod("creditCard")} 
                />
                <span className="payment-method-label">💳 Cartão de Crédito</span>
              </label>
              
              <label className="payment-method-option">
                <input type="radio" name="paymentMethod" value="boleto" 
                  checked={paymentMethod === "boleto"} 
                  onChange={() => setPaymentMethod("boleto")} 
                />
                <span className="payment-method-label">📄 Boleto</span>
              </label>
            </div>

            {paymentMethod === "creditCard" && (
              <div className="credit-card-form">
                <h3>Dados do Cartão</h3>
                <div className="form-group">
                  <label htmlFor="cardNumber">Número do Cartão:</label>
                  <input 
                    type="text" 
                    id="cardNumber" 
                    onKeyUp={(e) => getCardBrand((e.target as HTMLInputElement).value)} 
                    required 
                    placeholder="4111 1111 1111 1111"
                  />
                  {cardBrand && <p className="card-brand-info">Bandeira: {cardBrand}</p>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cardExpirationMonth">Mês:</label>
                    <input type="text" id="cardExpirationMonth" placeholder="12" maxLength={2} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cardExpirationYear">Ano:</label>
                    <input type="text" id="cardExpirationYear" placeholder="2030" maxLength={4} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cardCvv">CVV:</label>
                    <input type="text" id="cardCvv" placeholder="123" maxLength={4} required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="cardHolderName">Nome no Cartão:</label>
                  <input type="text" id="cardHolderName" required placeholder="Como está impresso no cartão" />
                </div>
              </div>
            )}
          </section>

          <section className="checkout-section">
            <h2>5. Resumo do Pedido</h2>
            <div className="order-summary">
              {isClient && cart.items && cart.items.length > 0 ? (
                <>
                  <div className="order-items">
                    {cart.items.map((item) => (
                      <div key={item.product.id} className="order-item">
                        <div className="order-item-details">
                          <h4>{item.product.name}</h4>
                          <p>Quantidade: {item.quantity}</p>
                          <p className="order-item-price">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="order-totals">
                    <div className="order-total-row">
                      <span>Subtotal:</span>
                      <span>R$ {cart.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="order-total-row">
                      <span>Frete:</span>
                      <span>R$ {cart.shipping.toFixed(2)}</span>
                    </div>
                    <div className="order-total-row total">
                      <span>Total:</span>
                      <span>R$ {cart.total.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="empty-cart-message">
                  <p>Seu carrinho está vazio</p>
                  <a href="/" className="btn btn-primary">Voltar para a Loja</a>
                </div>
              )}
            </div>
          </section>

          <div className="checkout-actions">
            <button 
              type="submit" 
              className={`checkout-button ${isProcessing ? 'processing' : ''}`}
              disabled={!sessionId || isProcessing || !isClient || !cart.items || cart.items.length === 0}
            >
              {isProcessing ? 'Processando...' : 'Finalizar Pedido e Pagar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
