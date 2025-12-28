// Subscription Box and Recurring Orders System

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  interval: "weekly" | "biweekly" | "monthly" | "quarterly";
  products: {
    productId: string;
    productName: string;
    quantity: number;
    customizable: boolean;
  }[];
  benefits: string[];
  image: string;
  popular?: boolean;
  savings: number; // How much customer saves vs buying individually
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: "active" | "paused" | "cancelled" | "expired";
  startDate: Date;
  nextBillingDate: Date;
  lastBillingDate?: Date;
  customizations?: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: {
    type: "credit_card" | "pix";
    last4?: string;
    brand?: string;
  };
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  pausedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
}

export interface SubscriptionOrder {
  id: string;
  subscriptionId: string;
  orderId: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "refunded";
  billingDate: Date;
  paidAt?: Date;
  failureReason?: string;
  retryCount: number;
  nextRetryDate?: Date;
}

// Predefined subscription plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "sub-basic",
    name: "Caixa Básica Pet",
    description:
      "Produtos essenciais para o cuidado diário do seu pet. Perfeito para começar!",
    price: 89.9,
    originalPrice: 119.9,
    discount: 25,
    interval: "monthly",
    products: [
      {
        productId: "shampoo-natural",
        productName: "Shampoo Natural Pet Care",
        quantity: 1,
        customizable: false,
      },
      {
        productId: "escova-massageadora",
        productName: "Escova Massageadora",
        quantity: 1,
        customizable: false,
      },
      {
        productId: "petiscos-naturais",
        productName: "Petiscos Naturais (250g)",
        quantity: 1,
        customizable: true,
      },
    ],
    benefits: [
      "25% de desconto",
      "Frete grátis",
      "Produtos selecionados",
      "Cancele quando quiser",
    ],
    image: "/subscriptions/basic-box.jpg",
    savings: 30.0,
  },
  {
    id: "sub-premium",
    name: "Caixa Premium Pet",
    description:
      "Produtos premium e exclusivos para pets exigentes. Máximo cuidado e qualidade!",
    price: 149.9,
    originalPrice: 219.9,
    discount: 32,
    interval: "monthly",
    products: [
      {
        productId: "difusor-aromatico",
        productName: "Difusor Aromático Zen",
        quantity: 1,
        customizable: false,
      },
      {
        productId: "shampoo-premium",
        productName: "Shampoo Premium Hidratante",
        quantity: 1,
        customizable: false,
      },
      {
        productId: "coleira-led",
        productName: "Coleira LED Recarregável",
        quantity: 1,
        customizable: false,
      },
      {
        productId: "brinquedos-interativos",
        productName: "Kit Brinquedos Interativos",
        quantity: 1,
        customizable: true,
      },
    ],
    benefits: [
      "32% de desconto",
      "Frete grátis prioritário",
      "Produtos premium exclusivos",
      "Surpresas mensais",
      "Suporte prioritário",
      "Cancele quando quiser",
    ],
    image: "/subscriptions/premium-box.jpg",
    popular: true,
    savings: 70.0,
  },
  {
    id: "sub-deluxe",
    name: "Caixa Deluxe Pet",
    description:
      "A experiência definitiva para seu pet. Produtos de luxo e mimos especiais!",
    price: 249.9,
    originalPrice: 369.9,
    discount: 32,
    interval: "monthly",
    products: [
      {
        productId: "spa-kit",
        productName: "Kit Spa Completo",
        quantity: 1,
        customizable: false,
      },
      {
        productId: "cama-ortopedica",
        productName: "Cama Ortopédica Premium",
        quantity: 1,
        customizable: false,
      },
      {
        productId: "alimentacao-premium",
        productName: "Ração Premium Gourmet (2kg)",
        quantity: 1,
        customizable: true,
      },
      {
        productId: "acessorios-luxo",
        productName: "Acessórios de Luxo",
        quantity: 1,
        customizable: true,
      },
    ],
    benefits: [
      "32% de desconto",
      "Frete grátis express",
      "Produtos de luxo exclusivos",
      "Personalização total",
      "Consulta veterinária online grátis",
      "Suporte VIP 24/7",
      "Cancele quando quiser",
    ],
    image: "/subscriptions/deluxe-box.jpg",
    savings: 120.0,
  },
];

// Get subscription plan by ID
export function getSubscriptionPlan(
  planId: string
): SubscriptionPlan | undefined {
  return subscriptionPlans.find((p) => p.id === planId);
}

