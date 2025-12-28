// Fraud Detection and Prevention System

export interface FraudCheck {
  id: string;
  orderId: string;
  userId: string;
  riskScore: number; // 0-100, higher is riskier
  riskLevel: "low" | "medium" | "high" | "critical";
  status: "pending" | "approved" | "rejected" | "under_review";
  flags: FraudFlag[];
  checks: FraudCheckResult[];
  recommendation: "approve" | "review" | "reject";
  reviewedBy?: string;
  reviewedAt?: Date;
  notes?: string;
  createdAt: Date;
}

export interface FraudFlag {
  type: string;
  severity: "low" | "medium" | "high";
  description: string;
  score: number;
}

export interface FraudCheckResult {
  checkType: string;
  passed: boolean;
  score: number;
  details: string;
}

export interface FraudRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
  conditions: {
    type: string;
    operator: "equals" | "greater_than" | "less_than" | "contains" | "matches";
    value: any;
  }[];
  action: "flag" | "block" | "review";
  severity: "low" | "medium" | "high";
  scoreImpact: number;
}

export interface BlacklistEntry {
  id: string;
  type: "email" | "ip" | "card" | "phone" | "address";
  value: string;
  reason: string;
  addedBy: string;
  addedAt: Date;
  expiresAt?: Date;
  permanent: boolean;
}

export interface VelocityCheck {
  userId?: string;
  email?: string;
  ip?: string;
  card?: string;
  timeWindow: number; // minutes
  orderCount: number;
  totalAmount: number;
  threshold: {
    maxOrders: number;
    maxAmount: number;
  };
  exceeded: boolean;
}

// Fraud detection rules
export const fraudRules: FraudRule[] = [
  {
    id: "rule-001",
    name: "High order value for new customer",
    description: "New customer with order value > R$ 1000",
    enabled: true,
    priority: 1,
    conditions: [
      { type: "customer_age_days", operator: "less_than", value: 7 },
      { type: "order_amount", operator: "greater_than", value: 1000 },
    ],
    action: "review",
    severity: "medium",
    scoreImpact: 25,
  },
  {
    id: "rule-002",
    name: "Mismatched billing and shipping",
    description: "Billing and shipping addresses in different states",
    enabled: true,
    priority: 2,
    conditions: [
      { type: "address_mismatch", operator: "equals", value: true },
    ],
    action: "flag",
    severity: "low",
    scoreImpact: 15,
  },
  {
    id: "rule-003",
    name: "Multiple failed payment attempts",
    description: "More than 3 failed payment attempts",
    enabled: true,
    priority: 1,
    conditions: [
      { type: "failed_payments", operator: "greater_than", value: 3 },
    ],
    action: "block",
    severity: "high",
    scoreImpact: 40,
  },
  {
    id: "rule-004",
    name: "VPN or proxy detected",
    description: "Order placed through VPN or proxy",
    enabled: true,
    priority: 2,
    conditions: [
      { type: "vpn_detected", operator: "equals", value: true },
    ],
    action: "flag",
    severity: "medium",
    scoreImpact: 20,
  },
  {
    id: "rule-005",
    name: "High velocity orders",
    description: "Multiple orders in short time period",
    enabled: true,
    priority: 1,
    conditions: [
      { type: "orders_per_hour", operator: "greater_than", value: 5 },
    ],
    action: "review",
    severity: "high",
    scoreImpact: 35,
  },
  {
    id: "rule-006",
    name: "Suspicious email pattern",
    description: "Email contains suspicious patterns",
    enabled: true,
    priority: 3,
    conditions: [
      { type: "email_pattern", operator: "matches", value: "suspicious" },
    ],
    action: "flag",
    severity: "low",
    scoreImpact: 10,
  },
];

// Blacklist
export const blacklist: BlacklistEntry[] = [];

// Mock fraud checks
export const fraudChecks: FraudCheck[] = [];

