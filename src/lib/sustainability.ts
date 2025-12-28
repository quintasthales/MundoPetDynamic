// Sustainability and Carbon Tracking System

export interface CarbonFootprint {
  productId: string;
  productName: string;
  manufacturing: number; // kg CO2e
  packaging: number; // kg CO2e
  shipping: number; // kg CO2e
  total: number; // kg CO2e
  offsetAvailable: boolean;
  offsetCost: number; // BRL
  certifications: string[];
}

export interface SustainabilityScore {
  productId: string;
  score: number; // 0-100
  rating: "A+" | "A" | "B" | "C" | "D" | "E";
  factors: {
    materials: number; // 0-100
    manufacturing: number; // 0-100
    packaging: number; // 0-100
    shipping: number; // 0-100
    endOfLife: number; // 0-100
  };
  improvements: string[];
}

export interface EcoProduct {
  id: string;
  name: string;
  category: string;
  sustainabilityScore: number;
  certifications: {
    name: string;
    issuer: string;
    validUntil: Date;
    logo: string;
  }[];
  ecoFeatures: {
    feature: string;
    description: string;
    impact: "high" | "medium" | "low";
  }[];
  carbonNeutral: boolean;
  recyclable: boolean;
  biodegradable: boolean;
  organic: boolean;
  fairTrade: boolean;
  crueltFree: boolean;
  vegan: boolean;
}

export interface CarbonOffset {
  id: string;
  orderId: string;
  amount: number; // kg CO2e
  cost: number; // BRL
  project: {
    name: string;
    type: "reforestation" | "renewable_energy" | "conservation" | "ocean_cleanup";
    location: string;
    description: string;
    certificationStandard: string;
  };
  certificate: {
    number: string;
    issuedAt: Date;
    url: string;
  };
  status: "pending" | "completed" | "verified";
}

export interface SustainabilityMetrics {
  period: "day" | "week" | "month" | "year";
  totalCarbonEmissions: number; // kg CO2e
  totalCarbonOffset: number; // kg CO2e
  netCarbonFootprint: number; // kg CO2e
  carbonNeutralOrders: number;
  carbonNeutralPercentage: number;
  treesPlanted: number;
  wasteReduced: number; // kg
  recyclablePackaging: number; // percentage
  ecoProductsSold: number;
  sustainabilityRevenue: number; // BRL
  customerParticipation: number; // percentage
}

export interface GreenShipping {
  carrierId: string;
  carrierName: string;
  emissionsPerKm: number; // kg CO2e
  electricVehicles: boolean;
  carbonNeutral: boolean;
  sustainabilityRating: number; // 0-100
  ecoOptions: {
    name: string;
    description: string;
    additionalCost: number;
    carbonReduction: number; // percentage
  }[];
}

export interface PackagingOption {
  id: string;
  name: string;
  type: "plastic" | "paper" | "biodegradable" | "recycled" | "reusable";
  recyclable: boolean;
  biodegradable: boolean;
  recycledContent: number; // percentage
  carbonFootprint: number; // kg CO2e
  cost: number; // BRL
  sustainabilityScore: number; // 0-100
}

// Calculate product carbon footprint
export function calculateCarbonFootprint(
  productId: string,
  shippingDistance: number = 1000 // km
): CarbonFootprint {
  // Mock implementation - in production, use real data
  const manufacturing = 2.5; // kg CO2e
  const packaging = 0.3; // kg CO2e
  const shipping = (shippingDistance / 1000) * 0.5; // kg CO2e per 1000km

  const total = manufacturing + packaging + shipping;

  return {
    productId,
    productName: "Difusor Aromático Ultrassônico Zen",
    manufacturing,
    packaging,
    shipping,
    total,
    offsetAvailable: true,
    offsetCost: total * 0.05, // R$ 0.05 per kg CO2e
    certifications: ["Carbon Trust", "Climate Neutral"],
  };
}

// Calculate sustainability score
export function calculateSustainabilityScore(
  productId: string
): SustainabilityScore {
  // Mock implementation
  const factors = {
    materials: 85, // Sustainable materials
    manufacturing: 75, // Clean manufacturing
    packaging: 90, // Eco-friendly packaging
    shipping: 70, // Carbon-conscious shipping
    endOfLife: 80, // Recyclable/biodegradable
  };

  const score =
    (factors.materials +
      factors.manufacturing +
      factors.packaging +
      factors.shipping +
      factors.endOfLife) /
    5;

  let rating: SustainabilityScore["rating"];
  if (score >= 90) rating = "A+";
  else if (score >= 80) rating = "A";
  else if (score >= 70) rating = "B";
  else if (score >= 60) rating = "C";
  else if (score >= 50) rating = "D";
  else rating = "E";

  return {
    productId,
    score,
    rating,
    factors,
    improvements: [
      "Usar 100% energia renovável na fabricação",
      "Reduzir embalagem em 20%",
      "Implementar programa de reciclagem",
    ],
  };
}

