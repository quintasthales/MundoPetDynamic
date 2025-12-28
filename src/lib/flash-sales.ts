// Flash Sales and Limited-Time Offers System

export interface FlashSale {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: "scheduled" | "active" | "ended";
  products: {
    productId: string;
    productName: string;
    originalPrice: number;
    salePrice: number;
    discount: number;
    stock: number;
    soldCount: number;
    limit?: number; // Max quantity per customer
  }[];
  banner?: string;
  badge?: string;
  priority: number;
  createdAt: Date;
}

export interface DailyDeal {
  id: string;
  date: Date;
  productId: string;
  productName: string;
  originalPrice: number;
  dealPrice: number;
  discount: number;
  stock: number;
  soldCount: number;
  endsAt: Date;
  featured: boolean;
}

export interface LightningDeal {
  id: string;
  productId: string;
  productName: string;
  originalPrice: number;
  dealPrice: number;
  discount: number;
  totalStock: number;
  soldCount: number;
  startTime: Date;
  endTime: Date;
  status: "upcoming" | "active" | "sold_out" | "ended";
  claimedBy: string[]; // User IDs who added to cart
  purchasedBy: string[]; // User IDs who completed purchase
}

export interface CountdownOffer {
  id: string;
  type: "product" | "category" | "sitewide";
  targetId?: string; // Product ID or category ID
  name: string;
  description: string;
  discount: {
    type: "percentage" | "fixed";
    value: number;
  };
  startDate: Date;
  endDate: Date;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  code?: string;
}

// Active flash sales
export const flashSales: FlashSale[] = [
  {
    id: "flash-001",
    name: "Super Flash Sale Pet",
    description: "Descontos de até 70% em produtos selecionados por 24 horas!",
    startDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
    endDate: new Date(Date.now() + 22 * 60 * 60 * 1000), // Ends in 22 hours
    status: "active",
    products: [
      {
        productId: "difusor-aromatico",
        productName: "Difusor Aromático Ultrassônico Zen",
        originalPrice: 129.9,
        salePrice: 77.94,
        discount: 40,
        stock: 50,
        soldCount: 23,
        limit: 2,
      },
      {
        productId: "coleira-led",
        productName: "Coleira LED Recarregável",
        originalPrice: 49.9,
        salePrice: 29.94,
        discount: 40,
        stock: 100,
        soldCount: 67,
        limit: 3,
      },
      {
        productId: "shampoo-natural",
        productName: "Shampoo Natural Pet Care",
        originalPrice: 34.9,
        salePrice: 20.94,
        discount: 40,
        stock: 200,
        soldCount: 145,
        limit: 5,
      },
    ],
    banner: "/flash-sales/super-flash-banner.jpg",
    badge: "FLASH SALE",
    priority: 1,
    createdAt: new Date("2024-12-28"),
  },
];

// Daily deals
export const dailyDeals: DailyDeal[] = [
  {
    id: "daily-001",
    date: new Date(),
    productId: "cama-ortopedica",
    productName: "Cama Ortopédica Premium",
    originalPrice: 199.9,
    dealPrice: 99.95,
    discount: 50,
    stock: 30,
    soldCount: 18,
    endsAt: new Date(new Date().setHours(23, 59, 59, 999)),
    featured: true,
  },
];

// Lightning deals
export const lightningDeals: LightningDeal[] = [
  {
    id: "lightning-001",
    productId: "kit-brinquedos",
    productName: "Kit Brinquedos Interativos",
    originalPrice: 79.9,
    dealPrice: 39.95,
    discount: 50,
    totalStock: 20,
    soldCount: 12,
    startTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 min ago
    endTime: new Date(Date.now() + 30 * 60 * 1000), // Ends in 30 min
    status: "active",
    claimedBy: [],
    purchasedBy: [],
  },
];

