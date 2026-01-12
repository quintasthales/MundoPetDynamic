// Advanced Payment Processing System

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  provider: PaymentProvider;
  details: PaymentMethodDetails;
  isDefault: boolean;
  verified: boolean;
  status: "active" | "expired" | "blocked";
  createdAt: Date;
  lastUsed?: Date;
}

export type PaymentMethodType =
  | "credit_card"
  | "debit_card"
  | "pix"
  | "boleto"
  | "bank_transfer"
  | "digital_wallet"
  | "cryptocurrency"
  | "bnpl"; // Buy Now Pay Later

export type PaymentProvider =
  | "stripe"
  | "mercadopago"
  | "pagseguro"
  | "paypal"
  | "pix_central_bank"
  | "cielo"
  | "rede"
  | "adyen";

export interface PaymentMethodDetails {
  // Credit/Debit Card
  cardLast4?: string;
  cardBrand?: "visa" | "mastercard" | "amex" | "elo" | "hipercard";
  cardExpiry?: string; // MM/YY
  cardholderName?: string;
  
  // PIX
  pixKey?: string;
  pixKeyType?: "cpf" | "email" | "phone" | "random";
  
  // Bank Transfer
  bankName?: string;
  accountNumber?: string;
  accountType?: "checking" | "savings";
  
  // Digital Wallet
  walletProvider?: "apple_pay" | "google_pay" | "samsung_pay";
  walletId?: string;
  
  // Cryptocurrency
  cryptoCurrency?: "bitcoin" | "ethereum" | "usdt";
  walletAddress?: string;
  
  // BNPL
  bnplProvider?: "klarna" | "afterpay" | "affirm";
  creditLimit?: number;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  method: PaymentMethodType;
  provider: PaymentProvider;
  status: PaymentStatus;
  metadata: {
    ip: string;
    userAgent: string;
    deviceFingerprint?: string;
  };
  fees: {
    processing: number;
    gateway: number;
    total: number;
  };
  timeline: PaymentEvent[];
  fraudScore?: number;
  threeDSecure?: {
    enabled: boolean;
    authenticated: boolean;
    version: "1.0" | "2.0";
  };
  createdAt: Date;
  processedAt?: Date;
  settledAt?: Date;
  refundedAt?: Date;
}

export type PaymentStatus =
  | "pending"
  | "processing"
  | "authorized"
  | "captured"
  | "settled"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partially_refunded"
  | "disputed"
  | "chargeback";

export interface PaymentEvent {
  timestamp: Date;
  type: string;
  status: PaymentStatus;
  message: string;
  metadata?: Record<string, any>;
}

export interface Refund {
  id: string;
  transactionId: string;
  orderId: string;
  amount: number;
  reason: RefundReason;
  status: "pending" | "processing" | "completed" | "failed";
  initiatedBy: string;
  approvedBy?: string;
  processedAt?: Date;
  createdAt: Date;
}

export type RefundReason =
  | "customer_request"
  | "product_defect"
  | "wrong_item"
  | "not_received"
  | "duplicate_charge"
  | "fraud"
  | "other";

export interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  type: "installments" | "subscription" | "bnpl";
  terms: {
    installments?: number;
    intervalDays?: number;
    downPayment?: number; // percentage
    interestRate?: number; // percentage
    fees?: number;
  };
  eligibility: {
    minAmount: number;
    maxAmount: number;
    minCreditScore?: number;
    allowedCountries: string[];
  };
  status: "active" | "inactive";
}

