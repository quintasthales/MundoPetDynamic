// Advanced Personalization Engine with AI

export interface UserProfile {
  userId: string;
  demographics: {
    age?: number;
    gender?: string;
    location: string;
    language: string;
  };
  preferences: {
    categories: string[];
    brands: string[];
    priceRange: {
      min: number;
      max: number;
    };
    colors: string[];
    styles: string[];
  };
  behavior: {
    browsingHistory: {
      productId: string;
      timestamp: Date;
      duration: number; // seconds
    }[];
    searchHistory: string[];
    purchaseHistory: {
      orderId: string;
      productIds: string[];
      amount: number;
      date: Date;
    }[];
    wishlist: string[];
    cart: string[];
  };
  engagement: {
    emailOpens: number;
    emailClicks: number;
    smsOpens: number;
    pushNotificationClicks: number;
    lastActive: Date;
    sessionCount: number;
    averageSessionDuration: number;
  };
  segments: string[]; // e.g., "high_value", "frequent_buyer", "price_sensitive"
  lifetimeValue: number;
  churnRisk: number; // 0-100
  nextPurchasePrediction: {
    probability: number; // 0-100
    estimatedDate: Date;
    estimatedAmount: number;
    suggestedProducts: string[];
  };
}

export interface PersonalizationRule {
  id: string;
  name: string;
  type: "product_recommendation" | "content" | "pricing" | "promotion" | "layout";
  condition: {
    segment?: string[];
    behavior?: string;
    value?: any;
  };
  action: {
    type: string;
    value: any;
  };
  priority: number;
  active: boolean;
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
}

export interface PersonalizedContent {
  userId: string;
  homepage: {
    hero: {
      title: string;
      subtitle: string;
      image: string;
      cta: string;
    };
    featuredProducts: string[]; // product IDs
    banners: {
      id: string;
      image: string;
      title: string;
      link: string;
    }[];
    recommendations: {
      section: string;
      products: string[];
      reason: string;
    }[];
  };
  productPage: {
    recommendations: string[];
    upsells: string[];
    crossSells: string[];
    bundles: string[];
  };
  email: {
    subject: string;
    greeting: string;
    products: string[];
    discount?: number;
  };
}

export interface AIRecommendation {
  productId: string;
  score: number; // 0-100
  reason: string;
  algorithm: "collaborative" | "content_based" | "hybrid" | "deep_learning";
  confidence: number; // 0-100
  expectedConversion: number; // percentage
}

export interface PersonalizationAnalytics {
  totalUsers: number;
  personalizedUsers: number;
  averageLift: number; // percentage increase in conversion
  revenueImpact: number; // BRL
  topPerformingRules: {
    ruleId: string;
    ruleName: string;
    conversions: number;
    revenue: number;
  }[];
  segmentPerformance: {
    segment: string;
    users: number;
    conversionRate: number;
    averageOrderValue: number;
    lifetimeValue: number;
  }[];
}

// User segmentation
export const userSegments = {
  high_value: {
    name: "Alto Valor",
    criteria: { lifetimeValue: { min: 1000 } },
    benefits: ["Frete grátis sempre", "Descontos exclusivos", "Acesso antecipado"],
  },
  frequent_buyer: {
    name: "Comprador Frequente",
    criteria: { purchaseCount: { min: 5 }, daysSinceLastPurchase: { max: 30 } },
    benefits: ["Programa de fidelidade", "Cashback 5%"],
  },
  price_sensitive: {
    name: "Sensível a Preço",
    criteria: { averageDiscount: { min: 15 } },
    benefits: ["Alertas de promoção", "Cupons especiais"],
  },
  new_customer: {
    name: "Novo Cliente",
    criteria: { purchaseCount: { max: 0 }, daysSinceSignup: { max: 30 } },
    benefits: ["Desconto primeira compra", "Guia de produtos"],
  },
  at_risk: {
    name: "Em Risco",
    criteria: { daysSinceLastPurchase: { min: 90 }, churnRisk: { min: 70 } },
    benefits: ["Ofertas de reativação", "Pesquisa de feedback"],
  },
  vip: {
    name: "VIP",
    criteria: { lifetimeValue: { min: 5000 }, purchaseCount: { min: 20 } },
    benefits: ["Atendimento prioritário", "Produtos exclusivos", "Eventos VIP"],
  },
};

