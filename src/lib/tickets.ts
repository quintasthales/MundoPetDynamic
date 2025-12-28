// Customer Service Ticket System

export interface Ticket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category:
    | "order"
    | "product"
    | "shipping"
    | "payment"
    | "return"
    | "technical"
    | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "waiting_customer" | "resolved" | "closed";
  orderId?: string;
  productId?: string;
  messages: TicketMessage[];
  assignedTo?: string;
  assignedToName?: string;
  tags: string[];
  satisfaction?: {
    rating: number; // 1-5
    comment?: string;
    submittedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
  firstResponseTime?: number; // minutes
  resolutionTime?: number; // minutes
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: "customer" | "agent" | "system";
  message: string;
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  internal: boolean; // Internal notes not visible to customer
  createdAt: Date;
}

export interface TicketTemplate {
  id: string;
  name: string;
  category: Ticket["category"];
  subject: string;
  message: string;
  tags: string[];
}

export interface SupportAgent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "agent" | "supervisor" | "admin";
  status: "online" | "away" | "offline";
  activeTickets: number;
  resolvedTickets: number;
  averageResponseTime: number; // minutes
  averageResolutionTime: number; // minutes
  satisfactionRating: number; // 1-5
  languages: string[];
  specialties: string[];
}

// Mock tickets
export const tickets: Ticket[] = [
  {
    id: "ticket-001",
    ticketNumber: "TKT-2024-001",
    userId: "user-123",
    userName: "João Silva",
    userEmail: "joao@example.com",
    subject: "Problema com entrega do pedido #ORD-001",
    category: "shipping",
    priority: "high",
    status: "in_progress",
    orderId: "ORD-001",
    messages: [
      {
        id: "msg-001",
        ticketId: "ticket-001",
        senderId: "user-123",
        senderName: "João Silva",
        senderType: "customer",
        message:
          "Meu pedido ainda não chegou. Já se passaram 10 dias desde a compra.",
        internal: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: "msg-002",
        ticketId: "ticket-001",
        senderId: "agent-001",
        senderName: "Maria Santos",
        senderType: "agent",
        message:
          "Olá João! Vou verificar o status da sua entrega e retorno em breve.",
        internal: false,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    ],
    assignedTo: "agent-001",
    assignedToName: "Maria Santos",
    tags: ["shipping_delay", "priority"],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    firstResponseTime: 15,
  },
];

// Mock agents
export const supportAgents: SupportAgent[] = [
  {
    id: "agent-001",
    name: "Maria Santos",
    email: "maria@mundopetzen.com",
    avatar: "/agents/maria.jpg",
    role: "agent",
    status: "online",
    activeTickets: 5,
    resolvedTickets: 234,
    averageResponseTime: 12,
    averageResolutionTime: 45,
    satisfactionRating: 4.8,
    languages: ["pt-BR", "en"],
    specialties: ["shipping", "returns"],
  },
  {
    id: "agent-002",
    name: "Pedro Costa",
    email: "pedro@mundopetzen.com",
    avatar: "/agents/pedro.jpg",
    role: "agent",
    status: "online",
    activeTickets: 3,
    resolvedTickets: 189,
    averageResponseTime: 15,
    averageResolutionTime: 52,
    satisfactionRating: 4.7,
    languages: ["pt-BR"],
    specialties: ["technical", "product"],
  },
];

// Ticket templates
export const ticketTemplates: TicketTemplate[] = [
  {
    id: "template-001",
    name: "Shipping Delay Response",
    category: "shipping",
    subject: "Atualização sobre sua entrega",
    message:
      "Olá {{customer_name}},\n\nVerifiquei o status da sua entrega e...",
    tags: ["shipping", "delay"],
  },
  {
    id: "template-002",
    name: "Refund Approved",
    category: "return",
    subject: "Reembolso aprovado",
    message:
      "Olá {{customer_name}},\n\nSeu reembolso foi aprovado e processado...",
    tags: ["refund", "approved"],
  },
];

// Create ticket
export function createTicket(data: {
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: Ticket["category"];
  message: string;
  orderId?: string;
  productId?: string;
  attachments?: TicketMessage["attachments"];
}): Ticket {
  const ticketNumber = `TKT-${new Date().getFullYear()}-${String(
    tickets.length + 1
  ).padStart(3, "0")}`;

  const ticket: Ticket = {
    id: `ticket-${Date.now()}`,
    ticketNumber,
    userId: data.userId,
    userName: data.userName,
    userEmail: data.userEmail,
    subject: data.subject,
    category: data.category,
    priority: determinePriority(data.category, data.message),
    status: "open",
    orderId: data.orderId,
    productId: data.productId,
    messages: [
      {
        id: `msg-${Date.now()}`,
        ticketId: `ticket-${Date.now()}`,
        senderId: data.userId,
        senderName: data.userName,
        senderType: "customer",
        message: data.message,
        attachments: data.attachments,
        internal: false,
        createdAt: new Date(),
      },
    ],
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Auto-assign to available agent
  const availableAgent = getAvailableAgent(data.category);
  if (availableAgent) {
    ticket.assignedTo = availableAgent.id;
    ticket.assignedToName = availableAgent.name;
  }

  // In production, save to database and send notifications
  tickets.push(ticket);

  return ticket;
}

// Add message to ticket
export function addTicketMessage(
  ticketId: string,
  data: {
    senderId: string;
    senderName: string;
    senderType: TicketMessage["senderType"];
    message: string;
    attachments?: TicketMessage["attachments"];
    internal?: boolean;
  }
): TicketMessage {
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) throw new Error("Ticket not found");

  const message: TicketMessage = {
    id: `msg-${Date.now()}`,
    ticketId,
    senderId: data.senderId,
    senderName: data.senderName,
    senderType: data.senderType,
    message: data.message,
    attachments: data.attachments,
    internal: data.internal || false,
    createdAt: new Date(),
  };

  ticket.messages.push(message);
  ticket.updatedAt = new Date();

  // Calculate first response time if this is first agent response
  if (
    data.senderType === "agent" &&
    !ticket.firstResponseTime
  ) {
    const firstMessage = ticket.messages[0];
    const responseTime =
      (message.createdAt.getTime() - firstMessage.createdAt.getTime()) /
      (1000 * 60);
    ticket.firstResponseTime = Math.round(responseTime);
  }

  // Update status
  if (data.senderType === "agent" && ticket.status === "open") {
    ticket.status = "in_progress";
  } else if (
    data.senderType === "customer" &&
    ticket.status === "waiting_customer"
  ) {
    ticket.status = "in_progress";
  }

  // In production, save to database and send notifications
  return message;
}

// Update ticket status
export function updateTicketStatus(
  ticketId: string,
  status: Ticket["status"]
): boolean {
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) return false;

  ticket.status = status;
  ticket.updatedAt = new Date();

  if (status === "resolved") {
    ticket.resolvedAt = new Date();
    const resolutionTime =
      (ticket.resolvedAt.getTime() - ticket.createdAt.getTime()) / (1000 * 60);
    ticket.resolutionTime = Math.round(resolutionTime);
  } else if (status === "closed") {
    ticket.closedAt = new Date();
  }

  // In production, update database and send notifications
  return true;
}

