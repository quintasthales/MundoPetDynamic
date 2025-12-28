// Payment Optimization and Multiple Payment Methods System

export interface PaymentMethod {
  id: string;
  type:
    | "credit_card"
    | "debit_card"
    | "pix"
    | "boleto"
    | "paypal"
    | "mercado_pago"
    | "pagseguro"
    | "bank_transfer"
    | "wallet"
    | "bnpl"; // Buy Now Pay Later
  name: string;
  provider: string;
  enabled: boolean;
  priority: number;
  fees: {
    fixed: number;
    percentage: number;
  };
  processingTime: {
    min: number; // minutes
    max: number;
  };
  supportedCurrencies: string[];
  minAmount?: number;
  maxAmount?: number;
  installments?: {
    enabled: boolean;
    maxInstallments: number;
    minInstallmentAmount: number;
    interestRate?: number;
    interestFreeInstallments?: number;
  };
  configuration: Record<string, any>;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethodId: string;
  paymentMethod: string;
  provider: string;
  status:
    | "pending"
    | "processing"
    | "authorized"
    | "captured"
    | "completed"
    | "failed"
    | "cancelled"
    | "refunded";
  installments?: number;
  installmentAmount?: number;
  fees: {
    fixed: number;
    percentage: number;
    total: number;
  };
  netAmount: number; // Amount after fees
  providerTransactionId?: string;
  providerResponse?: any;
  authorizationCode?: string;
  capturedAt?: Date;
  failureReason?: string;
  refundedAmount?: number;
  refundedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentOptimization {
  orderId: string;
  amount: number;
  recommendedMethod: string;
  alternatives: {
    methodId: string;
    methodName: string;
    totalCost: number;
    fees: number;
    netAmount: number;
    score: number;
    reasons: string[];
  }[];
  savings: {
    amount: number;
    percentage: number;
  };
}

export interface InstallmentPlan {
  installments: number;
  installmentAmount: number;
  totalAmount: number;
  interestRate: number;
  interestAmount: number;
  firstDueDate: Date;
  lastDueDate: Date;
}

export interface PaymentRetry {
  id: string;
  transactionId: string;
  orderId: string;
  attempt: number;
  maxAttempts: number;
  nextRetryAt: Date;
  status: "scheduled" | "retrying" | "success" | "failed" | "cancelled";
  lastError?: string;
  createdAt: Date;
}

// Payment methods configuration
export const paymentMethods: PaymentMethod[] = [
  {
    id: "pm-001",
    type: "pix",
    name: "PIX",
    provider: "PagSeguro",
    enabled: true,
    priority: 1,
    fees: {
      fixed: 0,
      percentage: 0.99,
    },
    processingTime: {
      min: 0,
      max: 5,
    },
    supportedCurrencies: ["BRL"],
    minAmount: 1,
    maxAmount: 50000,
    configuration: {
      apiKey: process.env.PAGSEGURO_API_KEY,
      environment: "production",
    },
  },
  {
    id: "pm-002",
    type: "credit_card",
    name: "Cartão de Crédito",
    provider: "PagSeguro",
    enabled: true,
    priority: 2,
    fees: {
      fixed: 0.39,
      percentage: 3.99,
    },
    processingTime: {
      min: 1,
      max: 10,
    },
    supportedCurrencies: ["BRL", "USD"],
    minAmount: 5,
    maxAmount: 100000,
    installments: {
      enabled: true,
      maxInstallments: 12,
      minInstallmentAmount: 30,
      interestRate: 1.99,
      interestFreeInstallments: 3,
    },
    configuration: {
      apiKey: process.env.PAGSEGURO_API_KEY,
      acceptedBrands: ["visa", "mastercard", "elo", "amex", "hipercard"],
    },
  },
  {
    id: "pm-003",
    type: "boleto",
    name: "Boleto Bancário",
    provider: "PagSeguro",
    enabled: true,
    priority: 3,
    fees: {
      fixed: 3.49,
      percentage: 0,
    },
    processingTime: {
      min: 1440, // 1 day
      max: 4320, // 3 days
    },
    supportedCurrencies: ["BRL"],
    minAmount: 5,
    maxAmount: 50000,
    configuration: {
      apiKey: process.env.PAGSEGURO_API_KEY,
      expirationDays: 3,
    },
  },
  {
    id: "pm-004",
    type: "bnpl",
    name: "Compre Agora, Pague Depois",
    provider: "Mercado Pago",
    enabled: true,
    priority: 4,
    fees: {
      fixed: 0,
      percentage: 5.99,
    },
    processingTime: {
      min: 1,
      max: 5,
    },
    supportedCurrencies: ["BRL"],
    minAmount: 100,
    maxAmount: 10000,
    installments: {
      enabled: true,
      maxInstallments: 4,
      minInstallmentAmount: 50,
      interestRate: 0,
      interestFreeInstallments: 4,
    },
    configuration: {
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    },
  },
];

// Mock transactions
export const paymentTransactions: PaymentTransaction[] = [];

// Calculate payment optimization
export function calculatePaymentOptimization(
  amount: number,
  orderId: string
): PaymentOptimization {
  const alternatives = paymentMethods
    .filter((pm) => pm.enabled)
    .filter((pm) => !pm.minAmount || amount >= pm.minAmount)
    .filter((pm) => !pm.maxAmount || amount <= pm.maxAmount)
    .map((pm) => {
      const fixedFee = pm.fees.fixed;
      const percentageFee = (amount * pm.fees.percentage) / 100;
      const totalFees = fixedFee + percentageFee;
      const netAmount = amount - totalFees;

      // Calculate score based on multiple factors
      let score = 100;

      // Lower fees = higher score
      const feePercentage = (totalFees / amount) * 100;
      score -= feePercentage * 10;

      // Faster processing = higher score
      score -= pm.processingTime.max / 100;

      // Higher priority = higher score
      score += (10 - pm.priority) * 2;

      const reasons: string[] = [];

      if (pm.fees.percentage < 2) {
        reasons.push("Taxas baixas");
      }

      if (pm.processingTime.max < 60) {
        reasons.push("Processamento instantâneo");
      }

      if (pm.installments?.enabled) {
        reasons.push(
          `Parcele em até ${pm.installments.maxInstallments}x sem juros`
        );
      }

      if (pm.type === "pix") {
        reasons.push("Mais rápido e econômico");
      }

      return {
        methodId: pm.id,
        methodName: pm.name,
        totalCost: totalFees,
        fees: totalFees,
        netAmount,
        score: Math.max(0, Math.min(100, score)),
        reasons,
      };
    })
    .sort((a, b) => b.score - a.score);

  const recommended = alternatives[0];
  const cheapest = alternatives.reduce((min, alt) =>
    alt.fees < min.fees ? alt : min
  );

  const savings = {
    amount: recommended.fees - cheapest.fees,
    percentage: ((recommended.fees - cheapest.fees) / recommended.fees) * 100,
  };

  return {
    orderId,
    amount,
    recommendedMethod: recommended.methodName,
    alternatives,
    savings,
  };
}

// Calculate installment plans
export function calculateInstallmentPlans(
  amount: number,
  paymentMethodId: string
): InstallmentPlan[] {
  const method = paymentMethods.find((pm) => pm.id === paymentMethodId);

  if (!method || !method.installments?.enabled) {
    return [];
  }

  const plans: InstallmentPlan[] = [];
  const maxInstallments = method.installments.maxInstallments;
  const minInstallmentAmount = method.installments.minInstallmentAmount;
  const interestRate = method.installments.interestRate || 0;
  const interestFreeInstallments =
    method.installments.interestFreeInstallments || 0;

  for (let i = 1; i <= maxInstallments; i++) {
    const installmentAmount = amount / i;

    if (installmentAmount < minInstallmentAmount) {
      break;
    }

    let totalAmount = amount;
    let interestAmount = 0;

    if (i > interestFreeInstallments && interestRate > 0) {
      // Calculate compound interest
      const rate = interestRate / 100;
      totalAmount = amount * Math.pow(1 + rate, i);
      interestAmount = totalAmount - amount;
    }

    const firstDueDate = new Date();
    firstDueDate.setDate(firstDueDate.getDate() + 30);

    const lastDueDate = new Date(firstDueDate);
    lastDueDate.setMonth(lastDueDate.getMonth() + i - 1);

    plans.push({
      installments: i,
      installmentAmount: totalAmount / i,
      totalAmount,
      interestRate: i > interestFreeInstallments ? interestRate : 0,
      interestAmount,
      firstDueDate,
      lastDueDate,
    });
  }

  return plans;
}

// Create payment transaction
export function createPaymentTransaction(data: {
  orderId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethodId: string;
  installments?: number;
  metadata?: Record<string, any>;
}): PaymentTransaction {
  const method = paymentMethods.find((pm) => pm.id === data.paymentMethodId);

  if (!method) {
    throw new Error("Payment method not found");
  }

  const fixedFee = method.fees.fixed;
  const percentageFee = (data.amount * method.fees.percentage) / 100;
  const totalFees = fixedFee + percentageFee;
  const netAmount = data.amount - totalFees;

  let installmentAmount: number | undefined;

  if (data.installments && method.installments?.enabled) {
    const plans = calculateInstallmentPlans(data.amount, data.paymentMethodId);
    const plan = plans.find((p) => p.installments === data.installments);
    if (plan) {
      installmentAmount = plan.installmentAmount;
    }
  }

  const transaction: PaymentTransaction = {
    id: `txn-${Date.now()}`,
    orderId: data.orderId,
    userId: data.userId,
    amount: data.amount,
    currency: data.currency,
    paymentMethodId: data.paymentMethodId,
    paymentMethod: method.name,
    provider: method.provider,
    status: "pending",
    installments: data.installments,
    installmentAmount,
    fees: {
      fixed: fixedFee,
      percentage: percentageFee,
      total: totalFees,
    },
    netAmount,
    metadata: data.metadata,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  paymentTransactions.push(transaction);

  return transaction;
}

// Process payment
export async function processPayment(
  transactionId: string,
  paymentData: any
): Promise<PaymentTransaction> {
  const transaction = paymentTransactions.find((t) => t.id === transactionId);

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  transaction.status = "processing";
  transaction.updatedAt = new Date();

  try {
    // In production, integrate with payment gateway API
    const method = paymentMethods.find(
      (pm) => pm.id === transaction.paymentMethodId
    );

    if (!method) {
      throw new Error("Payment method not found");
    }

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock success (90% success rate)
    const success = Math.random() > 0.1;

    if (success) {
      transaction.status = "authorized";
      transaction.providerTransactionId = `${method.provider.toUpperCase()}-${Date.now()}`;
      transaction.authorizationCode = `AUTH-${Math.random()
        .toString(36)
        .substring(2, 10)
        .toUpperCase()}`;

      // Auto-capture for instant payment methods
      if (method.type === "pix" || method.type === "wallet") {
        transaction.status = "captured";
        transaction.capturedAt = new Date();
      }
    } else {
      transaction.status = "failed";
      transaction.failureReason = "Pagamento recusado pelo banco";
    }
  } catch (error: any) {
    transaction.status = "failed";
    transaction.failureReason = error.message;
  }

  transaction.updatedAt = new Date();

  return transaction;
}

// Capture authorized payment
export function capturePayment(transactionId: string): boolean {
  const transaction = paymentTransactions.find((t) => t.id === transactionId);

  if (!transaction || transaction.status !== "authorized") {
    return false;
  }

  transaction.status = "captured";
  transaction.capturedAt = new Date();
  transaction.updatedAt = new Date();

  // In production, call payment gateway capture API
  return true;
}

// Refund payment
export function refundPayment(
  transactionId: string,
  amount?: number,
  reason?: string
): boolean {
  const transaction = paymentTransactions.find((t) => t.id === transactionId);

  if (
    !transaction ||
    (transaction.status !== "captured" && transaction.status !== "completed")
  ) {
    return false;
  }

  const refundAmount = amount || transaction.amount;

  if (refundAmount > transaction.amount) {
    return false;
  }

  transaction.status = "refunded";
  transaction.refundedAmount = refundAmount;
  transaction.refundedAt = new Date();
  transaction.updatedAt = new Date();

  if (reason) {
    transaction.metadata = {
      ...transaction.metadata,
      refundReason: reason,
    };
  }

  // In production, call payment gateway refund API
  return true;
}

// Payment retry logic
export const paymentRetries: PaymentRetry[] = [];

export function schedulePaymentRetry(
  transactionId: string,
  maxAttempts: number = 3
): PaymentRetry {
  const retry: PaymentRetry = {
    id: `retry-${Date.now()}`,
    transactionId,
    orderId: paymentTransactions.find((t) => t.id === transactionId)?.orderId || "",
    attempt: 1,
    maxAttempts,
    nextRetryAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
    status: "scheduled",
    createdAt: new Date(),
  };

  paymentRetries.push(retry);

  return retry;
}

export async function executePaymentRetry(retryId: string): Promise<boolean> {
  const retry = paymentRetries.find((r) => r.id === retryId);

  if (!retry || retry.status !== "scheduled") {
    return false;
  }

  retry.status = "retrying";

  try {
    const transaction = paymentTransactions.find(
      (t) => t.id === retry.transactionId
    );

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    // Retry payment
    await processPayment(retry.transactionId, {});

    if (transaction.status === "captured" || transaction.status === "authorized") {
      retry.status = "success";
      return true;
    } else {
      throw new Error(transaction.failureReason || "Payment failed");
    }
  } catch (error: any) {
    retry.lastError = error.message;
    retry.attempt++;

    if (retry.attempt >= retry.maxAttempts) {
      retry.status = "failed";
    } else {
      retry.status = "scheduled";
      // Exponential backoff
      const delayMinutes = Math.pow(2, retry.attempt) * 60;
      retry.nextRetryAt = new Date(Date.now() + delayMinutes * 60 * 1000);
    }

    return false;
  }
}

// Payment analytics
export interface PaymentAnalytics {
  totalTransactions: number;
  successRate: number;
  totalVolume: number;
  totalFees: number;
  netRevenue: number;
  byMethod: {
    method: string;
    count: number;
    volume: number;
    fees: number;
    successRate: number;
  }[];
  byStatus: {
    status: string;
    count: number;
    percentage: number;
  }[];
  averageTransactionValue: number;
  installmentUsage: {
    count: number;
    percentage: number;
    averageInstallments: number;
  };
}

export function getPaymentAnalytics(): PaymentAnalytics {
  const totalTransactions = paymentTransactions.length;
  const successfulTransactions = paymentTransactions.filter(
    (t) => t.status === "captured" || t.status === "completed"
  ).length;

  const totalVolume = paymentTransactions.reduce((sum, t) => sum + t.amount, 0);
  const totalFees = paymentTransactions.reduce(
    (sum, t) => sum + t.fees.total,
    0
  );
  const netRevenue = totalVolume - totalFees;

  // By method
  const methodStats = new Map<string, any>();
  for (const transaction of paymentTransactions) {
    const key = transaction.paymentMethod;
    if (!methodStats.has(key)) {
      methodStats.set(key, {
        method: key,
        count: 0,
        volume: 0,
        fees: 0,
        successful: 0,
      });
    }

    const stats = methodStats.get(key);
    stats.count++;
    stats.volume += transaction.amount;
    stats.fees += transaction.fees.total;

    if (
      transaction.status === "captured" ||
      transaction.status === "completed"
    ) {
      stats.successful++;
    }
  }

  const byMethod = Array.from(methodStats.values()).map((stats) => ({
    method: stats.method,
    count: stats.count,
    volume: stats.volume,
    fees: stats.fees,
    successRate: (stats.successful / stats.count) * 100,
  }));

  // By status
  const statusCounts = new Map<string, number>();
  for (const transaction of paymentTransactions) {
    statusCounts.set(
      transaction.status,
      (statusCounts.get(transaction.status) || 0) + 1
    );
  }

  const byStatus = Array.from(statusCounts.entries()).map(([status, count]) => ({
    status,
    count,
    percentage: (count / totalTransactions) * 100,
  }));

  // Installment usage
  const installmentTransactions = paymentTransactions.filter(
    (t) => t.installments && t.installments > 1
  );
  const totalInstallments = installmentTransactions.reduce(
    (sum, t) => sum + (t.installments || 0),
    0
  );

  return {
    totalTransactions,
    successRate: (successfulTransactions / Math.max(1, totalTransactions)) * 100,
    totalVolume,
    totalFees,
    netRevenue,
    byMethod,
    byStatus,
    averageTransactionValue: totalVolume / Math.max(1, totalTransactions),
    installmentUsage: {
      count: installmentTransactions.length,
      percentage:
        (installmentTransactions.length / Math.max(1, totalTransactions)) * 100,
      averageInstallments:
        totalInstallments / Math.max(1, installmentTransactions.length),
    },
  };
}

// Payment gateway health check
export interface PaymentGatewayHealth {
  provider: string;
  status: "operational" | "degraded" | "down";
  responseTime: number; // ms
  successRate: number;
  lastChecked: Date;
}

export async function checkPaymentGatewayHealth(
  provider: string
): Promise<PaymentGatewayHealth> {
  const startTime = Date.now();

  try {
    // In production, ping payment gateway API
    await new Promise((resolve) => setTimeout(resolve, 100));

    const responseTime = Date.now() - startTime;

    // Mock success rate
    const successRate = 98.5;

    let status: PaymentGatewayHealth["status"] = "operational";
    if (successRate < 95) status = "degraded";
    if (successRate < 90) status = "down";

    return {
      provider,
      status,
      responseTime,
      successRate,
      lastChecked: new Date(),
    };
  } catch (error) {
    return {
      provider,
      status: "down",
      responseTime: Date.now() - startTime,
      successRate: 0,
      lastChecked: new Date(),
    };
  }
}

// Smart payment routing
export function routePayment(
  amount: number,
  userPreference?: string
): PaymentMethod {
  const availableMethods = paymentMethods.filter((pm) => {
    if (!pm.enabled) return false;
    if (pm.minAmount && amount < pm.minAmount) return false;
    if (pm.maxAmount && amount > pm.maxAmount) return false;
    return true;
  });

  // If user has preference, use it
  if (userPreference) {
    const preferred = availableMethods.find((pm) => pm.id === userPreference);
    if (preferred) return preferred;
  }

  // Otherwise, use optimization
  const optimization = calculatePaymentOptimization(amount, "temp");
  const recommended = availableMethods.find(
    (pm) => pm.name === optimization.recommendedMethod
  );

  return recommended || availableMethods[0];
}
