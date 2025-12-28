// Dynamic Pricing Engine with Machine Learning

export interface PricingStrategy {
  id: string;
  name: string;
  type: "competitive" | "demand_based" | "time_based" | "customer_based" | "inventory_based" | "bundle" | "ml_optimized";
  enabled: boolean;
  priority: number; // Higher priority strategies are applied first
  rules: PricingRule[];
}

export interface PricingRule {
  id: string;
  condition: {
    field: string;
    operator: "equals" | "greater_than" | "less_than" | "between" | "in";
    value: any;
  };
  adjustment: {
    type: "percentage" | "fixed" | "multiply";
    value: number;
    min?: number; // Minimum price
    max?: number; // Maximum price
  };
}

export interface DynamicPrice {
  productId: string;
  basePrice: number;
  currentPrice: number;
  adjustments: {
    strategy: string;
    amount: number;
    reason: string;
  }[];
  validUntil: Date;
  confidence: number; // 0-100
}

// Pre-configured Pricing Strategies
export const pricingStrategies: PricingStrategy[] = [
  {
    id: "competitive-pricing",
    name: "Preço Competitivo",
    type: "competitive",
    enabled: true,
    priority: 1,
    rules: [
      {
        id: "rule-1",
        condition: {
          field: "competitor.avgPrice",
          operator: "less_than",
          value: "basePrice",
        },
        adjustment: {
          type: "percentage",
          value: -5, // 5% discount to match competition
          min: 0,
        },
      },
    ],
  },
  {
    id: "demand-based-pricing",
    name: "Preço Baseado em Demanda",
    type: "demand_based",
    enabled: true,
    priority: 2,
    rules: [
      {
        id: "rule-1",
        condition: {
          field: "product.viewsLast24h",
          operator: "greater_than",
          value: 100,
        },
        adjustment: {
          type: "percentage",
          value: 5, // 5% increase for high demand
          max: 999999,
        },
      },
      {
        id: "rule-2",
        condition: {
          field: "product.cartAddsLast24h",
          operator: "greater_than",
          value: 50,
        },
        adjustment: {
          type: "percentage",
          value: 3, // Additional 3% for high cart adds
          max: 999999,
        },
      },
    ],
  },
  {
    id: "time-based-pricing",
    name: "Preço Baseado em Tempo",
    type: "time_based",
    enabled: true,
    priority: 3,
    rules: [
      {
        id: "rule-1",
        condition: {
          field: "time.hour",
          operator: "between",
          value: [22, 6], // Night hours
        },
        adjustment: {
          type: "percentage",
          value: -10, // 10% discount for night purchases
          min: 0,
        },
      },
      {
        id: "rule-2",
        condition: {
          field: "time.dayOfWeek",
          operator: "in",
          value: [0, 6], // Weekend
        },
        adjustment: {
          type: "percentage",
          value: -5, // 5% weekend discount
          min: 0,
        },
      },
    ],
  },
  {
    id: "customer-based-pricing",
    name: "Preço Personalizado por Cliente",
    type: "customer_based",
    enabled: true,
    priority: 4,
    rules: [
      {
        id: "rule-1",
        condition: {
          field: "customer.tier",
          operator: "equals",
          value: "vip",
        },
        adjustment: {
          type: "percentage",
          value: -15, // 15% VIP discount
          min: 0,
        },
      },
      {
        id: "rule-2",
        condition: {
          field: "customer.lifetimeValue",
          operator: "greater_than",
          value: 1000,
        },
        adjustment: {
          type: "percentage",
          value: -10, // 10% for high-value customers
          min: 0,
        },
      },
      {
        id: "rule-3",
        condition: {
          field: "customer.isFirstPurchase",
          operator: "equals",
          value: true,
        },
        adjustment: {
          type: "percentage",
          value: -10, // 10% first purchase discount
          min: 0,
        },
      },
    ],
  },
  {
    id: "inventory-based-pricing",
    name: "Preço Baseado em Estoque",
    type: "inventory_based",
    enabled: true,
    priority: 5,
    rules: [
      {
        id: "rule-1",
        condition: {
          field: "product.stock",
          operator: "less_than",
          value: 5,
        },
        adjustment: {
          type: "percentage",
          value: 10, // 10% increase for low stock (scarcity)
          max: 999999,
        },
      },
      {
        id: "rule-2",
        condition: {
          field: "product.stock",
          operator: "greater_than",
          value: 100,
        },
        adjustment: {
          type: "percentage",
          value: -8, // 8% discount to move excess inventory
          min: 0,
        },
      },
      {
        id: "rule-3",
        condition: {
          field: "product.daysInStock",
          operator: "greater_than",
          value: 90,
        },
        adjustment: {
          type: "percentage",
          value: -15, // 15% discount for old inventory
          min: 0,
        },
      },
    ],
  },
];

