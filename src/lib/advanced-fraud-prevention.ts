// Advanced Fraud Prevention with Behavioral Analysis

export interface FraudSignal {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  score: number; // 0-100
  description: string;
  timestamp: Date;
}

export interface BehavioralProfile {
  userId: string;
  sessionId: string;
  deviceFingerprint: string;
  behavioralSignals: {
    mouseMovements: number;
    keystrokes: number;
    scrollPatterns: string[];
    timeOnPage: number; // seconds
    navigationPattern: string[];
    formFillSpeed: number; // chars per second
    copyPasteDetected: boolean;
    autofillDetected: boolean;
  };
  riskScore: number; // 0-100
  isBot: boolean;
  confidence: number; // 0-100
}

export interface TransactionAnalysis {
  transactionId: string;
  riskScore: number; // 0-100
  riskLevel: "low" | "medium" | "high" | "critical";
  signals: FraudSignal[];
  recommendation: "approve" | "review" | "challenge" | "decline";
  confidence: number; // 0-100
  analysis: {
    behavioral: number;
    device: number;
    transaction: number;
    historical: number;
    network: number;
  };
}

// Behavioral Analysis Engine
export class BehavioralAnalysisEngine {
  analyzeBehavior(profile: BehavioralProfile): FraudSignal[] {
    const signals: FraudSignal[] = [];

    // Bot detection
    if (this.detectBot(profile)) {
      signals.push({
        type: "bot_detected",
        severity: "critical",
        score: 95,
        description: "Comportamento suspeito de bot detectado",
        timestamp: new Date(),
      });
    }

    // Abnormal speed
    if (profile.behavioralSignals.formFillSpeed > 20) {
      signals.push({
        type: "abnormal_speed",
        severity: "high",
        score: 75,
        description: "Preenchimento de formulário anormalmente rápido",
        timestamp: new Date(),
      });
    }

    // Copy-paste detection
    if (profile.behavioralSignals.copyPasteDetected) {
      signals.push({
        type: "copy_paste",
        severity: "medium",
        score: 45,
        description: "Dados copiados e colados detectados",
        timestamp: new Date(),
      });
    }

    // Minimal interaction
    if (
      profile.behavioralSignals.mouseMovements < 10 &&
      profile.behavioralSignals.timeOnPage < 30
    ) {
      signals.push({
        type: "minimal_interaction",
        severity: "high",
        score: 70,
        description: "Interação mínima com a página",
        timestamp: new Date(),
      });
    }

    // Suspicious navigation
    if (this.detectSuspiciousNavigation(profile.behavioralSignals.navigationPattern)) {
      signals.push({
        type: "suspicious_navigation",
        severity: "medium",
        score: 55,
        description: "Padrão de navegação suspeito",
        timestamp: new Date(),
      });
    }

    return signals;
  }

  private detectBot(profile: BehavioralProfile): boolean {
    // Check for bot indicators
    const indicators = [
      profile.behavioralSignals.mouseMovements === 0,
      profile.behavioralSignals.keystrokes === 0,
      profile.behavioralSignals.scrollPatterns.length === 0,
      profile.behavioralSignals.timeOnPage < 5,
      profile.behavioralSignals.formFillSpeed > 50,
    ];

    const botScore = indicators.filter(Boolean).length / indicators.length;
    return botScore > 0.6;
  }

  private detectSuspiciousNavigation(pattern: string[]): boolean {
    // Check for unusual navigation patterns
    // E.g., direct access to checkout without viewing products
    if (pattern.length < 3 && pattern.includes("/checkout")) {
      return true;
    }

    // Multiple rapid page changes
    if (pattern.length > 20) {
      return true;
    }

    return false;
  }
}

// Device Fingerprinting
export interface DeviceFingerprint {
  id: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  plugins: string[];
  canvas: string;
  webgl: string;
  fonts: string[];
  audioContext: string;
  riskScore: number;
  isVPN: boolean;
  isProxy: boolean;
  isTor: boolean;
}

export function analyzeDevice(fingerprint: DeviceFingerprint): FraudSignal[] {
  const signals: FraudSignal[] = [];

  // VPN/Proxy detection
  if (fingerprint.isVPN || fingerprint.isProxy) {
    signals.push({
      type: "vpn_proxy",
      severity: "medium",
      score: 50,
      description: "VPN ou proxy detectado",
      timestamp: new Date(),
    });
  }

  // Tor detection
  if (fingerprint.isTor) {
    signals.push({
      type: "tor_network",
      severity: "high",
      score: 80,
      description: "Acesso via rede Tor detectado",
      timestamp: new Date(),
    });
  }

  // Headless browser
  if (fingerprint.plugins.length === 0) {
    signals.push({
      type: "headless_browser",
      severity: "high",
      score: 75,
      description: "Possível navegador headless detectado",
      timestamp: new Date(),
    });
  }

  return signals;
}

