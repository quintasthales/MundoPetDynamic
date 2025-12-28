// Inventory Forecasting and Demand Prediction System

export interface InventoryForecast {
  productId: string;
  productName: string;
  currentStock: number;
  forecastedDemand: DemandForecast[];
  recommendedReorder: ReorderRecommendation;
  stockoutRisk: number; // 0-100
  overstockRisk: number; // 0-100
  optimalStockLevel: number;
  safetyStock: number;
  leadTime: number; // days
  lastUpdated: Date;
}

export interface DemandForecast {
  date: Date;
  predictedDemand: number;
  confidence: number; // 0-100
  lowerBound: number;
  upperBound: number;
  factors: DemandFactor[];
}

export interface DemandFactor {
  name: string;
  impact: number; // -100 to 100
  description: string;
}

export interface ReorderRecommendation {
  shouldReorder: boolean;
  recommendedQuantity: number;
  urgency: "low" | "medium" | "high" | "critical";
  estimatedStockoutDate?: Date;
  costImpact: number;
  reasoning: string[];
}

// Forecasting Models
export class InventoryForecaster {
  // Time Series Forecasting (ARIMA-style)
  forecastTimeSeries(
    historicalData: number[],
    periods: number
  ): DemandForecast[] {
    const forecasts: DemandForecast[] = [];
    
    // Calculate trend and seasonality
    const trend = this.calculateTrend(historicalData);
    const seasonality = this.calculateSeasonality(historicalData);
    
    for (let i = 0; i < periods; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Simple forecast with trend and seasonality
      const lastValue = historicalData[historicalData.length - 1];
      const trendComponent = trend * (i + 1);
      const seasonalComponent =
        seasonality[i % seasonality.length] || 0;
      const predicted = Math.max(
        0,
        lastValue + trendComponent + seasonalComponent
      );
      
      // Calculate confidence interval
      const stdDev = this.calculateStdDev(historicalData);
      const confidence = Math.max(50, 95 - i * 2); // Decreases with time
      
      forecasts.push({
        date,
        predictedDemand: Math.round(predicted),
        confidence,
        lowerBound: Math.max(0, Math.round(predicted - stdDev * 1.96)),
        upperBound: Math.round(predicted + stdDev * 1.96),
        factors: this.identifyDemandFactors(date),
      });
    }
    
    return forecasts;
  }
  
