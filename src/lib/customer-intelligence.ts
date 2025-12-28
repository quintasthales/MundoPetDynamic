// Advanced Customer Intelligence and Predictive Analytics System

export interface CustomerProfile {
  id: string;
  demographics: {
    age?: number;
    gender?: "male" | "female" | "other" | "prefer_not_to_say";
    location: {
      city: string;
      state: string;
      country: string;
      coordinates?: { lat: number; lng: number };
    };
    language: string;
    timezone: string;
  };
  behavior: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: Date;
    firstOrderDate?: Date;
    daysSinceLastOrder?: number;
    orderFrequency: number; // orders per month
    favoriteCategories: { category: string; count: number }[];
    favoriteProducts: { productId: string; purchases: number }[];
    browsing: {
      sessionsCount: number;
      avgSessionDuration: number; // seconds
      pagesPerSession: number;
      bounceRate: number; // percentage
    };
  };
  engagement: {
    emailOpens: number;
    emailClicks: number;
    smsResponses: number;
    reviewsWritten: number;
    wishlistItems: number;
    referrals: number;
    loyaltyPoints: number;
    level: string;
  };
  predictions: {
    churnRisk: number; // 0-100
    lifetimeValue: number; // predicted total spend
    nextPurchaseDate?: Date;
    nextPurchaseCategory?: string;
    nextPurchaseAmount?: number;
    conversionProbability: number; // 0-100
    upsellOpportunity: number; // 0-100
  };
  segments: string[]; // e.g., ["VIP", "High Value", "At Risk"]
  scores: {
    rfm: { recency: number; frequency: number; monetary: number; score: string }; // e.g., "555"
    engagement: number; // 0-100
    satisfaction: number; // 0-100
    advocacy: number; // 0-100 (NPS-like)
  };
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: {
    field: string;
    operator: "equals" | "greater_than" | "less_than" | "between" | "contains";
    value: any;
  }[];
  customerCount: number;
  metrics: {
    avgLifetimeValue: number;
    avgOrderValue: number;
    churnRate: number; // percentage
    conversionRate: number; // percentage
  };
  recommendations: {
    marketing: string[];
    products: string[];
    offers: string[];
  };
}

export interface PredictiveModel {
  id: string;
  name: string;
  type: "churn" | "ltv" | "next_purchase" | "product_recommendation" | "conversion";
  algorithm: "random_forest" | "gradient_boosting" | "neural_network" | "logistic_regression";
  accuracy: number; // 0-100
  features: {
    name: string;
    importance: number; // 0-100
  }[];
  trainedOn: Date;
  lastUpdated: Date;
  predictions: number; // total predictions made
  performance: {
    precision: number;
    recall: number;
    f1Score: number;
    auc: number; // Area Under Curve
  };
}

export interface CustomerJourney {
  customerId: string;
  stages: {
    stage: "awareness" | "consideration" | "purchase" | "retention" | "advocacy";
    enteredAt: Date;
    exitedAt?: Date;
    touchpoints: {
      type: "email" | "sms" | "push" | "social" | "website" | "store" | "support";
      timestamp: Date;
      channel: string;
      action: string;
      outcome: "positive" | "neutral" | "negative";
    }[];
    conversion: boolean;
    revenue?: number;
  }[];
  currentStage: string;
  nextBestAction: {
    action: string;
    channel: string;
    timing: string;
    expectedImpact: string;
  };
}

export interface CohortAnalysis {
  cohortId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  customerCount: number;
  metrics: {
    period: string; // e.g., "Month 1", "Month 2"
    retention: number; // percentage
    revenue: number;
    orders: number;
    avgOrderValue: number;
  }[];
  insights: {
    retentionRate: number; // overall
    bestPerformingPeriod: string;
    dropoffPeriod: string;
    recommendations: string[];
  };
}

export interface CustomerInsight {
  id: string;
  type: "opportunity" | "risk" | "trend" | "anomaly";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  affectedCustomers: number;
  potentialImpact: {
    revenue: number;
    customers: number;
  };
  recommendations: {
    action: string;
    priority: number;
    estimatedROI: string;
  }[];
  detectedAt: Date;
}

