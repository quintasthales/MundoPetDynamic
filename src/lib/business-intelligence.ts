// Business Intelligence and Advanced Reporting System

export interface DashboardMetrics {
  revenue: {
    today: number;
    yesterday: number;
    thisWeek: number;
    lastWeek: number;
    thisMonth: number;
    lastMonth: number;
    thisYear: number;
    lastYear: number;
    growth: {
      daily: number;
      weekly: number;
      monthly: number;
      yearly: number;
    };
  };
  orders: {
    today: number;
    pending: number;
    processing: number;
    completed: number;
    cancelled: number;
    totalValue: number;
    averageValue: number;
    conversionRate: number;
  };
  customers: {
    total: number;
    new: number;
    returning: number;
    active: number;
    churnRate: number;
    lifetimeValue: number;
    acquisitionCost: number;
  };
  products: {
    total: number;
    inStock: number;
    lowStock: number;
    outOfStock: number;
    topSelling: {
      id: string;
      name: string;
      sales: number;
      revenue: number;
    }[];
  };
  traffic: {
    visitors: number;
    pageViews: number;
    bounceRate: number;
    avgSessionDuration: number;
    sources: {
      source: string;
      visitors: number;
      percentage: number;
    }[];
  };
}

export interface SalesReport {
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    totalItems: number;
    totalCustomers: number;
  };
  byDay: {
    date: Date;
    revenue: number;
    orders: number;
    customers: number;
  }[];
  byProduct: {
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
    profit: number;
  }[];
  byCategory: {
    category: string;
    revenue: number;
    orders: number;
    percentage: number;
  }[];
  byPaymentMethod: {
    method: string;
    orders: number;
    revenue: number;
    percentage: number;
  }[];
  byRegion: {
    state: string;
    orders: number;
    revenue: number;
    customers: number;
  }[];
}

export interface CustomerReport {
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
    churnedCustomers: number;
    averageLifetimeValue: number;
  };
  segments: {
    segment: string;
    customers: number;
    revenue: number;
    averageOrderValue: number;
  }[];
  cohorts: {
    cohort: string;
    size: number;
    retention: number[];
    revenue: number;
  }[];
  rfm: {
    segment: string;
    recency: number;
    frequency: number;
    monetary: number;
    customers: number;
  }[];
  topCustomers: {
    customerId: string;
    name: string;
    orders: number;
    revenue: number;
    lifetimeValue: number;
  }[];
}

export interface ProductReport {
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalProducts: number;
    totalSales: number;
    totalRevenue: number;
    averagePrice: number;
  };
  topSellers: {
    productId: string;
    name: string;
    sales: number;
    revenue: number;
    profit: number;
    margin: number;
  }[];
  lowPerformers: {
    productId: string;
    name: string;
    sales: number;
    daysInStock: number;
    turnoverRate: number;
  }[];
  byCategory: {
    category: string;
    products: number;
    sales: number;
    revenue: number;
  }[];
  inventory: {
    productId: string;
    name: string;
    stock: number;
    value: number;
    turnover: number;
    reorderPoint: number;
  }[];
}

export interface MarketingReport {
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    totalSpend: number;
    totalRevenue: number;
    roi: number;
    cac: number; // Customer Acquisition Cost
    ltv: number; // Lifetime Value
    ltvCacRatio: number;
  };
  campaigns: {
    campaignId: string;
    name: string;
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    roi: number;
  }[];
  channels: {
    channel: string;
    spend: number;
    orders: number;
    revenue: number;
    roi: number;
  }[];
  coupons: {
    code: string;
    uses: number;
    discount: number;
    revenue: number;
    roi: number;
  }[];
}

export interface FinancialReport {
  period: {
    start: Date;
    end: Date;
  };
  income: {
    grossRevenue: number;
    discounts: number;
    refunds: number;
    netRevenue: number;
  };
  expenses: {
    cogs: number; // Cost of Goods Sold
    shipping: number;
    marketing: number;
    operations: number;
    paymentFees: number;
    other: number;
    total: number;
  };
  profit: {
    gross: number;
    net: number;
    margin: number;
  };
  cashFlow: {
    beginning: number;
    inflows: number;
    outflows: number;
    ending: number;
  };
  taxes: {
    sales: number;
    income: number;
    total: number;
  };
}

