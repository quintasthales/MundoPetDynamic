// Customer Lifecycle and Retention Management System

export interface CustomerLifecycleStage {
  id: string;
  name: string;
  description: string;
  criteria: {
    daysSinceRegistration?: { min?: number; max?: number };
    totalOrders?: { min?: number; max?: number };
    totalSpent?: { min?: number; max?: number };
    daysSinceLastOrder?: { min?: number; max?: number };
    engagementScore?: { min?: number; max?: number };
  };
  actions: {
    type: "email" | "sms" | "notification" | "discount" | "upgrade";
    template: string;
    delay?: number; // hours
  }[];
  nextStages: string[];
}

export interface CustomerJourney {
  customerId: string;
  currentStage: string;
  stages: {
    stageId: string;
    stageName: string;
    enteredAt: Date;
    exitedAt?: Date;
    duration?: number; // days
    actions: {
      type: string;
      executedAt: Date;
      result: "success" | "failed" | "pending";
    }[];
  }[];
  metrics: {
    lifetimeValue: number;
    averageOrderValue: number;
    orderFrequency: number;
    churnRisk: number; // 0-100
    engagementScore: number; // 0-100
  };
  predictions: {
    nextPurchaseDate?: Date;
    nextPurchaseProbability: number;
    churnProbability: number;
    lifetimeValuePrediction: number;
  };
}

export interface RetentionCampaign {
  id: string;
  name: string;
  type: "win_back" | "reactivation" | "loyalty" | "upsell" | "cross_sell";
  targetSegment: {
    stage?: string[];
    churnRisk?: { min?: number; max?: number };
    daysSinceLastOrder?: { min?: number; max?: number };
    totalSpent?: { min?: number; max?: number };
  };
  incentive: {
    type: "discount" | "free_shipping" | "gift" | "points" | "upgrade";
    value: number;
    description: string;
  };
  channels: ("email" | "sms" | "push" | "whatsapp")[];
  schedule: {
    startDate: Date;
    endDate?: Date;
    frequency?: "once" | "weekly" | "monthly";
  };
  metrics: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
    revenue: number;
    roi: number;
  };
  status: "draft" | "active" | "paused" | "completed";
}

export interface ChurnPrediction {
  customerId: string;
  churnProbability: number; // 0-100
  riskLevel: "low" | "medium" | "high" | "critical";
  factors: {
    factor: string;
    impact: number;
    description: string;
  }[];
  recommendedActions: {
    action: string;
    priority: number;
    expectedImpact: number;
  }[];
  predictedChurnDate?: Date;
}

export interface EngagementScore {
  customerId: string;
  score: number; // 0-100
  components: {
    recency: number; // 0-100
    frequency: number; // 0-100
    monetary: number; // 0-100
    engagement: number; // 0-100
  };
  trend: "increasing" | "stable" | "decreasing";
  lastUpdated: Date;
}

