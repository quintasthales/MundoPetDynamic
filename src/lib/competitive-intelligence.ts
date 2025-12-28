// Competitive Intelligence and Market Analysis Tools

export interface Competitor {
  id: string;
  name: string;
  website: string;
  category: string;
  marketShare: number; // percentage
  strengths: string[];
  weaknesses: string[];
  pricing: {
    strategy: "premium" | "competitive" | "discount" | "value";
    averagePrice: number;
    priceRange: { min: number; max: number };
  };
  products: {
    total: number;
    categories: string[];
    topSellers: string[];
  };
  marketing: {
    channels: string[];
    estimatedBudget: number;
    socialFollowers: {
      instagram?: number;
      facebook?: number;
      twitter?: number;
    };
  };
  customerService: {
    rating: number; // 0-5
    responseTime: number; // hours
    channels: string[];
  };
  lastUpdated: Date;
}

export interface CompetitivePricing {
  productId: string;
  productName: string;
  ourPrice: number;
  competitorPrices: {
    competitorId: string;
    competitorName: string;
    price: number;
    url: string;
    availability: "in_stock" | "low_stock" | "out_of_stock";
    lastChecked: Date;
  }[];
  pricePosition: "lowest" | "competitive" | "premium";
  recommendedPrice: number;
  potentialRevenue: number;
}

export interface MarketTrend {
  id: string;
  name: string;
  category: string;
  trend: "rising" | "stable" | "declining";
  growth: number; // percentage
  searchVolume: number;
  competition: "low" | "medium" | "high";
  seasonality: {
    peak: string[]; // months
    low: string[]; // months
  };
  relatedKeywords: string[];
  opportunities: string[];
  threats: string[];
}

export interface MarketSegment {
  id: string;
  name: string;
  size: number; // customers
  value: number; // revenue potential
  growth: number; // percentage
  demographics: {
    ageRange: string;
    gender: string;
    income: string;
    location: string[];
  };
  behaviors: {
    purchaseFrequency: string;
    averageOrderValue: number;
    preferredChannels: string[];
    priceS ensitivity: "low" | "medium" | "high";
  };
  needs: string[];
  painPoints: string[];
  competitorShare: {
    competitorId: string;
    share: number;
  }[];
}

export interface SWOT {
  strengths: {
    factor: string;
    impact: "high" | "medium" | "low";
    description: string;
  }[];
  weaknesses: {
    factor: string;
    impact: "high" | "medium" | "low";
    description: string;
  }[];
  opportunities: {
    factor: string;
    potential: "high" | "medium" | "low";
    description: string;
    timeframe: string;
  }[];
  threats: {
    factor: string;
    severity: "high" | "medium" | "low";
    description: string;
    mitigation: string;
  }[];
}

export interface CompetitiveAdvantage {
  id: string;
  type: "product" | "price" | "service" | "brand" | "technology" | "distribution";
  description: string;
  strength: number; // 0-100
  sustainability: "temporary" | "sustainable" | "defensible";
  competitors: {
    competitorId: string;
    hasAdvantage: boolean;
    gap: number; // percentage
  }[];
}

