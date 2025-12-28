// Voice Commerce and Accessibility Features System

export interface VoiceCommand {
  id: string;
  command: string;
  intent:
    | "search"
    | "add_to_cart"
    | "checkout"
    | "track_order"
    | "customer_service"
    | "product_info"
    | "navigation";
  entities: {
    type: string;
    value: string;
    confidence: number;
  }[];
  response: string;
  action?: {
    type: string;
    params: Record<string, any>;
  };
  timestamp: Date;
}

export interface VoiceSession {
  id: string;
  userId?: string;
  startedAt: Date;
  endedAt?: Date;
  commands: VoiceCommand[];
  context: {
    currentPage?: string;
    cart?: any[];
    lastProduct?: string;
  };
  language: string;
  voiceProfile?: {
    gender: "male" | "female" | "neutral";
    age: "child" | "adult" | "senior";
    accent?: string;
  };
}

export interface AccessibilitySettings {
  userId: string;
  vision: {
    screenReader: boolean;
    highContrast: boolean;
    largeText: boolean;
    fontSize: number; // percentage
    colorBlindMode?: "protanopia" | "deuteranopia" | "tritanopia" | "none";
  };
  motor: {
    keyboardOnly: boolean;
    voiceControl: boolean;
    slowAnimations: boolean;
    largeClickTargets: boolean;
  };
  cognitive: {
    simplifiedLayout: boolean;
    reducedMotion: boolean;
    focusIndicators: boolean;
    readingGuide: boolean;
  };
  hearing: {
    captions: boolean;
    visualAlerts: boolean;
    transcripts: boolean;
  };
}

export interface VoiceProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  availability: "in_stock" | "low_stock" | "out_of_stock";
  voiceDescription: string; // Optimized for voice
  alternativeNames: string[]; // For better voice recognition
}

// Mock voice sessions
export const voiceSessions: VoiceSession[] = [];

// Process voice command
export function processVoiceCommand(
  sessionId: string,
  audioInput: string
): VoiceCommand {
  // Mock speech-to-text (in production, use Google Speech-to-Text, AWS Transcribe, etc.)
  const transcript = audioInput.toLowerCase();

  // Intent classification (mock - in production, use NLP model)
  let intent: VoiceCommand["intent"] = "search";
  let response = "";
  let action: VoiceCommand["action"] | undefined;

  const entities: VoiceCommand["entities"] = [];

  // Search intent
  if (
    transcript.includes("procurar") ||
    transcript.includes("buscar") ||
    transcript.includes("encontrar")
  ) {
    intent = "search";

    // Extract product name
    const productMatch = transcript.match(
      /(?:procurar|buscar|encontrar)\s+(.+)/
    );
    if (productMatch) {
      entities.push({
        type: "product",
        value: productMatch[1],
        confidence: 0.85,
      });
      response = `Procurando por "${productMatch[1]}"...`;
      action = {
        type: "search",
        params: { query: productMatch[1] },
      };
    }
  }

  // Add to cart intent
  else if (
    transcript.includes("adicionar") ||
    transcript.includes("colocar no carrinho")
  ) {
    intent = "add_to_cart";

    const productMatch = transcript.match(/adicionar\s+(.+?)(?:\s+ao\s+carrinho)?/);
    if (productMatch) {
      entities.push({
        type: "product",
        value: productMatch[1],
        confidence: 0.80,
      });
      response = `Adicionando "${productMatch[1]}" ao carrinho...`;
      action = {
        type: "add_to_cart",
        params: { product: productMatch[1] },
      };
    }
  }

  // Checkout intent
  else if (
    transcript.includes("finalizar") ||
    transcript.includes("comprar") ||
    transcript.includes("checkout")
  ) {
    intent = "checkout";
    response = "Redirecionando para o checkout...";
    action = {
      type: "navigate",
      params: { page: "/checkout" },
    };
  }

  // Track order intent
  else if (
    transcript.includes("rastrear") ||
    transcript.includes("onde está") ||
    transcript.includes("status do pedido")
  ) {
    intent = "track_order";

    const orderMatch = transcript.match(/pedido\s+(\w+)/);
    if (orderMatch) {
      entities.push({
        type: "order_id",
        value: orderMatch[1],
        confidence: 0.90,
      });
      response = `Rastreando pedido ${orderMatch[1]}...`;
      action = {
        type: "track_order",
        params: { orderId: orderMatch[1] },
      };
    } else {
      response = "Mostrando seus pedidos recentes...";
      action = {
        type: "navigate",
        params: { page: "/meus-pedidos" },
      };
    }
  }

  // Product info intent
  else if (
    transcript.includes("informações") ||
    transcript.includes("detalhes") ||
    transcript.includes("sobre")
  ) {
    intent = "product_info";
    response = "Mostrando informações do produto...";
  }

  // Customer service intent
  else if (
    transcript.includes("ajuda") ||
    transcript.includes("suporte") ||
    transcript.includes("falar com atendente")
  ) {
    intent = "customer_service";
    response = "Conectando você com o suporte...";
    action = {
      type: "open_chat",
      params: {},
    };
  }

  // Navigation intent
  else if (
    transcript.includes("ir para") ||
    transcript.includes("abrir") ||
    transcript.includes("mostrar")
  ) {
    intent = "navigation";

    if (transcript.includes("carrinho")) {
      response = "Abrindo carrinho...";
      action = {
        type: "navigate",
        params: { page: "/carrinho" },
      };
    } else if (transcript.includes("favoritos")) {
      response = "Abrindo favoritos...";
      action = {
        type: "navigate",
        params: { page: "/favoritos" },
      };
    } else if (transcript.includes("conta")) {
      response = "Abrindo sua conta...";
      action = {
        type: "navigate",
        params: { page: "/minha-conta" },
      };
    }
  }

  // Default
  else {
    response = "Desculpe, não entendi. Pode repetir?";
  }

  const command: VoiceCommand = {
    id: `cmd-${Date.now()}`,
    command: transcript,
    intent,
    entities,
    response,
    action,
    timestamp: new Date(),
  };

  // Add to session
  const session = voiceSessions.find((s) => s.id === sessionId);
  if (session) {
    session.commands.push(command);
  }

  return command;
}

