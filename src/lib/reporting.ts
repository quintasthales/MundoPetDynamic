// Advanced Reporting and Analytics System

export interface DateRange {
  start: Date;
  end: Date;
  compare?: {
    start: Date;
    end: Date;
  };
}

export interface SalesReport {
  period: DateRange;
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalItems: number;
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
  };
  comparison?: {
    revenue: { value: number; change: number };
    orders: { value: number; change: number };
    aov: { value: number; change: number };
    customers: { value: number; change: number };
  };
  trends: {
    date: string;
    revenue: number;
    orders: number;
    customers: number;
  }[];
  topProducts: {
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
    orders: number;
  }[];
  topCategories: {
    category: string;
    revenue: number;
    orders: number;
    percentage: number;
  }[];
}

export interface CustomerReport {
  period: DateRange;
  metrics: {
    totalCustomers: number;
    newCustomers: number;
    activeCustomers: number;
    churnedCustomers: number;
    retentionRate: number;
    churnRate: number;
    lifetimeValue: number;
  };
  acquisition: {
    channel: string;
    customers: number;
    cost: number;
    cac: number; // Customer Acquisition Cost
    ltv: number; // Lifetime Value
    ltvCacRatio: number;
  }[];
  segments: {
    segmentId: string;
    segmentName: string;
    customers: number;
    revenue: number;
    percentage: number;
  }[];
  geography: {
    country: string;
    state?: string;
    city?: string;
    customers: number;
    revenue: number;
  }[];
}

export interface ProductReport {
  period: DateRange;
  products: {
    productId: string;
    productName: string;
    category: string;
    sku: string;
    unitsSold: number;
    revenue: number;
    averagePrice: number;
    profit: number;
    profitMargin: number;
    stockLevel: number;
    turnoverRate: number;
    returnsRate: number;
  }[];
  categories: {
    category: string;
    products: number;
    revenue: number;
    profit: number;
    percentage: number;
  }[];
  inventory: {
    totalValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    overstockItems: number;
    turnoverRate: number;
  };
}

export interface MarketingReport {
  period: DateRange;
  campaigns: {
    campaignId: string;
    campaignName: string;
    type: string;
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
    revenue: number;
    cost: number;
    roi: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
  }[];
  channels: {
    channel: string;
    sessions: number;
    conversions: number;
    revenue: number;
    cost: number;
    roas: number; // Return on Ad Spend
  }[];
  abandonedCarts: {
    total: number;
    recovered: number;
    recoveryRate: number;
    lostRevenue: number;
    recoveredRevenue: number;
  };
  referrals: {
    totalReferrals: number;
    conversions: number;
    revenue: number;
    commissionPaid: number;
  };
}

export interface FinancialReport {
  period: DateRange;
  revenue: {
    gross: number;
    net: number;
    refunds: number;
    discounts: number;
  };
  costs: {
    products: number;
    shipping: number;
    marketing: number;
    operations: number;
    total: number;
  };
  profit: {
    gross: number;
    net: number;
    margin: number;
  };
  taxes: {
    collected: number;
    owed: number;
  };
  cashFlow: {
    date: string;
    inflow: number;
    outflow: number;
    balance: number;
  }[];
  paymentMethods: {
    method: string;
    transactions: number;
    amount: number;
    percentage: number;
    fees: number;
  }[];
}

