// Enterprise Integrations and API Marketplace

export interface Integration {
  id: string;
  name: string;
  category: "payment" | "shipping" | "marketing" | "analytics" | "crm" | "erp" | "accounting" | "communication" | "productivity" | "other";
  provider: string;
  description: string;
  logo: string;
  status: "active" | "inactive" | "error" | "pending";
  config: {
    apiKey?: string;
    apiSecret?: string;
    webhookUrl?: string;
    settings: Record<string, any>;
  };
  features: string[];
  pricing: {
    model: "free" | "freemium" | "subscription" | "usage_based" | "one_time";
    price?: number;
    currency?: string;
    interval?: "month" | "year";
  };
  metrics: {
    requests: number;
    successRate: number; // percentage
    avgResponseTime: number; // ms
    lastUsed: Date;
  };
  documentation: string;
  support: {
    email: string;
    docs: string;
    community?: string;
  };
}

export interface APIMarketplace {
  categories: {
    id: string;
    name: string;
    description: string;
    integrationCount: number;
  }[];
  featured: Integration[];
  popular: Integration[];
  new: Integration[];
  all: Integration[];
}

// Payment Integrations
export const paymentIntegrations: Integration[] = [
  {
    id: "pagseguro",
    name: "PagSeguro",
    category: "payment",
    provider: "UOL PagSeguro",
    description: "Gateway de pagamento brasileiro com PIX, cartões, boleto e parcelamento",
    logo: "/integrations/pagseguro.png",
    status: "active",
    config: {
      apiKey: process.env.PAGSEGURO_API_KEY,
      settings: {
        environment: "production",
        installments: 12,
        pixEnabled: true,
        boletoEnabled: true,
      },
    },
    features: [
      "PIX",
      "Cartão de crédito",
      "Cartão de débito",
      "Boleto bancário",
      "Parcelamento em até 12x",
      "Antifraude integrado",
      "Checkout transparente",
    ],
    pricing: {
      model: "usage_based",
      price: 3.99,
      currency: "BRL",
    },
    metrics: {
      requests: 125000,
      successRate: 98.5,
      avgResponseTime: 450,
      lastUsed: new Date(),
    },
    documentation: "https://dev.pagseguro.uol.com.br",
    support: {
      email: "suporte@pagseguro.uol.com.br",
      docs: "https://dev.pagseguro.uol.com.br/docs",
    },
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "payment",
    provider: "Stripe, Inc.",
    description: "Plataforma global de pagamentos com suporte a 135+ moedas",
    logo: "/integrations/stripe.png",
    status: "active",
    config: {
      apiKey: process.env.STRIPE_API_KEY,
      apiSecret: process.env.STRIPE_SECRET_KEY,
      settings: {
        currency: "BRL",
        paymentMethods: ["card", "boleto", "pix"],
      },
    },
    features: [
      "Cartões internacionais",
      "PIX",
      "Boleto",
      "Apple Pay",
      "Google Pay",
      "Subscriptions",
      "Invoicing",
    ],
    pricing: {
      model: "usage_based",
      price: 3.4,
      currency: "BRL",
    },
    metrics: {
      requests: 85000,
      successRate: 99.2,
      avgResponseTime: 320,
      lastUsed: new Date(),
    },
    documentation: "https://stripe.com/docs",
    support: {
      email: "support@stripe.com",
      docs: "https://stripe.com/docs",
    },
  },
  {
    id: "mercadopago",
    name: "Mercado Pago",
    category: "payment",
    provider: "Mercado Livre",
    description: "Solução de pagamentos do Mercado Livre",
    logo: "/integrations/mercadopago.png",
    status: "active",
    config: {
      apiKey: process.env.MERCADOPAGO_ACCESS_TOKEN,
      settings: {
        installments: 12,
        pixEnabled: true,
      },
    },
    features: [
      "PIX",
      "Cartões",
      "Boleto",
      "Mercado Crédito",
      "Parcelamento",
      "QR Code",
    ],
    pricing: {
      model: "usage_based",
      price: 4.99,
      currency: "BRL",
    },
    metrics: {
      requests: 65000,
      successRate: 97.8,
      avgResponseTime: 520,
      lastUsed: new Date(),
    },
    documentation: "https://www.mercadopago.com.br/developers",
    support: {
      email: "developers@mercadopago.com",
      docs: "https://www.mercadopago.com.br/developers/pt/docs",
    },
  },
];

