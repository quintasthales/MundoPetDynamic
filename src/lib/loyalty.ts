// Loyalty Program and Rewards System

export interface LoyaltyTier {
  id: string;
  name: string;
  minPoints: number;
  benefits: string[];
  discountPercentage: number;
  color: string;
}

export const loyaltyTiers: LoyaltyTier[] = [
  {
    id: "bronze",
    name: "Bronze",
    minPoints: 0,
    benefits: [
      "Acumule 1 ponto a cada R$ 1 gasto",
      "Troque pontos por descontos",
      "Ofertas exclusivas",
    ],
    discountPercentage: 0,
    color: "orange",
  },
  {
    id: "silver",
    name: "Prata",
    minPoints: 500,
    benefits: [
      "Acumule 1.5 pontos a cada R$ 1 gasto",
      "5% de desconto em todas as compras",
      "Frete grátis em compras acima de R$ 100",
      "Acesso antecipado a promoções",
    ],
    discountPercentage: 5,
    color: "gray",
  },
  {
    id: "gold",
    name: "Ouro",
    minPoints: 1500,
    benefits: [
      "Acumule 2 pontos a cada R$ 1 gasto",
      "10% de desconto em todas as compras",
      "Frete grátis em todas as compras",
      "Brindes exclusivos",
      "Suporte prioritário",
    ],
    discountPercentage: 10,
    color: "yellow",
  },
  {
    id: "platinum",
    name: "Platina",
    minPoints: 3000,
    benefits: [
      "Acumule 3 pontos a cada R$ 1 gasto",
      "15% de desconto em todas as compras",
      "Frete grátis expresso",
      "Produtos exclusivos",
      "Gerente de conta dedicado",
      "Aniversário com presente especial",
    ],
    discountPercentage: 15,
    color: "purple",
  },
];

export function calculatePoints(amount: number, currentTier: string): number {
  const tier = loyaltyTiers.find((t) => t.id === currentTier);
  if (!tier) return amount;

  const multiplier = tier.id === "bronze" ? 1 : tier.id === "silver" ? 1.5 : tier.id === "gold" ? 2 : 3;
  return Math.floor(amount * multiplier);
}

export function getTierByPoints(points: number): LoyaltyTier {
  for (let i = loyaltyTiers.length - 1; i >= 0; i--) {
    if (points >= loyaltyTiers[i].minPoints) {
      return loyaltyTiers[i];
    }
  }
  return loyaltyTiers[0];
}

export function getNextTier(currentPoints: number): {
  tier: LoyaltyTier | null;
  pointsNeeded: number;
} {
  const currentTier = getTierByPoints(currentPoints);
  const currentIndex = loyaltyTiers.findIndex((t) => t.id === currentTier.id);

  if (currentIndex === loyaltyTiers.length - 1) {
    return { tier: null, pointsNeeded: 0 };
  }

  const nextTier = loyaltyTiers[currentIndex + 1];
  const pointsNeeded = nextTier.minPoints - currentPoints;

  return { tier: nextTier, pointsNeeded };
}

export function convertPointsToDiscount(points: number): number {
  // 100 points = R$ 10 discount
  return (points / 100) * 10;
}

export function getPointsNeededForDiscount(discountAmount: number): number {
  // R$ 10 discount = 100 points
  return (discountAmount / 10) * 100;
}

export interface RewardOption {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  value: number;
  type: "discount" | "freeShipping" | "product";
  image?: string;
}

export const rewardOptions: RewardOption[] = [
  {
    id: "discount-10",
    name: "R$ 10 de Desconto",
    description: "Vale de R$ 10 para usar em qualquer compra",
    pointsCost: 100,
    value: 10,
    type: "discount",
  },
  {
    id: "discount-25",
    name: "R$ 25 de Desconto",
    description: "Vale de R$ 25 para usar em qualquer compra",
    pointsCost: 250,
    value: 25,
    type: "discount",
  },
  {
    id: "discount-50",
    name: "R$ 50 de Desconto",
    description: "Vale de R$ 50 para usar em qualquer compra",
    pointsCost: 500,
    value: 50,
    type: "discount",
  },
  {
    id: "free-shipping",
    name: "Frete Grátis",
    description: "Frete grátis para sua próxima compra",
    pointsCost: 50,
    value: 0,
    type: "freeShipping",
  },
  {
    id: "discount-100",
    name: "R$ 100 de Desconto",
    description: "Vale de R$ 100 para usar em qualquer compra",
    pointsCost: 1000,
    value: 100,
    type: "discount",
  },
];

export function canRedeemReward(userPoints: number, rewardCost: number): boolean {
  return userPoints >= rewardCost;
}

export async function redeemReward(
  userId: string,
  rewardId: string,
  userPoints: number
): Promise<{ success: boolean; message: string; couponCode?: string }> {
  const reward = rewardOptions.find((r) => r.id === rewardId);

  if (!reward) {
    return { success: false, message: "Recompensa não encontrada" };
  }

  if (!canRedeemReward(userPoints, reward.pointsCost)) {
    return { success: false, message: "Pontos insuficientes" };
  }

  // Generate coupon code
  const couponCode = `REWARD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

  // In production, this would:
  // 1. Deduct points from user
  // 2. Create coupon in database
  // 3. Send email with coupon code

  return {
    success: true,
    message: "Recompensa resgatada com sucesso!",
    couponCode,
  };
}

export interface LoyaltyActivity {
  id: string;
  type: "earned" | "redeemed" | "expired";
  points: number;
  description: string;
  date: Date;
}

export function formatPoints(points: number): string {
  return points.toLocaleString("pt-BR");
}

export function getProgressToNextTier(currentPoints: number): number {
  const currentTier = getTierByPoints(currentPoints);
  const nextTierInfo = getNextTier(currentPoints);

  if (!nextTierInfo.tier) return 100;

  const currentTierMin = currentTier.minPoints;
  const nextTierMin = nextTierInfo.tier.minPoints;
  const progress =
    ((currentPoints - currentTierMin) / (nextTierMin - currentTierMin)) * 100;

  return Math.min(100, Math.max(0, progress));
}
