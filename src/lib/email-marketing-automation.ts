// Advanced Email Marketing Automation System

export interface EmailCampaign {
  id: string;
  name: string;
  type: "newsletter" | "promotional" | "transactional" | "automated";
  status: "draft" | "scheduled" | "active" | "paused" | "completed";
  subject: string;
  preheader?: string;
  content: EmailContent;
  segments: string[];
  schedule?: CampaignSchedule;
  triggers?: CampaignTrigger[];
  metrics: CampaignMetrics;
  abTest?: ABTest;
  personalization: PersonalizationRules;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailContent {
  html: string;
  text: string;
  templateId?: string;
  dynamicContent: DynamicContentBlock[];
  images: string[];
  ctaButtons: CTAButton[];
}

export interface DynamicContentBlock {
  id: string;
  type: "product" | "recommendation" | "banner" | "text" | "coupon";
  rules: ContentRule[];
  variants: ContentVariant[];
}

export interface ContentRule {
  field: string;
  operator: "equals" | "contains" | "greater" | "less";
  value: any;
}

export interface ContentVariant {
  id: string;
  content: string;
  weight?: number;
}

export interface CTAButton {
  text: string;
  url: string;
  trackingParams: Record<string, string>;
}

export interface CampaignSchedule {
  type: "immediate" | "scheduled" | "recurring";
  sendDate?: Date;
  timezone: string;
  recurring?: {
    frequency: "daily" | "weekly" | "monthly";
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
  };
}

export interface CampaignTrigger {
  event: string;
  conditions: TriggerCondition[];
  delay?: number; // minutes
  maxOccurrences?: number;
}

export interface TriggerCondition {
  field: string;
  operator: string;
  value: any;
}

export interface CampaignMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  unsubscribed: number;
  bounced: number;
  complained: number;
  revenue: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  roi: number;
}

export interface ABTest {
  enabled: boolean;
  variants: ABTestVariant[];
  winnerMetric: "open_rate" | "click_rate" | "conversion_rate";
  sampleSize: number;
  duration: number; // hours
  winner?: string;
}

export interface ABTestVariant {
  id: string;
  name: string;
  subject?: string;
  content?: EmailContent;
  percentage: number;
  metrics: CampaignMetrics;
}

export interface PersonalizationRules {
  useFirstName: boolean;
  useLocation: boolean;
  usePurchaseHistory: boolean;
  useBrowsingHistory: boolean;
  useRecommendations: boolean;
  customFields: Record<string, string>;
}

// Automated Email Workflows
export interface EmailWorkflow {
  id: string;
  name: string;
  description: string;
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  status: "active" | "paused" | "draft";
  metrics: WorkflowMetrics;
  createdAt: Date;
}

export interface WorkflowTrigger {
  type:
    | "welcome"
    | "abandoned_cart"
    | "post_purchase"
    | "win_back"
    | "birthday"
    | "milestone"
    | "behavior";
  conditions: TriggerCondition[];
}

export interface WorkflowStep {
  id: string;
  type: "email" | "wait" | "condition" | "action";
  config: any;
  nextSteps: string[];
}

export interface WorkflowMetrics {
  enrolled: number;
  completed: number;
  active: number;
  revenue: number;
  conversionRate: number;
}

