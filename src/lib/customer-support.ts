// Comprehensive Customer Service and Support System

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  category: TicketCategory;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "pending" | "in_progress" | "resolved" | "closed";
  channel: "email" | "chat" | "phone" | "social" | "form";
  assignedTo?: string;
  messages: TicketMessage[];
  tags: string[];
  relatedOrder?: string;
  relatedProduct?: string;
  satisfaction?: {
    rating: number;
    feedback?: string;
  };
  sla: {
    responseTime: number; // minutes
    resolutionTime: number; // minutes
    responseDeadline: Date;
    resolutionDeadline: Date;
    breached: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  closedAt?: Date;
}

export type TicketCategory =
  | "order_issue"
  | "product_question"
  | "shipping_delay"
  | "return_refund"
  | "payment_issue"
  | "technical_support"
  | "account_issue"
  | "complaint"
  | "suggestion"
  | "other";

export interface TicketMessage {
  id: string;
  ticketId: string;
  author: {
    id: string;
    name: string;
    type: "customer" | "agent" | "system";
  };
  content: string;
  attachments?: Attachment[];
  isInternal: boolean;
  timestamp: Date;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface SupportAgent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "agent" | "senior_agent" | "supervisor" | "manager";
  status: "available" | "busy" | "away" | "offline";
  skills: string[];
  languages: string[];
  metrics: AgentMetrics;
  schedule: {
    timezone: string;
    workingHours: {
      day: string;
      start: string;
      end: string;
    }[];
  };
  createdAt: Date;
}

export interface AgentMetrics {
  totalTickets: number;
  resolvedTickets: number;
  avgResponseTime: number; // minutes
  avgResolutionTime: number; // minutes
  satisfactionScore: number; // 0-5
  activeTickets: number;
  ticketsToday: number;
}

export interface KnowledgeBaseArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  status: "draft" | "published" | "archived";
  views: number;
  helpful: number;
  notHelpful: number;
  relatedArticles: string[];
  attachments?: Attachment[];
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  publishedAt?: Date;
  updatedAt: Date;
}

export interface LiveChat {
  id: string;
  sessionId: string;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  agentId?: string;
  status: "waiting" | "active" | "ended";
  messages: ChatMessage[];
  metadata: {
    browser: string;
    device: string;
    location: string;
    referrer?: string;
    currentPage: string;
  };
  satisfaction?: {
    rating: number;
    feedback?: string;
  };
  startedAt: Date;
  endedAt?: Date;
  waitTime?: number; // seconds
  duration?: number; // seconds
}

export interface ChatMessage {
  id: string;
  chatId: string;
  sender: {
    id: string;
    name: string;
    type: "customer" | "agent" | "bot";
  };
  content: string;
  type: "text" | "image" | "file" | "quick_reply" | "card";
  timestamp: Date;
  read: boolean;
}

export interface CannedResponse {
  id: string;
  title: string;
  content: string;
  category: string;
  shortcut: string;
  language: string;
  usageCount: number;
  createdBy: string;
  createdAt: Date;
}

// Support Manager
export class SupportManager {
  private tickets: Map<string, SupportTicket> = new Map();
  private agents: Map<string, SupportAgent> = new Map();
  private chats: Map<string, LiveChat> = new Map();
  private articles: Map<string, KnowledgeBaseArticle> = new Map();
  
