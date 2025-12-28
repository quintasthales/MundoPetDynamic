// Social Commerce Features (Instagram Shopping, Live Shopping, Social Selling)

export interface InstagramPost {
  id: string;
  instagramId: string;
  caption: string;
  imageUrl: string;
  permalink: string;
  timestamp: Date;
  likes: number;
  comments: number;
  taggedProducts: {
    productId: string;
    productName: string;
    price: number;
    position: { x: number; y: number }; // Position on image (0-100%)
  }[];
  shoppable: boolean;
}

export interface LiveShoppingEvent {
  id: string;
  title: string;
  description: string;
  hostName: string;
  hostImage: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  status: "scheduled" | "live" | "ended" | "cancelled";
  platform: "instagram" | "facebook" | "youtube" | "tiktok" | "custom";
  streamUrl?: string;
  chatEnabled: boolean;
  featuredProducts: {
    productId: string;
    productName: string;
    price: number;
    specialPrice?: number;
    stock: number;
    image: string;
  }[];
  viewers: {
    current: number;
    peak: number;
    total: number;
  };
  sales: {
    orders: number;
    revenue: number;
  };
  thumbnail: string;
  recordingUrl?: string;
}

export interface SocialProof {
  type:
    | "recent_purchase"
    | "trending"
    | "low_stock"
    | "popular"
    | "social_share";
  productId?: string;
  message: string;
  timestamp: Date;
  location?: string;
  count?: number;
  urgency: "low" | "medium" | "high";
}

export interface UserGeneratedContent {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  type: "photo" | "video" | "review";
  content: string;
  mediaUrl?: string;
  productId: string;
  productName: string;
  rating?: number;
  likes: number;
  approved: boolean;
  featured: boolean;
  source: "instagram" | "facebook" | "tiktok" | "upload";
  sourceUrl?: string;
  createdAt: Date;
  approvedAt?: Date;
}

export interface SocialReferral {
  id: string;
  userId: string;
  platform: "facebook" | "instagram" | "twitter" | "whatsapp" | "telegram";
  productId?: string;
  clicks: number;
  conversions: number;
  revenue: number;
  commission: number;
  createdAt: Date;
}

