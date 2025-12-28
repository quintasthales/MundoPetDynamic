// Customer Segmentation and Targeting System

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  rules: SegmentRule[];
  customerCount: number;
  averageOrderValue: number;
  lifetimeValue: number;
  conversionRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SegmentRule {
  field: string;
  operator:
    | "equals"
    | "not_equals"
    | "greater_than"
    | "less_than"
    | "contains"
    | "not_contains"
    | "in"
    | "not_in";
  value: any;
  logic?: "AND" | "OR";
}

export interface Customer {
  id: string;
  email: string;
  name: string;
  registeredAt: Date;
  lastPurchaseAt?: Date;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lifetimeValue: number;
  tags: string[];
  location: {
    city?: string;
    state?: string;
    country: string;
  };
  behavior: {
    emailOpens: number;
    emailClicks: number;
    pageViews: number;
    cartAbandons: number;
    wishlistItems: number;
    reviewsWritten: number;
  };
  preferences: {
    categories: string[];
    priceRange: { min: number; max: number };
    brands: string[];
  };
}

// Predefined segments
export const predefinedSegments: CustomerSegment[] = [
  {
    id: "seg-vip",
    name: "VIP Customers",
    description: "High-value customers with lifetime value > R$ 1,000",
    rules: [
      {
        field: "lifetimeValue",
        operator: "greater_than",
        value: 1000,
      },
    ],
    customerCount: 234,
    averageOrderValue: 245.5,
    lifetimeValue: 1567.3,
    conversionRate: 45.2,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-12-28"),
  },
  {
    id: "seg-at-risk",
    name: "At-Risk Customers",
    description: "Previously active customers who haven't purchased in 90+ days",
    rules: [
      {
        field: "totalOrders",
        operator: "greater_than",
        value: 2,
      },
      {
        field: "daysSinceLastPurchase",
        operator: "greater_than",
        value: 90,
        logic: "AND",
      },
    ],
    customerCount: 456,
    averageOrderValue: 125.3,
    lifetimeValue: 387.9,
    conversionRate: 12.5,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-12-28"),
  },
  {
    id: "seg-new",
    name: "New Customers",
    description: "Registered in the last 30 days",
    rules: [
      {
        field: "daysSinceRegistration",
        operator: "less_than",
        value: 30,
      },
    ],
    customerCount: 789,
    averageOrderValue: 98.7,
    lifetimeValue: 98.7,
    conversionRate: 8.3,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-12-28"),
  },
  {
    id: "seg-loyal",
    name: "Loyal Customers",
    description: "5+ orders in the last 6 months",
    rules: [
      {
        field: "ordersLast6Months",
        operator: "greater_than",
        value: 5,
      },
    ],
    customerCount: 345,
    averageOrderValue: 156.8,
    lifetimeValue: 892.4,
    conversionRate: 38.7,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-12-28"),
  },
  {
    id: "seg-cart-abandoners",
    name: "Cart Abandoners",
    description: "Abandoned cart in the last 7 days",
    rules: [
      {
        field: "cartAbandonsLast7Days",
        operator: "greater_than",
        value: 0,
      },
    ],
    customerCount: 567,
    averageOrderValue: 0,
    lifetimeValue: 234.5,
    conversionRate: 0,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-12-28"),
  },
  {
    id: "seg-high-engagement",
    name: "High Engagement",
    description: "High email engagement and page views",
    rules: [
      {
        field: "emailOpenRate",
        operator: "greater_than",
        value: 40,
      },
      {
        field: "pageViewsLast30Days",
        operator: "greater_than",
        value: 20,
        logic: "AND",
      },
    ],
    customerCount: 678,
    averageOrderValue: 167.9,
    lifetimeValue: 445.6,
    conversionRate: 25.4,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-12-28"),
  },
  {
    id: "seg-one-time",
    name: "One-Time Buyers",
    description: "Made exactly 1 purchase",
    rules: [
      {
        field: "totalOrders",
        operator: "equals",
        value: 1,
      },
    ],
    customerCount: 1234,
    averageOrderValue: 87.5,
    lifetimeValue: 87.5,
    conversionRate: 5.2,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-12-28"),
  },
  {
    id: "seg-big-spenders",
    name: "Big Spenders",
    description: "Average order value > R$ 200",
    rules: [
      {
        field: "averageOrderValue",
        operator: "greater_than",
        value: 200,
      },
    ],
    customerCount: 189,
    averageOrderValue: 287.3,
    lifetimeValue: 1245.7,
    conversionRate: 42.8,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-12-28"),
  },
];