// Assign ticket to agent
export function assignTicket(ticketId: string, agentId: string): boolean {
  const ticket = tickets.find((t) => t.id === ticketId);
  const agent = supportAgents.find((a) => a.id === agentId);

  if (!ticket || !agent) return false;

  ticket.assignedTo = agentId;
  ticket.assignedToName = agent.name;
  ticket.updatedAt = new Date();

  // In production, update database and notify agent
  return true;
}

// Add tags to ticket
export function addTicketTags(ticketId: string, tags: string[]): boolean {
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) return false;

  ticket.tags = [...new Set([...ticket.tags, ...tags])];
  ticket.updatedAt = new Date();

  return true;
}

// Submit satisfaction rating
export function submitTicketSatisfaction(
  ticketId: string,
  rating: number,
  comment?: string
): boolean {
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket || ticket.status !== "resolved") return false;

  ticket.satisfaction = {
    rating,
    comment,
    submittedAt: new Date(),
  };

  // Update agent stats
  if (ticket.assignedTo) {
    const agent = supportAgents.find((a) => a.id === ticket.assignedTo);
    if (agent) {
      // Recalculate average rating
      // In production, calculate from database
    }
  }

  return true;
}

// Get tickets by user
export function getUserTickets(userId: string): Ticket[] {
  return tickets.filter((t) => t.userId === userId);
}

