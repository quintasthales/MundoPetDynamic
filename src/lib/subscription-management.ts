// Subscription Management and Recurring Revenue System

export interface Subscription {
  id: string;
  customerId: string;
  planId: string;
  status:
    | "active"
    | "paused"
    | "cancelled"
    | "expired"
    | "past_due"
    | "trialing";
  billingCycle: "monthly" | "quarterly" | "semi_annual" | "annual";
  price: number;
  currency: string;
  startDate: Date;
  nextBillingDate?: Date;
  cancelledAt?: Date;
  pausedAt?: Date;
  trialEndDate?: Date;
  items: SubscriptionItem[];
  discounts: SubscriptionDiscount[];
  payment: PaymentInfo;
  delivery: DeliverySchedule;
  metadata: SubscriptionMetadata;
}

export interface SubscriptionItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  frequency: "every_delivery" | "every_2_deliveries" | "every_3_deliveries";
}

export interface SubscriptionDiscount {
  id: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  description: string;
  expiresAt?: Date;
}

export interface PaymentInfo {
  method: "credit_card" | "debit_card" | "pix" | "boleto";
  lastFourDigits?: string;
  brand?: string;
  expiryDate?: string;
  autoRenew: boolean;
}

export interface DeliverySchedule {
  frequency: number; // days
  nextDelivery: Date;
  deliveryDay?: number; // day of month
  deliveryWindow?: "morning" | "afternoon" | "evening";
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface SubscriptionMetadata {
  createdAt: Date;
  updatedAt: Date;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  lifetimeValue: number;
  churnRisk: number; // 0-100
  satisfactionScore?: number;
}

// Subscription Plans
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  billingCycles: {
    cycle: "monthly" | "quarterly" | "semi_annual" | "annual";
    price: number;
    discount: number;
    savings: number;
  }[];
  features: string[];
  benefits: PlanBenefit[];
  minItems?: number;
  maxItems?: number;
  freeShipping: boolean;
  cancelAnytime: boolean;
  trial?: {
    enabled: boolean;
    days: number;
    price: number;
  };
  popular?: boolean;
}

export interface PlanBenefit {
  icon: string;
  title: string;
  description: string;
}

export function getSubscriptionPlans(): SubscriptionPlan[] {
  return [
    {
      id: "plan-starter",
      name: "Starter Zen",
      description: "Perfeito para começar sua jornada aromática",
      category: "Difusores",
      basePrice: 79.9,
      billingCycles: [
        {
          cycle: "monthly",
          price: 79.9,
          discount: 0,
          savings: 0,
        },
        {
          cycle: "quarterly",
          price: 219.9,
          discount: 8,
          savings: 19.8,
        },
        {
          cycle: "annual",
          price: 839.9,
          discount: 12,
          savings: 119.0,
        },
      ],
      features: [
        "1 Difusor Aromático",
        "2 Óleos Essenciais (10ml)",
        "Entrega mensal",
        "Frete grátis",
        "Cancele quando quiser",
      ],
      benefits: [
        {
          icon: "🚚",
          title: "Frete Grátis",
          description: "Entrega gratuita em todo Brasil",
        },
        {
          icon: "🔄",
          title: "Flexibilidade",
          description: "Pause ou cancele quando quiser",
        },
        {
          icon: "💰",
          title: "Economia",
          description: "Até 12% de desconto no plano anual",
        },
      ],
      minItems: 1,
      maxItems: 3,
      freeShipping: true,
      cancelAnytime: true,
      trial: {
        enabled: true,
        days: 7,
        price: 0,
      },
    },
    {
      id: "plan-premium",
      name: "Premium Zen",
      description: "Para quem busca a melhor experiência aromática",
      category: "Difusores",
      basePrice: 149.9,
      billingCycles: [
        {
          cycle: "monthly",
          price: 149.9,
          discount: 0,
          savings: 0,
        },
        {
          cycle: "quarterly",
          price: 419.9,
          discount: 10,
          savings: 29.8,
        },
        {
          cycle: "annual",
          price: 1589.9,
          discount: 15,
          savings: 209.0,
        },
      ],
      features: [
        "1 Difusor Premium",
        "4 Óleos Essenciais (15ml)",
        "2 Velas Aromáticas",
        "Entrega quinzenal ou mensal",
        "Frete grátis prioritário",
        "Acesso antecipado a novos produtos",
        "Desconto de 10% em compras extras",
      ],
      benefits: [
        {
          icon: "⭐",
          title: "Produtos Premium",
          description: "Acesso a linha exclusiva de produtos",
        },
        {
          icon: "🎁",
          title: "Brindes",
          description: "Receba brindes surpresa mensalmente",
        },
        {
          icon: "💎",
          title: "VIP",
          description: "Atendimento prioritário e benefícios exclusivos",
        },
      ],
      minItems: 3,
      maxItems: 8,
      freeShipping: true,
      cancelAnytime: true,
      trial: {
        enabled: true,
        days: 14,
        price: 0,
      },
      popular: true,
    },
    {
      id: "plan-vip",
      name: "VIP Zen",
      description: "Experiência completa e personalizada",
      category: "Difusores",
      basePrice: 249.9,
      billingCycles: [
        {
          cycle: "monthly",
          price: 249.9,
          discount: 0,
          savings: 0,
        },
        {
          cycle: "quarterly",
          price: 689.9,
          discount: 12,
          savings: 59.8,
        },
        {
          cycle: "annual",
          price: 2549.9,
          discount: 20,
          savings: 449.0,
        },
      ],
      features: [
        "2 Difusores Premium",
        "6 Óleos Essenciais (30ml)",
        "4 Velas Aromáticas",
        "2 Incensos Premium",
        "Entrega semanal, quinzenal ou mensal",
        "Frete grátis express",
        "Consultoria aromática personalizada",
        "Desconto de 20% em compras extras",
        "Acesso a produtos exclusivos",
      ],
      benefits: [
        {
          icon: "👑",
          title: "Personalização",
          description: "Consultoria e curadoria personalizada",
        },
        {
          icon: "🚀",
          title: "Entrega Express",
          description: "Entrega prioritária em até 24h",
        },
        {
          icon: "🎯",
          title: "Exclusividade",
          description: "Produtos e fragrâncias exclusivas",
        },
      ],
      minItems: 5,
      maxItems: 15,
      freeShipping: true,
      cancelAnytime: true,
      trial: {
        enabled: true,
        days: 30,
        price: 0,
      },
    },
  ];
}

