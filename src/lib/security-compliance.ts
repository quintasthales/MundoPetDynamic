// Advanced Security and Compliance System

export interface SecurityConfig {
  encryption: {
    algorithm: string;
    keySize: number;
    enabled: boolean;
  };
  authentication: {
    mfa: boolean;
    passwordPolicy: PasswordPolicy;
    sessionTimeout: number; // minutes
    maxLoginAttempts: number;
    lockoutDuration: number; // minutes
  };
  authorization: {
    rbac: boolean; // Role-Based Access Control
    permissions: string[];
  };
  dataProtection: {
    pii: boolean; // Personally Identifiable Information
    encryption: boolean;
    anonymization: boolean;
    rightToErasure: boolean; // LGPD/GDPR
  };
  compliance: {
    lgpd: boolean; // Brazilian General Data Protection Law
    gdpr: boolean; // European GDPR
    pciDss: boolean; // Payment Card Industry Data Security Standard
    iso27001: boolean;
  };
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  preventReuse: number; // last N passwords
  expirationDays: number;
  preventCommonPasswords: boolean;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: Date;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  action: string;
  resource: string;
  result: "success" | "failure" | "blocked";
  severity: "low" | "medium" | "high" | "critical";
  details: any;
  geolocation?: {
    country: string;
    city: string;
    coordinates: { lat: number; lng: number };
  };
}

export interface ThreatDetection {
  id: string;
  type: "brute_force" | "sql_injection" | "xss" | "csrf" | "ddos" | "account_takeover" | "data_breach";
  severity: "low" | "medium" | "high" | "critical";
  detected: Date;
  source: {
    ipAddress: string;
    country: string;
    isp: string;
  };
  target: {
    endpoint: string;
    userId?: string;
  };
  status: "detected" | "investigating" | "mitigated" | "resolved";
  actions: {
    timestamp: Date;
    action: string;
    result: string;
  }[];
}

export interface DataPrivacy {
  userId: string;
  consents: {
    type: "marketing" | "analytics" | "personalization" | "third_party";
    granted: boolean;
    timestamp: Date;
    ipAddress: string;
    version: string; // policy version
  }[];
  dataRequests: {
    id: string;
    type: "access" | "rectification" | "erasure" | "portability" | "restriction";
    status: "pending" | "processing" | "completed" | "rejected";
    requestedAt: Date;
    completedAt?: Date;
    reason?: string;
  }[];
  dataRetention: {
    category: string;
    retentionPeriod: number; // days
    lastReview: Date;
    scheduledDeletion?: Date;
  }[];
}

export interface ComplianceReport {
  period: {
    start: Date;
    end: Date;
  };
  lgpd: {
    compliant: boolean;
    dataProcessingActivities: number;
    consentsCollected: number;
    dataSubjectRequests: number;
    dataBreaches: number;
    dpoContacts: string;
  };
  pciDss: {
    compliant: boolean;
    level: 1 | 2 | 3 | 4;
    lastAudit: Date;
    nextAudit: Date;
    requirements: {
      requirement: string;
      status: "compliant" | "non_compliant" | "not_applicable";
    }[];
  };
  securityMetrics: {
    totalIncidents: number;
    criticalIncidents: number;
    meanTimeToDetect: number; // minutes
    meanTimeToResolve: number; // minutes
    falsePositives: number;
    blockedAttacks: number;
  };
}