export interface InfluencerCampaign {
  id: string;
  influencerId: string;
  influencerName: string;
  influencerHandle: string;
  platform: "instagram" | "youtube" | "tiktok" | "twitter";
  followers: number;
  campaignType: "sponsored_post" | "affiliate" | "ambassador" | "collaboration";
  products: string[];
  startDate: Date;
  endDate: Date;
  compensation: {
    type: "fixed" | "commission" | "product" | "hybrid";
    amount?: number;
    commissionRate?: number;
  };
  metrics: {
    posts: number;
    reach: number;
    engagement: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  status: "pending" | "active" | "completed" | "cancelled";
  uniqueCode: string;
}

// Instagram Shopping Integration
export const instagramPosts: InstagramPost[] = [
  {
    id: "ig-001",
    instagramId: "18234567890",
    caption:
      "🐾 Novo difusor aromático para deixar seu lar ainda mais aconchegante para você e seu pet! ✨ #PetCare #HomeDecor",
    imageUrl: "/social/instagram-post-1.jpg",
    permalink: "https://www.instagram.com/p/ABC123",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    likes: 1234,
    comments: 89,
    taggedProducts: [
      {
        productId: "difusor-aromatico",
        productName: "Difusor Aromático Ultrassônico Zen",
        price: 129.9,
        position: { x: 50, y: 60 },
      },
    ],
    shoppable: true,
  },
  {
    id: "ig-002",
    instagramId: "18234567891",
    caption:
      "🌟 Coleira LED para passeios noturnos seguros! Seu pet sempre visível e estiloso 🐕 #PetSafety #NightWalk",
    imageUrl: "/social/instagram-post-2.jpg",
    permalink: "https://www.instagram.com/p/ABC124",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    likes: 2345,
    comments: 156,
    taggedProducts: [
      {
        productId: "coleira-led",
        productName: "Coleira LED Recarregável",
        price: 49.9,
        position: { x: 45, y: 55 },
      },
    ],
    shoppable: true,
  },
];

export function getInstagramPosts(limit: number = 10): InstagramPost[] {
  return instagramPosts.slice(0, limit);
}

export function getShoppableInstagramPosts(): InstagramPost[] {
  return instagramPosts.filter((post) => post.shoppable);
}

// Live Shopping Events
export const liveShoppingEvents: LiveShoppingEvent[] = [
  {
    id: "live-001",
    title: "Super Live Pet Show - Descontos Exclusivos!",
    description:
      "Participe da nossa live com ofertas imperdíveis e tire suas dúvidas ao vivo!",
    hostName: "Ana Silva",
    hostImage: "/hosts/ana-silva.jpg",
    scheduledStart: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    scheduledEnd: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
    status: "scheduled",
    platform: "instagram",
    chatEnabled: true,
    featuredProducts: [
      {
        productId: "difusor-aromatico",
        productName: "Difusor Aromático",
        price: 129.9,
        specialPrice: 89.9,
        stock: 50,
        image: "/products/difusor.jpg",
      },
      {
        productId: "coleira-led",
        productName: "Coleira LED",
        price: 49.9,
        specialPrice: 34.9,
        stock: 100,
        image: "/products/coleira.jpg",
      },
    ],
    viewers: {
      current: 0,
      peak: 0,
      total: 0,
    },
    sales: {
      orders: 0,
      revenue: 0,
    },
    thumbnail: "/live/live-001-thumb.jpg",
  },
];

export function getUpcomingLiveEvents(): LiveShoppingEvent[] {
  return liveShoppingEvents.filter((event) => event.status === "scheduled");
}

export function getLiveEvent(): LiveShoppingEvent | null {
  return liveShoppingEvents.find((event) => event.status === "live") || null;
}

export function getPastLiveEvents(): LiveShoppingEvent[] {
  return liveShoppingEvents.filter((event) => event.status === "ended");
}

export function startLiveEvent(eventId: string): boolean {
  const event = liveShoppingEvents.find((e) => e.id === eventId);
  if (!event || event.status !== "scheduled") return false;

  event.status = "live";
  event.actualStart = new Date();

  // In production, start streaming and notify subscribers
  return true;
}

export function endLiveEvent(eventId: string): boolean {
  const event = liveShoppingEvents.find((e) => e.id === eventId);
  if (!event || event.status !== "live") return false;

  event.status = "ended";
  event.actualEnd = new Date();

  // In production, stop streaming and save recording
  return true;
}

// Social Proof Notifications
export function generateSocialProof(): SocialProof[] {
  const proofs: SocialProof[] = [
    {
      type: "recent_purchase",
      productId: "difusor-aromatico",
      message: "Maria de São Paulo comprou há 5 minutos",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      location: "São Paulo, SP",
      urgency: "medium",
    },
    {
      type: "trending",
      productId: "coleira-led",
      message: "🔥 Produto em alta! 23 pessoas visualizando agora",
      timestamp: new Date(),
      count: 23,
      urgency: "high",
    },
    {
      type: "low_stock",
      productId: "shampoo-natural",
      message: "⚠️ Apenas 5 unidades restantes!",
      timestamp: new Date(),
      count: 5,
      urgency: "high",
    },
    {
      type: "popular",
      productId: "kit-brinquedos",
      message: "⭐ Mais de 500 vendas este mês",
      timestamp: new Date(),
      count: 500,
      urgency: "low",
    },
  ];

  return proofs;
}

// User Generated Content
export const userGeneratedContent: UserGeneratedContent[] = [
  {
    id: "ugc-001",
    userId: "user-123",
    userName: "João Silva",
    userImage: "/users/joao.jpg",
    type: "photo",
    content: "Meu cachorro amou o difusor! Agora ele fica mais calmo em casa 🐕💙",
    mediaUrl: "/ugc/photo-001.jpg",
    productId: "difusor-aromatico",
    productName: "Difusor Aromático",
    rating: 5,
    likes: 234,
    approved: true,
    featured: true,
    source: "instagram",
    sourceUrl: "https://www.instagram.com/p/XYZ789",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

export function getUGCForProduct(productId: string): UserGeneratedContent[] {
  return userGeneratedContent.filter(
    (ugc) => ugc.productId === productId && ugc.approved
  );
}

export function getFeaturedUGC(): UserGeneratedContent[] {
  return userGeneratedContent.filter((ugc) => ugc.featured && ugc.approved);
}

export function submitUGC(data: {
  userId: string;
  userName: string;
  type: UserGeneratedContent["type"];
  content: string;
  mediaUrl?: string;
  productId: string;
  rating?: number;
  source: UserGeneratedContent["source"];
}): UserGeneratedContent {
  const ugc: UserGeneratedContent = {
    id: `ugc-${Date.now()}`,
    userId: data.userId,
    userName: data.userName,
    type: data.type,
    content: data.content,
    mediaUrl: data.mediaUrl,
    productId: data.productId,
    productName: "", // Fetch from products
    rating: data.rating,
    likes: 0,
    approved: false,
    featured: false,
    source: data.source,
    createdAt: new Date(),
  };

  // In production, save to database and notify moderators
  userGeneratedContent.push(ugc);

  return ugc;
}

export function approveUGC(ugcId: string, featured: boolean = false): boolean {
  const ugc = userGeneratedContent.find((u) => u.id === ugcId);
  if (!ugc) return false;

  ugc.approved = true;
  ugc.featured = featured;
  ugc.approvedAt = new Date();

  // In production, update database and notify user
  return true;
}

// Social Sharing
export function generateSocialShareLink(
  productId: string,
  userId: string,
  platform: SocialReferral["platform"]
): string {
  const baseUrl = "https://mundopetzen.com.br";
  const productUrl = `${baseUrl}/produto/${productId}`;
  const referralCode = `${userId}-${platform}`;

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      productUrl
    )}&ref=${referralCode}`,
    instagram: productUrl, // Instagram doesn't support direct sharing URLs
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      productUrl
    )}&ref=${referralCode}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      `Olha que legal! ${productUrl}?ref=${referralCode}`
    )}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      productUrl
    )}&ref=${referralCode}`,
  };

