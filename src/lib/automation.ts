// Advanced Automation and Workflow Engine

export interface WorkflowTrigger {
  id: string;
  type: "event" | "schedule" | "webhook" | "manual";
  event?: string; // e.g., "order.created", "customer.registered"
  schedule?: string; // cron expression
  webhookUrl?: string;
  conditions?: WorkflowCondition[];
}

export interface WorkflowCondition {
  field: string;
  operator: "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "in" | "not_in";
  value: any;
}

export interface WorkflowAction {
  id: string;
  type: "email" | "sms" | "webhook" | "update_field" | "create_task" | "wait" | "condition" | "loop";
  config: Record<string, any>;
  nextActions?: string[]; // IDs of next actions
  errorActions?: string[]; // IDs of actions to run on error
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "draft";
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  metrics: {
    totalRuns: number;
    successfulRuns: number;
    failedRuns: number;
    avgExecutionTime: number; // ms
  };
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: "running" | "completed" | "failed" | "cancelled";
  startedAt: Date;
  completedAt?: Date;
  executionTime?: number; // ms
  steps: {
    actionId: string;
    status: "pending" | "running" | "completed" | "failed" | "skipped";
    startedAt?: Date;
    completedAt?: Date;
    error?: string;
    output?: any;
  }[];
  context: Record<string, any>; // Data passed between actions
  error?: string;
}

