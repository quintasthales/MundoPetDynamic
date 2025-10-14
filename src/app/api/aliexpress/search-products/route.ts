// src/app/api/aliexpress/search-products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const APP_KEY = process.env.ALIEXPRESS_APP_KEY;
const APP_SECRET = process.env.ALIEXPRESS_APP_SECRET;
const API_URL = process.env.ALIEXPRESS_API_URL || 'https://api-sg.aliexpress.com/sync';

interface AliExpressProduct {
  product_id: string;
  product_title: string;
  product_main_image_url: string;
  target_sale_price: string;
  target_original_price: string;
  discount: string;
  platform_product_type: string;
}

// Generate API signature for authentication (AliExpress format)
function generateSignature(params: Record<string, any>): string {
  // Remove sign if exists
  const { sign, ...paramsToSign } = params;
  
  // Sort keys alphabetically
  const sortedKeys = Object.keys(paramsToSign).sort();
  
  // Build string: KEY1VALUE1KEY2VALUE2...
  let signString = '';
  for (const key of sortedKeys) {
    signString += key + paramsToSign[key];
  }
  
  // Wrap with APP_SECRET at start and end
  const stringToSign = APP_SECRET + signString + APP_SECRET;
  
  console.log("String to sign:", stringToSign);
  
  // Generate MD5 hash and uppercase
  const hash = crypto
    .createHash('md5')
    .update(stringToSign)
    .digest('hex')
    .toUpperCase();
  
  console.log("Generated signature:", hash);
  
  return hash;
}

export async function GET(request: NextRequest) {
  console.log("=== ALIEXPRESS SEARCH PRODUCTS ===");
  
  if (!APP_KEY || !APP_SECRET) {
    console.error("AliExpress credentials not configured");
    return NextResponse.json(
      { error: 'AliExpress API not configured' },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const keywords = searchParams.get('keywords') || 'pet products';
    const category = searchParams.get('category') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    console.log("Search params:", { keywords, category, page, pageSize });

    // Build API parameters
    const timestamp = Date.now().toString();
    const method = 'aliexpress.ds.recommend.feed.get';
    
    const params: Record<string, string> = {
      app_key: APP_KEY,
      method: method,
      timestamp: timestamp,
      sign_method: 'md5',
      format: 'json',
      v: '2.0',
      feed_name: 'ds_bestselling',
      target_currency: 'BRL',
      target_language: 'PT',
      page_no: page.toString(),
      page_size: pageSize.toString(),
    };

    if (keywords) {
      params.keywords = keywords;
    }

    if (category) {
      params.category_id = category;
    }

    // Generate signature (BEFORE adding sign to params)
    const sign = generateSignature(params);
    params.sign = sign;

    // Build URL
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    const fullUrl = `${API_URL}?${queryString}`;
    
    console.log("Calling AliExpress API...");

    // Call AliExpress API
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log("AliExpress API Response Status:", response.status);

    if (!response.ok) {
      console.error("AliExpress API Error:", data);
      return NextResponse.json(
        { 
          error: 'Failed to fetch products from AliExpress',
          details: data 
        },
        { status: response.status }
      );
    }

    // Check for API errors
    if (data.error_response) {
      console.error("AliExpress Error Response:", data.error_response);
      return NextResponse.json(
        { 
          error: data.error_response.msg || 'AliExpress API error',
          code: data.error_response.code 
        },
        { status: 400 }
      );
    }

    // Extract products from response
    const products = data.aliexpress_ds_recommend_feed_get_response?.result?.products || [];
    
    console.log(`Found ${products.length} products`);

    // Transform products to our format
    const transformedProducts = products.map((product: AliExpressProduct) => ({
      id: product.product_id,
      name: product.product_title,
      image: product.product_main_image_url,
      price: parseFloat(product.target_sale_price || '0'),
      originalPrice: parseFloat(product.target_original_price || '0'),
      discount: product.discount,
      category: 'imported',
      source: 'aliexpress',
      type: product.platform_product_type,
    }));

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      total: products.length,
      page: page,
      pageSize: pageSize,
    });

  } catch (error: any) {
    console.error("Error fetching AliExpress products:", error);
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error',
        stack: error.stack 
      },
      { status: 500 }
    );
  }
}
