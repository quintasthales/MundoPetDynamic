// Advanced Search and Discovery Engine

export interface SearchQuery {
  query: string;
  filters?: SearchFilters;
  sort?: SearchSort;
  pagination?: {
    page: number;
    limit: number;
  };
  facets?: string[];
  boost?: SearchBoost;
}

export interface SearchFilters {
  category?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  brand?: string[];
  rating?: number; // minimum rating
  inStock?: boolean;
  onSale?: boolean;
  freeShipping?: boolean;
  attributes?: Record<string, string[]>;
  tags?: string[];
}

export interface SearchSort {
  field: string;
  order: "asc" | "desc";
}

export interface SearchBoost {
  popularProducts?: number;
  newProducts?: number;
  highRated?: number;
  personalizedResults?: number;
}

export interface SearchResult {
  products: ProductSearchResult[];
  facets: SearchFacet[];
  suggestions: string[];
  didYouMean?: string;
  totalResults: number;
  searchTime: number; // ms
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductSearchResult {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  category: string;
  brand: string;
  tags: string[];
  relevanceScore: number;
  highlights?: string[]; // matched text snippets
}

export interface SearchFacet {
  field: string;
  label: string;
  values: FacetValue[];
}

export interface FacetValue {
  value: string;
  label: string;
  count: number;
  selected: boolean;
}

// Search Engine
export class SearchEngine {
  private index: Map<string, ProductIndex> = new Map();
  private synonyms: Map<string, string[]> = new Map();
  private stopWords: Set<string> = new Set(["o", "a", "de", "da", "do", "para", "com"]);
  
  // Index Product
  indexProduct(product: any): void {
    const tokens = this.tokenize(product.name + " " + product.description);
    
    const productIndex: ProductIndex = {
      id: product.id,
      tokens,
      category: product.category,
      brand: product.brand,
      price: product.price,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      inStock: product.stock > 0,
      popularity: product.sales || 0,
      createdAt: product.createdAt || new Date(),
    };
    
    this.index.set(product.id, productIndex);
  }
  