// Countdown offers
export const countdownOffers: CountdownOffer[] = [
  {
    id: "countdown-001",
    type: "sitewide",
    name: "Mega Oferta de Fim de Ano",
    description: "30% de desconto em todo o site por tempo limitado!",
    discount: {
      type: "percentage",
      value: 30,
    },
    startDate: new Date("2024-12-28"),
    endDate: new Date("2024-12-31T23:59:59"),
    minPurchase: 100,
    maxDiscount: 200,
    usedCount: 567,
    code: "NEWYEAR30",
  },
  {
    id: "countdown-002",
    type: "category",
    targetId: "higiene-beleza",
    name: "Flash Higiene e Beleza",
    description: "50% OFF em produtos de higiene e beleza!",
    discount: {
      type: "percentage",
      value: 50,
    },
    startDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 5 * 60 * 60 * 1000),
    usedCount: 234,
  },
];

// Get active flash sales
export function getActiveFlashSales(): FlashSale[] {
  const now = Date.now();
  return flashSales.filter(
    (sale) =>
      sale.status === "active" &&
      sale.startDate.getTime() <= now &&
      sale.endDate.getTime() > now
  );
}

// Get flash sale by ID
export function getFlashSale(saleId: string): FlashSale | undefined {
  return flashSales.find((s) => s.id === saleId);
}

// Check if product is in flash sale
export function getProductFlashSale(productId: string): {
  sale: FlashSale;
  product: FlashSale["products"][0];
} | null {
  const activeSales = getActiveFlashSales();

  for (const sale of activeSales) {
    const product = sale.products.find((p) => p.productId === productId);
    if (product) {
      return { sale, product };
    }
  }

  return null;
}

// Get today's daily deal
export function getTodayDailyDeal(): DailyDeal | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const deal = dailyDeals.find((d) => {
    const dealDate = new Date(d.date);
    dealDate.setHours(0, 0, 0, 0);
    return dealDate.getTime() === today.getTime();
  });

  return deal || null;
}

// Get active lightning deals
export function getActiveLightningDeals(): LightningDeal[] {
  const now = Date.now();
  return lightningDeals.filter(
    (deal) =>
      deal.status === "active" &&
      deal.startTime.getTime() <= now &&
      deal.endTime.getTime() > now &&
      deal.soldCount < deal.totalStock
  );
}

// Get upcoming lightning deals
export function getUpcomingLightningDeals(): LightningDeal[] {
  const now = Date.now();
  return lightningDeals.filter(
    (deal) => deal.status === "upcoming" && deal.startTime.getTime() > now
  );
}

// Claim lightning deal (add to cart)
export function claimLightningDeal(
  dealId: string,
  userId: string
): { success: boolean; error?: string } {
  const deal = lightningDeals.find((d) => d.id === dealId);

  if (!deal) {
    return { success: false, error: "Deal not found" };
  }

  if (deal.status !== "active") {
    return { success: false, error: "Deal is not active" };
  }

  if (deal.soldCount >= deal.totalStock) {
    deal.status = "sold_out";
    return { success: false, error: "Deal sold out" };
  }

  if (deal.claimedBy.includes(userId)) {
    return { success: false, error: "Already claimed" };
  }

  // Reserve for 10 minutes
  deal.claimedBy.push(userId);

  // In production, set timeout to release if not purchased
  setTimeout(() => {
    const index = deal.claimedBy.indexOf(userId);
    if (index > -1 && !deal.purchasedBy.includes(userId)) {
      deal.claimedBy.splice(index, 1);
    }
  }, 10 * 60 * 1000);

  return { success: true };
}

// Complete lightning deal purchase
export function completeLightningDealPurchase(
  dealId: string,
  userId: string
): boolean {
  const deal = lightningDeals.find((d) => d.id === dealId);

  if (!deal || !deal.claimedBy.includes(userId)) {
    return false;
  }

  deal.purchasedBy.push(userId);
  deal.soldCount++;

  if (deal.soldCount >= deal.totalStock) {
    deal.status = "sold_out";
  }

  return true;
}