// Subscription Management
export class SubscriptionManager {
  private subscriptions: Map<string, Subscription> = new Map();
  
  // Create Subscription
  createSubscription(
    customerId: string,
    planId: string,
    items: SubscriptionItem[],
    billingCycle: Subscription["billingCycle"]
  ): Subscription {
    const plan = getSubscriptionPlans().find((p) => p.id === planId);
    if (!plan) throw new Error("Plan not found");
    
    const cycleInfo = plan.billingCycles.find((c) => c.cycle === billingCycle);
    if (!cycleInfo) throw new Error("Billing cycle not found");
    
    const subscription: Subscription = {
      id: `sub-${Date.now()}`,
      customerId,
      planId,
      status: plan.trial?.enabled ? "trialing" : "active",
      billingCycle,
      price: cycleInfo.price,
      currency: "BRL",
      startDate: new Date(),
      nextBillingDate: this.calculateNextBillingDate(
        new Date(),
        billingCycle
      ),
      trialEndDate: plan.trial?.enabled
        ? new Date(Date.now() + plan.trial.days * 24 * 60 * 60 * 1000)
        : undefined,
      items,
      discounts: [],
      payment: {
        method: "credit_card",
        autoRenew: true,
      },
      delivery: {
        frequency: 30,
        nextDelivery: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        address: {
          street: "",
          number: "",
          neighborhood: "",
          city: "",
          state: "",
          zipCode: "",
        },
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        totalOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
        lifetimeValue: 0,
        churnRisk: 0,
      },
    };
    
    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }
  
  // Update Subscription
  updateSubscription(
    subscriptionId: string,
    updates: Partial<Subscription>
  ): Subscription | undefined {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return undefined;
    
    const updated = {
      ...subscription,
      ...updates,
      metadata: {
        ...subscription.metadata,
        updatedAt: new Date(),
      },
    };
    
    this.subscriptions.set(subscriptionId, updated);
    return updated;
  }
  
  // Pause Subscription
  pauseSubscription(subscriptionId: string): Subscription | undefined {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return undefined;
    
    subscription.status = "paused";
    subscription.pausedAt = new Date();
    subscription.metadata.updatedAt = new Date();
    
    this.subscriptions.set(subscriptionId, subscription);
    return subscription;
  }
  
  // Resume Subscription
  resumeSubscription(subscriptionId: string): Subscription | undefined {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription || subscription.status !== "paused") return undefined;
    
