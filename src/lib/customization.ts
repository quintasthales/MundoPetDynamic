// Product Customization and Personalization System

export interface CustomizableProduct {
  id: string;
  productId: string;
  productName: string;
  basePrice: number;
  customizationOptions: CustomizationOption[];
  previewImages: {
    default: string;
    customized?: string;
  };
  minCustomizationTime: number; // days
  maxCustomizationTime: number; // days
  enabled: boolean;
}

export interface CustomizationOption {
  id: string;
  type:
    | "text"
    | "color"
    | "size"
    | "material"
    | "engraving"
    | "embroidery"
    | "image_upload"
    | "pattern"
    | "addon";
  name: string;
  description: string;
  required: boolean;
  options?: CustomizationChoice[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    allowedFormats?: string[]; // For image uploads
    maxFileSize?: number; // MB
  };
  priceModifier?: {
    type: "fixed" | "percentage";
    amount: number;
  };
  affectsProductionTime?: boolean;
  additionalDays?: number;
}

export interface CustomizationChoice {
  id: string;
  value: string;
  label: string;
  priceModifier?: number;
  imageUrl?: string;
  hexColor?: string; // For color options
  available: boolean;
  stockCount?: number;
}

export interface CustomizedOrder {
  id: string;
  orderId: string;
  userId: string;
  productId: string;
  productName: string;
  basePrice: number;
  customizations: {
    optionId: string;
    optionName: string;
    value: string;
    label?: string;
    priceModifier: number;
    uploadedFile?: string;
  }[];
  totalPrice: number;
  customizationPrice: number;
  status:
    | "pending_approval"
    | "approved"
    | "in_production"
    | "completed"
    | "rejected";
  mockupUrl?: string;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  productionStartedAt?: Date;
  completedAt?: Date;
  estimatedCompletionDate: Date;
  createdAt: Date;
}

export interface PersonalizationRule {
  id: string;
  name: string;
  type: "product_recommendation" | "content" | "pricing" | "promotion";
  conditions: {
    customerSegment?: string[];
    purchaseHistory?: {
      minOrders?: number;
      categories?: string[];
      totalSpent?: { min?: number; max?: number };
    };
    browsing?: {
      viewedCategories?: string[];
      viewedProducts?: string[];
      timeOnSite?: number; // minutes
    };
    demographics?: {
      location?: string[];
      ageRange?: { min: number; max: number };
    };
  };
  action: {
    type: string;
    value: any;
  };
  priority: number;
  enabled: boolean;
}

export interface PersonalizedExperience {
  userId: string;
  recommendedProducts: {
    productId: string;
    score: number;
    reason: string;
  }[];
  personalizedContent: {
    section: string;
    content: string;
  }[];
  specialOffers: {
    offerId: string;
    discount: number;
    reason: string;
  }[];
  customGreeting?: string;
  preferredCategories: string[];
  recentlyViewed: string[];
  savedForLater: string[];
}

// Mock customizable products
export const customizableProducts: CustomizableProduct[] = [
  {
    id: "custom-001",
    productId: "coleira-personalizada",
    productName: "Coleira Personalizada",
    basePrice: 49.9,
    customizationOptions: [
      {
        id: "opt-001",
        type: "text",
        name: "Nome do Pet",
        description: "Nome que será bordado na coleira (máx. 15 caracteres)",
        required: true,
        validation: {
          minLength: 2,
          maxLength: 15,
          pattern: "^[a-zA-ZÀ-ÿ\\s]+$",
        },
        priceModifier: {
          type: "fixed",
          amount: 10.0,
        },
        affectsProductionTime: true,
        additionalDays: 2,
      },
      {
        id: "opt-002",
        type: "color",
        name: "Cor da Coleira",
        description: "Escolha a cor principal da coleira",
        required: true,
        options: [
          {
            id: "color-001",
            value: "red",
            label: "Vermelho",
            hexColor: "#FF0000",
            available: true,
            stockCount: 50,
          },
          {
            id: "color-002",
            value: "blue",
            label: "Azul",
            hexColor: "#0000FF",
            available: true,
            stockCount: 45,
          },
          {
            id: "color-003",
            value: "green",
            label: "Verde",
            hexColor: "#00FF00",
            available: true,
            stockCount: 30,
          },
          {
            id: "color-004",
            value: "black",
            label: "Preto",
            hexColor: "#000000",
            available: true,
            stockCount: 60,
          },
        ],
      },
      {
        id: "opt-003",
        type: "size",
        name: "Tamanho",
        description: "Tamanho da coleira baseado no porte do pet",
        required: true,
        options: [
          {
            id: "size-001",
            value: "P",
            label: "Pequeno (até 5kg)",
            available: true,
          },
          {
            id: "size-002",
            value: "M",
            label: "Médio (5-15kg)",
            available: true,
          },
          {
            id: "size-003",
            value: "G",
            label: "Grande (15-30kg)",
            priceModifier: 5.0,
            available: true,
          },
          {
            id: "size-004",
            value: "GG",
            label: "Extra Grande (30kg+)",
            priceModifier: 10.0,
            available: true,
          },
        ],
      },
      {
        id: "opt-004",
        type: "pattern",
        name: "Estampa",
        description: "Escolha uma estampa opcional",
        required: false,
        options: [
          {
            id: "pattern-001",
            value: "paws",
            label: "Patinhas",
            priceModifier: 5.0,
            imageUrl: "/patterns/paws.jpg",
            available: true,
          },
          {
            id: "pattern-002",
            value: "stars",
            label: "Estrelas",
            priceModifier: 5.0,
            imageUrl: "/patterns/stars.jpg",
            available: true,
          },
          {
            id: "pattern-003",
            value: "hearts",
            label: "Corações",
            priceModifier: 5.0,
            imageUrl: "/patterns/hearts.jpg",
            available: true,
          },
        ],
      },
      {
        id: "opt-005",
        type: "addon",
        name: "Plaquinha de Identificação",
        description: "Adicione uma plaquinha com telefone de contato",
        required: false,
        priceModifier: {
          type: "fixed",
          amount: 15.0,
        },
        affectsProductionTime: true,
        additionalDays: 1,
      },
    ],
    previewImages: {
      default: "/products/coleira-base.jpg",
    },
    minCustomizationTime: 3,
    maxCustomizationTime: 7,
    enabled: true,
  },
];