  private calculateTrend(data: number[]): number {
    if (data.length < 2) return 0;
    
    const n = data.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;
    
    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += data[i];
      sumXY += i * data[i];
      sumX2 += i * i;
    }
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }
  
  private calculateSeasonality(data: number[]): number[] {
    // Simple seasonal decomposition
    const seasonLength = 7; // Weekly seasonality
    const seasonality: number[] = [];
    
    for (let i = 0; i < seasonLength; i++) {
      let sum = 0;
      let count = 0;
      
      for (let j = i; j < data.length; j += seasonLength) {
        sum += data[j];
        count++;
      }
      
      const avg = count > 0 ? sum / count : 0;
      const overallAvg =
        data.reduce((a, b) => a + b, 0) / data.length;
      seasonality.push(avg - overallAvg);
    }
    
    return seasonality;
  }
  
  private calculateStdDev(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance =
      data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) /
      data.length;
    return Math.sqrt(variance);
  }
  
  private identifyDemandFactors(date: Date): DemandFactor[] {
    const factors: DemandFactor[] = [];
    
    // Day of week
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      factors.push({
        name: "Weekend",
        impact: 15,
        description: "Weekend sales typically 15% higher",
      });
    }
    
    // Month
    const month = date.getMonth();
    if (month === 11) {
      // December
      factors.push({
        name: "Holiday Season",
        impact: 35,
        description: "December holiday shopping increases demand",
      });
    }
    
    // Black Friday
    const blackFriday = this.getBlackFriday(date.getFullYear());
    const daysToBlackFriday = Math.floor(
      (blackFriday.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysToBlackFriday >= 0 && daysToBlackFriday <= 7) {
      factors.push({
        name: "Black Friday",
        impact: 85,
        description: "Black Friday week sees massive demand spike",
      });
    }
    
    return factors;
  }
  
  private getBlackFriday(year: number): Date {
    // Black Friday is the day after Thanksgiving (4th Thursday of November)
    const november = new Date(year, 10, 1); // November 1st
    let thursdayCount = 0;
    
    for (let day = 1; day <= 30; day++) {
      const date = new Date(year, 10, day);
      if (date.getDay() === 4) {
        // Thursday
        thursdayCount++;
        if (thursdayCount === 4) {
          return new Date(year, 10, day + 1); // Friday after
        }
      }
    }
    
    return new Date(year, 10, 26); // Fallback
  }
  
  // Machine Learning Demand Prediction
  predictDemandML(features: DemandFeatures): number {
    // Simplified ML model (in production, use trained model)
    const weights = {
      historicalAvg: 0.35,
      trend: 0.25,
      seasonality: 0.15,
      promotions: 0.12,
      marketTrends: 0.08,
      competition: 0.05,
    };
    
    const prediction =
      features.historicalAvg * weights.historicalAvg +
      features.trend * weights.trend +
      features.seasonality * weights.seasonality +
      features.promotions * weights.promotions +
      features.marketTrends * weights.marketTrends -
      features.competition * weights.competition;
    
    return Math.max(0, Math.round(prediction));
  }
  
  // Stock Optimization
  calculateOptimalStock(
    avgDemand: number,
    leadTime: number,
    serviceLevel: number = 0.95
  ): { optimal: number; safety: number } {
    // Economic Order Quantity (EOQ) principles
    const demandDuringLeadTime = avgDemand * leadTime;
    
    // Z-score for service level (95% = 1.645)
    const zScore = serviceLevel === 0.95 ? 1.645 : 1.96;
    
    // Safety stock calculation
    const demandStdDev = avgDemand * 0.2; // Assume 20% variation
    const safetyStock = Math.ceil(
      zScore * demandStdDev * Math.sqrt(leadTime)
    );
    
    const optimalStock = demandDuringLeadTime + safetyStock;
    
    return {
      optimal: Math.ceil(optimalStock),
      safety: safetyStock,
    };
  }
  
  // Reorder Point Calculation
  calculateReorderPoint(
    avgDemand: number,
    leadTime: number,
    safetyStock: number
  ): number {
    return Math.ceil(avgDemand * leadTime + safetyStock);
  }
  
  // Stockout Risk Assessment
  assessStockoutRisk(
    currentStock: number,
    forecastedDemand: number[],
    leadTime: number
  ): number {
    let cumulativeDemand = 0;
    
    for (let i = 0; i < Math.min(leadTime, forecastedDemand.length); i++) {
      cumulativeDemand += forecastedDemand[i];
    }
    
    if (currentStock <= 0) return 100;
    if (currentStock >= cumulativeDemand * 1.5) return 0;
    
    const ratio = currentStock / cumulativeDemand;
    return Math.round(Math.max(0, Math.min(100, (1 - ratio) * 100)));
  }
  
  // Overstock Risk Assessment
  assessOverstockRisk(
    currentStock: number,
    forecastedDemand: number[],
    shelfLife?: number
  ): number {
    const totalForecastedDemand = forecastedDemand.reduce(
      (a, b) => a + b,
      0
    );
    
    if (totalForecastedDemand === 0) return 100;
    
    const daysOfStock = currentStock / (totalForecastedDemand / 30);
    
    if (shelfLife && daysOfStock > shelfLife * 0.8) return 100;
    if (daysOfStock > 90) return 80;
    if (daysOfStock > 60) return 50;
    if (daysOfStock > 45) return 25;
    
    return 0;
  }
}

export interface DemandFeatures {
  historicalAvg: number;
  trend: number;
  seasonality: number;
  promotions: number;
  marketTrends: number;
  competition: number;
}