export interface PaymentDispute {
  id: string;
  transactionId: string;
  orderId: string;
  amount: number;
  reason: string;
  status: "open" | "under_review" | "won" | "lost" | "closed";
  evidence: {
    type: "document" | "image" | "communication";
    url: string;
    description: string;
  }[];
  timeline: {
    timestamp: Date;
    action: string;
    actor: string;
    notes?: string;
  }[];
  dueDate: Date;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface PaymentReconciliation {
  id: string;
  period: {
    start: Date;
    end: Date;
  };
  provider: PaymentProvider;
  summary: {
    totalTransactions: number;
    totalAmount: number;
    totalFees: number;
    totalRefunds: number;
    netAmount: number;
  };
  discrepancies: {
    type: "missing" | "duplicate" | "amount_mismatch";
    transactionId: string;
    expected: number;
    actual: number;
    difference: number;
  }[];
  status: "pending" | "in_progress" | "completed" | "issues_found";
  createdAt: Date;
  completedAt?: Date;
}

// Payment Processor
export class PaymentProcessor {
  private transactions: Map<string, PaymentTransaction> = new Map();
  private refunds: Map<string, Refund> = new Map();
  private disputes: Map<string, PaymentDispute> = new Map();
  
  // Process Payment
  async processPayment(data: {
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
    method: PaymentMethodType;
    provider: PaymentProvider;
    metadata: PaymentTransaction["metadata"];
  }): Promise<PaymentTransaction> {
    const transaction: PaymentTransaction = {
      id: `txn-${Date.now()}`,
      orderId: data.orderId,
      userId: data.userId,
      amount: data.amount,
      currency: data.currency,
      method: data.method,
      provider: data.provider,
      status: "pending",
      metadata: data.metadata,
      fees: this.calculateFees(data.amount, data.method, data.provider),
      timeline: [
        {
          timestamp: new Date(),
          type: "created",
          status: "pending",
          message: "Payment initiated",
        },
      ],
      createdAt: new Date(),
    };
    
    // Run fraud check
    transaction.fraudScore = await this.checkFraud(transaction);
    
    if (transaction.fraudScore > 80) {
      transaction.status = "failed";
      transaction.timeline.push({
        timestamp: new Date(),
        type: "fraud_detected",
        status: "failed",
        message: "High fraud risk detected",
      });
      this.transactions.set(transaction.id, transaction);
      return transaction;
    }
    
    // Process with provider
    transaction.status = "processing";
    transaction.timeline.push({
      timestamp: new Date(),
      type: "processing",
      status: "processing",
      message: "Processing with payment provider",
    });
    
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Authorize
    transaction.status = "authorized";
    transaction.timeline.push({
      timestamp: new Date(),
      type: "authorized",
      status: "authorized",
      message: "Payment authorized",
    });
    
    // Capture
    transaction.status = "captured";
    transaction.processedAt = new Date();
    transaction.timeline.push({
      timestamp: new Date(),
      type: "captured",
      status: "captured",
      message: "Payment captured",
    });
    
    this.transactions.set(transaction.id, transaction);
    return transaction;
  }
  
  private calculateFees(
    amount: number,
    method: PaymentMethodType,
    provider: PaymentProvider
  ): PaymentTransaction["fees"] {
    const feeRates = {
      credit_card: 0.029, // 2.9%
      debit_card: 0.019, // 1.9%
      pix: 0.0099, // 0.99%
      boleto: 3.5, // flat fee
      bank_transfer: 0.005, // 0.5%
      digital_wallet: 0.025, // 2.5%
      cryptocurrency: 0.01, // 1%
      bnpl: 0.04, // 4%
    };
    
    const rate = feeRates[method] || 0.029;
    const processing = method === "boleto" ? rate : amount * rate;
    const gateway = 0.3; // flat gateway fee
    
    return {
      processing: Math.round(processing * 100) / 100,
      gateway,
      total: Math.round((processing + gateway) * 100) / 100,
    };
  }
  
  private async checkFraud(transaction: PaymentTransaction): Promise<number> {
    // Mock fraud detection - in production, use service like Sift, Stripe Radar
    let score = 0;
    
    // Check amount
    if (transaction.amount > 10000) score += 20;
    
    // Check method
    if (transaction.method === "cryptocurrency") score += 10;
    
    // Random factor
    score += Math.random() * 30;
    
    return Math.min(score, 100);
  }
  
  // Refund Payment
  async refundPayment(
    transactionId: string,
    amount: number,
    reason: RefundReason,
    initiatedBy: string
  ): Promise<Refund> {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) throw new Error("Transaction not found");
    
