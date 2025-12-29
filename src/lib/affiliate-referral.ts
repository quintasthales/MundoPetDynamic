// Advanced Affiliate and Referral Program

export interface Affiliate {
  id: string;
  userId: string;
  name: string;
  email: string;
  type: "individual" | "influencer" | "business" | "agency";
  tier: "bronze" | "silver" | "gold" | "platinum";
  status: "pending" | "active" | "suspended" | "inactive";
  code: string; // Unique affiliate code
  website?: string;
  socialMedia?: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    facebook?: string;
  };
  audience: {
    size: number;
    demographics?: string;
    interests?: string[];
  };
  commission: {
    rate: number; // percentage
    type: "percentage" | "fixed" | "tiered";
    cookieDuration: number; // days
  };
  paymentInfo: {
    method: "bank_transfer" | "pix" | "paypal";
    details: Record<string, string>;
  };
  metrics: AffiliateMetrics;
  joinedAt: Date;
  approvedAt?: Date;
  lastActiveAt?: Date;
}

export interface AffiliateMetrics {
  clicks: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  commission: number;
  avgOrderValue: number;
  topProducts: string[];
  referredCustomers: number;
}

export interface AffiliateClick {
  id: string;
  affiliateId: string;
  affiliateCode: string;
  visitorId: string;
  sourceUrl?: string;
  destinationUrl: string;
  device: string;
  browser: string;
  country: string;
  converted: boolean;
  orderId?: string;
  timestamp: Date;
}

export interface AffiliateConversion {
  id: string;
  affiliateId: string;
  affiliateCode: string;
  clickId: string;
  orderId: string;
  customerId: string;
  orderValue: number;
  commissionRate: number;
  commissionAmount: number;
  status: "pending" | "approved" | "paid" | "rejected";
  approvedAt?: Date;
  paidAt?: Date;
  timestamp: Date;
}

export interface AffiliatePayout {
  id: string;
  affiliateId: string;
  period: {
    start: Date;
    end: Date;
  };
  conversions: string[];
  totalRevenue: number;
  totalCommission: number;
  deductions: number;
  netAmount: number;
  status: "pending" | "processing" | "paid" | "failed";
  paymentMethod: string;
  paidAt?: Date;
  transactionId?: string;
  createdAt: Date;
}

export interface ReferralProgram {
  id: string;
  name: string;
  description: string;
  type: "customer" | "friend" | "employee";
  status: "active" | "paused" | "ended";
  rewards: {
    referrer: Reward;
    referee: Reward;
  };
  conditions: {
    minPurchase?: number;
    validFor?: number; // days
    maxUses?: number;
  };
  metrics: {
    totalReferrals: number;
    successfulReferrals: number;
    conversionRate: number;
    totalRevenue: number;
    totalRewards: number;
  };
  startDate: Date;
  endDate?: Date;
}

export interface Reward {
  type: "discount" | "credit" | "points" | "cash";
  value: number;
  unit: "percentage" | "fixed" | "points";
  description: string;
}

export interface Referral {
  id: string;
  code: string;
  referrerId: string;
  referrerName: string;
  refereeEmail: string;
  status: "pending" | "registered" | "converted" | "rewarded" | "expired";
  programId: string;
  rewards: {
    referrer?: {
      type: string;
      value: number;
      claimed: boolean;
    };
    referee?: {
      type: string;
      value: number;
      claimed: boolean;
    };
  };
  orderId?: string;
  orderValue?: number;
  createdAt: Date;
  convertedAt?: Date;
  expiresAt?: Date;
}

// Affiliate Manager
export class AffiliateManager {
  private affiliates: Map<string, Affiliate> = new Map();
  private clicks: AffiliateClick[] = [];
  private conversions: Map<string, AffiliateConversion> = new Map();
  private payouts: Map<string, AffiliatePayout> = new Map();
  
  // Register Affiliate
  registerAffiliate(data: Omit<Affiliate, "id" | "code" | "metrics" | "joinedAt">): Affiliate {
    const affiliate: Affiliate = {
      id: `aff-${Date.now()}`,
      ...data,
      code: this.generateAffiliateCode(data.name),
      metrics: {
        clicks: 0,
        conversions: 0,
        conversionRate: 0,
        revenue: 0,
        commission: 0,
        avgOrderValue: 0,
        topProducts: [],
        referredCustomers: 0,
      },
      joinedAt: new Date(),
    };
    
    this.affiliates.set(affiliate.id, affiliate);
    return affiliate;
  }
  