// Mock customized orders
export const customizedOrders: CustomizedOrder[] = [];

// Create customized order
export function createCustomizedOrder(data: {
  orderId: string;
  userId: string;
  productId: string;
  customizations: {
    optionId: string;
    value: string;
    uploadedFile?: string;
  }[];
}): CustomizedOrder {
  const customProduct = customizableProducts.find(
    (p) => p.productId === data.productId
  );

  if (!customProduct) {
    throw new Error("Product not customizable");
  }

  let totalPrice = customProduct.basePrice;
  let customizationPrice = 0;
  let additionalDays = 0;

  const customizations = data.customizations.map((custom) => {
    const option = customProduct.customizationOptions.find(
      (opt) => opt.id === custom.optionId
    );

    if (!option) {
      throw new Error(`Invalid customization option: ${custom.optionId}`);
    }

    // Validate
    if (option.validation) {
      if (option.type === "text") {
        if (
          option.validation.minLength &&
          custom.value.length < option.validation.minLength
        ) {
          throw new Error(
            `${option.name} must be at least ${option.validation.minLength} characters`
          );
        }
        if (
          option.validation.maxLength &&
          custom.value.length > option.validation.maxLength
        ) {
          throw new Error(
            `${option.name} must be at most ${option.validation.maxLength} characters`
          );
        }
        if (option.validation.pattern) {
          const regex = new RegExp(option.validation.pattern);
          if (!regex.test(custom.value)) {
            throw new Error(`${option.name} format is invalid`);
          }
        }
      }
    }

    // Calculate price
    let priceModifier = 0;

    if (option.priceModifier) {
      if (option.priceModifier.type === "fixed") {
        priceModifier = option.priceModifier.amount;
      } else {
        priceModifier =
          (customProduct.basePrice * option.priceModifier.amount) / 100;
      }
    }

    // Check if choice has price modifier
    if (option.options) {
      const choice = option.options.find((c) => c.value === custom.value);
      if (choice && choice.priceModifier) {
        priceModifier += choice.priceModifier;
      }
    }

    totalPrice += priceModifier;
    customizationPrice += priceModifier;

    // Add production time
    if (option.affectsProductionTime && option.additionalDays) {
      additionalDays += option.additionalDays;
    }

    return {
      optionId: custom.optionId,
      optionName: option.name,
      value: custom.value,
      label: option.options?.find((c) => c.value === custom.value)?.label,
      priceModifier,
      uploadedFile: custom.uploadedFile,
    };
  });

  const estimatedCompletionDate = new Date();
  estimatedCompletionDate.setDate(
    estimatedCompletionDate.getDate() +
      customProduct.minCustomizationTime +
      additionalDays
  );

  const order: CustomizedOrder = {
    id: `custom-order-${Date.now()}`,
    orderId: data.orderId,
    userId: data.userId,
    productId: data.productId,
    productName: customProduct.productName,
    basePrice: customProduct.basePrice,
    customizations,
    totalPrice,
    customizationPrice,
    status: "pending_approval",
    estimatedCompletionDate,
    createdAt: new Date(),
  };

  customizedOrders.push(order);

  // In production, generate mockup and send for approval
  return order;
}