// Collaborative filtering recommendation
export function getCollaborativeRecommendations(
  userId: string,
  limit: number = 10
): AIRecommendation[] {
  // Mock implementation - in production, use ML model
  return [
    {
      productId: "kit-aromaterapia",
      score: 95,
      reason: "Clientes similares também compraram",
      algorithm: "collaborative",
      confidence: 92,
      expectedConversion: 12.5,
    },
    {
      productId: "oleo-lavanda",
      score: 88,
      reason: "Popular entre usuários com perfil similar",
      algorithm: "collaborative",
      confidence: 85,
      expectedConversion: 10.2,
    },
  ];
}

// Content-based recommendation
export function getContentBasedRecommendations(
  productId: string,
  limit: number = 10
): AIRecommendation[] {
  return [
    {
      productId: "difusor-premium",
      score: 92,
      reason: "Produto similar em categoria e preço",
      algorithm: "content_based",
      confidence: 90,
      expectedConversion: 8.5,
    },
    {
      productId: "oleo-eucalipto",
      score: 85,
      reason: "Frequentemente comprado junto",
      algorithm: "content_based",
      confidence: 82,
      expectedConversion: 7.2,
    },
  ];
}

// Hybrid recommendation (combines multiple algorithms)
export function getHybridRecommendations(
  userId: string,
  context?: {
    currentProduct?: string;
    searchQuery?: string;
    category?: string;
  },
  limit: number = 10
): AIRecommendation[] {
  // Combine collaborative, content-based, and contextual signals
  const recommendations: AIRecommendation[] = [];

  // Add collaborative filtering results
  const collaborative = getCollaborativeRecommendations(userId, 5);
  recommendations.push(...collaborative);

  // Add content-based results if viewing a product
  if (context?.currentProduct) {
    const contentBased = getContentBasedRecommendations(context.currentProduct, 5);
    recommendations.push(...contentBased);
  }

  // Sort by score and return top N
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// Deep learning recommendation
export async function getDeepLearningRecommendations(
  userId: string,
  limit: number = 10
): Promise<AIRecommendation[]> {
  // Mock implementation - in production, call ML API
  return [
    {
      productId: "luminaria-zen",
      score: 97,
      reason: "Previsto por modelo de deep learning",
      algorithm: "deep_learning",
      confidence: 94,
      expectedConversion: 15.8,
    },
  ];
}

// Personalize homepage
export function personalizeHomepage(userId: string): PersonalizedContent["homepage"] {
  // Mock implementation - in production, use user profile and ML
  return {
    hero: {
      title: "Bem-vindo de volta, Maria! 🌿",
      subtitle: "Novos produtos de aromaterapia especialmente para você",
      image: "/banners/personalized-hero.jpg",
      cta: "Ver Recomendações",
    },
    featuredProducts: [
      "difusor-aromatico",
      "kit-aromaterapia",
      "oleo-lavanda",
      "luminaria-zen",
    ],
    banners: [
      {
        id: "banner-1",
        image: "/banners/personalized-1.jpg",
        title: "20% OFF nos seus produtos favoritos",
        link: "/produtos?discount=20",
      },
    ],
    recommendations: [
      {
        section: "Recomendado para você",
        products: ["difusor-premium", "kit-completo", "vela-aromatica"],
        reason: "Baseado no seu histórico de compras",
      },
      {
        section: "Complete sua coleção",
        products: ["oleo-eucalipto", "oleo-tea-tree", "oleo-hortel"],
        reason: "Combina com produtos que você já tem",
      },
      {
        section: "Em alta agora",
        products: ["difusor-smart", "luminaria-led", "incenso-natural"],
        reason: "Produtos mais vendidos esta semana",
      },
    ],
  };
}

// Dynamic pricing
export interface DynamicPrice {
  basePrice: number;
  personalizedPrice: number;
  discount: number; // percentage
  reason: string;
  validUntil: Date;
}

export function calculateDynamicPrice(
  productId: string,
  userId: string
): DynamicPrice {
  const basePrice = 129.9;
  let discount = 0;
  let reason = "";

  // Mock implementation - in production, use ML model
  // Consider: user segment, purchase history, price sensitivity, inventory, demand

  // Example: VIP customer gets 15% off
  discount = 15;
  reason = "Desconto exclusivo VIP";

  return {
    basePrice,
    personalizedPrice: basePrice * (1 - discount / 100),
    discount,
    reason,
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  };
}

// Personalized email
export function generatePersonalizedEmail(
  userId: string,
  type: "welcome" | "abandoned_cart" | "recommendation" | "win_back"
): PersonalizedContent["email"] {
  const templates = {
    welcome: {
      subject: "Bem-vindo à MundoPetZen, Maria! 🎁",
      greeting: "Olá Maria, que bom ter você aqui!",
      products: ["difusor-aromatico", "kit-iniciante"],
      discount: 10,
    },
    abandoned_cart: {
      subject: "Maria, você esqueceu algo no carrinho 🛒",
      greeting: "Olá Maria, notamos que você deixou produtos no carrinho...",
      products: ["difusor-aromatico"], // from cart
      discount: 5,
    },
    recommendation: {
      subject: "Maria, produtos perfeitos para você! ✨",
      greeting: "Olá Maria, selecionamos especialmente para você:",
      products: ["kit-aromaterapia", "oleo-lavanda", "luminaria-zen"],
      discount: undefined,
    },
    win_back: {
      subject: "Sentimos sua falta, Maria! 💙",
      greeting: "Olá Maria, faz tempo que você não nos visita...",
      products: ["difusor-premium", "kit-completo"],
      discount: 20,
    },
  };

  return templates[type];
}

// A/B test personalization
export interface PersonalizationTest {
  id: string;
  name: string;
  type: "recommendation_algorithm" | "layout" | "pricing" | "content";
  variants: {
    id: string;
    name: string;
    config: any;
    traffic: number; // percentage
    performance: {
      users: number;
      conversions: number;
      conversionRate: number;
      revenue: number;
      averageOrderValue: number;
    };
  }[];
  status: "draft" | "running" | "completed";
  winner?: string;
  startDate: Date;
  endDate?: Date;
}

export function createPersonalizationTest(
  name: string,
  type: PersonalizationTest["type"]
): PersonalizationTest {
  return {
    id: `test-${Date.now()}`,
    name,
    type,
    variants: [
      {
        id: "control",
        name: "Control (Current)",
        config: { algorithm: "collaborative" },
        traffic: 50,
        performance: {
          users: 0,
          conversions: 0,
          conversionRate: 0,
          revenue: 0,
          averageOrderValue: 0,
        },
      },
      {
        id: "variant-a",
        name: "Variant A (New)",
        config: { algorithm: "deep_learning" },
        traffic: 50,
        performance: {
          users: 0,
          conversions: 0,
          conversionRate: 0,
          revenue: 0,
          averageOrderValue: 0,
        },
      },
    ],
    status: "draft",
    startDate: new Date(),
  };
}

// Real-time personalization
export interface RealTimeContext {
  userId: string;
  sessionId: string;
  currentPage: string;
  referrer: string;
  device: "mobile" | "tablet" | "desktop";
  location: string;
  weather?: string;
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  dayOfWeek: string;
  recentActions: {
    type: string;
    timestamp: Date;
    data: any;
  }[];
}

export function personalizeInRealTime(context: RealTimeContext): {
  recommendations: string[];
  banners: string[];
  offers: string[];
} {
  const { device, timeOfDay, weather, location } = context;

  // Adjust recommendations based on context
  let recommendations = ["difusor-aromatico", "kit-aromaterapia"];

  // Evening? Suggest relaxation products
  if (timeOfDay === "evening" || timeOfDay === "night") {
    recommendations = ["oleo-lavanda", "vela-relaxante", "difusor-sono"];
  }

  // Rainy day? Suggest cozy products
  if (weather === "rainy") {
    recommendations = ["difusor-cozy", "oleo-eucalipto", "manta-aromatica"];
  }

  // Mobile? Show mobile-optimized products
  if (device === "mobile") {
    recommendations = recommendations.slice(0, 3); // Fewer products
  }

  return {
    recommendations,
    banners: ["banner-personalized"],
    offers: ["offer-timeofday"],
  };
}

// Personalization analytics
export function getPersonalizationAnalytics(): PersonalizationAnalytics {
  return {
    totalUsers: 50000,
    personalizedUsers: 42500,
    averageLift: 28.5, // 28.5% increase in conversion
    revenueImpact: 450000.0, // R$ 450,000 additional revenue
    topPerformingRules: [
      {
        ruleId: "rule-001",
        ruleName: "VIP Personalized Pricing",
        conversions: 1234,
        revenue: 156780.0,
      },
      {
        ruleId: "rule-002",
        ruleName: "Abandoned Cart Recovery",
        conversions: 987,
        revenue: 123450.0,
      },
      {
        ruleId: "rule-003",
        ruleName: "Deep Learning Recommendations",
        conversions: 756,
        revenue: 98765.0,
      },
    ],
    segmentPerformance: [
      {
        segment: "vip",
        users: 2500,
        conversionRate: 25.5,
        averageOrderValue: 450.0,
        lifetimeValue: 5600.0,
      },
      {
        segment: "high_value",
        users: 7500,
        conversionRate: 18.2,
        averageOrderValue: 320.0,
        lifetimeValue: 2800.0,
      },
      {
        segment: "frequent_buyer",
        users: 12000,
        conversionRate: 12.5,
        averageOrderValue: 180.0,
        lifetimeValue: 1200.0,
      },
    ],
  };
}

// Predictive personalization
export interface PredictiveInsight {
  userId: string;
  predictions: {
    nextPurchaseDate: Date;
    nextPurchaseAmount: number;
    nextPurchaseProducts: string[];
    churnProbability: number; // 0-100
    lifetimeValueForecast: number;
    optimalContactTime: {
      day: string;
      hour: number;
    };
    preferredChannel: "email" | "sms" | "push" | "whatsapp";
  };
  recommendations: {
    action: string;
    priority: "low" | "medium" | "high" | "urgent";
    expectedImpact: string;
  }[];
}

export function getPredictiveInsights(userId: string): PredictiveInsight {
  return {
    userId,
    predictions: {
      nextPurchaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      nextPurchaseAmount: 180.0,
      nextPurchaseProducts: ["oleo-lavanda", "vela-aromatica"],
      churnProbability: 15,
      lifetimeValueForecast: 3500.0,
      optimalContactTime: {
        day: "Thursday",
        hour: 19, // 7 PM
      },
      preferredChannel: "email",
    },
    recommendations: [
      {
        action: "Enviar email com recomendações personalizadas",
        priority: "high",
        expectedImpact: "+25% conversion probability",
      },
      {
        action: "Oferecer desconto de 10% em óleos essenciais",
        priority: "medium",
        expectedImpact: "+R$ 50 order value",
      },
    ],
  };
}

// Multi-armed bandit optimization
export interface BanditArm {
  id: string;
  name: string;
  pulls: number;
  rewards: number;
  averageReward: number;
  confidence: number;
}

export function selectBestRecommendation(
  arms: BanditArm[]
): BanditArm {
  // Thompson Sampling implementation
  // Mock - in production, use proper MAB algorithm
  return arms.reduce((best, current) =>
    current.averageReward > best.averageReward ? current : best
  );
}

// Personalization rules engine
export const personalizationRules: PersonalizationRule[] = [
  {
    id: "rule-vip-pricing",
    name: "VIP Dynamic Pricing",
    type: "pricing",
    condition: {
      segment: ["vip"],
    },
    action: {
      type: "discount",
      value: 15,
    },
    priority: 1,
    active: true,
    performance: {
      impressions: 12000,
      clicks: 3400,
      conversions: 1234,
      revenue: 156780.0,
    },
  },
  {
    id: "rule-cart-recovery",
    name: "Abandoned Cart Personalization",
    type: "promotion",
    condition: {
      behavior: "abandoned_cart",
    },
    action: {
      type: "email_with_discount",
      value: 10,
    },
    priority: 2,
    active: true,
    performance: {
      impressions: 8500,
      clicks: 2100,
      conversions: 987,
      revenue: 123450.0,
    },
  },
];