// Start voice session
export function startVoiceSession(userId?: string): VoiceSession {
  const session: VoiceSession = {
    id: `vsess-${Date.now()}`,
    userId,
    startedAt: new Date(),
    commands: [],
    context: {},
    language: "pt-BR",
  };

  voiceSessions.push(session);

  return session;
}

// End voice session
export function endVoiceSession(sessionId: string): boolean {
  const session = voiceSessions.find((s) => s.id === sessionId);
  if (!session) return false;

  session.endedAt = new Date();
  return true;
}

// Voice shopping assistant
export interface VoiceAssistant {
  personality: "friendly" | "professional" | "casual";
  voice: "male" | "female" | "neutral";
  language: string;
  responses: {
    greeting: string[];
    farewell: string[];
    confirmation: string[];
    error: string[];
    help: string[];
  };
}

export const voiceAssistant: VoiceAssistant = {
  personality: "friendly",
  voice: "female",
  language: "pt-BR",
  responses: {
    greeting: [
      "Olá! Como posso ajudar você hoje?",
      "Bem-vindo! O que você gostaria de encontrar?",
      "Oi! Estou aqui para ajudar. O que você procura?",
    ],
    farewell: [
      "Até logo! Volte sempre!",
      "Foi um prazer ajudar! Até a próxima!",
      "Tchau! Espero vê-lo em breve!",
    ],
    confirmation: [
      "Perfeito! Feito!",
      "Tudo certo!",
      "Pronto! Mais alguma coisa?",
    ],
    error: [
      "Desculpe, não entendi. Pode repetir?",
      "Ops! Não consegui processar isso. Tente novamente?",
      "Hmm, não entendi bem. Pode reformular?",
    ],
    help: [
      "Você pode me pedir para buscar produtos, adicionar ao carrinho, finalizar compra, rastrear pedidos ou falar com o suporte.",
      "Posso ajudar você a encontrar produtos, gerenciar seu carrinho, fazer pedidos e muito mais!",
      "Experimente dizer: 'Buscar difusor aromático' ou 'Adicionar ao carrinho' ou 'Finalizar compra'.",
    ],
  },
};