    subscription.status = "active";
    subscription.pausedAt = undefined;
    subscription.nextBillingDate = this.calculateNextBillingDate(
      new Date(),
      subscription.billingCycle
    );
    subscription.metadata.updatedAt = new Date();
    
    this.subscriptions.set(subscriptionId, subscription);
    return subscription;
  }
  
  // Cancel Subscription
  cancelSubscription(
    subscriptionId: string,
    immediate: boolean = false
  ): Subscription | undefined {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return undefined;
    
    if (immediate) {
      subscription.status = "cancelled";
      subscription.cancelledAt = new Date();
      subscription.nextBillingDate = undefined;
    } else {
      // Cancel at end of billing period
      subscription.status = "cancelled";
      subscription.cancelledAt = subscription.nextBillingDate;
    }
    
    subscription.metadata.updatedAt = new Date();
    this.subscriptions.set(subscriptionId, subscription);
    return subscription;
  }
  
  // Change Plan
  changePlan(
    subscriptionId: string,
    newPlanId: string,
    billingCycle: Subscription["billingCycle"]
  ): Subscription | undefined {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return undefined;
    
    const newPlan = getSubscriptionPlans().find((p) => p.id === newPlanId);
    if (!newPlan) throw new Error("Plan not found");
    
    const cycleInfo = newPlan.billingCycles.find(
      (c) => c.cycle === billingCycle
    );
    if (!cycleInfo) throw new Error("Billing cycle not found");
    
    subscription.planId = newPlanId;
    subscription.billingCycle = billingCycle;
    subscription.price = cycleInfo.price;
    subscription.metadata.updatedAt = new Date();
    
    this.subscriptions.set(subscriptionId, subscription);
    return subscription;
  }
  
  // Add Discount
  addDiscount(
    subscriptionId: string,
    discount: SubscriptionDiscount
  ): Subscription | undefined {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return undefined;
    
    subscription.discounts.push(discount);
    subscription.metadata.updatedAt = new Date();
    
    this.subscriptions.set(subscriptionId, subscription);
    return subscription;
  }
  
  // Calculate Next Billing Date
  private calculateNextBillingDate(
    from: Date,
    cycle: Subscription["billingCycle"]
  ): Date {
    const date = new Date(from);
    
    switch (cycle) {
      case "monthly":
        date.setMonth(date.getMonth() + 1);
        break;
      case "quarterly":
        date.setMonth(date.getMonth() + 3);
        break;
      case "semi_annual":
        date.setMonth(date.getMonth() + 6);
        break;
      case "annual":
        date.setFullYear(date.getFullYear() + 1);
        break;
    }
    
    return date;
  }
  
  // Process Billing
  processBilling(subscriptionId: string): {
    success: boolean;
    orderId?: string;
    error?: string;
  } {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      return { success: false, error: "Subscription not found" };
    }
    
    if (subscription.status !== "active") {
      return { success: false, error: "Subscription not active" };
    }
    
    // Simulate payment processing
    const success = Math.random() > 0.05; // 95% success rate
    
    if (success) {
      // Update subscription
      subscription.nextBillingDate = this.calculateNextBillingDate(
        new Date(),
        subscription.billingCycle
      );
      subscription.metadata.totalOrders++;
      subscription.metadata.totalRevenue += subscription.price;
      subscription.metadata.averageOrderValue =
        subscription.metadata.totalRevenue /
        subscription.metadata.totalOrders;
      subscription.metadata.lifetimeValue =
        subscription.metadata.totalRevenue;
      subscription.metadata.updatedAt = new Date();
      
      this.subscriptions.set(subscriptionId, subscription);
      
      return {
        success: true,
        orderId: `order-${Date.now()}`,
      };
    } else {
      // Payment failed
      subscription.status = "past_due";
      subscription.metadata.churnRisk = 75;
      subscription.metadata.updatedAt = new Date();
      
      this.subscriptions.set(subscriptionId, subscription);
      
      return {
        success: false,
        error: "Payment failed",
      };
    }
  }
  
  // Calculate Churn Risk
  calculateChurnRisk(subscriptionId: string): number {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return 0;
    
    let risk = 0;
    
    // Payment failures
    if (subscription.status === "past_due") risk += 50;
    
    // Paused subscriptions
    if (subscription.status === "paused") {
      const daysPaused = subscription.pausedAt
        ? (Date.now() - subscription.pausedAt.getTime()) /
          (1000 * 60 * 60 * 24)
        : 0;
      risk += Math.min(daysPaused * 2, 40);
    }
    
    // Low engagement (few orders)
    if (subscription.metadata.totalOrders < 3) risk += 20;
    
    // Satisfaction score
    if (
      subscription.metadata.satisfactionScore &&
      subscription.metadata.satisfactionScore < 3
    ) {
      risk += 30;
    }
    
    return Math.min(risk, 100);
  }
}

