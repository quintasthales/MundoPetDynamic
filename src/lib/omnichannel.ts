// Omnichannel Commerce System

export interface OmnichannelConfig {
  channels: {
    id: string;
    name: string;
    type: "online" | "offline" | "mobile" | "social" | "marketplace";
    enabled: boolean;
    integration: {
      provider: string;
      apiKey?: string;
      webhookUrl?: string;
    };
  }[];
  inventory: {
    unified: boolean; // single inventory across all channels
    realTimeSync: boolean;
    reservationTime: number; // minutes
  };
  pricing: {
    unified: boolean; // same prices across all channels
    channelSpecific: {
      channelId: string;
      priceAdjustment: number; // percentage
    }[];
  };
  fulfillment: {
    buyOnlinePickupInStore: boolean; // BOPIS
    shipFromStore: boolean;
    curbsidePickup: boolean;
    sameDay Delivery: boolean;
  };
}

export interface Channel {
  id: string;
  name: string;
  type: "website" | "mobile_app" | "physical_store" | "instagram" | "facebook" | "whatsapp" | "marketplace";
  status: "active" | "inactive" | "maintenance";
  metrics: {
    orders: number;
    revenue: number;
    customers: number;
    conversionRate: number; // percentage
    averageOrderValue: number;
  };
  integration: {
    connected: boolean;
    lastSync: Date;
    syncStatus: "success" | "error" | "pending";
  };
}

export interface UnifiedInventory {
  productId: string;
  totalStock: number;
  allocated: number; // reserved for orders
  available: number; // available to sell
  locations: {
    locationId: string;
    locationType: "warehouse" | "store" | "supplier";
    locationName: string;
    stock: number;
    reserved: number;
    available: number;
  }[];
  channels: {
    channelId: string;
    channelName: string;
    allocated: number;
    available: number;
  }[];
  lowStockThreshold: number;
  alerts: {
    type: "low_stock" | "out_of_stock" | "overstock";
    severity: "critical" | "warning" | "info";
    message: string;
  }[];
}

export interface OmnichannelOrder {
  id: string;
  customerId: string;
  channel: {
    id: string;
    name: string;
    type: string;
  };
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    fulfillmentLocation?: string;
  }[];
  fulfillment: {
    type: "ship_to_home" | "pickup_in_store" | "curbside_pickup" | "ship_from_store";
    location?: {
      id: string;
      name: string;
      address: string;
    };
    estimatedDate: Date;
    status: "pending" | "ready" | "picked_up" | "delivered";
  };
  payment: {
    method: string;
    channel: string;
    status: "pending" | "authorized" | "captured" | "refunded";
  };
  total: number;
  createdAt: Date;
}

export interface CustomerUnifiedProfile {
  id: string;
  channels: {
    channelId: string;
    channelName: string;
    customerId: string; // channel-specific ID
    joinedAt: Date;
    lastActivity: Date;
    orders: number;
    spent: number;
  }[];
  preferences: {
    preferredChannel: string;
    preferredFulfillment: string;
    preferredPayment: string;
    communicationPreferences: {
      channel: string;
      enabled: boolean;
    }[];
  };
  unifiedMetrics: {
    totalOrders: number;
    totalSpent: number;
    lifetimeValue: number;
    averageOrderValue: number;
    favoriteProducts: string[];
    favoriteCategories: string[];
  };
}

export interface StoreLocator {
  stores: {
    id: string;
    name: string;
    type: "flagship" | "standard" | "outlet" | "popup";
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      coordinates: { lat: number; lng: number };
    };
    contact: {
      phone: string;
      email: string;
    };
    hours: {
      day: string;
      open: string;
      close: string;
    }[];
    services: string[]; // e.g., ["BOPIS", "Returns", "Grooming"]
    inventory: {
      productId: string;
      stock: number;
      available: boolean;
    }[];
    distance?: number; // km from customer
  }[];
}