// Generate voice response
export function generateVoiceResponse(
  text: string,
  voice: "male" | "female" | "neutral" = "female"
): string {
  // Mock text-to-speech (in production, use Google TTS, AWS Polly, etc.)
  // Return audio URL
  return `/api/tts?text=${encodeURIComponent(text)}&voice=${voice}`;
}

// Accessibility features
export const defaultAccessibilitySettings: AccessibilitySettings = {
  userId: "",
  vision: {
    screenReader: false,
    highContrast: false,
    largeText: false,
    fontSize: 100,
    colorBlindMode: "none",
  },
  motor: {
    keyboardOnly: false,
    voiceControl: false,
    slowAnimations: false,
    largeClickTargets: false,
  },
  cognitive: {
    simplifiedLayout: false,
    reducedMotion: false,
    focusIndicators: true,
    readingGuide: false,
  },
  hearing: {
    captions: false,
    visualAlerts: false,
    transcripts: false,
  },
};

// Save accessibility settings
export const accessibilitySettings: Map<string, AccessibilitySettings> =
  new Map();

export function saveAccessibilitySettings(
  settings: AccessibilitySettings
): boolean {
  accessibilitySettings.set(settings.userId, settings);
  return true;
}

// Get accessibility settings
export function getAccessibilitySettings(
  userId: string
): AccessibilitySettings {
  return (
    accessibilitySettings.get(userId) || {
      ...defaultAccessibilitySettings,
      userId,
    }
  );
}

// ARIA labels generator
export function generateARIALabels(element: {
  type: "button" | "link" | "input" | "image" | "product";
  content: string;
  context?: string;
}): {
  "aria-label": string;
  "aria-describedby"?: string;
  role?: string;
} {
  let ariaLabel = "";
  let role: string | undefined;

  switch (element.type) {
    case "button":
      ariaLabel = `Botão: ${element.content}`;
      role = "button";
      break;
    case "link":
      ariaLabel = `Link para ${element.content}`;
      role = "link";
      break;
    case "input":
      ariaLabel = `Campo de entrada: ${element.content}`;
      role = "textbox";
      break;
    case "image":
      ariaLabel = `Imagem: ${element.content}`;
      role = "img";
      break;
    case "product":
      ariaLabel = `Produto: ${element.content}${
        element.context ? `. ${element.context}` : ""
      }`;
      role = "article";
      break;
  }

  return {
    "aria-label": ariaLabel,
    role,
  };
}

// Keyboard navigation shortcuts
export interface KeyboardShortcut {
  key: string;
  modifiers?: ("ctrl" | "alt" | "shift")[];
  action: string;
  description: string;
}

export const keyboardShortcuts: KeyboardShortcut[] = [
  {
    key: "/",
    action: "focus_search",
    description: "Focar na busca",
  },
  {
    key: "c",
    modifiers: ["alt"],
    action: "open_cart",
    description: "Abrir carrinho",
  },
  {
    key: "f",
    modifiers: ["alt"],
    action: "open_favorites",
    description: "Abrir favoritos",
  },
  {
    key: "h",
    modifiers: ["alt"],
    action: "go_home",
    description: "Ir para página inicial",
  },
  {
    key: "?",
    modifiers: ["shift"],
    action: "show_shortcuts",
    description: "Mostrar atalhos",
  },
  {
    key: "Escape",
    action: "close_modal",
    description: "Fechar modal/diálogo",
  },
];

// Screen reader announcements
export interface ScreenReaderAnnouncement {
  message: string;
  priority: "polite" | "assertive";
  timestamp: Date;
}

export const screenReaderAnnouncements: ScreenReaderAnnouncement[] = [];

export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
): void {
  screenReaderAnnouncements.push({
    message,
    priority,
    timestamp: new Date(),
  });

  // In production, update ARIA live region
}

// Voice search optimization
export function optimizeForVoiceSearch(productName: string): {
  primaryName: string;
  alternativeNames: string[];
  voiceDescription: string;
} {
  // Generate alternative names for better voice recognition
  const alternativeNames: string[] = [];

  // Remove special characters
  const cleanName = productName.replace(/[^\w\s]/g, "");
  alternativeNames.push(cleanName);

  // Add common variations
  if (productName.includes("Difusor")) {
    alternativeNames.push("Difusor de aroma");
    alternativeNames.push("Difusor de ambiente");
    alternativeNames.push("Aromatizador");
  }

  // Generate voice-optimized description
  const voiceDescription = `${productName}. Um produto de alta qualidade para seu bem-estar.`;

  return {
    primaryName: productName,
    alternativeNames,
    voiceDescription,
  };
}

