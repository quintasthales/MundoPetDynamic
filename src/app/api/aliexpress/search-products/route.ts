import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const APP_KEY = process.env.ALIEXPRESS_APP_KEY || '520408';
const APP_SECRET = process.env.ALIEXPRESS_APP_SECRET || 'bJHr3TEO59B8jAdJFzLk2WP4BrHbpAAc';
const API_URL = process.env.ALIEXPRESS_API_URL || 'https://api-sg.aliexpress.com/sync';

// Produtos de fallback para quando a API não funcionar
const FALLBACK_PRODUCTS = [
  {
    product_id: 'fallback_001',
    product_title: 'Brinquedo Interativo para Pets - Dispensador de Petiscos',
    product_main_image_url: '/images/pet-toy-dispenser.jpg',
    target_sale_price: '45.90',
    target_sale_price_currency: 'BRL',
    target_original_price: '69.90',
    discount: '34%',
    product_detail_url: '#',
    sale_price: 45.90,
    category: 'pets',
    description: 'Brinquedo interativo que estimula a mente do seu pet enquanto dispensa petiscos.'
  },
  {
    product_id: 'fallback_002',
    product_title: 'Cama Ortopédica Premium para Cães e Gatos',
    product_main_image_url: '/images/orthopedic-pet-bed.jpg',
    target_sale_price: '129.90',
    target_sale_price_currency: 'BRL',
    target_original_price: '189.90',
    discount: '32%',
    product_detail_url: '#',
    sale_price: 129.90,
    category: 'pets',
    description: 'Cama ortopédica com espuma viscoelástica para máximo conforto do seu pet.'
  },
  {
    product_id: 'fallback_003',
    product_title: 'Kit Aromaterapia Completo - Difusor + Óleos Essenciais',
    product_main_image_url: '/images/aromatherapy-kit.jpg',
    target_sale_price: '89.90',
    target_sale_price_currency: 'BRL',
    target_original_price: '149.90',
    discount: '40%',
    product_detail_url: '#',
    sale_price: 89.90,
    category: 'wellness',
    description: 'Kit completo para aromaterapia com difusor ultrassônico e óleos essenciais.'
  },
  {
    product_id: 'fallback_004',
    product_title: 'Tapete de Yoga Ecológico Antiderrapante',
    product_main_image_url: '/images/yoga-mat.jpg',
    target_sale_price: '79.90',
    target_sale_price_currency: 'BRL',
    target_original_price: '119.90',
    discount: '33%',
    product_detail_url: '#',
    sale_price: 79.90,
    category: 'wellness',
    description: 'Tapete de yoga feito com materiais sustentáveis e antiderrapante.'
  }
];

function generateSignature(params: Record<string, string>, secret: string): string {
  const sortedKeys = Object.keys(params).sort();
  const signString = sortedKeys.map(key => `${key}${params[key]}`).join('');
  return crypto.createHmac('sha256', secret).update(signString).digest('hex').toUpperCase();
}

async function tryAliExpressAPI(query: string, page: number) {
  try {
    const timestamp = Date.now().toString();
    
    const params: Record<string, string> = {
      app_key: APP_KEY,
      method: 'aliexpress.affiliate.productquery',
      format: 'json',
      v: '2.0',
      sign_method: 'sha256',
      timestamp,
      keywords: query,
      page_no: page.toString(),
      page_size: '20',
      sort: 'default',
      target_currency: 'USD',
      target_language: 'EN',
    };

    const sign = generateSignature(params, APP_SECRET);
    params.sign = sign;

    const queryString = new URLSearchParams(params).toString();
    const fullUrl = `${API_URL}?${queryString}`;

    console.log('🔍 Tentando conectar com AliExpress API...');
    console.log('📍 URL:', fullUrl);
    console.log('🔑 APP_KEY:', APP_KEY);

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 segundos de timeout
    });

    if (!response.ok) {
      throw new Error(`AliExpress API HTTP error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 Resposta da API:', JSON.stringify(data, null, 2));

    if (data.aliexpress_affiliate_productquery_response) {
      const products = data.aliexpress_affiliate_productquery_response.resp_result?.result?.products?.product || [];
      
      if (products.length > 0) {
        console.log('✅ Produtos encontrados na API do AliExpress:', products.length);
        
        const formattedProducts = products.map((product: any) => ({
          product_id: product.product_id,
          product_title: product.product_title,
          product_main_image_url: product.product_main_image_url,
          target_sale_price: product.target_sale_price,
          target_sale_price_currency: product.target_sale_price_currency,
          target_original_price: product.target_original_price,
          discount: product.discount,
          product_detail_url: product.product_detail_url,
          sale_price: parseFloat(product.target_sale_price),
          source: 'aliexpress'
        }));

        return {
          success: true,
          products: formattedProducts,
          total: formattedProducts.length,
          source: 'aliexpress'
        };
      }
    }

    console.log('⚠️ API do AliExpress não retornou produtos');
    return null;

  } catch (error) {
    console.error('❌ Erro na API do AliExpress:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || 'pet products';
    const page = parseInt(searchParams.get('page') || '1');
    const category = searchParams.get('category') || 'all';

    console.log('🔍 Buscando produtos:', { query, page, category });

    // Tentar API do AliExpress primeiro
    const aliexpressResult = await tryAliExpressAPI(query, page);
    
    if (aliexpressResult && aliexpressResult.products.length > 0) {
      console.log('✅ Retornando produtos da API do AliExpress');
      return NextResponse.json(aliexpressResult);
    }

    // Fallback: usar produtos locais
    console.log('🔄 Usando produtos de fallback');
    
    let filteredProducts = FALLBACK_PRODUCTS;
    
    // Filtrar por categoria se especificada
    if (category !== 'all') {
      filteredProducts = FALLBACK_PRODUCTS.filter(product => 
        product.category === category || 
        product.product_title.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Filtrar por query de busca
    if (query && query !== 'pet products') {
      filteredProducts = filteredProducts.filter(product =>
        product.product_title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Paginação simples
    const startIndex = (page - 1) * 20;
    const endIndex = startIndex + 20;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      products: paginatedProducts.map(product => ({
        ...product,
        source: 'fallback'
      })),
      total: paginatedProducts.length,
      source: 'fallback',
      message: 'Usando produtos de demonstração. Configure credenciais válidas do AliExpress para produtos reais.'
    });

  } catch (error) {
    console.error('❌ Erro geral na API:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      products: FALLBACK_PRODUCTS.slice(0, 4).map(product => ({
        ...product,
        source: 'emergency_fallback'
      })),
      total: 4,
      source: 'emergency_fallback',
      message: 'Erro na API. Exibindo produtos de emergência.'
    }, { status: 200 }); // Retorna 200 mesmo com erro para não quebrar o frontend
  }
}