// Shipping Integrations
export const shippingIntegrations: Integration[] = [
  {
    id: "correios",
    name: "Correios",
    category: "shipping",
    provider: "Correios Brasil",
    description: "Serviços de entrega dos Correios (PAC, SEDEX, etc.)",
    logo: "/integrations/correios.png",
    status: "active",
    config: {
      apiKey: process.env.CORREIOS_API_KEY,
      settings: {
        services: ["PAC", "SEDEX", "SEDEX 10", "SEDEX 12"],
        originZipCode: "01310-100",
      },
    },
    features: [
      "Cálculo de frete",
      "Rastreamento",
      "PAC",
      "SEDEX",
      "SEDEX 10",
      "SEDEX 12",
      "Etiquetas",
    ],
    pricing: {
      model: "usage_based",
    },
    metrics: {
      requests: 250000,
      successRate: 96.5,
      avgResponseTime: 850,
      lastUsed: new Date(),
    },
    documentation: "https://www.correios.com.br/enviar/desenvolvedores",
    support: {
      email: "api@correios.com.br",
      docs: "https://www.correios.com.br/enviar/desenvolvedores/documentacao",
    },
  },
  {
    id: "loggi",
    name: "Loggi",
    category: "shipping",
    provider: "Loggi Tecnologia",
    description: "Entregas rápidas e same-day delivery",
    logo: "/integrations/loggi.png",
    status: "active",
    config: {
      apiKey: process.env.LOGGI_API_KEY,
      settings: {
        sameDay: true,
        scheduled: true,
      },
    },
    features: [
      "Same-day delivery",
      "Entrega agendada",
      "Rastreamento em tempo real",
      "API REST",
      "Webhooks",
    ],
    pricing: {
      model: "usage_based",
    },
    metrics: {
      requests: 45000,
      successRate: 98.2,
      avgResponseTime: 380,
      lastUsed: new Date(),
    },
    documentation: "https://docs.loggi.com",
    support: {
      email: "api@loggi.com",
      docs: "https://docs.loggi.com",
    },
  },
  {
    id: "melhorenvio",
    name: "Melhor Envio",
    category: "shipping",
    provider: "Melhor Envio",
    description: "Plataforma de cotação e gestão de envios",
    logo: "/integrations/melhorenvio.png",
    status: "active",
    config: {
      apiKey: process.env.MELHORENVIO_API_TOKEN,
      settings: {
        carriers: ["Correios", "Jadlog", "Azul Cargo", "Latam Cargo"],
      },
    },
    features: [
      "Cotação de múltiplas transportadoras",
      "Rastreamento unificado",
      "Geração de etiquetas",
      "Coleta automática",
      "Seguro de envio",
    ],
    pricing: {
      model: "freemium",
    },
    metrics: {
      requests: 180000,
      successRate: 97.5,
      avgResponseTime: 620,
      lastUsed: new Date(),
    },
    documentation: "https://docs.melhorenvio.com.br",
    support: {
      email: "contato@melhorenvio.com.br",
      docs: "https://docs.melhorenvio.com.br",
    },
  },
];