// RFM (Recency, Frequency, Monetary) Analysis
export function calculateRFM(customer: CustomerProfile): {
  recency: number; // 1-5 (5 = most recent)
  frequency: number; // 1-5 (5 = most frequent)
  monetary: number; // 1-5 (5 = highest spend)
  score: string; // e.g., "555"
  segment: string; // e.g., "Champions"
} {
  const { daysSinceLastOrder = 365, orderFrequency, totalSpent } = customer.behavior;

  // Recency score (lower days = higher score)
  const recency = daysSinceLastOrder <= 30 ? 5 :
                  daysSinceLastOrder <= 60 ? 4 :
                  daysSinceLastOrder <= 90 ? 3 :
                  daysSinceLastOrder <= 180 ? 2 : 1;

  // Frequency score (higher frequency = higher score)
  const frequency = orderFrequency >= 12 ? 5 :
                    orderFrequency >= 6 ? 4 :
                    orderFrequency >= 3 ? 3 :
                    orderFrequency >= 1 ? 2 : 1;

  // Monetary score (higher spend = higher score)
  const monetary = totalSpent >= 10000 ? 5 :
                   totalSpent >= 5000 ? 4 :
                   totalSpent >= 2000 ? 3 :
                   totalSpent >= 500 ? 2 : 1;

  const score = `${recency}${frequency}${monetary}`;

  // Segment mapping
  const segmentMap: Record<string, string> = {
    "555": "Champions",
    "554": "Champions",
    "544": "Champions",
    "545": "Champions",
    "454": "Loyal Customers",
    "455": "Loyal Customers",
    "445": "Loyal Customers",
    "354": "Potential Loyalists",
    "355": "Potential Loyalists",
    "345": "Potential Loyalists",
    "244": "Recent Customers",
    "245": "Recent Customers",
    "255": "Recent Customers",
    "155": "Promising",
    "154": "Promising",
    "144": "Need Attention",
    "145": "Need Attention",
    "125": "About to Sleep",
    "124": "About to Sleep",
    "115": "At Risk",
    "114": "At Risk",
    "113": "Can't Lose Them",
    "112": "Can't Lose Them",
    "111": "Lost",
  };

  const segment = segmentMap[score] || "Undefined";

  return { recency, frequency, monetary, score, segment };
}

// Churn prediction
export function predictChurn(customer: CustomerProfile): {
  risk: number; // 0-100
  factors: { factor: string; impact: number }[];
  recommendations: string[];
} {
  const { daysSinceLastOrder = 365, orderFrequency, totalSpent } = customer.behavior;
  const { emailOpens, emailClicks } = customer.engagement;

  let risk = 0;

  // Factor 1: Days since last order
  if (daysSinceLastOrder > 180) risk += 40;
  else if (daysSinceLastOrder > 90) risk += 25;
  else if (daysSinceLastOrder > 60) risk += 10;

  // Factor 2: Order frequency decline
  if (orderFrequency < 1) risk += 30;
  else if (orderFrequency < 3) risk += 15;

  // Factor 3: Low engagement
  if (emailOpens < 3) risk += 15;
  if (emailClicks < 1) risk += 15;

  risk = Math.min(risk, 100);

  const factors = [
    { factor: "Days since last order", impact: daysSinceLastOrder > 90 ? 40 : 10 },
    { factor: "Order frequency", impact: orderFrequency < 1 ? 30 : 0 },
    { factor: "Email engagement", impact: emailOpens < 3 ? 15 : 0 },
  ];

  const recommendations = [];
  if (risk > 70) {
    recommendations.push("Send personalized win-back campaign immediately");
    recommendations.push("Offer exclusive discount (20-30%)");
    recommendations.push("Personal phone call from customer success team");
  } else if (risk > 40) {
    recommendations.push("Send re-engagement email series");
    recommendations.push("Offer special discount (10-15%)");
    recommendations.push("Showcase new products in their favorite categories");
  } else if (risk > 20) {
    recommendations.push("Send regular newsletter with personalized recommendations");
    recommendations.push("Invite to loyalty program");
  }

  return { risk, factors, recommendations };
}

