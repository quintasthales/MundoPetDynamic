// Gamification and Engagement System

export interface UserGameProfile {
  userId: string;
  level: number;
  xp: number; // experience points
  xpToNextLevel: number;
  totalXpEarned: number;
  rank: string; // e.g., "Bronze", "Silver", "Gold", "Platinum", "Diamond"
  badges: Badge[];
  achievements: Achievement[];
  streaks: {
    current: number; // days
    longest: number;
    lastActivity: Date;
  };
  challenges: Challenge[];
  rewards: Reward[];
  leaderboard: {
    position: number;
    totalUsers: number;
    percentile: number;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt?: Date;
  progress?: {
    current: number;
    required: number;
  };
  reward: {
    xp: number;
    points: number;
    discount?: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: "purchases" | "engagement" | "social" | "exploration" | "special";
  icon: string;
  tier: 1 | 2 | 3 | 4 | 5;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: {
    current: number;
    required: number;
    percentage: number;
  };
  reward: {
    xp: number;
    badge?: string;
    discount?: number;
    freeShipping?: boolean;
    exclusiveProduct?: string;
  };
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: "daily" | "weekly" | "monthly" | "limited_time" | "seasonal";
  difficulty: "easy" | "medium" | "hard" | "expert";
  startDate: Date;
  endDate: Date;
  tasks: {
    id: string;
    description: string;
    completed: boolean;
    progress: {
      current: number;
      required: number;
    };
  }[];
  reward: {
    xp: number;
    points: number;
    discount?: number;
    prize?: string;
  };
  participants: number;
  completions: number;
  active: boolean;
}

export interface Reward {
  id: string;
  type: "discount" | "free_product" | "free_shipping" | "points" | "badge" | "exclusive_access";
  name: string;
  description: string;
  value: number | string;
  cost: number; // points required
  available: number; // quantity available
  claimed: boolean;
  claimedAt?: Date;
  expiresAt?: Date;
  redeemable: boolean;
}

export interface Quest {
  id: string;
  name: string;
  story: string;
  steps: {
    id: string;
    order: number;
    title: string;
    description: string;
    action: string; // e.g., "purchase_product", "write_review", "share_social"
    completed: boolean;
    reward: {
      xp: number;
      points: number;
    };
  }[];
  totalSteps: number;
  completedSteps: number;
  finalReward: {
    xp: number;
    points: number;
    badge: string;
    discount: number;
  };
  active: boolean;
}

export interface Leaderboard {
  period: "daily" | "weekly" | "monthly" | "all_time";
  category: "xp" | "purchases" | "reviews" | "referrals" | "engagement";
  entries: {
    rank: number;
    userId: string;
    username: string;
    avatar: string;
    score: number;
    badge?: string;
    trend: "up" | "down" | "same";
  }[];
  userPosition?: number;
}

export interface SpinWheel {
  id: string;
  name: string;
  type: "daily" | "purchase" | "special_event";
  prizes: {
    id: string;
    name: string;
    type: "discount" | "points" | "free_product" | "free_shipping" | "badge";
    value: number | string;
    probability: number; // percentage
    color: string;
  }[];
  spinsAvailable: number;
  lastSpin?: Date;
  nextSpinAvailable?: Date;
}

export interface PointsSystem {
  balance: number;
  earned: number;
  spent: number;
  pending: number;
  conversionRate: number; // points per BRL
  redemptionRate: number; // BRL per point
  transactions: {
    id: string;
    type: "earn" | "spend" | "expire" | "bonus";
    amount: number;
    description: string;
    timestamp: Date;
    expiresAt?: Date;
  }[];
}

// XP and Level System
export const levelSystem = {
  levels: [
    { level: 1, xpRequired: 0, rank: "Iniciante", benefits: [] },
    { level: 2, xpRequired: 100, rank: "Bronze", benefits: ["5% desconto"] },
    { level: 3, xpRequired: 250, rank: "Bronze", benefits: ["5% desconto"] },
    { level: 4, xpRequired: 500, rank: "Prata", benefits: ["10% desconto", "Frete grátis acima R$ 100"] },
    { level: 5, xpRequired: 1000, rank: "Prata", benefits: ["10% desconto", "Frete grátis acima R$ 100"] },
    { level: 6, xpRequired: 2000, rank: "Ouro", benefits: ["15% desconto", "Frete grátis sempre"] },
    { level: 7, xpRequired: 4000, rank: "Ouro", benefits: ["15% desconto", "Frete grátis sempre"] },
    { level: 8, xpRequired: 8000, rank: "Platina", benefits: ["20% desconto", "Acesso antecipado", "Produtos exclusivos"] },
    { level: 9, xpRequired: 16000, rank: "Platina", benefits: ["20% desconto", "Acesso antecipado", "Produtos exclusivos"] },
    { level: 10, xpRequired: 32000, rank: "Diamante", benefits: ["25% desconto", "Atendimento VIP", "Eventos exclusivos"] },
  ],
};

export function calculateLevel(totalXp: number): {
  level: number;
  rank: string;
  currentXp: number;
  xpToNextLevel: number;
  benefits: string[];
} {
  let level = 1;
  let currentLevelXp = 0;

  for (const lvl of levelSystem.levels) {
    if (totalXp >= lvl.xpRequired) {
      level = lvl.level;
      currentLevelXp = lvl.xpRequired;
    } else {
      break;
    }
  }

  const currentLevel = levelSystem.levels[level - 1];
  const nextLevel = levelSystem.levels[level] || currentLevel;

  return {
    level,
    rank: currentLevel.rank,
    currentXp: totalXp - currentLevelXp,
    xpToNextLevel: nextLevel.xpRequired - totalXp,
    benefits: currentLevel.benefits,
  };
}

// XP earning actions
export const xpActions = {
  purchase: { xp: 10, description: "Por cada R$ 10 em compras" },
  first_purchase: { xp: 100, description: "Primeira compra" },
  review: { xp: 50, description: "Escrever avaliação" },
  review_with_photo: { xp: 100, description: "Avaliação com foto" },
  share_social: { xp: 25, description: "Compartilhar nas redes sociais" },
  refer_friend: { xp: 200, description: "Indicar amigo" },
  friend_purchase: { xp: 150, description: "Amigo indicado fez compra" },
  daily_login: { xp: 10, description: "Login diário" },
  streak_7days: { xp: 100, description: "7 dias consecutivos" },
  streak_30days: { xp: 500, description: "30 dias consecutivos" },
  complete_profile: { xp: 50, description: "Completar perfil" },
  add_wishlist: { xp: 5, description: "Adicionar à lista de desejos" },
  newsletter_signup: { xp: 25, description: "Assinar newsletter" },
  birthday: { xp: 100, description: "Aniversário" },
};

// Badges
export const badges: Badge[] = [
  {
    id: "badge-first-purchase",
    name: "Primeira Compra",
    description: "Realizou sua primeira compra",
    icon: "/badges/first-purchase.svg",
    rarity: "common",
    reward: { xp: 100, points: 50 },
  },
  {
    id: "badge-5-purchases",
    name: "Comprador Frequente",
    description: "Realizou 5 compras",
    icon: "/badges/frequent-buyer.svg",
    rarity: "rare",
    reward: { xp: 250, points: 150, discount: 10 },
  },
  {
    id: "badge-10-reviews",
    name: "Crítico Expert",
    description: "Escreveu 10 avaliações",
    icon: "/badges/reviewer.svg",
    rarity: "rare",
    reward: { xp: 300, points: 200 },
  },
  {
    id: "badge-refer-5",
    name: "Embaixador",
    description: "Indicou 5 amigos",
    icon: "/badges/ambassador.svg",
    rarity: "epic",
    reward: { xp: 500, points: 300, discount: 15 },
  },
  {
    id: "badge-100-purchases",
    name: "Cliente Lendário",
    description: "Realizou 100 compras",
    icon: "/badges/legendary.svg",
    rarity: "legendary",
    reward: { xp: 5000, points: 2000, discount: 25 },
  },
  {
    id: "badge-early-adopter",
    name: "Pioneiro",
    description: "Um dos primeiros 100 clientes",
    icon: "/badges/early-adopter.svg",
    rarity: "legendary",
    reward: { xp: 1000, points: 500 },
  },
];

// Achievements
export const achievements: Achievement[] = [
  {
    id: "ach-spend-1000",
    name: "Gastador Nível 1",
    description: "Gastou R$ 1.000 em compras",
    category: "purchases",
    icon: "/achievements/spender-1.svg",
    tier: 1,
    unlocked: false,
    progress: { current: 0, required: 1000, percentage: 0 },
    reward: { xp: 200, discount: 5 },
  },
  {
    id: "ach-spend-5000",
    name: "Gastador Nível 2",
    description: "Gastou R$ 5.000 em compras",
    category: "purchases",
    icon: "/achievements/spender-2.svg",
    tier: 2,
    unlocked: false,
    progress: { current: 0, required: 5000, percentage: 0 },
    reward: { xp: 500, discount: 10, freeShipping: true },
  },
  {
    id: "ach-social-butterfly",
    name: "Borboleta Social",
    description: "Compartilhou 20 produtos nas redes sociais",
    category: "social",
    icon: "/achievements/social.svg",
    tier: 1,
    unlocked: false,
    progress: { current: 0, required: 20, percentage: 0 },
    reward: { xp: 300, badge: "badge-social" },
  },
  {
    id: "ach-explorer",
    name: "Explorador",
    description: "Visitou todas as categorias de produtos",
    category: "exploration",
    icon: "/achievements/explorer.svg",
    tier: 1,
    unlocked: false,
    progress: { current: 0, required: 10, percentage: 0 },
    reward: { xp: 150 },
  },
];

// Daily/Weekly Challenges
export const challenges: Challenge[] = [
  {
    id: "challenge-daily-1",
    name: "Explorador Diário",
    description: "Visite 5 produtos diferentes hoje",
    type: "daily",
    difficulty: "easy",
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    tasks: [
      {
        id: "task-1",
        description: "Visitar 5 produtos",
        completed: false,
        progress: { current: 0, required: 5 },
      },
    ],
    reward: { xp: 50, points: 25 },
    participants: 1234,
    completions: 567,
    active: true,
  },
  {
    id: "challenge-weekly-1",
    name: "Comprador da Semana",
    description: "Faça 3 compras esta semana",
    type: "weekly",
    difficulty: "medium",
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    tasks: [
      {
        id: "task-1",
        description: "Realizar 3 compras",
        completed: false,
        progress: { current: 0, required: 3 },
      },
    ],
    reward: { xp: 300, points: 200, discount: 15 },
    participants: 5678,
    completions: 234,
    active: true,
  },
];

// Rewards Store
export const rewardsStore: Reward[] = [
  {
    id: "reward-discount-5",
    type: "discount",
    name: "Cupom 5% OFF",
    description: "Desconto de 5% em qualquer compra",
    value: 5,
    cost: 100,
    available: 1000,
    claimed: false,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    redeemable: true,
  },
  {
    id: "reward-discount-10",
    type: "discount",
    name: "Cupom 10% OFF",
    description: "Desconto de 10% em qualquer compra",
    value: 10,
    cost: 250,
    available: 500,
    claimed: false,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    redeemable: true,
  },
  {
    id: "reward-free-shipping",
    type: "free_shipping",
    name: "Frete Grátis",
    description: "Frete grátis em qualquer compra",
    value: "free",
    cost: 150,
    available: 750,
    claimed: false,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    redeemable: true,
  },
  {
    id: "reward-free-product",
    type: "free_product",
    name: "Óleo Essencial Grátis",
    description: "Óleo essencial de lavanda 10ml grátis",
    value: "oleo-lavanda-10ml",
    cost: 500,
    available: 100,
    claimed: false,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    redeemable: true,
  },
  {
    id: "reward-exclusive-access",
    type: "exclusive_access",
    name: "Acesso Antecipado",
    description: "Acesso antecipado a novos produtos por 1 mês",
    value: "30_days",
    cost: 1000,
    available: 50,
    claimed: false,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    redeemable: true,
  },
];

// Spin Wheel
export function createSpinWheel(type: SpinWheel["type"]): SpinWheel {
  return {
    id: `wheel-${Date.now()}`,
    name: "Roda da Sorte",
    type,
    prizes: [
      { id: "1", name: "5% OFF", type: "discount", value: 5, probability: 30, color: "#FFD700" },
      { id: "2", name: "10% OFF", type: "discount", value: 10, probability: 20, color: "#FF6B6B" },
      { id: "3", name: "15% OFF", type: "discount", value: 15, probability: 15, color: "#4ECDC4" },
      { id: "4", name: "20% OFF", type: "discount", value: 20, probability: 10, color: "#95E1D3" },
      { id: "5", name: "50 Pontos", type: "points", value: 50, probability: 15, color: "#F38181" },
      { id: "6", name: "Frete Grátis", type: "free_shipping", value: "free", probability: 8, color: "#AA96DA" },
      { id: "7", name: "Produto Grátis", type: "free_product", value: "oleo-10ml", probability: 2, color: "#FCBAD3" },
    ],
    spinsAvailable: 1,
    lastSpin: undefined,
    nextSpinAvailable: new Date(),
  };
}

// Leaderboards
export function getLeaderboard(
  period: Leaderboard["period"],
  category: Leaderboard["category"]
): Leaderboard {
  // Mock data
  return {
    period,
    category,
    entries: [
      {
        rank: 1,
        userId: "user-001",
        username: "Maria Silva",
        avatar: "/avatars/maria.jpg",
        score: 12500,
        badge: "badge-legendary",
        trend: "up",
      },
      {
        rank: 2,
        userId: "user-002",
        username: "João Santos",
        avatar: "/avatars/joao.jpg",
        score: 11200,
        badge: "badge-platinum",
        trend: "same",
      },
      {
        rank: 3,
        userId: "user-003",
        username: "Ana Costa",
        avatar: "/avatars/ana.jpg",
        score: 10800,
        badge: "badge-gold",
        trend: "down",
      },
    ],
    userPosition: 45,
  };
}

// Gamification Analytics
export interface GamificationAnalytics {
  totalUsers: number;
  activeUsers: number; // users with gamification activity
  engagementRate: number; // percentage
  averageLevel: number;
  averageXp: number;
  totalBadgesEarned: number;
  totalAchievementsUnlocked: number;
  totalChallengesCompleted: number;
  totalPointsEarned: number;
  totalPointsRedeemed: number;
  conversionLift: number; // percentage increase
  retentionLift: number; // percentage increase
  averageOrderValueLift: number; // percentage increase
  topActivities: {
    activity: string;
    count: number;
    xpGenerated: number;
  }[];
}

export function getGamificationAnalytics(): GamificationAnalytics {
  return {
    totalUsers: 50000,
    activeUsers: 38000,
    engagementRate: 76.0,
    averageLevel: 4.2,
    averageXp: 1850,
    totalBadgesEarned: 125000,
    totalAchievementsUnlocked: 89000,
    totalChallengesCompleted: 156000,
    totalPointsEarned: 12500000,
    totalPointsRedeemed: 8900000,
    conversionLift: 32.5, // 32.5% increase!
    retentionLift: 45.8, // 45.8% increase!
    averageOrderValueLift: 18.3, // 18.3% increase!
    topActivities: [
      { activity: "Compras", count: 45000, xpGenerated: 4500000 },
      { activity: "Avaliações", count: 23000, xpGenerated: 1150000 },
      { activity: "Login Diário", count: 380000, xpGenerated: 3800000 },
      { activity: "Compartilhamentos", count: 12000, xpGenerated: 300000 },
    ],
  };
}

// Earn XP
export function earnXp(
  userId: string,
  action: keyof typeof xpActions,
  multiplier: number = 1
): { xp: number; levelUp: boolean; newLevel?: number } {
  const xpEarned = xpActions[action].xp * multiplier;

  // Mock implementation - in production, update database
  return {
    xp: xpEarned,
    levelUp: false, // Check if user leveled up
    newLevel: undefined,
  };
}

// Unlock achievement
export function unlockAchievement(
  userId: string,
  achievementId: string
): Achievement {
  const achievement = achievements.find((a) => a.id === achievementId);
  if (!achievement) {
    throw new Error("Achievement not found");
  }

  achievement.unlocked = true;
  achievement.unlockedAt = new Date();
  achievement.progress.current = achievement.progress.required;
  achievement.progress.percentage = 100;

  return achievement;
}

// Complete challenge
export function completeChallenge(
  userId: string,
  challengeId: string
): Challenge {
  const challenge = challenges.find((c) => c.id === challengeId);
  if (!challenge) {
    throw new Error("Challenge not found");
  }

  challenge.tasks.forEach((task) => {
    task.completed = true;
    task.progress.current = task.progress.required;
  });

  challenge.completions++;

  return challenge;
}

// Redeem reward
export function redeemReward(userId: string, rewardId: string): Reward {
  const reward = rewardsStore.find((r) => r.id === rewardId);
  if (!reward) {
    throw new Error("Reward not found");
  }

  if (!reward.redeemable) {
    throw new Error("Reward not redeemable");
  }

  reward.claimed = true;
  reward.claimedAt = new Date();
  reward.available--;

  return reward;
}

// Spin wheel
export function spinWheel(wheelId: string): SpinWheel["prizes"][0] {
  // Mock implementation - in production, use weighted random selection
  const wheel = createSpinWheel("daily");
  const random = Math.random() * 100;
  let cumulative = 0;

  for (const prize of wheel.prizes) {
    cumulative += prize.probability;
    if (random <= cumulative) {
      return prize;
    }
  }

  return wheel.prizes[0];
}