// Pre-built Workflows
export function getWelcomeSeriesWorkflow(): EmailWorkflow {
  return {
    id: "workflow-welcome",
    name: "Welcome Series",
    description: "5-email welcome series for new subscribers",
    trigger: {
      type: "welcome",
      conditions: [
        {
          field: "subscriber.status",
          operator: "equals",
          value: "new",
        },
      ],
    },
    steps: [
      {
        id: "step-1",
        type: "email",
        config: {
          subject: "Bem-vindo ao MundoPetZen! 🌿",
          templateId: "welcome-1",
          delay: 0,
        },
        nextSteps: ["step-2"],
      },
      {
        id: "step-2",
        type: "wait",
        config: {
          duration: 1440, // 24 hours
        },
        nextSteps: ["step-3"],
      },
      {
        id: "step-3",
        type: "email",
        config: {
          subject: "Descubra nossos produtos mais vendidos",
          templateId: "welcome-2",
        },
        nextSteps: ["step-4"],
      },
      {
        id: "step-4",
        type: "wait",
        config: {
          duration: 2880, // 48 hours
        },
        nextSteps: ["step-5"],
      },
      {
        id: "step-5",
        type: "email",
        config: {
          subject: "Ganhe 15% OFF na sua primeira compra!",
          templateId: "welcome-3",
          coupon: "BEMVINDO15",
        },
        nextSteps: ["step-6"],
      },
      {
        id: "step-6",
        type: "wait",
        config: {
          duration: 4320, // 72 hours
        },
        nextSteps: ["step-7"],
      },
      {
        id: "step-7",
        type: "condition",
        config: {
          field: "customer.totalOrders",
          operator: "equals",
          value: 0,
        },
        nextSteps: ["step-8", "step-9"],
      },
      {
        id: "step-8",
        type: "email",
        config: {
          subject: "Última chance! Seu cupom expira em breve",
          templateId: "welcome-4-reminder",
        },
        nextSteps: [],
      },
      {
        id: "step-9",
        type: "email",
        config: {
          subject: "Obrigado pela sua primeira compra! 🎉",
          templateId: "welcome-4-thankyou",
        },
        nextSteps: [],
      },
    ],
    status: "active",
    metrics: {
      enrolled: 8500,
      completed: 6200,
      active: 2300,
      revenue: 285000,
      conversionRate: 42.5,
    },
    createdAt: new Date("2024-01-01"),
  };
}

export function getAbandonedCartWorkflow(): EmailWorkflow {
  return {
    id: "workflow-abandoned-cart",
    name: "Abandoned Cart Recovery",
    description: "3-email series to recover abandoned carts",
    trigger: {
      type: "abandoned_cart",
      conditions: [
        {
          field: "cart.value",
          operator: "greater",
          value: 50,
        },
      ],
    },
    steps: [
      {
        id: "step-1",
        type: "wait",
        config: {
          duration: 60, // 1 hour
        },
        nextSteps: ["step-2"],
      },
      {
        id: "step-2",
        type: "email",
        config: {
          subject: "Você esqueceu algo no carrinho! 🛒",
          templateId: "cart-1",
          includeCartItems: true,
        },
        nextSteps: ["step-3"],
      },
      {
        id: "step-3",
        type: "wait",
        config: {
          duration: 1440, // 24 hours
        },
        nextSteps: ["step-4"],
      },
      {
        id: "step-4",
        type: "condition",
        config: {
          field: "cart.status",
          operator: "equals",
          value: "abandoned",
        },
        nextSteps: ["step-5"],
      },
      {
        id: "step-5",
        type: "email",
        config: {
          subject: "Ganhe 10% OFF para finalizar sua compra",
          templateId: "cart-2",
          coupon: "CART10",
        },
        nextSteps: ["step-6"],
      },
      {
        id: "step-6",
        type: "wait",
        config: {
          duration: 2880, // 48 hours
        },
        nextSteps: ["step-7"],
      },
      {
        id: "step-7",
        type: "condition",
        config: {
          field: "cart.status",
          operator: "equals",
          value: "abandoned",
        },
        nextSteps: ["step-8"],
      },
      {
        id: "step-8",
        type: "email",
        config: {
          subject: "Última chance! Seu carrinho expira em breve",
          templateId: "cart-3",
          urgency: true,
        },
        nextSteps: [],
      },
    ],
    status: "active",
    metrics: {
      enrolled: 12500,
      completed: 8200,
      active: 4300,
      revenue: 485000,
      conversionRate: 28.5,
    },
    createdAt: new Date("2024-01-01"),
  };
}