// Approve customized order
export function approveCustomizedOrder(
  customOrderId: string,
  mockupUrl?: string
): boolean {
  const order = customizedOrders.find((o) => o.id === customOrderId);
  if (!order || order.status !== "pending_approval") return false;

  order.status = "approved";
  order.approvedAt = new Date();
  order.mockupUrl = mockupUrl;

  // In production, send to production queue
  return true;
}

// Reject customized order
export function rejectCustomizedOrder(
  customOrderId: string,
  reason: string
): boolean {
  const order = customizedOrders.find((o) => o.id === customOrderId);
  if (!order || order.status !== "pending_approval") return false;

  order.status = "rejected";
  order.rejectedAt = new Date();
  order.rejectionReason = reason;

  // In production, notify customer and offer revision
  return true;
}

// Start production
export function startCustomizedOrderProduction(customOrderId: string): boolean {
  const order = customizedOrders.find((o) => o.id === customOrderId);
  if (!order || order.status !== "approved") return false;

  order.status = "in_production";
  order.productionStartedAt = new Date();

  return true;
}

// Complete customized order
export function completeCustomizedOrder(customOrderId: string): boolean {
  const order = customizedOrders.find((o) => o.id === customOrderId);
  if (!order || order.status !== "in_production") return false;

  order.status = "completed";
  order.completedAt = new Date();

  return true;
}

// Personalization rules
export const personalizationRules: PersonalizationRule[] = [
  {
    id: "rule-001",
    name: "Recommend similar products to frequent buyers",
    type: "product_recommendation",
    conditions: {
      purchaseHistory: {
        minOrders: 3,
      },
    },
    action: {
      type: "recommend_similar",
      value: { count: 5, weight: 0.8 },
    },
    priority: 1,
    enabled: true,
  },
  {
    id: "rule-002",
    name: "VIP customer special pricing",
    type: "pricing",
    conditions: {
      customerSegment: ["gold", "platinum"],
      purchaseHistory: {
        totalSpent: { min: 1000 },
      },
    },
    action: {
      type: "apply_discount",
      value: { percentage: 10 },
    },
    priority: 2,
    enabled: true,
  },
  {
    id: "rule-003",
    name: "New customer welcome offer",
    type: "promotion",
    conditions: {
      purchaseHistory: {
        minOrders: 0,
      },
    },
    action: {
      type: "show_banner",
      value: {
        message: "Bem-vindo! Ganhe 15% OFF na primeira compra",
        code: "WELCOME15",
      },
    },
    priority: 3,
    enabled: true,
  },
];

// Generate personalized experience
export function generatePersonalizedExperience(
  userId: string,
  userHistory: {
    orders: number;
    totalSpent: number;
    viewedProducts: string[];
    viewedCategories: string[];
    segment?: string;
  }
): PersonalizedExperience {
  const experience: PersonalizedExperience = {
    userId,
    recommendedProducts: [],
    personalizedContent: [],
    specialOffers: [],
    preferredCategories: userHistory.viewedCategories.slice(0, 5),
    recentlyViewed: userHistory.viewedProducts.slice(0, 10),
    savedForLater: [],
  };

  // Apply personalization rules
  for (const rule of personalizationRules.filter((r) => r.enabled)) {
    let matches = true;

    // Check conditions
    if (rule.conditions.customerSegment && userHistory.segment) {
      if (!rule.conditions.customerSegment.includes(userHistory.segment)) {
        matches = false;
      }
    }

    if (rule.conditions.purchaseHistory) {
      if (
        rule.conditions.purchaseHistory.minOrders &&
        userHistory.orders < rule.conditions.purchaseHistory.minOrders
      ) {
        matches = false;
      }

      if (rule.conditions.purchaseHistory.totalSpent) {
        const spent = rule.conditions.purchaseHistory.totalSpent;
        if (spent.min && userHistory.totalSpent < spent.min) {
          matches = false;
        }
        if (spent.max && userHistory.totalSpent > spent.max) {
          matches = false;
        }
      }
    }

    if (matches) {
      // Apply action
      if (rule.type === "product_recommendation") {
        // In production, use ML model or collaborative filtering
        experience.recommendedProducts.push({
          productId: "difusor-aromatico",
          score: 0.85,
          reason: "Baseado no seu histórico de compras",
        });
      } else if (rule.type === "promotion") {
        experience.specialOffers.push({
          offerId: rule.id,
          discount: 15,
          reason: rule.action.value.message,
        });
      }
    }
  }

  // Custom greeting
  if (userHistory.orders === 0) {
    experience.customGreeting = "Bem-vindo ao MundoPetZen! 🐾";
  } else if (userHistory.orders >= 10) {
    experience.customGreeting = "Olá, cliente especial! 🌟";
  } else {
    experience.customGreeting = "Que bom ter você de volta! 😊";
  }

  return experience;
}

