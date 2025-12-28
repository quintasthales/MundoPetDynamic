// Advanced Machine Learning Recommendation Models

export interface UserProfile {
  userId: string;
  demographics: {
    age?: number;
    gender?: string;
    location?: string;
  };
  behavior: {
    viewedProducts: string[];
    purchasedProducts: string[];
    searchQueries: string[];
    categories: string[];
    avgOrderValue: number;
    purchaseFrequency: number;
  };
  preferences: {
    brands: string[];
    priceRange: { min: number; max: number };
    colors: string[];
    materials: string[];
  };
  engagement: {
    emailOpenRate: number;
    clickThroughRate: number;
    timeOnSite: number;
    pagesPerSession: number;
  };
}

export interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  brand: string;
  attributes: Record<string, any>;
  popularity: number;
  rating: number;
  reviewCount: number;
}

export interface Recommendation {
  productId: string;
  score: number; // 0-1
  reason: string;
  confidence: number; // 0-1
  algorithm: string;
}

// Collaborative Filtering
export class CollaborativeFiltering {
  // User-based collaborative filtering
  userBasedRecommendations(
    userId: string,
    userProfiles: Map<string, UserProfile>,
    products: Product[],
    k: number = 10
  ): Recommendation[] {
    const targetUser = userProfiles.get(userId);
    if (!targetUser) return [];

    // Find similar users
    const similarUsers = this.findSimilarUsers(userId, userProfiles, 20);

    // Get products purchased by similar users but not by target user
    const recommendedProducts = new Map<string, number>();

    similarUsers.forEach(({ userId: similarUserId, similarity }) => {
      const similarUser = userProfiles.get(similarUserId);
      if (!similarUser) return;

      similarUser.behavior.purchasedProducts.forEach(productId => {
        if (!targetUser.behavior.purchasedProducts.includes(productId)) {
          const currentScore = recommendedProducts.get(productId) || 0;
          recommendedProducts.set(productId, currentScore + similarity);
        }
      });
    });

    // Sort and return top k recommendations
    return Array.from(recommendedProducts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, k)
      .map(([productId, score]) => ({
        productId,
        score: score / similarUsers.length,
        reason: "Clientes similares também compraram",
        confidence: 0.75,
        algorithm: "collaborative_filtering_user",
      }));
  }

  // Item-based collaborative filtering
  itemBasedRecommendations(
    userId: string,
    userProfile: UserProfile,
    products: Product[],
    k: number = 10
  ): Recommendation[] {
    const purchasedProducts = userProfile.behavior.purchasedProducts;
    const recommendations = new Map<string, number>();

    // For each purchased product, find similar products
    purchasedProducts.forEach(productId => {
      const similarProducts = this.findSimilarProducts(productId, products, 10);

      similarProducts.forEach(({ productId: similarProductId, similarity }) => {
        if (!purchasedProducts.includes(similarProductId)) {
          const currentScore = recommendations.get(similarProductId) || 0;
          recommendations.set(similarProductId, currentScore + similarity);
        }
      });
    });

    return Array.from(recommendations.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, k)
      .map(([productId, score]) => ({
        productId,
        score: score / purchasedProducts.length,
        reason: "Baseado em produtos que você comprou",
        confidence: 0.8,
        algorithm: "collaborative_filtering_item",
      }));
  }

