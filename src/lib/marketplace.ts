// Marketplace and Multi-Vendor System

export interface Vendor {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  description: string;
  logo?: string;
  banner?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  status: "pending" | "active" | "suspended" | "inactive";
  rating: number;
  totalReviews: number;
  totalSales: number;
  totalRevenue: number;
  commission: {
    type: "percentage" | "fixed";
    value: number;
  };
  payoutInfo: {
    method: "bank_transfer" | "pix";
    bankName?: string;
    accountNumber?: string;
    pixKey?: string;
  };
  settings: {
    autoApproveProducts: boolean;
    allowReturns: boolean;
    returnWindow: number; // days
    shippingMethods: string[];
  };
  createdAt: Date;
  verifiedAt?: Date;
}

export interface VendorProduct {
  id: string;
  vendorId: string;
  productId: string;
  price: number;
  stock: number;
  sku: string;
  condition: "new" | "used" | "refurbished";
  shippingTime: {
    min: number;
    max: number;
  };
  shippingCost: number;
  freeShippingThreshold?: number;
  status: "pending" | "active" | "out_of_stock" | "discontinued";
  createdAt: Date;
}

export interface VendorOrder {
  id: string;
  orderId: string;
  vendorId: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    commission: number;
  }[];
  subtotal: number;
  commission: number;
  vendorPayout: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  shippingInfo?: {
    carrier: string;
    trackingNumber: string;
    shippedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface VendorPayout {
  id: string;
  vendorId: string;
  amount: number;
  period: {
    start: Date;
    end: Date;
  };
  orders: string[]; // order IDs
  status: "pending" | "processing" | "completed" | "failed";
  method: "bank_transfer" | "pix";
  processedAt?: Date;
  notes?: string;
}

export interface VendorDashboard {
  vendor: Vendor;
  metrics: {
    totalOrders: number;
    totalRevenue: number;
    totalCommission: number;
    netRevenue: number;
    averageOrderValue: number;
    conversionRate: number;
  };
  recentOrders: VendorOrder[];
  topProducts: {
    productId: string;
    productName: string;
    sales: number;
    revenue: number;
  }[];
  pendingPayouts: VendorPayout[];
  alerts: {
    type: "low_stock" | "order" | "review" | "payout";
    message: string;
    timestamp: Date;
  }[];
}

// Sample vendors
export const vendors: Vendor[] = [
  {
    id: "vendor-001",
    name: "PetShop Premium",
    slug: "petshop-premium",
    email: "contato@petshoppremium.com",
    phone: "+55 11 98765-4321",
    description:
      "Loja especializada em produtos premium para pets. Mais de 10 anos de experiência.",
    logo: "/vendors/petshop-premium-logo.png",
    banner: "/vendors/petshop-premium-banner.jpg",
    address: {
      street: "Rua das Flores, 123",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567",
      country: "BR",
    },
    status: "active",
    rating: 4.8,
    totalReviews: 234,
    totalSales: 1567,
    totalRevenue: 156789.5,
    commission: {
      type: "percentage",
      value: 15,
    },
    payoutInfo: {
      method: "pix",
      pixKey: "contato@petshoppremium.com",
    },
    settings: {
      autoApproveProducts: true,
      allowReturns: true,
      returnWindow: 30,
      shippingMethods: ["PAC", "SEDEX", "Transportadora"],
    },
    createdAt: new Date("2023-01-15"),
    verifiedAt: new Date("2023-01-20"),
  },
  {
    id: "vendor-002",
    name: "Mundo Pet Acessórios",
    slug: "mundo-pet-acessorios",
    email: "vendas@mundopetacessorios.com",
    phone: "+55 21 97654-3210",
    description: "Acessórios exclusivos e personalizados para seu pet.",
    logo: "/vendors/mundo-pet-logo.png",
    status: "active",
    rating: 4.6,
    totalReviews: 189,
    totalSales: 987,
    totalRevenue: 87654.3,
    commission: {
      type: "percentage",
      value: 12,
    },
    payoutInfo: {
      method: "bank_transfer",
      bankName: "Banco do Brasil",
      accountNumber: "12345-6",
    },
    settings: {
      autoApproveProducts: false,
      allowReturns: true,
      returnWindow: 15,
      shippingMethods: ["PAC", "SEDEX"],
    },
    createdAt: new Date("2023-03-10"),
    verifiedAt: new Date("2023-03-15"),
  },
];

// Get vendor by ID
export function getVendor(vendorId: string): Vendor | undefined {
  return vendors.find((v) => v.id === vendorId);
}

// Get vendor by slug
export function getVendorBySlug(slug: string): Vendor | undefined {
  return vendors.find((v) => v.slug === slug);
}

// Register new vendor
export function registerVendor(data: {
  name: string;
  email: string;
  phone: string;
  description: string;
  address: Vendor["address"];
}): Vendor {
  const vendor: Vendor = {
    id: `vendor-${Date.now()}`,
    name: data.name,
    slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    email: data.email,
    phone: data.phone,
    description: data.description,
    address: data.address,
    status: "pending",
    rating: 0,
    totalReviews: 0,
    totalSales: 0,
    totalRevenue: 0,
    commission: {
      type: "percentage",
      value: 15, // Default commission
    },
    payoutInfo: {
      method: "pix",
    },
    settings: {
      autoApproveProducts: false,
      allowReturns: true,
      returnWindow: 30,
      shippingMethods: ["PAC"],
    },
    createdAt: new Date(),
  };

  // In production, save to database
  vendors.push(vendor);

  return vendor;
}

// Approve vendor
export function approveVendor(vendorId: string): boolean {
  const vendor = getVendor(vendorId);
  if (!vendor || vendor.status !== "pending") return false;

  vendor.status = "active";
  vendor.verifiedAt = new Date();

  // In production, update database and send notification email
  return true;
}

// Calculate commission
export function calculateCommission(
  vendorId: string,
  orderAmount: number
): number {
  const vendor = getVendor(vendorId);
  if (!vendor) return 0;

  if (vendor.commission.type === "percentage") {
    return (orderAmount * vendor.commission.value) / 100;
  }

  return vendor.commission.value;
}

// Create vendor order
export function createVendorOrder(data: {
  orderId: string;
  vendorId: string;
  items: VendorOrder["items"];
}): VendorOrder {
  const subtotal = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const commission = calculateCommission(data.vendorId, subtotal);
  const vendorPayout = subtotal - commission;

  const vendorOrder: VendorOrder = {
    id: `vorder-${Date.now()}`,
    orderId: data.orderId,
    vendorId: data.vendorId,
    items: data.items.map((item) => ({
      ...item,
      commission: calculateCommission(
        data.vendorId,
        item.price * item.quantity
      ),
    })),
    subtotal,
    commission,
    vendorPayout,
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // In production, save to database
  return vendorOrder;
}

// Update order status
export function updateVendorOrderStatus(
  orderId: string,
  status: VendorOrder["status"],
  shippingInfo?: VendorOrder["shippingInfo"]
): boolean {
  // In production, update database
  return true;
}

// Get vendor dashboard
export function getVendorDashboard(vendorId: string): VendorDashboard | null {
  const vendor = getVendor(vendorId);
  if (!vendor) return null;

  // Mock data - in production, query from database
  return {
    vendor,
    metrics: {
      totalOrders: vendor.totalSales,
      totalRevenue: vendor.totalRevenue,
      totalCommission: vendor.totalRevenue * (vendor.commission.value / 100),
      netRevenue:
        vendor.totalRevenue -
        vendor.totalRevenue * (vendor.commission.value / 100),
      averageOrderValue: vendor.totalRevenue / vendor.totalSales,
      conversionRate: 3.5,
    },
    recentOrders: [
      {
        id: "vorder-001",
        orderId: "ORD-001",
        vendorId: vendor.id,
        items: [
          {
            productId: "prod-001",
            productName: "Difusor Aromático",
            quantity: 1,
            price: 129.9,
            commission: 19.49,
          },
        ],
        subtotal: 129.9,
        commission: 19.49,
        vendorPayout: 110.41,
        status: "delivered",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ],
    topProducts: [
      {
        productId: "prod-001",
        productName: "Difusor Aromático",
        sales: 156,
        revenue: 20264.4,
      },
      {
        productId: "prod-002",
        productName: "Coleira LED",
        sales: 234,
        revenue: 11676.6,
      },
    ],
    pendingPayouts: [
      {
        id: "payout-001",
        vendorId: vendor.id,
        amount: 15678.9,
        period: {
          start: new Date("2024-12-01"),
          end: new Date("2024-12-31"),
        },
        orders: ["vorder-001", "vorder-002"],
        status: "pending",
        method: "pix",
      },
    ],
    alerts: [
      {
        type: "order",
        message: "Você tem 3 novos pedidos para processar",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        type: "low_stock",
        message: "Produto 'Difusor Aromático' está com estoque baixo (5 unidades)",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
    ],
  };
}

// Process vendor payout
export function processVendorPayout(payoutId: string): boolean {
  // In production, integrate with payment gateway
  return true;
}

// Vendor analytics
export interface VendorAnalytics {
  period: {
    start: Date;
    end: Date;
  };
  sales: {
    total: number;
    trend: { date: string; amount: number }[];
  };
  orders: {
    total: number;
    byStatus: { status: string; count: number }[];
  };
  products: {
    totalActive: number;
    totalSold: number;
    topPerformers: {
      productId: string;
      productName: string;
      sales: number;
      revenue: number;
    }[];
  };
  customers: {
    total: number;
    new: number;
    returning: number;
  };
  reviews: {
    average: number;
    total: number;
    distribution: { stars: number; count: number }[];
  };
}

export function getVendorAnalytics(
  vendorId: string,
  period: { start: Date; end: Date }
): VendorAnalytics | null {
  const vendor = getVendor(vendorId);
  if (!vendor) return null;

  // Mock data - in production, calculate from database
  return {
    period,
    sales: {
      total: 45678.9,
      trend: [
        { date: "2024-12-01", amount: 1567.8 },
        { date: "2024-12-02", amount: 1789.2 },
        { date: "2024-12-03", amount: 1456.3 },
      ],
    },
    orders: {
      total: 234,
      byStatus: [
        { status: "delivered", count: 189 },
        { status: "shipped", count: 23 },
        { status: "processing", count: 15 },
        { status: "pending", count: 7 },
      ],
    },
    products: {
      totalActive: 45,
      totalSold: 567,
      topPerformers: [
        {
          productId: "prod-001",
          productName: "Difusor Aromático",
          sales: 156,
          revenue: 20264.4,
        },
      ],
    },
    customers: {
      total: 345,
      new: 89,
      returning: 256,
    },
    reviews: {
      average: 4.8,
      total: 234,
      distribution: [
        { stars: 5, count: 178 },
        { stars: 4, count: 45 },
        { stars: 3, count: 8 },
        { stars: 2, count: 2 },
        { stars: 1, count: 1 },
      ],
    },
  };
}

// Marketplace admin functions
export interface MarketplaceStats {
  totalVendors: number;
  activeVendors: number;
  pendingVendors: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  topVendors: {
    vendorId: string;
    vendorName: string;
    sales: number;
    revenue: number;
    rating: number;
  }[];
}

export function getMarketplaceStats(): MarketplaceStats {
  const activeVendors = vendors.filter((v) => v.status === "active");
  const pendingVendors = vendors.filter((v) => v.status === "pending");

  const totalRevenue = vendors.reduce((sum, v) => sum + v.totalRevenue, 0);
  const totalCommission = vendors.reduce(
    (sum, v) => sum + (v.totalRevenue * v.commission.value) / 100,
    0
  );

  return {
    totalVendors: vendors.length,
    activeVendors: activeVendors.length,
    pendingVendors: pendingVendors.length,
    totalProducts: 234, // Mock
    totalOrders: vendors.reduce((sum, v) => sum + v.totalSales, 0),
    totalRevenue,
    totalCommission,
    topVendors: vendors
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5)
      .map((v) => ({
        vendorId: v.id,
        vendorName: v.name,
        sales: v.totalSales,
        revenue: v.totalRevenue,
        rating: v.rating,
      })),
  };
}

// Vendor verification
export interface VendorVerification {
  vendorId: string;
  documents: {
    type: "cnpj" | "cpf" | "address_proof" | "bank_statement";
    url: string;
    status: "pending" | "approved" | "rejected";
    uploadedAt: Date;
    reviewedAt?: Date;
    notes?: string;
  }[];
  status: "incomplete" | "pending_review" | "approved" | "rejected";
}

export function submitVerificationDocument(
  vendorId: string,
  type: VendorVerification["documents"][0]["type"],
  url: string
): boolean {
  // In production, save to database
  return true;
}

export function reviewVerificationDocument(
  vendorId: string,
  documentType: string,
  approved: boolean,
  notes?: string
): boolean {
  // In production, update database and notify vendor
  return true;
}

// Vendor disputes
export interface VendorDispute {
  id: string;
  orderId: string;
  vendorId: string;
  customerId: string;
  type: "refund" | "quality" | "shipping" | "other";
  description: string;
  evidence: {
    type: "text" | "image" | "document";
    content: string;
  }[];
  status: "open" | "investigating" | "resolved" | "closed";
  resolution?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export function createDispute(data: {
  orderId: string;
  vendorId: string;
  customerId: string;
  type: VendorDispute["type"];
  description: string;
}): VendorDispute {
  const dispute: VendorDispute = {
    id: `dispute-${Date.now()}`,
    orderId: data.orderId,
    vendorId: data.vendorId,
    customerId: data.customerId,
    type: data.type,
    description: data.description,
    evidence: [],
    status: "open",
    createdAt: new Date(),
  };

  // In production, save to database and notify parties
  return dispute;
}

export function resolveDispute(
  disputeId: string,
  resolution: string
): boolean {
  // In production, update database and notify parties
  return true;
}