// Lifetime Value (LTV) prediction
export function predictLifetimeValue(customer: CustomerProfile): {
  predicted: number;
  confidence: number; // 0-100
  breakdown: {
    historicalValue: number;
    predictedFutureValue: number;
    timeframe: string; // e.g., "next 12 months"
  };
  factors: { factor: string; contribution: number }[];
} {
  const { totalSpent, orderFrequency, averageOrderValue, daysSinceLastOrder = 0 } = customer.behavior;

  // Simple LTV calculation (can be replaced with ML model)
  const monthlyValue = averageOrderValue * orderFrequency;
  const predictedMonths = daysSinceLastOrder < 90 ? 24 : 12; // 2 years for active, 1 year for less active
  const churnFactor = daysSinceLastOrder < 90 ? 0.9 : 0.6; // retention probability

  const predictedFutureValue = monthlyValue * predictedMonths * churnFactor;
  const predicted = totalSpent + predictedFutureValue;

  return {
    predicted,
    confidence: 75,
    breakdown: {
      historicalValue: totalSpent,
      predictedFutureValue,
      timeframe: `next ${predictedMonths} months`,
    },
    factors: [
      { factor: "Average order value", contribution: 35 },
      { factor: "Order frequency", contribution: 30 },
      { factor: "Customer tenure", contribution: 20 },
      { factor: "Engagement level", contribution: 15 },
    ],
  };
}

// Next purchase prediction
export function predictNextPurchase(customer: CustomerProfile): {
  date: Date;
  confidence: number; // 0-100
  category: string;
  estimatedAmount: number;
  triggers: string[];
} {
  const { orderFrequency, averageOrderValue, daysSinceLastOrder = 0, favoriteCategories } = customer.behavior;

  // Calculate average days between orders
  const avgDaysBetweenOrders = orderFrequency > 0 ? 30 / orderFrequency : 90;
  const nextPurchaseDays = Math.max(avgDaysBetweenOrders - daysSinceLastOrder, 7);

  const nextPurchaseDate = new Date();
  nextPurchaseDate.setDate(nextPurchaseDate.getDate() + nextPurchaseDays);

  return {
    date: nextPurchaseDate,
    confidence: orderFrequency > 3 ? 85 : 60,
    category: favoriteCategories[0]?.category || "General",
    estimatedAmount: averageOrderValue * 1.1, // slight increase
    triggers: [
      "Personalized email with recommendations",
      "Limited-time offer in favorite category",
      "New product launch notification",
    ],
  };
}

// Customer segmentation
export const customerSegments: CustomerSegment[] = [
  {
    id: "champions",
    name: "Champions",
    description: "Bought recently, buy often, and spend the most",
    criteria: [
      { field: "rfm.recency", operator: "greater_than", value: 4 },
      { field: "rfm.frequency", operator: "greater_than", value: 4 },
      { field: "rfm.monetary", operator: "greater_than", value: 4 },
    ],
    customerCount: 1250,
    metrics: {
      avgLifetimeValue: 15000,
      avgOrderValue: 850,
      churnRate: 5,
      conversionRate: 45,
    },
    recommendations: {
      marketing: ["VIP treatment", "Early access to new products", "Referral program"],
      products: ["Premium products", "Exclusive bundles", "Limited editions"],
      offers: ["Loyalty rewards", "Free shipping always", "Birthday gifts"],
    },
  },
  {
    id: "loyal",
    name: "Loyal Customers",
    description: "Buy regularly with good spend",
    criteria: [
      { field: "rfm.frequency", operator: "greater_than", value: 3 },
      { field: "rfm.monetary", operator: "greater_than", value: 3 },
    ],
    customerCount: 3500,
    metrics: {
      avgLifetimeValue: 8500,
      avgOrderValue: 450,
      churnRate: 12,
      conversionRate: 35,
    },
    recommendations: {
      marketing: ["Loyalty program", "Personalized recommendations", "Exclusive content"],
      products: ["Complementary products", "Bundles", "Subscriptions"],
      offers: ["Volume discounts", "Free shipping threshold", "Points program"],
    },
  },
  {
    id: "at_risk",
    name: "At Risk",
    description: "Spent big money, purchased often, but long time ago",
    criteria: [
      { field: "rfm.recency", operator: "less_than", value: 2 },
      { field: "rfm.frequency", operator: "greater_than", value: 3 },
      { field: "rfm.monetary", operator: "greater_than", value: 3 },
    ],
    customerCount: 850,
    metrics: {
      avgLifetimeValue: 6500,
      avgOrderValue: 550,
      churnRate: 45,
      conversionRate: 15,
    },
    recommendations: {
      marketing: ["Win-back campaigns", "We miss you emails", "Reactivation offers"],
      products: ["New arrivals", "Best sellers", "Personalized picks"],
      offers: ["Come back discount (20%)", "Free shipping", "Loyalty points bonus"],
    },
  },
  {
    id: "promising",
    name: "Promising",
    description: "Recent shoppers with average frequency and spend",
    criteria: [
      { field: "rfm.recency", operator: "greater_than", value: 3 },
      { field: "rfm.frequency", operator: "between", value: [2, 3] },
    ],
    customerCount: 5200,
    metrics: {
      avgLifetimeValue: 2500,
      avgOrderValue: 350,
      churnRate: 25,
      conversionRate: 28,
    },
    recommendations: {
      marketing: ["Nurture campaigns", "Product education", "Social proof"],
      products: ["Popular products", "Starter bundles", "Trial sizes"],
      offers: ["Second purchase discount", "Referral incentive", "Loyalty program invite"],
    },
  },
  {
    id: "new",
    name: "New Customers",
    description: "Recent first-time buyers",
    criteria: [
      { field: "behavior.totalOrders", operator: "equals", value: 1 },
      { field: "behavior.daysSinceLastOrder", operator: "less_than", value: 30 },
    ],
    customerCount: 8500,
    metrics: {
      avgLifetimeValue: 450,
      avgOrderValue: 450,
      churnRate: 60,
      conversionRate: 22,
    },
    recommendations: {
      marketing: ["Welcome series", "Onboarding emails", "Product tutorials"],
      products: ["Best sellers", "Complementary products", "Starter kits"],
      offers: ["Second purchase discount (15%)", "Free shipping", "Welcome bonus"],
    },
  },
];

