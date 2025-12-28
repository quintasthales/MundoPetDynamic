// Advanced Loyalty and Rewards Program System

export interface LoyaltyMember {
  id: string;
  customerId: string;
  membershipNumber: string;
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  points: number;
  lifetimePoints: number;
  status: "active" | "inactive" | "suspended";
  joinedAt: Date;
  tierAchievedAt: Date;
  nextTier?: {
    tier: string;
    pointsNeeded: number;
    benefitsPreview: string[];
  };
  expiringPoints?: {
    amount: number;
    expiresAt: Date;
  }[];
  achievements: Achievement[];
  referralCode: string;
  referrals: {
    customerId: string;
    status: "pending" | "completed";
    reward: number;
    date: Date;
  }[];
}

export interface LoyaltyTier {
  id: string;
  name: string;
  level: number;
  pointsRequired: number;
  benefits: TierBenefit[];
  perks: string[];
  icon: string;
  color: string;
  annualFee?: number;
}

export interface TierBenefit {
  type:
    | "points_multiplier"
    | "discount"
    | "free_shipping"
    | "early_access"
    | "exclusive_products"
    | "birthday_bonus"
    | "priority_support";
  value: number | string;
  description: string;
}

export interface PointsTransaction {
  id: string;
  memberId: string;
  type: "earn" | "redeem" | "expire" | "bonus" | "refund";
  amount: number;
  balance: number;
  reason: string;
  orderId?: string;
  productId?: string;
  timestamp: Date;
  expiresAt?: Date;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  category: "discount" | "product" | "experience" | "donation" | "upgrade";
  pointsCost: number;
  value: number;
  stock?: number;
  image: string;
  tier?: string[];
  expiresAt?: Date;
  termsAndConditions: string[];
  redemptionLimit?: number;
  popularity: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  pointsReward: number;
  unlockedAt?: Date;
  progress?: {
    current: number;
    target: number;
  };
}