export interface SocialCommerce {
  platforms: {
    platform: "instagram" | "facebook" | "tiktok" | "pinterest" | "whatsapp";
    enabled: boolean;
    shopEnabled: boolean;
    liveShoppingEnabled: boolean;
    metrics: {
      followers: number;
      engagement: number; // percentage
      orders: number;
      revenue: number;
    };
    integration: {
      connected: boolean;
      accountId: string;
      catalogSynced: boolean;
      lastSync: Date;
    };
  }[];
  shoppablePosts: {
    id: string;
    platform: string;
    postId: string;
    products: { productId: string; tags: number }[];
    views: number;
    clicks: number;
    orders: number;
    revenue: number;
    conversionRate: number; // percentage
  }[];
  liveShoppingEvents: {
    id: string;
    platform: string;
    title: string;
    scheduledAt: Date;
    duration: number; // minutes
    products: string[];
    viewers: number;
    orders: number;
    revenue: number;
  }[];
}

export interface MarketplaceIntegration {
  marketplaces: {
    id: string;
    name: "mercado_livre" | "amazon" | "magazine_luiza" | "americanas" | "shopee";
    enabled: boolean;
    accountId: string;
    metrics: {
      listings: number;
      orders: number;
      revenue: number;
      fees: number;
      rating: number;
    };
    sync: {
      inventory: boolean;
      prices: boolean;
      orders: boolean;
      frequency: number; // minutes
      lastSync: Date;
    };
    fees: {
      commission: number; // percentage
      shipping: number; // percentage
      payment: number; // percentage
    };
  }[];
}

export interface BOPIS {
  // Buy Online, Pick Up In Store
  enabled: boolean;
  stores: string[]; // store IDs that support BOPIS
  config: {
    preparationTime: number; // minutes
    holdTime: number; // hours
    notificationChannels: ("email" | "sms" | "push")[];
  };
  orders: {
    id: string;
    orderId: string;
    storeId: string;
    storeName: string;
    status: "preparing" | "ready" | "picked_up" | "cancelled";
    readyAt?: Date;
    pickedUpAt?: Date;
    pickupCode: string;
    customerNotified: boolean;
  }[];
}

export interface CurbsidePickup {
  enabled: boolean;
  stores: string[];
  config: {
    arrivalNotificationRequired: boolean;
    waitTime: number; // minutes
    parkingSpots: number;
  };
  activePickups: {
    id: string;
    orderId: string;
    storeId: string;
    customerId: string;
    customerName: string;
    vehicle: {
      make: string;
      model: string;
      color: string;
      plate: string;
    };
    parkingSpot?: number;
    status: "on_the_way" | "arrived" | "preparing" | "ready" | "completed";
    arrivedAt?: Date;
    completedAt?: Date;
  }[];
}

export interface ShipFromStore {
  enabled: boolean;
  stores: string[];
  config: {
    inventoryThreshold: number; // minimum stock to enable
    shippingCutoffTime: string; // e.g., "16:00"
    carriers: string[];
  };
  orders: {
    id: string;
    orderId: string;
    storeId: string;
    storeName: string;
    status: "pending" | "picked" | "packed" | "shipped" | "delivered";
    carrier: string;
    trackingNumber?: string;
    shippedAt?: Date;
    deliveredAt?: Date;
  }[];
}

export interface OmnichannelAnalytics {
  overview: {
    totalChannels: number;
    activeChannels: number;
    totalOrders: number;
    totalRevenue: number;
    crossChannelCustomers: number; // customers who bought from multiple channels
    crossChannelRate: number; // percentage
  };
  channelPerformance: {
    channelId: string;
    channelName: string;
    orders: number;
    revenue: number;
    customers: number;
    conversionRate: number;
    averageOrderValue: number;
    growthRate: number; // percentage
  }[];
  channelAttribution: {
    firstTouch: { channel: string; percentage: number }[];
    lastTouch: { channel: string; percentage: number }[];
    multiTouch: { path: string[]; conversions: number; revenue: number }[];
  };
  crossChannelBehavior: {
    researchOnlineBuyInStore: number; // ROPIS
    buyOnlinePickupInStore: number; // BOPIS
    buyOnlineReturnInStore: number; // BORIS
    showrooming: number; // check in store, buy online
    webrooming: number; // research online, buy in store
  };
  inventoryEfficiency: {
    turnoverRate: number;
    stockoutRate: number; // percentage
    overstockRate: number; // percentage
    fulfillmentAccuracy: number; // percentage
  };
}

