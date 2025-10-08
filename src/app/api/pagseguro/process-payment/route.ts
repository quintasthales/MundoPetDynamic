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
  console.log("Recebida requisição para /api/pagseguro/process-payment");
  
  if (!PAGSEGURO_BASE_URL || !PAGSEGURO_EMAIL || !PAGSEGURO_TOKEN) {
    console.error("Variáveis de ambiente PagSeguro não configuradas");
    return NextResponse.json({ error: 'Configuração interna do servidor incompleta.' }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { paymentMethod, cardToken, senderHash, cart, customerData, shippingData } = body;

    console.log("Dados recebidos - cart:", JSON.stringify(cart));

    if (!paymentMethod || !senderHash || !cart || !customerData) {
      return NextResponse.json({ error: 'Dados incompletos para processar pagamento.' }, { status: 400 });
    }

    // VALIDAR E EXTRAIR ITEMS DO CARRINHO
    const cartItems = cart.items || cart || [];
    const cartTotal = cart.total || 0;
    const cartShipping = cart.shipping || 0;

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Carrinho vazio ou inválido.' }, { status: 400 });
    }

    // Mapear método de pagamento
    const paymentMethodMap: Record<string, string> = {
      'creditCard': 'creditCard',
      'pix': 'eft',
      'boleto': 'boleto'
    };

    const pagseguroPaymentMethod = paymentMethodMap[paymentMethod];
    if (!pagseguroPaymentMethod) {
      return NextResponse.json({ error: 'Método de pagamento inválido.' }, { status: 400 });
    }

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
            value: customerData.cpf?.replace(/\D/g, '') || '00000000000',
          }
        ],
        hash: senderHash,
      },
      items: cartItems.map((item: any, index: number) => ({
        id: String(index + 1),
        description: (item.product?.name || 'Produto').substring(0, 100),
        amount: (item.product?.price || 0).toFixed(2),
        quantity: item.quantity || 1,
      })),
      reference: `PEDIDO_${Date.now()}`,
      redirectURL: process.env.PAGSEGURO_REDIRECT_URL || `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success`,
    };

    if (shippingData) {
      paymentPayload.shipping = {
        addressRequired: true,
        address: {
          street: shippingData.street || 'Endereço não informado',
          number: shippingData.number || 'S/N',
          complement: shippingData.complement || '',
          district: shippingData.district || 'Centro',
          postalCode: shippingData.postalCode?.replace(/\D/g, '') || '00000000',
          city: shippingData.city || 'São Paulo',
          state: shippingData.state || 'SP',
          country: 'BRA',
        },
        type: 3,
        cost: cartShipping.toFixed(2),
      };
    }

    if (paymentMethod === 'creditCard') {
      if (!cardToken) {
        return NextResponse.json({ error: 'Token do cartão não fornecido.' }, { status: 400 });
      }
      
      paymentPayload.creditCard = {
        token: cardToken,
        installment: {
          quantity: 1,
          value: cartTotal.toFixed(2),
          noInterestInstallmentQuantity: 1
        },
        holder: {
          name: customerData.cardHolderName || customerData.name,
          documents: [
            {
              type: 'CPF',
              value: customerData.cpf?.replace(/\D/g, '') || '00000000000',
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

    const xmlPayload = convertToXml(paymentPayload);
    console.log("XML Payload (primeiros 500 chars):", xmlPayload.substring(0, 500));

    const url = `${PAGSEGURO_BASE_URL}/v2/transactions?email=${encodeURIComponent(PAGSEGURO_EMAIL)}&token=${encodeURIComponent(PAGSEGURO_TOKEN)}`;
    
    const pagseguroResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml;charset=ISO-8859-1',
        'Accept': 'application/xml;charset=ISO-8859-1'
      },
      body: xmlPayload
    });

    const responseText = await pagseguroResponse.text();
    console.log("Status PagSeguro:", pagseguroResponse.status);

    if (!pagseguroResponse.ok) {
      console.error("Erro PagSeguro");
      const errorMatch = responseText.match(/<message>(.*?)<\/message>/);
      const errorMessage = errorMatch ? errorMatch[1] : 'Erro ao processar pagamento no PagSeguro.';
      return NextResponse.json({ error: errorMessage }, { status: pagseguroResponse.status });
    }

    const paymentResult: PaymentResponse = { success: true };
    
    const codeMatch = responseText.match(/<code>(.*?)<\/code>/);
    if (codeMatch && codeMatch[1]) {
      paymentResult.transactionCode = codeMatch[1];
    }
    
    const statusMatch = responseText.match(/<status>(.*?)<\/status>/);
    if (statusMatch && statusMatch[1]) {
      paymentResult.status = statusMatch[1];
    }
    
    if (paymentMethod === 'boleto') {
      const linkMatch = responseText.match(/<paymentLink>(.*?)<\/paymentLink>/);
      if (linkMatch && linkMatch[1]) {
        paymentResult.paymentLink = linkMatch[1];
      }
    }
    
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
    return NextResponse.json({ error: error.message || 'Erro interno no servidor.' }, { status: 500 });
  }
}

function convertToXml(obj: Record<string, any>): string {
  let xml = '<?xml version="1.0" encoding="ISO-8859-1" standalone="yes"?>';
  xml += '<payment>';
  
  function objToXml(obj: any, parentTag: string = ''): string {
    let xmlStr = '';
    
    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj)) {
        for (const item of obj) {
          let singularTag = parentTag;
          if (parentTag === 'items') singularTag = 'item';
          else if (parentTag === 'documents') singularTag = 'document';
          else if (parentTag.endsWith('s')) singularTag = parentTag.slice(0, -1);
          
          xmlStr += `<${singularTag}>`;
          xmlStr += objToXml(item, singularTag);
          xmlStr += `</${singularTag}>`;
        }
      } else {
        for (const [key, value] of Object.entries(obj)) {
          if (value === undefined || value === null) continue;
          
          if (typeof value === 'object') {
            xmlStr += `<${key}>`;
            xmlStr += objToXml(value, key);
            xmlStr += `</${key}>`;
          } else {
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