// Customer journey mapping
export function mapCustomerJourney(customerId: string): CustomerJourney {
  // Mock implementation - in production, gather from all touchpoints
  return {
    customerId,
    stages: [
      {
        stage: "awareness",
        enteredAt: new Date("2024-01-01"),
        exitedAt: new Date("2024-01-05"),
        touchpoints: [
          {
            type: "social",
            timestamp: new Date("2024-01-01"),
            channel: "Instagram",
            action: "Viewed ad",
            outcome: "positive",
          },
          {
            type: "website",
            timestamp: new Date("2024-01-03"),
            channel: "Organic search",
            action: "Visited homepage",
            outcome: "positive",
          },
        ],
        conversion: false,
      },
      {
        stage: "consideration",
        enteredAt: new Date("2024-01-05"),
        exitedAt: new Date("2024-01-10"),
        touchpoints: [
          {
            type: "email",
            timestamp: new Date("2024-01-06"),
            channel: "Welcome email",
            action: "Opened email",
            outcome: "positive",
          },
          {
            type: "website",
            timestamp: new Date("2024-01-08"),
            channel: "Direct",
            action: "Viewed products",
            outcome: "positive",
          },
        ],
        conversion: false,
      },
      {
        stage: "purchase",
        enteredAt: new Date("2024-01-10"),
        exitedAt: new Date("2024-01-10"),
        touchpoints: [
          {
            type: "website",
            timestamp: new Date("2024-01-10"),
            channel: "Direct",
            action: "Completed purchase",
            outcome: "positive",
          },
        ],
        conversion: true,
        revenue: 450,
      },
    ],
    currentStage: "retention",
    nextBestAction: {
      action: "Send post-purchase follow-up",
      channel: "Email",
      timing: "3 days after delivery",
      expectedImpact: "Increase repeat purchase probability by 25%",
    },
  };
}

// Cohort analysis
export function analyzeCohort(startDate: Date, endDate: Date): CohortAnalysis {
  // Mock implementation - in production, analyze real cohort data
  return {
    cohortId: `cohort-${startDate.toISOString().slice(0, 7)}`,
    name: `Customers acquired in ${startDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`,
    startDate,
    endDate,
    customerCount: 1250,
    metrics: [
      { period: "Month 0", retention: 100, revenue: 562500, orders: 1250, avgOrderValue: 450 },
      { period: "Month 1", retention: 45, revenue: 253125, orders: 563, avgOrderValue: 450 },
      { period: "Month 2", retention: 32, revenue: 180000, orders: 400, avgOrderValue: 450 },
      { period: "Month 3", retention: 28, retention: 28, revenue: 157500, orders: 350, avgOrderValue: 450 },
      { period: "Month 6", retention: 22, revenue: 123750, orders: 275, avgOrderValue: 450 },
      { period: "Month 12", retention: 18, revenue: 101250, orders: 225, avgOrderValue: 450 },
    ],
    insights: {
      retentionRate: 18,
      bestPerformingPeriod: "Month 1",
      dropoffPeriod: "Month 2-3",
      recommendations: [
        "Implement re-engagement campaign at Month 2",
        "Offer loyalty incentive at Month 3",
        "Personalize communication based on purchase behavior",
      ],
    },
  };
}