// Loyalty Tiers
export function getLoyaltyTiers(): LoyaltyTier[] {
  return [
    {
      id: "bronze",
      name: "Bronze",
      level: 1,
      pointsRequired: 0,
      benefits: [
        {
          type: "points_multiplier",
          value: 1,
          description: "Ganhe 1 ponto a cada R$ 1 gasto",
        },
        {
          type: "birthday_bonus",
          value: 100,
          description: "100 pontos de aniversário",
        },
      ],
      perks: [
        "Ganhe pontos em todas as compras",
        "Ofertas exclusivas por email",
        "Aniversário especial",
      ],
      icon: "🥉",
      color: "#CD7F32",
    },
    {
      id: "silver",
      name: "Silver",
      level: 2,
      pointsRequired: 1000,
      benefits: [
        {
          type: "points_multiplier",
          value: 1.25,
          description: "Ganhe 1.25 pontos a cada R$ 1 gasto",
        },
        {
          type: "discount",
          value: 5,
          description: "5% de desconto em todas as compras",
        },
        {
          type: "birthday_bonus",
          value: 250,
          description: "250 pontos de aniversário",
        },
      ],
      perks: [
        "1.25x pontos em compras",
        "5% de desconto permanente",
        "Frete grátis acima de R$ 100",
        "Acesso antecipado a promoções",
      ],
      icon: "🥈",
      color: "#C0C0C0",
    },
    {
      id: "gold",
      name: "Gold",
      level: 3,
      pointsRequired: 5000,
      benefits: [
        {
          type: "points_multiplier",
          value: 1.5,
          description: "Ganhe 1.5 pontos a cada R$ 1 gasto",
        },
        {
          type: "discount",
          value: 10,
          description: "10% de desconto em todas as compras",
        },
        {
          type: "free_shipping",
          value: "always",
          description: "Frete grátis em todas as compras",
        },
        {
          type: "birthday_bonus",
          value: 500,
          description: "500 pontos de aniversário",
        },
      ],
      perks: [
        "1.5x pontos em compras",
        "10% de desconto permanente",
        "Frete grátis sempre",
        "Produtos exclusivos",
        "Suporte prioritário",
      ],
      icon: "🥇",
      color: "#FFD700",
    },
    {
      id: "platinum",
      name: "Platinum",
      level: 4,
      pointsRequired: 15000,
      benefits: [
        {
          type: "points_multiplier",
          value: 2,
          description: "Ganhe 2 pontos a cada R$ 1 gasto",
        },
        {
          type: "discount",
          value: 15,
          description: "15% de desconto em todas as compras",
        },
        {
          type: "free_shipping",
          value: "express",
          description: "Frete grátis express",
        },
        {
          type: "early_access",
          value: "24h",
          description: "Acesso 24h antes a novos produtos",
        },
        {
          type: "birthday_bonus",
          value: 1000,
          description: "1000 pontos de aniversário",
        },
      ],
      perks: [
        "2x pontos em compras",
        "15% de desconto permanente",
        "Frete grátis express",
        "Acesso antecipado 24h",
        "Consultoria personalizada",
        "Eventos exclusivos",
      ],
      icon: "💎",
      color: "#E5E4E2",
    },
    {
      id: "diamond",
      name: "Diamond",
      level: 5,
      pointsRequired: 50000,
      benefits: [
        {
          type: "points_multiplier",
          value: 3,
          description: "Ganhe 3 pontos a cada R$ 1 gasto",
        },
        {
          type: "discount",
          value: 20,
          description: "20% de desconto em todas as compras",
        },
        {
          type: "free_shipping",
          value: "express",
          description: "Frete grátis express prioritário",
        },
        {
          type: "early_access",
          value: "48h",
          description: "Acesso 48h antes a novos produtos",
        },
        {
          type: "exclusive_products",
          value: "all",
          description: "Acesso a linha exclusiva Diamond",
        },
        {
          type: "birthday_bonus",
          value: 2000,
          description: "2000 pontos de aniversário + presente",
        },
      ],
      perks: [
        "3x pontos em compras",
        "20% de desconto permanente",
        "Frete grátis express prioritário",
        "Acesso antecipado 48h",
        "Linha exclusiva Diamond",
        "Gerente de conta dedicado",
        "Eventos VIP",
        "Presente de aniversário",
      ],
      icon: "💎✨",
      color: "#B9F2FF",
    },
  ];
}

// Loyalty Manager
export class LoyaltyManager {
  private members: Map<string, LoyaltyMember> = new Map();
  private transactions: PointsTransaction[] = [];
  
  // Create Member
  createMember(customerId: string): LoyaltyMember {
    const member: LoyaltyMember = {
      id: `member-${Date.now()}`,
      customerId,
      membershipNumber: this.generateMembershipNumber(),
      tier: "bronze",
      points: 0,
      lifetimePoints: 0,
      status: "active",
      joinedAt: new Date(),
      tierAchievedAt: new Date(),
      achievements: [],
      referralCode: this.generateReferralCode(),
      referrals: [],
    };
    
    // Welcome bonus
    this.earnPoints(member.id, 100, "Bônus de boas-vindas");
    
    this.members.set(member.id, member);
    return member;
  }
  
  // Earn Points
  earnPoints(
    memberId: string,
    baseAmount: number,
    reason: string,
    orderId?: string
  ): PointsTransaction {
    const member = this.members.get(memberId);
    if (!member) throw new Error("Member not found");
    
    // Apply tier multiplier
    const tier = getLoyaltyTiers().find((t) => t.id === member.tier);
    const multiplier =
      tier?.benefits.find((b) => b.type === "points_multiplier")?.value || 1;
    
    const amount = Math.round(baseAmount * (multiplier as number));
    
    // Update member points
    member.points += amount;
    member.lifetimePoints += amount;
    
    // Check for tier upgrade
    this.checkTierUpgrade(member);
    
    // Create transaction
    const transaction: PointsTransaction = {
      id: `txn-${Date.now()}`,
      memberId,
      type: "earn",
      amount,
      balance: member.points,
      reason,
      orderId,
      timestamp: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    };
    
    this.transactions.push(transaction);
    this.members.set(memberId, member);
    
    // Check achievements
    this.checkAchievements(member);
    
    return transaction;
  }
  
