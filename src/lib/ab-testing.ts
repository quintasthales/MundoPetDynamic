// A/B Testing and Experimentation Framework

export interface Experiment {
  id: string;
  name: string;
  description: string;
  status: "draft" | "running" | "paused" | "completed";
  startDate: Date;
  endDate?: Date;
  targetAudience: {
    type: "all" | "new_users" | "returning_users" | "segment";
    segmentId?: string;
    percentage: number; // % of users to include
  };
  variants: Variant[];
  metrics: Metric[];
  winner?: string; // variant id
}

export interface Variant {
  id: string;
  name: string;
  description: string;
  traffic: number; // % of experiment traffic
  changes: Change[];
  metrics: {
    impressions: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
    averageOrderValue: number;
  };
}

export interface Change {
  type:
    | "text"
    | "color"
    | "layout"
    | "price"
    | "image"
    | "button"
    | "recommendation";
  element: string;
  value: any;
}

export interface Metric {
  id: string;
  name: string;
  type: "conversion" | "revenue" | "engagement" | "custom";
  goal: number;
  current: number;
}

// Sample experiments
export const experiments: Experiment[] = [
  {
    id: "exp-001",
    name: "Product Page CTA Button Color",
    description: "Test blue vs green 'Add to Cart' button",
    status: "running",
    startDate: new Date("2024-12-01"),
    targetAudience: {
      type: "all",
      percentage: 100,
    },
    variants: [
      {
        id: "control",
        name: "Control (Blue Button)",
        description: "Original blue button",
        traffic: 50,
        changes: [
          {
            type: "color",
            element: "add-to-cart-button",
            value: "#2563eb",
          },
        ],
        metrics: {
          impressions: 1250,
          conversions: 187,
          revenue: 23450.0,
          conversionRate: 14.96,
          averageOrderValue: 125.4,
        },
      },
      {
        id: "variant-a",
        name: "Variant A (Green Button)",
        description: "Green button to test urgency",
        traffic: 50,
        changes: [
          {
            type: "color",
            element: "add-to-cart-button",
            value: "#16a34a",
          },
        ],
        metrics: {
          impressions: 1230,
          conversions: 203,
          revenue: 26340.0,
          conversionRate: 16.5,
          averageOrderValue: 129.75,
        },
      },
    ],
    metrics: [
      {
        id: "m1",
        name: "Conversion Rate",
        type: "conversion",
        goal: 15,
        current: 15.73,
      },
      {
        id: "m2",
        name: "Revenue",
        type: "revenue",
        goal: 50000,
        current: 49790,
      },
    ],
  },
  {
    id: "exp-002",
    name: "Homepage Hero Section",
    description: "Test different hero images and copy",
    status: "running",
    startDate: new Date("2024-12-10"),
    targetAudience: {
      type: "new_users",
      percentage: 80,
    },
    variants: [
      {
        id: "control",
        name: "Control (Current Hero)",
        description: "Current hero with dog image",
        traffic: 33.33,
        changes: [
          {
            type: "image",
            element: "hero-image",
            value: "/images/hero-dog.jpg",
          },
          {
            type: "text",
            element: "hero-title",
            value: "Produtos Premium para Seu Pet",
          },
        ],
        metrics: {
          impressions: 3450,
          conversions: 276,
          revenue: 34500.0,
          conversionRate: 8.0,
          averageOrderValue: 125.0,
        },
      },
      {
        id: "variant-a",
        name: "Variant A (Cat Focus)",
        description: "Hero with cat image",
        traffic: 33.33,
        changes: [
          {
            type: "image",
            element: "hero-image",
            value: "/images/hero-cat.jpg",
          },
          {
            type: "text",
            element: "hero-title",
            value: "Tudo para o Bem-Estar do Seu Pet",
          },
        ],
        metrics: {
          impressions: 3420,
          conversions: 291,
          revenue: 37230.0,
          conversionRate: 8.51,
          averageOrderValue: 127.94,
        },
      },
      {
        id: "variant-b",
        name: "Variant B (Multi-Pet)",
        description: "Hero with multiple pets",
        traffic: 33.34,
        changes: [
          {
            type: "image",
            element: "hero-image",
            value: "/images/hero-multi.jpg",
          },
          {
            type: "text",
            element: "hero-title",
            value: "Qualidade e Carinho para Todos os Pets",
          },
        ],
        metrics: {
          impressions: 3440,
          conversions: 268,
          revenue: 33920.0,
          conversionRate: 7.79,
          averageOrderValue: 126.57,
        },
      },
    ],
    metrics: [
      {
        id: "m1",
        name: "Click-through Rate",
        type: "engagement",
        goal: 12,
        current: 10.5,
      },
      {
        id: "m2",
        name: "Bounce Rate Reduction",
        type: "engagement",
        goal: -10,
        current: -7.3,
      },
    ],
  },
];