  // Search
  search(query: SearchQuery): SearchResult {
    const startTime = Date.now();
    
    // Tokenize query
    const queryTokens = this.tokenize(query.query);
    
    // Find matching products
    let results: Array<{ productId: string; score: number }> = [];
    
    this.index.forEach((productIndex, productId) => {
      const score = this.calculateRelevanceScore(
        queryTokens,
        productIndex,
        query.boost
      );
      
      if (score > 0) {
        results.push({ productId, score });
      }
    });
    
    // Apply filters
    if (query.filters) {
      results = this.applyFilters(results, query.filters);
    }
    
    // Sort results
    results = this.sortResults(results, query.sort);
    
    // Pagination
    const page = query.pagination?.page || 1;
    const limit = query.pagination?.limit || 20;
    const startIndex = (page - 1) * limit;
    const paginatedResults = results.slice(startIndex, startIndex + limit);
    
    // Get product details
    const products = paginatedResults.map((r) => this.getProductDetails(r.productId, r.score));
    
    // Generate facets
    const facets = this.generateFacets(results, query.filters);
    
    // Generate suggestions
    const suggestions = this.generateSuggestions(query.query);
    
    const searchTime = Date.now() - startTime;
    
    return {
      products,
      facets,
      suggestions,
      totalResults: results.length,
      searchTime,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(results.length / limit),
      },
    };
  }
  
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 2 && !this.stopWords.has(token));
  }
  
  private calculateRelevanceScore(
    queryTokens: string[],
    productIndex: ProductIndex,
    boost?: SearchBoost
  ): number {
    let score = 0;
    
    // Token matching
    queryTokens.forEach((queryToken) => {
      productIndex.tokens.forEach((productToken) => {
        if (productToken.includes(queryToken) || queryToken.includes(productToken)) {
          score += 10;
        }
        
        // Exact match bonus
        if (productToken === queryToken) {
          score += 20;
        }
        
        // Synonym matching
        const synonyms = this.synonyms.get(queryToken) || [];
        if (synonyms.includes(productToken)) {
          score += 5;
        }
      });
    });
    
    // Apply boosts
    if (boost) {
      if (boost.popularProducts) {
        score += productIndex.popularity * boost.popularProducts * 0.01;
      }
      
      if (boost.newProducts) {
        const daysSinceCreated =
          (Date.now() - productIndex.createdAt.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceCreated < 30) {
          score += boost.newProducts * (1 - daysSinceCreated / 30);
        }
      }
      
      if (boost.highRated) {
        score += productIndex.rating * boost.highRated;
      }
    }
    
    return score;
  }
  
  private applyFilters(
    results: Array<{ productId: string; score: number }>,
    filters: SearchFilters
  ): Array<{ productId: string; score: number }> {
    return results.filter(({ productId }) => {
      const productIndex = this.index.get(productId);
      if (!productIndex) return false;
      
      // Category filter
      if (filters.category && filters.category.length > 0) {
        if (!filters.category.includes(productIndex.category)) return false;
      }
      
      // Price filter
      if (filters.priceRange) {
        if (productIndex.price < filters.priceRange.min) return false;
        if (productIndex.price > filters.priceRange.max) return false;
      }
      
      // Rating filter
      if (filters.rating) {
        if (productIndex.rating < filters.rating) return false;
      }
      
      // Stock filter
      if (filters.inStock !== undefined) {
        if (productIndex.inStock !== filters.inStock) return false;
      }
      
      return true;
    });
  }
  
  private sortResults(
    results: Array<{ productId: string; score: number }>,
    sort?: SearchSort
  ): Array<{ productId: string; score: number }> {
    if (!sort) {
      // Default: sort by relevance score
      return results.sort((a, b) => b.score - a.score);
    }
    
    return results.sort((a, b) => {
      const productA = this.index.get(a.productId);
      const productB = this.index.get(b.productId);
      
      if (!productA || !productB) return 0;
      
      let comparison = 0;
      
      switch (sort.field) {
        case "price":
          comparison = productA.price - productB.price;
          break;
        case "rating":
          comparison = productA.rating - productB.rating;
          break;
        case "popularity":
          comparison = productA.popularity - productB.popularity;
          break;
        case "newest":
          comparison = productA.createdAt.getTime() - productB.createdAt.getTime();
          break;
        default:
          comparison = b.score - a.score;
      }
      
      return sort.order === "asc" ? comparison : -comparison;
    });
  }
  
  private generateFacets(
    results: Array<{ productId: string; score: number }>,
    filters?: SearchFilters
  ): SearchFacet[] {
    const categoryCount = new Map<string, number>();
    const brandCount = new Map<string, number>();
    const priceRanges = [
      { label: "Até R$ 50", min: 0, max: 50, count: 0 },
      { label: "R$ 50 - R$ 100", min: 50, max: 100, count: 0 },
      { label: "R$ 100 - R$ 200", min: 100, max: 200, count: 0 },
      { label: "Acima de R$ 200", min: 200, max: Infinity, count: 0 },
    ];
    
    results.forEach(({ productId }) => {
      const product = this.index.get(productId);
      if (!product) return;
      
      // Category
      categoryCount.set(product.category, (categoryCount.get(product.category) || 0) + 1);
      
      // Brand
      brandCount.set(product.brand, (brandCount.get(product.brand) || 0) + 1);
      
      // Price ranges
      priceRanges.forEach((range) => {
        if (product.price >= range.min && product.price < range.max) {
          range.count++;
        }
      });
    });
    
    const facets: SearchFacet[] = [];
    
    // Category facet
    facets.push({
      field: "category",
      label: "Categoria",
      values: Array.from(categoryCount.entries())
        .map(([value, count]) => ({
          value,
          label: value,
          count,
          selected: filters?.category?.includes(value) || false,
        }))
        .sort((a, b) => b.count - a.count),
    });
    
    // Brand facet
    facets.push({
      field: "brand",
      label: "Marca",
      values: Array.from(brandCount.entries())
        .map(([value, count]) => ({
          value,
          label: value,
          count,
          selected: filters?.brand?.includes(value) || false,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
    });
    
    // Price facet
    facets.push({
      field: "price",
      label: "Preço",
      values: priceRanges.map((range) => ({
        value: `${range.min}-${range.max}`,
        label: range.label,
        count: range.count,
        selected: false,
      })),
    });
    
    return facets;
  }
  
  private generateSuggestions(query: string): string[] {
    // Mock implementation - in production, use ML-based suggestions
    const suggestions = [
      "difusor aromático",
      "difusor ultrassônico",
      "óleo essencial lavanda",
      "kit aromaterapia",
      "vela aromática",
    ];
    
    return suggestions.filter((s) => s.includes(query.toLowerCase())).slice(0, 5);
  }
  
  private getProductDetails(productId: string, relevanceScore: number): ProductSearchResult {
    // Mock implementation - in production, fetch from database
    return {
      id: productId,
      name: "Difusor Aromático Premium",
      description: "Difusor ultrassônico com LED e timer",
      price: 129.9,
      images: ["/products/difusor.jpg"],
      rating: 4.5,
      reviewCount: 285,
      inStock: true,
      category: "Difusores",
      brand: "ZenLife",
      tags: ["aromatherapy", "wellness"],
      relevanceScore,
    };
  }
  
  // Add Synonyms
  addSynonyms(word: string, synonyms: string[]): void {
    this.synonyms.set(word, synonyms);
  }
}

interface ProductIndex {
  id: string;
  tokens: string[];
  category: string;
  brand: string;
  price: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  popularity: number;
  createdAt: Date;
}

// Visual Search
export interface VisualSearchQuery {
  imageUrl?: string;
  imageData?: string; // base64
  filters?: SearchFilters;
  limit?: number;
}

export interface VisualSearchResult {
  products: ProductSearchResult[];
  similarityScores: number[];
  processingTime: number;
}

export class VisualSearchEngine {
  async search(query: VisualSearchQuery): Promise<VisualSearchResult> {
    const startTime = Date.now();
    
    // Mock implementation - in production, use computer vision API
    const products: ProductSearchResult[] = [
      {
        id: "prod-001",
        name: "Difusor Similar",
        description: "Produto visualmente similar",
        price: 129.9,
        images: ["/products/similar-1.jpg"],
        rating: 4.5,
        reviewCount: 185,
        inStock: true,
        category: "Difusores",
        brand: "ZenLife",
        tags: [],
        relevanceScore: 0.95,
      },
    ];
    
    const processingTime = Date.now() - startTime;
    
    return {
      products,
      similarityScores: [0.95, 0.88, 0.82],
      processingTime,
    };
  }
}

// Voice Search
export interface VoiceSearchQuery {
  audioData: string; // base64
  language: string;
  filters?: SearchFilters;
}

export interface VoiceSearchResult {
  transcription: string;
  searchResults: SearchResult;
  confidence: number;
}

export class VoiceSearchEngine {
  async search(query: VoiceSearchQuery): Promise<VoiceSearchResult> {
    // Mock implementation - in production, use speech-to-text API
    const transcription = "difusor aromático";
    
    const searchEngine = new SearchEngine();
    const searchResults = searchEngine.search({
      query: transcription,
      filters: query.filters,
    });
    
    return {
      transcription,
      searchResults,
      confidence: 0.95,
    };
  }
}

// Search Analytics
export interface SearchAnalytics {
  totalSearches: number;
  uniqueQueries: number;
  avgResultsPerSearch: number;
  avgSearchTime: number;
  zeroResultQueries: {
    query: string;
    count: number;
  }[];
  topQueries: {
    query: string;
    count: number;
    clickThroughRate: number;
  }[];
  topFilters: {
    filter: string;
    usage: number;
  }[];
  conversionRate: number;
}

export function getSearchAnalytics(): SearchAnalytics {
  return {
    totalSearches: 2850000,
    uniqueQueries: 485000,
    avgResultsPerSearch: 28.5,
    avgSearchTime: 85,
    zeroResultQueries: [
      { query: "difusor bluetooth", count: 2850 },
      { query: "óleo essencial canela", count: 1985 },
      { query: "vela led", count: 1650 },
    ],
    topQueries: [
      { query: "difusor", count: 125000, clickThroughRate: 85.5 },
      { query: "óleo lavanda", count: 98500, clickThroughRate: 82.5 },
      { query: "kit aromaterapia", count: 78500, clickThroughRate: 88.5 },
      { query: "vela aromática", count: 65000, clickThroughRate: 75.5 },
      { query: "incenso natural", count: 48500, clickThroughRate: 72.5 },
    ],
    topFilters: [
      { filter: "category:Difusores", usage: 485000 },
      { filter: "priceRange:50-100", usage: 385000 },
      { filter: "inStock:true", usage: 285000 },
      { filter: "freeShipping:true", usage: 185000 },
    ],
    conversionRate: 12.5,
  };
}

// Autocomplete
export interface AutocompleteQuery {
  query: string;
  limit?: number;
}

export interface AutocompleteSuggestion {
  text: string;
  type: "product" | "category" | "brand" | "query";
  metadata?: any;
  popularity: number;
}

export class AutocompleteEngine {
  private trie: TrieNode = new TrieNode();
  
  // Add suggestion
  addSuggestion(text: string, type: AutocompleteSuggestion["type"], popularity: number = 0): void {
    const tokens = text.toLowerCase().split(" ");
    
    tokens.forEach((token, index) => {
      let node = this.trie;
      
      for (const char of token) {
        if (!node.children.has(char)) {
          node.children.set(char, new TrieNode());
        }
        node = node.children.get(char)!;
      }
      
      node.suggestions.push({
        text,
        type,
        popularity,
      });
    });
  }
  
  // Get suggestions
  getSuggestions(query: AutocompleteQuery): AutocompleteSuggestion[] {
    const tokens = query.query.toLowerCase().split(" ");
    const lastToken = tokens[tokens.length - 1];
    
    let node = this.trie;
    
    for (const char of lastToken) {
      if (!node.children.has(char)) {
        return [];
      }
      node = node.children.get(char)!;
    }
    
    // Collect all suggestions from this node and descendants
    const suggestions = this.collectSuggestions(node);
    
    // Sort by popularity and limit
    return suggestions
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, query.limit || 10);
  }
  
  private collectSuggestions(node: TrieNode): AutocompleteSuggestion[] {
    const suggestions = [...node.suggestions];
    
    node.children.forEach((childNode) => {
      suggestions.push(...this.collectSuggestions(childNode));
    });
    
    return suggestions;
  }
}

class TrieNode {
  children: Map<string, TrieNode> = new Map();
  suggestions: AutocompleteSuggestion[] = [];
}

// Discovery Feed
export interface DiscoveryFeed {
  sections: DiscoverySection[];
  personalized: boolean;
  refreshedAt: Date;
}

export interface DiscoverySection {
  id: string;
  title: string;
  type: "trending" | "new" | "recommended" | "curated" | "seasonal";
  products: ProductSearchResult[];
  seeMoreLink?: string;
}

export function generateDiscoveryFeed(userId?: string): DiscoveryFeed {
  return {
    sections: [
      {
        id: "trending",
        title: "Em Alta Agora 🔥",
        type: "trending",
        products: [],
        seeMoreLink: "/trending",
      },
      {
        id: "new",
        title: "Novidades ✨",
        type: "new",
        products: [],
        seeMoreLink: "/novidades",
      },
      {
        id: "recommended",
        title: "Recomendado para Você 💙",
        type: "recommended",
        products: [],
        seeMoreLink: "/recomendados",
      },
      {
        id: "seasonal",
        title: "Coleção Verão ☀️",
        type: "seasonal",
        products: [],
        seeMoreLink: "/colecoes/verao",
      },
    ],
    personalized: !!userId,
    refreshedAt: new Date(),
  };
}