// Eco-friendly products
export const ecoProducts: EcoProduct[] = [
  {
    id: "eco-001",
    name: "Difusor Aromático Eco",
    category: "Difusores",
    sustainabilityScore: 92,
    certifications: [
      {
        name: "Carbon Neutral",
        issuer: "Climate Neutral Certified",
        validUntil: new Date("2025-12-31"),
        logo: "/certifications/carbon-neutral.png",
      },
      {
        name: "FSC Certified",
        issuer: "Forest Stewardship Council",
        validUntil: new Date("2026-06-30"),
        logo: "/certifications/fsc.png",
      },
    ],
    ecoFeatures: [
      {
        feature: "Materiais Reciclados",
        description: "80% de materiais reciclados pós-consumo",
        impact: "high",
      },
      {
        feature: "Embalagem Biodegradável",
        description: "100% biodegradável em 90 dias",
        impact: "high",
      },
      {
        feature: "Baixo Consumo de Energia",
        description: "Consome 50% menos energia que modelos tradicionais",
        impact: "medium",
      },
    ],
    carbonNeutral: true,
    recyclable: true,
    biodegradable: false,
    organic: false,
    fairTrade: true,
    crueltyFree: true,
    vegan: true,
  },
];

// Purchase carbon offset
export function purchaseCarbonOffset(
  orderId: string,
  carbonAmount: number
): CarbonOffset {
  const offset: CarbonOffset = {
    id: `offset-${Date.now()}`,
    orderId,
    amount: carbonAmount,
    cost: carbonAmount * 0.05, // R$ 0.05 per kg CO2e
    project: {
      name: "Reflorestamento Amazônia",
      type: "reforestation",
      location: "Amazonas, Brasil",
      description:
        "Projeto de reflorestamento na Amazônia que já plantou mais de 1 milhão de árvores",
      certificationStandard: "Verified Carbon Standard (VCS)",
    },
    certificate: {
      number: `CERT-${Date.now()}`,
      issuedAt: new Date(),
      url: `/certificates/offset-${Date.now()}.pdf`,
    },
    status: "pending",
  };

  return offset;
}

// Get sustainability metrics
export function getSustainabilityMetrics(
  period: SustainabilityMetrics["period"]
): SustainabilityMetrics {
  // Mock data - in production, calculate from real orders
  return {
    period,
    totalCarbonEmissions: 1250.5, // kg CO2e
    totalCarbonOffset: 1100.0, // kg CO2e
    netCarbonFootprint: 150.5, // kg CO2e
    carbonNeutralOrders: 234,
    carbonNeutralPercentage: 45.5,
    treesPlanted: 567,
    wasteReduced: 890.3, // kg
    recyclablePackaging: 85.2, // percentage
    ecoProductsSold: 456,
    sustainabilityRevenue: 125000.0, // BRL
    customerParticipation: 38.7, // percentage
  };
}

// Green shipping options
export const greenShippingCarriers: GreenShipping[] = [
  {
    carrierId: "carrier-eco-001",
    carrierName: "Correios Sustentável",
    emissionsPerKm: 0.12, // kg CO2e
    electricVehicles: true,
    carbonNeutral: true,
    sustainabilityRating: 92,
    ecoOptions: [
      {
        name: "Entrega Verde",
        description: "Veículo 100% elétrico + compensação de carbono",
        additionalCost: 5.00,
        carbonReduction: 100,
      },
      {
        name: "Entrega Agrupada",
        description: "Aguarda mais pedidos da região para otimizar rota",
        additionalCost: -2.00, // Desconto
        carbonReduction: 40,
      },
    ],
  },
  {
    carrierId: "carrier-eco-002",
    carrierName: "Loggi Eco",
    emissionsPerKm: 0.15, // kg CO2e
    electricVehicles: true,
    carbonNeutral: false,
    sustainabilityRating: 78,
    ecoOptions: [
      {
        name: "Bike Delivery",
        description: "Entrega de bicicleta em áreas urbanas",
        additionalCost: 0.00,
        carbonReduction: 100,
      },
    ],
  },
];