// Dynamic Pricing Engine
export class DynamicPricingEngine {
  private strategies: PricingStrategy[];

  constructor(strategies?: PricingStrategy[]) {
    this.strategies = strategies || pricingStrategies;
  }

  calculatePrice(
    productId: string,
    basePrice: number,
    context: Record<string, any>
  ): DynamicPrice {
    let currentPrice = basePrice;
    const adjustments: DynamicPrice["adjustments"] = [];

    // Sort strategies by priority
    const enabledStrategies = this.strategies
      .filter(s => s.enabled)
      .sort((a, b) => a.priority - b.priority);

    // Apply each strategy
    for (const strategy of enabledStrategies) {
      for (const rule of strategy.rules) {
        if (this.evaluateCondition(rule.condition, context)) {
          const adjustment = this.applyAdjustment(
            currentPrice,
            rule.adjustment
          );
          
          currentPrice = adjustment.newPrice;
          adjustments.push({
            strategy: strategy.name,
            amount: adjustment.amount,
            reason: this.generateReason(strategy, rule, context),
          });
        }
      }
    }

    // Use ML to optimize final price
    const mlOptimizedPrice = this.mlOptimizePrice(
      productId,
      currentPrice,
      context
    );

    if (mlOptimizedPrice !== currentPrice) {
      adjustments.push({
        strategy: "ML Optimization",
        amount: mlOptimizedPrice - currentPrice,
        reason: "Otimizado por IA para maximizar conversão e receita",
      });
      currentPrice = mlOptimizedPrice;
    }

    return {
      productId,
      basePrice,
      currentPrice: Math.max(0, currentPrice),
      adjustments,
      validUntil: new Date(Date.now() + 3600000), // Valid for 1 hour
      confidence: 85,
    };
  }

  private evaluateCondition(
    condition: PricingRule["condition"],
    context: Record<string, any>
  ): boolean {
    const value = this.getNestedValue(context, condition.field);

    switch (condition.operator) {
      case "equals":
        return value === condition.value;
      case "greater_than":
        return value > condition.value;
      case "less_than":
        return value < condition.value;
      case "between":
        return (
          Array.isArray(condition.value) &&
          value >= condition.value[0] &&
          value <= condition.value[1]
        );
      case "in":
        return Array.isArray(condition.value) && condition.value.includes(value);
      default:
        return false;
    }
  }

  private applyAdjustment(
    currentPrice: number,
    adjustment: PricingRule["adjustment"]
  ): { newPrice: number; amount: number } {
    let newPrice = currentPrice;

    switch (adjustment.type) {
      case "percentage":
        newPrice = currentPrice * (1 + adjustment.value / 100);
        break;
      case "fixed":
        newPrice = currentPrice + adjustment.value;
        break;
      case "multiply":
        newPrice = currentPrice * adjustment.value;
        break;
    }

    // Apply min/max constraints
    if (adjustment.min !== undefined) {
      newPrice = Math.max(newPrice, adjustment.min);
    }
    if (adjustment.max !== undefined) {
      newPrice = Math.min(newPrice, adjustment.max);
    }

    return {
      newPrice,
      amount: newPrice - currentPrice,
    };
  }

  private mlOptimizePrice(
    productId: string,
    currentPrice: number,
    context: Record<string, any>
  ): number {
    // Mock ML optimization - in production, use real ML model
    // Factors: conversion probability, price elasticity, competitor prices, customer willingness to pay
    
    const conversionProbability = this.predictConversionProbability(
      currentPrice,
      context
    );
    
    const priceElasticity = this.calculatePriceElasticity(productId, context);
    
    // Optimize for revenue = price * conversion_probability
    const optimalPrice = this.findOptimalPrice(
      currentPrice,
      conversionProbability,
      priceElasticity
    );

    return optimalPrice;
  }

  private predictConversionProbability(
    price: number,
    context: Record<string, any>
  ): number {
    // Mock implementation - in production, use trained ML model
    // Features: price, customer tier, time of day, competitor prices, etc.
    
    const baseConversion = 0.035; // 3.5% base conversion rate
    
    // Adjust based on customer tier
    const tierMultiplier = context.customer?.tier === "vip" ? 1.5 : 1.0;
    
    // Adjust based on time
    const hour = new Date().getHours();
    const timeMultiplier = hour >= 9 && hour <= 21 ? 1.2 : 0.8;
    
    return baseConversion * tierMultiplier * timeMultiplier;
  }