  return shareUrls[platform];
}

export function trackSocialShare(
  userId: string,
  platform: SocialReferral["platform"],
  productId?: string
): SocialReferral {
  const referral: SocialReferral = {
    id: `ref-${Date.now()}`,
    userId,
    platform,
    productId,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    commission: 0,
    createdAt: new Date(),
  };

  // In production, save to database
  return referral;
}

// Influencer Campaigns
export const influencerCampaigns: InfluencerCampaign[] = [
  {
    id: "inf-001",
    influencerId: "influencer-123",
    influencerName: "Pet Influencer Brasil",
    influencerHandle: "@petinfluencerbr",
    platform: "instagram",
    followers: 250000,
    campaignType: "sponsored_post",
    products: ["difusor-aromatico", "coleira-led"],
    startDate: new Date("2024-12-01"),
    endDate: new Date("2024-12-31"),
    compensation: {
      type: "hybrid",
      amount: 2000,
      commissionRate: 10,
    },
    metrics: {
      posts: 4,
      reach: 180000,
      engagement: 12500,
      clicks: 3456,
      conversions: 234,
      revenue: 28765.4,
    },
    status: "active",
    uniqueCode: "PETINFLUENCER10",
  },
];

export function getActiveInfluencerCampaigns(): InfluencerCampaign[] {
  return influencerCampaigns.filter((c) => c.status === "active");
}

export function trackInfluencerSale(
  code: string,
  orderAmount: number
): boolean {
  const campaign = influencerCampaigns.find((c) => c.uniqueCode === code);
  if (!campaign) return false;

  campaign.metrics.conversions++;
  campaign.metrics.revenue += orderAmount;

  // In production, update database and calculate commission
  return true;
}

