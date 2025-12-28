// AI Chatbot and Virtual Assistant System

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    entities?: Record<string, any>;
    suggestedActions?: string[];
  };
}

export interface ChatSession {
  id: string;
  userId?: string;
  startedAt: Date;
  endedAt?: Date;
  messages: ChatMessage[];
  context: {
    currentPage?: string;
    cart?: any[];
    lastProduct?: string;
    userInfo?: {
      name?: string;
      email?: string;
      orderHistory?: number;
    };
  };
  satisfaction?: {
    rating: number; // 1-5
    feedback?: string;
  };
  resolved: boolean;
  handoffToHuman: boolean;
}

export interface AIIntent {
  name: string;
  confidence: number;
  entities: {
    type: string;
    value: string;
    confidence: number;
  }[];
}

export interface AIResponse {
  text: string;
  intent: string;
  confidence: number;
  suggestedActions?: {
    type: "navigate" | "add_to_cart" | "show_product" | "apply_coupon" | "contact_support";
    label: string;
    params: Record<string, any>;
  }[];
  quickReplies?: string[];
}

// Mock chat sessions
export const chatSessions: ChatSession[] = [];

// Process user message with AI
export async function processAIMessage(
  sessionId: string,
  userMessage: string
): Promise<AIResponse> {
  const session = chatSessions.find((s) => s.id === sessionId);
  if (!session) {
    throw new Error("Session not found");
  }

  // Add user message to session
  const userMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    sessionId,
    role: "user",
    content: userMessage,
    timestamp: new Date(),
  };
  session.messages.push(userMsg);

  // Detect intent (mock - in production, use OpenAI, Dialogflow, etc.)
  const intent = detectIntent(userMessage);

  // Generate response based on intent
  const response = await generateAIResponse(userMessage, intent, session);

  // Add assistant message to session
  const assistantMsg: ChatMessage = {
    id: `msg-${Date.now() + 1}`,
    sessionId,
    role: "assistant",
    content: response.text,
    timestamp: new Date(),
    metadata: {
      intent: response.intent,
      confidence: response.confidence,
      suggestedActions: response.suggestedActions?.map((a) => a.label),
    },
  };
  session.messages.push(assistantMsg);

  return response;
}

// Detect user intent
function detectIntent(message: string): AIIntent {
  const lowerMessage = message.toLowerCase();

  // Product search intent
  if (
    lowerMessage.includes("procurar") ||
    lowerMessage.includes("buscar") ||
    lowerMessage.includes("encontrar") ||
    lowerMessage.includes("produto")
  ) {
    return {
      name: "product_search",
      confidence: 0.85,
      entities: [
        {
          type: "product_category",
          value: "difusor",
          confidence: 0.80,
        },
      ],
    };
  }

  // Order tracking intent
  if (
    lowerMessage.includes("pedido") ||
    lowerMessage.includes("rastrear") ||
    lowerMessage.includes("onde está") ||
    lowerMessage.includes("status")
  ) {
    return {
      name: "order_tracking",
      confidence: 0.90,
      entities: [],
    };
  }

  // Shipping info intent
  if (
    lowerMessage.includes("frete") ||
    lowerMessage.includes("entrega") ||
    lowerMessage.includes("prazo") ||
    lowerMessage.includes("quanto tempo")
  ) {
    return {
      name: "shipping_info",
      confidence: 0.88,
      entities: [],
    };
  }

  // Return policy intent
  if (
    lowerMessage.includes("devolução") ||
    lowerMessage.includes("trocar") ||
    lowerMessage.includes("devolver") ||
    lowerMessage.includes("reembolso")
  ) {
    return {
      name: "return_policy",
      confidence: 0.92,
      entities: [],
    };
  }

  // Payment info intent
  if (
    lowerMessage.includes("pagamento") ||
    lowerMessage.includes("pagar") ||
    lowerMessage.includes("forma de pagamento") ||
    lowerMessage.includes("parcelamento")
  ) {
    return {
      name: "payment_info",
      confidence: 0.87,
      entities: [],
    };
  }

  // Coupon/discount intent
  if (
    lowerMessage.includes("cupom") ||
    lowerMessage.includes("desconto") ||
    lowerMessage.includes("promoção") ||
    lowerMessage.includes("oferta")
  ) {
    return {
      name: "coupon_request",
      confidence: 0.83,
      entities: [],
    };
  }

  // Product recommendation intent
  if (
    lowerMessage.includes("recomendar") ||
    lowerMessage.includes("sugerir") ||
    lowerMessage.includes("o que você indica") ||
    lowerMessage.includes("melhor produto")
  ) {
    return {
      name: "product_recommendation",
      confidence: 0.86,
      entities: [],
    };
  }

  // Greeting intent
  if (
    lowerMessage.includes("olá") ||
    lowerMessage.includes("oi") ||
    lowerMessage.includes("bom dia") ||
    lowerMessage.includes("boa tarde") ||
    lowerMessage.includes("boa noite")
  ) {
    return {
      name: "greeting",
      confidence: 0.95,
      entities: [],
    };
  }

  // Default fallback
  return {
    name: "fallback",
    confidence: 0.50,
    entities: [],
  };
}

