// Return and Refund Management System

export interface ReturnRequest {
  id: string;
  returnNumber: string;
  orderId: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  status:
    | "requested"
    | "approved"
    | "rejected"
    | "shipped"
    | "received"
    | "inspected"
    | "completed"
    | "cancelled";
  type: "return" | "exchange" | "warranty";
  reason:
    | "defective"
    | "wrong_item"
    | "not_as_described"
    | "changed_mind"
    | "damaged"
    | "late_delivery"
    | "other";
  reasonDetails: string;
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    price: number;
    condition?: "unopened" | "opened" | "used" | "damaged";
    exchangeFor?: {
      productId: string;
      productName: string;
    };
  }[];
  refundAmount: number;
  refundMethod: "original_payment" | "store_credit" | "bank_transfer";
  shippingLabel?: {
    trackingNumber: string;
    carrier: string;
    url: string;
  };
  photos?: string[];
  requestedAt: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  shippedAt?: Date;
  receivedAt?: Date;
  inspectedAt?: Date;
  completedAt?: Date;
  refundedAt?: Date;
  notes?: string;
  internalNotes?: string;
  approvedBy?: string;
  inspectedBy?: string;
}

export interface ReturnPolicy {
  id: string;
  name: string;
  description: string;
  returnWindow: number; // days
  conditions: string[];
  eligibleReasons: ReturnRequest["reason"][];
  shippingCost: "customer" | "seller" | "free";
  restockingFee?: number; // percentage
  excludedCategories?: string[];
  excludedProducts?: string[];
}

export interface RefundTransaction {
  id: string;
  returnId: string;
  orderId: string;
  userId: string;
  amount: number;
  method: ReturnRequest["refundMethod"];
  status: "pending" | "processing" | "completed" | "failed";
  transactionId?: string;
  processedAt?: Date;
  completedAt?: Date;
  failureReason?: string;
  notes?: string;
}

export interface ExchangeOrder {
  id: string;
  returnId: string;
  originalOrderId: string;
  newOrderId: string;
  userId: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  priceDifference: number; // positive if customer owes, negative if refund
  status: "pending" | "paid" | "shipped" | "completed";
  createdAt: Date;
  shippedAt?: Date;
  completedAt?: Date;
}

export interface ReturnAnalytics {
  totalReturns: number;
  returnRate: number; // percentage
  byReason: {
    reason: string;
    count: number;
    percentage: number;
  }[];
  byProduct: {
    productId: string;
    productName: string;
    returns: number;
    returnRate: number;
  }[];
  averageProcessingTime: number; // days
  refundedAmount: number;
  storeCreditIssued: number;
}

// Default return policy
export const defaultReturnPolicy: ReturnPolicy = {
  id: "policy-001",
  name: "Política de Devolução Padrão",
  description:
    "Você pode devolver produtos em até 30 dias após o recebimento, desde que estejam em perfeitas condições.",
  returnWindow: 30,
  conditions: [
    "Produto em perfeitas condições",
    "Embalagem original preservada",
    "Etiquetas e lacres intactos",
    "Nota fiscal incluída",
    "Sem sinais de uso",
  ],
  eligibleReasons: [
    "defective",
    "wrong_item",
    "not_as_described",
    "changed_mind",
    "damaged",
    "late_delivery",
    "other",
  ],
  shippingCost: "customer",
  restockingFee: 0,
};