// Customer insights generation
export function generateCustomerInsights(): CustomerInsight[] {
  return [
    {
      id: "insight-1",
      type: "opportunity",
      severity: "high",
      title: "850 high-value customers at risk of churning",
      description: "Customers who spent over R$ 5,000 haven't purchased in 90+ days",
      affectedCustomers: 850,
      potentialImpact: {
        revenue: 4250000, // R$ 4.25M
        customers: 850,
      },
      recommendations: [
        {
          action: "Launch personalized win-back campaign with 20% discount",
          priority: 1,
          estimatedROI: "300%",
        },
        {
          action: "Personal outreach from customer success team",
          priority: 2,
          estimatedROI: "250%",
        },
        {
          action: "Showcase new products in their favorite categories",
          priority: 3,
          estimatedROI: "180%",
        },
      ],
      detectedAt: new Date(),
    },
    {
      id: "insight-2",
      type: "trend",
      severity: "medium",
      title: "Mobile conversion rate increased 15% this month",
      description: "Mobile optimization efforts are paying off",
      affectedCustomers: 125000,
      potentialImpact: {
        revenue: 375000, // R$ 375K additional
        customers: 0,
      },
      recommendations: [
        {
          action: "Increase mobile advertising budget by 25%",
          priority: 1,
          estimatedROI: "400%",
        },
        {
          action: "Further optimize mobile checkout flow",
          priority: 2,
          estimatedROI: "200%",
        },
      ],
      detectedAt: new Date(),
    },
    {
      id: "insight-3",
      type: "anomaly",
      severity: "critical",
      title: "Unusual spike in cart abandonment rate",
      description: "Cart abandonment increased from 68% to 82% in the last 3 days",
      affectedCustomers: 5600,
      potentialImpact: {
        revenue: 1260000, // R$ 1.26M at risk
        customers: 5600,
      },
      recommendations: [
        {
          action: "Investigate checkout technical issues immediately",
          priority: 1,
          estimatedROI: "N/A",
        },
        {
          action: "Review recent changes to checkout flow",
          priority: 2,
          estimatedROI: "N/A",
        },
        {
          action: "Launch abandoned cart recovery campaign",
          priority: 3,
          estimatedROI: "250%",
        },
      ],
      detectedAt: new Date(),
    },
  ];
}

// Predictive analytics dashboard
export interface PredictiveAnalyticsDashboard {
  overview: {
    totalCustomers: number;
    atRiskCustomers: number;
    highValueCustomers: number;
    predictedChurnRate: number; // percentage
    predictedRevenue: {
      next30Days: number;
      next90Days: number;
      next12Months: number;
    };
  };
  topInsights: CustomerInsight[];
  models: PredictiveModel[];
  segments: CustomerSegment[];
}

export function getPredictiveAnalyticsDashboard(): PredictiveAnalyticsDashboard {
  return {
    overview: {
      totalCustomers: 125000,
      atRiskCustomers: 8500,
      highValueCustomers: 4750,
      predictedChurnRate: 6.8,
      predictedRevenue: {
        next30Days: 4500000,
        next90Days: 13500000,
        next12Months: 54000000,
      },
    },
    topInsights: generateCustomerInsights(),
    models: [
      {
        id: "model-churn",
        name: "Churn Prediction Model",
        type: "churn",
        algorithm: "gradient_boosting",
        accuracy: 87,
        features: [
          { name: "Days since last order", importance: 35 },
          { name: "Order frequency", importance: 28 },
          { name: "Email engagement", importance: 18 },
          { name: "Customer tenure", importance: 12 },
          { name: "Average order value", importance: 7 },
        ],
        trainedOn: new Date("2024-12-01"),
        lastUpdated: new Date("2025-01-01"),
        predictions: 125000,
        performance: {
          precision: 0.85,
          recall: 0.82,
          f1Score: 0.83,
          auc: 0.91,
        },
      },
      {
        id: "model-ltv",
        name: "Lifetime Value Prediction Model",
        type: "ltv",
        algorithm: "random_forest",
        accuracy: 82,
        features: [
          { name: "Average order value", importance: 40 },
          { name: "Order frequency", importance: 30 },
          { name: "Customer tenure", importance: 15 },
          { name: "Product categories", importance: 10 },
          { name: "Engagement score", importance: 5 },
        ],
        trainedOn: new Date("2024-12-01"),
        lastUpdated: new Date("2025-01-01"),
        predictions: 125000,
        performance: {
          precision: 0.80,
          recall: 0.78,
          f1Score: 0.79,
          auc: 0.86,
        },
      },
    ],
    segments: customerSegments,
  };
}

