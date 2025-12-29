// Advanced Supply Chain Management System

export interface Supplier {
  id: string;
  name: string;
  code: string;
  type: "manufacturer" | "distributor" | "wholesaler";
  country: string;
  rating: number;
  status: "active" | "inactive" | "blocked";
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentTerms: {
    method: string;
    daysNet: number;
    discount?: {
      percentage: number;
      days: number;
    };
  };
  leadTime: number; // days
  moq: number; // Minimum Order Quantity
  certifications: string[];
  performance: SupplierPerformance;
  contracts: SupplierContract[];
  createdAt: Date;
}

export interface SupplierPerformance {
  onTimeDeliveryRate: number; // percentage
  qualityScore: number; // 0-100
  responseTime: number; // hours
  defectRate: number; // percentage
  totalOrders: number;
  totalValue: number;
  lastOrderDate?: Date;
}

export interface SupplierContract {
  id: string;
  startDate: Date;
  endDate: Date;
  terms: string;
  pricing: {
    productId: string;
    price: number;
    currency: string;
  }[];
  volumeCommitment?: number;
  status: "active" | "expired" | "terminated";
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  status:
    | "draft"
    | "sent"
    | "confirmed"
    | "partially_received"
    | "received"
    | "canceled";
  paymentStatus: "pending" | "paid" | "overdue";
  paymentDueDate?: Date;
  expectedDelivery?: Date;
  actualDelivery?: Date;
  warehouse: string;
  notes?: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  total: number;
  receivedQuantity: number;
  qualityCheck: "pending" | "passed" | "failed";
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  type: "main" | "regional" | "fulfillment" | "returns";
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  capacity: {
    total: number; // cubic meters
    used: number;
    available: number;
  };
  zones: WarehouseZone[];
  staff: number;
  operatingHours: {
    open: string;
    close: string;
  };
  status: "active" | "inactive" | "maintenance";
  metrics: WarehouseMetrics;
}

export interface WarehouseZone {
  id: string;
  name: string;
  type: "receiving" | "storage" | "picking" | "packing" | "shipping";
  capacity: number;
  currentLoad: number;
}

export interface WarehouseMetrics {
  inventoryTurnover: number;
  orderAccuracy: number; // percentage
  pickingSpeed: number; // items per hour
  packingSpeed: number; // orders per hour
  utilizationRate: number; // percentage
  avgProcessingTime: number; // hours
}

export interface InventoryMovement {
  id: string;
  type: "receipt" | "shipment" | "transfer" | "adjustment" | "return";
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  reason?: string;
  referenceId?: string; // PO, Order, Transfer ID
  performedBy: string;
  timestamp: Date;
}

export interface StockTransfer {
  id: string;
  transferNumber: string;
  fromWarehouse: string;
  toWarehouse: string;
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
  }[];
  status: "pending" | "in_transit" | "received" | "canceled";
  requestedBy: string;
  approvedBy?: string;
  shippedAt?: Date;
  receivedAt?: Date;
  trackingCode?: string;
  createdAt: Date;
}

// Supply Chain Manager
export class SupplyChainManager {
  private suppliers: Map<string, Supplier> = new Map();
  private purchaseOrders: Map<string, PurchaseOrder> = new Map();
  private warehouses: Map<string, Warehouse> = new Map();
  private movements: InventoryMovement[] = [];
  private transfers: Map<string, StockTransfer> = new Map();
  
  // Supplier Management
  addSupplier(data: Omit<Supplier, "id" | "createdAt" | "performance">): Supplier {
    const supplier: Supplier = {
      id: `supplier-${Date.now()}`,
      ...data,
      performance: {
        onTimeDeliveryRate: 100,
        qualityScore: 100,
        responseTime: 24,
        defectRate: 0,
        totalOrders: 0,
        totalValue: 0,
      },
      createdAt: new Date(),
    };
    
    this.suppliers.set(supplier.id, supplier);
    return supplier;
  }
  
  rateSupplier(supplierId: string, rating: number): Supplier | undefined {
    const supplier = this.suppliers.get(supplierId);
    if (!supplier) return undefined;
    
    supplier.rating = rating;
    this.suppliers.set(supplierId, supplier);
    return supplier;
  }
  