  private generateAffiliateCode(name: string): string {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${cleanName.substring(0, 6)}${random}`;
  }
  
  // Approve Affiliate
  approveAffiliate(affiliateId: string): Affiliate | undefined {
    const affiliate = this.affiliates.get(affiliateId);
    if (!affiliate) return undefined;
    
    affiliate.status = "active";
    affiliate.approvedAt = new Date();
    
    this.affiliates.set(affiliateId, affiliate);
    return affiliate;
  }
  
  // Track Click
  trackClick(
    affiliateCode: string,
    visitorId: string,
    sourceUrl: string,
    destinationUrl: string,
    device: string,
    browser: string,
    country: string
  ): AffiliateClick | undefined {
    const affiliate = Array.from(this.affiliates.values()).find(
      (a) => a.code === affiliateCode
    );
    
    if (!affiliate) return undefined;
    
    const click: AffiliateClick = {
      id: `click-${Date.now()}`,
      affiliateId: affiliate.id,
      affiliateCode,
      visitorId,
      sourceUrl,
      destinationUrl,
      device,
      browser,
      country,
      converted: false,
      timestamp: new Date(),
    };
    
    this.clicks.push(click);
    
    // Update metrics
    affiliate.metrics.clicks++;
    affiliate.lastActiveAt = new Date();
    this.affiliates.set(affiliate.id, affiliate);
    
    return click;
  }
  
  // Track Conversion
  trackConversion(
    clickId: string,
    orderId: string,
    customerId: string,
    orderValue: number
  ): AffiliateConversion | undefined {
    const click = this.clicks.find((c) => c.id === clickId);
    if (!click) return undefined;
    
    const affiliate = this.affiliates.get(click.affiliateId);
    if (!affiliate) return undefined;
    
    const commissionAmount = orderValue * (affiliate.commission.rate / 100);
    
    const conversion: AffiliateConversion = {
      id: `conv-${Date.now()}`,
      affiliateId: affiliate.id,
      affiliateCode: affiliate.code,
      clickId,
      orderId,
      customerId,
      orderValue,
      commissionRate: affiliate.commission.rate,
      commissionAmount,
      status: "pending",
      timestamp: new Date(),
    };
    
    this.conversions.set(conversion.id, conversion);
    
    // Update click
    click.converted = true;
    click.orderId = orderId;
    
    // Update affiliate metrics
    affiliate.metrics.conversions++;
    affiliate.metrics.revenue += orderValue;
    affiliate.metrics.commission += commissionAmount;
    affiliate.metrics.conversionRate =
      (affiliate.metrics.conversions / affiliate.metrics.clicks) * 100;
    affiliate.metrics.avgOrderValue =
      affiliate.metrics.revenue / affiliate.metrics.conversions;
    affiliate.metrics.referredCustomers++;
    
    this.affiliates.set(affiliate.id, affiliate);
    
    return conversion;
  }
  
  // Approve Conversion
  approveConversion(conversionId: string): AffiliateConversion | undefined {
    const conversion = this.conversions.get(conversionId);
    if (!conversion) return undefined;
    
    conversion.status = "approved";
    conversion.approvedAt = new Date();
    
    this.conversions.set(conversionId, conversion);
    return conversion;
  }
  
  // Generate Payout
  generatePayout(
    affiliateId: string,
    period: { start: Date; end: Date }
  ): AffiliatePayout {
    const affiliate = this.affiliates.get(affiliateId);
    if (!affiliate) throw new Error("Affiliate not found");
    
    const conversions = Array.from(this.conversions.values()).filter(
      (c) =>
        c.affiliateId === affiliateId &&
        c.status === "approved" &&
        c.timestamp >= period.start &&
        c.timestamp <= period.end
    );
    
    const totalRevenue = conversions.reduce((sum, c) => sum + c.orderValue, 0);
    const totalCommission = conversions.reduce((sum, c) => sum + c.commissionAmount, 0);
    const deductions = 0; // Could include fees, chargebacks, etc.
    const netAmount = totalCommission - deductions;
    
    const payout: AffiliatePayout = {
      id: `payout-${Date.now()}`,
      affiliateId,
      period,
      conversions: conversions.map((c) => c.id),
      totalRevenue,
      totalCommission,
      deductions,
      netAmount,
      status: "pending",
      paymentMethod: affiliate.paymentInfo.method,
      createdAt: new Date(),
    };
    
    this.payouts.set(payout.id, payout);
    return payout;
  }
  
  // Process Payout
  processPayout(payoutId: string): AffiliatePayout | undefined {
    const payout = this.payouts.get(payoutId);
    if (!payout) return undefined;
    
    payout.status = "paid";
    payout.paidAt = new Date();
    payout.transactionId = `TXN${Date.now()}`;
    
    // Mark conversions as paid
    payout.conversions.forEach((convId) => {
      const conversion = this.conversions.get(convId);
      if (conversion) {
        conversion.status = "paid";
        conversion.paidAt = new Date();
        this.conversions.set(convId, conversion);
      }
    });
    
    this.payouts.set(payoutId, payout);
    return payout;
  }
  
  // Get Affiliate Dashboard
  getAffiliateDashboard(affiliateId: string): AffiliateDashboard {
    const affiliate = this.affiliates.get(affiliateId);
    if (!affiliate) throw new Error("Affiliate not found");
    
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentClicks = this.clicks.filter(
      (c) => c.affiliateId === affiliateId && c.timestamp >= last30Days
    );
    const recentConversions = Array.from(this.conversions.values()).filter(
      (c) => c.affiliateId === affiliateId && c.timestamp >= last30Days
    );
    
    return {
      affiliate: {
        name: affiliate.name,
        code: affiliate.code,
        tier: affiliate.tier,
        commissionRate: affiliate.commission.rate,
      },
      period: {
        start: last30Days,
        end: new Date(),
      },
      metrics: {
        clicks: recentClicks.length,
        conversions: recentConversions.length,
        conversionRate: (recentConversions.length / recentClicks.length) * 100 || 0,
        revenue: recentConversions.reduce((sum, c) => sum + c.orderValue, 0),
        commission: recentConversions.reduce((sum, c) => sum + c.commissionAmount, 0),
        pendingCommission: recentConversions
          .filter((c) => c.status === "pending" || c.status === "approved")
          .reduce((sum, c) => sum + c.commissionAmount, 0),
      },
      topProducts: affiliate.metrics.topProducts.slice(0, 5),
      recentConversions: recentConversions.slice(0, 10),
    };
  }
}

export interface AffiliateDashboard {
  affiliate: {
    name: string;
    code: string;
    tier: string;
    commissionRate: number;
  };
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    clicks: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
    commission: number;
    pendingCommission: number;
  };
  topProducts: string[];
  recentConversions: AffiliateConversion[];
}

// Referral Manager
export class ReferralManager {
  private programs: Map<string, ReferralProgram> = new Map();
  private referrals: Map<string, Referral> = new Map();
  
  // Create Program
  createProgram(data: Omit<ReferralProgram, "id" | "metrics">): ReferralProgram {
    const program: ReferralProgram = {
      id: `program-${Date.now()}`,
      ...data,
      metrics: {
        totalReferrals: 0,
        successfulReferrals: 0,
        conversionRate: 0,
        totalRevenue: 0,
        totalRewards: 0,
      },
    };
    
    this.programs.set(program.id, program);
    return program;
  }
  
  // Generate Referral Code
  generateReferralCode(
    referrerId: string,
    referrerName: string,
    programId: string
  ): string {
    const cleanName = referrerName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${cleanName.substring(0, 4)}${random}`;
  }
  