// Get active countdown offers
export function getActiveCountdownOffers(
  type?: CountdownOffer["type"],
  targetId?: string
): CountdownOffer[] {
  const now = Date.now();

  return countdownOffers.filter((offer) => {
    const isActive =
      offer.startDate.getTime() <= now && offer.endDate.getTime() > now;

    if (!isActive) return false;

    if (type && offer.type !== type) return false;

    if (targetId && offer.targetId !== targetId) return false;

    if (offer.usageLimit && offer.usedCount >= offer.usageLimit) return false;

    return true;
  });
}

// Apply countdown offer
export function applyCountdownOffer(
  offerId: string,
  orderAmount: number
): { discount: number; finalAmount: number } | null {
  const offer = countdownOffers.find((o) => o.id === offerId);

  if (!offer) return null;

  const now = Date.now();
  if (
    offer.startDate.getTime() > now ||
    offer.endDate.getTime() < now
  ) {
    return null;
  }

  if (offer.minPurchase && orderAmount < offer.minPurchase) {
    return null;
  }

  let discount = 0;

  if (offer.discount.type === "percentage") {
    discount = (orderAmount * offer.discount.value) / 100;
  } else {
    discount = offer.discount.value;
  }

  if (offer.maxDiscount && discount > offer.maxDiscount) {
    discount = offer.maxDiscount;
  }

  const finalAmount = Math.max(0, orderAmount - discount);

  return { discount, finalAmount };
}

// Create flash sale
export function createFlashSale(data: {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  products: FlashSale["products"];
  banner?: string;
}): FlashSale {
  const flashSale: FlashSale = {
    id: `flash-${Date.now()}`,
    name: data.name,
    description: data.description,
    startDate: data.startDate,
    endDate: data.endDate,
    status: "scheduled",
    products: data.products,
    banner: data.banner,
    badge: "FLASH SALE",
    priority: 1,
    createdAt: new Date(),
  };

  // In production, save to database
  flashSales.push(flashSale);

  return flashSale;
}

// Flash sale analytics
export interface FlashSaleAnalytics {
  saleId: string;
  saleName: string;
  totalRevenue: number;
  totalOrders: number;
  totalItemsSold: number;
  conversionRate: number;
  averageOrderValue: number;
  topProducts: {
    productId: string;
    productName: string;
    soldCount: number;
    revenue: number;
  }[];
  hourlyBreakdown: {
    hour: number;
    orders: number;
    revenue: number;
  }[];
  status: FlashSale["status"];
  timeRemaining?: number; // milliseconds
}

export function getFlashSaleAnalytics(
  saleId: string
): FlashSaleAnalytics | null {
  const sale = getFlashSale(saleId);
  if (!sale) return null;

  const totalItemsSold = sale.products.reduce((sum, p) => sum + p.soldCount, 0);
  const totalRevenue = sale.products.reduce(
    (sum, p) => sum + p.salePrice * p.soldCount,
    0
  );

  const timeRemaining =
    sale.status === "active"
      ? Math.max(0, sale.endDate.getTime() - Date.now())
      : undefined;

  return {
    saleId: sale.id,
    saleName: sale.name,
    totalRevenue,
    totalOrders: totalItemsSold, // Simplified
    totalItemsSold,
    conversionRate: 12.5, // Mock
    averageOrderValue: totalRevenue / Math.max(1, totalItemsSold),
    topProducts: sale.products
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 5)
      .map((p) => ({
        productId: p.productId,
        productName: p.productName,
        soldCount: p.soldCount,
        revenue: p.salePrice * p.soldCount,
      })),
    hourlyBreakdown: [], // Mock
    status: sale.status,
    timeRemaining,
  };
}

// Notify users about flash sales
export interface FlashSaleNotification {
  userId: string;
  saleId: string;
  type: "email" | "sms" | "push";
  sentAt: Date;
  opened?: boolean;
  clicked?: boolean;
}

export function notifyUsersAboutFlashSale(
  saleId: string,
  userIds: string[]
): number {
  // In production, send notifications via email/SMS/push
  return userIds.length;
}

// Schedule flash sale notifications
export function scheduleFlashSaleNotifications(
  saleId: string,
  notifyBefore: number // minutes before start
): boolean {
  // In production, schedule notifications
  return true;
}