// Check if customer matches segment
export function customerMatchesSegment(
  customer: Customer,
  segment: CustomerSegment
): boolean {
  let matches = true;
  let currentLogic: "AND" | "OR" = "AND";

  for (const rule of segment.rules) {
    const ruleMatches = evaluateRule(customer, rule);

    if (currentLogic === "AND") {
      matches = matches && ruleMatches;
    } else {
      matches = matches || ruleMatches;
    }

    currentLogic = rule.logic || "AND";
  }

  return matches;
}

// Evaluate a single rule
function evaluateRule(customer: Customer, rule: SegmentRule): boolean {
  const value = getCustomerValue(customer, rule.field);

  switch (rule.operator) {
    case "equals":
      return value === rule.value;
    case "not_equals":
      return value !== rule.value;
    case "greater_than":
      return Number(value) > Number(rule.value);
    case "less_than":
      return Number(value) < Number(rule.value);
    case "contains":
      return String(value).toLowerCase().includes(String(rule.value).toLowerCase());
    case "not_contains":
      return !String(value).toLowerCase().includes(String(rule.value).toLowerCase());
    case "in":
      return Array.isArray(rule.value) && rule.value.includes(value);
    case "not_in":
      return Array.isArray(rule.value) && !rule.value.includes(value);
    default:
      return false;
  }
}

