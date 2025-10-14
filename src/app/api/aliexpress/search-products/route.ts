import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const APP_KEY = process.env.ALIEXPRESS_APP_KEY || '520408';
const APP_SECRET = process.env.ALIEXPRESS_APP_SECRET || 'bJHr3TEO59B8jAdJFzLk2WP4BrHbpAAc';
const API_URL = process.env.ALIEXPRESS_API_URL || 'https://api-sg.aliexpress.com/sync';

function generateSignature(params: Record<string, string>, secret: string): string {
  const sortedKeys = Object.keys(params).sort();
  const signString = sortedKeys.map(key => `${key}${params[key]}`).join('');
  return crypto.createHmac('sha256', secret).update(signString).digest('hex').toUpperCase();
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || 'pet products';
    const page = parseInt(searchParams.get('page') || '1');

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

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`AliExpress API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.aliexpress_affiliate_productquery_response) {
      const products = data.aliexpress_affiliate_productquery_response.resp_result?.result?.products?.product || [];
      
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
      }));

      return NextResponse.json({
        success: true,
        products: formattedProducts,
        total: formattedProducts.length,
      });
    }

    return NextResponse.json({
      success: false,
      products: [],
      error: 'No products found',
    });

  } catch (error) {
    console.error('AliExpress API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      products: [],
    }, { status: 500 });
  }
}