// Unified inventory management
export function getUnifiedInventory(productId: string): UnifiedInventory {
  // Mock implementation - in production, aggregate from all locations
  return {
    productId,
    totalStock: 1250,
    allocated: 150,
    available: 1100,
    locations: [
      {
        locationId: "warehouse-sp",
        locationType: "warehouse",
        locationName: "Centro de Distribuição SP",
        stock: 800,
        reserved: 100,
        available: 700,
      },
      {
        locationId: "store-jardins",
        locationType: "store",
        locationName: "Loja Jardins",
        stock: 250,
        reserved: 30,
        available: 220,
      },
      {
        locationId: "store-moema",
        locationType: "store",
        locationName: "Loja Moema",
        stock: 200,
        reserved: 20,
        available: 180,
      },
    ],
    channels: [
      { channelId: "website", channelName: "Website", allocated: 80, available: 920 },
      { channelId: "app", channelName: "App Mobile", allocated: 40, available: 960 },
      { channelId: "instagram", channelName: "Instagram Shop", allocated: 20, available: 980 },
      { channelId: "mercado-livre", channelName: "Mercado Livre", allocated: 10, available: 990 },
    ],
    lowStockThreshold: 100,
    alerts: [],
  };
}

// Find nearest store with product in stock
export function findNearestStore(
  productId: string,
  customerLocation: { lat: number; lng: number }
): StoreLocator["stores"][0] | null {
  // Mock implementation - in production, use geospatial queries
  const stores: StoreLocator["stores"] = [
    {
      id: "store-jardins",
      name: "MundoPetZen Jardins",
      type: "flagship",
      address: {
        street: "Rua Augusta, 2000",
        city: "São Paulo",
        state: "SP",
        zipCode: "01304-000",
        country: "Brazil",
        coordinates: { lat: -23.5629, lng: -46.6544 },
      },
      contact: {
        phone: "+55 11 3456-7890",
        email: "jardins@mundopetzen.com.br",
      },
      hours: [
        { day: "Segunda", open: "09:00", close: "20:00" },
        { day: "Terça", open: "09:00", close: "20:00" },
        { day: "Quarta", open: "09:00", close: "20:00" },
        { day: "Quinta", open: "09:00", close: "20:00" },
        { day: "Sexta", open: "09:00", close: "21:00" },
        { day: "Sábado", open: "10:00", close: "18:00" },
        { day: "Domingo", open: "10:00", close: "16:00" },
      ],
      services: ["BOPIS", "Curbside Pickup", "Returns", "Grooming", "Vet Consultation"],
      inventory: [
        { productId, stock: 15, available: true },
      ],
      distance: 2.5,
    },
  ];

  return stores.find(store => 
    store.inventory.some(inv => inv.productId === productId && inv.available)
  ) || null;
}

// Create BOPIS order
export function createBOPISOrder(
  orderId: string,
  storeId: string,
  storeName: string
): BOPIS["orders"][0] {
  return {
    id: `bopis-${Date.now()}`,
    orderId,
    storeId,
    storeName,
    status: "preparing",
    pickupCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    customerNotified: false,
  };
}

// Omnichannel customer journey
export function trackOmnichannelJourney(customerId: string): {
  touchpoints: {
    timestamp: Date;
    channel: string;
    action: string;
    device: string;
    location?: string;
  }[];
  conversions: {
    timestamp: Date;
    channel: string;
    orderId: string;
    amount: number;
    attributionPath: string[];
  }[];
} {
  return {
    touchpoints: [
      {
        timestamp: new Date("2025-01-20T10:30:00"),
        channel: "Instagram",
        action: "Viewed product post",
        device: "Mobile",
      },
      {
        timestamp: new Date("2025-01-20T14:15:00"),
        channel: "Website",
        action: "Searched for product",
        device: "Desktop",
      },
      {
        timestamp: new Date("2025-01-21T09:00:00"),
        channel: "Physical Store",
        action: "Checked product in person",
        device: "In-store",
        location: "Loja Jardins",
      },
      {
        timestamp: new Date("2025-01-21T19:30:00"),
        channel: "Mobile App",
        action: "Added to cart",
        device: "Mobile",
      },
      {
        timestamp: new Date("2025-01-21T19:45:00"),
        channel: "Mobile App",
        action: "Completed purchase (BOPIS)",
        device: "Mobile",
      },
    ],
    conversions: [
      {
        timestamp: new Date("2025-01-21T19:45:00"),
        channel: "Mobile App",
        orderId: "ORD-12345",
        amount: 450,
        attributionPath: ["Instagram", "Website", "Physical Store", "Mobile App"],
      },
    ],
  };
}

