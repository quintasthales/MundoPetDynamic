import { NextRequest, NextResponse } from 'next/server';
import productsData from '@/data/products/products.json';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999');
  const brand = searchParams.get('brand');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  
  let results = [...productsData];
  
  // Search by query
  if (query) {
    const queryLower = query.toLowerCase();
    results = results.filter(
      p => p.name.toLowerCase().includes(queryLower) ||
           p.description.toLowerCase().includes(queryLower) ||
           p.brand.toLowerCase().includes(queryLower) ||
           p.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
           p.category.toLowerCase().includes(queryLower)
    );
  }
  
  // Filter by category
  if (category && category !== 'all') {
    results = results.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Filter by price range
  results = results.filter(
    p => p.price >= minPrice && p.price <= maxPrice
  );
  
  // Filter by brand
  if (brand) {
    results = results.filter(
      p => p.brand.toLowerCase() === brand.toLowerCase()
    );
  }
  
  // Get unique brands and categories from results
  const brands = [...new Set(results.map(p => p.brand))].sort();
  const categories = [...new Set(results.map(p => p.category))].sort();
  
  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = results.slice(startIndex, endIndex);
  
  return NextResponse.json({
    query,
    results: paginatedResults,
    pagination: {
      page,
      limit,
      total: results.length,
      totalPages: Math.ceil(results.length / limit),
    },
    filters: {
      brands,
      categories,
      priceRange: {
        min: Math.min(...results.map(p => p.price)),
        max: Math.max(...results.map(p => p.price)),
      },
    },
  });
}
