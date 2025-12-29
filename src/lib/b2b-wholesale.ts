// B2B Portal and Wholesale Management System

export interface B2BCustomer {
  id: string;
  companyName: string;
  tradeName: string;
  taxId: string; // CNPJ
  stateRegistration?: string;
  industry: string;
  companySize: "micro" | "small" | "medium" | "large" | "enterprise";
  email: string;
  phone: string;
  website?: string;
  logo?: string;
  status: "pending" | "active" | "suspended" | "inactive";
  tier: "bronze" | "silver" | "gold" | "platinum";
  creditLimit: number;
  creditUsed: number;
  paymentTerms: number; // days
  discount: number; // percentage
  addresses: B2BAddress[];
  contacts: B2BContact[];
  documents: B2BDocument[];
  settings: B2BSettings;
  metrics: B2BMetrics;
  createdAt: Date;
  approvedAt?: Date;
  lastOrderAt?: Date;
}

export interface B2BAddress {
  id: string;
  type: "billing" | "shipping" | "both";
  name: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface B2BContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  canOrder: boolean;
  canApprove: boolean;
}

export interface B2BDocument {
  id: string;
  type: "cnpj" | "state_registration" | "contract" | "financial" | "other";
  name: string;
  url: string;
  status: "pending" | "approved" | "rejected";
  uploadedAt: Date;
  verifiedAt?: Date;
}

export interface B2BSettings {
  autoApproveOrders: boolean;
  requirePO: boolean; // Purchase Order
  allowBackorder: boolean;
  minOrderValue: number;
  maxOrderValue?: number;
  preferredShippingMethod: string;
  invoiceDelivery: "email" | "portal" | "both";
  notifications: {
    orderConfirmation: boolean;
    shipmentUpdates: boolean;
    invoices: boolean;
    promotions: boolean;
  };
}

export interface B2BMetrics {
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  avgOrderFrequency: number; // days
  paymentOnTime: number; // percentage
  returnRate: number; // percentage
  lifetimeValue: number;
}

export interface WholesaleProduct {
  id: string;
  productId: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  retailPrice: number;
  wholesaleTiers: WholesaleTier[];
  moq: number; // Minimum Order Quantity
  packSize: number; // Units per pack
  leadTime: number; // days
  stock: number;
  images: string[];
  specifications: Record<string, string>;
  certifications?: string[];
  status: "active" | "inactive" | "discontinued";
}

export interface WholesaleTier {
  minQuantity: number;
  maxQuantity?: number;
  price: number;
  discount: number; // percentage off retail
}

export interface B2BOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  poNumber?: string; // Purchase Order Number
  items: B2BOrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  status:
    | "pending"
    | "approved"
    | "processing"
    | "shipped"
    | "delivered"
    | "canceled";
  paymentStatus: "pending" | "approved" | "paid" | "overdue" | "canceled";
  paymentMethod: "credit" | "bank_transfer" | "boleto" | "credit_card";
  paymentDueDate?: Date;
  shippingAddress: B2BAddress;
  billingAddress: B2BAddress;
  trackingCode?: string;
  invoice?: B2BInvoice;
  notes?: string;
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface B2BOrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  packSize: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
  total: number;
}

export interface B2BInvoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customerId: string;
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "sent" | "paid" | "overdue" | "canceled";
  paidAt?: Date;
  paymentMethod?: string;
  notes?: string;
  pdfUrl?: string;
}

export interface B2BQuote {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  items: B2BOrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  validUntil: Date;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  notes?: string;
  createdBy: string;
  createdAt: Date;
  acceptedAt?: Date;
}

export interface B2BContract {
  id: string;
  customerId: string;
  customerName: string;
  type: "annual" | "volume" | "exclusive" | "custom";
  startDate: Date;
  endDate: Date;
  terms: {
    minPurchase?: number; // annual minimum
    discount: number; // percentage
    paymentTerms: number; // days
    creditLimit: number;
    exclusiveProducts?: string[];
    volumeCommitment?: number;
  };
  status: "draft" | "active" | "expired" | "terminated";
  documentUrl?: string;
  signedAt?: Date;
  createdAt: Date;
}

// B2B Manager
export class B2BManager {
  private customers: Map<string, B2BCustomer> = new Map();
  private products: Map<string, WholesaleProduct> = new Map();
  private orders: Map<string, B2BOrder> = new Map();
  private quotes: Map<string, B2BQuote> = new Map();
  private contracts: Map<string, B2BContract> = new Map();
  
  // Customer Management
  registerCustomer(
    data: Omit<B2BCustomer, "id" | "createdAt" | "creditUsed" | "metrics">
  ): B2BCustomer {
    const customer: B2BCustomer = {
      id: `b2b-${Date.now()}`,
      ...data,
      creditUsed: 0,
      metrics: {
        totalOrders: 0,
        completedOrders: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
        avgOrderFrequency: 0,
        paymentOnTime: 100,
        returnRate: 0,
        lifetimeValue: 0,
      },
      createdAt: new Date(),
    };
    
    this.customers.set(customer.id, customer);
    return customer;
  }
  