export interface ForecastReport {
  period: {
    start: Date;
    end: Date;
  };
  revenue: {
    predicted: number;
    confidence: {
      low: number;
      high: number;
    };
    trend: "up" | "down" | "stable";
    factors: string[];
  };
  orders: {
    predicted: number;
    byDay: {
      date: Date;
      predicted: number;
      confidence: number;
    }[];
  };
  inventory: {
    productId: string;
    name: string;
    currentStock: number;
    predictedDemand: number;
    reorderDate: Date;
    reorderQuantity: number;
  }[];
  cashFlow: {
    predicted: number;
    breakdown: {
      date: Date;
      inflows: number;
      outflows: number;
      balance: number;
    }[];
  };
}

// Mock data generation
function generateMockDashboardMetrics(): DashboardMetrics {
  return {
    revenue: {
      today: 15420.50,
      yesterday: 12350.30,
      thisWeek: 87540.20,
      lastWeek: 78230.10,
      thisMonth: 342150.80,
      lastMonth: 298450.60,
      thisYear: 3245678.90,
      lastYear: 2456789.10,
      growth: {
        daily: 24.8,
        weekly: 11.9,
        monthly: 14.6,
        yearly: 32.1,
      },
    },
    orders: {
      today: 45,
      pending: 12,
      processing: 28,
      completed: 1234,
      cancelled: 23,
      totalValue: 342150.80,
      averageValue: 277.20,
      conversionRate: 3.2,
    },
    customers: {
      total: 5678,
      new: 234,
      returning: 1456,
      active: 2345,
      churnRate: 4.5,
      lifetimeValue: 1234.56,
      acquisitionCost: 45.67,
    },
    products: {
      total: 456,
      inStock: 389,
      lowStock: 45,
      outOfStock: 22,
      topSelling: [
        {
          id: "prod-001",
          name: "Difusor Aromático Ultrassônico Zen",
          sales: 234,
          revenue: 30420.00,
        },
        {
          id: "prod-002",
          name: "Kit Aromaterapia Completo",
          sales: 189,
          revenue: 28350.00,
        },
      ],
    },
    traffic: {
      visitors: 12345,
      pageViews: 45678,
      bounceRate: 42.3,
      avgSessionDuration: 245,
      sources: [
        { source: "Organic", visitors: 5432, percentage: 44.0 },
        { source: "Direct", visitors: 3456, percentage: 28.0 },
        { source: "Social", visitors: 2345, percentage: 19.0 },
        { source: "Paid", visitors: 1112, percentage: 9.0 },
      ],
    },
  };
}

export function getDashboardMetrics(): DashboardMetrics {
  return generateMockDashboardMetrics();
}

export function generateSalesReport(
  startDate: Date,
  endDate: Date
): SalesReport {
  // Mock implementation
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const byDay = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    byDay.push({
      date,
      revenue: Math.random() * 10000 + 5000,
      orders: Math.floor(Math.random() * 50) + 20,
      customers: Math.floor(Math.random() * 30) + 10,
    });
  }

  const totalRevenue = byDay.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = byDay.reduce((sum, day) => sum + day.orders, 0);

  return {
    period: { start: startDate, end: endDate },
    summary: {
      totalRevenue,
      totalOrders,
      averageOrderValue: totalRevenue / totalOrders,
      totalItems: totalOrders * 2.5,
      totalCustomers: Math.floor(totalOrders * 0.7),
    },
    byDay,
    byProduct: [
      {
        productId: "prod-001",
        productName: "Difusor Aromático",
        quantity: 234,
        revenue: 30420.00,
        profit: 15210.00,
      },
    ],
    byCategory: [
      {
        category: "Aromaterapia",
        revenue: 125430.00,
        orders: 456,
        percentage: 45.2,
      },
      {
        category: "Bem-estar",
        revenue: 98760.00,
        orders: 389,
        percentage: 35.6,
      },
    ],
    byPaymentMethod: [
      {
        method: "PIX",
        orders: 234,
        revenue: 65432.10,
        percentage: 42.0,
      },
      {
        method: "Cartão de Crédito",
        orders: 456,
        revenue: 127890.50,
        percentage: 58.0,
      },
    ],
    byRegion: [
      {
        state: "SP",
        orders: 456,
        revenue: 125430.00,
        customers: 234,
      },
      {
        state: "RJ",
        orders: 234,
        revenue: 65432.10,
        customers: 123,
      },
    ],
  };
}

