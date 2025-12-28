// Advanced Warehouse and Inventory Management System

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  type: "main" | "regional" | "dropship" | "third_party";
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  capacity: {
    total: number; // cubic meters
    used: number;
    available: number;
  };
  status: "active" | "inactive" | "maintenance";
  operatingHours: {
    monday: { open: string; close: string };
    tuesday: { open: string; close: string };
    wednesday: { open: string; close: string };
    thursday: { open: string; close: string };
    friday: { open: string; close: string };
    saturday?: { open: string; close: string };
    sunday?: { open: string; close: string };
  };
  shippingZones: string[]; // States/regions this warehouse serves
  priority: number; // For order routing
  createdAt: Date;
}

export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  reserved: number; // Reserved for pending orders
  available: number; // quantity - reserved
  reorderPoint: number;
  reorderQuantity: number;
  location: {
    zone: string; // e.g., "A"
    aisle: string; // e.g., "12"
    shelf: string; // e.g., "3"
    bin: string; // e.g., "B"
    fullLocation: string; // e.g., "A-12-3-B"
  };
  lastRestocked: Date;
  lastCounted: Date;
  costPerUnit: number;
  totalValue: number;
}

export interface StockMovement {
  id: string;
  type:
    | "purchase"
    | "sale"
    | "transfer"
    | "adjustment"
    | "return"
    | "damage"
    | "theft"
    | "count";
  productId: string;
  productName: string;
  sku: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
  reference?: string; // Order ID, Transfer ID, etc.
  performedBy: string;
  performedByName: string;
  notes?: string;
  createdAt: Date;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromWarehouseId: string;
  fromWarehouseName: string;
  toWarehouseId: string;
  toWarehouseName: string;
  status: "pending" | "in_transit" | "completed" | "cancelled";
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    received?: number;
  }[];
  requestedBy: string;
  requestedByName: string;
  approvedBy?: string;
  approvedByName?: string;
  shippedBy?: string;
  shippedByName?: string;
  receivedBy?: string;
  receivedByName?: string;
  requestedAt: Date;
  approvedAt?: Date;
  shippedAt?: Date;
  receivedAt?: Date;
  estimatedArrival?: Date;
  trackingNumber?: string;
  notes?: string;
}

export interface StockCount {
  id: string;
  countNumber: string;
  warehouseId: string;
  warehouseName: string;
  type: "full" | "cycle" | "spot";
  status: "planned" | "in_progress" | "completed" | "cancelled";
  scheduledDate: Date;
  startedAt?: Date;
  completedAt?: Date;
  items: {
    productId: string;
    productName: string;
    sku: string;
    systemQuantity: number;
    countedQuantity?: number;
    variance?: number;
    notes?: string;
    countedBy?: string;
  }[];
  totalItems: number;
  itemsCounted: number;
  discrepancies: number;
  performedBy?: string;
  performedByName?: string;
  notes?: string;
}