  // Create Referral
  createReferral(
    referrerId: string,
    referrerName: string,
    refereeEmail: string,
    programId: string
  ): Referral {
    const program = this.programs.get(programId);
    if (!program) throw new Error("Program not found");
    
    const code = this.generateReferralCode(referrerId, referrerName, programId);
    
    const referral: Referral = {
      id: `ref-${Date.now()}`,
      code,
      referrerId,
      referrerName,
      refereeEmail,
      status: "pending",
      programId,
      rewards: {},
      createdAt: new Date(),
      expiresAt: program.conditions.validFor
        ? new Date(Date.now() + program.conditions.validFor * 24 * 60 * 60 * 1000)
        : undefined,
    };
    
    this.referrals.set(referral.id, referral);
    
    // Update program metrics
    program.metrics.totalReferrals++;
    this.programs.set(programId, program);
    
    return referral;
  }
  
  // Convert Referral
  convertReferral(
    code: string,
    orderId: string,
    orderValue: number
  ): Referral | undefined {
    const referral = Array.from(this.referrals.values()).find((r) => r.code === code);
    if (!referral) return undefined;
    
    const program = this.programs.get(referral.programId);
    if (!program) return undefined;
    
    // Check if expired
    if (referral.expiresAt && new Date() > referral.expiresAt) {
      referral.status = "expired";
      this.referrals.set(referral.id, referral);
      return undefined;
    }
    
    // Check minimum purchase
    if (program.conditions.minPurchase && orderValue < program.conditions.minPurchase) {
      return undefined;
    }
    
    referral.status = "converted";
    referral.orderId = orderId;
    referral.orderValue = orderValue;
    referral.convertedAt = new Date();
    
    // Set rewards
    referral.rewards = {
      referrer: {
        type: program.rewards.referrer.type,
        value: program.rewards.referrer.value,
        claimed: false,
      },
      referee: {
        type: program.rewards.referee.type,
        value: program.rewards.referee.value,
        claimed: false,
      },
    };
    
    this.referrals.set(referral.id, referral);
    
    // Update program metrics
    program.metrics.successfulReferrals++;
    program.metrics.conversionRate =
      (program.metrics.successfulReferrals / program.metrics.totalReferrals) * 100;
    program.metrics.totalRevenue += orderValue;
    this.programs.set(programId, program);
    
    return referral;
  }
  
