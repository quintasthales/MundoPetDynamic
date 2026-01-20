import { NextRequest, NextResponse } from 'next/server';
import dropetProducts from '@/data/dropet-products.json';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = dropetProducts.find(p => p.id === params.id);
  
  if (!product) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }
  
  // Get related products (same category, different product)
  const relatedProducts = dropetProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  
  return NextResponse.json({
    product,
    relatedProducts
  });
}
