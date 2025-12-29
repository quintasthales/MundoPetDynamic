// Advanced Marketplace and Multi-Vendor Platform

export interface Vendor {
  id: string;
  businessName: string;
  legalName: string;
  taxId: string; // CNPJ
  email: string;
  phone: string;
  logo: string;
  banner: string;
  description: string;
  category: string[];
  status: "pending" | "active" | "suspended" | "inactive";
  tier: "basic" | "premium" | "enterprise";
  address: VendorAddress;
  bankAccount: BankAccount;
  settings: VendorSettings;
  metrics: VendorMetrics;
  ratings: VendorRatings;
  subscription: VendorSubscription;
  documents: VendorDocument[];
  createdAt: Date;
  approvedAt?: Date;
  lastLoginAt?: Date;
}

export interface VendorAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface BankAccount {
  bankCode: string;
  bankName: string;
  accountType: "checking" | "savings";
  agency: string;
  accountNumber: string;
  accountHolder: string;
  taxId: string;
  verified: boolean;
}

export interface VendorSettings {
  autoApproveOrders: boolean;
  processingTime: number; // days
  returnPolicy: number; // days
  shippingMethods: string[];
  paymentMethods: string[];
  minOrderValue?: number;
  maxOrderValue?: number;
  vacationMode: boolean;
  vacationStart?: Date;
  vacationEnd?: Date;
}

export interface VendorMetrics {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  completedOrders: number;
  canceledOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  conversionRate: number;
  responseTime: number; // hours
  fulfillmentRate: number; // percentage
  onTimeDeliveryRate: number; // percentage
  returnRate: number; // percentage
}

export interface VendorRatings {
  overall: number; // 0-5
  totalReviews: number;
  productQuality: number;
  communication: number;
  shipping: number;
  packaging: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface VendorSubscription {
  plan: "basic" | "premium" | "enterprise";
  status: "active" | "canceled" | "suspended";
  startDate: Date;
  endDate?: Date;
  billingCycle: "monthly" | "quarterly" | "annual";
  price: number;
  features: string[];
  commission: {
    percentage: number;
    fixed?: number;
  };
}

export interface VendorDocument {
  id: string;
  type: "cnpj" | "contract" | "identity" | "proof_of_address" | "other";
  name: string;
  url: string;
  status: "pending" | "approved" | "rejected";
  uploadedAt: Date;
  verifiedAt?: Date;
  notes?: string;
}

export interface VendorProduct {
  id: string;
  vendorId: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  compareAtPrice?: number;
  cost: number;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  variants?: ProductVariant[];
  attributes: Record<string, string>;
  status: "draft" | "pending" | "active" | "rejected" | "out_of_stock";
  rejectionReason?: string;
  shippingInfo: {
    weight: number; // kg
    length: number; // cm
    width: number; // cm
    height: number; // cm
    freeShipping: boolean;
  };
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  approvedAt?: Date;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
  image?: string;
}

export interface MarketplaceOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  vendorId: string;
  items: MarketplaceOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  commission: number;
  vendorPayout: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "canceled"
    | "refunded";
  paymentStatus: "pending" | "paid" | "refunded";
  shippingAddress: VendorAddress;
  trackingCode?: string;
  shippingMethod: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  notes?: string;
  timeline: OrderTimeline[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MarketplaceOrderItem {
  productId: string;
  productName: string;
  variantId?: string;
  variantName?: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
  commission: number;
  vendorPayout: number;
}

export interface OrderTimeline {
  status: string;
  timestamp: Date;
  note?: string;
  actor?: string;
}

export interface VendorPayout {
  id: string;
  vendorId: string;
  period: {
    start: Date;
    end: Date;
  };
  orders: string[];
  totalRevenue: number;
  commission: number;
  adjustments: number;
  netAmount: number;
  status: "pending" | "processing" | "paid" | "failed";
  paymentMethod: "bank_transfer" | "pix" | "paypal";
  paidAt?: Date;
  transactionId?: string;
  createdAt: Date;
}

export interface MarketplaceCommission {
  vendorTier: "basic" | "premium" | "enterprise";
  category: string;
  percentage: number;
  fixed?: number;
  minCommission?: number;
  maxCommission?: number;
}

// Marketplace Manager
export class MarketplaceManager {
  private vendors: Map<string, Vendor> = new Map();
  private products: Map<string, VendorProduct> = new Map();
  private orders: Map<string, MarketplaceOrder> = new Map();
  private payouts: Map<string, VendorPayout> = new Map();
  
  // Vendor Management
  registerVendor(data: Omit<Vendor, "id" | "createdAt">): Vendor {
    const vendor: Vendor = {
      id: `vendor-${Date.now()}`,
      ...data,
      createdAt: new Date(),
    };
    
    this.vendors.set(vendor.id, vendor);
    return vendor;
  }
  
  approveVendor(vendorId: string): Vendor | undefined {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) return undefined;
    
    vendor.status = "active";
    vendor.approvedAt = new Date();
    
    this.vendors.set(vendorId, vendor);
    return vendor;
  }
  
  suspendVendor(vendorId: string, reason: string): Vendor | undefined {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) return undefined;
    
    vendor.status = "suspended";
    
    this.vendors.set(vendorId, vendor);
    return vendor;
  }
  