// Mock return requests
export const returnRequests: ReturnRequest[] = [
  {
    id: "ret-001",
    returnNumber: "RET-2024-001",
    orderId: "ORD-001",
    orderNumber: "ORD-2024-001",
    userId: "user-123",
    userName: "João Silva",
    userEmail: "joao@example.com",
    status: "requested",
    type: "return",
    reason: "defective",
    reasonDetails: "O difusor não está funcionando corretamente. Não liga.",
    items: [
      {
        productId: "difusor-aromatico",
        productName: "Difusor Aromático Ultrassônico Zen",
        sku: "DAU-001",
        quantity: 1,
        price: 129.9,
      },
    ],
    refundAmount: 129.9,
    refundMethod: "original_payment",
    photos: ["/returns/ret-001-photo1.jpg", "/returns/ret-001-photo2.jpg"],
    requestedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
];

// Create return request
export function createReturnRequest(data: {
  orderId: string;
  orderNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: ReturnRequest["type"];
  reason: ReturnRequest["reason"];
  reasonDetails: string;
  items: ReturnRequest["items"];
  photos?: string[];
}): ReturnRequest {
  const refundAmount = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const returnRequest: ReturnRequest = {
    id: `ret-${Date.now()}`,
    returnNumber: `RET-${new Date().getFullYear()}-${String(
      returnRequests.length + 1
    ).padStart(3, "0")}`,
    orderId: data.orderId,
    orderNumber: data.orderNumber,
    userId: data.userId,
    userName: data.userName,
    userEmail: data.userEmail,
    status: "requested",
    type: data.type,
    reason: data.reason,
    reasonDetails: data.reasonDetails,
    items: data.items,
    refundAmount,
    refundMethod: "original_payment",
    photos: data.photos,
    requestedAt: new Date(),
  };

  returnRequests.push(returnRequest);

  // In production, save to database and send notification
  return returnRequest;
}

// Approve return request
export function approveReturnRequest(
  returnId: string,
  approvedBy: string,
  generateShippingLabel: boolean = true
): boolean {
  const returnReq = returnRequests.find((r) => r.id === returnId);
  if (!returnReq || returnReq.status !== "requested") return false;

  returnReq.status = "approved";
  returnReq.approvedAt = new Date();
  returnReq.approvedBy = approvedBy;

  if (generateShippingLabel) {
    // In production, generate shipping label via carrier API
    returnReq.shippingLabel = {
      trackingNumber: `BR${Math.random().toString().substring(2, 15)}`,
      carrier: "Correios",
      url: `/shipping-labels/${returnReq.id}.pdf`,
    };
  }

  // In production, send email with shipping label
  return true;
}

// Reject return request
export function rejectReturnRequest(
  returnId: string,
  reason: string
): boolean {
  const returnReq = returnRequests.find((r) => r.id === returnId);
  if (!returnReq || returnReq.status !== "requested") return false;

  returnReq.status = "rejected";
  returnReq.rejectedAt = new Date();
  returnReq.rejectionReason = reason;

  // In production, send rejection email
  return true;
}

// Mark return as shipped by customer
export function markReturnShipped(
  returnId: string,
  trackingNumber: string
): boolean {
  const returnReq = returnRequests.find((r) => r.id === returnId);
  if (!returnReq || returnReq.status !== "approved") return false;

  returnReq.status = "shipped";
  returnReq.shippedAt = new Date();

  if (!returnReq.shippingLabel) {
    returnReq.shippingLabel = {
      trackingNumber,
      carrier: "Correios",
      url: "",
    };
  } else {
    returnReq.shippingLabel.trackingNumber = trackingNumber;
  }

  return true;
}

// Mark return as received
export function markReturnReceived(returnId: string): boolean {
  const returnReq = returnRequests.find((r) => r.id === returnId);
  if (!returnReq || returnReq.status !== "shipped") return false;

  returnReq.status = "received";
  returnReq.receivedAt = new Date();

  return true;
}

// Inspect returned items
export function inspectReturnedItems(
  returnId: string,
  inspectedBy: string,
  itemConditions: {
    productId: string;
    condition: "unopened" | "opened" | "used" | "damaged";
  }[],
  notes?: string
): boolean {
  const returnReq = returnRequests.find((r) => r.id === returnId);
  if (!returnReq || returnReq.status !== "received") return false;

  // Update item conditions
  for (const itemCondition of itemConditions) {
    const item = returnReq.items.find(
      (i) => i.productId === itemCondition.productId
    );
    if (item) {
      item.condition = itemCondition.condition;
    }
  }

  returnReq.status = "inspected";
  returnReq.inspectedAt = new Date();
  returnReq.inspectedBy = inspectedBy;
  returnReq.internalNotes = notes;

  // Adjust refund amount based on condition
  let refundAdjustment = 0;
  for (const item of returnReq.items) {
    if (item.condition === "damaged" || item.condition === "used") {
      // Apply restocking fee or reduce refund
      refundAdjustment +=
        item.price * item.quantity * (defaultReturnPolicy.restockingFee || 0);
    }
  }

  returnReq.refundAmount -= refundAdjustment;

  return true;
}

// Process refund
export function processRefund(returnId: string): RefundTransaction {
  const returnReq = returnRequests.find((r) => r.id === returnId);
  if (!returnReq || returnReq.status !== "inspected") {
    throw new Error("Return not ready for refund");
  }

  const refund: RefundTransaction = {
    id: `refund-${Date.now()}`,
    returnId: returnReq.id,
    orderId: returnReq.orderId,
    userId: returnReq.userId,
    amount: returnReq.refundAmount,
    method: returnReq.refundMethod,
    status: "pending",
    processedAt: new Date(),
  };

  // In production, process refund via payment gateway
  setTimeout(() => {
    refund.status = "completed";
    refund.completedAt = new Date();
    refund.transactionId = `TXN-${Date.now()}`;

    returnReq.status = "completed";
    returnReq.completedAt = new Date();
    returnReq.refundedAt = new Date();
  }, 1000);

  return refund;
}

// Create exchange order
export function createExchangeOrder(
  returnId: string,
  newItems: ExchangeOrder["items"]
): ExchangeOrder {
  const returnReq = returnRequests.find((r) => r.id === returnId);
  if (!returnReq || returnReq.type !== "exchange") {
    throw new Error("Invalid return for exchange");
  }

  const originalAmount = returnReq.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const newAmount = newItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const priceDifference = newAmount - originalAmount;

  const exchange: ExchangeOrder = {
    id: `exch-${Date.now()}`,
    returnId: returnReq.id,
    originalOrderId: returnReq.orderId,
    newOrderId: `ORD-${Date.now()}`,
    userId: returnReq.userId,
    items: newItems,
    priceDifference,
    status: priceDifference > 0 ? "pending" : "paid",
    createdAt: new Date(),
  };

  // In production, create new order and handle payment difference
  return exchange;
}

// Check if order is eligible for return
export function isOrderEligibleForReturn(
  orderDate: Date,
  orderStatus: string
): {
  eligible: boolean;
  reason?: string;
  daysRemaining?: number;
} {
  if (orderStatus !== "delivered") {
    return {
      eligible: false,
      reason: "Pedido ainda não foi entregue",
    };
  }

  const daysSinceDelivery = Math.floor(
    (Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceDelivery > defaultReturnPolicy.returnWindow) {
    return {
      eligible: false,
      reason: `Prazo de ${defaultReturnPolicy.returnWindow} dias expirado`,
    };
  }

  return {
    eligible: true,
    daysRemaining: defaultReturnPolicy.returnWindow - daysSinceDelivery,
  };
}

// Get return requests by user
export function getUserReturnRequests(userId: string): ReturnRequest[] {
  return returnRequests.filter((r) => r.userId === userId);
}

// Get return requests by status
export function getReturnRequestsByStatus(
  status: ReturnRequest["status"]
): ReturnRequest[] {
  return returnRequests.filter((r) => r.status === status);
}

// Return analytics
export function getReturnAnalytics(
  startDate?: Date,
  endDate?: Date
): ReturnAnalytics {
  let returns = [...returnRequests];

  if (startDate) {
    returns = returns.filter((r) => r.requestedAt >= startDate);
  }

  if (endDate) {
    returns = returns.filter((r) => r.requestedAt <= endDate);
  }

  const totalReturns = returns.length;

  // By reason
  const reasons = [
    "defective",
    "wrong_item",
    "not_as_described",
    "changed_mind",
    "damaged",
    "late_delivery",
    "other",
  ];
  const byReason = reasons.map((reason) => {
    const count = returns.filter((r) => r.reason === reason).length;
    return {
      reason,
      count,
      percentage: (count / totalReturns) * 100,
    };
  });

  // By product (mock)
  const byProduct = [
    {
      productId: "difusor-aromatico",
      productName: "Difusor Aromático",
      returns: 5,
      returnRate: 2.3,
    },
  ];

  // Average processing time
  const completedReturns = returns.filter((r) => r.completedAt);
  const averageProcessingTime =
    completedReturns.reduce((sum, r) => {
      const days =
        (r.completedAt!.getTime() - r.requestedAt.getTime()) /
        (1000 * 60 * 60 * 24);
      return sum + days;
    }, 0) / Math.max(1, completedReturns.length);

  // Refunded amounts
  const refundedAmount = returns
    .filter((r) => r.status === "completed")
    .reduce((sum, r) => sum + r.refundAmount, 0);

  const storeCreditIssued = returns
    .filter((r) => r.refundMethod === "store_credit" && r.status === "completed")
    .reduce((sum, r) => sum + r.refundAmount, 0);

  return {
    totalReturns,
    returnRate: 3.5, // Mock - calculate from total orders
    byReason,
    byProduct,
    averageProcessingTime: Math.round(averageProcessingTime),
    refundedAmount,
    storeCreditIssued,
  };
}

// Automated return approval rules
export interface ReturnApprovalRule {
  id: string;
  name: string;
  conditions: {
    reason?: ReturnRequest["reason"][];
    maxAmount?: number;
    maxDaysSinceDelivery?: number;
    customerTier?: string[];
  };
  action: "auto_approve" | "auto_reject" | "require_review";
  generateLabel: boolean;
  priority: number;
}

export const returnApprovalRules: ReturnApprovalRule[] = [
  {
    id: "rule-001",
    name: "Auto-approve defective items",
    conditions: {
      reason: ["defective", "wrong_item", "damaged"],
      maxAmount: 500,
    },
    action: "auto_approve",
    generateLabel: true,
    priority: 1,
  },
  {
    id: "rule-002",
    name: "Auto-approve VIP customers",
    conditions: {
      customerTier: ["gold", "platinum"],
      maxAmount: 1000,
    },
    action: "auto_approve",
    generateLabel: true,
    priority: 2,
  },
  {
    id: "rule-003",
    name: "Require review for high-value returns",
    conditions: {
      maxAmount: 1000,
    },
    action: "require_review",
    generateLabel: false,
    priority: 3,
  },
];

// Apply return approval rules
export function applyReturnApprovalRules(
  returnRequest: ReturnRequest,
  customerTier?: string
): {
  action: "auto_approve" | "auto_reject" | "require_review";
  rule?: ReturnApprovalRule;
} {
  // Sort rules by priority
  const sortedRules = [...returnApprovalRules].sort(
    (a, b) => a.priority - b.priority
  );

  for (const rule of sortedRules) {
    let matches = true;

    if (rule.conditions.reason) {
      if (!rule.conditions.reason.includes(returnRequest.reason)) {
        matches = false;
      }
    }

    if (rule.conditions.maxAmount) {
      if (returnRequest.refundAmount > rule.conditions.maxAmount) {
        matches = false;
      }
    }

    if (rule.conditions.customerTier && customerTier) {
      if (!rule.conditions.customerTier.includes(customerTier)) {
        matches = false;
      }
    }

    if (matches) {
      return {
        action: rule.action,
        rule,
      };
    }
  }

  return {
    action: "require_review",
  };
}

// Bulk process returns
export function bulkProcessReturns(
  returnIds: string[],
  action: "approve" | "reject",
  approvedBy?: string,
  rejectionReason?: string
): {
  success: number;
  failed: number;
} {
  let success = 0;
  let failed = 0;

  for (const returnId of returnIds) {
    try {
      if (action === "approve" && approvedBy) {
        if (approveReturnRequest(returnId, approvedBy)) {
          success++;
        } else {
          failed++;
        }
      } else if (action === "reject" && rejectionReason) {
        if (rejectReturnRequest(returnId, rejectionReason)) {
          success++;
        } else {
          failed++;
        }
      }
    } catch (error) {
      failed++;
    }
  }

  return { success, failed };
}

// Return labels
export interface ReturnLabel {
  id: string;
  returnId: string;
  trackingNumber: string;
  carrier: string;
  labelUrl: string;
  cost: number;
  createdAt: Date;
  usedAt?: Date;
}

export function generateReturnLabel(
  returnId: string,
  carrier: "correios" | "fedex" | "dhl" = "correios"
): ReturnLabel {
  const label: ReturnLabel = {
    id: `label-${Date.now()}`,
    returnId,
    trackingNumber: `BR${Math.random().toString().substring(2, 15)}`,
    carrier,
    labelUrl: `/shipping-labels/${returnId}.pdf`,
    cost: carrier === "correios" ? 15.0 : 25.0,
    createdAt: new Date(),
  };

  // In production, generate label via carrier API
  return label;
}

// Return notifications
export function sendReturnNotification(
  returnId: string,
  type:
    | "requested"
    | "approved"
    | "rejected"
    | "shipped"
    | "received"
    | "refunded"
): boolean {
  const returnReq = returnRequests.find((r) => r.id === returnId);
  if (!returnReq) return false;

  // In production, send email/SMS notification
  console.log(`Sending ${type} notification for return ${returnId}`);

  return true;
}