  private findSimilarUsers(
    userId: string,
    userProfiles: Map<string, UserProfile>,
    k: number
  ): { userId: string; similarity: number }[] {
    const targetUser = userProfiles.get(userId);
    if (!targetUser) return [];

    const similarities: { userId: string; similarity: number }[] = [];

    userProfiles.forEach((profile, profileUserId) => {
      if (profileUserId === userId) return;

      const similarity = this.calculateUserSimilarity(targetUser, profile);
      similarities.push({ userId: profileUserId, similarity });
    });

    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, k);
  }

  private calculateUserSimilarity(
    user1: UserProfile,
    user2: UserProfile
  ): number {
    // Jaccard similarity based on purchased products
    const set1 = new Set(user1.behavior.purchasedProducts);
    const set2 = new Set(user2.behavior.purchasedProducts);

    const intersection = new Set(
      [...set1].filter(x => set2.has(x))
    );
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  private findSimilarProducts(
    productId: string,
    products: Product[],
    k: number
  ): { productId: string; similarity: number }[] {
    const targetProduct = products.find(p => p.id === productId);
    if (!targetProduct) return [];

    const similarities = products
      .filter(p => p.id !== productId)
      .map(product => ({
        productId: product.id,
        similarity: this.calculateProductSimilarity(targetProduct, product),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, k);

    return similarities;
  }

  private calculateProductSimilarity(
    product1: Product,
    product2: Product
  ): number {
    let similarity = 0;
    let weights = 0;

    // Category similarity
    if (product1.category === product2.category) {
      similarity += 0.4;
      weights += 0.4;

      if (product1.subcategory === product2.subcategory) {
        similarity += 0.2;
        weights += 0.2;
      }
    }

    // Brand similarity
    if (product1.brand === product2.brand) {
      similarity += 0.2;
      weights += 0.2;
    }

    // Price similarity (within 20%)
    const priceDiff = Math.abs(product1.price - product2.price) / product1.price;
    if (priceDiff < 0.2) {
      similarity += 0.2;
      weights += 0.2;
    }

    return weights > 0 ? similarity / weights : 0;
  }
}

// Content-Based Filtering
export class ContentBasedFiltering {
  recommendations(
    userProfile: UserProfile,
    products: Product[],
    k: number = 10
  ): Recommendation[] {
    const scores = products.map(product => ({
      productId: product.id,
      score: this.calculateScore(userProfile, product),
    }));

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(({ productId, score }) => ({
        productId,
        score,
        reason: "Baseado em suas preferências",
        confidence: 0.7,
        algorithm: "content_based",
      }));
  }

  private calculateScore(userProfile: UserProfile, product: Product): number {
    let score = 0;

    // Category preference
    if (userProfile.behavior.categories.includes(product.category)) {
      score += 0.3;
    }

    // Brand preference
    if (userProfile.preferences.brands.includes(product.brand)) {
      score += 0.2;
    }

    // Price range preference
    if (
      product.price >= userProfile.preferences.priceRange.min &&
      product.price <= userProfile.preferences.priceRange.max
    ) {
      score += 0.2;
    }

    // Popularity
    score += product.popularity * 0.15;

    // Rating
    score += (product.rating / 5) * 0.15;

    return score;
  }
}

// Deep Learning Recommendations (Neural Network)
export class DeepLearningRecommendations {
  // Simulate a neural network recommendation model
  recommendations(
    userProfile: UserProfile,
    products: Product[],
    k: number = 10
  ): Recommendation[] {
    // In production, this would call a trained neural network model
    // For now, we'll simulate with a weighted combination of features

    const scores = products.map(product => ({
      productId: product.id,
      score: this.predictScore(userProfile, product),
    }));

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(({ productId, score }) => ({
        productId,
        score,
        reason: "Recomendado por IA",
        confidence: 0.9,
        algorithm: "deep_learning",
      }));
  }

  private predictScore(userProfile: UserProfile, product: Product): number {
    // Simulate neural network prediction
    const features = [
      userProfile.behavior.avgOrderValue / 1000,
      userProfile.behavior.purchaseFrequency / 10,
      userProfile.engagement.emailOpenRate,
      userProfile.engagement.clickThroughRate,
      product.popularity,
      product.rating / 5,
      product.price / 500,
    ];

    // Simulate weights learned by neural network
    const weights = [0.15, 0.12, 0.08, 0.08, 0.25, 0.22, 0.10];

    const score = features.reduce((sum, feature, i) => sum + feature * weights[i], 0);

    return Math.min(Math.max(score, 0), 1); // Normalize to 0-1
  }
}

// Hybrid Recommendation System
export class HybridRecommendationSystem {
  private collaborativeFiltering = new CollaborativeFiltering();
  private contentBasedFiltering = new ContentBasedFiltering();
  private deepLearningRecommendations = new DeepLearningRecommendations();

  recommendations(
    userId: string,
    userProfile: UserProfile,
    userProfiles: Map<string, UserProfile>,
    products: Product[],
    k: number = 10
  ): Recommendation[] {
    // Get recommendations from each algorithm
    const collaborative = this.collaborativeFiltering.userBasedRecommendations(
      userId,
      userProfiles,
      products,
      k * 2
    );

    const itemBased = this.collaborativeFiltering.itemBasedRecommendations(
      userId,
      userProfile,
      products,
      k * 2
    );

    const contentBased = this.contentBasedFiltering.recommendations(
      userProfile,
      products,
      k * 2
    );

    const deepLearning = this.deepLearningRecommendations.recommendations(
      userProfile,
      products,
      k * 2
    );

    // Combine recommendations with weighted scores
    const combinedScores = new Map<string, { score: number; reasons: string[] }>();

    const addRecommendations = (
      recommendations: Recommendation[],
      weight: number
    ) => {
      recommendations.forEach(rec => {
        const current = combinedScores.get(rec.productId) || {
          score: 0,
          reasons: [],
        };
        current.score += rec.score * weight;
        if (!current.reasons.includes(rec.reason)) {
          current.reasons.push(rec.reason);
        }
        combinedScores.set(rec.productId, current);
      });
    };

    // Weights for each algorithm
    addRecommendations(collaborative, 0.25);
    addRecommendations(itemBased, 0.25);
    addRecommendations(contentBased, 0.20);
    addRecommendations(deepLearning, 0.30);

    // Sort and return top k
    return Array.from(combinedScores.entries())
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, k)
      .map(([productId, { score, reasons }]) => ({
        productId,
        score,
        reason: reasons.join(" • "),
        confidence: 0.85,
        algorithm: "hybrid",
      }));
  }
}

// Context-Aware Recommendations
export interface Context {
  time: Date;
  device: "mobile" | "desktop" | "tablet";
  location?: string;
  weather?: string;
  season: "spring" | "summer" | "fall" | "winter";
  dayOfWeek: string;
  isHoliday: boolean;
}

export class ContextAwareRecommendations {
  recommendations(
    userProfile: UserProfile,
    products: Product[],
    context: Context,
    k: number = 10
  ): Recommendation[] {
    const scores = products.map(product => ({
      productId: product.id,
      score: this.calculateContextScore(userProfile, product, context),
    }));

    return scores
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map(({ productId, score }) => ({
        productId,
        score,
        reason: this.getContextReason(context),
        confidence: 0.75,
        algorithm: "context_aware",
      }));
  }

  private calculateContextScore(
    userProfile: UserProfile,
    product: Product,
    context: Context
  ): number {
    let score = 0.5; // Base score

    // Time-based adjustments
    const hour = context.time.getHours();
    if (hour >= 20 || hour <= 6) {
      // Night time - boost relaxation products
      if (product.category === "relaxamento") {
        score += 0.2;
      }
    }

    // Device-based adjustments
    if (context.device === "mobile") {
      // Mobile users prefer lower-priced items
      if (product.price < 100) {
        score += 0.1;
      }
    }

    // Season-based adjustments
    if (context.season === "summer") {
      if (product.category === "refrescante") {
        score += 0.15;
      }
    } else if (context.season === "winter") {
      if (product.category === "aquecimento") {
        score += 0.15;
      }
    }

    // Holiday adjustments
    if (context.isHoliday) {
      // Boost gift-appropriate products
      if (product.attributes?.giftWrapping) {
        score += 0.2;
      }
    }

    return Math.min(score, 1);
  }

  private getContextReason(context: Context): string {
    const hour = context.time.getHours();

    if (context.isHoliday) {
      return "Perfeito para presentear";
    }

    if (hour >= 20 || hour <= 6) {
      return "Ideal para relaxar à noite";
    }

    if (context.season === "summer") {
      return "Perfeito para o verão";
    }

    if (context.season === "winter") {
      return "Ideal para o inverno";
    }

    return "Recomendado para você agora";
  }
}

// Recommendation Analytics
export interface RecommendationAnalytics {
  totalRecommendations: number;
  clickThroughRate: number; // percentage
  conversionRate: number; // percentage
  avgOrderValue: number;
  revenueGenerated: number;
  topPerformingAlgorithms: {
    algorithm: string;
    ctr: number;
    conversionRate: number;
    revenue: number;
  }[];
  performanceByContext: {
    context: string;
    ctr: number;
    conversionRate: number;
  }[];
}

export function getRecommendationAnalytics(): RecommendationAnalytics {
  return {
    totalRecommendations: 1250000,
    clickThroughRate: 12.8,
    conversionRate: 4.2,
    avgOrderValue: 185.5,
    revenueGenerated: 975000,
    topPerformingAlgorithms: [
      {
        algorithm: "deep_learning",
        ctr: 15.2,
        conversionRate: 5.1,
        revenue: 425000,
      },
      {
        algorithm: "hybrid",
        ctr: 14.5,
        conversionRate: 4.8,
        revenue: 380000,
      },
      {
        algorithm: "collaborative_filtering_item",
        ctr: 11.8,
        conversionRate: 3.9,
        revenue: 120000,
      },
      {
        algorithm: "context_aware",
        ctr: 10.5,
        conversionRate: 3.5,
        revenue: 50000,
      },
    ],
    performanceByContext: [
      {
        context: "mobile_evening",
        ctr: 16.2,
        conversionRate: 5.8,
      },
      {
        context: "desktop_daytime",
        ctr: 13.5,
        conversionRate: 4.5,
      },
      {
        context: "mobile_weekend",
        ctr: 14.8,
        conversionRate: 5.2,
      },
    ],
  };
}

// Export singleton instances
export const hybridRecommendationSystem = new HybridRecommendationSystem();
export const contextAwareRecommendations = new ContextAwareRecommendations();