// Mock competitors data
export const competitors: Competitor[] = [
  {
    id: "comp-001",
    name: "Aroma Brasil",
    website: "https://aromabrasil.com.br",
    category: "Aromaterapia",
    marketShare: 25.5,
    strengths: [
      "Grande variedade de produtos",
      "Marca estabelecida",
      "Rede de lojas físicas",
    ],
    weaknesses: [
      "Preços altos",
      "Site desatualizado",
      "Atendimento lento",
    ],
    pricing: {
      strategy: "premium",
      averagePrice: 159.90,
      priceRange: { min: 79.90, max: 399.90 },
    },
    products: {
      total: 456,
      categories: ["Difusores", "Óleos Essenciais", "Velas"],
      topSellers: ["Difusor Ultrassônico Premium", "Kit Óleos Essenciais"],
    },
    marketing: {
      channels: ["Instagram", "Facebook", "Google Ads"],
      estimatedBudget: 50000,
      socialFollowers: {
        instagram: 125000,
        facebook: 89000,
      },
    },
    customerService: {
      rating: 3.8,
      responseTime: 24,
      channels: ["Email", "WhatsApp", "Telefone"],
    },
    lastUpdated: new Date(),
  },
  {
    id: "comp-002",
    name: "Zen Store",
    website: "https://zenstore.com.br",
    category: "Bem-estar",
    marketShare: 18.2,
    strengths: [
      "Preços competitivos",
      "Entrega rápida",
      "Bom atendimento",
    ],
    weaknesses: [
      "Pouca variedade",
      "Marca menos conhecida",
      "Qualidade inconsistente",
    ],
    pricing: {
      strategy: "competitive",
      averagePrice: 119.90,
      priceRange: { min: 49.90, max: 249.90 },
    },
    products: {
      total: 234,
      categories: ["Difusores", "Incensos", "Decoração"],
      topSellers: ["Difusor Básico", "Kit Incensos"],
    },
    marketing: {
      channels: ["Facebook", "Instagram", "Influencers"],
      estimatedBudget: 30000,
      socialFollowers: {
        instagram: 67000,
        facebook: 45000,
      },
    },
    customerService: {
      rating: 4.2,
      responseTime: 12,
      channels: ["Chat", "Email", "WhatsApp"],
    },
    lastUpdated: new Date(),
  },
];

// Analyze competitive pricing
export function analyzeCompetitivePricing(
  productId: string
): CompetitivePricing {
  // Mock implementation
  const ourPrice = 129.90;

  const competitorPrices = [
    {
      competitorId: "comp-001",
      competitorName: "Aroma Brasil",
      price: 159.90,
      url: "https://aromabrasil.com.br/produto",
      availability: "in_stock" as const,
      lastChecked: new Date(),
    },
    {
      competitorId: "comp-002",
      competitorName: "Zen Store",
      price: 119.90,
      url: "https://zenstore.com.br/produto",
      availability: "in_stock" as const,
      lastChecked: new Date(),
    },
  ];

  const prices = [ourPrice, ...competitorPrices.map((c) => c.price)];
  const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;

  let pricePosition: CompetitivePricing["pricePosition"];
  if (ourPrice < Math.min(...prices.filter((p) => p !== ourPrice))) {
    pricePosition = "lowest";
  } else if (ourPrice > avgPrice * 1.1) {
    pricePosition = "premium";
  } else {
    pricePosition = "competitive";
  }

  // Calculate recommended price
  const lowestCompetitorPrice = Math.min(...competitorPrices.map((c) => c.price));
  const recommendedPrice = lowestCompetitorPrice * 0.95; // 5% below lowest

  return {
    productId,
    productName: "Difusor Aromático Ultrassônico Zen",
    ourPrice,
    competitorPrices,
    pricePosition,
    recommendedPrice,
    potentialRevenue: 15000, // Mock
  };
}

// Track market trends
export const marketTrends: MarketTrend[] = [
  {
    id: "trend-001",
    name: "Aromaterapia Residencial",
    category: "Bem-estar",
    trend: "rising",
    growth: 45.5,
    searchVolume: 125000,
    competition: "medium",
    seasonality: {
      peak: ["Dezembro", "Janeiro", "Maio"],
      low: ["Março", "Abril"],
    },
    relatedKeywords: [
      "difusor de ambiente",
      "óleos essenciais",
      "aromatizador",
      "bem-estar em casa",
    ],
    opportunities: [
      "Crescimento do trabalho remoto",
      "Maior consciência sobre bem-estar",
      "Tendência de autocuidado",
    ],
    threats: [
      "Entrada de grandes marcas",
      "Produtos importados baratos",
      "Mudança de preferências",
    ],
  },
  {
    id: "trend-002",
    name: "Produtos Sustentáveis",
    category: "Sustentabilidade",
    trend: "rising",
    growth: 67.8,
    searchVolume: 89000,
    competition: "low",
    seasonality: {
      peak: ["Junho", "Novembro"],
      low: ["Janeiro", "Fevereiro"],
    },
    relatedKeywords: [
      "produtos ecológicos",
      "sustentável",
      "natural",
      "orgânico",
    ],
    opportunities: [
      "Consciência ambiental crescente",
      "Disposição a pagar mais",
      "Diferenciação de marca",
    ],
    threats: [
      "Greenwashing de concorrentes",
      "Certificações caras",
      "Cadeia de suprimentos complexa",
    ],
  },
];