// Password validation
export function validatePassword(password: string, policy: PasswordPolicy): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < policy.minLength) {
    errors.push(`Senha deve ter no mínimo ${policy.minLength} caracteres`);
  }

  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Senha deve conter pelo menos uma letra maiúscula");
  }

  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Senha deve conter pelo menos uma letra minúscula");
  }

  if (policy.requireNumbers && !/[0-9]/.test(password)) {
    errors.push("Senha deve conter pelo menos um número");
  }

  if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("Senha deve conter pelo menos um caractere especial");
  }

  if (policy.preventCommonPasswords) {
    const commonPasswords = ["123456", "password", "12345678", "qwerty", "abc123"];
    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push("Senha muito comum, escolha uma senha mais forte");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Security audit logging
export function logSecurityEvent(event: Omit<SecurityAuditLog, "id">): SecurityAuditLog {
  const log: SecurityAuditLog = {
    id: `audit-${Date.now()}`,
    ...event,
  };

  // In production: save to database, send to SIEM
  console.log("[SECURITY AUDIT]", log);

  return log;
}

// Threat detection
export const threatDetectionRules = {
  bruteForce: {
    maxAttempts: 5,
    timeWindow: 300, // 5 minutes
    action: "block_ip",
  },
  suspiciousActivity: {
    multipleCountries: {
      timeWindow: 3600, // 1 hour
      action: "require_mfa",
    },
    unusualPurchaseAmount: {
      threshold: 5000, // BRL
      action: "manual_review",
    },
  },
  rateLimit: {
    api: {
      requests: 100,
      timeWindow: 60, // 1 minute
      action: "throttle",
    },
  },
};

export function detectThreat(
  type: ThreatDetection["type"],
  source: ThreatDetection["source"],
  target: ThreatDetection["target"]
): ThreatDetection {
  const threat: ThreatDetection = {
    id: `threat-${Date.now()}`,
    type,
    severity: "high",
    detected: new Date(),
    source,
    target,
    status: "detected",
    actions: [],
  };

  // Auto-mitigation
  if (type === "brute_force") {
    threat.actions.push({
      timestamp: new Date(),
      action: "block_ip",
      result: `IP ${source.ipAddress} blocked for 1 hour`,
    });
    threat.status = "mitigated";
  }

  return threat;
}

// Data encryption
export interface EncryptedData {
  data: string; // encrypted
  iv: string; // initialization vector
  tag?: string; // authentication tag
  algorithm: string;
}

export function encryptSensitiveData(data: string): EncryptedData {
  // Mock implementation - in production, use crypto library
  return {
    data: Buffer.from(data).toString("base64"),
    iv: "mock-iv",
    algorithm: "aes-256-gcm",
  };
}

export function decryptSensitiveData(encrypted: EncryptedData): string {
  // Mock implementation - in production, use crypto library
  return Buffer.from(encrypted.data, "base64").toString("utf-8");
}

// PII (Personally Identifiable Information) handling
export interface PIIField {
  field: string;
  type: "name" | "email" | "phone" | "cpf" | "address" | "credit_card";
  encrypted: boolean;
  anonymized: boolean;
}

export function anonymizePII(data: any, fields: string[]): any {
  const anonymized = { ...data };

  fields.forEach((field) => {
    if (anonymized[field]) {
      if (field === "email") {
        const [local, domain] = anonymized[field].split("@");
        anonymized[field] = `${local[0]}***@${domain}`;
      } else if (field === "cpf") {
        anonymized[field] = `***${anonymized[field].slice(-3)}`;
      } else if (field === "phone") {
        anonymized[field] = `***${anonymized[field].slice(-4)}`;
      } else {
        anonymized[field] = "***";
      }
    }
  });

  return anonymized;
}

// LGPD/GDPR consent management
export function recordConsent(
  userId: string,
  type: DataPrivacy["consents"][0]["type"],
  granted: boolean,
  ipAddress: string,
  policyVersion: string
): DataPrivacy["consents"][0] {
  return {
    type,
    granted,
    timestamp: new Date(),
    ipAddress,
    version: policyVersion,
  };
}

// Data subject requests (LGPD/GDPR)
export function createDataSubjectRequest(
  userId: string,
  type: DataPrivacy["dataRequests"][0]["type"]
): DataPrivacy["dataRequests"][0] {
  return {
    id: `dsr-${Date.now()}`,
    type,
    status: "pending",
    requestedAt: new Date(),
  };
}

// Export user data (LGPD/GDPR right to portability)
export async function exportUserData(userId: string): Promise<{
  format: "json" | "csv";
  data: any;
  size: number; // bytes
}> {
  // Mock implementation - in production, gather all user data
  const userData = {
    profile: {
      id: userId,
      name: "Maria Silva",
      email: "maria@example.com",
      phone: "+55 11 98765-4321",
    },
    orders: [],
    reviews: [],
    wishlist: [],
    consents: [],
  };

  return {
    format: "json",
    data: userData,
    size: JSON.stringify(userData).length,
  };
}

// Delete user data (LGPD/GDPR right to erasure)
export async function deleteUserData(userId: string, reason?: string): Promise<{
  deleted: boolean;
  timestamp: Date;
  dataCategories: string[];
}> {
  // Mock implementation - in production, delete from all systems
  return {
    deleted: true,
    timestamp: new Date(),
    dataCategories: [
      "profile",
      "orders",
      "reviews",
      "wishlist",
      "analytics",
      "marketing_preferences",
    ],
  };
}

// PCI DSS compliance
export const pciDssRequirements = [
  {
    id: "1",
    requirement: "Install and maintain a firewall configuration",
    status: "compliant" as const,
  },
  {
    id: "2",
    requirement: "Do not use vendor-supplied defaults for system passwords",
    status: "compliant" as const,
  },
  {
    id: "3",
    requirement: "Protect stored cardholder data",
    status: "compliant" as const,
  },
  {
    id: "4",
    requirement: "Encrypt transmission of cardholder data",
    status: "compliant" as const,
  },
  {
    id: "5",
    requirement: "Protect all systems against malware",
    status: "compliant" as const,
  },
  {
    id: "6",
    requirement: "Develop and maintain secure systems and applications",
    status: "compliant" as const,
  },
  {
    id: "7",
    requirement: "Restrict access to cardholder data by business need to know",
    status: "compliant" as const,
  },
  {
    id: "8",
    requirement: "Identify and authenticate access to system components",
    status: "compliant" as const,
  },
  {
    id: "9",
    requirement: "Restrict physical access to cardholder data",
    status: "compliant" as const,
  },
  {
    id: "10",
    requirement: "Track and monitor all access to network resources",
    status: "compliant" as const,
  },
  {
    id: "11",
    requirement: "Regularly test security systems and processes",
    status: "compliant" as const,
  },
  {
    id: "12",
    requirement: "Maintain a policy that addresses information security",
    status: "compliant" as const,
  },
];

// Security headers
export const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
};