// Generate AI response
async function generateAIResponse(
  userMessage: string,
  intent: AIIntent,
  session: ChatSession
): Promise<AIResponse> {
  let response: AIResponse;

  switch (intent.name) {
    case "greeting":
      response = {
        text: `Olá! 👋 Sou o assistente virtual da MundoPetZen. Como posso ajudar você hoje?`,
        intent: intent.name,
        confidence: intent.confidence,
        quickReplies: [
          "Procurar produtos",
          "Rastrear pedido",
          "Informações de entrega",
          "Falar com atendente",
        ],
      };
      break;

    case "product_search":
      response = {
        text: "Vou ajudar você a encontrar o produto perfeito! Temos uma grande variedade de difusores aromáticos, óleos essenciais e produtos de bem-estar. O que você procura especificamente?",
        intent: intent.name,
        confidence: intent.confidence,
        suggestedActions: [
          {
            type: "navigate",
            label: "Ver todos os produtos",
            params: { page: "/produtos" },
          },
          {
            type: "show_product",
            label: "Ver difusores",
            params: { category: "difusores" },
          },
        ],
        quickReplies: [
          "Difusores aromáticos",
          "Óleos essenciais",
          "Kits completos",
        ],
      };
      break;

    case "order_tracking":
      response = {
        text: "Posso ajudar você a rastrear seu pedido! Por favor, me informe o número do pedido ou posso mostrar seus pedidos recentes.",
        intent: intent.name,
        confidence: intent.confidence,
        suggestedActions: [
          {
            type: "navigate",
            label: "Ver meus pedidos",
            params: { page: "/meus-pedidos" },
          },
        ],
        quickReplies: ["Ver meus pedidos", "Informar número do pedido"],
      };
      break;

    case "shipping_info":
      response = {
        text: "Oferecemos várias opções de entrega:\n\n📦 **Frete Econômico**: 7-12 dias úteis - A partir de R$ 15,00\n🚀 **Frete Expresso**: 3-5 dias úteis - A partir de R$ 25,00\n⚡ **Frete Super Rápido**: 1-2 dias úteis - A partir de R$ 35,00\n\n✨ **Frete GRÁTIS** em compras acima de R$ 150,00!\n\nO prazo exato será calculado no checkout com base no seu CEP.",
        intent: intent.name,
        confidence: intent.confidence,
        quickReplies: ["Calcular frete", "Ver produtos"],
      };
      break;

    case "return_policy":
      response = {
        text: "Nossa política de devolução é bem simples:\n\n✅ **30 dias** para devolução ou troca\n✅ Produto em perfeito estado\n✅ Embalagem original\n✅ Reembolso total ou troca\n✅ Frete de devolução por nossa conta\n\nPara iniciar uma devolução, acesse 'Meus Pedidos' e selecione 'Solicitar Devolução'. Nosso time irá te ajudar!",
        intent: intent.name,
        confidence: intent.confidence,
        suggestedActions: [
          {
            type: "navigate",
            label: "Solicitar devolução",
            params: { page: "/meus-pedidos" },
          },
        ],
        quickReplies: ["Ver política completa", "Falar com atendente"],
      };
      break;

    case "payment_info":
      response = {
        text: "Aceitamos diversas formas de pagamento:\n\n💳 **Cartão de Crédito**: Visa, Master, Elo, Amex\n   • Parcelamento em até 12x sem juros\n\n📱 **PIX**: Desconto de 5% à vista\n   • Aprovação instantânea\n\n🧾 **Boleto Bancário**: Desconto de 3%\n   • Prazo de 1-3 dias úteis\n\n💰 **Carteira Digital**: PagSeguro, Mercado Pago\n\nTodas as transações são 100% seguras e criptografadas! 🔒",
        intent: intent.name,
        confidence: intent.confidence,
        quickReplies: ["Ver produtos", "Calcular parcelas"],
      };
      break;

    case "coupon_request":
      response = {
        text: "Ótima notícia! Temos cupons disponíveis:\n\n🎁 **BEMVINDO10**: 10% de desconto na primeira compra\n🎉 **FRETEGRATIS**: Frete grátis acima de R$ 100\n⚡ **FLASH20**: 20% em produtos selecionados\n\nVocê também pode participar do nosso **Programa de Fidelidade** e ganhar pontos em cada compra!",
        intent: intent.name,
        confidence: intent.confidence,
        suggestedActions: [
          {
            type: "apply_coupon",
            label: "Aplicar cupom BEMVINDO10",
            params: { code: "BEMVINDO10" },
          },
          {
            type: "navigate",
            label: "Ver programa de fidelidade",
            params: { page: "/programa-fidelidade" },
          },
        ],
        quickReplies: ["Aplicar cupom", "Ver promoções"],
      };
      break;

    case "product_recommendation":
      response = {
        text: "Com base nas suas preferências, recomendo:\n\n⭐ **Difusor Aromático Ultrassônico Zen** - R$ 129,90\n   • Mais vendido\n   • 7 cores de LED\n   • Desligamento automático\n\n🌿 **Kit Aromaterapia Completo** - R$ 249,80\n   • Difusor + 6 óleos essenciais\n   • Ótimo custo-benefício\n\n✨ **Difusor Premium com Bluetooth** - R$ 199,90\n   • Conecta com seu celular\n   • Som ambiente integrado\n\nQual te interessa mais?",
        intent: intent.name,
        confidence: intent.confidence,
        suggestedActions: [
          {
            type: "show_product",
            label: "Ver Difusor Zen",
            params: { productId: "difusor-aromatico" },
          },
          {
            type: "show_product",
            label: "Ver Kit Completo",
            params: { productId: "kit-aromaterapia" },
          },
        ],
        quickReplies: ["Difusor Zen", "Kit Completo", "Ver todos"],
      };
      break;

    case "fallback":
    default:
      response = {
        text: "Desculpe, não entendi muito bem. Posso ajudar você com:\n\n• Buscar produtos\n• Rastrear pedidos\n• Informações de entrega\n• Formas de pagamento\n• Devoluções e trocas\n• Cupons e promoções\n\nO que você gostaria de saber?",
        intent: "fallback",
        confidence: 0.50,
        quickReplies: [
          "Buscar produtos",
          "Rastrear pedido",
          "Falar com atendente",
        ],
      };
      break;
  }

  return response;
}

