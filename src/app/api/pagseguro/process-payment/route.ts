// /home/ubuntu/dropshipping_site_china_brasil/src/app/api/pagseguro/process-payment/route.ts
// Endpoint para processar pagamentos (Cartão, Boleto, PIX, etc.)

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
  paymentLink?: string;  // Adicionado para boleto
  pixQrCode?: string;    // Adicionado para PIX
  pixCode?: string;      // Adicionado para PIX
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

    console.log("Dados recebidos:", { paymentMethod, cardToken, senderHash, cart, customerData });

    // Validar dados recebidos
    if (!paymentMethod || !senderHash || !cart || !customerData) {
      return NextResponse.json({ error: 'Dados incompletos para processar pagamento.' }, { status: 400 });
    }

    // Construir corpo da requisição para a API PagSeguro
    const paymentPayload: Record<string, any> = {
      paymentMode: 'default',
      paymentMethod: paymentMethod === 'creditCard' ? 'creditCard' : paymentMethod === 'pix' ? 'eft' : 'boleto',
      currency: 'BRL',
      notificationURL: process.env.PAGSEGURO_NOTIFICATION_URL,
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
      items: cart.items.map((item: any) => ({
        id: item.product.id,
        description: item.product.name.substring(0, 100),
        amount: item.product.price.toFixed(2),
        quantity: item.quantity,
      })),
      reference: `PEDIDO_${new Date().getTime()}`,
      redirectURL: process.env.PAGSEGURO_REDIRECT_URL,
    };

    // Adicionar dados de endereço se disponíveis
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
        type: 3, // 3=Outro
        cost: cart.shipping.toFixed(2),
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
          value: cart.total.toFixed(2),
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
      // Configuração específica para PIX (usando eft como método)
      paymentPayload.paymentMethod = 'eft';
      paymentPayload.bankName = 'itau';
    }

    // Converter o payload para XML (PagSeguro V2 usa XML)
    const xmlPayload = convertToXml(paymentPayload);
    console.log("XML Payload:", xmlPayload);

    // Construir URL com parâmetros de autenticação
    const url = `${PAGSEGURO_BASE_URL}/v2/transactions?email=${PAGSEGURO_EMAIL}&token=${PAGSEGURO_TOKEN}`;
    
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
    console.log("Resposta PagSeguro:", responseText);

    if (!pagseguroResponse.ok) {
      console.error("Erro na API PagSeguro:", responseText);
      // Extrair mensagem de erro do XML
      const errorMatch = responseText.match(/<message>(.*?)<\/message>/);
      const errorMessage = errorMatch ? errorMatch[1] : 'Erro ao processar pagamento no PagSeguro.';
      return NextResponse.json({ error: errorMessage }, { status: pagseguroResponse.status });
    }

    // Processar resposta de sucesso
    const paymentResult: PaymentResponse = { 
      success: true,
      transactionCode: undefined,
      status: undefined,
      paymentLink: undefined,
      pixQrCode: undefined,
      pixCode: undefined,
      error: undefined
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
      // Nota: O formato exato da resposta para PIX pode variar
      const pixQrCodeMatch = responseText.match(/<qrCode>(.*?)<\/qrCode>/);
      const pixCodeMatch = responseText.match(/<code>(.*?)<\/code>/);
      
      if (pixQrCodeMatch && pixQrCodeMatch[1]) {
        paymentResult.pixQrCode = pixQrCodeMatch[1];
      }
      
      if (pixCodeMatch && pixCodeMatch[1]) {
        paymentResult.pixCode = pixCodeMatch[1];
      }
    }

    return NextResponse.json(paymentResult);

  } catch (error: any) {
    console.error("Erro interno no endpoint /api/pagseguro/process-payment:", error);
    return NextResponse.json({ error: error.message || 'Erro interno no servidor.' }, { status: 500 });
  }
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
          const singularTag = parentTag.endsWith('s') 
            ? parentTag.slice(0, -1) 
            : parentTag;
          xmlStr += `<${singularTag}>`;
          xmlStr += objToXml(item);
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
            xmlStr += `<${key}>${value}</${key}>`;
          }
        }
      }
    } else {
      // Valor primitivo
      xmlStr += obj;
    }
    
    return xmlStr;
  }
  
  xml += objToXml(obj);
  xml += '</payment>';
  
  return xml;
}