// Generate sales report
export function generateSalesReport(period: DateRange): SalesReport {
  // Mock data - in production, query from database
  return {
    period,
    metrics: {
      totalRevenue: 125678.5,
      totalOrders: 1234,
      averageOrderValue: 101.85,
      totalItems: 3456,
      totalCustomers: 987,
      newCustomers: 234,
      returningCustomers: 753,
    },
    comparison: {
      revenue: { value: 98765.3, change: 27.3 },
      orders: { value: 1001, change: 23.3 },
      aov: { value: 98.67, change: 3.2 },
      customers: { value: 845, change: 16.8 },
    },
    trends: [
      { date: "2024-12-01", revenue: 4567.8, orders: 45, customers: 38 },
      { date: "2024-12-02", revenue: 5234.2, orders: 52, customers: 43 },
      { date: "2024-12-03", revenue: 4891.5, orders: 48, customers: 40 },
      // ... more days
    ],
    topProducts: [
      {
        productId: "difusor-aromatico",
        productName: "Difusor Aromático Ultrassônico Zen",
        quantity: 156,
        revenue: 20264.4,
        orders: 156,
      },
      {
        productId: "coleira-led",
        productName: "Coleira LED Recarregável",
        quantity: 234,
        revenue: 11676.6,
        orders: 189,
      },
      {
        productId: "shampoo-natural",
        productName: "Shampoo Natural Pet Care",
        quantity: 345,
        revenue: 12040.5,
        orders: 267,
      },
    ],
    topCategories: [
      {
        category: "Higiene e Beleza",
        revenue: 45678.9,
        orders: 456,
        percentage: 36.3,
      },
      {
        category: "Acessórios",
        revenue: 38765.4,
        orders: 389,
        percentage: 30.8,
      },
      {
        category: "Alimentação",
        revenue: 28234.2,
        orders: 289,
        percentage: 22.5,
      },
    ],
  };
}

// Generate customer report
export function generateCustomerReport(period: DateRange): CustomerReport {
  return {
    period,
    metrics: {
      totalCustomers: 5678,
      newCustomers: 456,
      activeCustomers: 2345,
      churnedCustomers: 234,
      retentionRate: 78.5,
      churnRate: 4.1,
      lifetimeValue: 456.78,
    },
    acquisition: [
      {
        channel: "Organic Search",
        customers: 234,
        cost: 5000,
        cac: 21.37,
        ltv: 456.78,
        ltvCacRatio: 21.4,
      },
      {
        channel: "Social Media",
        customers: 189,
        cost: 8500,
        cac: 44.97,
        ltv: 389.45,
        ltvCacRatio: 8.7,
      },
      {
        channel: "Email Marketing",
        customers: 156,
        cost: 1200,
        cac: 7.69,
        ltv: 523.67,
        ltvCacRatio: 68.1,
      },
      {
        channel: "Referral",
        customers: 98,
        cost: 2450,
        cac: 25.0,
        ltv: 678.9,
        ltvCacRatio: 27.2,
      },
    ],
    segments: [
      {
        segmentId: "seg-vip",
        segmentName: "VIP Customers",
        customers: 234,
        revenue: 56789.0,
        percentage: 45.2,
      },
      {
        segmentId: "seg-loyal",
        segmentName: "Loyal Customers",
        customers: 345,
        revenue: 38765.0,
        percentage: 30.8,
      },
      {
        segmentId: "seg-new",
        segmentName: "New Customers",
        customers: 789,
        revenue: 19876.0,
        percentage: 15.8,
      },
    ],
    geography: [
      {
        country: "BR",
        state: "SP",
        city: "São Paulo",
        customers: 1234,
        revenue: 45678.9,
      },
      {
        country: "BR",
        state: "RJ",
        city: "Rio de Janeiro",
        customers: 789,
        revenue: 28765.4,
      },
      {
        country: "BR",
        state: "MG",
        city: "Belo Horizonte",
        customers: 456,
        revenue: 16543.2,
      },
    ],
  };
}

// Generate product report
export function generateProductReport(period: DateRange): ProductReport {
  return {
    period,
    products: [
      {
        productId: "difusor-aromatico",
        productName: "Difusor Aromático",
        category: "Casa e Ambiente",
        sku: "DA-001",
        unitsSold: 156,
        revenue: 20264.4,
        averagePrice: 129.9,
        profit: 10132.2,
        profitMargin: 50.0,
        stockLevel: 45,
        turnoverRate: 3.47,
        returnsRate: 2.1,
      },
      {
        productId: "coleira-led",
        productName: "Coleira LED",
        category: "Acessórios",
        sku: "CL-002",
        unitsSold: 234,
        revenue: 11676.6,
        averagePrice: 49.9,
        profit: 6405.8,
        profitMargin: 54.9,
        stockLevel: 15,
        turnoverRate: 15.6,
        returnsRate: 1.3,
      },
    ],
    categories: [
      {
        category: "Higiene e Beleza",
        products: 45,
        revenue: 45678.9,
        profit: 22839.5,
        percentage: 36.3,
      },
      {
        category: "Acessórios",
        products: 67,
        revenue: 38765.4,
        profit: 19382.7,
        percentage: 30.8,
      },
    ],
    inventory: {
      totalValue: 87654.32,
      lowStockItems: 12,
      outOfStockItems: 3,
      overstockItems: 8,
      turnoverRate: 4.2,
    },
  };
}

