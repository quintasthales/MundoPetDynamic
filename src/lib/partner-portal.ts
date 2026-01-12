// Partner and Vendor Portal System

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  tier: "bronze" | "silver" | "gold" | "platinum";
  status: "active" | "pending" | "suspended" | "inactive";
  contact: {
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  businessInfo: {
    legalName: string;
    taxId: string;
    businessType: string;
    yearEstablished: number;
    website?: string;
  };
  agreement: {
    type: "commission" | "wholesale" | "dropship" | "affiliate";
    startDate: Date;
    endDate?: Date;
    terms: string;
    commissionRate?: number; // percentage
    paymentTerms: string;
  };
  performance: {
    totalSales: number;
    totalRevenue: number;
    totalCommission: number;
    avgOrderValue: number;
    conversionRate: number;
    rating: number;
  };
  createdAt: Date;
  lastActive?: Date;
}

export type PartnerType =
  | "vendor"
  | "supplier"
  | "distributor"
  | "affiliate"
  | "reseller"
  | "dropshipper"
  | "manufacturer";

export interface VendorProduct {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  category: string;
  sku: string;
  price: {
    wholesale: number;
    retail: number;
    currency: string;
  };
  inventory: {
    quantity: number;
    location: string;
    reorderPoint: number;
    leadTime: number; // days
  };
  status: "active" | "pending_approval" | "rejected" | "out_of_stock";
  images: string[];
  specifications: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartnerOrder {
  id: string;
  partnerId: string;
  partnerName: string;
  orderNumber: string;
  type: "purchase" | "sale" | "return";
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  shipping: {
    method: string;
    carrier?: string;
    trackingNumber?: string;
    estimatedDelivery?: Date;
  };
  payment: {
    method: string;
    status: "pending" | "paid" | "failed";
    paidAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Commission {
  id: string;
  partnerId: string;
  orderId: string;
  orderNumber: string;
  orderDate: Date;
  orderTotal: number;
  commissionRate: number; // percentage
  commissionAmount: number;
  status: "pending" | "approved" | "paid" | "cancelled";
  paidAt?: Date;
  paymentMethod?: string;
  createdAt: Date;
}

export interface Payout {
  id: string;
  partnerId: string;
  partnerName: string;
  period: {
    start: Date;
    end: Date;
  };
  commissions: string[]; // commission IDs
  amount: number;
  currency: string;
  status: "pending" | "processing" | "completed" | "failed";
  method: "bank_transfer" | "paypal" | "stripe" | "check";
  details?: {
    bankAccount?: string;
    transactionId?: string;
  };
  processedAt?: Date;
  createdAt: Date;
}

export interface PartnerTicket {
  id: string;
  partnerId: string;
  subject: string;
  description: string;
  category: "technical" | "billing" | "product" | "shipping" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "waiting" | "resolved" | "closed";
  messages: {
    id: string;
    from: "partner" | "support";
    message: string;
    attachments?: string[];
    timestamp: Date;
  }[];
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface PartnerDocument {
  id: string;
  partnerId: string;
  type: "contract" | "invoice" | "statement" | "report" | "certificate";
  name: string;
  description?: string;
  url: string;
  size: number; // bytes
  uploadedBy: string;
  createdAt: Date;
}

export interface PartnerAnalytics {
  partnerId: string;
  period: {
    start: Date;
    end: Date;
  };
  sales: {
    totalOrders: number;
    totalRevenue: number;
    totalCommission: number;
    avgOrderValue: number;
    topProducts: {
      productId: string;
      productName: string;
      sales: number;
      revenue: number;
    }[];
  };
  performance: {
    conversionRate: number;
    returnRate: number;
    avgDeliveryTime: number; // days
    customerSatisfaction: number;
  };
  traffic: {
    visits: number;
    clicks: number;
    referrals: number;
  };
  trends: {
    date: Date;
    orders: number;
    revenue: number;
  }[];
}

// Partner Manager
export class PartnerManager {
  private partners: Map<string, Partner> = new Map();
  private products: Map<string, VendorProduct> = new Map();
  private orders: Map<string, PartnerOrder> = new Map();
  private commissions: Map<string, Commission> = new Map();
  private payouts: Map<string, Payout> = new Map();
  private tickets: Map<string, PartnerTicket> = new Map();
  
  // Create Partner
  createPartner(data: Omit<Partner, "id" | "createdAt" | "performance">): Partner {
    const partner: Partner = {
      id: `partner-${Date.now()}`,
      ...data,
      performance: {
        totalSales: 0,
        totalRevenue: 0,
        totalCommission: 0,
        avgOrderValue: 0,
        conversionRate: 0,
        rating: 0,
      },
      createdAt: new Date(),
    };
    
    this.partners.set(partner.id, partner);
    return partner;
  }
  
  // Add Vendor Product
  addProduct(data: Omit<VendorProduct, "id" | "createdAt" | "updatedAt">): VendorProduct {
    const product: VendorProduct = {
      id: `vp-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.products.set(product.id, product);
    return product;
  }
  
  // Create Partner Order
  createOrder(data: Omit<PartnerOrder, "id" | "createdAt" | "updatedAt">): PartnerOrder {
    const order: PartnerOrder = {
      id: `po-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.orders.set(order.id, order);
    
    // Create commission if applicable
    const partner = this.partners.get(data.partnerId);
    if (partner && partner.agreement.commissionRate) {
      this.createCommission(order.id, partner.id, order.totals.total, partner.agreement.commissionRate);
    }
    
    return order;
  }
  
  // Create Commission
  private createCommission(
    orderId: string,
    partnerId: string,
    orderTotal: number,
    commissionRate: number
  ): Commission {
    const order = this.orders.get(orderId);
    if (!order) throw new Error("Order not found");
    
    const commission: Commission = {
      id: `comm-${Date.now()}`,
      partnerId,
      orderId,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      orderTotal,
      commissionRate,
      commissionAmount: (orderTotal * commissionRate) / 100,
      status: "pending",
      createdAt: new Date(),
    };
    
    this.commissions.set(commission.id, commission);
    return commission;
  }
  
  // Process Payout
  async processPayout(
    partnerId: string,
    commissionIds: string[],
    method: Payout["method"]
  ): Promise<Payout> {
    const partner = this.partners.get(partnerId);
    if (!partner) throw new Error("Partner not found");
    
    const commissions = commissionIds
      .map((id) => this.commissions.get(id))
      .filter((c): c is Commission => c !== undefined && c.status === "approved");
    
    const amount = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    
    const payout: Payout = {
      id: `payout-${Date.now()}`,
      partnerId,
      partnerName: partner.name,
      period: {
        start: new Date(Math.min(...commissions.map((c) => c.orderDate.getTime()))),
        end: new Date(Math.max(...commissions.map((c) => c.orderDate.getTime()))),
      },
      commissions: commissionIds,
      amount,
      currency: "BRL",
      status: "processing",
      method,
      createdAt: new Date(),
    };
    
    this.payouts.set(payout.id, payout);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    payout.status = "completed";
    payout.processedAt = new Date();
    payout.details = {
      transactionId: `txn-${Date.now()}`,
    };
    
    // Mark commissions as paid
    commissions.forEach((commission) => {
      commission.status = "paid";
      commission.paidAt = new Date();
      this.commissions.set(commission.id, commission);
    });
    
    this.payouts.set(payout.id, payout);
    return payout;
  }
  
  // Create Support Ticket
  createTicket(data: Omit<PartnerTicket, "id" | "createdAt" | "updatedAt" | "messages">): PartnerTicket {
    const ticket: PartnerTicket = {
      id: `ticket-${Date.now()}`,
      ...data,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.tickets.set(ticket.id, ticket);
    return ticket;
  }
  
  // Add Ticket Message
  addTicketMessage(
    ticketId: string,
    from: "partner" | "support",
    message: string,
    attachments?: string[]
  ): PartnerTicket | undefined {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) return undefined;
    
    ticket.messages.push({
      id: `msg-${Date.now()}`,
      from,
      message,
      attachments,
      timestamp: new Date(),
    });
    
    ticket.updatedAt = new Date();
    
    if (from === "support" && ticket.status === "open") {
      ticket.status = "in_progress";
    }
    
    this.tickets.set(ticketId, ticket);
    return ticket;
  }
  
  // Get Partner Analytics
  getAnalytics(partnerId: string, period: { start: Date; end: Date }): PartnerAnalytics {
    const partner = this.partners.get(partnerId);
    if (!partner) throw new Error("Partner not found");
    
    const orders = Array.from(this.orders.values()).filter(
      (o) => o.partnerId === partnerId && o.createdAt >= period.start && o.createdAt <= period.end
    );
    
    const commissions = Array.from(this.commissions.values()).filter(
      (c) => c.partnerId === partnerId && c.orderDate >= period.start && c.orderDate <= period.end
    );
    
    const totalRevenue = orders.reduce((sum, o) => sum + o.totals.total, 0);
    const totalCommission = commissions.reduce((sum, c) => sum + c.commissionAmount, 0);
    
    return {
      partnerId,
      period,
      sales: {
        totalOrders: orders.length,
        totalRevenue,
        totalCommission,
        avgOrderValue: totalRevenue / orders.length || 0,
        topProducts: this.getTopProducts(orders),
      },
      performance: {
        conversionRate: 3.5,
        returnRate: 2.5,
        avgDeliveryTime: 5,
        customerSatisfaction: 4.7,
      },
      traffic: {
        visits: 12500,
        clicks: 2850,
        referrals: 485,
      },
      trends: this.generateTrends(orders, period),
    };
  }
  
  private getTopProducts(orders: PartnerOrder[]): PartnerAnalytics["sales"]["topProducts"] {
    const productMap = new Map<string, { name: string; sales: number; revenue: number }>();
    
    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = productMap.get(item.productId) || {
          name: item.productName,
          sales: 0,
          revenue: 0,
        };
        
        existing.sales += item.quantity;
        existing.revenue += item.total;
        
        productMap.set(item.productId, existing);
      });
    });
    
    return Array.from(productMap.entries())
      .map(([productId, data]) => ({ productId, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }
  
  private generateTrends(
    orders: PartnerOrder[],
    period: { start: Date; end: Date }
  ): PartnerAnalytics["trends"] {
    const days = Math.ceil((period.end.getTime() - period.start.getTime()) / (1000 * 60 * 60 * 24));
    const trends: PartnerAnalytics["trends"] = [];
    
    for (let i = 0; i < days; i++) {
      const date = new Date(period.start);
      date.setDate(date.getDate() + i);
      
      const dayOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt);
        return orderDate.toDateString() === date.toDateString();
      });
      
      trends.push({
        date,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, o) => sum + o.totals.total, 0),
      });
    }
    
