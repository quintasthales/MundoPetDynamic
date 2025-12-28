// Advanced Data Analytics and Business Intelligence Dashboards

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  widgets: Widget[];
  filters: DashboardFilter[];
  refreshInterval?: number; // seconds
  lastUpdated: Date;
}

export interface Widget {
  id: string;
  type: "metric" | "chart" | "table" | "map" | "funnel" | "heatmap";
  title: string;
  data: any;
  config: WidgetConfig;
  position: { x: number; y: number; w: number; h: number };
}

export interface WidgetConfig {
  chartType?: "line" | "bar" | "pie" | "area" | "scatter" | "donut";
  metrics?: string[];
  dimensions?: string[];
  timeRange?: string;
  comparison?: boolean;
  target?: number;
  format?: string;
}

export interface DashboardFilter {
  field: string;
  operator: string;
  value: any;
}

// Executive Dashboard
export function getExecutiveDashboard(): Dashboard {
  return {
    id: "exec-dashboard",
    name: "Executive Dashboard",
    description: "High-level business metrics and KPIs",
    filters: [],
    refreshInterval: 300, // 5 minutes
    lastUpdated: new Date(),
    widgets: [
      {
        id: "revenue-metric",
        type: "metric",
        title: "Revenue (30 days)",
        data: {
          value: 1245000,
          change: 18.5,
          trend: "up",
          target: 1200000,
        },
        config: {
          format: "currency",
          comparison: true,
          target: 1200000,
        },
        position: { x: 0, y: 0, w: 3, h: 2 },
      },
      {
        id: "orders-metric",
        type: "metric",
        title: "Orders (30 days)",
        data: {
          value: 8450,
          change: 12.3,
          trend: "up",
        },
        config: {
          format: "number",
          comparison: true,
        },
        position: { x: 3, y: 0, w: 3, h: 2 },
      },
      {
        id: "aov-metric",
        type: "metric",
        title: "Average Order Value",
        data: {
          value: 147.34,
          change: 5.2,
          trend: "up",
        },
        config: {
          format: "currency",
          comparison: true,
        },
        position: { x: 6, y: 0, w: 3, h: 2 },
      },
      {
        id: "conversion-metric",
        type: "metric",
        title: "Conversion Rate",
        data: {
          value: 4.8,
          change: 0.5,
          trend: "up",
        },
        config: {
          format: "percentage",
          comparison: true,
        },
        position: { x: 9, y: 0, w: 3, h: 2 },
      },
      {
        id: "revenue-chart",
        type: "chart",
        title: "Revenue Trend (90 days)",
        data: {
          labels: Array.from({ length: 90 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (89 - i));
            return date.toISOString().split("T")[0];
          }),
          datasets: [
            {
              label: "Revenue",
              data: Array.from({ length: 90 }, () =>
                Math.floor(Math.random() * 50000 + 30000)
              ),
            },
          ],
        },
        config: {
          chartType: "area",
          timeRange: "90d",
        },
        position: { x: 0, y: 2, w: 6, h: 4 },
      },
      {
        id: "category-chart",
        type: "chart",
        title: "Revenue by Category",
        data: {
          labels: [
            "Difusores",
            "Óleos Essenciais",
            "Velas",
            "Incensos",
            "Acessórios",
          ],
          datasets: [
            {
              label: "Revenue",
              data: [425000, 385000, 245000, 185000, 125000],
            },
          ],
        },
        config: {
          chartType: "bar",
        },
        position: { x: 6, y: 2, w: 6, h: 4 },
      },
      {
        id: "top-products",
        type: "table",
        title: "Top 10 Products",
        data: {
          columns: ["Product", "Revenue", "Units", "AOV"],
          rows: [
            [
              "Difusor Aromático Zen",
              "R$ 85,500",
              "650",
              "R$ 131.54",
            ],
            [
              "Óleo Essencial Lavanda",
              "R$ 72,300",
              "1,205",
              "R$ 60.00",
            ],
            [
              "Vela Aromática Vanilla",
              "R$ 68,200",
              "1,705",
              "R$ 40.00",
            ],
            [
              "Difusor Ultrassônico Premium",
              "R$ 65,000",
              "325",
              "R$ 200.00",
            ],
            [
              "Kit Óleos Essenciais",
              "R$ 58,500",
              "390",
              "R$ 150.00",
            ],
          ],
        },
        config: {},
        position: { x: 0, y: 6, w: 6, h: 4 },
      },
      {
        id: "funnel-chart",
        type: "funnel",
        title: "Conversion Funnel",
        data: {
          stages: [
            { name: "Visitors", value: 125000, percentage: 100 },
            { name: "Product Views", value: 45000, percentage: 36 },
            { name: "Add to Cart", value: 12500, percentage: 10 },
            { name: "Checkout", value: 7500, percentage: 6 },
            { name: "Purchase", value: 6000, percentage: 4.8 },
          ],
        },
        config: {},
        position: { x: 6, y: 6, w: 6, h: 4 },
      },
    ],
  };
}

