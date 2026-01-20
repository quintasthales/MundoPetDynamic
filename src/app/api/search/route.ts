import { NextRequest, NextResponse } from 'next/server';
import dropetProducts from '@/data/dropet-products.json';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const brand = searchParams.get('brand');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  
  if (!query && !category && !brand) {
    return NextResponse.json({
      results: [],
      total: 0,
      query: '',
      message: 'Please provide a search query or filter'
    });
  }
  
  let results = [...dropetProducts];
  
  // Search by query
  if (query) {
    const queryLower = query.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(queryLower) ||
      p.description.toLowerCase().includes(queryLower) ||
      p.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
      p.brand?.toLowerCase().includes(queryLower) ||
      p.category.toLowerCase().includes(queryLower)
    );
  }
  
  // Filter by category
  if (category) {
    results = results.filter(p =>
      p.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Filter by brand
  if (brand) {
    results = results.filter(p =>
      p.brand?.toLowerCase() === brand.toLowerCase()
    );
  }
  
  // Filter by price range
  if (minPrice) {
    results = results.filter(p => p.retailPrice >= parseFloat(minPrice));
  }
  if (maxPrice) {
    results = results.filter(p => p.retailPrice <= parseFloat(maxPrice));
  }
  
  // Pagination
  const total = results.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = results.slice(startIndex, endIndex);
  
  return NextResponse.json({
    results: paginatedResults,
    total,
    query,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    filters: {
      category,
      brand,
      minPrice,
      maxPrice
    }
  });
}
