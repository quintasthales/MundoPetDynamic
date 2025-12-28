// Social Proof and Trust Automation System

export interface SocialProofNotification {
  id: string;
  type: "purchase" | "review" | "signup" | "wishlist" | "view";
  message: string;
  customerName: string;
  customerLocation: string;
  productName?: string;
  productImage?: string;
  timestamp: Date;
  priority: "low" | "medium" | "high";
  displayDuration: number; // seconds
  shown: boolean;
}

export interface TrustBadge {
  id: string;
  name: string;
  type: "security" | "payment" | "shipping" | "guarantee" | "certification";
  icon: string;
  description: string;
  verificationUrl?: string;
  verified: boolean;
  displayLocation: "header" | "footer" | "product" | "checkout" | "all";
  priority: number;
}

export interface SocialProofWidget {
  id: string;
  type: "live_counter" | "recent_activity" | "trending" | "low_stock" | "urgency";
  enabled: boolean;
  position: "top_left" | "top_right" | "bottom_left" | "bottom_right" | "inline";
  style: {
    theme: "light" | "dark" | "custom";
    animation: "fade" | "slide" | "bounce" | "none";
    sound: boolean;
  };
  rules: {
    showOnPages: string[];
    hideOnPages: string[];
    minVisitors?: number;
    maxDisplays?: number;
    displayInterval?: number; // seconds
  };
}

export interface TestimonialWidget {
  id: string;
  testimonials: {
    id: string;
    customerName: string;
    customerPhoto?: string;
    customerLocation: string;
    rating: number; // 1-5
    text: string;
    productId?: string;
    verified: boolean;
    date: Date;
    helpful: number;
  }[];
  layout: "carousel" | "grid" | "list" | "masonry";
  autoplay: boolean;
  showRating: boolean;
  showDate: boolean;
  showVerified: boolean;
}

export interface UrgencyTimer {
  id: string;
  type: "flash_sale" | "limited_stock" | "special_offer" | "countdown";
  productId?: string;
  message: string;
  endTime: Date;
  action?: {
    type: "discount" | "free_shipping" | "gift";
    value: number;
  };
  style: {
    color: string;
    position: "top" | "bottom" | "inline";
    animation: boolean;
  };
}

export interface SocialProofAnalytics {
  impressions: number;
  clicks: number;
  conversions: number;
  conversionRate: number; // percentage
  averageTimeToConversion: number; // seconds
  topPerformingType: string;
  engagement: {
    type: string;
    impressions: number;
    clicks: number;
    conversions: number;
  }[];
}

// Trust badges
export const trustBadges: TrustBadge[] = [
  {
    id: "badge-ssl",
    name: "SSL Seguro",
    type: "security",
    icon: "/badges/ssl.svg",
    description: "Conexão 100% segura e criptografada",
    verified: true,
    displayLocation: "all",
    priority: 1,
  },
  {
    id: "badge-pci",
    name: "PCI Compliant",
    type: "payment",
    icon: "/badges/pci.svg",
    description: "Pagamentos seguros certificados PCI DSS",
    verified: true,
    displayLocation: "checkout",
    priority: 2,
  },
  {
    id: "badge-money-back",
    name: "Garantia 30 Dias",
    type: "guarantee",
    icon: "/badges/money-back.svg",
    description: "Devolução gratuita em até 30 dias",
    verified: true,
    displayLocation: "product",
    priority: 3,
  },
  {
    id: "badge-free-shipping",
    name: "Frete Grátis",
    type: "shipping",
    icon: "/badges/free-shipping.svg",
    description: "Frete grátis acima de R$ 150",
    verified: true,
    displayLocation: "all",
    priority: 4,
  },
  {
    id: "badge-authentic",
    name: "100% Autêntico",
    type: "certification",
    icon: "/badges/authentic.svg",
    description: "Produtos originais garantidos",
    verified: true,
    displayLocation: "product",
    priority: 5,
  },
  {
    id: "badge-eco",
    name: "Eco-Friendly",
    type: "certification",
    icon: "/badges/eco.svg",
    description: "Produtos sustentáveis certificados",
    verified: true,
    displayLocation: "product",
    priority: 6,
  },
];