  // Purchase Order Management
  createPurchaseOrder(
    supplierId: string,
    items: Omit<PurchaseOrderItem, "receivedQuantity" | "qualityCheck">[],
    warehouse: string,
    expectedDelivery: Date
  ): PurchaseOrder {
    const supplier = this.suppliers.get(supplierId);
    if (!supplier) throw new Error("Supplier not found");
    
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const shipping = this.calculateShipping(supplier, subtotal);
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    
    const po: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO${Date.now().toString().slice(-8)}`,
      supplierId,
      supplierName: supplier.name,
      items: items.map((item) => ({
        ...item,
        receivedQuantity: 0,
        qualityCheck: "pending",
      })),
      subtotal,
      shipping,
      tax,
      total,
      currency: "BRL",
      status: "draft",
      paymentStatus: "pending",
      expectedDelivery,
      warehouse,
      createdBy: "system",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.purchaseOrders.set(po.id, po);
    return po;
  }
  
  approvePurchaseOrder(poId: string, approver: string): PurchaseOrder | undefined {
    const po = this.purchaseOrders.get(poId);
    if (!po) return undefined;
    
    po.status = "sent";
    po.approvedBy = approver;
    po.updatedAt = new Date();
    
    // Set payment due date
    const supplier = this.suppliers.get(po.supplierId);
    if (supplier) {
      po.paymentDueDate = new Date(
        Date.now() + supplier.paymentTerms.daysNet * 24 * 60 * 60 * 1000
      );
    }
    
    this.purchaseOrders.set(poId, po);
    return po;
  }
  
  receiveInventory(
    poId: string,
    items: { productId: string; quantity: number; passed: boolean }[]
  ): PurchaseOrder | undefined {
    const po = this.purchaseOrders.get(poId);
    if (!po) return undefined;
    
    items.forEach((receivedItem) => {
      const poItem = po.items.find((i) => i.productId === receivedItem.productId);
      if (poItem) {
        poItem.receivedQuantity += receivedItem.quantity;
        poItem.qualityCheck = receivedItem.passed ? "passed" : "failed";
        
        // Record inventory movement
        if (receivedItem.passed) {
          this.movements.push({
            id: `mov-${Date.now()}`,
            type: "receipt",
            productId: poItem.productId,
            productName: poItem.productName,
            sku: poItem.sku,
            quantity: receivedItem.quantity,
            toLocation: po.warehouse,
            referenceId: po.id,
            performedBy: "system",
            timestamp: new Date(),
          });
        }
      }
    });
    
    // Check if fully received
    const fullyReceived = po.items.every((item) => item.receivedQuantity >= item.quantity);
    const partiallyReceived = po.items.some((item) => item.receivedQuantity > 0);
    
    if (fullyReceived) {
      po.status = "received";
      po.actualDelivery = new Date();
    } else if (partiallyReceived) {
      po.status = "partially_received";
    }
    
    po.updatedAt = new Date();
    this.purchaseOrders.set(poId, po);
    
    // Update supplier performance
    this.updateSupplierPerformance(po.supplierId, po);
    
    return po;
  }
  
  private calculateShipping(supplier: Supplier, orderValue: number): number {
    // Free shipping for large orders
    if (orderValue > 10000) return 0;
    
    // International shipping
    if (supplier.country !== "BR") {
      return 500;
    }
    
    return 100;
  }
  
  private updateSupplierPerformance(supplierId: string, po: PurchaseOrder): void {
    const supplier = this.suppliers.get(supplierId);
    if (!supplier) return;
    
    supplier.performance.totalOrders++;
    supplier.performance.totalValue += po.total;
    supplier.performance.lastOrderDate = new Date();
    
    // Calculate on-time delivery
    if (po.expectedDelivery && po.actualDelivery) {
      const onTime = po.actualDelivery <= po.expectedDelivery;
      const currentRate = supplier.performance.onTimeDeliveryRate;
      const totalOrders = supplier.performance.totalOrders;
      
      supplier.performance.onTimeDeliveryRate =
        (currentRate * (totalOrders - 1) + (onTime ? 100 : 0)) / totalOrders;
    }
    
    // Calculate quality score based on quality checks
    const passedItems = po.items.filter((i) => i.qualityCheck === "passed").length;
    const totalItems = po.items.length;
    const orderQuality = (passedItems / totalItems) * 100;
    
    const currentQuality = supplier.performance.qualityScore;
    const totalOrders = supplier.performance.totalOrders;
    supplier.performance.qualityScore =
      (currentQuality * (totalOrders - 1) + orderQuality) / totalOrders;
    
    this.suppliers.set(supplierId, supplier);
  }
  
  // Warehouse Management
  addWarehouse(data: Omit<Warehouse, "id" | "metrics">): Warehouse {
    const warehouse: Warehouse = {
      id: `warehouse-${Date.now()}`,
      ...data,
      metrics: {
        inventoryTurnover: 0,
        orderAccuracy: 100,
        pickingSpeed: 0,
        packingSpeed: 0,
        utilizationRate: 0,
        avgProcessingTime: 0,
      },
    };
    
    this.warehouses.set(warehouse.id, warehouse);
    return warehouse;
  }
  
  // Stock Transfer
  createStockTransfer(
    fromWarehouse: string,
    toWarehouse: string,
    items: StockTransfer["items"],
    requestedBy: string
  ): StockTransfer {
    const transfer: StockTransfer = {
      id: `transfer-${Date.now()}`,
      transferNumber: `TRF${Date.now().toString().slice(-8)}`,
      fromWarehouse,
      toWarehouse,
      items,
      status: "pending",
      requestedBy,
      createdAt: new Date(),
    };
    
    this.transfers.set(transfer.id, transfer);
    return transfer;
  }
  
  approveStockTransfer(transferId: string, approver: string): StockTransfer | undefined {
    const transfer = this.transfers.get(transferId);
    if (!transfer) return undefined;
    
    transfer.status = "in_transit";
    transfer.approvedBy = approver;
    transfer.shippedAt = new Date();
    
    // Record outbound movement
    transfer.items.forEach((item) => {
      this.movements.push({
        id: `mov-${Date.now()}`,
        type: "transfer",
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        quantity: -item.quantity,
        fromLocation: transfer.fromWarehouse,
        toLocation: transfer.toWarehouse,
        referenceId: transfer.id,
        performedBy: approver,
        timestamp: new Date(),
      });
    });
    
    this.transfers.set(transferId, transfer);
    return transfer;
  }
  
  receiveStockTransfer(transferId: string): StockTransfer | undefined {
    const transfer = this.transfers.get(transferId);
    if (!transfer) return undefined;
    
    transfer.status = "received";
    transfer.receivedAt = new Date();
    
    // Record inbound movement
    transfer.items.forEach((item) => {
      this.movements.push({
        id: `mov-${Date.now()}`,
        type: "transfer",
        productId: item.productId,
        productName: item.productName,
        sku: item.sku,
        quantity: item.quantity,
        fromLocation: transfer.fromWarehouse,
        toLocation: transfer.toWarehouse,
        referenceId: transfer.id,
        performedBy: "system",
        timestamp: new Date(),
      });
    });
    
    this.transfers.set(transferId, transfer);
    return transfer;
  }
  
  // Analytics
  getSupplyChainAnalytics(): SupplyChainAnalytics {
    return {
      suppliers: {
        total: this.suppliers.size,
        active: Array.from(this.suppliers.values()).filter((s) => s.status === "active").length,
        avgRating: 4.5,
        avgOnTimeDelivery: 92.5,
      },
      purchaseOrders: {
        total: this.purchaseOrders.size,
        pending: Array.from(this.purchaseOrders.values()).filter((po) => po.status === "sent").length,
        received: Array.from(this.purchaseOrders.values()).filter((po) => po.status === "received").length,
        totalValue: Array.from(this.purchaseOrders.values()).reduce((sum, po) => sum + po.total, 0),
      },
      warehouses: {
        total: this.warehouses.size,
        avgUtilization: 78.5,
        totalCapacity: Array.from(this.warehouses.values()).reduce((sum, w) => sum + w.capacity.total, 0),
      },
      movements: {
        total: this.movements.length,
        last30Days: this.movements.filter(
          (m) => m.timestamp >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        ).length,
      },
    };
  }
}

export interface SupplyChainAnalytics {
  suppliers: {
    total: number;
    active: number;
    avgRating: number;
    avgOnTimeDelivery: number;
  };
  purchaseOrders: {
    total: number;
    pending: number;
    received: number;
    totalValue: number;
  };
  warehouses: {
    total: number;
    avgUtilization: number;
    totalCapacity: number;
  };
  movements: {
    total: number;
    last30Days: number;
  };
}

// Sample Data
export function getSupplyChainSampleData(): {
  suppliers: number;
  purchaseOrders: number;
  warehouses: number;
  totalInventoryValue: number;
  avgLeadTime: number;
} {
  return {
    suppliers: 185,
    purchaseOrders: 2850,
    warehouses: 8,
    totalInventoryValue: 4850000,
    avgLeadTime: 14,
  };
}

// Supplier Scorecard
export interface SupplierScorecard {
  supplierId: string;
  supplierName: string;
  period: {
    start: Date;
    end: Date;
  };
  metrics: {
    onTimeDelivery: number;
    qualityScore: number;
    responseTime: number;
    priceCompetitiveness: number;
    flexibility: number;
    overallScore: number;
  };
  ranking: number;
  totalSuppliers: number;
  recommendations: string[];
}

export function generateSupplierScorecard(supplierId: string): SupplierScorecard {
  return {
    supplierId,
    supplierName: "Premium Aromas LTDA",
    period: {
      start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      end: new Date(),
    },
    metrics: {
      onTimeDelivery: 95.5,
      qualityScore: 92.5,
      responseTime: 88.5,
      priceCompetitiveness: 85.5,
      flexibility: 90.0,
      overallScore: 90.4,
    },
    ranking: 3,
    totalSuppliers: 185,
    recommendations: [
      "Excelente desempenho geral",
      "Manter parceria estratégica",
      "Considerar aumento de volume",
    ],
  };
}