// Customer 360 view
export interface Customer360 {
  profile: CustomerProfile;
  journey: CustomerJourney;
  rfm: ReturnType<typeof calculateRFM>;
  churnPrediction: ReturnType<typeof predictChurn>;
  ltvPrediction: ReturnType<typeof predictLifetimeValue>;
  nextPurchase: ReturnType<typeof predictNextPurchase>;
  recommendations: {
    products: { id: string; name: string; score: number }[];
    offers: { id: string; title: string; discount: number }[];
    content: { id: string; title: string; relevance: number }[];
  };
  timeline: {
    date: Date;
    event: string;
    type: "order" | "email" | "support" | "review" | "referral";
    details: any;
  }[];
}

export function getCustomer360(customerId: string): Customer360 {
  // Mock implementation - in production, aggregate from all systems
  const profile: CustomerProfile = {
    id: customerId,
    demographics: {
      age: 32,
      gender: "female",
      location: { city: "São Paulo", state: "SP", country: "Brazil" },
      language: "pt-BR",
      timezone: "America/Sao_Paulo",
    },
    behavior: {
      totalOrders: 15,
      totalSpent: 6750,
      averageOrderValue: 450,
      lastOrderDate: new Date("2024-12-15"),
      firstOrderDate: new Date("2024-01-10"),
      daysSinceLastOrder: 45,
      orderFrequency: 4.5,
      favoriteCategories: [
        { category: "Brinquedos", count: 8 },
        { category: "Alimentação", count: 5 },
      ],
      favoriteProducts: [
        { productId: "prod-1", purchases: 3 },
        { productId: "prod-2", purchases: 2 },
      ],
      browsing: {
        sessionsCount: 45,
        avgSessionDuration: 420,
        pagesPerSession: 5.2,
        bounceRate: 28,
      },
    },
    engagement: {
      emailOpens: 32,
      emailClicks: 18,
      smsResponses: 5,
      reviewsWritten: 4,
      wishlistItems: 12,
      referrals: 2,
      loyaltyPoints: 6750,
      level: "Gold",
    },
    predictions: {
      churnRisk: 25,
      lifetimeValue: 15000,
      nextPurchaseDate: new Date("2025-02-15"),
      nextPurchaseCategory: "Brinquedos",
      nextPurchaseAmount: 495,
      conversionProbability: 75,
      upsellOpportunity: 65,
    },
    segments: ["Loyal Customers", "High Value"],
    scores: {
      rfm: { recency: 4, frequency: 5, monetary: 4, score: "454" },
      engagement: 78,
      satisfaction: 85,
      advocacy: 72,
    },
  };

  return {
    profile,
    journey: mapCustomerJourney(customerId),
    rfm: calculateRFM(profile),
    churnPrediction: predictChurn(profile),
    ltvPrediction: predictLifetimeValue(profile),
    nextPurchase: predictNextPurchase(profile),
    recommendations: {
      products: [
        { id: "prod-123", name: "Bola Interativa Premium", score: 92 },
        { id: "prod-456", name: "Ração Super Premium 15kg", score: 88 },
        { id: "prod-789", name: "Arranhador Luxo", score: 85 },
      ],
      offers: [
        { id: "offer-1", title: "15% off em Brinquedos", discount: 15 },
        { id: "offer-2", title: "Frete Grátis acima de R$ 200", discount: 0 },
      ],
      content: [
        { id: "content-1", title: "Como escolher brinquedos para seu pet", relevance: 95 },
        { id: "content-2", title: "Guia de alimentação saudável", relevance: 88 },
      ],
    },
    timeline: [
      {
        date: new Date("2024-12-15"),
        event: "Purchased Bola Interativa Premium",
        type: "order",
        details: { orderId: "ORD-12345", amount: 450 },
      },
      {
        date: new Date("2024-12-10"),
        event: "Opened email: Novidades de Dezembro",
        type: "email",
        details: { emailId: "email-456", clicked: true },
      },
    ],
  };
}