// Product recommendation engine
export interface ProductRecommendation {
  productId: string;
  productName: string;
  score: number;
  reason: string;
  type:
    | "similar"
    | "frequently_bought_together"
    | "trending"
    | "personalized"
    | "new_arrival";
}

export function getProductRecommendations(
  userId: string,
  productId?: string,
  limit: number = 10
): ProductRecommendation[] {
  // Mock recommendations - in production, use ML model
  const recommendations: ProductRecommendation[] = [
    {
      productId: "coleira-led",
      productName: "Coleira LED Recarregável",
      score: 0.92,
      reason: "Clientes que compraram este produto também compraram",
      type: "frequently_bought_together",
    },
    {
      productId: "shampoo-natural",
      productName: "Shampoo Natural Pet Care",
      score: 0.88,
      reason: "Produtos similares que você pode gostar",
      type: "similar",
    },
    {
      productId: "kit-brinquedos",
      productName: "Kit Brinquedos Interativos",
      score: 0.85,
      reason: "Baseado no seu histórico de navegação",
      type: "personalized",
    },
    {
      productId: "cama-ortopedica",
      productName: "Cama Ortopédica Premium",
      score: 0.82,
      reason: "Produto em alta esta semana",
      type: "trending",
    },
  ];

  return recommendations.slice(0, limit);
}

// Dynamic pricing
export interface DynamicPrice {
  basePrice: number;
  finalPrice: number;
  discount: number;
  discountReason: string;
  validUntil?: Date;
}

export function calculateDynamicPrice(
  productId: string,
  userId: string,
  userSegment?: string
): DynamicPrice {
  const basePrice = 129.9; // Mock - get from product

  let discount = 0;
  let discountReason = "";

  // Apply personalization rules
  const pricingRules = personalizationRules.filter(
    (r) => r.type === "pricing" && r.enabled
  );

  for (const rule of pricingRules) {
    if (
      rule.conditions.customerSegment &&
      userSegment &&
      rule.conditions.customerSegment.includes(userSegment)
    ) {
      discount = rule.action.value.percentage || 0;
      discountReason = "Desconto exclusivo para clientes VIP";
      break;
    }
  }

  const finalPrice = basePrice * (1 - discount / 100);

  return {
    basePrice,
    finalPrice,
    discount,
    discountReason,
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
}

// A/B test variant assignment
export interface ABTestVariant {
  testId: string;
  testName: string;
  variantId: string;
  variantName: string;
  changes: {
    element: string;
    property: string;
    value: any;
  }[];
}

export function assignABTestVariant(
  userId: string,
  testId: string
): ABTestVariant {
  // Consistent hash-based assignment
  const hash = userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variantIndex = hash % 2; // 2 variants: A and B

  const variants: ABTestVariant[] = [
    {
      testId,
      testName: "Product Page CTA Test",
      variantId: "variant-a",
      variantName: "Control",
      changes: [],
    },
    {
      testId,
      testName: "Product Page CTA Test",
      variantId: "variant-b",
      variantName: "Treatment",
      changes: [
        {
          element: ".add-to-cart-button",
          property: "text",
          value: "Comprar Agora",
        },
        {
          element: ".add-to-cart-button",
          property: "color",
          value: "#FF6B35",
        },
      ],
    },
  ];

  return variants[variantIndex];
}

// Customization analytics
export interface CustomizationAnalytics {
  totalCustomizedOrders: number;
  averageCustomizationPrice: number;
  conversionRate: number;
  popularOptions: {
    optionId: string;
    optionName: string;
    usageCount: number;
    percentage: number;
  }[];
  averageProductionTime: number;
  approvalRate: number;
}

export function getCustomizationAnalytics(): CustomizationAnalytics {
  const totalOrders = customizedOrders.length;
  const averagePrice =
    customizedOrders.reduce((sum, o) => sum + o.customizationPrice, 0) /
    Math.max(1, totalOrders);

  const approvedOrders = customizedOrders.filter(
    (o) => o.status !== "rejected"
  ).length;

  return {
    totalCustomizedOrders: totalOrders,
    averageCustomizationPrice: averagePrice,
    conversionRate: 8.5, // Mock
    popularOptions: [], // Mock
    averageProductionTime: 5, // days
    approvalRate: (approvedOrders / Math.max(1, totalOrders)) * 100,
  };
}