  approveCustomer(customerId: string): B2BCustomer | undefined {
    const customer = this.customers.get(customerId);
    if (!customer) return undefined;
    
    customer.status = "active";
    customer.approvedAt = new Date();
    
    this.customers.set(customerId, customer);
    return customer;
  }
  
  updateCreditLimit(customerId: string, newLimit: number): B2BCustomer | undefined {
    const customer = this.customers.get(customerId);
    if (!customer) return undefined;
    
    customer.creditLimit = newLimit;
    this.customers.set(customerId, customer);
    return customer;
  }
  
  // Product Management
  addWholesaleProduct(
    data: Omit<WholesaleProduct, "id">
  ): WholesaleProduct {
    const product: WholesaleProduct = {
      id: `wholesale-${Date.now()}`,
      ...data,
    };
    
    this.products.set(product.id, product);
    return product;
  }
  
  calculateWholesalePrice(
    productId: string,
    quantity: number,
    customerTier?: string
  ): { unitPrice: number; discount: number; total: number } {
    const product = this.products.get(productId);
    if (!product) throw new Error("Product not found");
    
    // Find applicable tier
    const tier = product.wholesaleTiers
      .filter((t) => quantity >= t.minQuantity)
      .filter((t) => !t.maxQuantity || quantity <= t.maxQuantity)
      .sort((a, b) => b.discount - a.discount)[0];
    
    if (!tier) {
      return {
        unitPrice: product.retailPrice,
        discount: 0,
        total: product.retailPrice * quantity,
      };
    }
    
    // Apply customer tier discount
    let additionalDiscount = 0;
    if (customerTier === "platinum") additionalDiscount = 5;
    else if (customerTier === "gold") additionalDiscount = 3;
    else if (customerTier === "silver") additionalDiscount = 2;
    
    const totalDiscount = tier.discount + additionalDiscount;
    const unitPrice = product.retailPrice * (1 - totalDiscount / 100);
    
    return {
      unitPrice,
      discount: totalDiscount,
      total: unitPrice * quantity,
    };
  }
  
  // Quote Management
  createQuote(
    customerId: string,
    items: B2BOrderItem[],
    validDays: number = 30
  ): B2BQuote {
    const customer = this.customers.get(customerId);
    if (!customer) throw new Error("Customer not found");
    
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discount = subtotal * (customer.discount / 100);
    const tax = (subtotal - discount) * 0.1;
    const shipping = this.calculateB2BShipping(items, customer);
    const total = subtotal - discount + tax + shipping;
    
    const quote: B2BQuote = {
      id: `quote-${Date.now()}`,
      quoteNumber: `QT${Date.now().toString().slice(-8)}`,
      customerId,
      customerName: customer.companyName,
      items,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      validUntil: new Date(Date.now() + validDays * 24 * 60 * 60 * 1000),
      status: "draft",
      createdBy: "system",
      createdAt: new Date(),
    };
    
    this.quotes.set(quote.id, quote);
    return quote;
  }
  
  acceptQuote(quoteId: string): B2BOrder {
    const quote = this.quotes.get(quoteId);
    if (!quote) throw new Error("Quote not found");
    
    if (quote.status !== "sent") {
      throw new Error("Quote must be sent before acceptance");
    }
    
    if (new Date() > quote.validUntil) {
      throw new Error("Quote has expired");
    }
    
    quote.status = "accepted";
    quote.acceptedAt = new Date();
    this.quotes.set(quoteId, quote);
    
    // Create order from quote
    const customer = this.customers.get(quote.customerId);
    if (!customer) throw new Error("Customer not found");
    
    const order = this.createOrder(
      quote.customerId,
      quote.items,
      customer.addresses.find((a) => a.type === "shipping" || a.type === "both")!,
      customer.addresses.find((a) => a.type === "billing" || a.type === "both")!
    );
    
    return order;
  }
  
