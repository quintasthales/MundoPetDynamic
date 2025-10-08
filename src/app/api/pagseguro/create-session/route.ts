// src/app/api/pagseguro/create-session/route.ts
import { NextRequest, NextResponse } from 'next/server';

const PAGSEGURO_BASE_URL = process.env.NEXT_PUBLIC_PAGSEGURO_ENV === 'sandbox' 
  ? process.env.PAGSEGURO_SANDBOX_URL 
  : process.env.PAGSEGURO_PRODUCTION_URL;

const PAGSEGURO_EMAIL = process.env.PAGSEGURO_EMAIL;
const PAGSEGURO_TOKEN = process.env.PAGSEGURO_TOKEN;

export async function POST(request: NextRequest) {
  console.log("=== CRIANDO SESSÃO PAGSEGURO ===");

  // Validar configurações
  if (!PAGSEGURO_BASE_URL || !PAGSEGURO_EMAIL || !PAGSEGURO_TOKEN) {
    console.error("Variáveis de ambiente PagSeguro não configuradas:", {
      PAGSEGURO_BASE_URL: !!PAGSEGURO_BASE_URL,
      PAGSEGURO_EMAIL: !!PAGSEGURO_EMAIL,
      PAGSEGURO_TOKEN: !!PAGSEGURO_TOKEN
    });
    return NextResponse.json(
      { error: 'Configuração do PagSeguro incompleta no servidor.' },
      { status: 500 }
    );
  }

  try {
    // Construir URL para criar sessão
    const url = `${PAGSEGURO_BASE_URL}/v2/sessions?email=${encodeURIComponent(PAGSEGURO_EMAIL)}&token=${encodeURIComponent(PAGSEGURO_TOKEN)}`;
    
    console.log("URL da API PagSeguro:", url.replace(PAGSEGURO_TOKEN, '***TOKEN***'));
    console.log("Email:", PAGSEGURO_EMAIL);
    console.log("Chamando API PagSeguro para criar sessão...");

    // Fazer requisição para o PagSeguro
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=ISO-8859-1'
      }
    });

    const responseText = await response.text();
    console.log("Status da resposta:", response.status);
    console.log("Resposta do PagSeguro (primeiros 500 chars):", responseText.substring(0, 500));

    if (!response.ok) {
      console.error("Erro na API PagSeguro - Status:", response.status);
      console.error("Resposta completa:", responseText);
      
      // Tentar extrair mensagem de erro do XML
      const errorMatch = responseText.match(/<message>(.*?)<\/message>/);
      const errorMessage = errorMatch ? errorMatch[1] : 'Erro ao criar sessão no PagSeguro';
      
      // Erro específico de credenciais
      if (response.status === 401 || response.status === 403) {
        return NextResponse.json(
          { error: 'Credenciais PagSeguro inválidas. Verifique email e token.' },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: errorMessage, details: responseText },
        { status: response.status }
      );
    }

    // Extrair session ID do XML
    const sessionIdMatch = responseText.match(/<id>(.*?)<\/id>/);
    
    if (!sessionIdMatch || !sessionIdMatch[1]) {
      console.error("Session ID não encontrado na resposta");
      console.error("XML recebido:", responseText);
      return NextResponse.json(
        { error: 'Não foi possível obter o ID da sessão do PagSeguro', details: responseText },
        { status: 500 }
      );
    }

    const sessionId = sessionIdMatch[1];
    console.log("✅ Sessão PagSeguro criada com sucesso!");
    console.log("Session ID:", sessionId);

    return NextResponse.json({ sessionId });

  } catch (error: any) {
    console.error("Erro ao criar sessão PagSeguro:", error);
    console.error("Stack:", error.stack);
    return NextResponse.json(
      { error: error.message || 'Erro interno ao criar sessão de pagamento', details: error.toString() },
      { status: 500 }
    );
  }
}
