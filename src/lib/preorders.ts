// Pre-Orders and Backorders Management System

export interface PreOrder {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  status: "active" | "fulfilled" | "cancelled";
  price: number;
  depositAmount?: number; // Partial payment required
  depositPercentage?: number; // e.g., 20% deposit
  releaseDate: Date;
  estimatedShipDate: Date;
  maxQuantity?: number; // Limited availability
  currentOrders: number;
  remainingSlots?: number;
  earlyBirdDiscount?: {
    percentage: number;
    endsAt: Date;
  };
  benefits: string[];
  images: string[];
  description: string;
  createdAt: Date;
  fulfilledAt?: Date;
}

export interface PreOrderPurchase {
  id: string;
  preOrderId: string;
  orderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  depositPaid?: number;
  remainingBalance?: number;
  status:
    | "deposit_paid"
    | "awaiting_payment"
    | "paid"
    | "processing"
    | "shipped"
    | "completed"
    | "cancelled";
  depositPaidAt?: Date;
  fullPaymentAt?: Date;
  shippedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  refundAmount?: number;
  refundedAt?: Date;
  estimatedDelivery: Date;
  notificationsSent: {
    type: string;
    sentAt: Date;
  }[];
  createdAt: Date;
}

export interface Backorder {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  status: "active" | "fulfilled" | "cancelled";
  currentQuantity: number;
  expectedRestockDate?: Date;
  expectedQuantity?: number;
  autoFulfill: boolean; // Automatically fulfill when back in stock
  priority: "fifo" | "vip" | "highest_value"; // Fulfillment order
  createdAt: Date;
  fulfilledAt?: Date;
}

export interface BackorderRequest {
  id: string;
  backorderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  status:
    | "waiting"
    | "notified"
    | "ordered"
    | "fulfilled"
    | "expired"
    | "cancelled";
  priority: number;
  paymentHeld: boolean; // Payment authorized but not captured
  paymentAuthId?: string;
  notifyWhenAvailable: boolean;
  autoOrder: boolean; // Automatically create order when available
  expiresAt?: Date; // Notification/hold expiration
  notifiedAt?: Date;
  orderedAt?: Date;
  fulfilledAt?: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  createdAt: Date;
}

export interface WaitlistEntry {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  userEmail: string;
  quantity: number;
  notifyEmail: boolean;
  notifySMS: boolean;
  notifyPush: boolean;
  priority: number;
  status: "active" | "notified" | "purchased" | "expired" | "removed";
  notifiedAt?: Date;
  purchasedAt?: Date;
  createdAt: Date;
}

// Mock pre-orders
export const preOrders: PreOrder[] = [
  {
    id: "pre-001",
    productId: "new-smart-collar",
    productName: "Coleira Inteligente GPS Pro",
    sku: "CIG-PRO-001",
    status: "active",
    price: 299.9,
    depositAmount: 59.98,
    depositPercentage: 20,
    releaseDate: new Date("2025-02-01"),
    estimatedShipDate: new Date("2025-02-15"),
    maxQuantity: 500,
    currentOrders: 234,
    remainingSlots: 266,
    earlyBirdDiscount: {
      percentage: 15,
      endsAt: new Date("2025-01-15"),
    },
    benefits: [
      "Preço especial de lançamento",
      "Entrega prioritária",
      "Garantia estendida de 2 anos",
      "Acesso antecipado a novos recursos",
      "Kit de boas-vindas exclusivo",
    ],
    images: ["/preorders/smart-collar-1.jpg", "/preorders/smart-collar-2.jpg"],
    description:
      "Seja um dos primeiros a receber nossa revolucionária coleira inteligente com GPS, monitor de atividades e muito mais!",
    createdAt: new Date("2024-12-01"),
  },
];

// Mock pre-order purchases
export const preOrderPurchases: PreOrderPurchase[] = [];