// Inventory Analytics
export interface InventoryAnalytics {
  totalValue: number;
  totalItems: number;
  stockoutRate: number;
  overstockRate: number;
  turnoverRate: number;
  avgDaysInStock: number;
  forecastAccuracy: number;
  categories: CategoryInventory[];
  topStockoutRisks: InventoryForecast[];
  topOverstockRisks: InventoryForecast[];
}

export interface CategoryInventory {
  category: string;
  value: number;
  items: number;
  turnoverRate: number;
  stockoutRisk: number;
}

export function getInventoryAnalytics(): InventoryAnalytics {
  return {
    totalValue: 2850000,
    totalItems: 1250,
    stockoutRate: 2.8,
    overstockRate: 8.5,
    turnoverRate: 6.2,
    avgDaysInStock: 58,
    forecastAccuracy: 87.5,
    categories: [
      {
        category: "Difusores",
        value: 850000,
        items: 285,
        turnoverRate: 8.5,
        stockoutRisk: 15,
      },
      {
        category: "Óleos Essenciais",
        value: 685000,
        items: 425,
        turnoverRate: 7.2,
        stockoutRisk: 12,
      },
      {
        category: "Velas",
        value: 485000,
        items: 325,
        turnoverRate: 5.8,
        stockoutRisk: 8,
      },
      {
        category: "Incensos",
        value: 425000,
        items: 185,
        turnoverRate: 4.5,
        stockoutRisk: 5,
      },
      {
        category: "Acessórios",
        value: 405000,
        items: 130,
        turnoverRate: 3.2,
        stockoutRisk: 3,
      },
    ],
    topStockoutRisks: [],
    topOverstockRisks: [],
  };
}

// Sample Forecasts
export function getSampleForecasts(): InventoryForecast[] {
  const forecaster = new InventoryForecaster();
  
  return [
    {
      productId: "prod-001",
      productName: "Difusor Aromático Zen",
      currentStock: 125,
      forecastedDemand: forecaster.forecastTimeSeries(
        [45, 52, 48, 55, 62, 58, 65, 72, 68, 75, 82, 78, 85],
        30
      ),
      recommendedReorder: {
        shouldReorder: true,
        recommendedQuantity: 350,
        urgency: "high",
        estimatedStockoutDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        costImpact: 28500,
        reasoning: [
          "Current stock will last only 12 days",
          "Lead time is 14 days",
          "High demand trend detected",
          "Holiday season approaching",
        ],
      },
      stockoutRisk: 75,
      overstockRisk: 5,
      optimalStockLevel: 450,
      safetyStock: 120,
      leadTime: 14,
      lastUpdated: new Date(),
    },
    {
      productId: "prod-002",
      productName: "Óleo Essencial Lavanda",
      currentStock: 850,
      forecastedDemand: forecaster.forecastTimeSeries(
        [95, 102, 98, 105, 112, 108, 115, 122, 118, 125, 132, 128, 135],
        30
      ),
      recommendedReorder: {
        shouldReorder: false,
        recommendedQuantity: 0,
        urgency: "low",
        costImpact: 0,
        reasoning: [
          "Current stock sufficient for 28 days",
          "No immediate reorder needed",
          "Monitor for next 2 weeks",
        ],
      },
      stockoutRisk: 15,
      overstockRisk: 25,
      optimalStockLevel: 750,
      safetyStock: 180,
      leadTime: 10,
      lastUpdated: new Date(),
    },
    {
      productId: "prod-003",
      productName: "Vela Aromática Vanilla",
      currentStock: 1250,
      forecastedDemand: forecaster.forecastTimeSeries(
        [125, 132, 128, 135, 142, 138, 145, 152, 148, 155, 162, 158, 165],
        30
      ),
      recommendedReorder: {
        shouldReorder: false,
        recommendedQuantity: 0,
        urgency: "low",
        costImpact: 0,
        reasoning: [
          "Current stock sufficient for 32 days",
          "Slight overstock detected",
          "Consider promotion to reduce inventory",
        ],
      },
      stockoutRisk: 5,
      overstockRisk: 45,
      optimalStockLevel: 950,
      safetyStock: 220,
      leadTime: 12,
      lastUpdated: new Date(),
    },
  ];
}