// Get tickets by status
export function getTicketsByStatus(status: Ticket["status"]): Ticket[] {
  return tickets.filter((t) => t.status === status);
}

// Get tickets by agent
export function getAgentTickets(agentId: string): Ticket[] {
  return tickets.filter((t) => t.assignedTo === agentId);
}

// Get available agent
function getAvailableAgent(category: Ticket["category"]): SupportAgent | null {
  const onlineAgents = supportAgents.filter((a) => a.status === "online");

  // Find agent with specialty in category
  const specialistAgent = onlineAgents.find((a) =>
    a.specialties.includes(category)
  );

  if (specialistAgent) return specialistAgent;

  // Find agent with least active tickets
  const availableAgent = onlineAgents.sort(
    (a, b) => a.activeTickets - b.activeTickets
  )[0];

  return availableAgent || null;
}

// Determine priority
function determinePriority(
  category: Ticket["category"],
  message: string
): Ticket["priority"] {
  const urgentKeywords = [
    "urgente",
    "emergência",
    "imediato",
    "crítico",
    "não recebi",
    "não chegou",
  ];
  const highKeywords = [
    "problema",
    "erro",
    "defeito",
    "quebrado",
    "danificado",
  ];

  const lowerMessage = message.toLowerCase();

  if (urgentKeywords.some((keyword) => lowerMessage.includes(keyword))) {
    return "urgent";
  }

  if (
    highKeywords.some((keyword) => lowerMessage.includes(keyword)) ||
    category === "payment"
  ) {
    return "high";
  }

  if (category === "order" || category === "shipping") {
    return "medium";
  }

  return "low";
}

// Ticket analytics
export interface TicketAnalytics {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  averageResponseTime: number;
  averageResolutionTime: number;
  satisfactionRating: number;
  byCategory: {
    category: string;
    count: number;
    percentage: number;
  }[];
  byPriority: {
    priority: string;
    count: number;
    percentage: number;
  }[];
  topAgents: {
    agentId: string;
    agentName: string;
    resolved: number;
    satisfaction: number;
  }[];
}

export function getTicketAnalytics(): TicketAnalytics {
  const total = tickets.length;
  const open = tickets.filter((t) => t.status === "open").length;
  const inProgress = tickets.filter((t) => t.status === "in_progress").length;
  const resolved = tickets.filter((t) => t.status === "resolved").length;
  const closed = tickets.filter((t) => t.status === "closed").length;

  const ticketsWithResponse = tickets.filter((t) => t.firstResponseTime);
  const averageResponseTime =
    ticketsWithResponse.reduce((sum, t) => sum + (t.firstResponseTime || 0), 0) /
    Math.max(1, ticketsWithResponse.length);

  const ticketsWithResolution = tickets.filter((t) => t.resolutionTime);
  const averageResolutionTime =
    ticketsWithResolution.reduce((sum, t) => sum + (t.resolutionTime || 0), 0) /
    Math.max(1, ticketsWithResolution.length);

  const ticketsWithSatisfaction = tickets.filter((t) => t.satisfaction);
  const satisfactionRating =
    ticketsWithSatisfaction.reduce(
      (sum, t) => sum + (t.satisfaction?.rating || 0),
      0
    ) / Math.max(1, ticketsWithSatisfaction.length);

  // By category
  const categories = ["order", "product", "shipping", "payment", "return", "technical", "other"];
  const byCategory = categories.map((category) => {
    const count = tickets.filter((t) => t.category === category).length;
    return {
      category,
      count,
      percentage: (count / total) * 100,
    };
  });

  // By priority
  const priorities = ["low", "medium", "high", "urgent"];
  const byPriority = priorities.map((priority) => {
    const count = tickets.filter((t) => t.priority === priority).length;
    return {
      priority,
      count,
      percentage: (count / total) * 100,
    };
  });

  // Top agents
  const topAgents = supportAgents
    .map((agent) => ({
      agentId: agent.id,
      agentName: agent.name,
      resolved: agent.resolvedTickets,
      satisfaction: agent.satisfactionRating,
    }))
    .sort((a, b) => b.resolved - a.resolved)
    .slice(0, 5);

  return {
    total,
    open,
    inProgress,
    resolved,
    closed,
    averageResponseTime: Math.round(averageResponseTime),
    averageResolutionTime: Math.round(averageResolutionTime),
    satisfactionRating: Math.round(satisfactionRating * 10) / 10,
    byCategory,
    byPriority,
    topAgents,
  };
}