// Lifecycle stages
export const lifecycleStages: CustomerLifecycleStage[] = [
  {
    id: "stage-001",
    name: "New Customer",
    description: "Recently registered, no orders yet",
    criteria: {
      daysSinceRegistration: { max: 7 },
      totalOrders: { max: 0 },
    },
    actions: [
      {
        type: "email",
        template: "welcome_series",
        delay: 0,
      },
      {
        type: "discount",
        template: "first_purchase_10",
        delay: 24,
      },
    ],
    nextStages: ["stage-002", "stage-008"],
  },
  {
    id: "stage-002",
    name: "First Purchase",
    description: "Made first purchase",
    criteria: {
      totalOrders: { min: 1, max: 1 },
    },
    actions: [
      {
        type: "email",
        template: "thank_you_first_order",
        delay: 1,
      },
      {
        type: "email",
        template: "product_tips",
        delay: 72,
      },
    ],
    nextStages: ["stage-003", "stage-006"],
  },
  {
    id: "stage-003",
    name: "Repeat Customer",
    description: "Made 2-5 purchases",
    criteria: {
      totalOrders: { min: 2, max: 5 },
    },
    actions: [
      {
        type: "email",
        template: "loyalty_program_invite",
        delay: 0,
      },
    ],
    nextStages: ["stage-004", "stage-006"],
  },
  {
    id: "stage-004",
    name: "Loyal Customer",
    description: "Made 6+ purchases or spent R$ 1000+",
    criteria: {
      totalOrders: { min: 6 },
      totalSpent: { min: 1000 },
    },
    actions: [
      {
        type: "upgrade",
        template: "vip_status",
        delay: 0,
      },
      {
        type: "email",
        template: "exclusive_offers",
        delay: 0,
      },
    ],
    nextStages: ["stage-005", "stage-006"],
  },
  {
    id: "stage-005",
    name: "VIP Customer",
    description: "Top 10% customers by value",
    criteria: {
      totalSpent: { min: 5000 },
      totalOrders: { min: 10 },
    },
    actions: [
      {
        type: "email",
        template: "vip_perks",
        delay: 0,
      },
    ],
    nextStages: ["stage-006"],
  },
  {
    id: "stage-006",
    name: "At Risk",
    description: "No purchase in 60+ days",
    criteria: {
      daysSinceLastOrder: { min: 60 },
      totalOrders: { min: 1 },
    },
    actions: [
      {
        type: "email",
        template: "we_miss_you",
        delay: 0,
      },
      {
        type: "discount",
        template: "comeback_20",
        delay: 72,
      },
    ],
    nextStages: ["stage-003", "stage-007"],
  },
  {
    id: "stage-007",
    name: "Churned",
    description: "No purchase in 180+ days",
    criteria: {
      daysSinceLastOrder: { min: 180 },
    },
    actions: [
      {
        type: "email",
        template: "win_back_campaign",
        delay: 0,
      },
    ],
    nextStages: ["stage-003"],
  },
  {
    id: "stage-008",
    name: "Abandoned Registration",
    description: "Registered but never purchased",
    criteria: {
      daysSinceRegistration: { min: 14 },
      totalOrders: { max: 0 },
    },
    actions: [
      {
        type: "email",
        template: "special_offer",
        delay: 0,
      },
    ],
    nextStages: ["stage-002"],
  },
];

// Mock customer journeys
export const customerJourneys: CustomerJourney[] = [];