export function generateCustomerReport(
  startDate: Date,
  endDate: Date
): CustomerReport {
  return {
    period: { start: startDate, end: endDate },
    summary: {
      totalCustomers: 5678,
      newCustomers: 234,
      returningCustomers: 1456,
      churnedCustomers: 123,
      averageLifetimeValue: 1234.56,
    },
    segments: [
      {
        segment: "VIP",
        customers: 234,
        revenue: 125430.00,
        averageOrderValue: 536.00,
      },
      {
        segment: "Regular",
        customers: 1456,
        revenue: 345670.00,
        averageOrderValue: 237.00,
      },
      {
        segment: "New",
        customers: 789,
        revenue: 98760.00,
        averageOrderValue: 125.00,
      },
    ],
    cohorts: [
      {
        cohort: "2024-01",
        size: 234,
        retention: [100, 45, 32, 28, 25, 23],
        revenue: 125430.00,
      },
    ],
    rfm: [
      {
        segment: "Champions",
        recency: 1,
        frequency: 5,
        monetary: 1000,
        customers: 234,
      },
      {
        segment: "Loyal",
        recency: 2,
        frequency: 4,
        monetary: 500,
        customers: 456,
      },
    ],
    topCustomers: [
      {
        customerId: "cust-001",
        name: "João Silva",
        orders: 45,
        revenue: 12345.67,
        lifetimeValue: 15000.00,
      },
    ],
  };
}

export function generateProductReport(
  startDate: Date,
  endDate: Date
): ProductReport {
  return {
    period: { start: startDate, end: endDate },
    summary: {
      totalProducts: 456,
      totalSales: 12345,
      totalRevenue: 342150.80,
      averagePrice: 27.72,
    },
    topSellers: [
      {
        productId: "prod-001",
        name: "Difusor Aromático Ultrassônico Zen",
        sales: 234,
        revenue: 30420.00,
        profit: 15210.00,
        margin: 50.0,
      },
    ],
    lowPerformers: [
      {
        productId: "prod-099",
        name: "Produto com baixa venda",
        sales: 3,
        daysInStock: 180,
        turnoverRate: 0.5,
      },
    ],
    byCategory: [
      {
        category: "Aromaterapia",
        products: 123,
        sales: 5678,
        revenue: 125430.00,
      },
    ],
    inventory: [
      {
        productId: "prod-001",
        name: "Difusor Aromático",
        stock: 45,
        value: 5850.00,
        turnover: 12.5,
        reorderPoint: 20,
      },
    ],
  };
}

export function generateMarketingReport(
  startDate: Date,
  endDate: Date
): MarketingReport {
  const totalSpend = 25000.00;
  const totalRevenue = 125000.00;
  const cac = 45.67;
  const ltv = 1234.56;

  return {
    period: { start: startDate, end: endDate },
    summary: {
      totalSpend,
      totalRevenue,
      roi: ((totalRevenue - totalSpend) / totalSpend) * 100,
      cac,
      ltv,
      ltvCacRatio: ltv / cac,
    },
    campaigns: [
      {
        campaignId: "camp-001",
        name: "Black Friday 2024",
        spend: 10000.00,
        impressions: 500000,
        clicks: 12500,
        conversions: 456,
        revenue: 65432.10,
        roi: 554.3,
      },
    ],
    channels: [
      {
        channel: "Google Ads",
        spend: 12000.00,
        orders: 456,
        revenue: 65432.10,
        roi: 445.3,
      },
      {
        channel: "Facebook Ads",
        spend: 8000.00,
        orders: 234,
        revenue: 32150.50,
        roi: 301.9,
      },
    ],
    coupons: [
      {
        code: "BEMVINDO10",
        uses: 234,
        discount: 2340.00,
        revenue: 23400.00,
        roi: 900.0,
      },
    ],
  };
}

export function generateFinancialReport(
  startDate: Date,
  endDate: Date
): FinancialReport {
  const grossRevenue = 342150.80;
  const discounts = 15000.00;
  const refunds = 5000.00;
  const netRevenue = grossRevenue - discounts - refunds;

  const cogs = 150000.00;
  const shipping = 25000.00;
  const marketing = 25000.00;
  const operations = 30000.00;
  const paymentFees = 12000.00;
  const other = 5000.00;
  const totalExpenses = cogs + shipping + marketing + operations + paymentFees + other;

  const grossProfit = netRevenue - cogs;
  const netProfit = netRevenue - totalExpenses;

  return {
    period: { start: startDate, end: endDate },
    income: {
      grossRevenue,
      discounts,
      refunds,
      netRevenue,
    },
    expenses: {
      cogs,
      shipping,
      marketing,
      operations,
      paymentFees,
      other,
      total: totalExpenses,
    },
    profit: {
      gross: grossProfit,
      net: netProfit,
      margin: (netProfit / netRevenue) * 100,
    },
    cashFlow: {
      beginning: 50000.00,
      inflows: netRevenue,
      outflows: totalExpenses,
      ending: 50000.00 + netRevenue - totalExpenses,
    },
    taxes: {
      sales: 25000.00,
      income: 15000.00,
      total: 40000.00,
    },
  };
}