// Canned responses
export interface CannedResponse {
  id: string;
  title: string;
  category: Ticket["category"];
  message: string;
  shortcut?: string;
}

export const cannedResponses: CannedResponse[] = [
  {
    id: "canned-001",
    title: "Agradecimento pelo contato",
    category: "other",
    message:
      "Obrigado por entrar em contato! Estou analisando sua solicitação e retornarei em breve.",
    shortcut: "/thanks",
  },
  {
    id: "canned-002",
    title: "Verificando entrega",
    category: "shipping",
    message:
      "Estou verificando o status da sua entrega com a transportadora. Retornarei com uma atualização em até 24 horas.",
    shortcut: "/checkdelivery",
  },
  {
    id: "canned-003",
    title: "Reembolso em processamento",
    category: "return",
    message:
      "Seu reembolso foi aprovado e está sendo processado. O valor será creditado em até 5-7 dias úteis.",
    shortcut: "/refund",
  },
];

// Search tickets
export function searchTickets(query: string): Ticket[] {
  const lowerQuery = query.toLowerCase();

  return tickets.filter(
    (ticket) =>
      ticket.ticketNumber.toLowerCase().includes(lowerQuery) ||
      ticket.subject.toLowerCase().includes(lowerQuery) ||
      ticket.userName.toLowerCase().includes(lowerQuery) ||
      ticket.userEmail.toLowerCase().includes(lowerQuery) ||
      ticket.messages.some((m) => m.message.toLowerCase().includes(lowerQuery))
  );
}

// Bulk operations
export function bulkUpdateTickets(
  ticketIds: string[],
  updates: {
    status?: Ticket["status"];
    priority?: Ticket["priority"];
    assignedTo?: string;
    tags?: string[];
  }
): number {
  let updated = 0;

  for (const ticketId of ticketIds) {
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) continue;

    if (updates.status) ticket.status = updates.status;
    if (updates.priority) ticket.priority = updates.priority;
    if (updates.assignedTo) {
      const agent = supportAgents.find((a) => a.id === updates.assignedTo);
      if (agent) {
        ticket.assignedTo = updates.assignedTo;
        ticket.assignedToName = agent.name;
      }
    }
    if (updates.tags) {
      ticket.tags = [...new Set([...ticket.tags, ...updates.tags])];
    }

    ticket.updatedAt = new Date();
    updated++;
  }

  return updated;
}

// SLA (Service Level Agreement) tracking
export interface SLAMetrics {
  ticketId: string;
  firstResponseSLA: {
    target: number; // minutes
    actual: number;
    met: boolean;
  };
  resolutionSLA: {
    target: number; // minutes
    actual: number;
    met: boolean;
  };
}

export function getSLAMetrics(ticketId: string): SLAMetrics | null {
  const ticket = tickets.find((t) => t.id === ticketId);
  if (!ticket) return null;

  // SLA targets based on priority
  const slaTargets = {
    urgent: { response: 15, resolution: 240 },
    high: { response: 30, resolution: 480 },
    medium: { response: 60, resolution: 1440 },
    low: { response: 120, resolution: 2880 },
  };

  const target = slaTargets[ticket.priority];

  return {
    ticketId: ticket.id,
    firstResponseSLA: {
      target: target.response,
      actual: ticket.firstResponseTime || 0,
      met: (ticket.firstResponseTime || 0) <= target.response,
    },
    resolutionSLA: {
      target: target.resolution,
      actual: ticket.resolutionTime || 0,
      met: (ticket.resolutionTime || 0) <= target.resolution,
    },
  };
}