// Price drop alerts
export interface PriceDropAlert {
  id: string;
  userId: string;
  productId: string;
  targetPrice: number;
  currentPrice: number;
  notified: boolean;
  createdAt: Date;
}

export function createPriceDropAlert(
  userId: string,
  productId: string,
  targetPrice: number,
  currentPrice: number
): PriceDropAlert {
  const alert: PriceDropAlert = {
    id: `alert-${Date.now()}`,
    userId,
    productId,
    targetPrice,
    currentPrice,
    notified: false,
    createdAt: new Date(),
  };

  // In production, save to database
  return alert;
}

export function checkPriceDropAlerts(
  productId: string,
  newPrice: number
): PriceDropAlert[] {
  // In production, query database for alerts where targetPrice >= newPrice
  // and send notifications
  return [];
}

// Bundle deals
export interface BundleDeal {
  id: string;
  name: string;
  description: string;
  products: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  discount: number;
  stock: number;
  startDate: Date;
  endDate: Date;
  image: string;
}

export const bundleDeals: BundleDeal[] = [
  {
    id: "bundle-001",
    name: "Kit Completo Pet Care",
    description:
      "Tudo que seu pet precisa em um único kit com super desconto!",
    products: [
      {
        productId: "shampoo-natural",
        productName: "Shampoo Natural",
        quantity: 2,
      },
      {
        productId: "escova-massageadora",
        productName: "Escova Massageadora",
        quantity: 1,
      },
      {
        productId: "toalha-microfibra",
        productName: "Toalha Microfibra",
        quantity: 2,
      },
    ],
    originalPrice: 189.7,
    bundlePrice: 129.9,
    savings: 59.8,
    discount: 32,
    stock: 50,
    startDate: new Date("2024-12-28"),
    endDate: new Date("2024-12-31T23:59:59"),
    image: "/bundles/pet-care-kit.jpg",
  },
];

export function getBundleDeals(): BundleDeal[] {
  const now = Date.now();
  return bundleDeals.filter(
    (bundle) =>
      bundle.startDate.getTime() <= now &&
      bundle.endDate.getTime() > now &&
      bundle.stock > 0
  );
}

// BOGO (Buy One Get One) deals
export interface BOGODeal {
  id: string;
  name: string;
  type: "bogo_free" | "bogo_50" | "buy_x_get_y";
  productIds: string[];
  buyQuantity: number;
  getQuantity: number;
  getDiscount: number; // 0-100%
  startDate: Date;
  endDate: Date;
  maxUses?: number;
  usedCount: number;
}

export const bogodeals: BOGODeal[] = [
  {
    id: "bogo-001",
    name: "Compre 2 Leve 3",
    type: "buy_x_get_y",
    productIds: ["petiscos-naturais"],
    buyQuantity: 2,
    getQuantity: 1,
    getDiscount: 100,
    startDate: new Date("2024-12-28"),
    endDate: new Date("2024-12-31T23:59:59"),
    usedCount: 89,
  },
];

export function getBOGODeals(): BOGODeal[] {
  const now = Date.now();
  return bogodeals.filter(
    (deal) =>
      deal.startDate.getTime() <= now &&
      deal.endDate.getTime() > now &&
      (!deal.maxUses || deal.usedCount < deal.maxUses)
  );
}

export function applyBOGODeal(
  dealId: string,
  cartItems: { productId: string; quantity: number }[]
): { discount: number; freeItems: number } | null {
  const deal = bogodeals.find((d) => d.id === dealId);
  if (!deal) return null;

  const eligibleItems = cartItems.filter((item) =>
    deal.productIds.includes(item.productId)
  );

  const totalQuantity = eligibleItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const sets = Math.floor(totalQuantity / deal.buyQuantity);
  const freeItems = sets * deal.getQuantity;

  // In production, calculate actual discount based on product prices
  return {
    discount: 0, // Calculate based on product price
    freeItems,
  };
}