// Transaction Pattern Analysis
export interface TransactionPattern {
  userId: string;
  recentTransactions: {
    amount: number;
    timestamp: Date;
    location: string;
    device: string;
  }[];
  avgTransactionAmount: number;
  transactionFrequency: number; // per day
  unusualActivity: boolean;
}

export function analyzeTransactionPattern(
  pattern: TransactionPattern,
  currentAmount: number
): FraudSignal[] {
  const signals: FraudSignal[] = [];

  // Unusually large transaction
  if (currentAmount > pattern.avgTransactionAmount * 3) {
    signals.push({
      type: "unusual_amount",
      severity: "high",
      score: 70,
      description: "Valor da transação significativamente maior que o histórico",
      timestamp: new Date(),
    });
  }

  // High frequency
  const today = new Date();
  const todayTransactions = pattern.recentTransactions.filter(
    t => t.timestamp.toDateString() === today.toDateString()
  );

  if (todayTransactions.length > 5) {
    signals.push({
      type: "high_frequency",
      severity: "high",
      score: 75,
      description: "Frequência de transações anormalmente alta",
      timestamp: new Date(),
    });
  }

  // Multiple locations
  const uniqueLocations = new Set(
    pattern.recentTransactions.slice(0, 5).map(t => t.location)
  );

  if (uniqueLocations.size > 3) {
    signals.push({
      type: "multiple_locations",
      severity: "medium",
      score: 60,
      description: "Transações de múltiplas localizações em curto período",
      timestamp: new Date(),
    });
  }

  // Multiple devices
  const uniqueDevices = new Set(
    pattern.recentTransactions.slice(0, 5).map(t => t.device)
  );

  if (uniqueDevices.size > 2) {
    signals.push({
      type: "multiple_devices",
      severity: "medium",
      score: 55,
      description: "Transações de múltiplos dispositivos em curto período",
      timestamp: new Date(),
    });
  }

  return signals;
}

// Network Analysis
export interface NetworkAnalysis {
  ipAddress: string;
  country: string;
  city: string;
  isp: string;
  isDataCenter: boolean;
  isHosting: boolean;
  threatLevel: number; // 0-100
  reputationScore: number; // 0-100
  blacklisted: boolean;
}

export function analyzeNetwork(network: NetworkAnalysis): FraudSignal[] {
  const signals: FraudSignal[] = [];

  // Data center IP
  if (network.isDataCenter || network.isHosting) {
    signals.push({
      type: "datacenter_ip",
      severity: "high",
      score: 70,
      description: "IP de datacenter ou hosting detectado",
      timestamp: new Date(),
    });
  }

  // Blacklisted IP
  if (network.blacklisted) {
    signals.push({
      type: "blacklisted_ip",
      severity: "critical",
      score: 95,
      description: "IP está em lista negra de fraudes",
      timestamp: new Date(),
    });
  }

  // High threat level
  if (network.threatLevel > 70) {
    signals.push({
      type: "high_threat",
      severity: "high",
      score: network.threatLevel,
      description: "IP com alto nível de ameaça detectado",
      timestamp: new Date(),
    });
  }

  // Low reputation
  if (network.reputationScore < 30) {
    signals.push({
      type: "low_reputation",
      severity: "medium",
      score: 60,
      description: "IP com baixa reputação",
      timestamp: new Date(),
    });
  }

  return signals;
}