  // Ticket Management
  createTicket(data: {
    customerId: string;
    customerName: string;
    customerEmail: string;
    subject: string;
    category: TicketCategory;
    priority?: "low" | "medium" | "high" | "urgent";
    channel: SupportTicket["channel"];
    initialMessage: string;
    relatedOrder?: string;
    relatedProduct?: string;
  }): SupportTicket {
    const priority = data.priority || this.calculatePriority(data.category);
    const sla = this.calculateSLA(priority);
    
    const ticket: SupportTicket = {
      id: `ticket-${Date.now()}`,
      ticketNumber: `TKT${Date.now().toString().slice(-8)}`,
      customerId: data.customerId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      subject: data.subject,
      category: data.category,
      priority,
      status: "open",
      channel: data.channel,
      messages: [
        {
          id: `msg-${Date.now()}`,
          ticketId: `ticket-${Date.now()}`,
          author: {
            id: data.customerId,
            name: data.customerName,
            type: "customer",
          },
          content: data.initialMessage,
          isInternal: false,
          timestamp: new Date(),
        },
      ],
      tags: [],
      relatedOrder: data.relatedOrder,
      relatedProduct: data.relatedProduct,
      sla,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.tickets.set(ticket.id, ticket);
    
    // Auto-assign to available agent
    this.autoAssignTicket(ticket.id);
    
    return ticket;
  }
  
  private calculatePriority(category: TicketCategory): SupportTicket["priority"] {
    const highPriorityCategories: TicketCategory[] = ["payment_issue", "order_issue", "complaint"];
    const mediumPriorityCategories: TicketCategory[] = ["shipping_delay", "return_refund", "technical_support"];
    
    if (highPriorityCategories.includes(category)) return "high";
    if (mediumPriorityCategories.includes(category)) return "medium";
    return "low";
  }
  
  private calculateSLA(priority: SupportTicket["priority"]): SupportTicket["sla"] {
    const slaConfig = {
      urgent: { response: 15, resolution: 240 },
      high: { response: 60, resolution: 480 },
      medium: { response: 240, resolution: 1440 },
      low: { response: 1440, resolution: 2880 },
    };
    
    const config = slaConfig[priority];
    const now = new Date();
    
    return {
      responseTime: 0,
      resolutionTime: 0,
      responseDeadline: new Date(now.getTime() + config.response * 60000),
      resolutionDeadline: new Date(now.getTime() + config.resolution * 60000),
      breached: false,
    };
  }
  
  private autoAssignTicket(ticketId: string): void {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) return;
    
    // Find available agent with matching skills
    const availableAgents = Array.from(this.agents.values()).filter(
      (agent) => agent.status === "available" && agent.metrics.activeTickets < 10
    );
    
    if (availableAgents.length === 0) return;
    
    // Assign to agent with lowest active tickets
    const agent = availableAgents.sort(
      (a, b) => a.metrics.activeTickets - b.metrics.activeTickets
    )[0];
    
    ticket.assignedTo = agent.id;
    ticket.status = "in_progress";
    agent.metrics.activeTickets++;
    
    this.tickets.set(ticketId, ticket);
    this.agents.set(agent.id, agent);
  }
  
  addMessage(
    ticketId: string,
    authorId: string,
    authorName: string,
    authorType: "customer" | "agent" | "system",
    content: string,
    isInternal: boolean = false
  ): SupportTicket | undefined {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) return undefined;
    
    const message: TicketMessage = {
      id: `msg-${Date.now()}`,
      ticketId,
      author: {
        id: authorId,
        name: authorName,
        type: authorType,
      },
      content,
      isInternal,
      timestamp: new Date(),
    };
    
    ticket.messages.push(message);
    ticket.updatedAt = new Date();
    
    // Update SLA response time if first agent response
    if (authorType === "agent" && ticket.sla.responseTime === 0) {
      const responseTime = (new Date().getTime() - ticket.createdAt.getTime()) / 60000;
      ticket.sla.responseTime = responseTime;
      
      if (new Date() > ticket.sla.responseDeadline) {
        ticket.sla.breached = true;
      }
    }
    