// Subscription Analytics
export interface SubscriptionAnalytics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  pausedSubscriptions: number;
  cancelledSubscriptions: number;
  trialingSubscriptions: number;
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  averageSubscriptionValue: number;
  churnRate: number;
  retentionRate: number;
  lifetimeValue: number;
  planDistribution: {
    planId: string;
    planName: string;
    subscribers: number;
    revenue: number;
    percentage: number;
  }[];
  cohortAnalysis: {
    month: string;
    newSubscribers: number;
    retained: number;
    churned: number;
    retentionRate: number;
  }[];
}

export function getSubscriptionAnalytics(): SubscriptionAnalytics {
  return {
    totalSubscriptions: 8500,
    activeSubscriptions: 6850,
    pausedSubscriptions: 850,
    cancelledSubscriptions: 650,
    trialingSubscriptions: 150,
    monthlyRecurringRevenue: 685000,
    annualRecurringRevenue: 8220000,
    averageSubscriptionValue: 100.0,
    churnRate: 4.5,
    retentionRate: 95.5,
    lifetimeValue: 1850.0,
    planDistribution: [
      {
        planId: "plan-starter",
        planName: "Starter Zen",
        subscribers: 4250,
        revenue: 339575,
        percentage: 50.0,
      },
      {
        planId: "plan-premium",
        planName: "Premium Zen",
        subscribers: 3200,
        revenue: 479680,
        percentage: 37.6,
      },
      {
        planId: "plan-vip",
        planName: "VIP Zen",
        subscribers: 1050,
        revenue: 262395,
        percentage: 12.4,
      },
    ],
    cohortAnalysis: [
      {
        month: "Jan 2025",
        newSubscribers: 850,
        retained: 820,
        churned: 30,
        retentionRate: 96.5,
      },
      {
        month: "Dez 2024",
        newSubscribers: 785,
        retained: 745,
        churned: 40,
        retentionRate: 94.9,
      },
      {
        month: "Nov 2024",
        newSubscribers: 720,
        retained: 680,
        churned: 40,
        retentionRate: 94.4,
      },
    ],
  };
}

// Subscription Recommendations
export interface SubscriptionRecommendation {
  type: "upgrade" | "add_item" | "change_frequency" | "add_discount";
  title: string;
  description: string;
  impact: {
    revenue: number;
    retention: number;
  };
  action: {
    type: string;
    params: Record<string, any>;
  };
}

export function getSubscriptionRecommendations(
  subscriptionId: string
): SubscriptionRecommendation[] {
  return [
    {
      type: "upgrade",
      title: "Upgrade para Premium",
      description:
        "Economize 15% e receba produtos exclusivos com o plano Premium",
      impact: {
        revenue: 50.0,
        retention: 15,
      },
      action: {
        type: "change_plan",
        params: { planId: "plan-premium" },
      },
    },
    {
      type: "add_item",
      title: "Adicione Velas Aromáticas",
      description: "Complete sua experiência com nossas velas premium",
      impact: {
        revenue: 30.0,
        retention: 8,
      },
      action: {
        type: "add_item",
        params: { productId: "prod-vela" },
      },
    },
  ];
}

// Subscription Rewards
export interface SubscriptionReward {
  id: string;
  name: string;
  description: string;
  type: "discount" | "free_product" | "free_shipping" | "points";
  value: number;
  eligibility: {
    minMonths: number;
    minOrders: number;
    plans: string[];
  };
  expiresAt?: Date;
}

export function getSubscriptionRewards(): SubscriptionReward[] {
  return [
    {
      id: "reward-001",
      name: "Desconto Fidelidade",
      description: "10% de desconto por 6 meses de assinatura",
      type: "discount",
      value: 10,
      eligibility: {
        minMonths: 6,
        minOrders: 6,
        plans: ["plan-starter", "plan-premium", "plan-vip"],
      },
    },
    {
      id: "reward-002",
      name: "Produto Grátis",
      description: "Ganhe um óleo essencial grátis após 12 meses",
      type: "free_product",
      value: 1,
      eligibility: {
        minMonths: 12,
        minOrders: 12,
        plans: ["plan-premium", "plan-vip"],
      },
    },
  ];
}