// Start chat session
export function startChatSession(userId?: string): ChatSession {
  const session: ChatSession = {
    id: `chat-${Date.now()}`,
    userId,
    startedAt: new Date(),
    messages: [],
    context: {},
    resolved: false,
    handoffToHuman: false,
  };

  // Add welcome message
  const welcomeMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    sessionId: session.id,
    role: "assistant",
    content: "Olá! 👋 Sou o assistente virtual da MundoPetZen. Como posso ajudar você hoje?",
    timestamp: new Date(),
  };
  session.messages.push(welcomeMsg);

  chatSessions.push(session);

  return session;
}

// End chat session
export function endChatSession(
  sessionId: string,
  satisfaction?: { rating: number; feedback?: string }
): boolean {
  const session = chatSessions.find((s) => s.id === sessionId);
  if (!session) return false;

  session.endedAt = new Date();
  session.satisfaction = satisfaction;

  return true;
}

// Handoff to human agent
export function handoffToHuman(sessionId: string, reason: string): boolean {
  const session = chatSessions.find((s) => s.id === sessionId);
  if (!session) return false;

  session.handoffToHuman = true;

  const handoffMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    sessionId,
    role: "system",
    content: `Transferindo para um atendente humano. Motivo: ${reason}`,
    timestamp: new Date(),
  };
  session.messages.push(handoffMsg);

  return true;
}

