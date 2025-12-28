// Referral and Affiliate Program System

export interface ReferralCode {
  code: string;
  userId: string;
  type: "customer" | "affiliate";
  discount: {
    type: "percentage" | "fixed";
    value: number;
  };
  commission?: {
    type: "percentage" | "fixed";
    value: number;
  };
  usageCount: number;
  usageLimit?: number;
  totalEarnings: number;
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredUserId: string;
  referralCode: string;
  status: "pending" | "completed" | "cancelled";
  orderId?: string;
  orderValue: number;
  commission: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface AffiliateStats {
  totalReferrals: number;
  completedReferrals: number;
  pendingReferrals: number;
  totalEarnings: number;
  availableBalance: number;
  conversionRate: number;
  averageOrderValue: number;
}

// Generate unique referral code
export function generateReferralCode(userName: string): string {
  const cleanName = userName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${cleanName.substring(0, 4)}${random}`;
}

// Validate referral code
export function validateReferralCode(code: string): {
  valid: boolean;
  referralCode?: ReferralCode;
  message: string;
} {
  // Mock validation - in production, query database
  const mockCode: ReferralCode = {
    code: code.toUpperCase(),
    userId: "user123",
    type: "customer",
    discount: {
      type: "percentage",
      value: 10,
    },
    usageCount: 5,
    usageLimit: 100,
    totalEarnings: 0,
    isActive: true,
    createdAt: new Date("2024-01-01"),
  };

  if (code.length < 6) {
    return {
      valid: false,
      message: "Código de indicação inválido",
    };
  }

  if (!mockCode.isActive) {
    return {
      valid: false,
      message: "Este código de indicação não está mais ativo",
    };
  }

  if (mockCode.usageLimit && mockCode.usageCount >= mockCode.usageLimit) {
    return {
      valid: false,
      message: "Este código de indicação atingiu o limite de uso",
    };
  }

  if (mockCode.expiresAt && mockCode.expiresAt < new Date()) {
    return {
      valid: false,
      message: "Este código de indicação expirou",
    };
  }

  return {
    valid: true,
    referralCode: mockCode,
    message: "Código de indicação válido",
  };
}

// Apply referral discount
export function applyReferralDiscount(
  code: string,
  orderTotal: number
): {
  success: boolean;
  discount: number;
  message: string;
} {
  const validation = validateReferralCode(code);

  if (!validation.valid || !validation.referralCode) {
    return {
      success: false,
      discount: 0,
      message: validation.message,
    };
  }

  const { discount } = validation.referralCode;
  let discountAmount = 0;

  if (discount.type === "percentage") {
    discountAmount = (orderTotal * discount.value) / 100;
  } else {
    discountAmount = discount.value;
  }

  // Cap discount at order total
  discountAmount = Math.min(discountAmount, orderTotal);

  return {
    success: true,
    discount: discountAmount,
    message: `Desconto de R$ ${discountAmount.toFixed(2)} aplicado!`,
  };
}

// Calculate commission for referrer
export function calculateCommission(
  referralCode: ReferralCode,
  orderValue: number
): number {
  if (!referralCode.commission) return 0;

  if (referralCode.commission.type === "percentage") {
    return (orderValue * referralCode.commission.value) / 100;
  }

  return referralCode.commission.value;
}

// Create referral
export async function createReferral(data: {
  referrerId: string;
  referredUserId: string;
  referralCode: string;
  orderValue: number;
}): Promise<Referral> {
  const validation = validateReferralCode(data.referralCode);

  if (!validation.valid || !validation.referralCode) {
    throw new Error("Invalid referral code");
  }

  const commission = calculateCommission(validation.referralCode, data.orderValue);

  const referral: Referral = {
    id: `ref-${Date.now()}`,
    referrerId: data.referrerId,
    referredUserId: data.referredUserId,
    referralCode: data.referralCode,
    status: "pending",
    orderValue: data.orderValue,
    commission,
    createdAt: new Date(),
  };

  // In production, save to database

  return referral;
}

// Complete referral (after order is confirmed)
export function completeReferral(referralId: string, orderId: string): boolean {
  // In production, update database
  return true;
}

// Get affiliate stats
export function getAffiliateStats(userId: string): AffiliateStats {
  // Mock stats - in production, query from database
  return {
    totalReferrals: 45,
    completedReferrals: 38,
    pendingReferrals: 7,
    totalEarnings: 1250.5,
    availableBalance: 980.3,
    conversionRate: 84.4,
    averageOrderValue: 156.8,
  };
}

// Affiliate tiers
export interface AffiliateTier {
  name: string;
  minReferrals: number;
  commissionRate: number;
  benefits: string[];
}

export const affiliateTiers: AffiliateTier[] = [
  {
    name: "Bronze",
    minReferrals: 0,
    commissionRate: 5,
    benefits: [
      "5% de comissão em todas as vendas",
      "Dashboard de acompanhamento",
      "Materiais de divulgação",
    ],
  },
  {
    name: "Prata",
    minReferrals: 10,
    commissionRate: 7,
    benefits: [
      "7% de comissão em todas as vendas",
      "Prioridade no suporte",
      "Acesso a promoções exclusivas",
      "Bônus de R$ 50 ao atingir a meta",
    ],
  },
  {
    name: "Ouro",
    minReferrals: 25,
    commissionRate: 10,
    benefits: [
      "10% de comissão em todas as vendas",
      "Gerente de conta dedicado",
      "Campanhas personalizadas",
      "Bônus de R$ 150 ao atingir a meta",
      "Produtos gratuitos para teste",
    ],
  },
  {
    name: "Platina",
    minReferrals: 50,
    commissionRate: 12,
    benefits: [
      "12% de comissão em todas as vendas",
      "Comissão vitalícia nos clientes indicados",
      "Acesso antecipado a novos produtos",
      "Bônus de R$ 300 ao atingir a meta",
      "Viagem anual para evento exclusivo",
    ],
  },
];

export function getAffiliateTier(completedReferrals: number): AffiliateTier {
  for (let i = affiliateTiers.length - 1; i >= 0; i--) {
    if (completedReferrals >= affiliateTiers[i].minReferrals) {
      return affiliateTiers[i];
    }
  }
  return affiliateTiers[0];
}

export function getNextTier(
  completedReferrals: number
): { tier: AffiliateTier; referralsNeeded: number } | null {
  const currentTier = getAffiliateTier(completedReferrals);
  const currentIndex = affiliateTiers.indexOf(currentTier);

  if (currentIndex === affiliateTiers.length - 1) {
    return null; // Already at highest tier
  }

  const nextTier = affiliateTiers[currentIndex + 1];
  const referralsNeeded = nextTier.minReferrals - completedReferrals;

  return {
    tier: nextTier,
    referralsNeeded,
  };
}

// Payout management
export interface Payout {
  id: string;
  userId: string;
  amount: number;
  method: "bank_transfer" | "pix" | "paypal";
  status: "pending" | "processing" | "completed" | "failed";
  requestedAt: Date;
  processedAt?: Date;
  notes?: string;
}

export function requestPayout(
  userId: string,
  amount: number,
  method: Payout["method"]
): Payout {
  const stats = getAffiliateStats(userId);

  if (amount > stats.availableBalance) {
    throw new Error("Saldo insuficiente");
  }

  if (amount < 50) {
    throw new Error("Valor mínimo para saque: R$ 50");
  }

  const payout: Payout = {
    id: `payout-${Date.now()}`,
    userId,
    amount,
    method,
    status: "pending",
    requestedAt: new Date(),
  };

  // In production, save to database and process

  return payout;
}

// Marketing materials
export interface MarketingMaterial {
  id: string;
  type: "banner" | "social_post" | "email_template" | "video";
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
  dimensions?: string;
}

export const marketingMaterials: MarketingMaterial[] = [
  {
    id: "1",
    type: "banner",
    title: "Banner Principal 728x90",
    description: "Banner horizontal para sites e blogs",
    url: "/marketing/banner-728x90.png",
    thumbnail: "/marketing/thumb-banner-728x90.png",
    dimensions: "728x90",
  },
  {
    id: "2",
    type: "social_post",
    title: "Post Instagram - Promoção",
    description: "Imagem otimizada para Instagram",
    url: "/marketing/instagram-promo.png",
    thumbnail: "/marketing/thumb-instagram-promo.png",
    dimensions: "1080x1080",
  },
  {
    id: "3",
    type: "email_template",
    title: "Template de Email",
    description: "Template HTML para envio de emails",
    url: "/marketing/email-template.html",
  },
];