// Create subscription
export function createSubscription(data: {
  userId: string;
  planId: string;
  shippingAddress: Subscription["shippingAddress"];
  paymentMethod: Subscription["paymentMethod"];
  customizations?: Subscription["customizations"];
}): Subscription {
  const plan = getSubscriptionPlan(data.planId);
  if (!plan) throw new Error("Plan not found");

  const now = new Date();
  const nextBilling = new Date(now);

  // Calculate next billing date based on interval
  switch (plan.interval) {
    case "weekly":
      nextBilling.setDate(nextBilling.getDate() + 7);
      break;
    case "biweekly":
      nextBilling.setDate(nextBilling.getDate() + 14);
      break;
    case "monthly":
      nextBilling.setMonth(nextBilling.getMonth() + 1);
      break;
    case "quarterly":
      nextBilling.setMonth(nextBilling.getMonth() + 3);
      break;
  }

  const subscription: Subscription = {
    id: `sub-${Date.now()}`,
    userId: data.userId,
    planId: data.planId,
    status: "active",
    startDate: now,
    nextBillingDate: nextBilling,
    customizations: data.customizations,
    shippingAddress: data.shippingAddress,
    paymentMethod: data.paymentMethod,
    totalOrders: 0,
    totalSpent: 0,
    createdAt: now,
  };

  // In production, save to database and process first payment
  return subscription;
}

// Pause subscription
export function pauseSubscription(
  subscriptionId: string,
  reason?: string
): boolean {
  // In production, update database
  return true;
}

// Resume subscription
export function resumeSubscription(subscriptionId: string): boolean {
  // In production, update database and calculate next billing
  return true;
}

// Cancel subscription
export function cancelSubscription(
  subscriptionId: string,
  reason: string
): boolean {
  // In production, update database and send confirmation email
  return true;
}

// Update subscription customizations
export function updateSubscriptionCustomizations(
  subscriptionId: string,
  customizations: Subscription["customizations"]
): boolean {
  // In production, update database
  return true;
}

// Process subscription billing
export async function processSubscriptionBilling(
  subscriptionId: string
): Promise<{
  success: boolean;
  orderId?: string;
  error?: string;
}> {
  // In production:
  // 1. Get subscription details
  // 2. Charge payment method
  // 3. Create order
  // 4. Update next billing date
  // 5. Send confirmation email

  return {
    success: true,
    orderId: `ORD-${Date.now()}`,
  };
}

// Retry failed billing
export async function retryFailedBilling(
  subscriptionOrderId: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  // In production, attempt to charge again
  return {
    success: true,
  };
}

// Subscription analytics
export interface SubscriptionAnalytics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  pausedSubscriptions: number;
  cancelledSubscriptions: number;
  monthlyRecurringRevenue: number;
  annualRecurringRevenue: number;
  averageLifetimeValue: number;
  churnRate: number;
  retentionRate: number;
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
    churnedSubscribers: number;
    retentionRate: number;
  }[];
}

export function getSubscriptionAnalytics(): SubscriptionAnalytics {
  // Mock data - in production, calculate from database
  const totalActive = 1234;
  const avgPlanPrice = 149.9;

  return {
    totalSubscriptions: 1567,
    activeSubscriptions: totalActive,
    pausedSubscriptions: 123,
    cancelledSubscriptions: 210,
    monthlyRecurringRevenue: totalActive * avgPlanPrice,
    annualRecurringRevenue: totalActive * avgPlanPrice * 12,
    averageLifetimeValue: 1789.45,
    churnRate: 4.2,
    retentionRate: 95.8,
    planDistribution: [
      {
        planId: "sub-basic",
        planName: "Caixa Básica Pet",
        subscribers: 567,
        revenue: 50956.3,
        percentage: 46.0,
      },
      {
        planId: "sub-premium",
        planName: "Caixa Premium Pet",
        subscribers: 456,
        revenue: 68356.4,
        percentage: 37.0,
      },
      {
        planId: "sub-deluxe",
        planName: "Caixa Deluxe Pet",
        subscribers: 211,
        revenue: 52748.9,
        percentage: 17.0,
      },
    ],
    cohortAnalysis: [
      {
        month: "2024-01",
        newSubscribers: 234,
        churnedSubscribers: 12,
        retentionRate: 94.9,
      },
      {
        month: "2024-02",
        newSubscribers: 189,
        churnedSubscribers: 8,
        retentionRate: 95.8,
      },
    ],
  };
}