// Packaging options
export const packagingOptions: PackagingOption[] = [
  {
    id: "pkg-001",
    name: "Embalagem Biodegradável Premium",
    type: "biodegradable",
    recyclable: true,
    biodegradable: true,
    recycledContent: 100,
    carbonFootprint: 0.15, // kg CO2e
    cost: 3.50,
    sustainabilityScore: 95,
  },
  {
    id: "pkg-002",
    name: "Embalagem Reciclada Padrão",
    type: "recycled",
    recyclable: true,
    biodegradable: false,
    recycledContent: 80,
    carbonFootprint: 0.25, // kg CO2e
    cost: 2.00,
    sustainabilityScore: 85,
  },
  {
    id: "pkg-003",
    name: "Embalagem Reutilizável",
    type: "reusable",
    recyclable: true,
    biodegradable: false,
    recycledContent: 50,
    carbonFootprint: 0.40, // kg CO2e (but reusable 10+ times)
    cost: 5.00,
    sustainabilityScore: 90,
  },
];

// Sustainability badges
export interface SustainabilityBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: string;
  color: string;
}

export const sustainabilityBadges: SustainabilityBadge[] = [
  {
    id: "badge-001",
    name: "Carbono Neutro",
    description: "Produto com emissões de carbono totalmente compensadas",
    icon: "🌱",
    criteria: "100% carbon offset",
    color: "#10B981",
  },
  {
    id: "badge-002",
    name: "Embalagem Eco",
    description: "Embalagem 100% reciclável ou biodegradável",
    icon: "📦",
    criteria: "Eco-friendly packaging",
    color: "#059669",
  },
  {
    id: "badge-003",
    name: "Materiais Reciclados",
    description: "Feito com 80%+ de materiais reciclados",
    icon: "♻️",
    criteria: "80%+ recycled materials",
    color: "#0D9488",
  },
  {
    id: "badge-004",
    name: "Orgânico",
    description: "Certificado orgânico",
    icon: "🌿",
    criteria: "Organic certification",
    color: "#14B8A6",
  },
  {
    id: "badge-005",
    name: "Comércio Justo",
    description: "Certificado de comércio justo",
    icon: "🤝",
    criteria: "Fair trade certified",
    color: "#06B6D4",
  },
  {
    id: "badge-006",
    name: "Cruelty-Free",
    description: "Não testado em animais",
    icon: "🐰",
    criteria: "Not tested on animals",
    color: "#0EA5E9",
  },
  {
    id: "badge-007",
    name: "Vegano",
    description: "100% livre de ingredientes de origem animal",
    icon: "🌱",
    criteria: "100% vegan",
    color: "#3B82F6",
  },
];

// Sustainability goals
export interface SustainabilityGoal {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  progress: number; // percentage
  status: "on_track" | "at_risk" | "behind" | "completed";
  actions: string[];
}

export const sustainabilityGoals: SustainabilityGoal[] = [
  {
    id: "goal-001",
    name: "Carbono Neutro 2025",
    description: "Tornar 100% das operações carbono neutro até 2025",
    target: 100,
    current: 45.5,
    unit: "%",
    deadline: new Date("2025-12-31"),
    progress: 45.5,
    status: "on_track",
    actions: [
      "Aumentar uso de energia renovável",
      "Otimizar logística",
      "Compensar emissões restantes",
    ],
  },
  {
    id: "goal-002",
    name: "Embalagem 100% Sustentável",
    description: "Usar apenas embalagens recicláveis ou biodegradáveis",
    target: 100,
    current: 85.2,
    unit: "%",
    deadline: new Date("2024-12-31"),
    progress: 85.2,
    status: "on_track",
    actions: [
      "Substituir embalagens plásticas restantes",
      "Parceria com fornecedores eco-friendly",
    ],
  },
  {
    id: "goal-003",
    name: "Plantar 10.000 Árvores",
    description: "Plantar 10.000 árvores através de parcerias",
    target: 10000,
    current: 567,
    unit: "árvores",
    deadline: new Date("2025-06-30"),
    progress: 5.67,
    status: "at_risk",
    actions: [
      "Aumentar programa de compensação",
      "Parceria com ONGs de reflorestamento",
      "Campanha de conscientização",
    ],
  },
];