// Chatbot analytics
export interface ChatbotAnalytics {
  totalSessions: number;
  activeSessions: number;
  averageSessionDuration: number; // seconds
  averageMessagesPerSession: number;
  resolutionRate: number; // percentage
  satisfactionScore: number; // 1-5
  topIntents: {
    intent: string;
    count: number;
    percentage: number;
  }[];
  handoffRate: number; // percentage
  responseTime: number; // seconds
}

export function getChatbotAnalytics(): ChatbotAnalytics {
  const totalSessions = chatSessions.length;
  const activeSessions = chatSessions.filter((s) => !s.endedAt).length;

  const resolvedSessions = chatSessions.filter((s) => s.resolved).length;
  const handoffSessions = chatSessions.filter((s) => s.handoffToHuman).length;

  const satisfiedSessions = chatSessions.filter((s) => s.satisfaction);
  const avgSatisfaction =
    satisfiedSessions.length > 0
      ? satisfiedSessions.reduce((sum, s) => sum + (s.satisfaction?.rating || 0), 0) /
        satisfiedSessions.length
      : 0;

  // Intent distribution
  const intentCounts = new Map<string, number>();
  for (const session of chatSessions) {
    for (const message of session.messages) {
      if (message.metadata?.intent) {
        intentCounts.set(
          message.metadata.intent,
          (intentCounts.get(message.metadata.intent) || 0) + 1
        );
      }
    }
  }

  const totalIntents = Array.from(intentCounts.values()).reduce(
    (sum, count) => sum + count,
    0
  );

  const topIntents = Array.from(intentCounts.entries())
    .map(([intent, count]) => ({
      intent,
      count,
      percentage: (count / Math.max(1, totalIntents)) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalSessions,
    activeSessions,
    averageSessionDuration: 180, // Mock
    averageMessagesPerSession: 8.5, // Mock
    resolutionRate: (resolvedSessions / Math.max(1, totalSessions)) * 100,
    satisfactionScore: avgSatisfaction,
    topIntents,
    handoffRate: (handoffSessions / Math.max(1, totalSessions)) * 100,
    responseTime: 1.2, // Mock - seconds
  };
}

// Smart suggestions
export interface SmartSuggestion {
  type: "product" | "article" | "faq" | "action";
  title: string;
  description: string;
  relevance: number; // 0-100
  action?: {
    type: string;
    params: Record<string, any>;
  };
}

export function getSmartSuggestions(
  sessionId: string
): SmartSuggestion[] {
  const session = chatSessions.find((s) => s.id === sessionId);
  if (!session) return [];

  // Analyze conversation context
  const recentIntents = session.messages
    .filter((m) => m.metadata?.intent)
    .slice(-3)
    .map((m) => m.metadata!.intent);

  const suggestions: SmartSuggestion[] = [];

  // Product suggestions
  if (recentIntents.includes("product_search")) {
    suggestions.push({
      type: "product",
      title: "Difusor Aromático Ultrassônico Zen",
      description: "Nosso produto mais vendido - R$ 129,90",
      relevance: 95,
      action: {
        type: "show_product",
        params: { productId: "difusor-aromatico" },
      },
    });
  }

  // FAQ suggestions
  if (recentIntents.includes("shipping_info")) {
    suggestions.push({
      type: "faq",
      title: "Perguntas frequentes sobre entrega",
      description: "Veja as dúvidas mais comuns sobre prazos e frete",
      relevance: 85,
      action: {
        type: "navigate",
        params: { page: "/faq#entrega" },
      },
    });
  }

  // Article suggestions
  if (recentIntents.includes("product_recommendation")) {
    suggestions.push({
      type: "article",
      title: "Guia completo de aromaterapia",
      description: "Aprenda a escolher o difusor perfeito para você",
      relevance: 80,
      action: {
        type: "navigate",
        params: { page: "/blog/guia-aromaterapia" },
      },
    });
  }

  return suggestions.sort((a, b) => b.relevance - a.relevance);
}

// Sentiment analysis
export interface SentimentAnalysis {
  score: number; // -1 to 1 (negative to positive)
  magnitude: number; // 0 to infinity (strength)
  sentiment: "very_negative" | "negative" | "neutral" | "positive" | "very_positive";
}

export function analyzeSentiment(text: string): SentimentAnalysis {
  // Mock implementation - in production, use Google NLP, AWS Comprehend, etc.
  const lowerText = text.toLowerCase();

  let score = 0;

  // Positive words
  const positiveWords = [
    "ótimo",
    "excelente",
    "maravilhoso",
    "perfeito",
    "adorei",
    "amei",
    "bom",
    "legal",
    "obrigado",
  ];
  for (const word of positiveWords) {
    if (lowerText.includes(word)) score += 0.2;
  }

  // Negative words
  const negativeWords = [
    "ruim",
    "péssimo",
    "horrível",
    "problema",
    "erro",
    "não funciona",
    "decepcionado",
    "insatisfeito",
  ];
  for (const word of negativeWords) {
    if (lowerText.includes(word)) score -= 0.2;
  }

  score = Math.max(-1, Math.min(1, score));

  let sentiment: SentimentAnalysis["sentiment"];
  if (score >= 0.5) sentiment = "very_positive";
  else if (score >= 0.1) sentiment = "positive";
  else if (score >= -0.1) sentiment = "neutral";
  else if (score >= -0.5) sentiment = "negative";
  else sentiment = "very_negative";

  return {
    score,
    magnitude: Math.abs(score) * 2,
    sentiment,
  };
}

// Proactive chat triggers
export interface ProactiveTrigger {
  id: string;
  name: string;
  condition: {
    type: "time_on_page" | "exit_intent" | "cart_abandonment" | "scroll_depth" | "idle";
    value: number;
  };
  message: string;
  enabled: boolean;
  conversions: number;
  impressions: number;
}

export const proactiveTriggers: ProactiveTrigger[] = [
  {
    id: "trigger-001",
    name: "Exit Intent",
    condition: {
      type: "exit_intent",
      value: 1,
    },
    message: "Espera! Antes de sair, posso ajudar você a encontrar algo? 🎁",
    enabled: true,
    conversions: 234,
    impressions: 1567,
  },
  {
    id: "trigger-002",
    name: "Cart Abandonment",
    condition: {
      type: "cart_abandonment",
      value: 60, // seconds
    },
    message: "Vi que você tem itens no carrinho! Posso ajudar a finalizar sua compra? Use o cupom BEMVINDO10 para 10% de desconto! 🛒",
    enabled: true,
    conversions: 456,
    impressions: 2345,
  },
  {
    id: "trigger-003",
    name: "Time on Product Page",
    condition: {
      type: "time_on_page",
      value: 30, // seconds
    },
    message: "Está com dúvidas sobre este produto? Posso te ajudar! 😊",
    enabled: true,
    conversions: 189,
    impressions: 3456,
  },
];