// Get customer value by field path
function getCustomerValue(customer: Customer, field: string): any {
  // Handle nested fields
  const parts = field.split(".");
  let value: any = customer;

  for (const part of parts) {
    value = value?.[part];
  }

  // Calculate derived fields
  if (field === "daysSinceRegistration") {
    return Math.floor(
      (Date.now() - customer.registeredAt.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  if (field === "daysSinceLastPurchase") {
    if (!customer.lastPurchaseAt) return Infinity;
    return Math.floor(
      (Date.now() - customer.lastPurchaseAt.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  if (field === "emailOpenRate") {
    const total = customer.behavior.emailOpens + customer.behavior.emailClicks;
    return total > 0 ? (customer.behavior.emailOpens / total) * 100 : 0;
  }

  return value;
}

// Get customer segments
export function getCustomerSegments(customer: Customer): CustomerSegment[] {
  return predefinedSegments.filter((segment) =>
    customerMatchesSegment(customer, segment)
  );
}

// Create custom segment
export function createSegment(data: {
  name: string;
  description: string;
  rules: SegmentRule[];
}): CustomerSegment {
  const segment: CustomerSegment = {
    id: `seg-${Date.now()}`,
    name: data.name,
    description: data.description,
    rules: data.rules,
    customerCount: 0,
    averageOrderValue: 0,
    lifetimeValue: 0,
    conversionRate: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // In production, save to database and calculate metrics
  predefinedSegments.push(segment);

  return segment;
}

// Get segment statistics
export interface SegmentStats {
  segment: CustomerSegment;
  growth: {
    customers: number; // % change
    revenue: number; // % change
    orders: number; // % change
  };
  topProducts: {
    productId: string;
    productName: string;
    orders: number;
    revenue: number;
  }[];
  demographics: {
    topCities: { city: string; count: number }[];
    topStates: { state: string; count: number }[];
  };
}

export function getSegmentStats(segmentId: string): SegmentStats | null {
  const segment = predefinedSegments.find((s) => s.id === segmentId);
  if (!segment) return null;

  // Mock stats - in production, calculate from database
  return {
    segment,
    growth: {
      customers: 12.5,
      revenue: 18.3,
      orders: 15.7,
    },
    topProducts: [
      {
        productId: "difusor-aromatico",
        productName: "Difusor Aromático",
        orders: 45,
        revenue: 5845.5,
      },
      {
        productId: "coleira-led",
        productName: "Coleira LED",
        orders: 38,
        revenue: 1896.2,
      },
    ],
    demographics: {
      topCities: [
        { city: "São Paulo", count: 123 },
        { city: "Rio de Janeiro", count: 89 },
        { city: "Belo Horizonte", count: 56 },
      ],
      topStates: [
        { state: "SP", count: 234 },
        { state: "RJ", count: 156 },
        { state: "MG", count: 98 },
      ],
    },
  };
}

// Targeting campaigns
export interface Campaign {
  id: string;
  name: string;
  type: "email" | "sms" | "push" | "banner" | "discount";
  segmentIds: string[];
  content: {
    subject?: string;
    message: string;
    cta?: string;
    discount?: {
      type: "percentage" | "fixed";
      value: number;
      code: string;
    };
  };
  schedule: {
    startDate: Date;
    endDate?: Date;
    frequency?: "once" | "daily" | "weekly" | "monthly";
  };
  status: "draft" | "scheduled" | "running" | "completed" | "paused";
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
    revenue: number;
  };
}

export const campaigns: Campaign[] = [
  {
    id: "camp-001",
    name: "Win-Back Campaign - At-Risk Customers",
    type: "email",
    segmentIds: ["seg-at-risk"],
    content: {
      subject: "Sentimos sua falta! 20% OFF especial para você",
      message:
        "Olá! Notamos que você não compra há algum tempo. Preparamos um desconto especial de 20% para você voltar!",
      cta: "Aproveitar Desconto",
      discount: {
        type: "percentage",
        value: 20,
        code: "WINBACK20",
      },
    },
    schedule: {
      startDate: new Date("2024-12-01"),
      frequency: "weekly",
    },
    status: "running",
    metrics: {
      sent: 456,
      delivered: 445,
      opened: 223,
      clicked: 89,
      converted: 34,
      revenue: 4567.8,
    },
  },
  {
    id: "camp-002",
    name: "VIP Exclusive - New Products",
    type: "email",
    segmentIds: ["seg-vip"],
    content: {
      subject: "Acesso Exclusivo: Novos Produtos VIP",
      message:
        "Como cliente VIP, você tem acesso antecipado aos nossos novos produtos premium!",
      cta: "Ver Novidades",
    },
    schedule: {
      startDate: new Date("2024-12-15"),
      frequency: "once",
    },
    status: "completed",
    metrics: {
      sent: 234,
      delivered: 232,
      opened: 198,
      clicked: 145,
      converted: 67,
      revenue: 16453.2,
    },
  },
];

// Create campaign
export function createCampaign(data: {
  name: string;
  type: Campaign["type"];
  segmentIds: string[];
  content: Campaign["content"];
  schedule: Campaign["schedule"];
}): Campaign {
  const campaign: Campaign = {
    id: `camp-${Date.now()}`,
    name: data.name,
    type: data.type,
    segmentIds: data.segmentIds,
    content: data.content,
    schedule: data.schedule,
    status: "draft",
    metrics: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
    },
  };

  // In production, save to database
  campaigns.push(campaign);

  return campaign;
}

// Get campaign performance
export interface CampaignPerformance {
  campaign: Campaign;
  roi: number;
  costPerAcquisition: number;
  conversionRate: number;
  clickThroughRate: number;
  openRate: number;
  revenuePerRecipient: number;
}

export function getCampaignPerformance(
  campaignId: string
): CampaignPerformance | null {
  const campaign = campaigns.find((c) => c.id === campaignId);
  if (!campaign) return null;

  const { metrics } = campaign;
  const cost = metrics.sent * 0.1; // Assume R$ 0.10 per email

  return {
    campaign,
    roi: ((metrics.revenue - cost) / cost) * 100,
    costPerAcquisition: metrics.converted > 0 ? cost / metrics.converted : 0,
    conversionRate: (metrics.converted / metrics.sent) * 100,
    clickThroughRate: (metrics.clicked / metrics.opened) * 100,
    openRate: (metrics.opened / metrics.delivered) * 100,
    revenuePerRecipient: metrics.revenue / metrics.sent,
  };
}

// RFM Analysis (Recency, Frequency, Monetary)
export interface RFMScore {
  customerId: string;
  recency: number; // 1-5 (5 = most recent)
  frequency: number; // 1-5 (5 = most frequent)
  monetary: number; // 1-5 (5 = highest value)
  total: number; // Sum of R, F, M
  segment: string;
}

export function calculateRFM(customer: Customer): RFMScore {
  // Calculate recency score (days since last purchase)
  const daysSinceLastPurchase = customer.lastPurchaseAt
    ? Math.floor(
        (Date.now() - customer.lastPurchaseAt.getTime()) / (1000 * 60 * 60 * 24)
      )
    : 999;

  let recency = 1;
  if (daysSinceLastPurchase <= 30) recency = 5;
  else if (daysSinceLastPurchase <= 60) recency = 4;
  else if (daysSinceLastPurchase <= 90) recency = 3;
  else if (daysSinceLastPurchase <= 180) recency = 2;

  // Calculate frequency score (number of orders)
  let frequency = 1;
  if (customer.totalOrders >= 10) frequency = 5;
  else if (customer.totalOrders >= 7) frequency = 4;
  else if (customer.totalOrders >= 4) frequency = 3;
  else if (customer.totalOrders >= 2) frequency = 2;

  // Calculate monetary score (lifetime value)
  let monetary = 1;
  if (customer.lifetimeValue >= 1000) monetary = 5;
  else if (customer.lifetimeValue >= 500) monetary = 4;
  else if (customer.lifetimeValue >= 250) monetary = 3;
  else if (customer.lifetimeValue >= 100) monetary = 2;

  const total = recency + frequency + monetary;

  // Determine segment based on RFM
  let segment = "Lost";
  if (recency >= 4 && frequency >= 4 && monetary >= 4) segment = "Champions";
  else if (recency >= 3 && frequency >= 3 && monetary >= 3) segment = "Loyal";
  else if (recency >= 4 && frequency <= 2) segment = "New";
  else if (recency <= 2 && frequency >= 3) segment = "At Risk";
  else if (recency <= 2 && frequency <= 2 && monetary >= 3)
    segment = "Can't Lose";
  else if (recency >= 3 && frequency <= 2 && monetary <= 2)
    segment = "Promising";

  return {
    customerId: customer.id,
    recency,
    frequency,
    monetary,
    total,
    segment,
  };
}

// Cohort analysis
export interface Cohort {
  month: string;
  customersAcquired: number;
  retention: {
    month1: number;
    month2: number;
    month3: number;
    month6: number;
    month12: number;
  };
  revenue: {
    month1: number;
    month2: number;
    month3: number;
    month6: number;
    month12: number;
  };
}

export function getCohortAnalysis(): Cohort[] {
  // Mock data - in production, calculate from database
  return [
    {
      month: "2024-01",
      customersAcquired: 234,
      retention: {
        month1: 45.3,
        month2: 32.1,
        month3: 28.6,
        month6: 22.4,
        month12: 18.7,
      },
      revenue: {
        month1: 23450.0,
        month2: 15670.0,
        month3: 12340.0,
        month6: 9870.0,
        month12: 7650.0,
      },
    },
  ];
}