// Sales Dashboard
export function getSalesDashboard(): Dashboard {
  return {
    id: "sales-dashboard",
    name: "Sales Dashboard",
    description: "Detailed sales analytics and performance",
    filters: [],
    refreshInterval: 180,
    lastUpdated: new Date(),
    widgets: [
      {
        id: "daily-sales",
        type: "chart",
        title: "Daily Sales (30 days)",
        data: {
          labels: Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            return date.toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
            });
          }),
          datasets: [
            {
              label: "Sales",
              data: Array.from({ length: 30 }, () =>
                Math.floor(Math.random() * 60000 + 30000)
              ),
            },
          ],
        },
        config: {
          chartType: "line",
        },
        position: { x: 0, y: 0, w: 8, h: 4 },
      },
      {
        id: "sales-by-channel",
        type: "chart",
        title: "Sales by Channel",
        data: {
          labels: [
            "Website",
            "Mobile App",
            "Instagram",
            "Mercado Livre",
            "Amazon",
            "Loja Física",
          ],
          datasets: [
            {
              label: "Sales",
              data: [425000, 285000, 185000, 145000, 95000, 110000],
            },
          ],
        },
        config: {
          chartType: "pie",
        },
        position: { x: 8, y: 0, w: 4, h: 4 },
      },
      {
        id: "hourly-sales",
        type: "chart",
        title: "Sales by Hour of Day",
        data: {
          labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
          datasets: [
            {
              label: "Sales",
              data: [
                5200, 3800, 2500, 1800, 1500, 2200, 4500, 8500, 12500,
                15200, 18500, 22000, 25500, 24800, 23500, 25000, 28500,
                32000, 35500, 38000, 32500, 25000, 18000, 12000,
              ],
            },
          ],
        },
        config: {
          chartType: "bar",
        },
        position: { x: 0, y: 4, w: 6, h: 4 },
      },
      {
        id: "sales-by-region",
        type: "map",
        title: "Sales by Region",
        data: {
          regions: [
            { name: "São Paulo", value: 425000, percentage: 34.1 },
            { name: "Rio de Janeiro", value: 285000, percentage: 22.9 },
            { name: "Minas Gerais", value: 185000, percentage: 14.9 },
            { name: "Paraná", value: 125000, percentage: 10.0 },
            { name: "Bahia", value: 95000, percentage: 7.6 },
            { name: "Outros", value: 130000, percentage: 10.5 },
          ],
        },
        config: {},
        position: { x: 6, y: 4, w: 6, h: 4 },
      },
    ],
  };
}