// Social Commerce Analytics
export interface SocialCommerceAnalytics {
  instagram: {
    posts: number;
    shoppablePosts: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
  liveEvents: {
    total: number;
    totalViewers: number;
    averageViewers: number;
    orders: number;
    revenue: number;
    conversionRate: number;
  };
  ugc: {
    total: number;
    approved: number;
    featured: number;
    averageLikes: number;
    conversions: number;
  };
  influencers: {
    activeCampaigns: number;
    totalReach: number;
    totalEngagement: number;
    conversions: number;
    revenue: number;
    roi: number;
  };
  socialSharing: {
    shares: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
}

export function getSocialCommerceAnalytics(): SocialCommerceAnalytics {
  // Mock data - in production, calculate from database
  return {
    instagram: {
      posts: instagramPosts.length,
      shoppablePosts: instagramPosts.filter((p) => p.shoppable).length,
      clicks: 5678,
      conversions: 234,
      revenue: 28765.4,
    },
    liveEvents: {
      total: liveShoppingEvents.length,
      totalViewers: 12345,
      averageViewers: 456,
      orders: 189,
      revenue: 23456.7,
      conversionRate: 1.53,
    },
    ugc: {
      total: userGeneratedContent.length,
      approved: userGeneratedContent.filter((u) => u.approved).length,
      featured: userGeneratedContent.filter((u) => u.featured).length,
      averageLikes: 234,
      conversions: 89,
    },
    influencers: {
      activeCampaigns: influencerCampaigns.filter((c) => c.status === "active")
        .length,
      totalReach: influencerCampaigns.reduce((sum, c) => sum + c.metrics.reach, 0),
      totalEngagement: influencerCampaigns.reduce(
        (sum, c) => sum + c.metrics.engagement,
        0
      ),
      conversions: influencerCampaigns.reduce(
        (sum, c) => sum + c.metrics.conversions,
        0
      ),
      revenue: influencerCampaigns.reduce(
        (sum, c) => sum + c.metrics.revenue,
        0
      ),
      roi: 14.4, // Calculate based on compensation vs revenue
    },
    socialSharing: {
      shares: 1234,
      clicks: 3456,
      conversions: 156,
      revenue: 19876.5,
    },
  };
}

// Shoppable Video
export interface ShoppableVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: number; // seconds
  views: number;
  products: {
    productId: string;
    productName: string;
    price: number;
    timestamp: number; // When product appears in video (seconds)
  }[];
  createdAt: Date;
}

export const shoppableVideos: ShoppableVideo[] = [
  {
    id: "video-001",
    title: "Como usar o Difusor Aromático",
    description: "Tutorial completo de como usar e aproveitar ao máximo seu difusor",
    videoUrl: "/videos/difusor-tutorial.mp4",
    thumbnail: "/videos/difusor-thumb.jpg",
    duration: 180,
    views: 5678,
    products: [
      {
        productId: "difusor-aromatico",
        productName: "Difusor Aromático",
        price: 129.9,
        timestamp: 30,
      },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
];

export function getShoppableVideos(): ShoppableVideo[] {
  return shoppableVideos;
}

// Social Login Integration
export interface SocialLoginProvider {
  provider: "facebook" | "google" | "instagram" | "apple";
  enabled: boolean;
  clientId: string;
  scope: string[];
}

export const socialLoginProviders: SocialLoginProvider[] = [
  {
    provider: "facebook",
    enabled: true,
    clientId: process.env.FACEBOOK_CLIENT_ID || "",
    scope: ["email", "public_profile"],
  },
  {
    provider: "google",
    enabled: true,
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    scope: ["email", "profile"],
  },
];

// Hashtag campaigns
export interface HashtagCampaign {
  id: string;
  hashtag: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  prize?: string;
  posts: number;
  reach: number;
  engagement: number;
  status: "active" | "ended";
}

export const hashtagCampaigns: HashtagCampaign[] = [
  {
    id: "hashtag-001",
    hashtag: "#MeuPetZen",
    name: "Campanha Meu Pet Zen",
    description:
      "Compartilhe fotos do seu pet usando nossos produtos com #MeuPetZen",
    startDate: new Date("2024-12-01"),
    endDate: new Date("2024-12-31"),
    prize: "Kit Premium Pet Care",
    posts: 456,
    reach: 125000,
    engagement: 8900,
    status: "active",
  },
];

export function getActiveHashtagCampaigns(): HashtagCampaign[] {
  return hashtagCampaigns.filter((c) => c.status === "active");
}
