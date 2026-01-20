import { NextRequest, NextResponse } from 'next/server';
import dropetProducts from '@/data/dropet-products.json';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
  const brand = searchParams.get('brand');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const search = searchParams.get('search');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  
  let filteredProducts = [...dropetProducts];
  
  // Filter by category
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Filter by brand
  if (brand) {
    filteredProducts = filteredProducts.filter(
      p => p.brand?.toLowerCase() === brand.toLowerCase()
    );
  }
  
  // Filter by price range
  if (minPrice) {
    filteredProducts = filteredProducts.filter(
      p => p.retailPrice >= parseFloat(minPrice)
    );
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(
      p => p.retailPrice <= parseFloat(maxPrice)
    );
  }
  
  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    filteredProducts = filteredProducts.filter(
      p => p.name.toLowerCase().includes(searchLower) ||
           p.description.toLowerCase().includes(searchLower) ||
           p.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
           p.brand?.toLowerCase().includes(searchLower)
    );
  }
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
  
  return NextResponse.json({
    products: paginatedProducts,
    pagination: {
      page,
      limit,
      total: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / limit),
    },
    stats: {
      totalProducts: dropetProducts.length,
      categories: [...new Set(dropetProducts.map(p => p.category))],
      brands: [...new Set(dropetProducts.map(p => p.brand).filter(Boolean))],
    }
  });
}