// Customer sustainability profile
export interface CustomerSustainabilityProfile {
  userId: string;
  totalCarbonOffset: number; // kg CO2e
  treesPlanted: number;
  ecoProductsPurchased: number;
  sustainabilityScore: number; // 0-100
  badges: string[];
  rank: "Eco Iniciante" | "Eco Consciente" | "Eco Warrior" | "Eco Champion";
  impact: {
    carbonSaved: number; // kg CO2e
    plasticAvoided: number; // kg
    waterSaved: number; // liters
  };
  achievements: {
    name: string;
    description: string;
    unlockedAt: Date;
    icon: string;
  }[];
}

export function getCustomerSustainabilityProfile(
  userId: string
): CustomerSustainabilityProfile {
  // Mock implementation
  const totalCarbonOffset = 125.5;
  const treesPlanted = 45;
  const ecoProductsPurchased = 23;

  let rank: CustomerSustainabilityProfile["rank"];
  if (totalCarbonOffset >= 500) rank = "Eco Champion";
  else if (totalCarbonOffset >= 200) rank = "Eco Warrior";
  else if (totalCarbonOffset >= 50) rank = "Eco Consciente";
  else rank = "Eco Iniciante";

  return {
    userId,
    totalCarbonOffset,
    treesPlanted,
    ecoProductsPurchased,
    sustainabilityScore: 78,
    badges: ["badge-001", "badge-002", "badge-006"],
    rank,
    impact: {
      carbonSaved: totalCarbonOffset,
      plasticAvoided: 12.3,
      waterSaved: 4500,
    },
    achievements: [
      {
        name: "Primeira Compra Eco",
        description: "Comprou seu primeiro produto sustentável",
        unlockedAt: new Date("2024-01-15"),
        icon: "🌱",
      },
      {
        name: "Plantador de Árvores",
        description: "Contribuiu para o plantio de 10+ árvores",
        unlockedAt: new Date("2024-03-20"),
        icon: "🌳",
      },
    ],
  };
}

// Sustainability dashboard
export interface SustainabilityDashboard {
  overview: {
    carbonNeutralPercentage: number;
    treesPlanted: number;
    wasteReduced: number;
    customerParticipation: number;
  };
  goals: SustainabilityGoal[];
  recentOffsets: CarbonOffset[];
  topEcoProducts: {
    productId: string;
    productName: string;
    sustainabilityScore: number;
    salesCount: number;
    carbonOffset: number;
  }[];
  monthlyTrend: {
    month: string;
    carbonEmissions: number;
    carbonOffset: number;
    netFootprint: number;
  }[];
}

export function getSustainabilityDashboard(): SustainabilityDashboard {
  const metrics = getSustainabilityMetrics("month");

  return {
    overview: {
      carbonNeutralPercentage: metrics.carbonNeutralPercentage,
      treesPlanted: metrics.treesPlanted,
      wasteReduced: metrics.wasteReduced,
      customerParticipation: metrics.customerParticipation,
    },
    goals: sustainabilityGoals,
    recentOffsets: [], // Would be populated with recent offset purchases
    topEcoProducts: [
      {
        productId: "eco-001",
        productName: "Difusor Aromático Eco",
        sustainabilityScore: 92,
        salesCount: 234,
        carbonOffset: 585.0,
      },
    ],
    monthlyTrend: [
      {
        month: "Jan",
        carbonEmissions: 1100,
        carbonOffset: 900,
        netFootprint: 200,
      },
      {
        month: "Fev",
        carbonEmissions: 1200,
        carbonOffset: 1000,
        netFootprint: 200,
      },
      {
        month: "Mar",
        carbonEmissions: 1250,
        carbonOffset: 1100,
        netFootprint: 150,
      },
    ],
  };
}

// Calculate trees needed to offset carbon
export function calculateTreesNeeded(carbonAmount: number): number {
  // Average tree absorbs ~21 kg CO2 per year
  return Math.ceil(carbonAmount / 21);
}

// Eco-friendly alternatives
export interface EcoAlternative {
  originalProductId: string;
  alternativeProductId: string;
  alternativeProductName: string;
  carbonReduction: number; // percentage
  costDifference: number; // BRL (can be negative)
  sustainabilityImprovement: number; // points
  reason: string;
}

export function suggestEcoAlternatives(
  productId: string
): EcoAlternative[] {
  return [
    {
      originalProductId: productId,
      alternativeProductId: "eco-001",
      alternativeProductName: "Difusor Aromático Eco",
      carbonReduction: 45,
      costDifference: 10.00,
      sustainabilityImprovement: 25,
      reason: "Feito com materiais reciclados e embalagem biodegradável",
    },
  ];
}
