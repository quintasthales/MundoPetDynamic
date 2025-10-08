"use client";

import { useEffect, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import './checkout.css';

declare var PagSeguroDirectPayment: any;

export default function CheckoutPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("creditCard");
  const [cardBrand, setCardBrand] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const { cart = [], refreshCart } = useCart();

  const isSandbox = process.env.NEXT_PUBLIC_PAGSEGURO_ENV === 'sandbox';

  useEffect(() => {
    setIsClient(true);
    refreshCart();
    createSession();
    loadPagSeguroScript();
  }, []);

  const createSession = async () => {
    try {
      const response = await fetch("/api/pagseguro/create-session", { 
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: cart })
      });
      
      if (!response.ok) {
        throw new Error("Failed to get PagSeguro session ID");
      }
      
      const data = await response.json();
      setSessionId(data.sessionId);
      console.log("✓ Session ID criado:", data.sessionId);
      
      if (typeof PagSeguroDirectPayment !== "undefined") {
        PagSeguroDirectPayment.setSessionId(data.sessionId);
      }
    } catch (error) {
      console.error("Erro ao criar sessão:", error);
      setPaymentError("Erro ao inicializar pagamento. Recarregue a página.");
    }
  };

  const loadPagSeguroScript = () => {
    const script = document.createElement('script');
    const scriptUrl = isSandbox
      ? "https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js"
      : "https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js";
    
    script.src = scriptUrl;
    script.async = true;
    
    script.onload = () => {
      console.log("✓ PagSeguro script carregado");
      setScriptLoaded(true);
      if (sessionId && typeof PagSeguroDirectPayment !== "undefined") {
        PagSeguroDirectPayment.setSessionId(sessionId);
      }
    };
    
    script.onerror = () => {
      console.warn("⚠ Script do PagSeguro não carregou (sandbox pode estar fora). Continuando sem ele...");
      setScriptError(true);
      setScriptLoaded(false);
    };
    
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  };

  const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPaymentError(null);
    setIsProcessing(true);
    
    try {
      if (!sessionId) {
        throw new Error("Sessão de pagamento não foi criada. Recarregue a página.");
      }

      const email = (document.getElementById("email") as HTMLInputElement)?.value;
      const name = (document.getElementById("nomeCompleto") as HTMLInputElement)?.value;
      const cpf = (document.getElementById("cpf") as HTMLInputElement)?.value;
      const cep = (document.getElementById("cep") as HTMLInputElement)?.value;
      const phone = (document.getElementById("phone") as HTMLInputElement)?.value || "11999999999";
      
      if (!email || !name || !cpf || !cep) {
        throw new Error("Por favor, preencha todos os campos obrigatórios.");
      }

      const customerData = {
        name,
        email,
        cpf,
        phone,
      };

      const shippingData = {
        street: (document.getElementById("street") as HTMLInputElement)?.value || "Rua Exemplo",
        number: (document.getElementById("number") as HTMLInputElement)?.value || "123",
        complement: (document.getElementById("complement") as HTMLInputElement)?.value || "",
        district: (document.getElementById("district") as HTMLInputElement)?.value || "Centro",
        city: (document.getElementById("city") as HTMLInputElement)?.value || "São Paulo",
        state: (document.getElementById("state") as HTMLInputElement)?.value || "SP",
        postalCode: cep,
      };

      let senderHash = sessionId;
      if (scriptLoaded && typeof PagSeguroDirectPayment !== "undefined") {
        try {
          senderHash = PagSeguroDirectPayment.getSenderHash();
        } catch (e) {
          console.warn("Não foi possível obter senderHash, usando sessionId");
        }
      }

   
   // LIMPAR CARRINHO - REMOVER REFERÊNCIAS CIRCULARES
const cartItems = Array.isArray(cart) ? cart : (cart?.items || []);

if (!cartItems || cartItems.length === 0) {
  throw new Error("Carrinho vazio. Adicione produtos antes de finalizar a compra.");
}

const cleanCart = {
  items: cartItems.map((item: any) => ({
    product: {
      id: item.product.id,
      name: item.product.name,
      price: item.product.price
    },
    quantity: item.quantity
  })),
  total: calculateTotal(),
  shipping: 0
};

      if (paymentMethod === "creditCard") {
        const cardNumber = (document.getElementById("cardNumber") as HTMLInputElement)?.value;
        const cardCvv = (document.getElementById("cardCvv") as HTMLInputElement)?.value;
        const cardExpirationMonth = (document.getElementById("cardExpirationMonth") as HTMLInputElement)?.value;
        const cardExpirationYear = (document.getElementById("cardExpirationYear") as HTMLInputElement)?.value;
        const cardHolderName = (document.getElementById("cardHolderName") as HTMLInputElement)?.value;

        if (!cardNumber || !cardCvv || !cardExpirationMonth || !cardExpirationYear || !cardHolderName) {
          throw new Error("Por favor, preencha todos os dados do cartão.");
        }

        if (!scriptLoaded || typeof PagSeguroDirectPayment === "undefined") {
          console.warn("Processando sem PagSeguro SDK - modo fallback");
          
          const paymentResponse = await fetch("/api/pagseguro/process-payment", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentMethod,
              senderHash,
              cart: cleanCart,
              customerData: { ...customerData, cardHolderName },
              shippingData,
              fallbackMode: true
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
          return;
        }

        PagSeguroDirectPayment.createCardToken({
          cardNumber,
          brand: cardBrand || 'visa',
          cvv: cardCvv,
          expirationMonth: cardExpirationMonth,
          expirationYear: cardExpirationYear,
          success: async function(response: any) {
            const cardToken = response.card.token;
            
            const paymentResponse = await fetch("/api/pagseguro/process-payment", {
              method: "POST",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentMethod,
                cardToken,
                senderHash,
                cart: cleanCart,
                customerData: { ...customerData, cardHolderName },
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
          },
          error: function(response: any) {
            console.error("Erro ao criar token do cartão:", response);
            setPaymentError("Erro ao processar dados do cartão. Verifique os dados.");
            setIsProcessing(false);
          }
        });
        
      } else if (paymentMethod === "boleto" || paymentMethod === "pix") {
        const paymentResponse = await fetch("/api/pagseguro/process-payment", {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethod,
            senderHash,
            cart: cleanCart,
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
      }
    } catch (error: any) {
      console.error("Erro no pagamento:", error);
      setPaymentError(error.message || "Erro ao processar pagamento.");
      setIsProcessing(false);
    }
  };

  const getCardBrand = (cardNumber: string) => {
    if (cardNumber.length >= 6 && scriptLoaded && typeof PagSeguroDirectPayment !== "undefined") {
      PagSeguroDirectPayment.getBrand({
        cardBin: cardNumber.substring(0, 6),
        success: function(response: any) {
          setCardBrand(response.brand.name);
        },
        error: function(response: any) {
          console.error("Erro ao obter bandeira:", response);
          setCardBrand(null);
        }
      });
    }
  };

  const calculateTotal = () => {
    if (!Array.isArray(cart) || cart.length === 0) return 0;
    return cart.reduce((total: number, item: any) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  if (paymentSuccess) {
    return (
      <div className="payment-success">
        <h1>Pagamento Processado!</h1>
        <div className="success-icon">✅</div>
        <p>Seu pedido foi recebido e está sendo processado.</p>
        <p>Você receberá um e-mail de confirmação em breve.</p>
        
        {paymentMethod === 'boleto' && paymentResult?.paymentLink && (
          <div className="boleto-info">
            <p>Clique para visualizar seu boleto:</p>
            <a href={paymentResult.paymentLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              Visualizar Boleto
            </a>
          </div>
        )}
        
        {paymentMethod === 'pix' && paymentResult?.pixQrCode && (
          <div className="pix-info">
            <p>Escaneie o QR Code para pagar:</p>
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
          ⚠️ AMBIENTE DE TESTES - Transações não são reais
        </div>
      )}

      {scriptError && (
        <div className="warning-message" style={{backgroundColor: '#fff3cd', padding: '1rem', marginBottom: '1rem', borderRadius: '0.5rem'}}>
          ⚠️ Sistema funcionando em modo limitado. Algumas funcionalidades podem não estar disponíveis.
        </div>
      )}
      
      {!sessionId && !paymentError && (
        <div className="loading-payment">
          <p>Carregando sistema de pagamento...</p>
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
              <label htmlFor="email">Email: *</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="nomeCompleto">Nome Completo: *</label>
              <input type="text" id="nomeCompleto" name="nomeCompleto" required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cpf">CPF: *</label>
                <input type="text" id="cpf" name="cpf" placeholder="000.000.000-00" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Telefone: *</label>
                <input type="text" id="phone" name="phone" placeholder="(11) 99999-9999" required />
              </div>
            </div>
          </section>

          <section className="checkout-section">
            <h2>2. Endereço de Entrega</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cep">CEP: *</label>
                <input type="text" id="cep" name="cep" placeholder="00000-000" required />
              </div>
              <div className="form-group">
                <label htmlFor="street">Rua:</label>
                <input type="text" id="street" name="street" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="number">Número:</label>
                <input type="text" id="number" name="number" />
              </div>
              <div className="form-group">
                <label htmlFor="complement">Complemento:</label>
                <input type="text" id="complement" name="complement" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="district">Bairro:</label>
                <input type="text" id="district" name="district" />
              </div>
              <div className="form-group">
                <label htmlFor="city">Cidade:</label>
                <input type="text" id="city" name="city" />
              </div>
              <div className="form-group">
                <label htmlFor="state">Estado:</label>
                <input type="text" id="state" name="state" placeholder="SP" maxLength={2} />
              </div>
            </div>
          </section>

          <section className="checkout-section">
            <h2>3. Método de Pagamento</h2>
            <p className="secure-payment">🔒 Pagamento seguro</p>
            
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
              
              <label className="payment-method-option">
                <input type="radio" name="paymentMethod" value="pix" 
                  checked={paymentMethod === "pix"} 
                  onChange={() => setPaymentMethod("pix")} 
                />
                <span className="payment-method-label">📱 PIX</span>
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
                    placeholder="0000 0000 0000 0000"
                  />
                  {cardBrand && <p className="card-brand-info">Bandeira: {cardBrand}</p>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cardExpirationMonth">Mês:</label>
                    <input type="text" id="cardExpirationMonth" placeholder="MM" maxLength={2} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cardExpirationYear">Ano:</label>
                    <input type="text" id="cardExpirationYear" placeholder="AAAA" maxLength={4} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cardCvv">CVV:</label>
                    <input type="text" id="cardCvv" placeholder="123" maxLength={4} required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="cardHolderName">Nome no Cartão:</label>
                  <input type="text" id="cardHolderName" required placeholder="Como está no cartão" />
                </div>
              </div>
            )}
          </section>

          <button 
            type="submit" 
            className={`checkout-button ${isProcessing ? 'processing' : ''}`}
            disabled={isProcessing || !sessionId}
          >
            {isProcessing ? 'Processando...' : 'Finalizar Compra'}
          </button>
        </form>

        <aside className="order-summary">
          <h2>Resumo do Pedido</h2>
          {isClient && Array.isArray(cart) && cart.length > 0 ? (
            <>
              {cart.map((item: any) => (
                <div key={item.product.id} className="order-item">
                  <span>{item.product.name} x{item.quantity}</span>
                  <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="order-total-line grand-total">
                <span>Total:</span>
                <span>R$ {calculateTotal().toFixed(2)}</span>
              </div>
            </>
          ) : (
            <p>Carrinho vazio</p>
          )}
        </aside>
      </div>
    </div>
  );
}