  // Redeem Points
  redeemPoints(
    memberId: string,
    amount: number,
    rewardId: string
  ): PointsTransaction {
    const member = this.members.get(memberId);
    if (!member) throw new Error("Member not found");
    
    if (member.points < amount) {
      throw new Error("Insufficient points");
    }
    
    // Deduct points
    member.points -= amount;
    
    // Create transaction
    const transaction: PointsTransaction = {
      id: `txn-${Date.now()}`,
      memberId,
      type: "redeem",
      amount: -amount,
      balance: member.points,
      reason: `Resgate: ${rewardId}`,
      timestamp: new Date(),
    };
    
    this.transactions.push(transaction);
    this.members.set(memberId, member);
    
    return transaction;
  }
  
  // Check Tier Upgrade
  private checkTierUpgrade(member: LoyaltyMember): void {
    const tiers = getLoyaltyTiers().sort((a, b) => b.level - a.level);
    
    for (const tier of tiers) {
      if (member.lifetimePoints >= tier.pointsRequired) {
        if (member.tier !== tier.id) {
          member.tier = tier.id as LoyaltyMember["tier"];
          member.tierAchievedAt = new Date();
          
          // Bonus for tier upgrade
          const bonus = tier.pointsRequired * 0.1;
          member.points += bonus;
          
          this.transactions.push({
            id: `txn-${Date.now()}`,
            memberId: member.id,
            type: "bonus",
            amount: bonus,
            balance: member.points,
            reason: `Upgrade para ${tier.name}`,
            timestamp: new Date(),
          });
        }
        break;
      }
    }
    
    // Calculate next tier
    const currentTierLevel = tiers.find((t) => t.id === member.tier)?.level || 1;
    const nextTier = tiers.find((t) => t.level === currentTierLevel + 1);
    
    if (nextTier) {
      member.nextTier = {
        tier: nextTier.name,
        pointsNeeded: nextTier.pointsRequired - member.lifetimePoints,
        benefitsPreview: nextTier.perks.slice(0, 3),
      };
    }
  }
  
  // Check Achievements
  private checkAchievements(member: LoyaltyMember): void {
    const achievements = this.getAvailableAchievements();
    
    achievements.forEach((achievement) => {
      const hasAchievement = member.achievements.some(
        (a) => a.id === achievement.id
      );
      
      if (!hasAchievement && this.isAchievementUnlocked(member, achievement)) {
        member.achievements.push({
          ...achievement,
          unlockedAt: new Date(),
        });
        
        // Award points
        member.points += achievement.pointsReward;
        
        this.transactions.push({
          id: `txn-${Date.now()}`,
          memberId: member.id,
          type: "bonus",
          amount: achievement.pointsReward,
          balance: member.points,
          reason: `Conquista: ${achievement.name}`,
          timestamp: new Date(),
        });
      }
    });
  }
  
  private isAchievementUnlocked(
    member: LoyaltyMember,
    achievement: Achievement
  ): boolean {
    // Mock implementation - check specific conditions
    switch (achievement.id) {
      case "first_purchase":
        return member.lifetimePoints > 0;
      case "points_collector":
        return member.lifetimePoints >= 1000;
      case "loyal_customer":
        return member.lifetimePoints >= 5000;
      default:
        return false;
    }
  }
  
  private getAvailableAchievements(): Achievement[] {
    return [
      {
        id: "first_purchase",
        name: "Primeira Compra",
        description: "Realize sua primeira compra",
        icon: "🎉",
        pointsReward: 50,
      },
      {
        id: "points_collector",
        name: "Colecionador de Pontos",
        description: "Acumule 1.000 pontos",
        icon: "⭐",
        pointsReward: 100,
      },
      {
        id: "loyal_customer",
        name: "Cliente Fiel",
        description: "Acumule 5.000 pontos",
        icon: "💎",
        pointsReward: 500,
      },
      {
        id: "referral_master",
        name: "Mestre das Indicações",
        description: "Indique 5 amigos",
        icon: "🤝",
        pointsReward: 250,
      },
      {
        id: "review_writer",
        name: "Avaliador Expert",
        description: "Escreva 10 avaliações",
        icon: "✍️",
        pointsReward: 150,
      },
    ];
  }
  