// Social commerce integration
export function getSocialCommerceMetrics(): SocialCommerce {
  return {
    platforms: [
      {
        platform: "instagram",
        enabled: true,
        shopEnabled: true,
        liveShoppingEnabled: true,
        metrics: {
          followers: 125000,
          engagement: 4.8,
          orders: 3500,
          revenue: 1575000,
        },
        integration: {
          connected: true,
          accountId: "@mundopetzen",
          catalogSynced: true,
          lastSync: new Date(),
        },
      },
      {
        platform: "facebook",
        enabled: true,
        shopEnabled: true,
        liveShoppingEnabled: false,
        metrics: {
          followers: 85000,
          engagement: 3.2,
          orders: 1200,
          revenue: 540000,
        },
        integration: {
          connected: true,
          accountId: "MundoPetZenBrasil",
          catalogSynced: true,
          lastSync: new Date(),
        },
      },
      {
        platform: "whatsapp",
        enabled: true,
        shopEnabled: true,
        liveShoppingEnabled: false,
        metrics: {
          followers: 0, // N/A for WhatsApp
          engagement: 0,
          orders: 850,
          revenue: 382500,
        },
        integration: {
          connected: true,
          accountId: "+55 11 98765-4321",
          catalogSynced: true,
          lastSync: new Date(),
        },
      },
    ],
    shoppablePosts: [
      {
        id: "post-1",
        platform: "instagram",
        postId: "CxYz123",
        products: [
          { productId: "prod-1", tags: 1 },
          { productId: "prod-2", tags: 1 },
        ],
        views: 45000,
        clicks: 2250,
        orders: 112,
        revenue: 50400,
        conversionRate: 5.0,
      },
    ],
    liveShoppingEvents: [
      {
        id: "live-1",
        platform: "instagram",
        title: "Lançamento Coleção Verão",
        scheduledAt: new Date("2025-02-01T19:00:00"),
        duration: 60,
        products: ["prod-1", "prod-2", "prod-3"],
        viewers: 8500,
        orders: 425,
        revenue: 191250,
      },
    ],
  };
}

// Marketplace integration
export function getMarketplaceMetrics(): MarketplaceIntegration {
  return {
    marketplaces: [
      {
        id: "mercado-livre",
        name: "mercado_livre",
        enabled: true,
        accountId: "MUNDOPETZEN",
        metrics: {
          listings: 450,
          orders: 2500,
          revenue: 1125000,
          fees: 168750, // 15% average
          rating: 4.8,
        },
        sync: {
          inventory: true,
          prices: true,
          orders: true,
          frequency: 15,
          lastSync: new Date(),
        },
        fees: {
          commission: 15,
          shipping: 0,
          payment: 3.5,
        },
      },
      {
        id: "amazon",
        name: "amazon",
        enabled: true,
        accountId: "MUNDOPETZEN-BR",
        metrics: {
          listings: 380,
          orders: 1800,
          revenue: 810000,
          fees: 129600, // 16% average
          rating: 4.6,
        },
        sync: {
          inventory: true,
          prices: true,
          orders: true,
          frequency: 30,
          lastSync: new Date(),
        },
        fees: {
          commission: 15,
          shipping: 0,
          payment: 1,
        },
      },
    ],
  };
}