export function generateForecastReport(
  startDate: Date,
  endDate: Date
): ForecastReport {
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const ordersByDay = [];
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    ordersByDay.push({
      date,
      predicted: Math.floor(Math.random() * 50) + 30,
      confidence: 0.85 + Math.random() * 0.1,
    });
  }

  const predictedRevenue = ordersByDay.reduce(
    (sum, day) => sum + day.predicted * 250,
    0
  );

  return {
    period: { start: startDate, end: endDate },
    revenue: {
      predicted: predictedRevenue,
      confidence: {
        low: predictedRevenue * 0.85,
        high: predictedRevenue * 1.15,
      },
      trend: "up",
      factors: [
        "Crescimento histórico de 15% ao mês",
        "Sazonalidade favorável",
        "Novas campanhas de marketing",
      ],
    },
    orders: {
      predicted: ordersByDay.reduce((sum, day) => sum + day.predicted, 0),
      byDay: ordersByDay,
    },
    inventory: [
      {
        productId: "prod-001",
        name: "Difusor Aromático",
        currentStock: 45,
        predictedDemand: 120,
        reorderDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        reorderQuantity: 100,
      },
    ],
    cashFlow: {
      predicted: predictedRevenue * 0.7,
      breakdown: ordersByDay.map((day) => ({
        date: day.date,
        inflows: day.predicted * 250,
        outflows: day.predicted * 150,
        balance: day.predicted * 100,
      })),
    },
  };
}

// Export reports
export function exportReport(
  report: any,
  format: "csv" | "xlsx" | "pdf" | "json"
): string {
  // Mock implementation
  // In production, generate actual file
  const filename = `report-${Date.now()}.${format}`;
  return `/exports/${filename}`;
}

// Schedule reports
export interface ScheduledReport {
  id: string;
  name: string;
  type: "sales" | "customers" | "products" | "marketing" | "financial" | "forecast";
  frequency: "daily" | "weekly" | "monthly";
  recipients: string[];
  format: "csv" | "xlsx" | "pdf";
  enabled: boolean;
  lastRun?: Date;
  nextRun: Date;
}

export const scheduledReports: ScheduledReport[] = [];

export function scheduleReport(data: {
  name: string;
  type: ScheduledReport["type"];
  frequency: ScheduledReport["frequency"];
  recipients: string[];
  format: ScheduledReport["format"];
}): ScheduledReport {
  const nextRun = new Date();
  if (data.frequency === "daily") {
    nextRun.setDate(nextRun.getDate() + 1);
  } else if (data.frequency === "weekly") {
    nextRun.setDate(nextRun.getDate() + 7);
  } else {
    nextRun.setMonth(nextRun.getMonth() + 1);
  }

  const report: ScheduledReport = {
    id: `sched-${Date.now()}`,
    name: data.name,
    type: data.type,
    frequency: data.frequency,
    recipients: data.recipients,
    format: data.format,
    enabled: true,
    nextRun,
  };

  scheduledReports.push(report);

  return report;
}

// Real-time analytics
export interface RealTimeMetrics {
  activeUsers: number;
  ordersInProgress: number;
  revenueToday: number;
  topPages: {
    page: string;
    views: number;
  }[];
  recentOrders: {
    orderId: string;
    amount: number;
    timestamp: Date;
  }[];
  alerts: {
    type: "success" | "warning" | "error";
    message: string;
    timestamp: Date;
  }[];
}

export function getRealTimeMetrics(): RealTimeMetrics {
  return {
    activeUsers: Math.floor(Math.random() * 100) + 50,
    ordersInProgress: Math.floor(Math.random() * 20) + 5,
    revenueToday: 15420.50,
    topPages: [
      { page: "/", views: 1234 },
      { page: "/produtos", views: 567 },
      { page: "/produto/difusor-aromatico", views: 234 },
    ],
    recentOrders: [
      {
        orderId: "ORD-12345",
        amount: 129.90,
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
      },
      {
        orderId: "ORD-12346",
        amount: 249.80,
        timestamp: new Date(Date.now() - 12 * 60 * 1000),
      },
    ],
    alerts: [
      {
        type: "warning",
        message: "Estoque baixo: Difusor Aromático (5 unidades)",
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
      },
    ],
  };
}
