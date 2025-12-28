// Inventory Management System

export interface InventoryItem {
  productId: string;
  sku: string;
  quantity: number;
  reserved: number; // Items in active carts
  available: number; // quantity - reserved
  reorderPoint: number;
  reorderQuantity: number;
  supplier?: string;
  location?: string;
  lastRestocked?: Date;
  costPrice: number;
  sellPrice: number;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: "in" | "out" | "adjustment" | "return";
  quantity: number;
  reason: string;
  orderId?: string;
  userId?: string;
  timestamp: Date;
  notes?: string;
}

export interface LowStockAlert {
  productId: string;
  productName: string;
  currentStock: number;
  reorderPoint: number;
  status: "low" | "critical" | "out";
  daysUntilStockout: number;
}

// Mock inventory data
export const inventory: InventoryItem[] = [
  {
    productId: "difusor-aromatico",
    sku: "DA-001",
    quantity: 45,
    reserved: 5,
    available: 40,
    reorderPoint: 20,
    reorderQuantity: 50,
    supplier: "AromaZen Ltda",
    location: "Estoque A - Prateleira 3",
    lastRestocked: new Date("2024-12-01"),
    costPrice: 65.0,
    sellPrice: 129.9,
  },
  {
    productId: "coleira-led",
    sku: "CL-002",
    quantity: 15,
    reserved: 3,
    available: 12,
    reorderPoint: 25,
    reorderQuantity: 40,
    supplier: "PetTech Brasil",
    location: "Estoque B - Prateleira 1",
    lastRestocked: new Date("2024-11-20"),
    costPrice: 22.5,
    sellPrice: 49.9,
  },
  {
    productId: "shampoo-natural",
    sku: "SH-003",
    quantity: 8,
    reserved: 2,
    available: 6,
    reorderPoint: 15,
    reorderQuantity: 30,
    supplier: "NaturaPet",
    location: "Estoque A - Prateleira 5",
    lastRestocked: new Date("2024-11-15"),
    costPrice: 14.0,
    sellPrice: 34.9,
  },
];

export function getInventoryByProductId(productId: string): InventoryItem | undefined {
  return inventory.find((item) => item.productId === productId);
}

export function checkStockAvailability(productId: string, quantity: number): {
  available: boolean;
  currentStock: number;
  message: string;
} {
  const item = getInventoryByProductId(productId);

  if (!item) {
    return {
      available: false,
      currentStock: 0,
      message: "Produto não encontrado no estoque",
    };
  }

  if (item.available >= quantity) {
    return {
      available: true,
      currentStock: item.available,
      message: "Produto disponível",
    };
  }

  if (item.available > 0) {
    return {
      available: false,
      currentStock: item.available,
      message: `Apenas ${item.available} unidades disponíveis`,
    };
  }

  return {
    available: false,
    currentStock: 0,
    message: "Produto fora de estoque",
  };
}

export function reserveStock(productId: string, quantity: number): boolean {
  const item = getInventoryByProductId(productId);
  if (!item || item.available < quantity) {
    return false;
  }

  item.reserved += quantity;
  item.available = item.quantity - item.reserved;
  return true;
}

export function releaseStock(productId: string, quantity: number): void {
  const item = getInventoryByProductId(productId);
  if (!item) return;

  item.reserved = Math.max(0, item.reserved - quantity);
  item.available = item.quantity - item.reserved;
}

export function fulfillOrder(productId: string, quantity: number): boolean {
  const item = getInventoryByProductId(productId);
  if (!item || item.reserved < quantity) {
    return false;
  }

  item.quantity -= quantity;
  item.reserved -= quantity;
  item.available = item.quantity - item.reserved;

  // Log stock movement
  logStockMovement({
    id: `mov-${Date.now()}`,
    productId,
    type: "out",
    quantity,
    reason: "Order fulfilled",
    timestamp: new Date(),
  });

  return true;
}