    this.tickets.set(ticketId, ticket);
    return ticket;
  }
  
  resolveTicket(ticketId: string, agentId: string): SupportTicket | undefined {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) return undefined;
    
    ticket.status = "resolved";
    ticket.resolvedAt = new Date();
    ticket.updatedAt = new Date();
    
    // Update SLA resolution time
    const resolutionTime = (new Date().getTime() - ticket.createdAt.getTime()) / 60000;
    ticket.sla.resolutionTime = resolutionTime;
    
    if (new Date() > ticket.sla.resolutionDeadline) {
      ticket.sla.breached = true;
    }
    
    // Update agent metrics
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.metrics.resolvedTickets++;
      agent.metrics.activeTickets--;
      this.agents.set(agentId, agent);
    }
    
    this.tickets.set(ticketId, ticket);
    return ticket;
  }
  
  // Live Chat Management
  startChat(data: {
    customerId?: string;
    customerName: string;
    customerEmail?: string;
    metadata: LiveChat["metadata"];
  }): LiveChat {
    const chat: LiveChat = {
      id: `chat-${Date.now()}`,
      sessionId: `session-${Date.now()}`,
      customerId: data.customerId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      status: "waiting",
      messages: [],
      metadata: data.metadata,
      startedAt: new Date(),
    };
    
    this.chats.set(chat.id, chat);
    
    // Auto-assign to available agent
    this.assignChatToAgent(chat.id);
    
    return chat;
  }
  
  private assignChatToAgent(chatId: string): void {
    const chat = this.chats.get(chatId);
    if (!chat) return;
    
    const availableAgents = Array.from(this.agents.values()).filter(
      (agent) => agent.status === "available"
    );
    
    if (availableAgents.length === 0) return;
    
    const agent = availableAgents[0];
    chat.agentId = agent.id;
    chat.status = "active";
    chat.waitTime = (new Date().getTime() - chat.startedAt.getTime()) / 1000;
    
    agent.status = "busy";
    
    this.chats.set(chatId, chat);
    this.agents.set(agent.id, agent);
  }
  
  sendChatMessage(
    chatId: string,
    senderId: string,
    senderName: string,
    senderType: "customer" | "agent" | "bot",
    content: string
  ): LiveChat | undefined {
    const chat = this.chats.get(chatId);
    if (!chat) return undefined;
    
    const message: ChatMessage = {
      id: `chatmsg-${Date.now()}`,
      chatId,
      sender: {
        id: senderId,
        name: senderName,
        type: senderType,
      },
      content,
      type: "text",
      timestamp: new Date(),
      read: false,
    };
    
    chat.messages.push(message);
    this.chats.set(chatId, chat);
    return chat;
  }
  
  endChat(chatId: string, satisfaction?: { rating: number; feedback?: string }): LiveChat | undefined {
    const chat = this.chats.get(chatId);
    if (!chat) return undefined;
    
    chat.status = "ended";
    chat.endedAt = new Date();
    chat.duration = (chat.endedAt.getTime() - chat.startedAt.getTime()) / 1000;
    chat.satisfaction = satisfaction;
    
    // Update agent status
    if (chat.agentId) {
      const agent = this.agents.get(chat.agentId);
      if (agent) {
        agent.status = "available";
        this.agents.set(agent.id, agent);
      }
    }
    
    this.chats.set(chatId, chat);
    return chat;
  }
  
  // Knowledge Base Management
  createArticle(data: Omit<KnowledgeBaseArticle, "id" | "views" | "helpful" | "notHelpful" | "updatedAt">): KnowledgeBaseArticle {
    const article: KnowledgeBaseArticle = {
      id: `article-${Date.now()}`,
      ...data,
      views: 0,
      helpful: 0,
      notHelpful: 0,
      updatedAt: new Date(),
    };
    
    this.articles.set(article.id, article);
    return article;
  }
  
  searchArticles(query: string): KnowledgeBaseArticle[] {
    const lowerQuery = query.toLowerCase();
    
    return Array.from(this.articles.values())
      .filter(
        (article) =>
          article.status === "published" &&
          (article.title.toLowerCase().includes(lowerQuery) ||
            article.content.toLowerCase().includes(lowerQuery) ||
            article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)))
      )
      .sort((a, b) => b.views - a.views);
  }
  
  // Analytics
  getSupportAnalytics(): SupportAnalytics {
    const tickets = Array.from(this.tickets.values());
    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentTickets = tickets.filter((t) => t.createdAt >= last30Days);
    
    return {
      tickets: {
        total: recentTickets.length,
        open: recentTickets.filter((t) => t.status === "open").length,
        inProgress: recentTickets.filter((t) => t.status === "in_progress").length,
        resolved: recentTickets.filter((t) => t.status === "resolved").length,
        avgResponseTime: this.calculateAvgResponseTime(recentTickets),
        avgResolutionTime: this.calculateAvgResolutionTime(recentTickets),
        slaCompliance: this.calculateSLACompliance(recentTickets),
      },
      satisfaction: {
        avgRating: this.calculateAvgSatisfaction(recentTickets),
        totalResponses: recentTickets.filter((t) => t.satisfaction).length,
      },
      channels: this.getChannelBreakdown(recentTickets),
      categories: this.getCategoryBreakdown(recentTickets),
      topAgents: this.getTopAgents(),
    };
  }
  
  private calculateAvgResponseTime(tickets: SupportTicket[]): number {
    const responseTimes = tickets
      .filter((t) => t.sla.responseTime > 0)
      .map((t) => t.sla.responseTime);
    
    return responseTimes.length > 0
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      : 0;
  }
  
  private calculateAvgResolutionTime(tickets: SupportTicket[]): number {
    const resolutionTimes = tickets
      .filter((t) => t.sla.resolutionTime > 0)
      .map((t) => t.sla.resolutionTime);
    
    return resolutionTimes.length > 0
      ? resolutionTimes.reduce((a, b) => a + b, 0) / resolutionTimes.length
      : 0;
  }
  
  private calculateSLACompliance(tickets: SupportTicket[]): number {
    const completedTickets = tickets.filter((t) => t.status === "resolved" || t.status === "closed");
    if (completedTickets.length === 0) return 100;
    
    const compliantTickets = completedTickets.filter((t) => !t.sla.breached).length;
    return (compliantTickets / completedTickets.length) * 100;
  }
  
  private calculateAvgSatisfaction(tickets: SupportTicket[]): number {
    const ratings = tickets.filter((t) => t.satisfaction).map((t) => t.satisfaction!.rating);
    
    return ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
  }
  
  private getChannelBreakdown(tickets: SupportTicket[]): Record<string, number> {
    const breakdown: Record<string, number> = {};
    
    tickets.forEach((ticket) => {
      breakdown[ticket.channel] = (breakdown[ticket.channel] || 0) + 1;
    });
    
    return breakdown;
  }
  
  private getCategoryBreakdown(tickets: SupportTicket[]): Record<string, number> {
    const breakdown: Record<string, number> = {};
    
    tickets.forEach((ticket) => {
      breakdown[ticket.category] = (breakdown[ticket.category] || 0) + 1;
    });
    
    return breakdown;
  }
  
  private getTopAgents(): { agentId: string; name: string; resolvedTickets: number; satisfaction: number }[] {
    return Array.from(this.agents.values())
      .sort((a, b) => b.metrics.resolvedTickets - a.metrics.resolvedTickets)
      .slice(0, 5)
      .map((agent) => ({
        agentId: agent.id,
        name: agent.name,
        resolvedTickets: agent.metrics.resolvedTickets,
        satisfaction: agent.metrics.satisfactionScore,
      }));
  }
}