  // Product Management
  addProduct(
    vendorId: string,
    data: Omit<VendorProduct, "id" | "vendorId" | "createdAt" | "updatedAt">
  ): VendorProduct {
    const product: VendorProduct = {
      id: `prod-${Date.now()}`,
      vendorId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.products.set(product.id, product);
    return product;
  }
  
  approveProduct(productId: string): VendorProduct | undefined {
    const product = this.products.get(productId);
    if (!product) return undefined;
    
    product.status = "active";
    product.approvedAt = new Date();
    product.updatedAt = new Date();
    
    this.products.set(productId, product);
    return product;
  }
  
  rejectProduct(
    productId: string,
    reason: string
  ): VendorProduct | undefined {
    const product = this.products.get(productId);
    if (!product) return undefined;
    
    product.status = "rejected";
    product.rejectionReason = reason;
    product.updatedAt = new Date();
    
    this.products.set(productId, product);
    return product;
  }
  
  // Order Management
  createOrder(
    customerId: string,
    vendorId: string,
    items: MarketplaceOrderItem[],
    shippingAddress: VendorAddress
  ): MarketplaceOrder {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) throw new Error("Vendor not found");
    
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const shipping = this.calculateShipping(items, shippingAddress);
    const tax = subtotal * 0.1; // 10% tax
    const commission = this.calculateCommission(vendor, items);
    const vendorPayout = subtotal - commission;
    const total = subtotal + shipping + tax;
    
    const order: MarketplaceOrder = {
      id: `order-${Date.now()}`,
      orderNumber: `MKT${Date.now().toString().slice(-8)}`,
      customerId,
      vendorId,
      items,
      subtotal,
      shipping,
      tax,
      commission,
      vendorPayout,
      total,
      status: "pending",
      paymentStatus: "pending",
      shippingAddress,
      shippingMethod: "standard",
      timeline: [
        {
          status: "pending",
          timestamp: new Date(),
          note: "Order created",
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.orders.set(order.id, order);
    
    // Update vendor metrics
    vendor.metrics.totalOrders++;
    this.vendors.set(vendorId, vendor);
    
    return order;
  }
  
  updateOrderStatus(
    orderId: string,
    status: MarketplaceOrder["status"],
    note?: string
  ): MarketplaceOrder | undefined {
    const order = this.orders.get(orderId);
    if (!order) return undefined;
    
    order.status = status;
    order.updatedAt = new Date();
    order.timeline.push({
      status,
      timestamp: new Date(),
      note,
    });
    
    if (status === "delivered") {
      order.actualDelivery = new Date();
      
      // Update vendor metrics
      const vendor = this.vendors.get(order.vendorId);
      if (vendor) {
        vendor.metrics.completedOrders++;
        vendor.metrics.totalRevenue += order.vendorPayout;
        this.vendors.set(order.vendorId, vendor);
      }
    }
    
    this.orders.set(orderId, order);
    return order;
  }
  
  // Commission Calculation
  private calculateCommission(
    vendor: Vendor,
    items: MarketplaceOrderItem[]
  ): number {
    const commissionRate = vendor.subscription.commission.percentage / 100;
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    return subtotal * commissionRate;
  }
  
  private calculateShipping(
    items: MarketplaceOrderItem[],
    address: VendorAddress
  ): number {
    // Mock implementation
    return 15.0;
  }
  
  // Payout Management
  generatePayout(vendorId: string, period: { start: Date; end: Date }): VendorPayout {
    const orders = Array.from(this.orders.values()).filter(
      (o) =>
        o.vendorId === vendorId &&
        o.status === "delivered" &&
        o.paymentStatus === "paid" &&
        o.createdAt >= period.start &&
        o.createdAt <= period.end
    );
    
    const totalRevenue = orders.reduce((sum, o) => sum + o.subtotal, 0);
    const commission = orders.reduce((sum, o) => sum + o.commission, 0);
    const netAmount = totalRevenue - commission;
    
    const payout: VendorPayout = {
      id: `payout-${Date.now()}`,
      vendorId,
      period,
      orders: orders.map((o) => o.id),
      totalRevenue,
      commission,
      adjustments: 0,
      netAmount,
      status: "pending",
      paymentMethod: "pix",
      createdAt: new Date(),
    };
    
    this.payouts.set(payout.id, payout);
    return payout;
  }
  
  processPayout(payoutId: string): VendorPayout | undefined {
    const payout = this.payouts.get(payoutId);
    if (!payout) return undefined;
    
    payout.status = "paid";
    payout.paidAt = new Date();
    payout.transactionId = `TXN${Date.now()}`;
    
    this.payouts.set(payoutId, payout);
    return payout;
  }
  
  // Analytics
  getVendorAnalytics(vendorId: string): VendorAnalytics {
    const vendor = this.vendors.get(vendorId);
    if (!vendor) throw new Error("Vendor not found");
    
    const orders = Array.from(this.orders.values()).filter(
      (o) => o.vendorId === vendorId
    );
    
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter((o) => o.createdAt >= last30Days);
    
    return {
      vendor: vendor.businessName,
      period: {
        start: last30Days,
        end: new Date(),
      },
      orders: {
        total: recentOrders.length,
        completed: recentOrders.filter((o) => o.status === "delivered").length,
        canceled: recentOrders.filter((o) => o.status === "canceled").length,
        pending: recentOrders.filter((o) => o.status === "pending").length,
      },
      revenue: {
        gross: recentOrders.reduce((sum, o) => sum + o.subtotal, 0),
        commission: recentOrders.reduce((sum, o) => sum + o.commission, 0),
        net: recentOrders.reduce((sum, o) => sum + o.vendorPayout, 0),
      },
      products: {
        total: vendor.metrics.totalProducts,
        active: vendor.metrics.activeProducts,
        outOfStock: vendor.metrics.totalProducts - vendor.metrics.activeProducts,
      },
      performance: {
        conversionRate: vendor.metrics.conversionRate,
        avgOrderValue: vendor.metrics.avgOrderValue,
        fulfillmentRate: vendor.metrics.fulfillmentRate,
        onTimeDelivery: vendor.metrics.onTimeDeliveryRate,
      },
      ratings: vendor.ratings,
    };
  }
}

export interface VendorAnalytics {
  vendor: string;
  period: {
    start: Date;
    end: Date;
  };
  orders: {
    total: number;
    completed: number;
    canceled: number;
    pending: number;
  };
  revenue: {
    gross: number;
    commission: number;
    net: number;
  };
  products: {
    total: number;
    active: number;
    outOfStock: number;
  };
  performance: {
    conversionRate: number;
    avgOrderValue: number;
    fulfillmentRate: number;
    onTimeDelivery: number;
  };
  ratings: VendorRatings;
}

// Marketplace Analytics
export interface MarketplaceAnalytics {
  vendors: {
    total: number;
    active: number;
    pending: number;
    suspended: number;
  };
  products: {
    total: number;
    active: number;
    pending: number;
  };
  orders: {
    total: number;
    completed: number;
    canceled: number;
    avgOrderValue: number;
  };
  revenue: {
    gmv: number; // Gross Merchandise Value
    commission: number;
    platformRevenue: number;
  };
  topVendors: {
    vendorId: string;
    businessName: string;
    revenue: number;
    orders: number;
    rating: number;
  }[];
  topProducts: {
    productId: string;
    name: string;
    vendorId: string;
    sales: number;
    revenue: number;
  }[];
}

export function getMarketplaceAnalytics(): MarketplaceAnalytics {
  return {
    vendors: {
      total: 2850,
      active: 2450,
      pending: 285,
      suspended: 115,
    },
    products: {
      total: 48500,
      active: 42500,
      pending: 3850,
    },
    orders: {
      total: 125000,
      completed: 108500,
      canceled: 8500,
      avgOrderValue: 185.5,
    },
    revenue: {
      gmv: 23187500, // R$ 23.19M
      commission: 3478125, // 15% avg commission
      platformRevenue: 3478125,
    },
    topVendors: [
      {
        vendorId: "vendor-001",
        businessName: "Zen Aromas Premium",
        revenue: 2850000,
        orders: 12500,
        rating: 4.9,
      },
      {
        vendorId: "vendor-002",
        businessName: "Pet Wellness Store",
        revenue: 1985000,
        orders: 9850,
        rating: 4.8,
      },
      {
        vendorId: "vendor-003",
        businessName: "Natural Living",
        revenue: 1650000,
        orders: 8500,
        rating: 4.7,
      },
    ],
    topProducts: [
      {
        productId: "prod-001",
        name: "Difusor Aromático Premium",
        vendorId: "vendor-001",
        sales: 5850,
        revenue: 758550,
      },
      {
        productId: "prod-002",
        name: "Kit Aromaterapia Completo",
        vendorId: "vendor-001",
        sales: 4250,
        revenue: 638750,
      },
      {
        productId: "prod-003",
        name: "Óleo Essencial Lavanda",
        vendorId: "vendor-002",
        sales: 8500,
        revenue: 382500,
      },
    ],
  };
}

// Commission Tiers
export function getCommissionTiers(): MarketplaceCommission[] {
  return [
    {
      vendorTier: "basic",
      category: "all",
      percentage: 15,
      minCommission: 5,
    },
    {
      vendorTier: "premium",
      category: "all",
      percentage: 12,
      minCommission: 3,
    },
    {
      vendorTier: "enterprise",
      category: "all",
      percentage: 8,
      minCommission: 2,
    },
  ];
}

// Vendor Subscription Plans
export function getVendorSubscriptionPlans(): {
  plan: string;
  price: number;
  commission: number;
  features: string[];
}[] {
  return [
    {
      plan: "Basic",
      price: 0,
      commission: 15,
      features: [
        "Até 100 produtos",
        "Comissão de 15%",
        "Painel básico",
        "Suporte por email",
      ],
    },
    {
      plan: "Premium",
      price: 99.9,
      commission: 12,
      features: [
        "Produtos ilimitados",
        "Comissão de 12%",
        "Painel avançado",
        "Suporte prioritário",
        "Analytics detalhado",
        "Promoções destacadas",
      ],
    },
    {
      plan: "Enterprise",
      price: 299.9,
      commission: 8,
      features: [
        "Produtos ilimitados",
        "Comissão de 8%",
        "Painel completo",
        "Gerente de conta dedicado",
        "API access",
        "White label",
        "Integração ERP",
        "Campanhas exclusivas",
      ],
    },
  ];
}