  private calculatePriceElasticity(
    productId: string,
    context: Record<string, any>
  ): number {
    // Mock implementation - in production, calculate from historical data
    // Price elasticity = % change in quantity / % change in price
    
    return -1.5; // Typical e-commerce elasticity
  }

  private findOptimalPrice(
    currentPrice: number,
    conversionProbability: number,
    priceElasticity: number
  ): number {
    // Simplified optimization - in production, use gradient descent or similar
    
    const testPrices = [
      currentPrice * 0.95,
      currentPrice,
      currentPrice * 1.05,
    ];

    let maxRevenue = 0;
    let optimalPrice = currentPrice;

    for (const price of testPrices) {
      const priceChange = (price - currentPrice) / currentPrice;
      const demandChange = priceElasticity * priceChange;
      const adjustedConversion = conversionProbability * (1 + demandChange);
      const expectedRevenue = price * adjustedConversion;

      if (expectedRevenue > maxRevenue) {
        maxRevenue = expectedRevenue;
        optimalPrice = price;
      }
    }

    return optimalPrice;
  }

  private generateReason(
    strategy: PricingStrategy,
    rule: PricingRule,
    context: Record<string, any>
  ): string {
    const reasons: Record<string, string> = {
      "competitive-pricing": "Preço ajustado para competir com o mercado",
      "demand-based-pricing": "Alta demanda detectada",
      "time-based-pricing": "Promoção especial de horário",
      "customer-based-pricing": "Desconto personalizado para você",
      "inventory-based-pricing": "Ajuste baseado em disponibilidade",
    };

    return reasons[strategy.id] || "Preço otimizado";
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }
}

// Price Optimization Analytics
export interface PriceOptimizationAnalytics {
  totalProducts: number;
  dynamicPricingEnabled: number;
  avgPriceAdjustment: number; // percentage
  revenueIncrease: number; // BRL
  conversionIncrease: number; // percentage
  topPerformingStrategies: {
    strategy: string;
    avgAdjustment: number;
    revenueImpact: number;
    applicationsCount: number;
  }[];
  priceDistribution: {
    increased: number;
    decreased: number;
    unchanged: number;
  };
}

export function getPriceOptimizationAnalytics(): PriceOptimizationAnalytics {
  return {
    totalProducts: 450,
    dynamicPricingEnabled: 420,
    avgPriceAdjustment: 3.5,
    revenueIncrease: 285000, // R$ 285k additional revenue
    conversionIncrease: 12.5,
    topPerformingStrategies: [
      {
        strategy: "ML Optimization",
        avgAdjustment: 2.8,
        revenueImpact: 125000,
        applicationsCount: 420,
      },
      {
        strategy: "Customer-Based Pricing",
        avgAdjustment: -12.5,
        revenueImpact: 85000,
        applicationsCount: 8500,
      },
      {
        strategy: "Demand-Based Pricing",
        avgAdjustment: 4.2,
        revenueImpact: 45000,
        applicationsCount: 2800,
      },
      {
        strategy: "Inventory-Based Pricing",
        avgAdjustment: -6.5,
        revenueImpact: 20000,
        applicationsCount: 1200,
      },
      {
        strategy: "Time-Based Pricing",
        avgAdjustment: -7.5,
        revenueImpact: 10000,
        applicationsCount: 3500,
      },
    ],
    priceDistribution: {
      increased: 180, // 40%
      decreased: 210, // 47%
      unchanged: 60, // 13%
    },
  };
}

// A/B Testing for Pricing
export interface PriceTest {
  id: string;
  productId: string;
  name: string;
  status: "running" | "completed" | "paused";
  variants: {
    name: string;
    price: number;
    traffic: number; // percentage
    conversions: number;
    revenue: number;
  }[];
  startDate: Date;
  endDate?: Date;
  winner?: string;
  confidence: number; // statistical confidence
}

export function createPriceTest(
  productId: string,
  basePrice: number,
  variants: number[]
): PriceTest {
  return {
    id: `test-${Date.now()}`,
    productId,
    name: `Price Test: ${productId}`,
    status: "running",
    variants: [
      {
        name: "Control",
        price: basePrice,
        traffic: 50,
        conversions: 0,
        revenue: 0,
      },
      ...variants.map((price, index) => ({
        name: `Variant ${index + 1}`,
        price,
        traffic: 50 / variants.length,
        conversions: 0,
        revenue: 0,
      })),
    ],
    startDate: new Date(),
    confidence: 0,
  };
}

// Price Change History
export interface PriceHistory {
  productId: string;
  changes: {
    timestamp: Date;
    oldPrice: number;
    newPrice: number;
    reason: string;
    strategy: string;
  }[];
}

// Export singleton instance
export const dynamicPricingEngine = new DynamicPricingEngine();
