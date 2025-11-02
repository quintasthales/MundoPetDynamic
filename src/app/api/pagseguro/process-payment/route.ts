// src/app/api/pagseguro/process-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';

const PAGSEGURO_BASE_URL = process.env.NEXT_PUBLIC_PAGSEGURO_ENV === 'sandbox' 
  ? process.env.PAGSEGURO_SANDBOX_URL 
  : process.env.PAGSEGURO_PRODUCTION_URL;

const PAGSEGURO_EMAIL = process.env.PAGSEGURO_EMAIL;
const PAGSEGURO_TOKEN = process.env.PAGSEGURO_TOKEN;

interface PaymentResponse {
  success: boolean;
  transactionCode?: string;
  status?: string;
  paymentLink?: string;
  pixQrCode?: string;
  pixCode?: string;
  error?: string;
}

export async function POST(req: NextRequest) {
  console.log("=== INICIANDO PROCESSO DE PAGAMENTO ===");
  
  if (!PAGSEGURO_BASE_URL || !PAGSEGURO_EMAIL || !PAGSEGURO_TOKEN) {
    console.error("Variáveis de ambiente PagSeguro não configuradas");
    return NextResponse.json({ error: 'Configuração interna do servidor incompleta.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { paymentMethod, cardToken, senderHash, cart, customerData, shippingData } = body;

    console.log("Dados recebidos:", {
      paymentMethod,
      hasCardToken: !!cardToken,
      hasSenderHash: !!senderHash,
      cartType: typeof cart,
      isCartArray: Array.isArray(cart),
      hasCartItems: cart?.items ? 'yes' : 'no',
      customerName: customerData?.name
    });

    // Validações
    if (!paymentMethod || !senderHash || !cart || !customerData) {
      return NextResponse.json({ error: 'Dados incompletos para processar pagamento.' }, { status: 400 });
    }

    console.log("Estrutura do carrinho recebida:", JSON.stringify(cart, null, 2));

    // Normalizar estrutura do carrinho
    let cartItems = [];
    let cartTotal = 0;
    let cartShipping = 0;
    
    // Caso 1: cart.items.items (estrutura duplicada)
    if (cart.items && cart.items.items && Array.isArray(cart.items.items)) {
      cartItems = cart.items.items;
      cartTotal = cart.items.total || 0;
      cartShipping = cart.items.shipping || 0;
    }
    // Caso 2: cart.items é array
    else if (cart.items && Array.isArray(cart.items)) {
      cartItems = cart.items;
      cartTotal = cart.total || 0;
      cartShipping = cart.shipping || 0;
    }
    // Caso 3: cart é o array direto
    else if (Array.isArray(cart)) {
      cartItems = cart;
    }
    else {
      console.error("Estrutura do carrinho não reconhecida:", cart);
      return NextResponse.json({ error: 'Estrutura do carrinho inválida.' }, { status: 400 });
    }

    if (cartItems.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio.' }, { status: 400 });
    }

    console.log("Itens processados:", cartItems.length);
    console.log("Total:", cartTotal);
    console.log("Frete:", cartShipping);

    // Construir XML manualmente (formato correto PagSeguro V2)
    let xmlPayload = '<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>\n';
    xmlPayload += '<payment>\n';
    xmlPayload += '  <mode>default</mode>\n';
    xmlPayload += '  <method>' + (paymentMethod === 'creditCard' ? 'creditCard' : 'boleto') + '</method>\n';
    xmlPayload += '  <currency>BRL</currency>\n';
    
    // Remetente
    // Extrair código de área e número do telefone
    const cleanPhone = (customerData.phone || '11999999999').replace(/\D/g, '');
    const areaCode = cleanPhone.substring(0, 2) || '11';
    const phoneNumber = cleanPhone.substring(2) || '999999999';
    
    xmlPayload += '  <sender>\n';
    xmlPayload += '    <name>' + escapeXml(customerData.name) + '</name>\n';
    xmlPayload += '    <email>' + escapeXml(customerData.email) + '</email>\n';
    xmlPayload += '    <phone>\n';
    xmlPayload += '      <areaCode>' + areaCode + '</areaCode>\n';
    xmlPayload += '      <number>' + phoneNumber + '</number>\n';
    xmlPayload += '    </phone>\n';
    xmlPayload += '    <documents>\n';
    xmlPayload += '      <document>\n';
    xmlPayload += '        <type>CPF</type>\n';
    xmlPayload += '        <value>' + (customerData.cpf?.replace(/\D/g, '') || '00000000000') + '</value>\n';
    xmlPayload += '      </document>\n';
    xmlPayload += '    </documents>\n';
    xmlPayload += '    <hash>' + senderHash + '</hash>\n';
    xmlPayload += '  </sender>\n';
    
    // Itens do carrinho
    xmlPayload += '  <items>\n';
    cartItems.forEach((item: any, index: number) => {
      const product = item.product || item; // Suporta ambos os formatos
      const quantity = item.quantity || 1;
      const price = product.price || 0;
      
      xmlPayload += '    <item>\n';
      xmlPayload += '      <id>' + (index + 1) + '</id>\n';
      xmlPayload += '      <description>' + escapeXml(product.name?.substring(0, 100) || 'Produto') + '</description>\n';
      xmlPayload += '      <amount>' + price.toFixed(2) + '</amount>\n';
      xmlPayload += '      <quantity>' + quantity + '</quantity>\n';
      xmlPayload += '    </item>\n';
    });
    xmlPayload += '  </items>\n';
    
    // Informações adicionais
    xmlPayload += '  <reference>PEDIDO_' + new Date().getTime() + '</reference>\n';
    
    // Endereço de entrega (obrigatório)
    xmlPayload += '  <shipping>\n';
    xmlPayload += '    <address>\n';
    xmlPayload += '      <street>' + escapeXml(shippingData?.street || 'Rua Exemplo') + '</street>\n';
    xmlPayload += '      <number>' + escapeXml(shippingData?.number || '123') + '</number>\n';
    xmlPayload += '      <complement>' + escapeXml(shippingData?.complement || '') + '</complement>\n';
    xmlPayload += '      <district>' + escapeXml(shippingData?.district || 'Centro') + '</district>\n';
    
    // CORREÇÃO: CEP deve ter 8 dígitos
    const postalCode = (shippingData?.postalCode?.replace(/\D/g, '') || '00000000').padEnd(8, '0').substring(0, 8);
    xmlPayload += '      <postalCode>' + postalCode + '</postalCode>\n';
    
    xmlPayload += '      <city>' + escapeXml(shippingData?.city || 'São Paulo') + '</city>\n';
    
    // CORREÇÃO: State deve ser UPPERCASE
    const state = (shippingData?.state || 'SP').toUpperCase();
    xmlPayload += '      <state>' + state + '</state>\n';
    
    xmlPayload += '      <country>BRA</country>\n';
    xmlPayload += '    </address>\n';
    xmlPayload += '    <type>3</type>\n'; // 3 = Outro
    xmlPayload += '    <cost>' + cartShipping.toFixed(2) + '</cost>\n';
    xmlPayload += '  </shipping>\n';
    
    // Configurações específicas para cartão de crédito
    if (paymentMethod === 'creditCard' && cardToken) {
      // Usar valor total calculado
      const totalValue = cartTotal > 0 ? cartTotal : cartItems.reduce((sum, item) => {
        const price = (item.product?.price || item.price || 0);
        const qty = item.quantity || 1;
        return sum + (price * qty);
      }, 0);
      
      xmlPayload += '  <creditCard>\n';
      xmlPayload += '    <token>' + cardToken + '</token>\n';
      xmlPayload += '    <installment>\n';
      xmlPayload += '      <quantity>1</quantity>\n';
      xmlPayload += '      <value>' + totalValue.toFixed(2) + '</value>\n';
      xmlPayload += '    </installment>\n';
      xmlPayload += '    <holder>\n';
      xmlPayload += '      <name>' + escapeXml(customerData.cardHolderName || customerData.name) + '</name>\n';
      xmlPayload += '      <documents>\n';
      xmlPayload += '        <document>\n';
      xmlPayload += '          <type>CPF</type>\n';
      xmlPayload += '          <value>' + (customerData.cpf?.replace(/\D/g, '') || '00000000000') + '</value>\n';
      xmlPayload += '        </document>\n';
      xmlPayload += '      </documents>\n';
      xmlPayload += '      <birthDate>' + (customerData.birthDate || '01/01/1990') + '</birthDate>\n';
      xmlPayload += '      <phone>\n';
      xmlPayload += '        <areaCode>' + areaCode + '</areaCode>\n';
      xmlPayload += '        <number>' + phoneNumber + '</number>\n';
      xmlPayload += '      </phone>\n';
      xmlPayload += '    </holder>\n';
      xmlPayload += '    <billingAddress>\n';
      xmlPayload += '      <street>' + escapeXml(shippingData?.street || 'Rua Exemplo') + '</street>\n';
      xmlPayload += '      <number>' + escapeXml(shippingData?.number || '123') + '</number>\n';
      xmlPayload += '      <complement>' + escapeXml(shippingData?.complement || '') + '</complement>\n';
      xmlPayload += '      <district>' + escapeXml(shippingData?.district || 'Centro') + '</district>\n';
      const billingPostalCode = (shippingData?.postalCode?.replace(/\D/g, '') || '00000000').padEnd(8, '0').substring(0, 8);
      xmlPayload += '      <postalCode>' + billingPostalCode + '</postalCode>\n';
      xmlPayload += '      <city>' + escapeXml(shippingData?.city || 'São Paulo') + '</city>\n';
      const billingState = (shippingData?.state || 'SP').toUpperCase();
      xmlPayload += '      <state>' + billingState + '</state>\n';
      xmlPayload += '      <country>BRA</country>\n';
      xmlPayload += '    </billingAddress>\n';
      xmlPayload += '  </creditCard>\n';
    }
    
    xmlPayload += '</payment>';

    console.log("XML Payload completo:");
    console.log(xmlPayload);

    // Construir URL com autenticação
    const url = `${PAGSEGURO_BASE_URL}/v2/transactions?email=${encodeURIComponent(PAGSEGURO_EMAIL)}&token=${encodeURIComponent(PAGSEGURO_TOKEN)}`;
    
    console.log("Enviando para PagSeguro...");

    // Enviar para PagSeguro
    const pagseguroResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml;charset=ISO-8859-1',
        'Accept': 'application/xml;charset=ISO-8859-1'
      },
      body: xmlPayload
    });

    const responseText = await pagseguroResponse.text();
    console.log("Resposta PagSeguro (status " + pagseguroResponse.status + "):");
    console.log(responseText);

    if (!pagseguroResponse.ok) {
      console.error("Erro na API PagSeguro");
      
      // Tentar extrair mensagem de erro
      const errorMatch = responseText.match(/<message>(.*?)<\/message>/);
      const errorMessage = errorMatch ? errorMatch[1] : responseText;
      
      return NextResponse.json({ 
        error: 'Erro no PagSeguro: ' + errorMessage,
        details: responseText 
      }, { status: pagseguroResponse.status });
    }

    // Processar resposta de sucesso
    const paymentResult: PaymentResponse = { 
      success: true
    };
    
    // Extrair código da transação
    const codeMatch = responseText.match(/<code>(.*?)<\/code>/);
    if (codeMatch && codeMatch[1]) {
      paymentResult.transactionCode = codeMatch[1];
    }
    
    // Extrair status
    const statusMatch = responseText.match(/<status>(.*?)<\/status>/);
    if (statusMatch && statusMatch[1]) {
      paymentResult.status = statusMatch[1];
    }
    
    // Extrair link de pagamento (boleto)
    if (paymentMethod === 'boleto') {
      const linkMatch = responseText.match(/<paymentLink>(.*?)<\/paymentLink>/);
      if (linkMatch && linkMatch[1]) {
        paymentResult.paymentLink = linkMatch[1];
      }
    }

    console.log("=== PAGAMENTO PROCESSADO COM SUCESSO ===");
    console.log("Transaction Code:", paymentResult.transactionCode);

    return NextResponse.json(paymentResult);

  } catch (error: any) {
    console.error("Erro interno:", error);
    return NextResponse.json({ 
      error: error.message || 'Erro interno no servidor.',
      stack: error.stack 
    }, { status: 500 });
  }
}

// Função para escapar caracteres especiais no XML
function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