// Analyze market segments
export const marketSegments: MarketSegment[] = [
  {
    id: "seg-001",
    name: "Millennials Urbanos",
    size: 2500000,
    value: 125000000,
    growth: 25.5,
    demographics: {
      ageRange: "25-40",
      gender: "Todos",
      income: "R$ 3.000 - R$ 8.000",
      location: ["São Paulo", "Rio de Janeiro", "Belo Horizonte"],
    },
    behaviors: {
      purchaseFrequency: "Mensal",
      averageOrderValue: 150.00,
      preferredChannels: ["Online", "Instagram", "Marketplace"],
      priceSensitivity: "medium",
    },
    needs: [
      "Bem-estar em casa",
      "Produtos de qualidade",
      "Conveniência",
      "Sustentabilidade",
    ],
    painPoints: [
      "Falta de tempo",
      "Dificuldade em escolher produtos",
      "Preços altos",
      "Entrega demorada",
    ],
    competitorShare: [
      { competitorId: "comp-001", share: 35 },
      { competitorId: "comp-002", share: 25 },
    ],
  },
  {
    id: "seg-002",
    name: "Entusiastas de Bem-estar",
    size: 1200000,
    value: 89000000,
    growth: 42.3,
    demographics: {
      ageRange: "30-55",
      gender: "Predominantemente feminino",
      income: "R$ 5.000 - R$ 15.000",
      location: ["Capitais", "Cidades médias"],
    },
    behaviors: {
      purchaseFrequency: "Quinzenal",
      averageOrderValue: 280.00,
      preferredChannels: ["Online", "Lojas especializadas"],
      priceSensitivity: "low",
    },
    needs: [
      "Produtos premium",
      "Variedade",
      "Informação detalhada",
      "Atendimento especializado",
    ],
    painPoints: [
      "Produtos de baixa qualidade",
      "Falta de informação",
      "Dificuldade em encontrar produtos específicos",
    ],
    competitorShare: [
      { competitorId: "comp-001", share: 45 },
      { competitorId: "comp-002", share: 15 },
    ],
  },
];