  private generateMembershipNumber(): string {
    return `ZEN${Date.now().toString().slice(-8)}`;
  }
  
  private generateReferralCode(): string {
    return `ZEN${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  }
  
  // Get Member
  getMember(memberId: string): LoyaltyMember | undefined {
    return this.members.get(memberId);
  }
  
  // Get Transactions
  getTransactions(memberId: string, limit: number = 50): PointsTransaction[] {
    return this.transactions
      .filter((t) => t.memberId === memberId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

// Rewards Catalog
export function getRewardsCatalog(): Reward[] {
  return [
    {
      id: "reward-discount-10",
      name: "10% de Desconto",
      description: "Cupom de 10% de desconto em qualquer compra",
      category: "discount",
      pointsCost: 500,
      value: 10,
      image: "/rewards/discount-10.png",
      termsAndConditions: [
        "Válido por 30 dias",
        "Não cumulativo com outras promoções",
        "Valor mínimo de compra: R$ 50",
      ],
      redemptionLimit: 1,
      popularity: 95,
    },
    {
      id: "reward-discount-20",
      name: "20% de Desconto",
      description: "Cupom de 20% de desconto em qualquer compra",
      category: "discount",
      pointsCost: 1000,
      value: 20,
      image: "/rewards/discount-20.png",
      tier: ["gold", "platinum", "diamond"],
      termsAndConditions: [
        "Válido por 30 dias",
        "Não cumulativo com outras promoções",
        "Valor mínimo de compra: R$ 100",
      ],
      redemptionLimit: 1,
      popularity: 88,
    },
    {
      id: "reward-free-shipping",
      name: "Frete Grátis",
      description: "Frete grátis na próxima compra",
      category: "discount",
      pointsCost: 300,
      value: 15,
      image: "/rewards/free-shipping.png",
      termsAndConditions: [
        "Válido por 60 dias",
        "Aplicável em qualquer valor de compra",
      ],
      popularity: 92,
    },
    {
      id: "reward-product-oil",
      name: "Óleo Essencial Grátis",
      description: "Ganhe um óleo essencial de 10ml",
      category: "product",
      pointsCost: 800,
      value: 45,
      stock: 100,
      image: "/rewards/oil-free.png",
      termsAndConditions: [
        "Escolha entre 5 fragrâncias disponíveis",
        "Sujeito a disponibilidade",
      ],
      popularity: 85,
    },
    {
      id: "reward-product-diffuser",
      name: "Difusor Aromático Grátis",
      description: "Ganhe um difusor aromático premium",
      category: "product",
      pointsCost: 3000,
      value: 129,
      stock: 50,
      image: "/rewards/diffuser-free.png",
      tier: ["platinum", "diamond"],
      termsAndConditions: [
        "Modelo específico disponível",
        "Frete grátis incluído",
      ],
      popularity: 78,
    },
    {
      id: "reward-experience-workshop",
      name: "Workshop de Aromaterapia",
      description: "Participe de um workshop exclusivo online",
      category: "experience",
      pointsCost: 2000,
      value: 150,
      stock: 20,
      image: "/rewards/workshop.png",
      tier: ["gold", "platinum", "diamond"],
      termsAndConditions: [
        "Duração: 2 horas",
        "Certificado de participação incluído",
        "Agendar com 7 dias de antecedência",
      ],
      popularity: 72,
    },
    {
      id: "reward-donation",
      name: "Doação para ONGs",
      description: "Doe seus pontos para instituições parceiras",
      category: "donation",
      pointsCost: 500,
      value: 50,
      image: "/rewards/donation.png",
      termsAndConditions: [
        "100% dos pontos convertidos em doação",
        "Escolha entre 3 ONGs parceiras",
      ],
      popularity: 65,
    },
    {
      id: "reward-tier-upgrade",
      name: "Upgrade de Tier Temporário",
      description: "Aproveite benefícios do próximo tier por 30 dias",
      category: "upgrade",
      pointsCost: 1500,
      value: 200,
      image: "/rewards/tier-upgrade.png",
      tier: ["bronze", "silver", "gold"],
      termsAndConditions: [
        "Válido por 30 dias",
        "Não cumulativo com tier atual",
      ],
      popularity: 68,
    },
  ];
}

// Loyalty Analytics
export interface LoyaltyAnalytics {
  totalMembers: number;
  activeMembers: number;
  tierDistribution: {
    tier: string;
    members: number;
    percentage: number;
    avgPoints: number;
    avgLifetimeValue: number;
  }[];
  pointsIssued: number;
  pointsRedeemed: number;
  redemptionRate: number;
  topRewards: {
    rewardId: string;
    rewardName: string;
    redemptions: number;
    pointsSpent: number;
  }[];
  memberEngagement: {
    avgPointsPerMember: number;
    avgTransactionsPerMember: number;
    activeRate: number;
  };
  revenueImpact: {
    incrementalRevenue: number;
    repeatPurchaseRate: number;
    avgOrderValueIncrease: number;
  };
}

export function getLoyaltyAnalytics(): LoyaltyAnalytics {
  return {
    totalMembers: 125000,
    activeMembers: 98500,
    tierDistribution: [
      {
        tier: "Bronze",
        members: 75000,
        percentage: 60,
        avgPoints: 350,
        avgLifetimeValue: 485,
      },
      {
        tier: "Silver",
        members: 32500,
        percentage: 26,
        avgPoints: 2500,
        avgLifetimeValue: 1250,
      },
      {
        tier: "Gold",
        members: 12500,
        percentage: 10,
        avgPoints: 8500,
        avgLifetimeValue: 3850,
      },
      {
        tier: "Platinum",
        members: 4000,
        percentage: 3.2,
        avgPoints: 22500,
        avgLifetimeValue: 8500,
      },
      {
        tier: "Diamond",
        members: 1000,
        percentage: 0.8,
        avgPoints: 75000,
        avgLifetimeValue: 25000,
      },
    ],
    pointsIssued: 125000000,
    pointsRedeemed: 85000000,
    redemptionRate: 68,
    topRewards: [
      {
        rewardId: "reward-discount-10",
        rewardName: "10% de Desconto",
        redemptions: 42500,
        pointsSpent: 21250000,
      },
      {
        rewardId: "reward-free-shipping",
        rewardName: "Frete Grátis",
        redemptions: 38500,
        pointsSpent: 11550000,
      },
      {
        rewardId: "reward-discount-20",
        rewardName: "20% de Desconto",
        redemptions: 28500,
        pointsSpent: 28500000,
      },
    ],
    memberEngagement: {
      avgPointsPerMember: 1000,
      avgTransactionsPerMember: 8.5,
      activeRate: 78.8,
    },
    revenueImpact: {
      incrementalRevenue: 3850000,
      repeatPurchaseRate: 72.5,
      avgOrderValueIncrease: 32.5,
    },
  };
}

// Gamification Features
export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: "daily" | "weekly" | "monthly" | "seasonal";
  pointsReward: number;
  progress: {
    current: number;
    target: number;
  };
  startsAt: Date;
  endsAt: Date;
  icon: string;
}

export function getActiveChallenges(): Challenge[] {
  return [
    {
      id: "challenge-daily-visit",
      name: "Visita Diária",
      description: "Visite o site hoje",
      type: "daily",
      pointsReward: 10,
      progress: { current: 0, target: 1 },
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      icon: "📅",
    },
    {
      id: "challenge-weekly-purchase",
      name: "Compra Semanal",
      description: "Faça uma compra esta semana",
      type: "weekly",
      pointsReward: 100,
      progress: { current: 0, target: 1 },
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      icon: "🛍️",
    },
    {
      id: "challenge-monthly-reviews",
      name: "Avaliador do Mês",
      description: "Escreva 5 avaliações este mês",
      type: "monthly",
      pointsReward: 250,
      progress: { current: 0, target: 5 },
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      icon: "⭐",
    },
  ];
}