  // Claim Reward
  claimReward(referralId: string, role: "referrer" | "referee"): boolean {
    const referral = this.referrals.get(referralId);
    if (!referral || referral.status !== "converted") return false;
    
    const reward = referral.rewards[role];
    if (!reward || reward.claimed) return false;
    
    reward.claimed = true;
    referral.status = "rewarded";
    
    this.referrals.set(referralId, referral);
    
    // Update program metrics
    const program = this.programs.get(referral.programId);
    if (program) {
      program.metrics.totalRewards += reward.value;
      this.programs.set(referral.programId, program);
    }
    
    return true;
  }
}

// Analytics
export interface AffiliateAnalytics {
  totalAffiliates: number;
  activeAffiliates: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  totalRevenue: number;
  totalCommission: number;
  avgCommissionRate: number;
  topAffiliates: {
    affiliateId: string;
    name: string;
    conversions: number;
    revenue: number;
    commission: number;
  }[];
}

export function getAffiliateAnalytics(): AffiliateAnalytics {
  return {
    totalAffiliates: 2850,
    activeAffiliates: 1985,
    totalClicks: 2850000,
    totalConversions: 125000,
    conversionRate: 4.4,
    totalRevenue: 18500000,
    totalCommission: 1850000,
    avgCommissionRate: 10,
    topAffiliates: [
      {
        affiliateId: "aff-001",
        name: "Wellness Influencer",
        conversions: 8500,
        revenue: 2850000,
        commission: 285000,
      },
      {
        affiliateId: "aff-002",
        name: "Lifestyle Blog",
        conversions: 6500,
        revenue: 1985000,
        commission: 198500,
      },
      {
        affiliateId: "aff-003",
        name: "Yoga Studio Network",
        conversions: 4850,
        revenue: 1485000,
        commission: 148500,
      },
    ],
  };
}

export interface ReferralAnalytics {
  totalPrograms: number;
  activePrograms: number;
  totalReferrals: number;
  successfulReferrals: number;
  conversionRate: number;
  totalRevenue: number;
  totalRewards: number;
  roi: number;
}

export function getReferralAnalytics(): ReferralAnalytics {
  return {
    totalPrograms: 5,
    activePrograms: 3,
    totalReferrals: 48500,
    successfulReferrals: 12500,
    conversionRate: 25.8,
    totalRevenue: 4850000,
    totalRewards: 485000,
    roi: 900,
  };
}

// Commission Tiers
export function getCommissionTiers(): {
  tier: string;
  minRevenue: number;
  commissionRate: number;
  benefits: string[];
}[] {
  return [
    {
      tier: "Bronze",
      minRevenue: 0,
      commissionRate: 8,
      benefits: ["8% comissão", "Dashboard básico", "Suporte por email"],
    },
    {
      tier: "Silver",
      minRevenue: 10000,
      commissionRate: 10,
      benefits: [
        "10% comissão",
        "Dashboard avançado",
        "Materiais de marketing",
        "Suporte prioritário",
      ],
    },
    {
      tier: "Gold",
      minRevenue: 50000,
      commissionRate: 12,
      benefits: [
        "12% comissão",
        "Dashboard completo",
        "Gerente de conta",
        "Campanhas exclusivas",
        "Pagamentos semanais",
      ],
    },
    {
      tier: "Platinum",
      minRevenue: 150000,
      commissionRate: 15,
      benefits: [
        "15% comissão",
        "Tudo do Gold",
        "Produtos exclusivos",
        "Co-branding",
        "Eventos VIP",
        "Pagamentos instantâneos",
      ],
    },
  ];
}