// Customer Dashboard
export function getCustomerDashboard(): Dashboard {
  return {
    id: "customer-dashboard",
    name: "Customer Dashboard",
    description: "Customer analytics and insights",
    filters: [],
    refreshInterval: 300,
    lastUpdated: new Date(),
    widgets: [
      {
        id: "total-customers",
        type: "metric",
        title: "Total Customers",
        data: {
          value: 125000,
          change: 8.5,
          trend: "up",
        },
        config: {
          format: "number",
          comparison: true,
        },
        position: { x: 0, y: 0, w: 3, h: 2 },
      },
      {
        id: "active-customers",
        type: "metric",
        title: "Active Customers (30d)",
        data: {
          value: 28500,
          change: 12.3,
          trend: "up",
        },
        config: {
          format: "number",
          comparison: true,
        },
        position: { x: 3, y: 0, w: 3, h: 2 },
      },
      {
        id: "customer-ltv",
        type: "metric",
        title: "Average LTV",
        data: {
          value: 485.5,
          change: 15.2,
          trend: "up",
        },
        config: {
          format: "currency",
          comparison: true,
        },
        position: { x: 6, y: 0, w: 3, h: 2 },
      },
      {
        id: "retention-rate",
        type: "metric",
        title: "Retention Rate",
        data: {
          value: 68.5,
          change: 5.2,
          trend: "up",
        },
        config: {
          format: "percentage",
          comparison: true,
        },
        position: { x: 9, y: 0, w: 3, h: 2 },
      },
      {
        id: "customer-acquisition",
        type: "chart",
        title: "Customer Acquisition (90 days)",
        data: {
          labels: Array.from({ length: 12 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - (11 - i));
            return date.toLocaleDateString("pt-BR", {
              month: "short",
              year: "2-digit",
            });
          }),
          datasets: [
            {
              label: "New Customers",
              data: [
                2850, 3200, 3650, 4100, 4550, 5200, 5850, 6200, 6850,
                7200, 7850, 8500,
              ],
            },
          ],
        },
        config: {
          chartType: "area",
        },
        position: { x: 0, y: 2, w: 6, h: 4 },
      },
      {
        id: "customer-segments",
        type: "chart",
        title: "Customer Segments",
        data: {
          labels: [
            "VIP",
            "High Value",
            "Frequent",
            "Occasional",
            "At Risk",
            "Inactive",
          ],
          datasets: [
            {
              label: "Customers",
              data: [2500, 8500, 15000, 45000, 28000, 26000],
            },
          ],
        },
        config: {
          chartType: "donut",
        },
        position: { x: 6, y: 2, w: 6, h: 4 },
      },
      {
        id: "cohort-analysis",
        type: "heatmap",
        title: "Cohort Retention Analysis",
        data: {
          cohorts: [
            {
              month: "Jan 25",
              retention: [100, 68, 52, 45, 38, 32],
            },
            {
              month: "Dez 24",
              retention: [100, 72, 58, 48, 42, 35, 30],
            },
            {
              month: "Nov 24",
              retention: [100, 70, 55, 46, 40, 34, 28, 25],
            },
            {
              month: "Out 24",
              retention: [100, 65, 50, 42, 36, 30, 25, 22, 18],
            },
          ],
        },
        config: {},
        position: { x: 0, y: 6, w: 12, h: 4 },
      },
    ],
  };
}

// Product Dashboard
export function getProductDashboard(): Dashboard {
  return {
    id: "product-dashboard",
    name: "Product Dashboard",
    description: "Product performance and inventory analytics",
    filters: [],
    refreshInterval: 300,
    lastUpdated: new Date(),
    widgets: [
      {
        id: "total-products",
        type: "metric",
        title: "Total Products",
        data: {
          value: 1250,
          change: 5.2,
          trend: "up",
        },
        config: {
          format: "number",
        },
        position: { x: 0, y: 0, w: 3, h: 2 },
      },
      {
        id: "out-of-stock",
        type: "metric",
        title: "Out of Stock",
        data: {
          value: 28,
          change: -15.2,
          trend: "down",
        },
        config: {
          format: "number",
        },
        position: { x: 3, y: 0, w: 3, h: 2 },
      },
      {
        id: "low-stock",
        type: "metric",
        title: "Low Stock",
        data: {
          value: 85,
          change: -8.5,
          trend: "down",
        },
        config: {
          format: "number",
        },
        position: { x: 6, y: 0, w: 3, h: 2 },
      },
      {
        id: "inventory-value",
        type: "metric",
        title: "Inventory Value",
        data: {
          value: 2850000,
          change: 12.5,
          trend: "up",
        },
        config: {
          format: "currency",
        },
        position: { x: 9, y: 0, w: 3, h: 2 },
      },
      {
        id: "product-performance",
        type: "table",
        title: "Product Performance",
        data: {
          columns: [
            "Product",
            "Revenue",
            "Units",
            "Stock",
            "Margin",
          ],
          rows: [
            [
              "Difusor Aromático Zen",
              "R$ 85,500",
              "650",
              "125",
              "45%",
            ],
            [
              "Óleo Essencial Lavanda",
              "R$ 72,300",
              "1,205",
              "850",
              "62%",
            ],
            [
              "Vela Aromática Vanilla",
              "R$ 68,200",
              "1,705",
              "1,250",
              "58%",
            ],
          ],
        },
        config: {},
        position: { x: 0, y: 2, w: 12, h: 4 },
      },
    ],
  };
}