// Marketing Integrations
export const marketingIntegrations: Integration[] = [
  {
    id: "mailchimp",
    name: "Mailchimp",
    category: "marketing",
    provider: "Intuit Mailchimp",
    description: "Plataforma de email marketing e automação",
    logo: "/integrations/mailchimp.png",
    status: "active",
    config: {
      apiKey: process.env.MAILCHIMP_API_KEY,
      settings: {
        listId: process.env.MAILCHIMP_LIST_ID,
        datacenter: "us1",
      },
    },
    features: [
      "Email campaigns",
      "Automação",
      "Segmentação",
      "A/B testing",
      "Analytics",
      "Templates",
    ],
    pricing: {
      model: "freemium",
      price: 299,
      currency: "BRL",
      interval: "month",
    },
    metrics: {
      requests: 125000,
      successRate: 99.5,
      avgResponseTime: 280,
      lastUsed: new Date(),
    },
    documentation: "https://mailchimp.com/developer",
    support: {
      email: "api@mailchimp.com",
      docs: "https://mailchimp.com/developer/marketing/docs",
    },
  },
  {
    id: "rdstation",
    name: "RD Station",
    category: "marketing",
    provider: "Resultados Digitais",
    description: "Automação de marketing e CRM brasileiro",
    logo: "/integrations/rdstation.png",
    status: "active",
    config: {
      apiKey: process.env.RDSTATION_API_KEY,
      settings: {
        publicToken: process.env.RDSTATION_PUBLIC_TOKEN,
      },
    },
    features: [
      "Automação de marketing",
      "Lead scoring",
      "Email marketing",
      "Landing pages",
      "CRM",
      "Analytics",
    ],
    pricing: {
      model: "subscription",
      price: 499,
      currency: "BRL",
      interval: "month",
    },
    metrics: {
      requests: 85000,
      successRate: 98.8,
      avgResponseTime: 420,
      lastUsed: new Date(),
    },
    documentation: "https://developers.rdstation.com",
    support: {
      email: "api@rdstation.com",
      docs: "https://developers.rdstation.com/pt-BR/reference",
    },
  },
  {
    id: "facebook-ads",
    name: "Facebook Ads",
    category: "marketing",
    provider: "Meta Platforms",
    description: "Anúncios no Facebook e Instagram",
    logo: "/integrations/facebook.png",
    status: "active",
    config: {
      apiKey: process.env.FACEBOOK_ACCESS_TOKEN,
      settings: {
        adAccountId: process.env.FACEBOOK_AD_ACCOUNT_ID,
        pixelId: process.env.FACEBOOK_PIXEL_ID,
      },
    },
    features: [
      "Criação de campanhas",
      "Audience targeting",
      "Conversion tracking",
      "Analytics",
      "Dynamic ads",
      "Catalog sync",
    ],
    pricing: {
      model: "usage_based",
    },
    metrics: {
      requests: 95000,
      successRate: 97.2,
      avgResponseTime: 550,
      lastUsed: new Date(),
    },
    documentation: "https://developers.facebook.com/docs/marketing-apis",
    support: {
      email: "developers@fb.com",
      docs: "https://developers.facebook.com/docs",
    },
  },
];

// CRM Integrations
export const crmIntegrations: Integration[] = [
  {
    id: "salesforce",
    name: "Salesforce",
    category: "crm",
    provider: "Salesforce, Inc.",
    description: "CRM líder mundial para gestão de clientes",
    logo: "/integrations/salesforce.png",
    status: "active",
    config: {
      apiKey: process.env.SALESFORCE_API_KEY,
      settings: {
        instanceUrl: process.env.SALESFORCE_INSTANCE_URL,
        version: "v58.0",
      },
    },
    features: [
      "Gestão de leads",
      "Gestão de oportunidades",
      "Automação de vendas",
      "Analytics",
      "Reports",
      "Integrations",
    ],
    pricing: {
      model: "subscription",
      price: 150,
      currency: "USD",
      interval: "month",
    },
    metrics: {
      requests: 65000,
      successRate: 99.1,
      avgResponseTime: 380,
      lastUsed: new Date(),
    },
    documentation: "https://developer.salesforce.com",
    support: {
      email: "support@salesforce.com",
      docs: "https://developer.salesforce.com/docs",
    },
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "crm",
    provider: "HubSpot, Inc.",
    description: "CRM, marketing e vendas tudo-em-um",
    logo: "/integrations/hubspot.png",
    status: "active",
    config: {
      apiKey: process.env.HUBSPOT_API_KEY,
      settings: {
        portalId: process.env.HUBSPOT_PORTAL_ID,
      },
    },
    features: [
      "CRM gratuito",
      "Marketing automation",
      "Sales automation",
      "Service Hub",
      "Analytics",
      "Workflows",
    ],
    pricing: {
      model: "freemium",
      price: 800,
      currency: "BRL",
      interval: "month",
    },
    metrics: {
      requests: 75000,
      successRate: 98.9,
      avgResponseTime: 320,
      lastUsed: new Date(),
    },
    documentation: "https://developers.hubspot.com",
    support: {
      email: "developers@hubspot.com",
      docs: "https://developers.hubspot.com/docs",
    },
  },
];