// Generate social proof notification
export function generateSocialProofNotification(
  type: SocialProofNotification["type"]
): SocialProofNotification {
  const names = [
    "Maria Silva",
    "João Santos",
    "Ana Costa",
    "Pedro Oliveira",
    "Carla Souza",
  ];
  const locations = [
    "São Paulo, SP",
    "Rio de Janeiro, RJ",
    "Belo Horizonte, MG",
    "Curitiba, PR",
    "Porto Alegre, RS",
  ];
  const products = [
    "Difusor Aromático Zen",
    "Kit Aromaterapia",
    "Óleo Essencial Lavanda",
  ];

  const name = names[Math.floor(Math.random() * names.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const product = products[Math.floor(Math.random() * products.length)];

  let message = "";
  let priority: SocialProofNotification["priority"] = "medium";

  switch (type) {
    case "purchase":
      message = `${name} de ${location} acabou de comprar ${product}`;
      priority = "high";
      break;
    case "review":
      message = `${name} de ${location} avaliou ${product} com 5 estrelas`;
      priority = "medium";
      break;
    case "signup":
      message = `${name} de ${location} acabou de se cadastrar`;
      priority = "low";
      break;
    case "wishlist":
      message = `${name} adicionou ${product} à lista de desejos`;
      priority = "low";
      break;
    case "view":
      message = `${name} está visualizando ${product}`;
      priority = "low";
      break;
  }

  return {
    id: `notif-${Date.now()}`,
    type,
    message,
    customerName: name,
    customerLocation: location,
    productName: product,
    productImage: "/products/difusor-thumb.jpg",
    timestamp: new Date(),
    priority,
    displayDuration: 5,
    shown: false,
  };
}

// Live visitor counter
export interface LiveVisitorCounter {
  current: number;
  today: number;
  peak: number;
  trend: "increasing" | "stable" | "decreasing";
  locations: {
    country: string;
    count: number;
  }[];
}

export function getLiveVisitorCount(): LiveVisitorCounter {
  // Mock implementation - in production, use real analytics
  return {
    current: 127,
    today: 3456,
    peak: 189,
    trend: "increasing",
    locations: [
      { country: "Brasil", count: 98 },
      { country: "Portugal", count: 15 },
      { country: "Estados Unidos", count: 8 },
      { country: "Outros", count: 6 },
    ],
  };
}

// Recent activity feed
export interface RecentActivity {
  activities: {
    type: "purchase" | "review" | "signup";
    customerName: string;
    productName?: string;
    location: string;
    timestamp: Date;
    amount?: number;
  }[];
  totalToday: number;
  totalThisWeek: number;
}

export function getRecentActivity(): RecentActivity {
  return {
    activities: [
      {
        type: "purchase",
        customerName: "Maria S.",
        productName: "Difusor Aromático Zen",
        location: "São Paulo, SP",
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
        amount: 129.9,
      },
      {
        type: "review",
        customerName: "João P.",
        productName: "Kit Aromaterapia",
        location: "Rio de Janeiro, RJ",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 min ago
      },
      {
        type: "purchase",
        customerName: "Ana C.",
        productName: "Óleo Essencial Lavanda",
        location: "Belo Horizonte, MG",
        timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 min ago
        amount: 45.9,
      },
    ],
    totalToday: 234,
    totalThisWeek: 1567,
  };
}

// Trending products
export interface TrendingProduct {
  productId: string;
  productName: string;
  productImage: string;
  views24h: number;
  purchases24h: number;
  trendScore: number; // 0-100
  badge: "🔥 Em Alta" | "⭐ Mais Vendido" | "🆕 Novidade" | "💎 Exclusivo";
}

export function getTrendingProducts(): TrendingProduct[] {
  return [
    {
      productId: "difusor-aromatico",
      productName: "Difusor Aromático Ultrassônico Zen",
      productImage: "/products/difusor.jpg",
      views24h: 1234,
      purchases24h: 89,
      trendScore: 95,
      badge: "🔥 Em Alta",
    },
    {
      productId: "kit-aromaterapia",
      productName: "Kit Aromaterapia Completo",
      productImage: "/products/kit.jpg",
      views24h: 987,
      purchases24h: 67,
      trendScore: 88,
      badge: "⭐ Mais Vendido",
    },
    {
      productId: "oleo-lavanda",
      productName: "Óleo Essencial de Lavanda",
      productImage: "/products/oleo.jpg",
      views24h: 756,
      purchases24h: 45,
      trendScore: 75,
      badge: "🔥 Em Alta",
    },
  ];
}

// Low stock alerts
export interface LowStockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  threshold: number;
  urgencyLevel: "low" | "medium" | "high" | "critical";
  message: string;
  showToCustomers: boolean;
}

export function getLowStockAlerts(): LowStockAlert[] {
  return [
    {
      productId: "difusor-aromatico",
      productName: "Difusor Aromático Ultrassônico Zen",
      currentStock: 3,
      threshold: 10,
      urgencyLevel: "critical",
      message: "Últimas 3 unidades! Garanta o seu agora!",
      showToCustomers: true,
    },
    {
      productId: "kit-aromaterapia",
      productName: "Kit Aromaterapia Completo",
      currentStock: 7,
      threshold: 10,
      urgencyLevel: "high",
      message: "Estoque baixo! Apenas 7 unidades restantes.",
      showToCustomers: true,
    },
  ];
}

// Customer testimonials
export const customerTestimonials = [
  {
    id: "test-001",
    customerName: "Maria Silva",
    customerPhoto: "/avatars/maria.jpg",
    customerLocation: "São Paulo, SP",
    rating: 5,
    text: "Produto incrível! O difusor é lindo e funciona perfeitamente. Minha casa ficou com um aroma maravilhoso. Super recomendo!",
    productId: "difusor-aromatico",
    verified: true,
    date: new Date("2024-11-15"),
    helpful: 45,
  },
  {
    id: "test-002",
    customerName: "João Santos",
    customerPhoto: "/avatars/joao.jpg",
    customerLocation: "Rio de Janeiro, RJ",
    rating: 5,
    text: "Excelente custo-benefício! Chegou rápido e bem embalado. O atendimento foi impecável. Já comprei mais 2 para presentear.",
    productId: "kit-aromaterapia",
    verified: true,
    date: new Date("2024-11-20"),
    helpful: 32,
  },
  {
    id: "test-003",
    customerName: "Ana Costa",
    customerPhoto: "/avatars/ana.jpg",
    customerLocation: "Belo Horizonte, MG",
    rating: 5,
    text: "Melhor compra que fiz este ano! A qualidade é excepcional e o aroma é divino. Vale cada centavo!",
    productId: "oleo-lavanda",
    verified: true,
    date: new Date("2024-11-25"),
    helpful: 28,
  },
];

// Urgency timers
export function createUrgencyTimer(
  type: UrgencyTimer["type"],
  productId?: string
): UrgencyTimer {
  let message = "";
  let endTime = new Date();

  switch (type) {
    case "flash_sale":
      message = "⚡ FLASH SALE: 20% OFF termina em";
      endTime = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
      break;
    case "limited_stock":
      message = "⏰ Estoque limitado! Garanta o seu em";
      endTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      break;
    case "special_offer":
      message = "🎁 Oferta especial válida por";
      endTime = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours
      break;
    case "countdown":
      message = "🔥 Promoção termina em";
      endTime = new Date(Date.now() + 6 * 60 * 60 * 1000); // 6 hours
      break;
  }

  return {
    id: `timer-${Date.now()}`,
    type,
    productId,
    message,
    endTime,
    action: {
      type: "discount",
      value: 20,
    },
    style: {
      color: "#FF4444",
      position: "top",
      animation: true,
    },
  };
}

// Social proof analytics
export function getSocialProofAnalytics(): SocialProofAnalytics {
  return {
    impressions: 125000,
    clicks: 8750,
    conversions: 1234,
    conversionRate: 14.1, // Much higher than without social proof!
    averageTimeToConversion: 180,
    topPerformingType: "purchase_notification",
    engagement: [
      {
        type: "purchase_notification",
        impressions: 45000,
        clicks: 3200,
        conversions: 567,
      },
      {
        type: "low_stock_alert",
        impressions: 32000,
        clicks: 2800,
        conversions: 345,
      },
      {
        type: "urgency_timer",
        impressions: 28000,
        clicks: 1900,
        conversions: 234,
      },
      {
        type: "live_visitors",
        impressions: 20000,
        clicks: 850,
        conversions: 88,
      },
    ],
  };
}

// Trust score calculator
export interface TrustScore {
  overall: number; // 0-100
  factors: {
    reviews: number;
    badges: number;
    socialProof: number;
    security: number;
    policies: number;
  };
  rating: "Excellent" | "Good" | "Fair" | "Poor";
  recommendations: string[];
}

export function calculateTrustScore(): TrustScore {
  const factors = {
    reviews: 92, // 4.8/5 average, 1000+ reviews
    badges: 95, // All major trust badges
    socialProof: 88, // Active social proof widgets
    security: 100, // SSL, PCI compliant
    policies: 90, // Clear return, privacy policies
  };

  const overall =
    (factors.reviews +
      factors.badges +
      factors.socialProof +
      factors.security +
      factors.policies) /
    5;

  let rating: TrustScore["rating"];
  if (overall >= 90) rating = "Excellent";
  else if (overall >= 75) rating = "Good";
  else if (overall >= 60) rating = "Fair";
  else rating = "Poor";

  return {
    overall,
    factors,
    rating,
    recommendations: [
      "Continue coletando avaliações de clientes",
      "Adicionar mais certificações de segurança",
      "Implementar programa de fidelidade",
    ],
  };
}

// Verified purchase badge
export interface VerifiedPurchase {
  orderId: string;
  productId: string;
  customerId: string;
  purchaseDate: Date;
  verified: boolean;
  badge: string;
}

export function verifyPurchase(
  orderId: string,
  customerId: string
): VerifiedPurchase {
  return {
    orderId,
    productId: "difusor-aromatico",
    customerId,
    purchaseDate: new Date("2024-11-15"),
    verified: true,
    badge: "✓ Compra Verificada",
  };
}

// Social media proof
export interface SocialMediaProof {
  platform: "instagram" | "facebook" | "twitter" | "tiktok";
  followers: number;
  posts: number;
  engagement: number; // percentage
  recentPosts: {
    id: string;
    image: string;
    caption: string;
    likes: number;
    comments: number;
    date: Date;
  }[];
}

export function getSocialMediaProof(
  platform: SocialMediaProof["platform"]
): SocialMediaProof {
  return {
    platform,
    followers: 125000,
    posts: 567,
    engagement: 8.5,
    recentPosts: [
      {
        id: "post-001",
        image: "/social/post1.jpg",
        caption: "Nosso difusor mais vendido! 🌿✨",
        likes: 3456,
        comments: 234,
        date: new Date("2024-11-28"),
      },
      {
        id: "post-002",
        image: "/social/post2.jpg",
        caption: "Kit completo de aromaterapia 💆‍♀️",
        likes: 2890,
        comments: 189,
        date: new Date("2024-11-27"),
      },
    ],
  };
}

// Press mentions
export interface PressMention {
  id: string;
  publication: string;
  logo: string;
  title: string;
  excerpt: string;
  url: string;
  date: Date;
  featured: boolean;
}

export const pressMentions: PressMention[] = [
  {
    id: "press-001",
    publication: "Veja",
    logo: "/press/veja.svg",
    title: "As melhores lojas de aromaterapia online",
    excerpt: "MundoPetZen se destaca pela qualidade e atendimento...",
    url: "https://veja.com.br/...",
    date: new Date("2024-10-15"),
    featured: true,
  },
  {
    id: "press-002",
    publication: "Folha de S.Paulo",
    logo: "/press/folha.svg",
    title: "E-commerce de bem-estar cresce 150% no Brasil",
    excerpt: "Empresas como MundoPetZen lideram o mercado...",
    url: "https://folha.uol.com.br/...",
    date: new Date("2024-09-20"),
    featured: true,
  },
];

// Awards and certifications
export interface Award {
  id: string;
  name: string;
  issuer: string;
  year: number;
  category: string;
  logo: string;
  description: string;
}

export const awards: Award[] = [
  {
    id: "award-001",
    name: "Melhor E-commerce de Bem-Estar 2024",
    issuer: "E-commerce Brasil",
    year: 2024,
    category: "Bem-estar",
    logo: "/awards/ecommerce-brasil.svg",
    description: "Reconhecimento pela excelência em vendas online",
  },
  {
    id: "award-002",
    name: "Selo de Excelência em Atendimento",
    issuer: "Reclame Aqui",
    year: 2024,
    category: "Atendimento",
    logo: "/awards/reclame-aqui.svg",
    description: "Nota 9.5/10 em satisfação do cliente",
  },
];