// Calculate customer lifecycle stage
export function calculateLifecycleStage(customerData: {
  customerId: string;
  registrationDate: Date;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: Date;
}): string {
  const now = new Date();
  const daysSinceRegistration = Math.floor(
    (now.getTime() - customerData.registrationDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const daysSinceLastOrder = customerData.lastOrderDate
    ? Math.floor(
        (now.getTime() - customerData.lastOrderDate.getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 999;

  // Check stages in priority order
  for (const stage of lifecycleStages) {
    let matches = true;

    if (stage.criteria.daysSinceRegistration) {
      const { min, max } = stage.criteria.daysSinceRegistration;
      if (min !== undefined && daysSinceRegistration < min) matches = false;
      if (max !== undefined && daysSinceRegistration > max) matches = false;
    }

    if (stage.criteria.totalOrders) {
      const { min, max } = stage.criteria.totalOrders;
      if (min !== undefined && customerData.totalOrders < min) matches = false;
      if (max !== undefined && customerData.totalOrders > max) matches = false;
    }

    if (stage.criteria.totalSpent) {
      const { min, max } = stage.criteria.totalSpent;
      if (min !== undefined && customerData.totalSpent < min) matches = false;
      if (max !== undefined && customerData.totalSpent > max) matches = false;
    }

    if (stage.criteria.daysSinceLastOrder) {
      const { min, max } = stage.criteria.daysSinceLastOrder;
      if (min !== undefined && daysSinceLastOrder < min) matches = false;
      if (max !== undefined && daysSinceLastOrder > max) matches = false;
    }

    if (matches) {
      return stage.id;
    }
  }

  return "stage-001"; // Default to new customer
}

// Calculate churn prediction
export function calculateChurnPrediction(customerData: {
  customerId: string;
  daysSinceLastOrder: number;
  totalOrders: number;
  averageOrderInterval: number; // days
  engagementScore: number;
  supportTickets: number;
}): ChurnPrediction {
  let churnProbability = 0;
  const factors: ChurnPrediction["factors"] = [];

  // Factor 1: Days since last order
  if (customerData.daysSinceLastOrder > customerData.averageOrderInterval * 2) {
    const impact = Math.min(
      40,
      (customerData.daysSinceLastOrder / customerData.averageOrderInterval) * 10
    );
    churnProbability += impact;
    factors.push({
      factor: "Inactivity",
      impact,
      description: `${customerData.daysSinceLastOrder} dias sem comprar`,
    });
  }

  // Factor 2: Low engagement
  if (customerData.engagementScore < 30) {
    const impact = 30 - customerData.engagementScore;
    churnProbability += impact;
    factors.push({
      factor: "Baixo engajamento",
      impact,
      description: `Score de engajamento: ${customerData.engagementScore}/100`,
    });
  }

  // Factor 3: Support tickets
  if (customerData.supportTickets > 3) {
    const impact = Math.min(20, customerData.supportTickets * 5);
    churnProbability += impact;
    factors.push({
      factor: "Problemas de suporte",
      impact,
      description: `${customerData.supportTickets} tickets abertos`,
    });
  }

  // Factor 4: Order frequency decline
  if (customerData.totalOrders > 3) {
    const expectedInterval = customerData.averageOrderInterval;
    if (customerData.daysSinceLastOrder > expectedInterval * 1.5) {
      const impact = 15;
      churnProbability += impact;
      factors.push({
        factor: "Frequência em declínio",
        impact,
        description: "Intervalo entre compras aumentou",
      });
    }
  }

  churnProbability = Math.min(100, churnProbability);

  let riskLevel: ChurnPrediction["riskLevel"];
  if (churnProbability >= 70) riskLevel = "critical";
  else if (churnProbability >= 50) riskLevel = "high";
  else if (churnProbability >= 30) riskLevel = "medium";
  else riskLevel = "low";

  const recommendedActions: ChurnPrediction["recommendedActions"] = [];

  if (churnProbability > 30) {
    recommendedActions.push({
      action: "Enviar cupom de desconto personalizado",
      priority: 1,
      expectedImpact: 25,
    });
  }

  if (customerData.engagementScore < 30) {
    recommendedActions.push({
      action: "Campanha de reengajamento",
      priority: 2,
      expectedImpact: 20,
    });
  }

  if (customerData.supportTickets > 0) {
    recommendedActions.push({
      action: "Contato proativo do suporte",
      priority: 1,
      expectedImpact: 30,
    });
  }

  return {
    customerId: customerData.customerId,
    churnProbability,
    riskLevel,
    factors,
    recommendedActions: recommendedActions.sort((a, b) => a.priority - b.priority),
  };
}

// Calculate engagement score
export function calculateEngagementScore(customerData: {
  customerId: string;
  daysSinceLastOrder: number;
  totalOrders: number;
  totalSpent: number;
  emailOpens: number;
  emailClicks: number;
  siteVisits: number;
  reviewsWritten: number;
  referrals: number;
}): EngagementScore {
  // Recency score (0-100)
  let recency = 100;
  if (customerData.daysSinceLastOrder > 0) {
    recency = Math.max(0, 100 - customerData.daysSinceLastOrder * 2);
  }

  // Frequency score (0-100)
  const frequency = Math.min(100, customerData.totalOrders * 10);

  // Monetary score (0-100)
  const monetary = Math.min(100, (customerData.totalSpent / 100) * 2);

  // Engagement score (0-100)
  let engagement = 0;
  engagement += Math.min(30, customerData.emailOpens * 2);
  engagement += Math.min(20, customerData.emailClicks * 5);
  engagement += Math.min(20, customerData.siteVisits);
  engagement += Math.min(15, customerData.reviewsWritten * 15);
  engagement += Math.min(15, customerData.referrals * 15);

  // Overall score (weighted average)
  const score = Math.round(
    recency * 0.3 + frequency * 0.25 + monetary * 0.25 + engagement * 0.2
  );

  // Determine trend (mock - in production, compare with historical data)
  const trend: EngagementScore["trend"] = score > 60 ? "increasing" : score > 40 ? "stable" : "decreasing";

  return {
    customerId: customerData.customerId,
    score,
    components: {
      recency,
      frequency,
      monetary,
      engagement,
    },
    trend,
    lastUpdated: new Date(),
  };
}

// Create retention campaign
export const retentionCampaigns: RetentionCampaign[] = [];

export function createRetentionCampaign(data: {
  name: string;
  type: RetentionCampaign["type"];
  targetSegment: RetentionCampaign["targetSegment"];
  incentive: RetentionCampaign["incentive"];
  channels: RetentionCampaign["channels"];
  startDate: Date;
  endDate?: Date;
}): RetentionCampaign {
  const campaign: RetentionCampaign = {
    id: `camp-${Date.now()}`,
    name: data.name,
    type: data.type,
    targetSegment: data.targetSegment,
    incentive: data.incentive,
    channels: data.channels,
    schedule: {
      startDate: data.startDate,
      endDate: data.endDate,
    },
    metrics: {
      sent: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
      roi: 0,
    },
    status: "draft",
  };

  retentionCampaigns.push(campaign);

  return campaign;
}

// Execute retention campaign
export function executeRetentionCampaign(campaignId: string): {
  success: boolean;
  targetedCustomers: number;
  message: string;
} {
  const campaign = retentionCampaigns.find((c) => c.id === campaignId);

  if (!campaign) {
    return {
      success: false,
      targetedCustomers: 0,
      message: "Campaign not found",
    };
  }

  // Mock execution - in production, send actual emails/SMS
  const targetedCustomers = Math.floor(Math.random() * 500) + 100;

  campaign.status = "active";
  campaign.metrics.sent = targetedCustomers;

  return {
    success: true,
    targetedCustomers,
    message: `Campaign launched to ${targetedCustomers} customers`,
  };
}

// Lifecycle analytics
export interface LifecycleAnalytics {
  totalCustomers: number;
  byStage: {
    stageId: string;
    stageName: string;
    customers: number;
    percentage: number;
    averageValue: number;
  }[];
  churnRate: number;
  retentionRate: number;
  averageLifetimeValue: number;
  customerHealthScore: number; // 0-100
  atRiskCustomers: number;
  churnedCustomers: number;
  reactivationRate: number;
}

export function getLifecycleAnalytics(): LifecycleAnalytics {
  // Mock data
  const totalCustomers = 5678;
  const churnedCustomers = 234;
  const atRiskCustomers = 456;

  const byStage = lifecycleStages.map((stage) => {
    const customers = Math.floor(Math.random() * 500) + 100;
    return {
      stageId: stage.id,
      stageName: stage.name,
      customers,
      percentage: (customers / totalCustomers) * 100,
      averageValue: Math.random() * 1000 + 200,
    };
  });

  return {
    totalCustomers,
    byStage,
    churnRate: (churnedCustomers / totalCustomers) * 100,
    retentionRate: ((totalCustomers - churnedCustomers) / totalCustomers) * 100,
    averageLifetimeValue: 1234.56,
    customerHealthScore: 72,
    atRiskCustomers,
    churnedCustomers,
    reactivationRate: 15.5,
  };
}

// Predict next purchase
export function predictNextPurchase(customerData: {
  customerId: string;
  orderHistory: { date: Date; amount: number }[];
}): {
  predictedDate: Date;
  probability: number;
  confidence: number;
  predictedAmount: number;
} {
  if (customerData.orderHistory.length < 2) {
    return {
      predictedDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      probability: 30,
      confidence: 40,
      predictedAmount: 100,
    };
  }

  // Calculate average interval between orders
  const intervals: number[] = [];
  for (let i = 1; i < customerData.orderHistory.length; i++) {
    const interval =
      (customerData.orderHistory[i].date.getTime() -
        customerData.orderHistory[i - 1].date.getTime()) /
      (1000 * 60 * 60 * 24);
    intervals.push(interval);
  }

  const averageInterval =
    intervals.reduce((sum, i) => sum + i, 0) / intervals.length;

  const lastOrderDate =
    customerData.orderHistory[customerData.orderHistory.length - 1].date;
  const predictedDate = new Date(
    lastOrderDate.getTime() + averageInterval * 24 * 60 * 60 * 1000
  );

  // Calculate average order value
  const averageAmount =
    customerData.orderHistory.reduce((sum, o) => sum + o.amount, 0) /
    customerData.orderHistory.length;

  // Calculate probability based on consistency
  const intervalVariance =
    intervals.reduce((sum, i) => sum + Math.pow(i - averageInterval, 2), 0) /
    intervals.length;
  const consistency = Math.max(0, 100 - intervalVariance);
  const probability = Math.min(95, consistency);

  return {
    predictedDate,
    probability,
    confidence: consistency,
    predictedAmount: averageAmount,
  };
}

// Customer health score
export function calculateCustomerHealthScore(customerData: {
  engagementScore: number;
  churnProbability: number;
  lifetimeValue: number;
  daysSinceLastOrder: number;
  supportSatisfaction: number; // 0-100
}): number {
  let healthScore = 0;

  // Engagement (30%)
  healthScore += customerData.engagementScore * 0.3;

  // Churn risk (30% - inverted)
  healthScore += (100 - customerData.churnProbability) * 0.3;

  // Value (20%)
  const valueScore = Math.min(100, (customerData.lifetimeValue / 50) * 2);
  healthScore += valueScore * 0.2;

  // Recency (10%)
  const recencyScore = Math.max(0, 100 - customerData.daysSinceLastOrder * 2);
  healthScore += recencyScore * 0.1;

  // Support satisfaction (10%)
  healthScore += customerData.supportSatisfaction * 0.1;

  return Math.round(healthScore);
}

// Automated lifecycle actions
export interface LifecycleAutomation {
  id: string;
  name: string;
  trigger: {
    event:
      | "stage_change"
      | "churn_risk_high"
      | "milestone_reached"
      | "inactivity"
      | "high_value";
    conditions: Record<string, any>;
  };
  actions: {
    type: "email" | "sms" | "discount" | "notification" | "task";
    template: string;
    delay?: number; // hours
  }[];
  enabled: boolean;
  executionCount: number;
  successRate: number;
}

export const lifecycleAutomations: LifecycleAutomation[] = [
  {
    id: "auto-001",
    name: "Welcome new customers",
    trigger: {
      event: "stage_change",
      conditions: { newStage: "stage-001" },
    },
    actions: [
      {
        type: "email",
        template: "welcome_email",
        delay: 0,
      },
      {
        type: "discount",
        template: "first_order_10",
        delay: 24,
      },
    ],
    enabled: true,
    executionCount: 1234,
    successRate: 85.5,
  },
  {
    id: "auto-002",
    name: "Re-engage at-risk customers",
    trigger: {
      event: "churn_risk_high",
      conditions: { churnProbability: { min: 70 } },
    },
    actions: [
      {
        type: "email",
        template: "we_miss_you",
        delay: 0,
      },
      {
        type: "discount",
        template: "comeback_20",
        delay: 48,
      },
    ],
    enabled: true,
    executionCount: 456,
    successRate: 32.5,
  },
];

// Win-back campaign
export function createWinBackCampaign(
  churnedCustomers: string[]
): RetentionCampaign {
  return createRetentionCampaign({
    name: "Win Back Churned Customers",
    type: "win_back",
    targetSegment: {
      stage: ["stage-007"],
    },
    incentive: {
      type: "discount",
      value: 30,
      description: "30% de desconto na próxima compra",
    },
    channels: ["email", "sms"],
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}