// Assign user to experiment variant
export function assignVariant(
  experimentId: string,
  userId: string
): Variant | null {
  const experiment = experiments.find((e) => e.id === experimentId);
  if (!experiment || experiment.status !== "running") return null;

  // Hash-based consistent assignment
  const hash =
    userId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    100;

  let cumulative = 0;
  for (const variant of experiment.variants) {
    cumulative += variant.traffic;
    if (hash < cumulative) {
      return variant;
    }
  }

  return experiment.variants[0]; // Fallback to control
}

// Track experiment event
export interface ExperimentEvent {
  experimentId: string;
  variantId: string;
  userId: string;
  eventType: "impression" | "click" | "conversion" | "custom";
  eventValue?: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export function trackExperimentEvent(event: ExperimentEvent): void {
  // In production, send to analytics service
  console.log("Experiment event:", event);

  const experiment = experiments.find((e) => e.id === event.experimentId);
  if (!experiment) return;

  const variant = experiment.variants.find((v) => v.id === event.variantId);
  if (!variant) return;

  // Update metrics
  switch (event.eventType) {
    case "impression":
      variant.metrics.impressions++;
      break;
    case "conversion":
      variant.metrics.conversions++;
      if (event.eventValue) {
        variant.metrics.revenue += event.eventValue;
      }
      variant.metrics.conversionRate =
        (variant.metrics.conversions / variant.metrics.impressions) * 100;
      variant.metrics.averageOrderValue =
        variant.metrics.revenue / variant.metrics.conversions;
      break;
  }
}

// Calculate statistical significance
export function calculateSignificance(
  control: Variant,
  variant: Variant
): {
  significant: boolean;
  confidence: number;
  improvement: number;
} {
  // Simplified z-test for conversion rate
  const p1 = control.metrics.conversionRate / 100;
  const p2 = variant.metrics.conversionRate / 100;
  const n1 = control.metrics.impressions;
  const n2 = variant.metrics.impressions;

  const pooledP = (p1 * n1 + p2 * n2) / (n1 + n2);
  const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / n1 + 1 / n2));
  const z = Math.abs(p2 - p1) / se;

  // Convert z-score to confidence level (simplified)
  const confidence = Math.min(99.9, (1 - Math.exp(-z * z / 2)) * 100);
  const improvement = ((p2 - p1) / p1) * 100;

  return {
    significant: confidence >= 95,
    confidence,
    improvement,
  };
}

// Get experiment results
export interface ExperimentResults {
  experiment: Experiment;
  winner: Variant | null;
  results: {
    variantId: string;
    variantName: string;
    metrics: Variant["metrics"];
    significance?: {
      significant: boolean;
      confidence: number;
      improvement: number;
    };
  }[];
  recommendation: string;
}