// Mock backorders
export const backorders: Backorder[] = [
  {
    id: "back-001",
    productId: "difusor-aromatico",
    productName: "Difusor Aromático Ultrassônico Zen",
    sku: "DAU-001",
    status: "active",
    currentQuantity: 45,
    expectedRestockDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    expectedQuantity: 200,
    autoFulfill: true,
    priority: "fifo",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

// Mock backorder requests
export const backorderRequests: BackorderRequest[] = [];

// Mock waitlist
export const waitlist: WaitlistEntry[] = [];

// Create pre-order
export function createPreOrder(data: {
  productId: string;
  productName: string;
  sku: string;
  price: number;
  depositPercentage?: number;
  releaseDate: Date;
  estimatedShipDate: Date;
  maxQuantity?: number;
  earlyBirdDiscount?: PreOrder["earlyBirdDiscount"];
  benefits: string[];
  images: string[];
  description: string;
}): PreOrder {
  const depositAmount = data.depositPercentage
    ? (data.price * data.depositPercentage) / 100
    : undefined;

  const preOrder: PreOrder = {
    id: `pre-${Date.now()}`,
    productId: data.productId,
    productName: data.productName,
    sku: data.sku,
    status: "active",
    price: data.price,
    depositAmount,
    depositPercentage: data.depositPercentage,
    releaseDate: data.releaseDate,
    estimatedShipDate: data.estimatedShipDate,
    maxQuantity: data.maxQuantity,
    currentOrders: 0,
    remainingSlots: data.maxQuantity,
    earlyBirdDiscount: data.earlyBirdDiscount,
    benefits: data.benefits,
    images: data.images,
    description: data.description,
    createdAt: new Date(),
  };

  preOrders.push(preOrder);

  return preOrder;
}

// Purchase pre-order
export function purchasePreOrder(data: {
  preOrderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  quantity: number;
  orderId: string;
}): PreOrderPurchase {
  const preOrder = preOrders.find((p) => p.id === data.preOrderId);
  if (!preOrder || preOrder.status !== "active") {
    throw new Error("Pre-order not available");
  }

  if (
    preOrder.maxQuantity &&
    preOrder.currentOrders + data.quantity > preOrder.maxQuantity
  ) {
    throw new Error("Pre-order limit reached");
  }

  const unitPrice = preOrder.earlyBirdDiscount &&
    new Date() < preOrder.earlyBirdDiscount.endsAt
    ? preOrder.price * (1 - preOrder.earlyBirdDiscount.percentage / 100)
    : preOrder.price;

  const totalPrice = unitPrice * data.quantity;
  const depositPaid = preOrder.depositAmount
    ? preOrder.depositAmount * data.quantity
    : totalPrice;
  const remainingBalance = totalPrice - depositPaid;

  const purchase: PreOrderPurchase = {
    id: `prepurch-${Date.now()}`,
    preOrderId: data.preOrderId,
    orderId: data.orderId,
    userId: data.userId,
    userName: data.userName,
    userEmail: data.userEmail,
    productId: preOrder.productId,
    productName: preOrder.productName,
    quantity: data.quantity,
    unitPrice,
    totalPrice,
    depositPaid,
    remainingBalance,
    status: remainingBalance > 0 ? "deposit_paid" : "paid",
    depositPaidAt: new Date(),
    estimatedDelivery: preOrder.estimatedShipDate,
    notificationsSent: [],
    createdAt: new Date(),
  };

  preOrderPurchases.push(purchase);

  // Update pre-order
  preOrder.currentOrders += data.quantity;
  if (preOrder.remainingSlots) {
    preOrder.remainingSlots -= data.quantity;
  }

  return purchase;
}

// Request final payment for pre-order
export function requestPreOrderFinalPayment(purchaseId: string): boolean {
  const purchase = preOrderPurchases.find((p) => p.id === purchaseId);
  if (!purchase || purchase.status !== "deposit_paid") return false;

  purchase.status = "awaiting_payment";

  // In production, send payment request email
  purchase.notificationsSent.push({
    type: "payment_request",
    sentAt: new Date(),
  });

  return true;
}

// Complete pre-order payment
export function completePreOrderPayment(purchaseId: string): boolean {
  const purchase = preOrderPurchases.find((p) => p.id === purchaseId);
  if (!purchase || purchase.status !== "awaiting_payment") return false;

  purchase.status = "paid";
  purchase.fullPaymentAt = new Date();

  return true;
}

// Fulfill pre-order
export function fulfillPreOrder(preOrderId: string): {
  success: number;
  failed: number;
} {
  const preOrder = preOrders.find((p) => p.id === preOrderId);
  if (!preOrder) return { success: 0, failed: 0 };

  const purchases = preOrderPurchases.filter(
    (p) => p.preOrderId === preOrderId && p.status === "paid"
  );

  let success = 0;
  let failed = 0;

  for (const purchase of purchases) {
    try {
      purchase.status = "processing";
      // In production, create shipment
      purchase.status = "shipped";
      purchase.shippedAt = new Date();
      success++;
    } catch (error) {
      failed++;
    }
  }

  if (success > 0) {
    preOrder.status = "fulfilled";
    preOrder.fulfilledAt = new Date();
  }

  return { success, failed };
}

// Cancel pre-order purchase
export function cancelPreOrderPurchase(
  purchaseId: string,
  reason: string,
  refundDeposit: boolean = true
): boolean {
  const purchase = preOrderPurchases.find((p) => p.id === purchaseId);
  if (!purchase || purchase.status === "shipped" || purchase.status === "completed") {
    return false;
  }

  purchase.status = "cancelled";
  purchase.cancelledAt = new Date();
  purchase.cancellationReason = reason;

  if (refundDeposit && purchase.depositPaid) {
    purchase.refundAmount = purchase.depositPaid;
    // In production, process refund
    purchase.refundedAt = new Date();
  }

  // Update pre-order counts
  const preOrder = preOrders.find((p) => p.id === purchase.preOrderId);
  if (preOrder) {
    preOrder.currentOrders -= purchase.quantity;
    if (preOrder.remainingSlots !== undefined) {
      preOrder.remainingSlots += purchase.quantity;
    }
  }

  return true;
}

// Create backorder
export function createBackorder(data: {
  productId: string;
  productName: string;
  sku: string;
  expectedRestockDate?: Date;
  expectedQuantity?: number;
  autoFulfill?: boolean;
  priority?: Backorder["priority"];
}): Backorder {
  const backorder: Backorder = {
    id: `back-${Date.now()}`,
    productId: data.productId,
    productName: data.productName,
    sku: data.sku,
    status: "active",
    currentQuantity: 0,
    expectedRestockDate: data.expectedRestockDate,
    expectedQuantity: data.expectedQuantity,
    autoFulfill: data.autoFulfill ?? true,
    priority: data.priority || "fifo",
    createdAt: new Date(),
  };

  backorders.push(backorder);

  return backorder;
}

// Request backorder
export function requestBackorder(data: {
  backorderId: string;
  userId: string;
  userName: string;
  userEmail: string;
  quantity: number;
  price: number;
  notifyWhenAvailable?: boolean;
  autoOrder?: boolean;
  holdPayment?: boolean;
}): BackorderRequest {
  const backorder = backorders.find((b) => b.id === data.backorderId);
  if (!backorder || backorder.status !== "active") {
    throw new Error("Backorder not available");
  }

  const request: BackorderRequest = {
    id: `backreq-${Date.now()}`,
    backorderId: data.backorderId,
    userId: data.userId,
    userName: data.userName,
    userEmail: data.userEmail,
    productId: backorder.productId,
    productName: backorder.productName,
    quantity: data.quantity,
    price: data.price,
    status: "waiting",
    priority: backorderRequests.filter((r) => r.backorderId === data.backorderId)
      .length + 1,
    paymentHeld: data.holdPayment || false,
    notifyWhenAvailable: data.notifyWhenAvailable ?? true,
    autoOrder: data.autoOrder ?? false,
    expiresAt: data.holdPayment
      ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      : undefined,
    createdAt: new Date(),
  };

  if (data.holdPayment) {
    // In production, authorize payment
    request.paymentAuthId = `AUTH-${Date.now()}`;
  }

  backorderRequests.push(request);
  backorder.currentQuantity += data.quantity;

  return request;
}

// Fulfill backorders when stock arrives
export function fulfillBackorders(
  productId: string,
  availableQuantity: number
): {
  fulfilled: number;
  notified: number;
  remaining: number;
} {
  const backorder = backorders.find(
    (b) => b.productId === productId && b.status === "active"
  );

  if (!backorder) return { fulfilled: 0, notified: 0, remaining: availableQuantity };

  const requests = backorderRequests
    .filter((r) => r.backorderId === backorder.id && r.status === "waiting")
    .sort((a, b) => {
      if (backorder.priority === "fifo") {
        return a.priority - b.priority;
      } else if (backorder.priority === "vip") {
        // In production, check customer tier
        return a.priority - b.priority;
      } else {
        // highest_value
        return b.price * b.quantity - a.price * a.quantity;
      }
    });

  let fulfilled = 0;
  let notified = 0;
  let remaining = availableQuantity;

  for (const request of requests) {
    if (remaining <= 0) break;

    if (request.quantity <= remaining) {
      if (backorder.autoFulfill && request.autoOrder) {
        // Auto-create order
        request.status = "ordered";
        request.orderedAt = new Date();

        if (request.paymentHeld && request.paymentAuthId) {
          // Capture payment
          // In production, capture authorized payment
        }

        fulfilled++;
        remaining -= request.quantity;
      } else {
        // Notify customer
        request.status = "notified";
        request.notifiedAt = new Date();
        request.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // In production, send notification
        notified++;
      }
    }
  }

  if (backorderRequests.filter((r) => r.status === "waiting").length === 0) {
    backorder.status = "fulfilled";
    backorder.fulfilledAt = new Date();
  }

  return { fulfilled, notified, remaining };
}

// Add to waitlist
export function addToWaitlist(data: {
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  userEmail: string;
  quantity: number;
  notifyEmail?: boolean;
  notifySMS?: boolean;
  notifyPush?: boolean;
}): WaitlistEntry {
  const entry: WaitlistEntry = {
    id: `wait-${Date.now()}`,
    productId: data.productId,
    productName: data.productName,
    userId: data.userId,
    userName: data.userName,
    userEmail: data.userEmail,
    quantity: data.quantity,
    notifyEmail: data.notifyEmail ?? true,
    notifySMS: data.notifySMS ?? false,
    notifyPush: data.notifyPush ?? true,
    priority: waitlist.filter((w) => w.productId === data.productId).length + 1,
    status: "active",
    createdAt: new Date(),
  };

  waitlist.push(entry);

  return entry;
}

// Notify waitlist when product available
export function notifyWaitlist(productId: string): number {
  const entries = waitlist.filter(
    (w) => w.productId === productId && w.status === "active"
  );

  let notified = 0;

  for (const entry of entries) {
    entry.status = "notified";
    entry.notifiedAt = new Date();

    // In production, send notifications based on preferences
    if (entry.notifyEmail) {
      // Send email
    }
    if (entry.notifySMS) {
      // Send SMS
    }
    if (entry.notifyPush) {
      // Send push notification
    }

    notified++;
  }

  return notified;
}

// Get pre-orders by user
export function getUserPreOrders(userId: string): PreOrderPurchase[] {
  return preOrderPurchases.filter((p) => p.userId === userId);
}

// Get backorder requests by user
export function getUserBackorderRequests(userId: string): BackorderRequest[] {
  return backorderRequests.filter((r) => r.userId === userId);
}

// Get waitlist entries by user
export function getUserWaitlistEntries(userId: string): WaitlistEntry[] {
  return waitlist.filter((w) => w.userId === userId);
}

// Pre-order analytics
export interface PreOrderAnalytics {
  totalPreOrders: number;
  activePreOrders: number;
  totalRevenue: number;
  depositRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  topPreOrders: {
    preOrderId: string;
    productName: string;
    orders: number;
    revenue: number;
  }[];
}

export function getPreOrderAnalytics(): PreOrderAnalytics {
  const totalRevenue = preOrderPurchases.reduce(
    (sum, p) => sum + p.totalPrice,
    0
  );
  const depositRevenue = preOrderPurchases.reduce(
    (sum, p) => sum + (p.depositPaid || 0),
    0
  );

  return {
    totalPreOrders: preOrders.length,
    activePreOrders: preOrders.filter((p) => p.status === "active").length,
    totalRevenue,
    depositRevenue,
    averageOrderValue: totalRevenue / Math.max(1, preOrderPurchases.length),
    conversionRate: 12.5, // Mock
    topPreOrders: preOrders
      .map((po) => {
        const purchases = preOrderPurchases.filter(
          (p) => p.preOrderId === po.id
        );
        return {
          preOrderId: po.id,
          productName: po.productName,
          orders: purchases.length,
          revenue: purchases.reduce((sum, p) => sum + p.totalPrice, 0),
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5),
  };
}

// Backorder analytics
export interface BackorderAnalytics {
  totalBackorders: number;
  activeBackorders: number;
  totalRequests: number;
  fulfillmentRate: number;
  averageWaitTime: number; // days
  topBackorderedProducts: {
    productId: string;
    productName: string;
    requests: number;
    quantity: number;
  }[];
}

export function getBackorderAnalytics(): BackorderAnalytics {
  const fulfilledRequests = backorderRequests.filter(
    (r) => r.status === "fulfilled"
  ).length;

  return {
    totalBackorders: backorders.length,
    activeBackorders: backorders.filter((b) => b.status === "active").length,
    totalRequests: backorderRequests.length,
    fulfillmentRate:
      (fulfilledRequests / Math.max(1, backorderRequests.length)) * 100,
    averageWaitTime: 14, // Mock
    topBackorderedProducts: backorders
      .map((bo) => {
        const requests = backorderRequests.filter(
          (r) => r.backorderId === bo.id
        );
        return {
          productId: bo.productId,
          productName: bo.productName,
          requests: requests.length,
          quantity: requests.reduce((sum, r) => sum + r.quantity, 0),
        };
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5),
  };
}