export interface SupportAnalytics {
  tickets: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    avgResponseTime: number;
    avgResolutionTime: number;
    slaCompliance: number;
  };
  satisfaction: {
    avgRating: number;
    totalResponses: number;
  };
  channels: Record<string, number>;
  categories: Record<string, number>;
  topAgents: {
    agentId: string;
    name: string;
    resolvedTickets: number;
    satisfaction: number;
  }[];
}

// Sample Data
export function getSupportSampleData(): {
  totalTickets: number;
  avgResponseTime: number;
  avgResolutionTime: number;
  slaCompliance: number;
  satisfactionScore: number;
  agents: number;
  knowledgeBaseArticles: number;
} {
  return {
    totalTickets: 28500,
    avgResponseTime: 12.5,
    avgResolutionTime: 185.5,
    slaCompliance: 94.5,
    satisfactionScore: 4.7,
    agents: 85,
    knowledgeBaseArticles: 485,
  };
}

// Chatbot Integration
export interface ChatbotIntent {
  name: string;
  patterns: string[];
  responses: string[];
  actions?: string[];
}

export function getChatbotIntents(): ChatbotIntent[] {
  return [
    {
      name: "greeting",
      patterns: ["oi", "olá", "bom dia", "boa tarde", "boa noite"],
      responses: [
        "Olá! Como posso ajudá-lo hoje?",
        "Oi! Em que posso ser útil?",
        "Bem-vindo! Como posso ajudar?",
      ],
    },
    {
      name: "order_status",
      patterns: ["onde está meu pedido", "rastrear pedido", "status do pedido"],
      responses: [
        "Vou verificar o status do seu pedido. Pode me informar o número do pedido?",
      ],
      actions: ["show_order_tracking"],
    },
    {
      name: "return_policy",
      patterns: ["política de devolução", "como devolver", "prazo de devolução"],
      responses: [
        "Nossa política de devolução permite devoluções em até 30 dias. Gostaria de iniciar uma devolução?",
      ],
      actions: ["show_return_policy", "start_return"],
    },
  ];
}