// Omnichannel analytics
export function getOmnichannelAnalytics(): OmnichannelAnalytics {
  return {
    overview: {
      totalChannels: 10,
      activeChannels: 8,
      totalOrders: 15750,
      totalRevenue: 7087500,
      crossChannelCustomers: 4725,
      crossChannelRate: 37.8,
    },
    channelPerformance: [
      {
        channelId: "website",
        channelName: "Website",
        orders: 6500,
        revenue: 2925000,
        customers: 5200,
        conversionRate: 4.2,
        averageOrderValue: 450,
        growthRate: 15.5,
      },
      {
        channelId: "app",
        channelName: "App Mobile",
        orders: 3200,
        revenue: 1440000,
        customers: 2800,
        conversionRate: 5.8,
        averageOrderValue: 450,
        growthRate: 28.3,
      },
      {
        channelId: "instagram",
        channelName: "Instagram Shop",
        orders: 3500,
        revenue: 1575000,
        customers: 3100,
        conversionRate: 3.5,
        averageOrderValue: 450,
        growthRate: 42.1,
      },
      {
        channelId: "mercado-livre",
        channelName: "Mercado Livre",
        orders: 2500,
        revenue: 1125000,
        customers: 2300,
        conversionRate: 6.2,
        averageOrderValue: 450,
        growthRate: 18.7,
      },
    ],
    channelAttribution: {
      firstTouch: [
        { channel: "Instagram", percentage: 32 },
        { channel: "Google Search", percentage: 28 },
        { channel: "Facebook", percentage: 18 },
        { channel: "Direct", percentage: 12 },
        { channel: "Other", percentage: 10 },
      ],
      lastTouch: [
        { channel: "Website", percentage: 41 },
        { channel: "Mobile App", percentage: 25 },
        { channel: "Instagram", percentage: 18 },
        { channel: "Mercado Livre", percentage: 10 },
        { channel: "Other", percentage: 6 },
      ],
      multiTouch: [
        {
          path: ["Instagram", "Website", "Mobile App"],
          conversions: 1250,
          revenue: 562500,
        },
        {
          path: ["Google", "Website", "Physical Store", "Website"],
          conversions: 850,
          revenue: 382500,
        },
      ],
    },
    crossChannelBehavior: {
      researchOnlineBuyInStore: 1250, // ROPIS
      buyOnlinePickupInStore: 2150, // BOPIS
      buyOnlineReturnInStore: 450, // BORIS
      showrooming: 680, // check in store, buy online
      webrooming: 1850, // research online, buy in store
    },
    inventoryEfficiency: {
      turnoverRate: 8.5, // times per year
      stockoutRate: 2.3, // percentage
      overstockRate: 5.8, // percentage
      fulfillmentAccuracy: 98.5, // percentage
    },
  };
}

// Unified customer profile across channels
export function getUnifiedCustomerProfile(customerId: string): CustomerUnifiedProfile {
  return {
    id: customerId,
    channels: [
      {
        channelId: "website",
        channelName: "Website",
        customerId: "web-12345",
        joinedAt: new Date("2024-01-10"),
        lastActivity: new Date("2025-01-20"),
        orders: 8,
        spent: 3600,
      },
      {
        channelId: "app",
        channelName: "Mobile App",
        customerId: "app-67890",
        joinedAt: new Date("2024-03-15"),
        lastActivity: new Date("2025-01-25"),
        orders: 5,
        spent: 2250,
      },
      {
        channelId: "instagram",
        channelName: "Instagram Shop",
        customerId: "@maria_silva",
        joinedAt: new Date("2024-06-01"),
        lastActivity: new Date("2025-01-22"),
        orders: 2,
        spent: 900,
      },
    ],
    preferences: {
      preferredChannel: "Mobile App",
      preferredFulfillment: "BOPIS",
      preferredPayment: "PIX",
      communicationPreferences: [
        { channel: "Email", enabled: true },
        { channel: "SMS", enabled: true },
        { channel: "Push", enabled: true },
        { channel: "WhatsApp", enabled: false },
      ],
    },
    unifiedMetrics: {
      totalOrders: 15,
      totalSpent: 6750,
      lifetimeValue: 15000,
      averageOrderValue: 450,
      favoriteProducts: ["prod-1", "prod-2", "prod-3"],
      favoriteCategories: ["Brinquedos", "Alimentação"],
    },
  };
}

// Channel recommendations
export function recommendChannels(customerId: string): {
  channel: string;
  reason: string;
  expectedLift: number; // percentage
  priority: number;
}[] {
  return [
    {
      channel: "Mobile App",
      reason: "Customer frequently browses on mobile, app offers better experience",
      expectedLift: 35,
      priority: 1,
    },
    {
      channel: "Instagram Shop",
      reason: "Customer follows brand on Instagram and engages with posts",
      expectedLift: 22,
      priority: 2,
    },
    {
      channel: "BOPIS",
      reason: "Customer lives near store and values convenience",
      expectedLift: 18,
      priority: 3,
    },
  ];
}
