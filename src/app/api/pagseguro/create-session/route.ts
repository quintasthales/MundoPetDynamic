import { NextRequest, NextResponse } from 'next/server';

const PAGSEGURO_BASE_URL = process.env.NEXT_PUBLIC_PAGSEGURO_ENV === 'sandbox' 
  ? process.env.PAGSEGURO_SANDBOX_URL 
  : process.env.PAGSEGURO_PRODUCTION_URL;

const PAGSEGURO_EMAIL = process.env.PAGSEGURO_EMAIL;
const PAGSEGURO_TOKEN = process.env.PAGSEGURO_TOKEN;

export async function POST(request: NextRequest) {
  console.log("Iniciando criação de sessão PagSeguro");

  if (!PAGSEGURO_BASE_URL || !PAGSEGURO_EMAIL || !PAGSEGURO_TOKEN) {
    console.error("Variáveis de ambiente PagSeguro não configuradas");
    return NextResponse.json(
      { error: 'Configuração do PagSeguro incompleta no servidor.' },
      { status: 500 }
    );
  }

  try {
    const url = `${PAGSEGURO_BASE_URL}/v2/sessions?email=${encodeURIComponent(PAGSEGURO_EMAIL)}&token=${encodeURIComponent(PAGSEGURO_TOKEN)}`;
    
    console.log("Chamando API PagSeguro para criar sessão...");

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml;charset=ISO-8859-1',
        'Accept': 'application/xml;charset=ISO-8859-1'
      }
    });

    const responseText = await response.text();
    console.log("Resposta do PagSeguro:", responseText.substring(0, 200));

    if (!response.ok) {
      console.error("Erro na API PagSeguro:", responseText);
      const errorMatch = responseText.match(/<message>(.*?)<\/message>/);
      const errorMessage = errorMatch ? errorMatch[1] : 'Erro ao criar sessão no PagSeguro';
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const sessionIdMatch = responseText.match(/<id>(.*?)<\/id>/);
    
    if (!sessionIdMatch || !sessionIdMatch[1]) {
      console.error("Session ID não encontrado na resposta");
      return NextResponse.json(
        { error: 'Não foi possível obter o ID da sessão do PagSeguro' },
        { status: 500 }
      );
    }

    const sessionId = sessionIdMatch[1];
    console.log("Sessão PagSeguro criada com sucesso:", sessionId);

    return NextResponse.json({ sessionId });

  } catch (error: any) {
    console.error("Erro ao criar sessão PagSeguro:", error);
    return NextResponse.json(
      { error: error.message || 'Erro interno ao criar sessão de pagamento' },
      { status: 500 }
    );
  }
}