// Automated Reorder System
export interface AutoReorderRule {
  id: string;
  productId: string;
  enabled: boolean;
  triggerType: "stock_level" | "forecast" | "time_based";
  triggerValue: number;
  reorderQuantity: number;
  supplierId: string;
  maxBudget?: number;
  conditions: ReorderCondition[];
}

export interface ReorderCondition {
  field: string;
  operator: string;
  value: any;
}

export interface ReorderEvent {
  id: string;
  productId: string;
  quantity: number;
  supplierId: string;
  status: "pending" | "approved" | "ordered" | "received" | "cancelled";
  estimatedCost: number;
  estimatedDelivery: Date;
  triggeredBy: string;
  createdAt: Date;
}

export function createAutoReorderRule(
  productId: string,
  reorderPoint: number,
  reorderQuantity: number
): AutoReorderRule {
  return {
    id: `rule-${Date.now()}`,
    productId,
    enabled: true,
    triggerType: "stock_level",
    triggerValue: reorderPoint,
    reorderQuantity,
    supplierId: "supplier-001",
    conditions: [
      {
        field: "stockoutRisk",
        operator: "greater",
        value: 50,
      },
    ],
  };
}

// Demand Sensing (Real-time)
export interface DemandSignal {
  source: string;
  type: "search" | "cart" | "wishlist" | "social" | "competitor";
  productId: string;
  intensity: number; // 0-100
  timestamp: Date;
}

export class DemandSensor {
  private signals: DemandSignal[] = [];
  
  addSignal(signal: DemandSignal): void {
    this.signals.push(signal);
  }
  
  getRealtimeDemand(productId: string, hours: number = 24): number {
    const cutoff = Date.now() - hours * 60 * 60 * 1000;
    
    const recentSignals = this.signals.filter(
      (s) => s.productId === productId && s.timestamp.getTime() > cutoff
    );
    
    if (recentSignals.length === 0) return 0;
    
    const totalIntensity = recentSignals.reduce(
      (sum, s) => sum + s.intensity,
      0
    );
    return Math.round(totalIntensity / recentSignals.length);
  }
  
  getTrendingProducts(limit: number = 10): string[] {
    const productDemand = new Map<string, number>();
    
    this.signals.forEach((signal) => {
      const current = productDemand.get(signal.productId) || 0;
      productDemand.set(signal.productId, current + signal.intensity);
    });
    
    return Array.from(productDemand.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map((entry) => entry[0]);
  }
}

// Supply Chain Optimization
export interface SupplierPerformance {
  supplierId: string;
  name: string;
  avgLeadTime: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  costCompetitiveness: number;
  reliability: number;
  totalOrders: number;
}

export function getSupplierPerformance(): SupplierPerformance[] {
  return [
    {
      supplierId: "supplier-001",
      name: "Zen Aroma Fornecedor",
      avgLeadTime: 12,
      onTimeDeliveryRate: 94.5,
      qualityScore: 92,
      costCompetitiveness: 88,
      reliability: 95,
      totalOrders: 285,
    },
    {
      supplierId: "supplier-002",
      name: "Pure Essential Distribuidora",
      avgLeadTime: 10,
      onTimeDeliveryRate: 96.2,
      qualityScore: 95,
      costCompetitiveness: 85,
      reliability: 97,
      totalOrders: 425,
    },
    {
      supplierId: "supplier-003",
      name: "Aroma Brasil Ltda",
      avgLeadTime: 15,
      onTimeDeliveryRate: 88.5,
      qualityScore: 88,
      costCompetitiveness: 92,
      reliability: 89,
      totalOrders: 185,
    },
  ];
}