// Rate limiting
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
  skipSuccessfulRequests: boolean;
}

export const rateLimits: Record<string, RateLimitConfig> = {
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
    message: "Too many requests, please try again later",
    skipSuccessfulRequests: false,
  },
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    message: "Too many login attempts, please try again later",
    skipSuccessfulRequests: true,
  },
  checkout: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10,
    message: "Too many checkout attempts, please slow down",
    skipSuccessfulRequests: false,
  },
};

// Vulnerability scanning
export interface VulnerabilityScan {
  id: string;
  timestamp: Date;
  type: "dependencies" | "code" | "infrastructure" | "penetration_test";
  status: "running" | "completed" | "failed";
  findings: {
    severity: "critical" | "high" | "medium" | "low" | "info";
    category: string;
    description: string;
    affected: string;
    recommendation: string;
    cve?: string; // Common Vulnerabilities and Exposures ID
  }[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
}

export function runVulnerabilityScan(type: VulnerabilityScan["type"]): VulnerabilityScan {
  // Mock implementation - in production, use tools like Snyk, OWASP ZAP
  return {
    id: `scan-${Date.now()}`,
    timestamp: new Date(),
    type,
    status: "completed",
    findings: [],
    summary: {
      critical: 0,
      high: 0,
      medium: 2,
      low: 5,
      info: 10,
    },
  };
}

// Compliance reporting
export function generateComplianceReport(
  startDate: Date,
  endDate: Date
): ComplianceReport {
  return {
    period: { start: startDate, end: endDate },
    lgpd: {
      compliant: true,
      dataProcessingActivities: 45,
      consentsCollected: 12500,
      dataSubjectRequests: 23,
      dataBreaches: 0,
      dpoContacts: "dpo@mundopetzen.com.br",
    },
    pciDss: {
      compliant: true,
      level: 2,
      lastAudit: new Date("2024-06-01"),
      nextAudit: new Date("2025-06-01"),
      requirements: pciDssRequirements,
    },
    securityMetrics: {
      totalIncidents: 156,
      criticalIncidents: 0,
      meanTimeToDetect: 12, // 12 minutes
      meanTimeToResolve: 45, // 45 minutes
      falsePositives: 23,
      blockedAttacks: 1234,
    },
  };
}

// Security score
export interface SecurityScore {
  overall: number; // 0-100
  categories: {
    authentication: number;
    encryption: number;
    compliance: number;
    monitoring: number;
    incidentResponse: number;
  };
  recommendations: {
    priority: "critical" | "high" | "medium" | "low";
    action: string;
    impact: string;
  }[];
  lastAssessment: Date;
  nextAssessment: Date;
}

export function calculateSecurityScore(): SecurityScore {
  return {
    overall: 92,
    categories: {
      authentication: 95,
      encryption: 98,
      compliance: 90,
      monitoring: 88,
      incidentResponse: 85,
    },
    recommendations: [
      {
        priority: "medium",
        action: "Implement automated security testing in CI/CD pipeline",
        impact: "Catch vulnerabilities before production",
      },
      {
        priority: "low",
        action: "Add security awareness training for all employees",
        impact: "Reduce human error incidents",
      },
    ],
    lastAssessment: new Date(),
    nextAssessment: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
  };
}

// Two-Factor Authentication (2FA)
export interface TwoFactorAuth {
  userId: string;
  method: "totp" | "sms" | "email" | "authenticator_app";
  enabled: boolean;
  secret?: string;
  backupCodes: string[];
  verified: boolean;
  verifiedAt?: Date;
}

export function generate2FASecret(): string {
  // Mock implementation - in production, use speakeasy or similar
  return "JBSWY3DPEHPK3PXP";
}

export function verify2FACode(secret: string, code: string): boolean {
  // Mock implementation - in production, use speakeasy or similar
  return code.length === 6 && /^\d+$/.test(code);
}

// Session management
export interface UserSession {
  id: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastActivity: Date;
  expiresAt: Date;
  active: boolean;
  mfaVerified: boolean;
}

export function createSession(userId: string, ipAddress: string, userAgent: string): UserSession {
  return {
    id: `session-${Date.now()}`,
    userId,
    ipAddress,
    userAgent,
    createdAt: new Date(),
    lastActivity: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    active: true,
    mfaVerified: false,
  };
}

export function validateSession(session: UserSession): boolean {
  return session.active && session.expiresAt > new Date();
}

// Security analytics
export interface SecurityAnalytics {
  period: { start: Date; end: Date };
  metrics: {
    totalLogins: number;
    failedLogins: number;
    blockedIPs: number;
    suspiciousActivities: number;
    dataBreaches: number;
    complianceViolations: number;
  };
  topThreats: {
    type: string;
    count: number;
    severity: string;
  }[];
  topAttackers: {
    ipAddress: string;
    country: string;
    attempts: number;
  }[];
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export function getSecurityAnalytics(startDate: Date, endDate: Date): SecurityAnalytics {
  return {
    period: { start: startDate, end: endDate },
    metrics: {
      totalLogins: 125000,
      failedLogins: 3456,
      blockedIPs: 234,
      suspiciousActivities: 156,
      dataBreaches: 0,
      complianceViolations: 0,
    },
    topThreats: [
      { type: "Brute Force", count: 1234, severity: "high" },
      { type: "SQL Injection", count: 456, severity: "critical" },
      { type: "XSS", count: 234, severity: "medium" },
    ],
    topAttackers: [
      { ipAddress: "192.168.1.1", country: "Unknown", attempts: 567 },
      { ipAddress: "10.0.0.1", country: "Unknown", attempts: 234 },
    ],
    vulnerabilities: {
      critical: 0,
      high: 0,
      medium: 2,
      low: 5,
    },
  };
}
