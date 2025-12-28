// Shipping Optimization and Logistics Management System

export interface ShippingCarrier {
  id: string;
  name: string;
  code: string;
  type: "national" | "international" | "express" | "economy";
  enabled: boolean;
  apiEndpoint?: string;
  apiKey?: string;
  services: ShippingService[];
  coverage: {
    countries: string[];
    states?: string[];
    cities?: string[];
  };
  features: {
    tracking: boolean;
    insurance: boolean;
    signature: boolean;
    pickupService: boolean;
    dropoffPoints: boolean;
  };
  sla: {
    minDays: number;
    maxDays: number;
  };
}

export interface ShippingService {
  id: string;
  carrierId: string;
  name: string;
  code: string;
  type: "standard" | "express" | "same_day" | "next_day" | "economy";
  enabled: boolean;
  baseRate: number;
  weightRate: number; // per kg
  dimensionalFactor: number;
  freeShippingThreshold?: number;
  maxWeight?: number; // kg
  maxDimensions?: {
    length: number; // cm
    width: number;
    height: number;
  };
  insuranceRate?: number; // percentage
  features: string[];
}

export interface ShippingQuote {
  id: string;
  carrierId: string;
  carrierName: string;
  serviceId: string;
  serviceName: string;
  serviceType: string;
  cost: number;
  insuranceCost?: number;
  totalCost: number;
  estimatedDays: {
    min: number;
    max: number;
  };
  deliveryDate: {
    earliest: Date;
    latest: Date;
  };
  features: string[];
  score: number; // Optimization score
  recommended: boolean;
}