// Voice analytics
export interface VoiceAnalytics {
  totalSessions: number;
  totalCommands: number;
  successRate: number;
  averageSessionDuration: number; // seconds
  topIntents: {
    intent: string;
    count: number;
    percentage: number;
  }[];
  topCommands: {
    command: string;
    count: number;
  }[];
  conversionRate: number; // % of sessions that resulted in purchase
}

export function getVoiceAnalytics(): VoiceAnalytics {
  const totalSessions = voiceSessions.length;
  const totalCommands = voiceSessions.reduce(
    (sum, s) => sum + s.commands.length,
    0
  );

  // Calculate success rate (commands with actions)
  const successfulCommands = voiceSessions.reduce(
    (sum, s) => sum + s.commands.filter((c) => c.action).length,
    0
  );

  // Intent distribution
  const intentCounts = new Map<string, number>();
  for (const session of voiceSessions) {
    for (const command of session.commands) {
      intentCounts.set(
        command.intent,
        (intentCounts.get(command.intent) || 0) + 1
      );
    }
  }

  const topIntents = Array.from(intentCounts.entries())
    .map(([intent, count]) => ({
      intent,
      count,
      percentage: (count / totalCommands) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalSessions,
    totalCommands,
    successRate: (successfulCommands / Math.max(1, totalCommands)) * 100,
    averageSessionDuration: 180, // Mock
    topIntents,
    topCommands: [], // Mock
    conversionRate: 15.5, // Mock
  };
}

// Multilingual voice support
export interface VoiceLanguage {
  code: string;
  name: string;
  voices: {
    id: string;
    name: string;
    gender: "male" | "female" | "neutral";
    accent?: string;
  }[];
  commands: {
    search: string[];
    addToCart: string[];
    checkout: string[];
    help: string[];
  };
}

export const supportedVoiceLanguages: VoiceLanguage[] = [
  {
    code: "pt-BR",
    name: "Português (Brasil)",
    voices: [
      { id: "pt-BR-female-1", name: "Camila", gender: "female" },
      { id: "pt-BR-male-1", name: "Ricardo", gender: "male" },
    ],
    commands: {
      search: ["procurar", "buscar", "encontrar", "pesquisar"],
      addToCart: ["adicionar", "colocar no carrinho", "quero"],
      checkout: ["finalizar", "comprar", "pagar", "checkout"],
      help: ["ajuda", "socorro", "não entendi", "o que posso fazer"],
    },
  },
  {
    code: "en-US",
    name: "English (US)",
    voices: [
      { id: "en-US-female-1", name: "Samantha", gender: "female" },
      { id: "en-US-male-1", name: "Alex", gender: "male" },
    ],
    commands: {
      search: ["search", "find", "look for", "show me"],
      addToCart: ["add", "add to cart", "I want", "put in cart"],
      checkout: ["checkout", "buy", "purchase", "pay"],
      help: ["help", "what can you do", "assist me"],
    },
  },
];

// Voice commerce conversion tracking
export interface VoiceConversion {
  sessionId: string;
  userId?: string;
  startedAt: Date;
  completedAt: Date;
  steps: {
    step: "search" | "product_view" | "add_to_cart" | "checkout" | "purchase";
    timestamp: Date;
    voiceCommand?: string;
  }[];
  orderValue: number;
  orderItems: number;
}

export const voiceConversions: VoiceConversion[] = [];

// Track voice conversion
export function trackVoiceConversion(
  sessionId: string,
  step: VoiceConversion["steps"][0]["step"],
  voiceCommand?: string
): void {
  let conversion = voiceConversions.find((c) => c.sessionId === sessionId);

  if (!conversion) {
    conversion = {
      sessionId,
      startedAt: new Date(),
      completedAt: new Date(),
      steps: [],
      orderValue: 0,
      orderItems: 0,
    };
    voiceConversions.push(conversion);
  }

  conversion.steps.push({
    step,
    timestamp: new Date(),
    voiceCommand,
  });

  if (step === "purchase") {
    conversion.completedAt = new Date();
  }
}