// Subscription recommendations
export interface SubscriptionRecommendation {
  planId: string;
  planName: string;
  reason: string;
  matchScore: number;
  estimatedSavings: number;
}

export function getSubscriptionRecommendations(
  userId: string
): SubscriptionRecommendation[] {
  // In production, analyze user's purchase history and preferences

  return [
    {
      planId: "sub-premium",
      planName: "Caixa Premium Pet",
      reason:
        "Baseado no seu histórico de compras, você economizaria R$ 70/mês com esta assinatura",
      matchScore: 92,
      estimatedSavings: 70.0,
    },
  ];
}

// Subscription gifts
export interface SubscriptionGift {
  id: string;
  fromUserId: string;
  toEmail: string;
  toName: string;
  planId: string;
  duration: number; // months
  message?: string;
  status: "pending" | "sent" | "activated" | "expired";
  code: string;
  purchaseDate: Date;
  activatedDate?: Date;
  expiresAt: Date;
}

export function createSubscriptionGift(data: {
  fromUserId: string;
  toEmail: string;
  toName: string;
  planId: string;
  duration: number;
  message?: string;
}): SubscriptionGift {
  const gift: SubscriptionGift = {
    id: `gift-${Date.now()}`,
    fromUserId: data.fromUserId,
    toEmail: data.toEmail,
    toName: data.toName,
    planId: data.planId,
    duration: data.duration,
    message: data.message,
    status: "pending",
    code: `GIFT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    purchaseDate: new Date(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
  };

  // In production, save to database and send gift email
  return gift;
}

export function activateSubscriptionGift(
  code: string,
  userId: string
): boolean {
  // In production, validate code and create subscription
  return true;
}

// Subscription perks and rewards
export interface SubscriptionPerk {
  id: string;
  name: string;
  description: string;
  type: "discount" | "freebie" | "upgrade" | "exclusive_access";
  value: string;
  eligibility: {
    minMonths: number;
    plans: string[];
  };
  icon: string;
}

export const subscriptionPerks: SubscriptionPerk[] = [
  {
    id: "perk-001",
    name: "Desconto Aniversário",
    description: "20% de desconto no mês do aniversário do seu pet",
    type: "discount",
    value: "20%",
    eligibility: {
      minMonths: 1,
      plans: ["sub-basic", "sub-premium", "sub-deluxe"],
    },
    icon: "🎂",
  },
  {
    id: "perk-002",
    name: "Upgrade Grátis",
    description: "Upgrade gratuito para o plano superior por 1 mês",
    type: "upgrade",
    value: "1 month",
    eligibility: {
      minMonths: 6,
      plans: ["sub-basic", "sub-premium"],
    },
    icon: "⬆️",
  },
  {
    id: "perk-003",
    name: "Acesso Exclusivo",
    description: "Acesso antecipado a novos produtos e promoções",
    type: "exclusive_access",
    value: "early_access",
    eligibility: {
      minMonths: 3,
      plans: ["sub-premium", "sub-deluxe"],
    },
    icon: "⭐",
  },
  {
    id: "perk-004",
    name: "Brinde Surpresa",
    description: "Brinde especial a cada 12 meses de assinatura",
    type: "freebie",
    value: "surprise_gift",
    eligibility: {
      minMonths: 12,
      plans: ["sub-basic", "sub-premium", "sub-deluxe"],
    },
    icon: "🎁",
  },
];

// Get eligible perks for subscription
export function getEligiblePerks(subscription: Subscription): SubscriptionPerk[] {
  const monthsActive = Math.floor(
    (Date.now() - subscription.startDate.getTime()) /
      (1000 * 60 * 60 * 24 * 30)
  );

  return subscriptionPerks.filter(
    (perk) =>
      perk.eligibility.minMonths <= monthsActive &&
      perk.eligibility.plans.includes(subscription.planId)
  );
}

// Subscription referral program
export interface SubscriptionReferral {
  referrerId: string;
  refereeEmail: string;
  status: "pending" | "completed";
  reward: {
    type: "discount" | "free_month" | "credit";
    value: number;
  };
  createdAt: Date;
  completedAt?: Date;
}

export function createSubscriptionReferral(
  referrerId: string,
  refereeEmail: string
): SubscriptionReferral {
  const referral: SubscriptionReferral = {
    referrerId,
    refereeEmail,
    status: "pending",
    reward: {
      type: "free_month",
      value: 1,
    },
    createdAt: new Date(),
  };

  // In production, save to database and send referral email
  return referral;
}