    return trends;
  }
  
  // Get Partner Dashboard
  getDashboard(partnerId: string): PartnerDashboard {
    const partner = this.partners.get(partnerId);
    if (!partner) throw new Error("Partner not found");
    
    const orders = Array.from(this.orders.values()).filter((o) => o.partnerId === partnerId);
    const commissions = Array.from(this.commissions.values()).filter((c) => c.partnerId === partnerId);
    const tickets = Array.from(this.tickets.values()).filter((t) => t.partnerId === partnerId);
    
    const pendingCommissions = commissions.filter((c) => c.status === "pending");
    const approvedCommissions = commissions.filter((c) => c.status === "approved");
    
    return {
      partner,
      summary: {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + o.totals.total, 0),
        pendingCommissions: pendingCommissions.reduce((sum, c) => sum + c.commissionAmount, 0),
        approvedCommissions: approvedCommissions.reduce((sum, c) => sum + c.commissionAmount, 0),
        openTickets: tickets.filter((t) => t.status === "open" || t.status === "in_progress").length,
      },
      recentOrders: orders.slice(-10),
      recentCommissions: commissions.slice(-10),
      recentTickets: tickets.slice(-5),
    };
  }
}

export interface PartnerDashboard {
  partner: Partner;
  summary: {
    totalOrders: number;
    totalRevenue: number;
    pendingCommissions: number;
    approvedCommissions: number;
    openTickets: number;
  };
  recentOrders: PartnerOrder[];
  recentCommissions: Commission[];
  recentTickets: PartnerTicket[];
}

