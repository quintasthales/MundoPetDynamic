// src/app/api/pagseguro/create-session/route.ts
import { NextResponse } from 'next/server';

const PAGSEGURO_BASE_URL = process.env.NEXT_PUBLIC_PAGSEGURO_ENV === 'sandbox' 
  ? process.env.PAGSEGURO_SANDBOX_URL 
  : process.env.PAGSEGURO_PRODUCTION_URL;

const PAGSEGURO_EMAIL = process.env.PAGSEGURO_EMAIL;
const PAGSEGURO_TOKEN = process.env.PAGSEGURO_TOKEN;

export async function POST(request: Request) {
  console.log("Creating PagSeguro session...");
  
  // Validate environment variables
  if (!PAGSEGURO_BASE_URL || !PAGSEGURO_EMAIL || !PAGSEGURO_TOKEN) {
    console.error("PagSeguro credentials not configured");
    console.error({
      hasUrl: !!PAGSEGURO_BASE_URL,
      hasEmail: !!PAGSEGURO_EMAIL,
      hasToken: !!PAGSEGURO_TOKEN
    });
    return NextResponse.json({ 
      error: 'Server configuration error. Check environment variables.' 
    }, { status: 500 });
  }

  try {
    // Build URL with credentials
    const url = `${PAGSEGURO_BASE_URL}/v2/sessions?email=${encodeURIComponent(PAGSEGURO_EMAIL)}&token=${encodeURIComponent(PAGSEGURO_TOKEN)}`;
    
    console.log("Calling PagSeguro API...");
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml;charset=ISO-8859-1'
      }
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('PagSeguro API error:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText
      });
      
      // Try to extract error message from XML
      const errorMatch = responseText.match(/<message>(.*?)<\/message>/);
      const errorMessage = errorMatch ? errorMatch[1] : 'Failed to create payment session';
      
      return NextResponse.json({ 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? responseText : undefined
      }, { status: response.status });
    }

    // Extract session ID from XML response
    const sessionIdMatch = responseText.match(/<id>(.*?)<\/id>/);
    const sessionId = sessionIdMatch ? sessionIdMatch[1] : null;

    if (!sessionId) {
      console.error('No session ID found in PagSeguro response:', responseText);
      return NextResponse.json({ 
        error: 'Invalid response from payment gateway' 
      }, { status: 500 });
    }

    console.log("✓ Session created successfully:", sessionId);
    return NextResponse.json({ sessionId });

  } catch (error: any) {
    console.error('Error creating PagSeguro session:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