// Generate marketing report
export function generateMarketingReport(period: DateRange): MarketingReport {
  return {
    period,
    campaigns: [
      {
        campaignId: "camp-001",
        campaignName: "Win-Back Campaign",
        type: "Email",
        sent: 456,
        opened: 223,
        clicked: 89,
        converted: 34,
        revenue: 4567.8,
        cost: 45.6,
        roi: 9915.4,
        openRate: 48.9,
        clickRate: 39.9,
        conversionRate: 7.5,
      },
      {
        campaignId: "camp-002",
        campaignName: "VIP Exclusive",
        type: "Email",
        sent: 234,
        opened: 198,
        clicked: 145,
        converted: 67,
        revenue: 16453.2,
        cost: 23.4,
        roi: 70217.5,
        openRate: 84.6,
        clickRate: 73.2,
        conversionRate: 28.6,
      },
    ],
    channels: [
      {
        channel: "Google Ads",
        sessions: 5678,
        conversions: 234,
        revenue: 28765.4,
        cost: 4567.8,
        roas: 6.3,
      },
      {
        channel: "Facebook Ads",
        sessions: 4567,
        conversions: 189,
        revenue: 23456.7,
        cost: 3456.7,
        roas: 6.8,
      },
      {
        channel: "Instagram Ads",
        sessions: 3456,
        conversions: 156,
        revenue: 19876.5,
        cost: 2345.6,
        roas: 8.5,
      },
    ],
    abandonedCarts: {
      total: 567,
      recovered: 156,
      recoveryRate: 27.5,
      lostRevenue: 45678.9,
      recoveredRevenue: 12567.8,
    },
    referrals: {
      totalReferrals: 234,
      conversions: 156,
      revenue: 19876.5,
      commissionPaid: 1987.65,
    },
  };
}

// Generate financial report
export function generateFinancialReport(period: DateRange): FinancialReport {
  return {
    period,
    revenue: {
      gross: 125678.5,
      net: 118765.4,
      refunds: 3456.7,
      discounts: 3456.4,
    },
    costs: {
      products: 62839.25,
      shipping: 8765.43,
      marketing: 12345.67,
      operations: 15678.9,
      total: 99629.25,
    },
    profit: {
      gross: 62839.25,
      net: 19136.15,
      margin: 15.2,
    },
    taxes: {
      collected: 12567.85,
      owed: 3820.83,
    },
    cashFlow: [
      {
        date: "2024-12-01",
        inflow: 4567.8,
        outflow: 2345.6,
        balance: 2222.2,
      },
      {
        date: "2024-12-02",
        inflow: 5234.2,
        outflow: 2678.9,
        balance: 2555.3,
      },
    ],
    paymentMethods: [
      {
        method: "Credit Card",
        transactions: 789,
        amount: 78965.4,
        percentage: 62.8,
        fees: 2368.96,
      },
      {
        method: "PIX",
        transactions: 345,
        amount: 34567.8,
        percentage: 27.5,
        fees: 0,
      },
      {
        method: "Boleto",
        transactions: 100,
        amount: 12145.3,
        percentage: 9.7,
        fees: 364.36,
      },
    ],
  };
}

// Dashboard KPIs
export interface DashboardKPIs {
  today: {
    revenue: number;
    orders: number;
    visitors: number;
    conversionRate: number;
  };
  thisMonth: {
    revenue: number;
    orders: number;
    customers: number;
    averageOrderValue: number;
  };
  trends: {
    revenue: number; // % change
    orders: number; // % change
    customers: number; // % change
    conversionRate: number; // % change
  };
  goals: {
    revenueGoal: number;
    revenueActual: number;
    revenueProgress: number;
    ordersGoal: number;
    ordersActual: number;
    ordersProgress: number;
  };
}