export function getExperimentResults(
  experimentId: string
): ExperimentResults | null {
  const experiment = experiments.find((e) => e.id === experimentId);
  if (!experiment) return null;

  const control = experiment.variants[0];
  const results = experiment.variants.map((variant, index) => {
    const result: ExperimentResults["results"][0] = {
      variantId: variant.id,
      variantName: variant.name,
      metrics: variant.metrics,
    };

    if (index > 0) {
      result.significance = calculateSignificance(control, variant);
    }

    return result;
  });

  // Determine winner
  let winner: Variant | null = null;
  let bestConversionRate = 0;

  for (const variant of experiment.variants) {
    if (variant.metrics.conversionRate > bestConversionRate) {
      bestConversionRate = variant.metrics.conversionRate;
      winner = variant;
    }
  }

  // Check if winner is statistically significant
  if (winner && winner.id !== control.id) {
    const significance = calculateSignificance(control, winner);
    if (!significance.significant) {
      winner = null; // Not significant enough
    }
  }

  // Generate recommendation
  let recommendation = "";
  if (winner && winner.id !== control.id) {
    const significance = calculateSignificance(control, winner);
    recommendation = `Implement ${winner.name}. It shows a ${significance.improvement.toFixed(1)}% improvement with ${significance.confidence.toFixed(1)}% confidence.`;
  } else if (winner && winner.id === control.id) {
    recommendation = "Keep the current version. No variant performed significantly better.";
  } else {
    recommendation = "Continue testing. No variant has reached statistical significance yet.";
  }

  return {
    experiment,
    winner,
    results,
    recommendation,
  };
}

// Create new experiment
export function createExperiment(data: {
  name: string;
  description: string;
  targetAudience: Experiment["targetAudience"];
  variants: Omit<Variant, "metrics">[];
}): Experiment {
  const experiment: Experiment = {
    id: `exp-${Date.now()}`,
    name: data.name,
    description: data.description,
    status: "draft",
    startDate: new Date(),
    targetAudience: data.targetAudience,
    variants: data.variants.map((v) => ({
      ...v,
      metrics: {
        impressions: 0,
        conversions: 0,
        revenue: 0,
        conversionRate: 0,
        averageOrderValue: 0,
      },
    })),
    metrics: [],
  };

  // In production, save to database
  experiments.push(experiment);

  return experiment;
}

// Start experiment
export function startExperiment(experimentId: string): boolean {
  const experiment = experiments.find((e) => e.id === experimentId);
  if (!experiment || experiment.status !== "draft") return false;

  experiment.status = "running";
  experiment.startDate = new Date();

  // In production, update database
  return true;
}

// Stop experiment
export function stopExperiment(experimentId: string): boolean {
  const experiment = experiments.find((e) => e.id === experimentId);
  if (!experiment || experiment.status !== "running") return false;

  experiment.status = "completed";
  experiment.endDate = new Date();

  // In production, update database
  return true;
}

// Get active experiments for user
export function getActiveExperiments(
  userId: string,
  userType: "new" | "returning"
): { experiment: Experiment; variant: Variant }[] {
  const active: { experiment: Experiment; variant: Variant }[] = [];

  for (const experiment of experiments) {
    if (experiment.status !== "running") continue;

    // Check if user matches target audience
    if (
      experiment.targetAudience.type === "new_users" &&
      userType !== "new"
    ) {
      continue;
    }
    if (
      experiment.targetAudience.type === "returning_users" &&
      userType !== "returning"
    ) {
      continue;
    }

    const variant = assignVariant(experiment.id, userId);
    if (variant) {
      active.push({ experiment, variant });
    }
  }

  return active;
}

// Multivariate testing support
export interface MultivariateTest {
  id: string;
  name: string;
  elements: {
    id: string;
    name: string;
    variants: string[];
  }[];
  combinations: {
    id: string;
    elements: Record<string, string>;
    traffic: number;
    metrics: Variant["metrics"];
  }[];
}

export function generateCombinations(
  test: Pick<MultivariateTest, "elements">
): MultivariateTest["combinations"] {
  // Generate all possible combinations
  const combinations: MultivariateTest["combinations"] = [];

  function generate(index: number, current: Record<string, string>) {
    if (index === test.elements.length) {
      combinations.push({
        id: `comb-${combinations.length}`,
        elements: { ...current },
        traffic: 100 / combinations.length,
        metrics: {
          impressions: 0,
          conversions: 0,
          revenue: 0,
          conversionRate: 0,
          averageOrderValue: 0,
        },
      });
      return;
    }

    const element = test.elements[index];
    for (const variant of element.variants) {
      generate(index + 1, { ...current, [element.id]: variant });
    }
  }

  generate(0, {});
  return combinations;
}
