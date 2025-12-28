// Product Recommendations Engine

import { products } from "./products";

export interface RecommendationContext {
  userId?: string;
  currentProductId?: string;
  cartItems?: string[];
  viewHistory?: string[];
  searchHistory?: string[];
  purchaseHistory?: string[];
}

export interface ProductRecommendation {
  productId: string;
  score: number;
  reason: string;
}

// Collaborative filtering - "Customers who bought this also bought"
export function getCollaborativeRecommendations(
  productId: string,
  limit: number = 4
): ProductRecommendation[] {
  // Mock collaborative data - in production, use actual purchase patterns
  const collaborativeData: Record<string, string[]> = {
    "difusor-aromatico": ["coleira-led", "shampoo-natural", "cama-ortopedica"],
    "coleira-led": ["difusor-aromatico", "peitoral-refletivo", "guia-reforçada"],
    "shampoo-natural": ["condicionador-natural", "escova-massageadora", "toalha-microfibra"],
  };

  const relatedIds = collaborativeData[productId] || [];

  return relatedIds.slice(0, limit).map((id, index) => ({
    productId: id,
    score: 1 - index * 0.1,
    reason: "Clientes que compraram este produto também compraram",
  }));
}

// Content-based filtering - Similar products by category/attributes
export function getContentBasedRecommendations(
  productId: string,
  limit: number = 4
): ProductRecommendation[] {
  const currentProduct = products.find((p) => p.id === productId);
  if (!currentProduct) return [];

  const similar = products
    .filter((p) => p.id !== productId)
    .map((product) => {
      let score = 0;

      // Same category
      if (product.category === currentProduct.category) {
        score += 0.5;
      }

      // Similar price range (within 30%)
      const priceDiff =
        Math.abs(product.price - currentProduct.price) / currentProduct.price;
      if (priceDiff < 0.3) {
        score += 0.3;
      }

      // Similar rating
      if (Math.abs(product.rating - currentProduct.rating) < 0.5) {
        score += 0.2;
      }

      return {
        productId: product.id,
        score,
        reason: "Produtos similares que você pode gostar",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return similar;
}

// Trending products
export function getTrendingProducts(limit: number = 4): ProductRecommendation[] {
  // Mock trending calculation - in production, use actual sales/view data
  return products
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
    .map((product, index) => ({
      productId: product.id,
      score: 1 - index * 0.1,
      reason: "Produtos em alta",
    }));
}

// Personalized recommendations based on user behavior
export function getPersonalizedRecommendations(
  context: RecommendationContext,
  limit: number = 4
): ProductRecommendation[] {
  const recommendations: ProductRecommendation[] = [];

  // Based on view history
  if (context.viewHistory && context.viewHistory.length > 0) {
    const lastViewed = context.viewHistory[context.viewHistory.length - 1];
    const collaborative = getCollaborativeRecommendations(lastViewed, 2);
    recommendations.push(...collaborative);
  }

  // Based on cart items
  if (context.cartItems && context.cartItems.length > 0) {
    context.cartItems.forEach((itemId) => {
      const related = getCollaborativeRecommendations(itemId, 1);
      recommendations.push(...related);
    });
  }

  // Fill with trending if not enough recommendations
  if (recommendations.length < limit) {
    const trending = getTrendingProducts(limit - recommendations.length);
    recommendations.push(...trending);
  }

  // Remove duplicates and limit
  const uniqueRecommendations = recommendations.reduce((acc, current) => {
    const exists = acc.find((item) => item.productId === current.productId);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, [] as ProductRecommendation[]);

  return uniqueRecommendations.slice(0, limit);
}

// Frequently bought together
export function getFrequentlyBoughtTogether(
  productId: string,
  limit: number = 3
): ProductRecommendation[] {
  // Mock data - in production, analyze actual purchase patterns
  const bundles: Record<string, string[]> = {
    "difusor-aromatico": ["oleo-essencial-lavanda", "oleo-essencial-eucalipto"],
    "shampoo-natural": ["condicionador-natural", "escova-massageadora"],
    "coleira-led": ["guia-reforçada", "tag-identificacao"],
  };

  const bundleIds = bundles[productId] || [];

  return bundleIds.slice(0, limit).map((id, index) => ({
    productId: id,
    score: 1 - index * 0.15,
    reason: "Frequentemente comprados juntos",
  }));
}

// Recently viewed products
export function getRecentlyViewed(
  userId: string,
  limit: number = 8
): ProductRecommendation[] {
  // Mock data - in production, get from user's view history
  const recentlyViewed = ["difusor-aromatico", "coleira-led", "shampoo-natural"];

  return recentlyViewed.slice(0, limit).map((id, index) => ({
    productId: id,
    score: 1 - index * 0.1,
    reason: "Visualizado recentemente",
  }));
}

// New arrivals
export function getNewArrivals(limit: number = 4): ProductRecommendation[] {
  // Mock data - in production, sort by creation date
  return products.slice(0, limit).map((product, index) => ({
    productId: product.id,
    score: 1 - index * 0.1,
    reason: "Novidades",
  }));
}

// Best sellers
export function getBestSellers(limit: number = 4): ProductRecommendation[] {
  // Mock data - in production, sort by sales count
  return products
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
    .map((product, index) => ({
      productId: product.id,
      score: 1 - index * 0.1,
      reason: "Mais vendidos",
    }));
}

// Products on sale
export function getProductsOnSale(limit: number = 4): ProductRecommendation[] {
  const onSale = products.filter((p) => p.discount && p.discount > 0);

  return onSale.slice(0, limit).map((product, index) => ({
    productId: product.id,
    score: 1 - index * 0.1,
    reason: "Em promoção",
  }));
}

// Complete the look / Bundle suggestions
export function getCompleteTheLook(
  productId: string,
  limit: number = 3
): ProductRecommendation[] {
  const product = products.find((p) => p.id === productId);
  if (!product) return [];

  // Suggest complementary products from different categories
  const complementary = products
    .filter((p) => p.id !== productId && p.category !== product.category)
    .slice(0, limit)
    .map((p, index) => ({
      productId: p.id,
      score: 1 - index * 0.15,
      reason: "Complete o look",
    }));

  return complementary;
}

// Smart search recommendations
export function getSearchRecommendations(
  query: string,
  limit: number = 4
): ProductRecommendation[] {
  const searchTerm = query.toLowerCase();

  const matches = products
    .filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    )
    .map((product) => {
      let score = 0;

      // Exact match in name
      if (product.name.toLowerCase().includes(searchTerm)) {
        score += 1;
      }

      // Match in description
      if (product.description.toLowerCase().includes(searchTerm)) {
        score += 0.5;
      }

      // Match in category
      if (product.category.toLowerCase().includes(searchTerm)) {
        score += 0.3;
      }

      // Boost by rating
      score += product.rating * 0.1;

      return {
        productId: product.id,
        score,
        reason: "Resultado da busca",
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return matches;
}

// Cross-sell recommendations for checkout
export function getCheckoutRecommendations(
  cartItems: string[],
  limit: number = 3
): ProductRecommendation[] {
  const recommendations: ProductRecommendation[] = [];

  // Get complementary products for each cart item
  cartItems.forEach((itemId) => {
    const complementary = getFrequentlyBoughtTogether(itemId, 1);
    recommendations.push(...complementary);
  });

  // Remove items already in cart
  const filtered = recommendations.filter(
    (rec) => !cartItems.includes(rec.productId)
  );

  // Remove duplicates
  const unique = filtered.reduce((acc, current) => {
    const exists = acc.find((item) => item.productId === current.productId);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, [] as ProductRecommendation[]);

  return unique.slice(0, limit);
}

// Get all recommendations for a page
export interface PageRecommendations {
  featured: ProductRecommendation[];
  personalized: ProductRecommendation[];
  trending: ProductRecommendation[];
  newArrivals: ProductRecommendation[];
  onSale: ProductRecommendation[];
}

export function getHomePageRecommendations(
  context: RecommendationContext
): PageRecommendations {
  return {
    featured: getBestSellers(4),
    personalized: getPersonalizedRecommendations(context, 8),
    trending: getTrendingProducts(4),
    newArrivals: getNewArrivals(4),
    onSale: getProductsOnSale(4),
  };
}

export function getProductPageRecommendations(
  productId: string
): {
  similar: ProductRecommendation[];
  frequentlyBought: ProductRecommendation[];
  completeTheLook: ProductRecommendation[];
} {
  return {
    similar: getContentBasedRecommendations(productId, 4),
    frequentlyBought: getFrequentlyBoughtTogether(productId, 3),
    completeTheLook: getCompleteTheLook(productId, 3),
  };
}

// A/B Testing for recommendations
export interface RecommendationTest {
  id: string;
  name: string;
  variants: {
    id: string;
    name: string;
    algorithm: string;
    traffic: number; // percentage
  }[];
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
}

export function getRecommendationVariant(
  testId: string,
  userId: string
): string {
  // Simple hash-based assignment for consistent user experience
  const hash = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return hash % 2 === 0 ? "control" : "variant";
}