export function getDashboardKPIs(): DashboardKPIs {
  return {
    today: {
      revenue: 4567.8,
      orders: 45,
      visitors: 1234,
      conversionRate: 3.65,
    },
    thisMonth: {
      revenue: 125678.5,
      orders: 1234,
      customers: 987,
      averageOrderValue: 101.85,
    },
    trends: {
      revenue: 27.3,
      orders: 23.3,
      customers: 16.8,
      conversionRate: 5.2,
    },
    goals: {
      revenueGoal: 150000,
      revenueActual: 125678.5,
      revenueProgress: 83.8,
      ordersGoal: 1500,
      ordersActual: 1234,
      ordersProgress: 82.3,
    },
  };
}

// Export reports
export interface ExportOptions {
  format: "csv" | "xlsx" | "pdf";
  includeCharts: boolean;
  dateRange: DateRange;
}

export function exportReport(
  reportType: "sales" | "customers" | "products" | "marketing" | "financial",
  options: ExportOptions
): string {
  // In production, generate actual file
  const filename = `${reportType}-report-${Date.now()}.${options.format}`;
  console.log(`Exporting ${reportType} report as ${options.format}:`, filename);
  return `/exports/${filename}`;
}

// Real-time analytics
export interface RealtimeMetrics {
  activeUsers: number;
  activeOrders: number;
  revenueToday: number;
  ordersToday: number;
  topPages: {
    path: string;
    views: number;
    uniqueVisitors: number;
  }[];
  recentOrders: {
    orderId: string;
    amount: number;
    timestamp: Date;
  }[];
  recentSignups: {
    userId: string;
    email: string;
    timestamp: Date;
  }[];
}

export function getRealtimeMetrics(): RealtimeMetrics {
  return {
    activeUsers: 45,
    activeOrders: 12,
    revenueToday: 4567.8,
    ordersToday: 45,
    topPages: [
      { path: "/", views: 234, uniqueVisitors: 189 },
      { path: "/produtos", views: 156, uniqueVisitors: 123 },
      { path: "/produto/difusor-aromatico", views: 89, uniqueVisitors: 78 },
    ],
    recentOrders: [
      {
        orderId: "ORD-001",
        amount: 129.9,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        orderId: "ORD-002",
        amount: 249.8,
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
      },
    ],
    recentSignups: [
      {
        userId: "USR-001",
        email: "novo@example.com",
        timestamp: new Date(Date.now() - 8 * 60 * 1000),
      },
    ],
  };
}

// Predictive analytics
export interface Predictions {
  nextMonthRevenue: {
    predicted: number;
    confidence: number;
    range: { min: number; max: number };
  };
  churnRisk: {
    customerId: string;
    email: string;
    riskScore: number;
    factors: string[];
  }[];
  stockouts: {
    productId: string;
    productName: string;
    daysUntilStockout: number;
    recommendedReorder: number;
  }[];
  opportunities: {
    type: string;
    description: string;
    potentialRevenue: number;
    effort: "low" | "medium" | "high";
  }[];
}

export function getPredictions(): Predictions {
  return {
    nextMonthRevenue: {
      predicted: 145678.5,
      confidence: 87.5,
      range: { min: 135000, max: 156000 },
    },
    churnRisk: [
      {
        customerId: "USR-123",
        email: "cliente@example.com",
        riskScore: 78.5,
        factors: [
          "No purchase in 90 days",
          "Low email engagement",
          "Cart abandonment",
        ],
      },
    ],
    stockouts: [
      {
        productId: "shampoo-natural",
        productName: "Shampoo Natural",
        daysUntilStockout: 5,
        recommendedReorder: 50,
      },
    ],
    opportunities: [
      {
        type: "Cross-sell",
        description: "Customers who bought Difusor often buy Óleos Essenciais",
        potentialRevenue: 12345.67,
        effort: "low",
      },
      {
        type: "Win-back",
        description: "234 at-risk customers could be recovered with 20% discount",
        potentialRevenue: 28765.43,
        effort: "medium",
      },
    ],
  };
}