// Analytics Integrations
export const analyticsIntegrations: Integration[] = [
  {
    id: "google-analytics",
    name: "Google Analytics 4",
    category: "analytics",
    provider: "Google LLC",
    description: "Análise de tráfego e comportamento do usuário",
    logo: "/integrations/google-analytics.png",
    status: "active",
    config: {
      settings: {
        measurementId: process.env.NEXT_PUBLIC_GA_ID,
        streamId: process.env.GA_STREAM_ID,
      },
    },
    features: [
      "Análise de tráfego",
      "E-commerce tracking",
      "Conversion tracking",
      "Audience insights",
      "Real-time data",
      "Custom reports",
    ],
    pricing: {
      model: "free",
    },
    metrics: {
      requests: 500000,
      successRate: 99.8,
      avgResponseTime: 150,
      lastUsed: new Date(),
    },
    documentation: "https://developers.google.com/analytics",
    support: {
      email: "analytics-api@google.com",
      docs: "https://developers.google.com/analytics/devguides/collection/ga4",
    },
  },
  {
    id: "hotjar",
    name: "Hotjar",
    category: "analytics",
    provider: "Hotjar Ltd.",
    description: "Heatmaps, gravações de sessão e feedback",
    logo: "/integrations/hotjar.png",
    status: "active",
    config: {
      settings: {
        siteId: process.env.HOTJAR_SITE_ID,
      },
    },
    features: [
      "Heatmaps",
      "Session recordings",
      "Conversion funnels",
      "Form analytics",
      "Feedback polls",
      "Surveys",
    ],
    pricing: {
      model: "freemium",
      price: 99,
      currency: "USD",
      interval: "month",
    },
    metrics: {
      requests: 250000,
      successRate: 98.5,
      avgResponseTime: 420,
      lastUsed: new Date(),
    },
    documentation: "https://help.hotjar.com/hc/en-us/categories/115001323967-Integrations",
    support: {
      email: "support@hotjar.com",
      docs: "https://help.hotjar.com",
    },
  },
];

// Communication Integrations
export const communicationIntegrations: Integration[] = [
  {
    id: "twilio",
    name: "Twilio",
    category: "communication",
    provider: "Twilio Inc.",
    description: "SMS, WhatsApp e comunicação programável",
    logo: "/integrations/twilio.png",
    status: "active",
    config: {
      apiKey: process.env.TWILIO_ACCOUNT_SID,
      apiSecret: process.env.TWILIO_AUTH_TOKEN,
      settings: {
        phoneNumber: process.env.TWILIO_PHONE_NUMBER,
      },
    },
    features: [
      "SMS",
      "WhatsApp",
      "Voice calls",
      "Video",
      "Verify API",
      "Programmable messaging",
    ],
    pricing: {
      model: "usage_based",
      price: 0.04,
      currency: "USD",
    },
    metrics: {
      requests: 125000,
      successRate: 99.2,
      avgResponseTime: 280,
      lastUsed: new Date(),
    },
    documentation: "https://www.twilio.com/docs",
    support: {
      email: "support@twilio.com",
      docs: "https://www.twilio.com/docs",
    },
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    category: "communication",
    provider: "Twilio SendGrid",
    description: "Plataforma de email transacional e marketing",
    logo: "/integrations/sendgrid.png",
    status: "active",
    config: {
      apiKey: process.env.SENDGRID_API_KEY,
      settings: {
        fromEmail: "noreply@mundopetzen.com.br",
        fromName: "MundoPetZen",
      },
    },
    features: [
      "Transactional emails",
      "Marketing campaigns",
      "Templates",
      "Analytics",
      "A/B testing",
      "Webhooks",
    ],
    pricing: {
      model: "freemium",
      price: 19.95,
      currency: "USD",
      interval: "month",
    },
    metrics: {
      requests: 350000,
      successRate: 99.5,
      avgResponseTime: 220,
      lastUsed: new Date(),
    },
    documentation: "https://docs.sendgrid.com",
    support: {
      email: "support@sendgrid.com",
      docs: "https://docs.sendgrid.com",
    },
  },
];