// Perform fraud check on order
export function performFraudCheck(orderData: {
  orderId: string;
  userId: string;
  userEmail: string;
  userIP: string;
  amount: number;
  billingAddress: any;
  shippingAddress: any;
  paymentMethod: string;
  customerAge: number; // days since registration
  previousOrders: number;
  failedPayments: number;
}): FraudCheck {
  const flags: FraudFlag[] = [];
  const checks: FraudCheckResult[] = [];
  let totalScore = 0;

  // Check blacklist
  const blacklistCheck = checkBlacklist(orderData.userEmail, orderData.userIP);
  checks.push(blacklistCheck);
  if (!blacklistCheck.passed) {
    flags.push({
      type: "blacklist",
      severity: "high",
      description: "Email or IP found in blacklist",
      score: 50,
    });
    totalScore += 50;
  }

  // Apply fraud rules
  for (const rule of fraudRules.filter((r) => r.enabled)) {
    let ruleMatches = true;

    for (const condition of rule.conditions) {
      const value = getOrderDataValue(orderData, condition.type);

      switch (condition.operator) {
        case "equals":
          if (value !== condition.value) ruleMatches = false;
          break;
        case "greater_than":
          if (value <= condition.value) ruleMatches = false;
          break;
        case "less_than":
          if (value >= condition.value) ruleMatches = false;
          break;
        case "contains":
          if (!String(value).includes(condition.value)) ruleMatches = false;
          break;
        case "matches":
          // Pattern matching logic
          break;
      }
    }

    if (ruleMatches) {
      flags.push({
        type: rule.name,
        severity: rule.severity,
        description: rule.description,
        score: rule.scoreImpact,
      });
      totalScore += rule.scoreImpact;

      checks.push({
        checkType: rule.name,
        passed: false,
        score: rule.scoreImpact,
        details: rule.description,
      });
    }
  }

  // Velocity check
  const velocityCheck = checkVelocity(orderData.userEmail, orderData.userIP);
  checks.push({
    checkType: "Velocity Check",
    passed: !velocityCheck.exceeded,
    score: velocityCheck.exceeded ? 30 : 0,
    details: `${velocityCheck.orderCount} orders in ${velocityCheck.timeWindow} minutes`,
  });

  if (velocityCheck.exceeded) {
    flags.push({
      type: "high_velocity",
      severity: "high",
      description: "Too many orders in short time",
      score: 30,
    });
    totalScore += 30;
  }

  // Device fingerprint check (mock)
  const deviceCheck = checkDeviceFingerprint(orderData.userId);
  checks.push(deviceCheck);
  if (!deviceCheck.passed) {
    flags.push({
      type: "device_mismatch",
      severity: "medium",
      description: "Device fingerprint mismatch",
      score: 20,
    });
    totalScore += 20;
  }

  // Geolocation check
  const geoCheck = checkGeolocation(orderData.userIP, orderData.shippingAddress);
  checks.push(geoCheck);
  if (!geoCheck.passed) {
    flags.push({
      type: "geo_mismatch",
      severity: "medium",
      description: "IP location doesn't match shipping address",
      score: 15,
    });
    totalScore += 15;
  }

  // Email verification
  const emailCheck = checkEmailValidity(orderData.userEmail);
  checks.push(emailCheck);
  if (!emailCheck.passed) {
    flags.push({
      type: "invalid_email",
      severity: "low",
      description: "Email appears invalid or disposable",
      score: 10,
    });
    totalScore += 10;
  }

  // Determine risk level
  let riskLevel: FraudCheck["riskLevel"];
  let recommendation: FraudCheck["recommendation"];

  if (totalScore >= 70) {
    riskLevel = "critical";
    recommendation = "reject";
  } else if (totalScore >= 50) {
    riskLevel = "high";
    recommendation = "review";
  } else if (totalScore >= 30) {
    riskLevel = "medium";
    recommendation = "review";
  } else {
    riskLevel = "low";
    recommendation = "approve";
  }

  const fraudCheck: FraudCheck = {
    id: `fraud-${Date.now()}`,
    orderId: orderData.orderId,
    userId: orderData.userId,
    riskScore: Math.min(100, totalScore),
    riskLevel,
    status: recommendation === "approve" ? "approved" : "pending",
    flags,
    checks,
    recommendation,
    createdAt: new Date(),
  };

  fraudChecks.push(fraudCheck);

  return fraudCheck;
}

// Helper function to get order data value
function getOrderDataValue(orderData: any, type: string): any {
  const mapping: Record<string, any> = {
    customer_age_days: orderData.customerAge,
    order_amount: orderData.amount,
    address_mismatch:
      orderData.billingAddress?.state !== orderData.shippingAddress?.state,
    failed_payments: orderData.failedPayments,
    vpn_detected: false, // Mock - integrate with VPN detection service
    orders_per_hour: 1, // Mock - calculate from recent orders
    email_pattern: "normal", // Mock - analyze email pattern
  };

  return mapping[type];
}

// Check blacklist
function checkBlacklist(email: string, ip: string): FraudCheckResult {
  const found = blacklist.some(
    (entry) =>
      (entry.type === "email" && entry.value === email) ||
      (entry.type === "ip" && entry.value === ip)
  );

  return {
    checkType: "Blacklist Check",
    passed: !found,
    score: found ? 50 : 0,
    details: found ? "Found in blacklist" : "Not in blacklist",
  };
}