// Pre-built Workflow Templates
export const workflowTemplates: Workflow[] = [
  {
    id: "abandoned-cart-recovery",
    name: "Recuperação de Carrinho Abandonado",
    description: "Envia emails automáticos para clientes que abandonaram o carrinho",
    status: "active",
    trigger: {
      id: "trigger-1",
      type: "event",
      event: "cart.abandoned",
      conditions: [
        { field: "cart.total", operator: "greater_than", value: 50 },
      ],
    },
    actions: [
      {
        id: "action-1",
        type: "wait",
        config: { duration: 3600000 }, // 1 hour
        nextActions: ["action-2"],
      },
      {
        id: "action-2",
        type: "email",
        config: {
          template: "abandoned-cart-1",
          subject: "Você esqueceu algo no carrinho! 🛒",
          discount: "10OFF",
        },
        nextActions: ["action-3"],
      },
      {
        id: "action-3",
        type: "wait",
        config: { duration: 86400000 }, // 24 hours
        nextActions: ["action-4"],
      },
      {
        id: "action-4",
        type: "condition",
        config: {
          field: "cart.purchased",
          operator: "equals",
          value: false,
        },
        nextActions: ["action-5"],
      },
      {
        id: "action-5",
        type: "email",
        config: {
          template: "abandoned-cart-2",
          subject: "Última chance! 15% OFF no seu carrinho 🎁",
          discount: "15OFF",
        },
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    metrics: {
      totalRuns: 8520,
      successfulRuns: 8350,
      failedRuns: 170,
      avgExecutionTime: 86405000,
    },
  },
  {
    id: "welcome-series",
    name: "Série de Boas-Vindas",
    description: "Sequência de emails para novos clientes",
    status: "active",
    trigger: {
      id: "trigger-1",
      type: "event",
      event: "customer.registered",
    },
    actions: [
      {
        id: "action-1",
        type: "email",
        config: {
          template: "welcome-1",
          subject: "Bem-vindo à MundoPetZen! 🌿",
          discount: "WELCOME10",
        },
        nextActions: ["action-2"],
      },
      {
        id: "action-2",
        type: "wait",
        config: { duration: 172800000 }, // 2 days
        nextActions: ["action-3"],
      },
      {
        id: "action-3",
        type: "email",
        config: {
          template: "welcome-2",
          subject: "Conheça nossos produtos mais vendidos 🌟",
        },
        nextActions: ["action-4"],
      },
      {
        id: "action-4",
        type: "wait",
        config: { duration: 259200000 }, // 3 days
        nextActions: ["action-5"],
      },
      {
        id: "action-5",
        type: "email",
        config: {
          template: "welcome-3",
          subject: "Dicas para aproveitar ao máximo seus produtos 💡",
        },
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    metrics: {
      totalRuns: 12500,
      successfulRuns: 12450,
      failedRuns: 50,
      avgExecutionTime: 432005000,
    },
  },
  {
    id: "review-request",
    name: "Solicitação de Avaliação",
    description: "Pede avaliação após entrega do produto",
    status: "active",
    trigger: {
      id: "trigger-1",
      type: "event",
      event: "order.delivered",
    },
    actions: [
      {
        id: "action-1",
        type: "wait",
        config: { duration: 259200000 }, // 3 days
        nextActions: ["action-2"],
      },
      {
        id: "action-2",
        type: "email",
        config: {
          template: "review-request",
          subject: "Como foi sua experiência? ⭐",
        },
        nextActions: ["action-3"],
      },
      {
        id: "action-3",
        type: "wait",
        config: { duration: 432000000 }, // 5 days
        nextActions: ["action-4"],
      },
      {
        id: "action-4",
        type: "condition",
        config: {
          field: "order.reviewed",
          operator: "equals",
          value: false,
        },
        nextActions: ["action-5"],
      },
      {
        id: "action-5",
        type: "email",
        config: {
          template: "review-reminder",
          subject: "Sua opinião é importante! 💬",
          incentive: "50_points",
        },
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    metrics: {
      totalRuns: 15200,
      successfulRuns: 15100,
      failedRuns: 100,
      avgExecutionTime: 691205000,
    },
  },
  {
    id: "low-stock-alert",
    name: "Alerta de Estoque Baixo",
    description: "Notifica equipe quando estoque está baixo",
    status: "active",
    trigger: {
      id: "trigger-1",
      type: "event",
      event: "inventory.low_stock",
      conditions: [
        { field: "product.stock", operator: "less_than", value: 10 },
      ],
    },
    actions: [
      {
        id: "action-1",
        type: "email",
        config: {
          to: "inventory@mundopetzen.com.br",
          subject: "⚠️ Alerta: Estoque baixo",
          template: "low-stock-alert",
        },
        nextActions: ["action-2"],
      },
      {
        id: "action-2",
        type: "create_task",
        config: {
          title: "Repor estoque",
          assignee: "inventory-team",
          priority: "high",
        },
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    metrics: {
      totalRuns: 450,
      successfulRuns: 448,
      failedRuns: 2,
      avgExecutionTime: 2500,
    },
  },
  {
    id: "vip-customer-upgrade",
    name: "Upgrade para Cliente VIP",
    description: "Automaticamente promove clientes para VIP",
    status: "active",
    trigger: {
      id: "trigger-1",
      type: "event",
      event: "customer.milestone",
      conditions: [
        { field: "customer.totalSpent", operator: "greater_than", value: 1000 },
      ],
    },
    actions: [
      {
        id: "action-1",
        type: "update_field",
        config: {
          entity: "customer",
          field: "tier",
          value: "vip",
        },
        nextActions: ["action-2"],
      },
      {
        id: "action-2",
        type: "email",
        config: {
          template: "vip-upgrade",
          subject: "🎉 Parabéns! Você é agora um cliente VIP!",
          benefits: ["frete_gratis", "desconto_exclusivo", "acesso_antecipado"],
        },
        nextActions: ["action-3"],
      },
      {
        id: "action-3",
        type: "sms",
        config: {
          message: "Parabéns! Você é agora VIP na MundoPetZen! Aproveite frete grátis e descontos exclusivos. 🎁",
        },
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    metrics: {
      totalRuns: 850,
      successfulRuns: 845,
      failedRuns: 5,
      avgExecutionTime: 3200,
    },
  },
  {
    id: "birthday-campaign",
    name: "Campanha de Aniversário",
    description: "Envia desconto especial no aniversário do cliente",
    status: "active",
    trigger: {
      id: "trigger-1",
      type: "schedule",
      schedule: "0 9 * * *", // Every day at 9 AM
    },
    actions: [
      {
        id: "action-1",
        type: "condition",
        config: {
          field: "customer.birthday",
          operator: "equals",
          value: "today",
        },
        nextActions: ["action-2"],
      },
      {
        id: "action-2",
        type: "email",
        config: {
          template: "birthday",
          subject: "🎂 Feliz Aniversário! Presente especial para você",
          discount: "BIRTHDAY20",
        },
        nextActions: ["action-3"],
      },
      {
        id: "action-3",
        type: "sms",
        config: {
          message: "Feliz aniversário! 🎉 Ganhe 20% OFF hoje! Use: BIRTHDAY20",
        },
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    metrics: {
      totalRuns: 365,
      successfulRuns: 363,
      failedRuns: 2,
      avgExecutionTime: 15000,
    },
  },
  {
    id: "restock-notification",
    name: "Notificação de Reposição",
    description: "Avisa clientes quando produto volta ao estoque",
    status: "active",
    trigger: {
      id: "trigger-1",
      type: "event",
      event: "product.restocked",
    },
    actions: [
      {
        id: "action-1",
        type: "email",
        config: {
          template: "back-in-stock",
          subject: "✨ Produto que você queria voltou ao estoque!",
        },
        nextActions: ["action-2"],
      },
      {
        id: "action-2",
        type: "sms",
        config: {
          message: "O produto que você esperava voltou! Garanta o seu agora: {{product.url}}",
        },
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    metrics: {
      totalRuns: 2800,
      successfulRuns: 2785,
      failedRuns: 15,
      avgExecutionTime: 2800,
    },
  },
  {
    id: "win-back-campaign",
    name: "Campanha de Reconquista",
    description: "Reativa clientes inativos",
    status: "active",
    trigger: {
      id: "trigger-1",
      type: "schedule",
      schedule: "0 10 * * 1", // Every Monday at 10 AM
    },
    actions: [
      {
        id: "action-1",
        type: "condition",
        config: {
          field: "customer.lastPurchase",
          operator: "greater_than",
          value: 90, // days
        },
        nextActions: ["action-2"],
      },
      {
        id: "action-2",
        type: "email",
        config: {
          template: "win-back",
          subject: "Sentimos sua falta! 💔 Volte com 25% OFF",
          discount: "COMEBACK25",
        },
        nextActions: ["action-3"],
      },
      {
        id: "action-3",
        type: "wait",
        config: { duration: 604800000 }, // 7 days
        nextActions: ["action-4"],
      },
      {
        id: "action-4",
        type: "condition",
        config: {
          field: "customer.purchased",
          operator: "equals",
          value: false,
        },
        nextActions: ["action-5"],
      },
      {
        id: "action-5",
        type: "email",
        config: {
          template: "win-back-final",
          subject: "Última chance! 30% OFF para você voltar 🎁",
          discount: "LASTCHANCE30",
        },
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    metrics: {
      totalRuns: 52,
      successfulRuns: 51,
      failedRuns: 1,
      avgExecutionTime: 604810000,
    },
  },
];

// Workflow Engine
export class WorkflowEngine {
  async executeWorkflow(workflow: Workflow, context: Record<string, any>): Promise<WorkflowExecution> {
    const execution: WorkflowExecution = {
      id: `exec-${Date.now()}`,
      workflowId: workflow.id,
      status: "running",
      startedAt: new Date(),
      steps: workflow.actions.map(action => ({
        actionId: action.id,
        status: "pending",
      })),
      context,
    };

    try {
      for (const action of workflow.actions) {
        await this.executeAction(action, execution);
      }

      execution.status = "completed";
      execution.completedAt = new Date();
      execution.executionTime = execution.completedAt.getTime() - execution.startedAt.getTime();
    } catch (error) {
      execution.status = "failed";
      execution.error = error instanceof Error ? error.message : "Unknown error";
      execution.completedAt = new Date();
    }

    return execution;
  }

  private async executeAction(action: WorkflowAction, execution: WorkflowExecution): Promise<void> {
    const step = execution.steps.find(s => s.actionId === action.id);
    if (!step) return;

    step.status = "running";
    step.startedAt = new Date();

    try {
      switch (action.type) {
        case "email":
          await this.sendEmail(action.config, execution.context);
          break;
        case "sms":
          await this.sendSMS(action.config, execution.context);
          break;
        case "webhook":
          await this.callWebhook(action.config, execution.context);
          break;
        case "update_field":
          await this.updateField(action.config, execution.context);
          break;
        case "create_task":
          await this.createTask(action.config, execution.context);
          break;
        case "wait":
          await this.wait(action.config.duration);
          break;
        case "condition":
          const conditionMet = await this.evaluateCondition(action.config, execution.context);
          if (!conditionMet) {
            step.status = "skipped";
            return;
          }
          break;
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }

      step.status = "completed";
      step.completedAt = new Date();
    } catch (error) {
      step.status = "failed";
      step.error = error instanceof Error ? error.message : "Unknown error";
      step.completedAt = new Date();
      throw error;
    }
  }

  private async sendEmail(config: any, context: Record<string, any>): Promise<void> {
    // Implementation would use email service (SendGrid, etc.)
    console.log("Sending email:", config, context);
  }

  private async sendSMS(config: any, context: Record<string, any>): Promise<void> {
    // Implementation would use SMS service (Twilio, etc.)
    console.log("Sending SMS:", config, context);
  }

  private async callWebhook(config: any, context: Record<string, any>): Promise<void> {
    // Implementation would make HTTP request
    console.log("Calling webhook:", config, context);
  }

  private async updateField(config: any, context: Record<string, any>): Promise<void> {
    // Implementation would update database
    console.log("Updating field:", config, context);
  }

  private async createTask(config: any, context: Record<string, any>): Promise<void> {
    // Implementation would create task in project management system
    console.log("Creating task:", config, context);
  }

  private async wait(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration));
  }

  private async evaluateCondition(config: any, context: Record<string, any>): Promise<boolean> {
    const value = this.getNestedValue(context, config.field);
    
    switch (config.operator) {
      case "equals":
        return value === config.value;
      case "not_equals":
        return value !== config.value;
      case "greater_than":
        return value > config.value;
      case "less_than":
        return value < config.value;
      case "contains":
        return String(value).includes(config.value);
      case "in":
        return Array.isArray(config.value) && config.value.includes(value);
      case "not_in":
        return Array.isArray(config.value) && !config.value.includes(value);
      default:
        return false;
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }
}

// Automation Analytics
export interface AutomationAnalytics {
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutions: number;
  successRate: number;
  avgExecutionTime: number;
  topPerformingWorkflows: {
    id: string;
    name: string;
    successRate: number;
    totalRuns: number;
  }[];
  recentExecutions: WorkflowExecution[];
  timeSaved: number; // hours
  costSavings: number; // BRL
}

export function getAutomationAnalytics(): AutomationAnalytics {
  const totalExecutions = workflowTemplates.reduce((sum, w) => sum + w.metrics.totalRuns, 0);
  const successfulExecutions = workflowTemplates.reduce((sum, w) => sum + w.metrics.successfulRuns, 0);

  return {
    totalWorkflows: workflowTemplates.length,
    activeWorkflows: workflowTemplates.filter(w => w.status === "active").length,
    totalExecutions,
    successRate: (successfulExecutions / totalExecutions) * 100,
    avgExecutionTime: 125000,
    topPerformingWorkflows: workflowTemplates
      .map(w => ({
        id: w.id,
        name: w.name,
        successRate: (w.metrics.successfulRuns / w.metrics.totalRuns) * 100,
        totalRuns: w.metrics.totalRuns,
      }))
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 5),
    recentExecutions: [],
    timeSaved: 2850, // hours per month
    costSavings: 142500, // R$ per month (50 BRL/hour * 2850 hours)
  };
}

// Export singleton instance
export const workflowEngine = new WorkflowEngine();