// ERP/Accounting Integrations
export const erpIntegrations: Integration[] = [
  {
    id: "omie",
    name: "Omie",
    category: "erp",
    provider: "Omie Sistemas",
    description: "ERP brasileiro para gestão empresarial",
    logo: "/integrations/omie.png",
    status: "active",
    config: {
      apiKey: process.env.OMIE_APP_KEY,
      apiSecret: process.env.OMIE_APP_SECRET,
      settings: {},
    },
    features: [
      "Gestão financeira",
      "Notas fiscais",
      "Estoque",
      "Vendas",
      "Compras",
      "Relatórios",
    ],
    pricing: {
      model: "subscription",
      price: 199,
      currency: "BRL",
      interval: "month",
    },
    metrics: {
      requests: 45000,
      successRate: 97.8,
      avgResponseTime: 650,
      lastUsed: new Date(),
    },
    documentation: "https://developer.omie.com.br",
    support: {
      email: "api@omie.com.br",
      docs: "https://developer.omie.com.br/docs",
    },
  },
  {
    id: "bling",
    name: "Bling",
    category: "erp",
    provider: "Bling Sistemas",
    description: "Sistema de gestão online para e-commerce",
    logo: "/integrations/bling.png",
    status: "active",
    config: {
      apiKey: process.env.BLING_API_KEY,
      settings: {},
    },
    features: [
      "Gestão de pedidos",
      "Estoque",
      "Notas fiscais",
      "Integração com marketplaces",
      "Relatórios",
    ],
    pricing: {
      model: "subscription",
      price: 99,
      currency: "BRL",
      interval: "month",
    },
    metrics: {
      requests: 65000,
      successRate: 98.2,
      avgResponseTime: 580,
      lastUsed: new Date(),
    },
    documentation: "https://manuais.bling.com.br/api",
    support: {
      email: "suporte@bling.com.br",
      docs: "https://manuais.bling.com.br",
    },
  },
];

// API Marketplace
export function getAPIMarketplace(): APIMarketplace {
  const allIntegrations = [
    ...paymentIntegrations,
    ...shippingIntegrations,
    ...marketingIntegrations,
    ...crmIntegrations,
    ...analyticsIntegrations,
    ...communicationIntegrations,
    ...erpIntegrations,
  ];

  return {
    categories: [
      {
        id: "payment",
        name: "Pagamentos",
        description: "Gateways de pagamento e processadores",
        integrationCount: paymentIntegrations.length,
      },
      {
        id: "shipping",
        name: "Logística",
        description: "Transportadoras e gestão de envios",
        integrationCount: shippingIntegrations.length,
      },
      {
        id: "marketing",
        name: "Marketing",
        description: "Email marketing, automação e anúncios",
        integrationCount: marketingIntegrations.length,
      },
      {
        id: "crm",
        name: "CRM",
        description: "Gestão de relacionamento com clientes",
        integrationCount: crmIntegrations.length,
      },
      {
        id: "analytics",
        name: "Analytics",
        description: "Análise de dados e comportamento",
        integrationCount: analyticsIntegrations.length,
      },
      {
        id: "communication",
        name: "Comunicação",
        description: "SMS, email e mensagens",
        integrationCount: communicationIntegrations.length,
      },
      {
        id: "erp",
        name: "ERP/Contabilidade",
        description: "Gestão empresarial e fiscal",
        integrationCount: erpIntegrations.length,
      },
    ],
    featured: [
      paymentIntegrations[0], // PagSeguro
      shippingIntegrations[0], // Correios
      marketingIntegrations[0], // Mailchimp
      analyticsIntegrations[0], // Google Analytics
    ],
    popular: allIntegrations
      .sort((a, b) => b.metrics.requests - a.metrics.requests)
      .slice(0, 6),
    new: allIntegrations.slice(-3),
    all: allIntegrations,
  };
}

// Integration health check
export interface IntegrationHealth {
  integrationId: string;
  name: string;
  status: "healthy" | "degraded" | "down";
  uptime: number; // percentage
  lastCheck: Date;
  issues: {
    severity: "critical" | "warning" | "info";
    message: string;
    timestamp: Date;
  }[];
  metrics: {
    successRate: number;
    avgResponseTime: number;
    errorRate: number;
    requestsLast24h: number;
  };
}

export function checkIntegrationHealth(integrationId: string): IntegrationHealth {
  // Mock implementation - in production, perform actual health checks
  return {
    integrationId,
    name: "PagSeguro",
    status: "healthy",
    uptime: 99.8,
    lastCheck: new Date(),
    issues: [],
    metrics: {
      successRate: 98.5,
      avgResponseTime: 450,
      errorRate: 1.5,
      requestsLast24h: 5200,
    },
  };
}