// Perform SWOT analysis
export function performSWOTAnalysis(): SWOT {
  return {
    strengths: [
      {
        factor: "Plataforma tecnológica avançada",
        impact: "high",
        description: "Site moderno com 410+ features e excelente UX",
      },
      {
        factor: "Preços competitivos",
        impact: "high",
        description: "Estratégia de precificação inteligente",
      },
      {
        factor: "Atendimento personalizado",
        impact: "medium",
        description: "Chat ao vivo, voice commerce, suporte multicanal",
      },
      {
        factor: "Programa de fidelidade",
        impact: "medium",
        description: "Sistema de pontos e recompensas atrativo",
      },
    ],
    weaknesses: [
      {
        factor: "Marca nova no mercado",
        impact: "high",
        description: "Pouco reconhecimento de marca comparado aos concorrentes",
      },
      {
        factor: "Variedade limitada inicialmente",
        impact: "medium",
        description: "Catálogo menor que principais concorrentes",
      },
      {
        factor: "Sem lojas físicas",
        impact: "low",
        description: "Apenas presença online",
      },
    ],
    opportunities: [
      {
        factor: "Mercado em crescimento",
        potential: "high",
        description: "Setor de bem-estar crescendo 45% ao ano",
        timeframe: "Curto prazo (6-12 meses)",
      },
      {
        factor: "Tendência de sustentabilidade",
        potential: "high",
        description: "Consumidores buscando produtos ecológicos",
        timeframe: "Médio prazo (1-2 anos)",
      },
      {
        factor: "Expansão para marketplace",
        potential: "medium",
        description: "Vender em Mercado Livre, Amazon",
        timeframe: "Curto prazo (3-6 meses)",
      },
      {
        factor: "Parcerias com influencers",
        potential: "high",
        description: "Marketing de influência no nicho de bem-estar",
        timeframe: "Imediato",
      },
    ],
    threats: [
      {
        factor: "Entrada de grandes players",
        severity: "high",
        description: "Amazon, Mercado Livre podem entrar no nicho",
        mitigation: "Foco em diferenciação e atendimento personalizado",
      },
      {
        factor: "Guerra de preços",
        severity: "medium",
        description: "Concorrentes podem baixar preços agressivamente",
        mitigation: "Agregar valor além do preço (serviço, qualidade)",
      },
      {
        factor: "Mudanças regulatórias",
        severity: "low",
        description: "Novas regulamentações para produtos de bem-estar",
        mitigation: "Manter conformidade e certificações atualizadas",
      },
    ],
  };
}

// Identify competitive advantages
export const competitiveAdvantages: CompetitiveAdvantage[] = [
  {
    id: "adv-001",
    type: "technology",
    description: "Plataforma e-commerce de última geração com 410+ features",
    strength: 95,
    sustainability: "defensible",
    competitors: [
      { competitorId: "comp-001", hasAdvantage: false, gap: 60 },
      { competitorId: "comp-002", hasAdvantage: false, gap: 75 },
    ],
  },
  {
    id: "adv-002",
    type: "service",
    description: "Atendimento multicanal com voice commerce e chat ao vivo",
    strength: 85,
    sustainability: "sustainable",
    competitors: [
      { competitorId: "comp-001", hasAdvantage: false, gap: 45 },
      { competitorId: "comp-002", hasAdvantage: true, gap: -10 },
    ],
  },
  {
    id: "adv-003",
    type: "price",
    description: "Precificação dinâmica e competitiva",
    strength: 75,
    sustainability: "temporary",
    competitors: [
      { competitorId: "comp-001", hasAdvantage: false, gap: 30 },
      { competitorId: "comp-002", hasAdvantage: false, gap: 15 },
    ],
  },
];

// Monitor competitor activities
export interface CompetitorActivity {
  id: string;
  competitorId: string;
  type: "price_change" | "new_product" | "promotion" | "marketing_campaign" | "expansion";
  description: string;
  impact: "high" | "medium" | "low";
  detectedAt: Date;
  recommendedAction?: string;
}

export const competitorActivities: CompetitorActivity[] = [];

export function trackCompetitorActivity(
  competitorId: string,
  type: CompetitorActivity["type"],
  description: string,
  impact: CompetitorActivity["impact"]
): CompetitorActivity {
  const activity: CompetitorActivity = {
    id: `act-${Date.now()}`,
    competitorId,
    type,
    description,
    impact,
    detectedAt: new Date(),
  };

  // Generate recommended action
  switch (type) {
    case "price_change":
      activity.recommendedAction = "Revisar nossa estratégia de preços";
      break;
    case "new_product":
      activity.recommendedAction = "Avaliar adicionar produto similar";
      break;
    case "promotion":
      activity.recommendedAction = "Considerar promoção competitiva";
      break;
    case "marketing_campaign":
      activity.recommendedAction = "Intensificar nosso marketing";
      break;
    case "expansion":
      activity.recommendedAction = "Avaliar oportunidades de expansão";
      break;
  }

  competitorActivities.push(activity);

  return activity;
}