export function getWinBackWorkflow(): EmailWorkflow {
  return {
    id: "workflow-winback",
    name: "Win-Back Campaign",
    description: "Re-engage inactive customers",
    trigger: {
      type: "win_back",
      conditions: [
        {
          field: "customer.daysSinceLastOrder",
          operator: "greater",
          value: 90,
        },
        {
          field: "customer.totalOrders",
          operator: "greater",
          value: 0,
        },
      ],
    },
    steps: [
      {
        id: "step-1",
        type: "email",
        config: {
          subject: "Sentimos sua falta! Volte e ganhe 20% OFF",
          templateId: "winback-1",
          coupon: "VOLTE20",
        },
        nextSteps: ["step-2"],
      },
      {
        id: "step-2",
        type: "wait",
        config: {
          duration: 10080, // 7 days
        },
        nextSteps: ["step-3"],
      },
      {
        id: "step-3",
        type: "condition",
        config: {
          field: "customer.hasOrdered",
          operator: "equals",
          value: false,
        },
        nextSteps: ["step-4"],
      },
      {
        id: "step-4",
        type: "email",
        config: {
          subject: "Veja o que há de novo desde sua última visita",
          templateId: "winback-2",
          includeNewProducts: true,
        },
        nextSteps: ["step-5"],
      },
      {
        id: "step-5",
        type: "wait",
        config: {
          duration: 10080, // 7 days
        },
        nextSteps: ["step-6"],
      },
      {
        id: "step-6",
        type: "condition",
        config: {
          field: "customer.hasOrdered",
          operator: "equals",
          value: false,
        },
        nextSteps: ["step-7"],
      },
      {
        id: "step-7",
        type: "email",
        config: {
          subject: "Última chance! Oferta especial só para você",
          templateId: "winback-3",
          coupon: "ULTIMACHANCE25",
          discount: 25,
        },
        nextSteps: [],
      },
    ],
    status: "active",
    metrics: {
      enrolled: 28000,
      completed: 18500,
      active: 9500,
      revenue: 685000,
      conversionRate: 18.5,
    },
    createdAt: new Date("2024-01-01"),
  };
}

export function getPostPurchaseWorkflow(): EmailWorkflow {
  return {
    id: "workflow-post-purchase",
    name: "Post-Purchase Series",
    description: "Thank you and cross-sell series",
    trigger: {
      type: "post_purchase",
      conditions: [
        {
          field: "order.status",
          operator: "equals",
          value: "completed",
        },
      ],
    },
    steps: [
      {
        id: "step-1",
        type: "email",
        config: {
          subject: "Obrigado pela sua compra! 🎉",
          templateId: "post-purchase-1",
          includeOrderDetails: true,
        },
        nextSteps: ["step-2"],
      },
      {
        id: "step-2",
        type: "wait",
        config: {
          duration: 4320, // 3 days
        },
        nextSteps: ["step-3"],
      },
      {
        id: "step-3",
        type: "email",
        config: {
          subject: "Como está gostando do seu produto?",
          templateId: "post-purchase-2",
          requestReview: true,
        },
        nextSteps: ["step-4"],
      },
      {
        id: "step-4",
        type: "wait",
        config: {
          duration: 10080, // 7 days
        },
        nextSteps: ["step-5"],
      },
      {
        id: "step-5",
        type: "email",
        config: {
          subject: "Produtos que combinam com sua compra",
          templateId: "post-purchase-3",
          includeRecommendations: true,
          coupon: "COMPREMAIS10",
        },
        nextSteps: [],
      },
    ],
    status: "active",
    metrics: {
      enrolled: 8450,
      completed: 7200,
      active: 1250,
      revenue: 125000,
      conversionRate: 32.5,
    },
    createdAt: new Date("2024-01-01"),
  };
}

export function getBirthdayWorkflow(): EmailWorkflow {
  return {
    id: "workflow-birthday",
    name: "Birthday Campaign",
    description: "Send birthday wishes and special offer",
    trigger: {
      type: "birthday",
      conditions: [
        {
          field: "customer.birthday",
          operator: "equals",
          value: "today",
        },
      ],
    },
    steps: [
      {
        id: "step-1",
        type: "email",
        config: {
          subject: "Feliz Aniversário! 🎂 Presente especial para você",
          templateId: "birthday",
          coupon: "ANIVERSARIO20",
          discount: 20,
          expiryDays: 7,
        },
        nextSteps: ["step-2"],
      },
      {
        id: "step-2",
        type: "wait",
        config: {
          duration: 10080, // 7 days
        },
        nextSteps: ["step-3"],
      },
      {
        id: "step-3",
        type: "condition",
        config: {
          field: "customer.usedBirthdayCoupon",
          operator: "equals",
          value: false,
        },
        nextSteps: ["step-4"],
      },
      {
        id: "step-4",
        type: "email",
        config: {
          subject: "Seu presente de aniversário expira hoje!",
          templateId: "birthday-reminder",
        },
        nextSteps: [],
      },
    ],
    status: "active",
    metrics: {
      enrolled: 3500,
      completed: 2850,
      active: 650,
      revenue: 95000,
      conversionRate: 48.5,
    },
    createdAt: new Date("2024-01-01"),
  };
}

// Email Templates
export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  preheader: string;
  html: string;
  text: string;
  thumbnail: string;
  variables: TemplateVariable[];
  createdAt: Date;
}