    if (transaction.status !== "captured" && transaction.status !== "settled") {
      throw new Error("Transaction cannot be refunded");
    }
    
    const refund: Refund = {
      id: `ref-${Date.now()}`,
      transactionId,
      orderId: transaction.orderId,
      amount,
      reason,
      status: "pending",
      initiatedBy,
      createdAt: new Date(),
    };
    
    this.refunds.set(refund.id, refund);
    
    // Process refund
    refund.status = "processing";
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    refund.status = "completed";
    refund.processedAt = new Date();
    
    // Update transaction
    transaction.status = amount >= transaction.amount ? "refunded" : "partially_refunded";
    transaction.refundedAt = new Date();
    transaction.timeline.push({
      timestamp: new Date(),
      type: "refunded",
      status: transaction.status,
      message: `Refunded ${amount} ${transaction.currency}`,
    });
    
    this.transactions.set(transactionId, transaction);
    this.refunds.set(refund.id, refund);
    
    return refund;
  }
  
  // Handle Dispute
  createDispute(
    transactionId: string,
    reason: string,
    evidence: PaymentDispute["evidence"]
  ): PaymentDispute {
    const transaction = this.transactions.get(transactionId);
    if (!transaction) throw new Error("Transaction not found");
    
    const dispute: PaymentDispute = {
      id: `disp-${Date.now()}`,
      transactionId,
      orderId: transaction.orderId,
      amount: transaction.amount,
      reason,
      status: "open",
      evidence,
      timeline: [
        {
          timestamp: new Date(),
          action: "dispute_opened",
          actor: "customer",
          notes: reason,
        },
      ],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      createdAt: new Date(),
    };
    
    this.disputes.set(dispute.id, dispute);
    
    // Update transaction
    transaction.status = "disputed";
    transaction.timeline.push({
      timestamp: new Date(),
      type: "disputed",
      status: "disputed",
      message: "Payment disputed by customer",
    });
    
    this.transactions.set(transactionId, transaction);
    
    return dispute;
  }
  
  // Get Payment Analytics
  getAnalytics(period: { start: Date; end: Date }): PaymentAnalytics {
    const transactions = Array.from(this.transactions.values()).filter(
      (t) => t.createdAt >= period.start && t.createdAt <= period.end
    );
    
    const successful = transactions.filter(
      (t) => t.status === "captured" || t.status === "settled"
    );
    
    const failed = transactions.filter((t) => t.status === "failed");
    
    const totalAmount = successful.reduce((sum, t) => sum + t.amount, 0);
    const totalFees = successful.reduce((sum, t) => sum + t.fees.total, 0);
    
    const byMethod = new Map<PaymentMethodType, number>();
    successful.forEach((t) => {
      byMethod.set(t.method, (byMethod.get(t.method) || 0) + t.amount);
    });
    
    return {
      period,
      totalTransactions: transactions.length,
      successfulTransactions: successful.length,
      failedTransactions: failed.length,
      successRate: (successful.length / transactions.length) * 100,
      totalAmount,
      totalFees,
      netAmount: totalAmount - totalFees,
      avgTransactionValue: totalAmount / successful.length,
      byMethod: Object.fromEntries(byMethod),
      topCountries: this.getTopCountries(successful),
    };
  }
  
  private getTopCountries(transactions: PaymentTransaction[]): { country: string; amount: number }[] {
    // Mock implementation
    return [
      { country: "BR", amount: 12500000 },
      { country: "US", amount: 8500000 },
      { country: "MX", amount: 4500000 },
    ];
  }
}

export interface PaymentAnalytics {
  period: { start: Date; end: Date };
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  successRate: number;
  totalAmount: number;
  totalFees: number;
  netAmount: number;
  avgTransactionValue: number;
  byMethod: Record<string, number>;
  topCountries: { country: string; amount: number }[];
}