export function restockProduct(
  productId: string,
  quantity: number,
  notes?: string
): boolean {
  const item = getInventoryByProductId(productId);
  if (!item) return false;

  item.quantity += quantity;
  item.available = item.quantity - item.reserved;
  item.lastRestocked = new Date();

  // Log stock movement
  logStockMovement({
    id: `mov-${Date.now()}`,
    productId,
    type: "in",
    quantity,
    reason: "Restock",
    timestamp: new Date(),
    notes,
  });

  return true;
}

export function adjustStock(
  productId: string,
  newQuantity: number,
  reason: string
): boolean {
  const item = getInventoryByProductId(productId);
  if (!item) return false;

  const difference = newQuantity - item.quantity;
  item.quantity = newQuantity;
  item.available = item.quantity - item.reserved;

  // Log stock movement
  logStockMovement({
    id: `mov-${Date.now()}`,
    productId,
    type: "adjustment",
    quantity: Math.abs(difference),
    reason,
    timestamp: new Date(),
  });

  return true;
}

export function getLowStockAlerts(): LowStockAlert[] {
  const alerts: LowStockAlert[] = [];

  inventory.forEach((item) => {
    if (item.available <= item.reorderPoint) {
      let status: "low" | "critical" | "out" = "low";
      if (item.available === 0) {
        status = "out";
      } else if (item.available < item.reorderPoint / 2) {
        status = "critical";
      }

      // Estimate days until stockout (assuming 2 sales per day)
      const avgDailySales = 2;
      const daysUntilStockout = Math.floor(item.available / avgDailySales);

      alerts.push({
        productId: item.productId,
        productName: item.productId.replace(/-/g, " "),
        currentStock: item.available,
        reorderPoint: item.reorderPoint,
        status,
        daysUntilStockout,
      });
    }
  });

  return alerts.sort((a, b) => {
    const statusOrder = { out: 0, critical: 1, low: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });
}

export function getStockValue(): {
  totalCost: number;
  totalRetail: number;
  potentialProfit: number;
} {
  let totalCost = 0;
  let totalRetail = 0;

  inventory.forEach((item) => {
    totalCost += item.quantity * item.costPrice;
    totalRetail += item.quantity * item.sellPrice;
  });

  return {
    totalCost,
    totalRetail,
    potentialProfit: totalRetail - totalCost,
  };
}

export function getProductsNeedingReorder(): InventoryItem[] {
  return inventory.filter((item) => item.available <= item.reorderPoint);
}

export function calculateTurnoverRate(productId: string, days: number = 30): number {
  // In production, this would calculate based on actual sales data
  // Mock calculation: assume 2 sales per day
  const avgDailySales = 2;
  const totalSold = avgDailySales * days;
  const item = getInventoryByProductId(productId);

  if (!item) return 0;

  const avgInventory = item.quantity;
  return (totalSold / avgInventory) * (365 / days);
}

const stockMovements: StockMovement[] = [];

function logStockMovement(movement: StockMovement): void {
  stockMovements.push(movement);
  // In production, save to database
}

export function getStockMovements(
  productId?: string,
  limit: number = 50
): StockMovement[] {
  let movements = stockMovements;

  if (productId) {
    movements = movements.filter((m) => m.productId === productId);
  }

  return movements
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}

export function generateStockReport(): {
  totalProducts: number;
  totalQuantity: number;
  lowStockItems: number;
  outOfStockItems: number;
  stockValue: ReturnType<typeof getStockValue>;
  topProducts: { productId: string; quantity: number }[];
} {
  const lowStockAlerts = getLowStockAlerts();

  return {
    totalProducts: inventory.length,
    totalQuantity: inventory.reduce((sum, item) => sum + item.quantity, 0),
    lowStockItems: lowStockAlerts.filter((a) => a.status === "low").length,
    outOfStockItems: lowStockAlerts.filter((a) => a.status === "out").length,
    stockValue: getStockValue(),
    topProducts: inventory
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
  };
}
