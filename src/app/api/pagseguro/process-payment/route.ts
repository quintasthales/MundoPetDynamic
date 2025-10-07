// src/app/api/pagseguro/process-payment/route.ts
// Fixed version - Endpoint para processar pagamentos (Cartão, Boleto, PIX, etc.)

import { NextRequest, NextResponse } from 'next/server';

// URL base da API PagSeguro (usar sandbox ou produção baseado no .env)
const PAGSEGURO_BASE_URL = process.env.NEXT_PUBLIC_PAGSEGURO_ENV === 'sandbox' 
  ? process.env.PAGSEGURO_SANDBOX_URL 
  : process.env.PAGSEGURO_PRODUCTION_URL;

const PAGSEGURO_EMAIL = process.env.PAGSEGURO_EMAIL;
const PAGSEGURO_TOKEN = process.env.PAGSEGURO_TOKEN;

// Interfaces para tipagem
interface PaymentResponse {
  success: boolean;
  transactionCode?: string;
  status?: string;
  paymentLink?: string;
  pixQrCode?: string;
  pixCode?: string;
  error?: string;
}

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
}

interface Cart {
  items: CartItem[];
  total: number;
  shipping: number;
}

export async function POST(req: NextRequest) {
  console.log("Recebida requisição para /api/pagseguro/process-payment");
  
  if (!PAGSEGURO_BASE_URL || !PAGSEGURO_EMAIL || !PAGSEGURO_TOKEN) {
    console.error("Variáveis de ambiente PagSeguro não configuradas");
    return NextResponse.json({ error: 'Configuração interna do servidor incompleta.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { paymentMethod, cardToken, senderHash, cart, customerData, shippingData } = body;

    // SECURITY: Não logar dados sensíveis em produção
    if (process.env.NODE_ENV === 'development') {
      console.log("Dados recebidos:", { 
        paymentMethod, 
        hasCardToken: !!cardToken, 
        hasSenderHash: !!senderHash,
        itemCount: cart?.items?.length 
      });
    }

    // Validar dados recebidos
    if (!paymentMethod || !senderHash || !cart || !customerData) {
      return NextResponse.json({ error: 'Dados incompletos para processar pagamento.' }, { status: 400 });
    }

    // Mapear método de pagamento para o formato PagSeguro
    const paymentMethodMap: Record<string, string> = {
      'creditCard': 'creditCard',
      'pix': 'eft',
      'boleto': 'boleto'
    };

    const pagseguroPaymentMethod = paymentMethodMap[paymentMethod];
    if (!pagseguroPaymentMethod) {
      return NextResponse.json({ error: 'Método de pagamento inválido.' }, { status: 400 });
    }

    // Construir corpo da requisição para a API PagSeguro
    const paymentPayload: Record<string, any> = {
      paymentMode: 'default',
      paymentMethod: pagseguroPaymentMethod,
      currency: 'BRL',
      notificationURL: process.env.PAGSEGURO_NOTIFICATION_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/api/pagseguro/notify`,
      sender: {
        name: customerData.name,
        email: customerData.email,
        phone: {
          areaCode: customerData.phone?.substring(0, 2) || '11',
          number: customerData.phone?.substring(2) || '999999999',
        },
        documents: [
          {
            type: 'CPF',
            value: sanitizeCPF(customerData.cpf),
          }
        ],
        hash: senderHash,
      },
      items: cart.items.map((item: CartItem, index: number) => ({
        id: String(index + 1),
        description: sanitizeString(item.product.name).substring(0, 100),
        amount: formatAmount(item.product.price),
        quantity: item.quantity,
      })),
      reference: `PEDIDO_${Date.now()}`,
      redirectURL: process.env.PAGSEGURO_REDIRECT_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
    };

    // Adicionar dados de endereço se disponíveis
    if (shippingData) {
      paymentPayload.shipping = {
        addressRequired: true,
        address: {
          street: sanitizeString(shippingData.street || 'Endereço não informado'),
          number: sanitizeString(shippingData.number || 'S/N'),
          complement: sanitizeString(shippingData.complement || ''),
          district: sanitizeString(shippingData.district || 'Centro'),
          postalCode: sanitizeString(shippingData.postalCode?.replace(/\D/g, '') || '00000000'),
          city: sanitizeString(shippingData.city || 'São Paulo'),
          state: sanitizeString(shippingData.state || 'SP'),
          country: 'BRA',
        },
        type: 3, // 3=Outro
        cost: formatAmount(cart.shipping || 0),
      };
    }

    // Ajustes específicos por método de pagamento
    if (paymentMethod === 'creditCard') {
      if (!cardToken) {
        return NextResponse.json({ error: 'Token do cartão não fornecido.' }, { status: 400 });
      }
      
      paymentPayload.creditCard = {
        token: cardToken,
        installment: {
          quantity: 1,
          value: formatAmount(cart.total),
          noInterestInstallmentQuantity: 1
        },
        holder: {
          name: sanitizeString(customerData.cardHolderName || customerData.name),
          documents: [
            {
              type: 'CPF',
              value: sanitizeCPF(customerData.cpf),
            }
          ],
          birthDate: customerData.birthDate || '01/01/1990',
          phone: {
            areaCode: customerData.phone?.substring(0, 2) || '11',
            number: customerData.phone?.substring(2) || '999999999',
          }
        },
        billingAddress: paymentPayload.shipping?.address || {
          street: 'Endereço não informado',
          number: 'S/N',
          complement: '',
          district: 'Centro',
          postalCode: '00000000',
          city: 'São Paulo',
          state: 'SP',
          country: 'BRA',
        }
      };
    } else if (paymentMethod === 'pix') {
      paymentPayload.paymentMethod = 'eft';
      paymentPayload.bankName = 'itau';
    }

    // Converter o payload para XML (PagSeguro V2 usa XML)
    const xmlPayload = convertToXml(paymentPayload);
    
    if (process.env.NODE_ENV === 'development') {
      console.log("XML Payload (primeiros 500 chars):", xmlPayload.substring(0, 500));
    }

    // Construir URL com parâmetros de autenticação
    const url = `${PAGSEGURO_BASE_URL}/v2/transactions?email=${encodeURIComponent(PAGSEGURO_EMAIL)}&token=${encodeURIComponent(PAGSEGURO_TOKEN)}`;
    
    // Enviar requisição para o PagSeguro
    const pagseguroResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml;charset=ISO-8859-1',
        'Accept': 'application/xml;charset=ISO-8859-1'
      },
      body: xmlPayload
    });

    const responseText = await pagseguroResponse.text();
    
    if (process.env.NODE_ENV === 'development') {
      console.log("Status da resposta PagSeguro:", pagseguroResponse.status);
    }

    if (!pagseguroResponse.ok) {
      console.error("Erro na API PagSeguro - Status:", pagseguroResponse.status);
      const errorMatch = responseText.match(/<message>(.*?)<\/message>/);
      const errorMessage = errorMatch ? errorMatch[1] : 'Erro ao processar pagamento no PagSeguro.';
      return NextResponse.json({ error: errorMessage }, { status: pagseguroResponse.status });
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
    
    // Extrair status da transação
    const statusMatch = responseText.match(/<status>(.*?)<\/status>/);
    if (statusMatch && statusMatch[1]) {
      paymentResult.status = statusMatch[1];
    }
    
    // Extrair link de pagamento (para boleto)
    if (paymentMethod === 'boleto') {
      const linkMatch = responseText.match(/<paymentLink>(.*?)<\/paymentLink>/);
      if (linkMatch && linkMatch[1]) {
        paymentResult.paymentLink = linkMatch[1];
      }
    }
    
    // Extrair informações de PIX (se disponível)
    if (paymentMethod === 'pix') {
      const pixQrCodeMatch = responseText.match(/<qrCode[^>]*><!\[CDATA\[(.*?)\]\]><\/qrCode>/);
      const pixCodeMatch = responseText.match(/<emv><!\[CDATA\[(.*?)\]\]><\/emv>/);
      
      if (pixQrCodeMatch && pixQrCodeMatch[1]) {
        paymentResult.pixQrCode = pixQrCodeMatch[1];
      }
      
      if (pixCodeMatch && pixCodeMatch[1]) {
        paymentResult.pixCode = pixCodeMatch[1];
      }
    }

    return NextResponse.json(paymentResult);

  } catch (error: any) {
    console.error("Erro interno no endpoint /api/pagseguro/process-payment:", error.message);
    return NextResponse.json({ 
      error: error.message || 'Erro interno no servidor.' 
    }, { status: 500 });
  }
}

// Funções auxiliares de sanitização
function sanitizeString(str: string): string {
  if (!str) return '';
  return str
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/&/g, '&amp;')
    .trim();
}

function sanitizeCPF(cpf: string | undefined): string {
  if (!cpf) return '00000000000';
  const cleaned = cpf.replace(/\D/g, '');
  return cleaned.length === 11 ? cleaned : '00000000000';
}

function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

// Função auxiliar para converter objeto para XML
function convertToXml(obj: Record<string, any>): string {
  let xml = '<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>';
  xml += '<payment>';
  
  // Função recursiva para converter objeto para XML
  function objToXml(obj: any, parentTag: string = ''): string {
    let xmlStr = '';
    
    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj)) {
        // Array
        for (const item of obj) {
          // Usar tag singular para itens de array
          let singularTag = parentTag;
          if (parentTag === 'items') singularTag = 'item';
          else if (parentTag === 'documents') singularTag = 'document';
          else if (parentTag.endsWith('s')) singularTag = parentTag.slice(0, -1);
          
          xmlStr += `<${singularTag}>`;
          xmlStr += objToXml(item, singularTag);
          xmlStr += `</${singularTag}>`;
        }
      } else {
        // Objeto
        for (const [key, value] of Object.entries(obj)) {
          if (value === undefined || value === null) continue;
          
          if (typeof value === 'object') {
            xmlStr += `<${key}>`;
            xmlStr += objToXml(value, key);
            xmlStr += `</${key}>`;
          } else {
            // Escapar caracteres especiais XML
            const escapedValue = String(value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&apos;');
            xmlStr += `<${key}>${escapedValue}</${key}>`;
          }
        }
      }
    } else if (obj !== undefined && obj !== null) {
      // Valor primitivo
      const escapedValue = String(obj)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
      xmlStr += escapedValue;
    }
    
    return xmlStr;
  }
  
  xml += objToXml(obj);
  xml += '</payment>';
  
  return xml;
}