export interface TemplateVariable {
  name: string;
  type: "text" | "number" | "date" | "boolean" | "array";
  required: boolean;
  defaultValue?: any;
}

export function getEmailTemplates(): EmailTemplate[] {
  return [
    {
      id: "welcome-1",
      name: "Welcome Email 1",
      category: "Welcome Series",
      subject: "Bem-vindo ao MundoPetZen! 🌿",
      preheader: "Estamos felizes em ter você conosco",
      html: "<html>...</html>",
      text: "Bem-vindo...",
      thumbnail: "/templates/welcome-1.png",
      variables: [
        {
          name: "firstName",
          type: "text",
          required: true,
        },
      ],
      createdAt: new Date("2024-01-01"),
    },
    {
      id: "cart-1",
      name: "Abandoned Cart 1",
      category: "Cart Recovery",
      subject: "Você esqueceu algo no carrinho! 🛒",
      preheader: "Complete sua compra e aproveite",
      html: "<html>...</html>",
      text: "Você esqueceu...",
      thumbnail: "/templates/cart-1.png",
      variables: [
        {
          name: "cartItems",
          type: "array",
          required: true,
        },
        {
          name: "cartTotal",
          type: "number",
          required: true,
        },
      ],
      createdAt: new Date("2024-01-01"),
    },
  ];
}

// Email Marketing Analytics
export interface EmailMarketingAnalytics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSent: number;
  totalRevenue: number;
  avgOpenRate: number;
  avgClickRate: number;
  avgConversionRate: number;
  avgROI: number;
  topPerformingCampaigns: {
    name: string;
    openRate: number;
    clickRate: number;
    revenue: number;
  }[];
  workflowPerformance: {
    workflow: string;
    enrolled: number;
    conversionRate: number;
    revenue: number;
  }[];
}

export function getEmailMarketingAnalytics(): EmailMarketingAnalytics {
  return {
    totalCampaigns: 185,
    activeCampaigns: 28,
    totalSent: 2850000,
    totalRevenue: 4850000,
    avgOpenRate: 28.5,
    avgClickRate: 8.2,
    avgConversionRate: 4.5,
    avgROI: 485,
    topPerformingCampaigns: [
      {
        name: "Black Friday 2024",
        openRate: 45.2,
        clickRate: 18.5,
        revenue: 425000,
      },
      {
        name: "Welcome Series",
        openRate: 42.5,
        clickRate: 15.2,
        revenue: 285000,
      },
      {
        name: "Abandoned Cart",
        openRate: 38.5,
        clickRate: 12.8,
        revenue: 485000,
      },
    ],
    workflowPerformance: [
      {
        workflow: "Welcome Series",
        enrolled: 8500,
        conversionRate: 42.5,
        revenue: 285000,
      },
      {
        workflow: "Abandoned Cart",
        enrolled: 12500,
        conversionRate: 28.5,
        revenue: 485000,
      },
      {
        workflow: "Win-Back",
        enrolled: 28000,
        conversionRate: 18.5,
        revenue: 685000,
      },
      {
        workflow: "Post-Purchase",
        enrolled: 8450,
        conversionRate: 32.5,
        revenue: 125000,
      },
      {
        workflow: "Birthday",
        enrolled: 3500,
        conversionRate: 48.5,
        revenue: 95000,
      },
    ],
  };
}

// List Management
export interface EmailList {
  id: string;
  name: string;
  description: string;
  subscribers: number;
  activeSubscribers: number;
  segments: ListSegment[];
  growthRate: number;
  createdAt: Date;
}

export interface ListSegment {
  id: string;
  name: string;
  conditions: SegmentCondition[];
  subscribers: number;
}

export interface SegmentCondition {
  field: string;
  operator: string;
  value: any;
}

export function getEmailLists(): EmailList[] {
  return [
    {
      id: "list-main",
      name: "Main List",
      description: "All subscribers",
      subscribers: 125000,
      activeSubscribers: 85000,
      segments: [
        {
          id: "seg-vip",
          name: "VIP Customers",
          conditions: [
            {
              field: "totalSpent",
              operator: "greater",
              value: 5000,
            },
          ],
          subscribers: 2500,
        },
        {
          id: "seg-engaged",
          name: "Engaged Subscribers",
          conditions: [
            {
              field: "openRate",
              operator: "greater",
              value: 30,
            },
          ],
          subscribers: 45000,
        },
      ],
      growthRate: 12.5,
      createdAt: new Date("2024-01-01"),
    },
  ];
}