export interface ShipmentOptimization {
  orderId: string;
  origin: Address;
  destination: Address;
  packages: Package[];
  quotes: ShippingQuote[];
  recommendedQuote: ShippingQuote;
  savings: {
    amount: number;
    percentage: number;
  };
  factors: {
    cost: number;
    speed: number;
    reliability: number;
  };
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Package {
  id: string;
  weight: number; // kg
  dimensions: {
    length: number; // cm
    width: number;
    height: number;
  };
  value: number;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  orderId: string;
  carrierId: string;
  carrierName: string;
  serviceId: string;
  serviceName: string;
  status:
    | "pending"
    | "label_created"
    | "picked_up"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "failed"
    | "returned";
  origin: Address;
  destination: Address;
  packages: Package[];
  cost: number;
  labelUrl?: string;
  trackingUrl?: string;
  events: ShipmentEvent[];
  estimatedDelivery: Date;
  actualDelivery?: Date;
  signature?: {
    name: string;
    timestamp: Date;
    imageUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ShipmentEvent {
  id: string;
  status: string;
  description: string;
  location?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface RoutingRule {
  id: string;
  name: string;
  priority: number;
  enabled: boolean;
  conditions: {
    destinationState?: string[];
    orderValue?: { min?: number; max?: number };
    weight?: { min?: number; max?: number };
    productCategory?: string[];
    customerTier?: string[];
  };
  action: {
    preferredCarrier?: string;
    preferredService?: string;
    maxCost?: number;
    maxDays?: number;
  };
}

// Mock carriers
export const shippingCarriers: ShippingCarrier[] = [
  {
    id: "carrier-001",
    name: "Correios",
    code: "CORREIOS",
    type: "national",
    enabled: true,
    services: [
      {
        id: "svc-001",
        carrierId: "carrier-001",
        name: "PAC",
        code: "04510",
        type: "economy",
        enabled: true,
        baseRate: 15.0,
        weightRate: 2.5,
        dimensionalFactor: 6000,
        freeShippingThreshold: 200,
        maxWeight: 30,
        features: ["tracking", "insurance"],
      },
      {
        id: "svc-002",
        carrierId: "carrier-001",
        name: "SEDEX",
        code: "04014",
        type: "express",
        enabled: true,
        baseRate: 25.0,
        weightRate: 4.0,
        dimensionalFactor: 6000,
        freeShippingThreshold: 300,
        maxWeight: 30,
        features: ["tracking", "insurance", "signature"],
      },
    ],
    coverage: {
      countries: ["BR"],
    },
    features: {
      tracking: true,
      insurance: true,
      signature: true,
      pickupService: true,
      dropoffPoints: true,
    },
    sla: {
      minDays: 5,
      maxDays: 15,
    },
  },
  {
    id: "carrier-002",
    name: "Jadlog",
    code: "JADLOG",
    type: "express",
    enabled: true,
    services: [
      {
        id: "svc-003",
        carrierId: "carrier-002",
        name: "Jadlog Expresso",
        code: ".PACKAGE",
        type: "express",
        enabled: true,
        baseRate: 22.0,
        weightRate: 3.5,
        dimensionalFactor: 5000,
        maxWeight: 50,
        features: ["tracking", "insurance"],
      },
    ],
    coverage: {
      countries: ["BR"],
    },
    features: {
      tracking: true,
      insurance: true,
      signature: false,
      pickupService: true,
      dropoffPoints: false,
    },
    sla: {
      minDays: 2,
      maxDays: 7,
    },
  },
];

// Mock shipments
export const shipments: Shipment[] = [];

// Calculate shipping quote
export function calculateShippingQuote(
  origin: Address,
  destination: Address,
  packages: Package[],
  orderValue: number
): ShippingQuote[] {
  const quotes: ShippingQuote[] = [];

  for (const carrier of shippingCarriers.filter((c) => c.enabled)) {
    for (const service of carrier.services.filter((s) => s.enabled)) {
      // Calculate weight
      const totalWeight = packages.reduce((sum, pkg) => sum + pkg.weight, 0);

      // Check weight limit
      if (service.maxWeight && totalWeight > service.maxWeight) {
        continue;
      }

      // Calculate dimensional weight
      const dimensionalWeight = packages.reduce((sum, pkg) => {
        const dim = pkg.dimensions;
        const dimWeight =
          (dim.length * dim.width * dim.height) / service.dimensionalFactor;
        return sum + dimWeight;
      }, 0);

      // Use greater of actual or dimensional weight
      const chargeableWeight = Math.max(totalWeight, dimensionalWeight);

      // Calculate cost
      let cost = service.baseRate + chargeableWeight * service.weightRate;

      // Distance factor (mock - in production, use actual distance)
      const distanceFactor = origin.state !== destination.state ? 1.5 : 1.0;
      cost *= distanceFactor;

      // Insurance
      let insuranceCost = 0;
      if (service.insuranceRate) {
        insuranceCost = (orderValue * service.insuranceRate) / 100;
      }

      // Free shipping
      if (
        service.freeShippingThreshold &&
        orderValue >= service.freeShippingThreshold
      ) {
        cost = 0;
      }

      const totalCost = cost + insuranceCost;

      // Estimated delivery
      const minDays = carrier.sla.minDays;
      const maxDays = carrier.sla.maxDays;

      const earliestDelivery = new Date();
      earliestDelivery.setDate(earliestDelivery.getDate() + minDays);

      const latestDelivery = new Date();
      latestDelivery.setDate(latestDelivery.getDate() + maxDays);

      // Calculate score
      let score = 100;
      score -= (totalCost / orderValue) * 50; // Cost factor
      score -= maxDays * 2; // Speed factor
      score += service.features.length * 5; // Features factor

      quotes.push({
        id: `quote-${Date.now()}-${service.id}`,
        carrierId: carrier.id,
        carrierName: carrier.name,
        serviceId: service.id,
        serviceName: service.name,
        serviceType: service.type,
        cost,
        insuranceCost,
        totalCost,
        estimatedDays: {
          min: minDays,
          max: maxDays,
        },
        deliveryDate: {
          earliest: earliestDelivery,
          latest: latestDelivery,
        },
        features: service.features,
        score: Math.max(0, Math.min(100, score)),
        recommended: false,
      });
    }
  }

  // Sort by score
  quotes.sort((a, b) => b.score - a.score);

  // Mark recommended
  if (quotes.length > 0) {
    quotes[0].recommended = true;
  }

  return quotes;
}

// Optimize shipment
export function optimizeShipment(
  orderId: string,
  origin: Address,
  destination: Address,
  packages: Package[],
  orderValue: number,
  preferences?: {
    prioritize?: "cost" | "speed" | "reliability";
    maxCost?: number;
    maxDays?: number;
  }
): ShipmentOptimization {
  const quotes = calculateShippingQuote(origin, destination, packages, orderValue);

  let recommendedQuote = quotes[0];

  // Apply preferences
  if (preferences) {
    if (preferences.prioritize === "cost") {
      recommendedQuote = quotes.reduce((min, q) =>
        q.totalCost < min.totalCost ? q : min
      );
    } else if (preferences.prioritize === "speed") {
      recommendedQuote = quotes.reduce((min, q) =>
        q.estimatedDays.max < min.estimatedDays.max ? q : min
      );
    }

    // Filter by constraints
    const filteredQuotes = quotes.filter((q) => {
      if (preferences.maxCost && q.totalCost > preferences.maxCost) return false;
      if (preferences.maxDays && q.estimatedDays.max > preferences.maxDays)
        return false;
      return true;
    });

    if (filteredQuotes.length > 0) {
      recommendedQuote = filteredQuotes[0];
    }
  }

  // Calculate savings
  const mostExpensive = quotes.reduce((max, q) =>
    q.totalCost > max.totalCost ? q : max
  );

  const savings = {
    amount: mostExpensive.totalCost - recommendedQuote.totalCost,
    percentage:
      ((mostExpensive.totalCost - recommendedQuote.totalCost) /
        mostExpensive.totalCost) *
      100,
  };

  return {
    orderId,
    origin,
    destination,
    packages,
    quotes,
    recommendedQuote,
    savings,
    factors: {
      cost: 0.4,
      speed: 0.4,
      reliability: 0.2,
    },
  };
}

// Create shipment
export function createShipment(data: {
  orderId: string;
  quoteId: string;
  origin: Address;
  destination: Address;
  packages: Package[];
}): Shipment {
  // Find quote (mock - in production, retrieve from database)
  const quote = {
    carrierId: "carrier-001",
    carrierName: "Correios",
    serviceId: "svc-002",
    serviceName: "SEDEX",
    cost: 25.0,
    estimatedDays: { min: 2, max: 5 },
  };

  const trackingNumber = `BR${Math.random().toString().substring(2, 15)}`;

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(
    estimatedDelivery.getDate() + quote.estimatedDays.max
  );

  const shipment: Shipment = {
    id: `ship-${Date.now()}`,
    trackingNumber,
    orderId: data.orderId,
    carrierId: quote.carrierId,
    carrierName: quote.carrierName,
    serviceId: quote.serviceId,
    serviceName: quote.serviceName,
    status: "pending",
    origin: data.origin,
    destination: data.destination,
    packages: data.packages,
    cost: quote.cost,
    trackingUrl: `https://rastreamento.correios.com.br/app/index.php?objeto=${trackingNumber}`,
    events: [
      {
        id: `evt-${Date.now()}`,
        status: "pending",
        description: "Pedido de envio criado",
        timestamp: new Date(),
      },
    ],
    estimatedDelivery,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  shipments.push(shipment);

  return shipment;
}

// Generate shipping label
export function generateShippingLabel(shipmentId: string): string {
  const shipment = shipments.find((s) => s.id === shipmentId);

  if (!shipment) {
    throw new Error("Shipment not found");
  }

  // In production, call carrier API to generate label
  const labelUrl = `/shipping-labels/${shipment.trackingNumber}.pdf`;

  shipment.labelUrl = labelUrl;
  shipment.status = "label_created";
  shipment.updatedAt = new Date();

  shipment.events.push({
    id: `evt-${Date.now()}`,
    status: "label_created",
    description: "Etiqueta de envio gerada",
    timestamp: new Date(),
  });

  return labelUrl;
}

// Track shipment
export async function trackShipment(trackingNumber: string): Promise<Shipment> {
  const shipment = shipments.find((s) => s.trackingNumber === trackingNumber);

  if (!shipment) {
    throw new Error("Shipment not found");
  }

  // In production, call carrier tracking API
  // Mock tracking events
  const mockEvents: ShipmentEvent[] = [
    {
      id: `evt-${Date.now()}-1`,
      status: "picked_up",
      description: "Objeto postado",
      location: shipment.origin.city,
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: `evt-${Date.now()}-2`,
      status: "in_transit",
      description: "Objeto em trânsito - por favor aguarde",
      location: "Centro de Distribuição",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: `evt-${Date.now()}-3`,
      status: "out_for_delivery",
      description: "Objeto saiu para entrega ao destinatário",
      location: shipment.destination.city,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
  ];

  shipment.events = mockEvents;
  shipment.status = "out_for_delivery";
  shipment.updatedAt = new Date();

  return shipment;
}

// Batch shipment creation
export function createBatchShipments(
  orders: {
    orderId: string;
    origin: Address;
    destination: Address;
    packages: Package[];
  }[]
): {
  success: number;
  failed: number;
  shipments: Shipment[];
} {
  const results = {
    success: 0,
    failed: 0,
    shipments: [] as Shipment[],
  };

  for (const order of orders) {
    try {
      const shipment = createShipment({
        orderId: order.orderId,
        quoteId: "mock-quote",
        origin: order.origin,
        destination: order.destination,
        packages: order.packages,
      });

      results.shipments.push(shipment);
      results.success++;
    } catch (error) {
      results.failed++;
    }
  }

  return results;
}

// Shipping analytics
export interface ShippingAnalytics {
  totalShipments: number;
  onTimeDeliveryRate: number;
  averageDeliveryTime: number; // days
  totalShippingCost: number;
  averageShippingCost: number;
  byCarrier: {
    carrier: string;
    shipments: number;
    cost: number;
    onTimeRate: number;
  }[];
  byStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];
  topRoutes: {
    origin: string;
    destination: string;
    shipments: number;
    averageCost: number;
  }[];
}

export function getShippingAnalytics(): ShippingAnalytics {
  const totalShipments = shipments.length;
  const deliveredShipments = shipments.filter((s) => s.status === "delivered");

  const onTimeShipments = deliveredShipments.filter(
    (s) => s.actualDelivery && s.actualDelivery <= s.estimatedDelivery
  );

  const totalCost = shipments.reduce((sum, s) => sum + s.cost, 0);

  // By carrier
  const carrierStats = new Map<string, any>();
  for (const shipment of shipments) {
    const key = shipment.carrierName;
    if (!carrierStats.has(key)) {
      carrierStats.set(key, {
        carrier: key,
        shipments: 0,
        cost: 0,
        delivered: 0,
        onTime: 0,
      });
    }

    const stats = carrierStats.get(key);
    stats.shipments++;
    stats.cost += shipment.cost;

    if (shipment.status === "delivered") {
      stats.delivered++;
      if (shipment.actualDelivery && shipment.actualDelivery <= shipment.estimatedDelivery) {
        stats.onTime++;
      }
    }
  }

  const byCarrier = Array.from(carrierStats.values()).map((stats) => ({
    carrier: stats.carrier,
    shipments: stats.shipments,
    cost: stats.cost,
    onTimeRate: (stats.onTime / Math.max(1, stats.delivered)) * 100,
  }));

  // By status
  const statusCounts = new Map<string, number>();
  for (const shipment of shipments) {
    statusCounts.set(
      shipment.status,
      (statusCounts.get(shipment.status) || 0) + 1
    );
  }

  const byStatus = Array.from(statusCounts.entries()).map(([status, count]) => ({
    status,
    count,
    percentage: (count / totalShipments) * 100,
  }));

  return {
    totalShipments,
    onTimeDeliveryRate:
      (onTimeShipments.length / Math.max(1, deliveredShipments.length)) * 100,
    averageDeliveryTime: 5, // Mock
    totalShippingCost: totalCost,
    averageShippingCost: totalCost / Math.max(1, totalShipments),
    byCarrier,
    byStatus,
    topRoutes: [], // Mock
  };
}

// Routing rules
export const routingRules: RoutingRule[] = [
  {
    id: "rule-001",
    name: "Express for high-value orders",
    priority: 1,
    enabled: true,
    conditions: {
      orderValue: { min: 500 },
    },
    action: {
      preferredService: "express",
      maxDays: 3,
    },
  },
  {
    id: "rule-002",
    name: "Economy for low-value orders",
    priority: 2,
    enabled: true,
    conditions: {
      orderValue: { max: 100 },
    },
    action: {
      preferredService: "economy",
      maxCost: 20,
    },
  },
];

// Apply routing rules
export function applyRoutingRules(
  orderValue: number,
  destination: Address,
  customerTier?: string
): {
  preferredCarrier?: string;
  preferredService?: string;
  maxCost?: number;
  maxDays?: number;
} {
  for (const rule of routingRules.filter((r) => r.enabled).sort((a, b) => a.priority - b.priority)) {
    let matches = true;

    if (rule.conditions.orderValue) {
      const { min, max } = rule.conditions.orderValue;
      if (min && orderValue < min) matches = false;
      if (max && orderValue > max) matches = false;
    }

    if (rule.conditions.destinationState) {
      if (!rule.conditions.destinationState.includes(destination.state)) {
        matches = false;
      }
    }

    if (rule.conditions.customerTier && customerTier) {
      if (!rule.conditions.customerTier.includes(customerTier)) {
        matches = false;
      }
    }

    if (matches) {
      return rule.action;
    }
  }

  return {};
}

// Package optimization
export function optimizePackaging(
  items: { dimensions: { length: number; width: number; height: number }; weight: number }[]
): Package[] {
  // Simple bin packing algorithm (mock)
  // In production, use advanced 3D bin packing
  const packages: Package[] = [];

  let currentPackage: Package = {
    id: `pkg-${Date.now()}`,
    weight: 0,
    dimensions: { length: 40, width: 30, height: 20 },
    value: 0,
    items: [],
  };

  for (const item of items) {
    currentPackage.weight += item.weight;

    if (currentPackage.weight > 30) {
      // Max weight per package
      packages.push(currentPackage);
      currentPackage = {
        id: `pkg-${Date.now()}-${packages.length}`,
        weight: item.weight,
        dimensions: { length: 40, width: 30, height: 20 },
        value: 0,
        items: [],
      };
    }
  }

  if (currentPackage.weight > 0) {
    packages.push(currentPackage);
  }

  return packages;
}