// Check velocity (rate limiting)
function checkVelocity(email: string, ip: string): VelocityCheck {
  // Mock - in production, check recent orders from database
  const recentOrders = fraudChecks.filter(
    (fc) =>
      fc.createdAt.getTime() > Date.now() - 60 * 60 * 1000 // Last hour
  );

  const orderCount = recentOrders.length;
  const totalAmount = orderCount * 100; // Mock

  const threshold = {
    maxOrders: 5,
    maxAmount: 2000,
  };

  return {
    email,
    ip,
    timeWindow: 60,
    orderCount,
    totalAmount,
    threshold,
    exceeded: orderCount > threshold.maxOrders || totalAmount > threshold.maxAmount,
  };
}

// Check device fingerprint
function checkDeviceFingerprint(userId: string): FraudCheckResult {
  // Mock - in production, use device fingerprinting service
  const trusted = Math.random() > 0.1; // 90% trusted

  return {
    checkType: "Device Fingerprint",
    passed: trusted,
    score: trusted ? 0 : 20,
    details: trusted ? "Recognized device" : "Unknown or suspicious device",
  };
}

// Check geolocation
function checkGeolocation(ip: string, shippingAddress: any): FraudCheckResult {
  // Mock - in production, use IP geolocation service
  const matches = Math.random() > 0.2; // 80% match

  return {
    checkType: "Geolocation Check",
    passed: matches,
    score: matches ? 0 : 15,
    details: matches
      ? "IP location matches shipping address"
      : "IP location mismatch",
  };
}

// Check email validity
function checkEmailValidity(email: string): FraudCheckResult {
  // Check for disposable email domains
  const disposableDomains = [
    "tempmail.com",
    "guerrillamail.com",
    "10minutemail.com",
    "mailinator.com",
  ];

  const domain = email.split("@")[1];
  const isDisposable = disposableDomains.includes(domain);

  // Check email pattern
  const suspiciousPatterns = [
    /^[a-z]{20,}@/, // Very long random string
    /\d{10,}@/, // Many consecutive numbers
    /^test.*@/, // Test emails
  ];

  const isSuspicious = suspiciousPatterns.some((pattern) => pattern.test(email));

  const passed = !isDisposable && !isSuspicious;

  return {
    checkType: "Email Validity",
    passed,
    score: passed ? 0 : 10,
    details: isDisposable
      ? "Disposable email detected"
      : isSuspicious
      ? "Suspicious email pattern"
      : "Valid email",
  };
}

// Add to blacklist
export function addToBlacklist(data: {
  type: BlacklistEntry["type"];
  value: string;
  reason: string;
  addedBy: string;
  permanent?: boolean;
  expiresInDays?: number;
}): BlacklistEntry {
  const entry: BlacklistEntry = {
    id: `bl-${Date.now()}`,
    type: data.type,
    value: data.value,
    reason: data.reason,
    addedBy: data.addedBy,
    addedAt: new Date(),
    permanent: data.permanent ?? false,
  };

  if (!data.permanent && data.expiresInDays) {
    entry.expiresAt = new Date(
      Date.now() + data.expiresInDays * 24 * 60 * 60 * 1000
    );
  }

  blacklist.push(entry);

  return entry;
}

// Remove from blacklist
export function removeFromBlacklist(entryId: string): boolean {
  const index = blacklist.findIndex((e) => e.id === entryId);
  if (index === -1) return false;

  blacklist.splice(index, 1);
  return true;
}

// Review fraud check
export function reviewFraudCheck(
  fraudCheckId: string,
  decision: "approve" | "reject",
  reviewedBy: string,
  notes?: string
): boolean {
  const check = fraudChecks.find((fc) => fc.id === fraudCheckId);
  if (!check || check.status !== "pending") return false;

  check.status = decision === "approve" ? "approved" : "rejected";
  check.reviewedBy = reviewedBy;
  check.reviewedAt = new Date();
  check.notes = notes;

  return true;
}

// Get fraud checks by status
export function getFraudChecksByStatus(
  status: FraudCheck["status"]
): FraudCheck[] {
  return fraudChecks.filter((fc) => fc.status === status);
}

// Get high-risk orders
export function getHighRiskOrders(): FraudCheck[] {
  return fraudChecks.filter(
    (fc) => fc.riskLevel === "high" || fc.riskLevel === "critical"
  );
}

// Fraud analytics
export interface FraudAnalytics {
  totalChecks: number;
  approvedOrders: number;
  rejectedOrders: number;
  underReview: number;
  averageRiskScore: number;
  falsePositiveRate: number;
  byRiskLevel: {
    level: string;
    count: number;
    percentage: number;
  }[];
  topFlags: {
    type: string;
    count: number;
  }[];
  preventedFraud: {
    count: number;
    amount: number;
  };
}