// Marketing Dashboard
export function getMarketingDashboard(): Dashboard {
  return {
    id: "marketing-dashboard",
    name: "Marketing Dashboard",
    description: "Marketing campaign performance and ROI",
    filters: [],
    refreshInterval: 300,
    lastUpdated: new Date(),
    widgets: [
      {
        id: "marketing-roi",
        type: "metric",
        title: "Marketing ROI",
        data: {
          value: 485,
          change: 25.5,
          trend: "up",
        },
        config: {
          format: "percentage",
        },
        position: { x: 0, y: 0, w: 3, h: 2 },
      },
      {
        id: "cac",
        type: "metric",
        title: "Customer Acquisition Cost",
        data: {
          value: 45.5,
          change: -12.3,
          trend: "down",
        },
        config: {
          format: "currency",
        },
        position: { x: 3, y: 0, w: 3, h: 2 },
      },
      {
        id: "email-open-rate",
        type: "metric",
        title: "Email Open Rate",
        data: {
          value: 28.5,
          change: 5.2,
          trend: "up",
        },
        config: {
          format: "percentage",
        },
        position: { x: 6, y: 0, w: 3, h: 2 },
      },
      {
        id: "social-engagement",
        type: "metric",
        title: "Social Engagement Rate",
        data: {
          value: 8.2,
          change: 15.8,
          trend: "up",
        },
        config: {
          format: "percentage",
        },
        position: { x: 9, y: 0, w: 3, h: 2 },
      },
      {
        id: "campaign-performance",
        type: "table",
        title: "Campaign Performance",
        data: {
          columns: [
            "Campaign",
            "Spend",
            "Revenue",
            "ROI",
            "Conversions",
          ],
          rows: [
            [
              "Black Friday 2024",
              "R$ 85,000",
              "R$ 425,000",
              "400%",
              "2,850",
            ],
            [
              "Instagram Ads Q4",
              "R$ 45,000",
              "R$ 285,000",
              "533%",
              "1,920",
            ],
            [
              "Google Shopping",
              "R$ 32,000",
              "R$ 185,000",
              "478%",
              "1,250",
            ],
          ],
        },
        config: {},
        position: { x: 0, y: 2, w: 12, h: 4 },
      },
    ],
  };
}

// Real-time Dashboard
export interface RealTimeMetrics {
  activeUsers: number;
  ordersToday: number;
  revenueToday: number;
  conversionRate: number;
  recentOrders: {
    id: string;
    customer: string;
    amount: number;
    timestamp: Date;
  }[];
  topProducts: {
    name: string;
    views: number;
    sales: number;
  }[];
}

export function getRealTimeMetrics(): RealTimeMetrics {
  return {
    activeUsers: 2850,
    ordersToday: 285,
    revenueToday: 42500,
    conversionRate: 4.8,
    recentOrders: [
      {
        id: "ORD-12345",
        customer: "João Silva",
        amount: 185.5,
        timestamp: new Date(Date.now() - 120000),
      },
      {
        id: "ORD-12346",
        customer: "Maria Santos",
        amount: 245.0,
        timestamp: new Date(Date.now() - 180000),
      },
      {
        id: "ORD-12347",
        customer: "Pedro Costa",
        amount: 95.5,
        timestamp: new Date(Date.now() - 240000),
      },
    ],
    topProducts: [
      {
        name: "Difusor Aromático Zen",
        views: 1250,
        sales: 85,
      },
      {
        name: "Óleo Essencial Lavanda",
        views: 980,
        sales: 125,
      },
      {
        name: "Vela Aromática Vanilla",
        views: 850,
        sales: 145,
      },
    ],
  };
}

// Custom Dashboard Builder
export interface CustomDashboard {
  id: string;
  name: string;
  userId: string;
  widgets: Widget[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function createCustomDashboard(
  userId: string,
  name: string,
  widgets: Widget[]
): CustomDashboard {
  return {
    id: `custom-${Date.now()}`,
    name,
    userId,
    widgets,
    isPublic: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Dashboard Analytics
export interface DashboardAnalytics {
  totalDashboards: number;
  totalWidgets: number;
  avgLoadTime: number; // ms
  mostViewedDashboards: {
    name: string;
    views: number;
  }[];
  mostUsedWidgets: {
    type: string;
    count: number;
  }[];
}

export function getDashboardAnalytics(): DashboardAnalytics {
  return {
    totalDashboards: 28,
    totalWidgets: 185,
    avgLoadTime: 850,
    mostViewedDashboards: [
      { name: "Executive Dashboard", views: 12500 },
      { name: "Sales Dashboard", views: 8500 },
      { name: "Customer Dashboard", views: 6200 },
    ],
    mostUsedWidgets: [
      { type: "metric", count: 85 },
      { type: "chart", count: 65 },
      { type: "table", count: 25 },
      { type: "funnel", count: 10 },
    ],
  };
}