// Payment Gateway Integration
export interface PaymentGateway {
  provider: PaymentProvider;
  apiKey: string;
  apiSecret: string;
  webhookSecret: string;
  environment: "sandbox" | "production";
  features: {
    creditCard: boolean;
    debitCard: boolean;
    pix: boolean;
    boleto: boolean;
    recurringPayments: boolean;
    refunds: boolean;
    disputes: boolean;
  };
  limits: {
    minAmount: number;
    maxAmount: number;
    dailyLimit: number;
    monthlyLimit: number;
  };
}

// Sample Data
export function getPaymentSampleData(): {
  totalTransactions: number;
  successRate: number;
  avgTransactionValue: number;
  totalVolume: number;
  totalFees: number;
  refundRate: number;
  disputeRate: number;
} {
  return {
    totalTransactions: 285000,
    successRate: 97.5,
    avgTransactionValue: 185.5,
    totalVolume: 52867500,
    totalFees: 1585000,
    refundRate: 2.5,
    disputeRate: 0.5,
  };
}

// Payment Methods by Country
export function getPaymentMethodsByCountry(): {
  country: string;
  methods: {
    method: PaymentMethodType;
    usage: number; // percentage
  }[];
}[] {
  return [
    {
      country: "BR",
      methods: [
        { method: "credit_card", usage: 45 },
        { method: "pix", usage: 30 },
        { method: "boleto", usage: 15 },
        { method: "debit_card", usage: 10 },
      ],
    },
    {
      country: "US",
      methods: [
        { method: "credit_card", usage: 60 },
        { method: "digital_wallet", usage: 25 },
        { method: "debit_card", usage: 10 },
        { method: "bnpl", usage: 5 },
      ],
    },
  ];
}

// Fraud Detection Rules
export interface FraudRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: "low" | "medium" | "high" | "critical";
  conditions: {
    field: string;
    operator: "equals" | "not_equals" | "greater_than" | "less_than" | "contains";
    value: any;
  }[];
  action: "flag" | "review" | "block";
  score: number; // points to add to fraud score
}

export function getFraudRules(): FraudRule[] {
  return [
    {
      id: "rule-1",
      name: "High Value Transaction",
      description: "Transaction amount exceeds R$ 10,000",
      enabled: true,
      severity: "medium",
      conditions: [
        { field: "amount", operator: "greater_than", value: 10000 },
      ],
      action: "review",
      score: 20,
    },
    {
      id: "rule-2",
      name: "Multiple Failed Attempts",
      description: "More than 3 failed payment attempts in 1 hour",
      enabled: true,
      severity: "high",
      conditions: [
        { field: "failed_attempts", operator: "greater_than", value: 3 },
      ],
      action: "block",
      score: 40,
    },
    {
      id: "rule-3",
      name: "Suspicious Location",
      description: "Transaction from high-risk country",
      enabled: true,
      severity: "high",
      conditions: [
        { field: "country", operator: "equals", value: "high_risk" },
      ],
      action: "review",
      score: 35,
    },
  ];
}

// Payment Routing
export interface PaymentRoute {
  id: string;
  name: string;
  priority: number;
  conditions: {
    amount?: { min?: number; max?: number };
    method?: PaymentMethodType[];
    country?: string[];
    currency?: string[];
  };
  provider: PaymentProvider;
  fallback?: string; // route ID
  enabled: boolean;
}

export function getPaymentRoutes(): PaymentRoute[] {
  return [
    {
      id: "route-1",
      name: "Brazil PIX",
      priority: 1,
      conditions: {
        method: ["pix"],
        country: ["BR"],
        currency: ["BRL"],
      },
      provider: "pix_central_bank",
      enabled: true,
    },
    {
      id: "route-2",
      name: "Brazil Cards",
      priority: 2,
      conditions: {
        method: ["credit_card", "debit_card"],
        country: ["BR"],
        currency: ["BRL"],
      },
      provider: "cielo",
      fallback: "route-3",
      enabled: true,
    },
    {
      id: "route-3",
      name: "International Cards",
      priority: 3,
      conditions: {
        method: ["credit_card", "debit_card"],
      },
      provider: "stripe",
      enabled: true,
    },
  ];
}