// Sample Data
export function getPartnerSampleData(): {
  totalPartners: number;
  activePartners: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCommissions: number;
  avgCommissionRate: number;
} {
  return {
    totalPartners: 285,
    activePartners: 248,
    totalProducts: 4850,
    totalOrders: 12500,
    totalRevenue: 18500000,
    totalCommissions: 2775000,
    avgCommissionRate: 15,
  };
}

// Partner Tiers
export interface PartnerTier {
  name: "bronze" | "silver" | "gold" | "platinum";
  requirements: {
    minMonthlyRevenue: number;
    minOrders: number;
    minRating: number;
  };
  benefits: {
    commissionRate: number;
    prioritySupport: boolean;
    dedicatedManager: boolean;
    marketingSupport: boolean;
    customBranding: boolean;
  };
}

export function getPartnerTiers(): PartnerTier[] {
  return [
    {
      name: "bronze",
      requirements: {
        minMonthlyRevenue: 0,
        minOrders: 0,
        minRating: 0,
      },
      benefits: {
        commissionRate: 10,
        prioritySupport: false,
        dedicatedManager: false,
        marketingSupport: false,
        customBranding: false,
      },
    },
    {
      name: "silver",
      requirements: {
        minMonthlyRevenue: 50000,
        minOrders: 50,
        minRating: 4.0,
      },
      benefits: {
        commissionRate: 12,
        prioritySupport: true,
        dedicatedManager: false,
        marketingSupport: false,
        customBranding: false,
      },
    },
    {
      name: "gold",
      requirements: {
        minMonthlyRevenue: 150000,
        minOrders: 150,
        minRating: 4.5,
      },
      benefits: {
        commissionRate: 15,
        prioritySupport: true,
        dedicatedManager: true,
        marketingSupport: true,
        customBranding: false,
      },
    },
    {
      name: "platinum",
      requirements: {
        minMonthlyRevenue: 500000,
        minOrders: 500,
        minRating: 4.8,
      },
      benefits: {
        commissionRate: 18,
        prioritySupport: true,
        dedicatedManager: true,
        marketingSupport: true,
        customBranding: true,
      },
    },
  ];
}

// Partner Onboarding
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "skipped";
  required: boolean;
  order: number;
}

export function getOnboardingSteps(): OnboardingStep[] {
  return [
    {
      id: "step-1",
      title: "Complete Business Information",
      description: "Provide your business details and tax information",
      status: "pending",
      required: true,
      order: 1,
    },
    {
      id: "step-2",
      title: "Upload Documents",
      description: "Upload required legal documents and certificates",
      status: "pending",
      required: true,
      order: 2,
    },
    {
      id: "step-3",
      title: "Set Up Payment Method",
      description: "Configure how you want to receive payments",
      status: "pending",
      required: true,
      order: 3,
    },
    {
      id: "step-4",
      title: "Add Products",
      description: "Add your first products to the catalog",
      status: "pending",
      required: false,
      order: 4,
    },
    {
      id: "step-5",
      title: "Review Agreement",
      description: "Review and accept the partnership agreement",
      status: "pending",
      required: true,
      order: 5,
    },
  ];
}