// Webhook management
export interface Webhook {
  id: string;
  integrationId: string;
  url: string;
  events: string[];
  status: "active" | "inactive" | "failed";
  secret: string;
  retryPolicy: {
    maxRetries: number;
    backoff: "linear" | "exponential";
  };
  metrics: {
    totalDeliveries: number;
    successfulDeliveries: number;
    failedDeliveries: number;
    lastDelivery?: Date;
  };
}

export function createWebhook(
  integrationId: string,
  url: string,
  events: string[]
): Webhook {
  return {
    id: `webhook-${Date.now()}`,
    integrationId,
    url,
    events,
    status: "active",
    secret: Math.random().toString(36).substring(2, 34),
    retryPolicy: {
      maxRetries: 3,
      backoff: "exponential",
    },
    metrics: {
      totalDeliveries: 0,
      successfulDeliveries: 0,
      failedDeliveries: 0,
    },
  };
}

// Integration usage analytics
export interface IntegrationUsageAnalytics {
  integrationId: string;
  name: string;
  period: {
    start: Date;
    end: Date;
  };
  usage: {
    requests: number;
    successfulRequests: number;
    failedRequests: number;
    avgResponseTime: number;
    dataTransferred: number; // bytes
  };
  costs: {
    apiCalls: number;
    dataTransfer: number;
    total: number;
    currency: string;
  };
  topEndpoints: {
    endpoint: string;
    requests: number;
    avgResponseTime: number;
  }[];
}

export function getIntegrationUsageAnalytics(
  integrationId: string,
  startDate: Date,
  endDate: Date
): IntegrationUsageAnalytics {
  // Mock implementation
  return {
    integrationId,
    name: "PagSeguro",
    period: {
      start: startDate,
      end: endDate,
    },
    usage: {
      requests: 125000,
      successfulRequests: 123125,
      failedRequests: 1875,
      avgResponseTime: 450,
      dataTransferred: 52428800, // 50 MB
    },
    costs: {
      apiCalls: 4987.50, // R$ 3.99 per 100 transactions
      dataTransfer: 0,
      total: 4987.50,
      currency: "BRL",
    },
    topEndpoints: [
      {
        endpoint: "/v1/transactions",
        requests: 85000,
        avgResponseTime: 420,
      },
      {
        endpoint: "/v1/transactions/{id}",
        requests: 25000,
        avgResponseTime: 380,
      },
      {
        endpoint: "/v1/refunds",
        requests: 15000,
        avgResponseTime: 550,
      },
    ],
  };
}

// Integration recommendations
export function recommendIntegrations(businessType: string): Integration[] {
  const marketplace = getAPIMarketplace();
  
  // Recommend based on business type and popularity
  return marketplace.popular.slice(0, 5);
}

// Integration setup wizard
export interface IntegrationSetupStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  fields: {
    name: string;
    label: string;
    type: "text" | "password" | "select" | "checkbox";
    required: boolean;
    options?: { value: string; label: string }[];
  }[];
}

export function getIntegrationSetupSteps(integrationId: string): IntegrationSetupStep[] {
  // Mock implementation - in production, return integration-specific steps
  return [
    {
      id: "step-1",
      title: "Criar conta",
      description: "Crie uma conta no PagSeguro se ainda não tiver",
      completed: false,
      fields: [],
    },
    {
      id: "step-2",
      title: "Obter credenciais",
      description: "Obtenha suas credenciais de API no painel do PagSeguro",
      completed: false,
      fields: [
        {
          name: "apiKey",
          label: "API Key",
          type: "password",
          required: true,
        },
        {
          name: "environment",
          label: "Ambiente",
          type: "select",
          required: true,
          options: [
            { value: "sandbox", label: "Sandbox (Testes)" },
            { value: "production", label: "Produção" },
          ],
        },
      ],
    },
    {
      id: "step-3",
      title: "Configurar webhook",
      description: "Configure o webhook para receber notificações de pagamento",
      completed: false,
      fields: [
        {
          name: "webhookUrl",
          label: "URL do Webhook",
          type: "text",
          required: true,
        },
      ],
    },
    {
      id: "step-4",
      title: "Testar integração",
      description: "Faça um pagamento de teste para validar a integração",
      completed: false,
      fields: [],
    },
  ];
}