// Market share analysis
export interface MarketShareAnalysis {
  totalMarketSize: number; // revenue
  ourShare: number; // percentage
  ourRevenue: number;
  competitors: {
    competitorId: string;
    competitorName: string;
    share: number;
    revenue: number;
    growth: number;
  }[];
  trend: "gaining" | "stable" | "losing";
  targetShare: number; // percentage
  gapToLeader: number; // percentage
}

export function analyzeMarketShare(): MarketShareAnalysis {
  const totalMarketSize = 500000000; // R$ 500M
  const ourShare = 8.5;
  const ourRevenue = totalMarketSize * (ourShare / 100);

  return {
    totalMarketSize,
    ourShare,
    ourRevenue,
    competitors: [
      {
        competitorId: "comp-001",
        competitorName: "Aroma Brasil",
        share: 25.5,
        revenue: totalMarketSize * 0.255,
        growth: 12.3,
      },
      {
        competitorId: "comp-002",
        competitorName: "Zen Store",
        share: 18.2,
        revenue: totalMarketSize * 0.182,
        growth: 15.7,
      },
    ],
    trend: "gaining",
    targetShare: 15.0,
    gapToLeader: 17.0,
  };
}

// Competitive intelligence dashboard
export interface CompetitiveIntelligenceDashboard {
  lastUpdated: Date;
  marketOverview: {
    size: number;
    growth: number;
    ourPosition: number;
  };
  competitorCount: number;
  recentActivities: CompetitorActivity[];
  pricingAlerts: {
    productId: string;
    message: string;
    severity: "high" | "medium" | "low";
  }[];
  opportunities: {
    type: string;
    description: string;
    potential: number;
  }[];
  threats: {
    type: string;
    description: string;
    severity: "high" | "medium" | "low";
  }[];
}

export function getCompetitiveIntelligenceDashboard(): CompetitiveIntelligenceDashboard {
  return {
    lastUpdated: new Date(),
    marketOverview: {
      size: 500000000,
      growth: 35.5,
      ourPosition: 3,
    },
    competitorCount: competitors.length,
    recentActivities: competitorActivities.slice(0, 5),
    pricingAlerts: [
      {
        productId: "prod-001",
        message: "Concorrente baixou preço em 15%",
        severity: "high",
      },
    ],
    opportunities: [
      {
        type: "market_gap",
        description: "Produtos sustentáveis premium",
        potential: 25000000,
      },
    ],
    threats: [
      {
        type: "new_entrant",
        description: "Grande varejista entrando no mercado",
        severity: "high",
      },
    ],
  };
}

// Benchmark against competitors
export interface Benchmark {
  metric: string;
  ourValue: number;
  industryAverage: number;
  bestInClass: number;
  competitorId: string;
  gap: number; // percentage
  rating: "excellent" | "good" | "average" | "poor";
}

export function benchmarkPerformance(): Benchmark[] {
  return [
    {
      metric: "Conversion Rate",
      ourValue: 3.2,
      industryAverage: 2.5,
      bestInClass: 4.5,
      competitorId: "comp-002",
      gap: 28.9,
      rating: "good",
    },
    {
      metric: "Average Order Value",
      ourValue: 277.20,
      industryAverage: 245.00,
      bestInClass: 325.00,
      competitorId: "comp-001",
      gap: 14.7,
      rating: "good",
    },
    {
      metric: "Customer Satisfaction",
      ourValue: 4.5,
      industryAverage: 4.0,
      bestInClass: 4.8,
      competitorId: "comp-002",
      gap: 6.3,
      rating: "excellent",
    },
    {
      metric: "Delivery Time (days)",
      ourValue: 5,
      industryAverage: 7,
      bestInClass: 3,
      competitorId: "comp-002",
      gap: 40.0,
      rating: "average",
    },
  ];
}
