import { NextRequest, NextResponse } from 'next/server';
import productsData from '@/data/products/products.json';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = productsData.find(p => p.id === params.id);
  
  if (!product) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(product);
}