  // Order Management
  createOrder(
    customerId: string,
    items: B2BOrderItem[],
    shippingAddress: B2BAddress,
    billingAddress: B2BAddress,
    poNumber?: string
  ): B2BOrder {
    const customer = this.customers.get(customerId);
    if (!customer) throw new Error("Customer not found");
    
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discount = subtotal * (customer.discount / 100);
    const tax = (subtotal - discount) * 0.1;
    const shipping = this.calculateB2BShipping(items, customer);
    const total = subtotal - discount + tax + shipping;
    
    // Check credit limit
    if (customer.creditUsed + total > customer.creditLimit) {
      throw new Error("Credit limit exceeded");
    }
    
    const order: B2BOrder = {
      id: `b2b-order-${Date.now()}`,
      orderNumber: `B2B${Date.now().toString().slice(-8)}`,
      customerId,
      customerName: customer.companyName,
      poNumber,
      items,
      subtotal,
      discount,
      tax,
      shipping,
      total,
      status: customer.settings.autoApproveOrders ? "approved" : "pending",
      paymentStatus: "pending",
      paymentMethod: "credit",
      paymentDueDate: new Date(
        Date.now() + customer.paymentTerms * 24 * 60 * 60 * 1000
      ),
      shippingAddress,
      billingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.orders.set(order.id, order);
    
    // Update customer metrics
    customer.creditUsed += total;
    customer.metrics.totalOrders++;
    customer.lastOrderAt = new Date();
    this.customers.set(customerId, customer);
    
    return order;
  }
  
  approveOrder(orderId: string, approver: string): B2BOrder | undefined {
    const order = this.orders.get(orderId);
    if (!order) return undefined;
    
    order.status = "approved";
    order.approvedBy = approver;
    order.approvedAt = new Date();
    order.updatedAt = new Date();
    
    this.orders.set(orderId, order);
    return order;
  }
  
  generateInvoice(orderId: string): B2BInvoice {
    const order = this.orders.get(orderId);
    if (!order) throw new Error("Order not found");
    
    const customer = this.customers.get(order.customerId);
    if (!customer) throw new Error("Customer not found");
    
    const invoice: B2BInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV${Date.now().toString().slice(-8)}`,
      orderId: order.id,
      customerId: order.customerId,
      issueDate: new Date(),
      dueDate: order.paymentDueDate || new Date(),
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      status: "pending",
      pdfUrl: `/invoices/${order.orderNumber}.pdf`,
    };
    
    order.invoice = invoice;
    this.orders.set(orderId, order);
    
    return invoice;
  }
  
  private calculateB2BShipping(
    items: B2BOrderItem[],
    customer: B2BCustomer
  ): number {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Free shipping for large orders or premium tiers
    if (totalQuantity >= 100 || customer.tier === "platinum") {
      return 0;
    }
    
    // Discounted shipping for gold tier
    if (customer.tier === "gold") {
      return 50;
    }
    
    return 100;
  }
  
  // Contract Management
  createContract(
    customerId: string,
    type: B2BContract["type"],
    terms: B2BContract["terms"],
    duration: number // months
  ): B2BContract {
    const customer = this.customers.get(customerId);
    if (!customer) throw new Error("Customer not found");
    
    const contract: B2BContract = {
      id: `contract-${Date.now()}`,
      customerId,
      customerName: customer.companyName,
      type,
      startDate: new Date(),
      endDate: new Date(Date.now() + duration * 30 * 24 * 60 * 60 * 1000),
      terms,
      status: "draft",
      createdAt: new Date(),
    };
    
    this.contracts.set(contract.id, contract);
    return contract;
  }
  
  activateContract(contractId: string): B2BContract | undefined {
    const contract = this.contracts.get(contractId);
    if (!contract) return undefined;
    
    contract.status = "active";
    contract.signedAt = new Date();
    
    // Apply contract terms to customer
    const customer = this.customers.get(contract.customerId);
    if (customer) {
      customer.discount = contract.terms.discount;
      customer.paymentTerms = contract.terms.paymentTerms;
      customer.creditLimit = contract.terms.creditLimit;
      this.customers.set(customer.id, customer);
    }
    
    this.contracts.set(contractId, contract);
    return contract;
  }
  
  // Analytics
  getB2BAnalytics(customerId?: string): B2BAnalytics {
    let orders = Array.from(this.orders.values());
    
    if (customerId) {
      orders = orders.filter((o) => o.customerId === customerId);
    }
    
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter((o) => o.createdAt >= last30Days);
    
    return {
      customers: {
        total: this.customers.size,
        active: Array.from(this.customers.values()).filter(
          (c) => c.status === "active"
        ).length,
        pending: Array.from(this.customers.values()).filter(
          (c) => c.status === "pending"
        ).length,
      },
      orders: {
        total: recentOrders.length,
        approved: recentOrders.filter((o) => o.status === "approved").length,
        pending: recentOrders.filter((o) => o.status === "pending").length,
        avgOrderValue: recentOrders.reduce((sum, o) => sum + o.total, 0) / recentOrders.length || 0,
      },
      revenue: {
        total: recentOrders.reduce((sum, o) => sum + o.total, 0),
        paid: recentOrders
          .filter((o) => o.paymentStatus === "paid")
          .reduce((sum, o) => sum + o.total, 0),
        pending: recentOrders
          .filter((o) => o.paymentStatus === "pending")
          .reduce((sum, o) => sum + o.total, 0),
      },
      topCustomers: this.getTopCustomers(5),
      topProducts: this.getTopB2BProducts(5),
    };
  }
  
  private getTopCustomers(limit: number): {
    customerId: string;
    companyName: string;
    revenue: number;
    orders: number;
  }[] {
    return Array.from(this.customers.values())
      .sort((a, b) => b.metrics.totalRevenue - a.metrics.totalRevenue)
      .slice(0, limit)
      .map((c) => ({
        customerId: c.id,
        companyName: c.companyName,
        revenue: c.metrics.totalRevenue,
        orders: c.metrics.totalOrders,
      }));
  }
  
  private getTopB2BProducts(limit: number): {
    productId: string;
    productName: string;
    sales: number;
    revenue: number;
  }[] {
    const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
    
    Array.from(this.orders.values()).forEach((order) => {
      order.items.forEach((item) => {
        const existing = productSales.get(item.productId) || {
          name: item.productName,
          quantity: 0,
          revenue: 0,
        };
        existing.quantity += item.quantity;
        existing.revenue += item.total;
        productSales.set(item.productId, existing);
      });
    });
    
    return Array.from(productSales.entries())
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, limit)
      .map(([productId, data]) => ({
        productId,
        productName: data.name,
        sales: data.quantity,
        revenue: data.revenue,
      }));
  }
}

export interface B2BAnalytics {
  customers: {
    total: number;
    active: number;
    pending: number;
  };
  orders: {
    total: number;
    approved: number;
    pending: number;
    avgOrderValue: number;
  };
  revenue: {
    total: number;
    paid: number;
    pending: number;
  };
  topCustomers: {
    customerId: string;
    companyName: string;
    revenue: number;
    orders: number;
  }[];
  topProducts: {
    productId: string;
    productName: string;
    sales: number;
    revenue: number;
  }[];
}

// Sample Data
export function getB2BAnalyticsSample(): B2BAnalytics {
  return {
    customers: {
      total: 485,
      active: 425,
      pending: 45,
    },
    orders: {
      total: 2850,
      approved: 2650,
      pending: 200,
      avgOrderValue: 4850.5,
    },
    revenue: {
      total: 13824925,
      paid: 11850000,
      pending: 1974925,
    },
    topCustomers: [
      {
        customerId: "b2b-001",
        companyName: "Distribuidora Wellness LTDA",
        revenue: 2850000,
        orders: 485,
      },
      {
        customerId: "b2b-002",
        companyName: "Rede Pet Care Brasil",
        revenue: 1985000,
        orders: 385,
      },
      {
        customerId: "b2b-003",
        companyName: "Aromas & Cia Distribuição",
        revenue: 1650000,
        orders: 325,
      },
    ],
    topProducts: [
      {
        productId: "wholesale-001",
        productName: "Difusor Aromático - Caixa 12un",
        sales: 8500,
        revenue: 985000,
      },
      {
        productId: "wholesale-002",
        productName: "Kit Aromaterapia - Caixa 6un",
        sales: 6500,
        revenue: 785000,
      },
      {
        productId: "wholesale-003",
        productName: "Óleo Essencial Lavanda - Caixa 24un",
        sales: 12500,
        revenue: 625000,
      },
    ],
  };
}

// Customer Tiers
export function getB2BCustomerTiers(): {
  tier: string;
  minAnnualPurchase: number;
  discount: number;
  creditLimit: number;
  paymentTerms: number;
  benefits: string[];
}[] {
  return [
    {
      tier: "Bronze",
      minAnnualPurchase: 0,
      discount: 5,
      creditLimit: 10000,
      paymentTerms: 15,
      benefits: ["5% desconto", "15 dias para pagamento", "Catálogo completo"],
    },
    {
      tier: "Silver",
      minAnnualPurchase: 50000,
      discount: 10,
      creditLimit: 30000,
      paymentTerms: 30,
      benefits: [
        "10% desconto",
        "30 dias para pagamento",
        "Frete reduzido",
        "Gerente de conta",
      ],
    },
    {
      tier: "Gold",
      minAnnualPurchase: 150000,
      discount: 15,
      creditLimit: 75000,
      paymentTerms: 45,
      benefits: [
        "15% desconto",
        "45 dias para pagamento",
        "Frete grátis acima de R$ 5.000",
        "Produtos exclusivos",
        "Suporte prioritário",
      ],
    },
    {
      tier: "Platinum",
      minAnnualPurchase: 500000,
      discount: 20,
      creditLimit: 200000,
      paymentTerms: 60,
      benefits: [
        "20% desconto",
        "60 dias para pagamento",
        "Frete grátis sempre",
        "Linha exclusiva",
        "Gerente dedicado",
        "Customização de produtos",
        "Campanhas co-marketing",
      ],
    },
  ];
}