// Comprehensive Fraud Analysis
export class FraudAnalysisEngine {
  analyzeTransaction(
    behavioralProfile: BehavioralProfile,
    deviceFingerprint: DeviceFingerprint,
    transactionPattern: TransactionPattern,
    networkAnalysis: NetworkAnalysis,
    transactionAmount: number
  ): TransactionAnalysis {
    const allSignals: FraudSignal[] = [];

    // Behavioral analysis
    const behavioralEngine = new BehavioralAnalysisEngine();
    const behavioralSignals = behavioralEngine.analyzeBehavior(behavioralProfile);
    allSignals.push(...behavioralSignals);

    // Device analysis
    const deviceSignals = analyzeDevice(deviceFingerprint);
    allSignals.push(...deviceSignals);

    // Transaction pattern analysis
    const transactionSignals = analyzeTransactionPattern(
      transactionPattern,
      transactionAmount
    );
    allSignals.push(...transactionSignals);

    // Network analysis
    const networkSignals = analyzeNetwork(networkAnalysis);
    allSignals.push(...networkSignals);

    // Calculate component scores
    const behavioralScore = this.calculateScore(behavioralSignals);
    const deviceScore = this.calculateScore(deviceSignals);
    const transactionScore = this.calculateScore(transactionSignals);
    const networkScore = this.calculateScore(networkSignals);

    // Calculate overall risk score (weighted average)
    const riskScore =
      behavioralScore * 0.3 +
      deviceScore * 0.2 +
      transactionScore * 0.3 +
      networkScore * 0.2;

    // Determine risk level
    let riskLevel: TransactionAnalysis["riskLevel"];
    if (riskScore >= 80) riskLevel = "critical";
    else if (riskScore >= 60) riskLevel = "high";
    else if (riskScore >= 40) riskLevel = "medium";
    else riskLevel = "low";

    // Determine recommendation
    let recommendation: TransactionAnalysis["recommendation"];
    if (riskScore >= 80) recommendation = "decline";
    else if (riskScore >= 60) recommendation = "challenge";
    else if (riskScore >= 40) recommendation = "review";
    else recommendation = "approve";

    return {
      transactionId: `txn-${Date.now()}`,
      riskScore: Math.round(riskScore),
      riskLevel,
      signals: allSignals,
      recommendation,
      confidence: 87,
      analysis: {
        behavioral: Math.round(behavioralScore),
        device: Math.round(deviceScore),
        transaction: Math.round(transactionScore),
        historical: 0,
        network: Math.round(networkScore),
      },
    };
  }

  private calculateScore(signals: FraudSignal[]): number {
    if (signals.length === 0) return 0;

    const totalScore = signals.reduce((sum, signal) => sum + signal.score, 0);
    return totalScore / signals.length;
  }
}

// Fraud Prevention Rules
export interface FraudRule {
  id: string;
  name: string;
  enabled: boolean;
  condition: {
    field: string;
    operator: string;
    value: any;
  };
  action: "flag" | "challenge" | "block" | "review";
  priority: number;
}

export const fraudRules: FraudRule[] = [
  {
    id: "rule-1",
    name: "Bloquear IPs em lista negra",
    enabled: true,
    condition: {
      field: "network.blacklisted",
      operator: "equals",
      value: true,
    },
    action: "block",
    priority: 1,
  },
  {
    id: "rule-2",
    name: "Desafiar transações de alto valor",
    enabled: true,
    condition: {
      field: "transaction.amount",
      operator: "greater_than",
      value: 1000,
    },
    action: "challenge",
    priority: 2,
  },
  {
    id: "rule-3",
    name: "Revisar múltiplas transações",
    enabled: true,
    condition: {
      field: "transaction.frequency",
      operator: "greater_than",
      value: 5,
    },
    action: "review",
    priority: 3,
  },
  {
    id: "rule-4",
    name: "Bloquear bots",
    enabled: true,
    condition: {
      field: "behavioral.isBot",
      operator: "equals",
      value: true,
    },
    action: "block",
    priority: 1,
  },
  {
    id: "rule-5",
    name: "Desafiar rede Tor",
    enabled: true,
    condition: {
      field: "device.isTor",
      operator: "equals",
      value: true,
    },
    action: "challenge",
    priority: 2,
  },
];

// Fraud Analytics
export interface FraudAnalytics {
  totalTransactions: number;
  fraudulentTransactions: number;
  fraudRate: number; // percentage
  blockedAmount: number; // BRL
  savedAmount: number; // BRL
  falsePositiveRate: number; // percentage
  detectionAccuracy: number; // percentage
  avgRiskScore: number;
  topFraudSignals: {
    type: string;
    count: number;
    avgScore: number;
  }[];
}

export function getFraudAnalytics(): FraudAnalytics {
  return {
    totalTransactions: 45200,
    fraudulentTransactions: 285,
    fraudRate: 0.63,
    blockedAmount: 142500,
    savedAmount: 428000, // 3x blocked amount (typical fraud multiplier)
    falsePositiveRate: 2.1,
    detectionAccuracy: 94.5,
    avgRiskScore: 18.5,
    topFraudSignals: [
      {
        type: "high_frequency",
        count: 85,
        avgScore: 75,
      },
      {
        type: "unusual_amount",
        count: 72,
        avgScore: 70,
      },
      {
        type: "blacklisted_ip",
        count: 45,
        avgScore: 95,
      },
      {
        type: "bot_detected",
        count: 38,
        avgScore: 95,
      },
      {
        type: "datacenter_ip",
        count: 28,
        avgScore: 70,
      },
    ],
  };
}

// Export singleton instance
export const fraudAnalysisEngine = new FraudAnalysisEngine();