export function getFraudAnalytics(): FraudAnalytics {
  const totalChecks = fraudChecks.length;
  const approvedOrders = fraudChecks.filter((fc) => fc.status === "approved")
    .length;
  const rejectedOrders = fraudChecks.filter((fc) => fc.status === "rejected")
    .length;
  const underReview = fraudChecks.filter((fc) => fc.status === "pending").length;

  const averageRiskScore =
    fraudChecks.reduce((sum, fc) => sum + fc.riskScore, 0) /
    Math.max(1, totalChecks);

  const riskLevels = ["low", "medium", "high", "critical"];
  const byRiskLevel = riskLevels.map((level) => {
    const count = fraudChecks.filter((fc) => fc.riskLevel === level).length;
    return {
      level,
      count,
      percentage: (count / Math.max(1, totalChecks)) * 100,
    };
  });

  // Count flag occurrences
  const flagCounts: Record<string, number> = {};
  for (const check of fraudChecks) {
    for (const flag of check.flags) {
      flagCounts[flag.type] = (flagCounts[flag.type] || 0) + 1;
    }
  }

  const topFlags = Object.entries(flagCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalChecks,
    approvedOrders,
    rejectedOrders,
    underReview,
    averageRiskScore: Math.round(averageRiskScore),
    falsePositiveRate: 2.5, // Mock - calculate from manual reviews
    byRiskLevel,
    topFlags,
    preventedFraud: {
      count: rejectedOrders,
      amount: rejectedOrders * 150, // Mock average fraud amount
    },
  };
}

// Machine learning fraud score (mock)
export function calculateMLFraudScore(orderData: any): number {
  // Mock ML model - in production, use trained model
  const features = [
    orderData.amount / 1000,
    orderData.customerAge / 365,
    orderData.previousOrders,
    orderData.failedPayments * 10,
  ];

  // Simple weighted sum (mock)
  const weights = [0.3, -0.2, -0.1, 0.4];
  let score = 50; // Base score

  for (let i = 0; i < features.length; i++) {
    score += features[i] * weights[i];
  }

  return Math.max(0, Math.min(100, score));
}

// 3D Secure verification
export interface ThreeDSecureVerification {
  orderId: string;
  status: "pending" | "verified" | "failed" | "not_supported";
  verificationUrl?: string;
  verified: boolean;
  liabilityShift: boolean;
  verifiedAt?: Date;
}

export function initiate3DSecure(
  orderId: string,
  amount: number,
  cardNumber: string
): ThreeDSecureVerification {
  // Mock - in production, integrate with payment gateway's 3DS
  const verification: ThreeDSecureVerification = {
    orderId,
    status: "pending",
    verificationUrl: `/3ds/verify/${orderId}`,
    verified: false,
    liabilityShift: false,
  };

  return verification;
}

// Chargeback management
export interface Chargeback {
  id: string;
  orderId: string;
  amount: number;
  reason: string;
  status: "received" | "under_review" | "accepted" | "disputed" | "won" | "lost";
  receivedAt: Date;
  dueDate: Date;
  evidence?: {
    type: string;
    description: string;
    fileUrl: string;
  }[];
  outcome?: "won" | "lost";
  resolvedAt?: Date;
}

export const chargebacks: Chargeback[] = [];

export function createChargeback(data: {
  orderId: string;
  amount: number;
  reason: string;
}): Chargeback {
  const chargeback: Chargeback = {
    id: `cb-${Date.now()}`,
    orderId: data.orderId,
    amount: data.amount,
    reason: data.reason,
    status: "received",
    receivedAt: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days to respond
  };

  chargebacks.push(chargeback);

  return chargeback;
}

export function submitChargebackEvidence(
  chargebackId: string,
  evidence: Chargeback["evidence"]
): boolean {
  const chargeback = chargebacks.find((cb) => cb.id === chargebackId);
  if (!chargeback || chargeback.status !== "received") return false;

  chargeback.evidence = evidence;
  chargeback.status = "under_review";

  return true;
}

// Fraud prevention tips for customers
export const fraudPreventionTips = [
  "Nunca compartilhe sua senha ou dados de pagamento",
  "Verifique se o site tem certificado SSL (https://)",
  "Use senhas fortes e únicas para cada conta",
  "Ative a autenticação de dois fatores quando disponível",
  "Monitore regularmente suas transações",
  "Desconfie de ofertas boas demais para ser verdade",
  "Não clique em links suspeitos em emails",
  "Mantenha seu antivírus atualizado",
];