export interface LowStockAlert {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  warehouseId: string;
  warehouseName: string;
  currentQuantity: number;
  reorderPoint: number;
  reorderQuantity: number;
  severity: "warning" | "critical" | "out_of_stock";
  estimatedStockoutDate?: Date;
  averageDailySales: number;
  daysOfStockRemaining: number;
  createdAt: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

// Mock warehouses
export const warehouses: Warehouse[] = [
  {
    id: "wh-001",
    name: "Centro de Distribuição Principal",
    code: "CD-SP-01",
    type: "main",
    address: {
      street: "Av. Industrial, 1000",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-000",
      country: "BR",
      coordinates: {
        lat: -23.5505,
        lng: -46.6333,
      },
    },
    contact: {
      name: "Carlos Mendes",
      email: "carlos@mundopetzen.com",
      phone: "(11) 98765-4321",
    },
    capacity: {
      total: 5000,
      used: 3200,
      available: 1800,
    },
    status: "active",
    operatingHours: {
      monday: { open: "08:00", close: "18:00" },
      tuesday: { open: "08:00", close: "18:00" },
      wednesday: { open: "08:00", close: "18:00" },
      thursday: { open: "08:00", close: "18:00" },
      friday: { open: "08:00", close: "18:00" },
      saturday: { open: "08:00", close: "12:00" },
    },
    shippingZones: ["SP", "RJ", "MG", "ES"],
    priority: 1,
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "wh-002",
    name: "Centro Regional Sul",
    code: "CD-RS-01",
    type: "regional",
    address: {
      street: "Rua dos Transportes, 500",
      city: "Porto Alegre",
      state: "RS",
      zipCode: "90000-000",
      country: "BR",
    },
    contact: {
      name: "Ana Paula",
      email: "ana@mundopetzen.com",
      phone: "(51) 98765-4321",
    },
    capacity: {
      total: 2000,
      used: 1200,
      available: 800,
    },
    status: "active",
    operatingHours: {
      monday: { open: "08:00", close: "18:00" },
      tuesday: { open: "08:00", close: "18:00" },
      wednesday: { open: "08:00", close: "18:00" },
      thursday: { open: "08:00", close: "18:00" },
      friday: { open: "08:00", close: "18:00" },
    },
    shippingZones: ["RS", "SC", "PR"],
    priority: 2,
    createdAt: new Date("2024-03-01"),
  },
];

// Mock inventory
export const inventory: InventoryItem[] = [
  {
    id: "inv-001",
    productId: "difusor-aromatico",
    productName: "Difusor Aromático Ultrassônico Zen",
    sku: "DAU-001",
    warehouseId: "wh-001",
    warehouseName: "Centro de Distribuição Principal",
    quantity: 150,
    reserved: 23,
    available: 127,
    reorderPoint: 50,
    reorderQuantity: 100,
    location: {
      zone: "A",
      aisle: "12",
      shelf: "3",
      bin: "B",
      fullLocation: "A-12-3-B",
    },
    lastRestocked: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastCounted: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    costPerUnit: 65.0,
    totalValue: 9750.0,
  },
];

// Get inventory by warehouse
export function getWarehouseInventory(warehouseId: string): InventoryItem[] {
  return inventory.filter((item) => item.warehouseId === warehouseId);
}

// Get inventory by product
export function getProductInventory(productId: string): InventoryItem[] {
  return inventory.filter((item) => item.productId === productId);
}

// Get total available quantity across all warehouses
export function getTotalAvailableQuantity(productId: string): number {
  return inventory
    .filter((item) => item.productId === productId)
    .reduce((sum, item) => sum + item.available, 0);
}

// Find best warehouse for order
export function findBestWarehouse(
  productId: string,
  quantity: number,
  shippingState: string
): Warehouse | null {
  // Get warehouses that have the product in stock
  const availableWarehouses = warehouses.filter((wh) => {
    const inv = inventory.find(
      (item) => item.warehouseId === wh.id && item.productId === productId
    );
    return (
      inv &&
      inv.available >= quantity &&
      wh.status === "active" &&
      wh.shippingZones.includes(shippingState)
    );
  });

  if (availableWarehouses.length === 0) return null;

  // Sort by priority (lower is better)
  return availableWarehouses.sort((a, b) => a.priority - b.priority)[0];
}

// Reserve inventory
export function reserveInventory(
  productId: string,
  warehouseId: string,
  quantity: number,
  orderId: string
): boolean {
  const item = inventory.find(
    (inv) => inv.productId === productId && inv.warehouseId === warehouseId
  );

  if (!item || item.available < quantity) return false;

  item.reserved += quantity;
  item.available -= quantity;

  // Log movement
  logStockMovement({
    type: "sale",
    productId: item.productId,
    productName: item.productName,
    sku: item.sku,
    warehouseId: item.warehouseId,
    warehouseName: item.warehouseName,
    quantity: -quantity,
    previousQuantity: item.quantity + quantity,
    newQuantity: item.quantity,
    reference: orderId,
    performedBy: "system",
    performedByName: "System",
  });

  return true;
}

// Release reserved inventory
export function releaseInventory(
  productId: string,
  warehouseId: string,
  quantity: number
): boolean {
  const item = inventory.find(
    (inv) => inv.productId === productId && inv.warehouseId === warehouseId
  );

  if (!item || item.reserved < quantity) return false;

  item.reserved -= quantity;
  item.available += quantity;

  return true;
}

// Confirm inventory deduction (when order ships)
export function confirmInventoryDeduction(
  productId: string,
  warehouseId: string,
  quantity: number
): boolean {
  const item = inventory.find(
    (inv) => inv.productId === productId && inv.warehouseId === warehouseId
  );

  if (!item || item.reserved < quantity) return false;

  item.reserved -= quantity;
  item.quantity -= quantity;
  item.totalValue = item.quantity * item.costPerUnit;

  return true;
}

// Adjust inventory
export function adjustInventory(
  productId: string,
  warehouseId: string,
  quantity: number,
  reason: string,
  performedBy: string,
  performedByName: string
): boolean {
  const item = inventory.find(
    (inv) => inv.productId === productId && inv.warehouseId === warehouseId
  );

  if (!item) return false;

  const previousQuantity = item.quantity;
  item.quantity += quantity;
  item.available = item.quantity - item.reserved;
  item.totalValue = item.quantity * item.costPerUnit;

  logStockMovement({
    type: "adjustment",
    productId: item.productId,
    productName: item.productName,
    sku: item.sku,
    warehouseId: item.warehouseId,
    warehouseName: item.warehouseName,
    quantity,
    previousQuantity,
    newQuantity: item.quantity,
    reason,
    performedBy,
    performedByName,
  });

  return true;
}

// Stock movements
const stockMovements: StockMovement[] = [];

function logStockMovement(data: Omit<StockMovement, "id" | "createdAt">): void {
  const movement: StockMovement = {
    id: `mov-${Date.now()}`,
    ...data,
    createdAt: new Date(),
  };

  stockMovements.push(movement);
}

export function getStockMovements(
  filters?: {
    productId?: string;
    warehouseId?: string;
    type?: StockMovement["type"];
    startDate?: Date;
    endDate?: Date;
  }
): StockMovement[] {
  let movements = [...stockMovements];

  if (filters?.productId) {
    movements = movements.filter((m) => m.productId === filters.productId);
  }

  if (filters?.warehouseId) {
    movements = movements.filter((m) => m.warehouseId === filters.warehouseId);
  }

  if (filters?.type) {
    movements = movements.filter((m) => m.type === filters.type);
  }

  if (filters?.startDate) {
    movements = movements.filter(
      (m) => m.createdAt >= filters.startDate!
    );
  }

  if (filters?.endDate) {
    movements = movements.filter(
      (m) => m.createdAt <= filters.endDate!
    );
  }

  return movements.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

// Stock transfers
const stockTransfers: StockTransfer[] = [];

export function createStockTransfer(data: {
  fromWarehouseId: string;
  toWarehouseId: string;
  items: StockTransfer["items"];
  requestedBy: string;
  requestedByName: string;
  notes?: string;
}): StockTransfer {
  const fromWarehouse = warehouses.find((w) => w.id === data.fromWarehouseId);
  const toWarehouse = warehouses.find((w) => w.id === data.toWarehouseId);

  if (!fromWarehouse || !toWarehouse) {
    throw new Error("Warehouse not found");
  }

  const transfer: StockTransfer = {
    id: `xfer-${Date.now()}`,
    transferNumber: `TRF-${new Date().getFullYear()}-${String(
      stockTransfers.length + 1
    ).padStart(4, "0")}`,
    fromWarehouseId: data.fromWarehouseId,
    fromWarehouseName: fromWarehouse.name,
    toWarehouseId: data.toWarehouseId,
    toWarehouseName: toWarehouse.name,
    status: "pending",
    items: data.items,
    requestedBy: data.requestedBy,
    requestedByName: data.requestedByName,
    requestedAt: new Date(),
    notes: data.notes,
  };

  stockTransfers.push(transfer);

  return transfer;
}

export function approveStockTransfer(
  transferId: string,
  approvedBy: string,
  approvedByName: string
): boolean {
  const transfer = stockTransfers.find((t) => t.id === transferId);
  if (!transfer || transfer.status !== "pending") return false;

  // Check if source warehouse has enough stock
  for (const item of transfer.items) {
    const inv = inventory.find(
      (i) =>
        i.productId === item.productId &&
        i.warehouseId === transfer.fromWarehouseId
    );

    if (!inv || inv.available < item.quantity) {
      return false;
    }
  }

  transfer.status = "in_transit";
  transfer.approvedBy = approvedBy;
  transfer.approvedByName = approvedByName;
  transfer.approvedAt = new Date();

  // Reserve inventory at source
  for (const item of transfer.items) {
    reserveInventory(
      item.productId,
      transfer.fromWarehouseId,
      item.quantity,
      transfer.id
    );
  }

  return true;
}

export function completeStockTransfer(
  transferId: string,
  receivedBy: string,
  receivedByName: string,
  receivedQuantities: { productId: string; quantity: number }[]
): boolean {
  const transfer = stockTransfers.find((t) => t.id === transferId);
  if (!transfer || transfer.status !== "in_transit") return false;

  transfer.status = "completed";
  transfer.receivedBy = receivedBy;
  transfer.receivedByName = receivedByName;
  transfer.receivedAt = new Date();

  // Update inventory
  for (const received of receivedQuantities) {
    const item = transfer.items.find((i) => i.productId === received.productId);
    if (!item) continue;

    item.received = received.quantity;

    // Deduct from source
    confirmInventoryDeduction(
      received.productId,
      transfer.fromWarehouseId,
      item.quantity
    );

    // Add to destination
    adjustInventory(
      received.productId,
      transfer.toWarehouseId,
      received.quantity,
      `Transfer from ${transfer.fromWarehouseName}`,
      receivedBy,
      receivedByName
    );
  }

  return true;
}

// Stock counts
const stockCounts: StockCount[] = [];

export function createStockCount(data: {
  warehouseId: string;
  type: StockCount["type"];
  scheduledDate: Date;
  productIds?: string[];
  notes?: string;
}): StockCount {
  const warehouse = warehouses.find((w) => w.id === data.warehouseId);
  if (!warehouse) throw new Error("Warehouse not found");

  let items: StockCount["items"];

  if (data.type === "full") {
    // Count all items in warehouse
    items = inventory
      .filter((inv) => inv.warehouseId === data.warehouseId)
      .map((inv) => ({
        productId: inv.productId,
        productName: inv.productName,
        sku: inv.sku,
        systemQuantity: inv.quantity,
      }));
  } else if (data.productIds) {
    // Count specific products
    items = inventory
      .filter(
        (inv) =>
          inv.warehouseId === data.warehouseId &&
          data.productIds!.includes(inv.productId)
      )
      .map((inv) => ({
        productId: inv.productId,
        productName: inv.productName,
        sku: inv.sku,
        systemQuantity: inv.quantity,
      }));
  } else {
    items = [];
  }

  const count: StockCount = {
    id: `count-${Date.now()}`,
    countNumber: `CNT-${new Date().getFullYear()}-${String(
      stockCounts.length + 1
    ).padStart(4, "0")}`,
    warehouseId: data.warehouseId,
    warehouseName: warehouse.name,
    type: data.type,
    status: "planned",
    scheduledDate: data.scheduledDate,
    items,
    totalItems: items.length,
    itemsCounted: 0,
    discrepancies: 0,
    notes: data.notes,
  };

  stockCounts.push(count);

  return count;
}

export function updateStockCount(
  countId: string,
  productId: string,
  countedQuantity: number,
  countedBy: string,
  notes?: string
): boolean {
  const count = stockCounts.find((c) => c.id === countId);
  if (!count || count.status === "completed") return false;

  const item = count.items.find((i) => i.productId === productId);
  if (!item) return false;

  item.countedQuantity = countedQuantity;
  item.variance = countedQuantity - item.systemQuantity;
  item.countedBy = countedBy;
  item.notes = notes;

  count.itemsCounted = count.items.filter((i) => i.countedQuantity !== undefined).length;
  count.discrepancies = count.items.filter((i) => i.variance && i.variance !== 0).length;

  if (count.status === "planned") {
    count.status = "in_progress";
    count.startedAt = new Date();
  }

  return true;
}

export function completeStockCount(
  countId: string,
  performedBy: string,
  performedByName: string
): boolean {
  const count = stockCounts.find((c) => c.id === countId);
  if (!count || count.status !== "in_progress") return false;

  count.status = "completed";
  count.completedAt = new Date();
  count.performedBy = performedBy;
  count.performedByName = performedByName;

  // Apply adjustments for discrepancies
  for (const item of count.items) {
    if (item.variance && item.variance !== 0) {
      adjustInventory(
        item.productId,
        count.warehouseId,
        item.variance,
        `Stock count adjustment: ${count.countNumber}`,
        performedBy,
        performedByName
      );
    }
  }

  return true;
}

// Low stock alerts
export function getLowStockAlerts(): LowStockAlert[] {
  const alerts: LowStockAlert[] = [];

  for (const item of inventory) {
    if (item.available <= 0) {
      alerts.push({
        id: `alert-${Date.now()}-${item.id}`,
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        warehouseId: item.warehouseId,
        warehouseName: item.warehouseName,
        currentQuantity: item.available,
        reorderPoint: item.reorderPoint,
        reorderQuantity: item.reorderQuantity,
        severity: "out_of_stock",
        averageDailySales: 5, // Mock
        daysOfStockRemaining: 0,
        createdAt: new Date(),
        acknowledged: false,
      });
    } else if (item.available <= item.reorderPoint * 0.5) {
      alerts.push({
        id: `alert-${Date.now()}-${item.id}`,
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        warehouseId: item.warehouseId,
        warehouseName: item.warehouseName,
        currentQuantity: item.available,
        reorderPoint: item.reorderPoint,
        reorderQuantity: item.reorderQuantity,
        severity: "critical",
        averageDailySales: 5, // Mock
        daysOfStockRemaining: Math.floor(item.available / 5),
        createdAt: new Date(),
        acknowledged: false,
      });
    } else if (item.available <= item.reorderPoint) {
      alerts.push({
        id: `alert-${Date.now()}-${item.id}`,
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        warehouseId: item.warehouseId,
        warehouseName: item.warehouseName,
        currentQuantity: item.available,
        reorderPoint: item.reorderPoint,
        reorderQuantity: item.reorderQuantity,
        severity: "warning",
        averageDailySales: 5, // Mock
        daysOfStockRemaining: Math.floor(item.available / 5),
        createdAt: new Date(),
        acknowledged: false,
      });
    }
  }

  return alerts;
}

// Inventory analytics
export interface InventoryAnalytics {
  totalValue: number;
  totalItems: number;
  totalQuantity: number;
  lowStockItems: number;
  outOfStockItems: number;
  byWarehouse: {
    warehouseId: string;
    warehouseName: string;
    items: number;
    quantity: number;
    value: number;
    capacityUsed: number;
  }[];
  topProducts: {
    productId: string;
    productName: string;
    quantity: number;
    value: number;
  }[];
  turnoverRate: number;
  daysOfInventory: number;
}

export function getInventoryAnalytics(): InventoryAnalytics {
  const totalValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const totalItems = inventory.length;
  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventory.filter(
    (item) => item.available <= item.reorderPoint
  ).length;
  const outOfStockItems = inventory.filter((item) => item.available <= 0).length;

  const byWarehouse = warehouses.map((wh) => {
    const whInventory = inventory.filter((item) => item.warehouseId === wh.id);
    return {
      warehouseId: wh.id,
      warehouseName: wh.name,
      items: whInventory.length,
      quantity: whInventory.reduce((sum, item) => sum + item.quantity, 0),
      value: whInventory.reduce((sum, item) => sum + item.totalValue, 0),
      capacityUsed: (wh.capacity.used / wh.capacity.total) * 100,
    };
  });

  const topProducts = inventory
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 10)
    .map((item) => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      value: item.totalValue,
    }));

  return {
    totalValue,
    totalItems,
    totalQuantity,
    lowStockItems,
    outOfStockItems,
    byWarehouse,
    topProducts,
    turnoverRate: 4.2, // Mock - calculate from sales data
    daysOfInventory: 87, // Mock - calculate from sales data
  };
}
