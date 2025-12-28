// Augmented Reality (AR) Product Visualization System

export interface ARModel {
  id: string;
  productId: string;
  format: "glb" | "usdz" | "gltf";
  fileUrl: string;
  fileSize: number; // bytes
  dimensions: {
    width: number; // meters
    height: number;
    depth: number;
  };
  scale: number;
  animations: string[];
  materials: string[];
  polycount: number;
  textureResolution: string;
  optimized: boolean;
}

export interface ARSession {
  id: string;
  userId?: string;
  productId: string;
  startedAt: Date;
  endedAt?: Date;
  duration: number; // seconds
  interactions: {
    type: "rotate" | "scale" | "move" | "screenshot" | "share";
    timestamp: Date;
  }[];
  placement: {
    surface: "floor" | "wall" | "table" | "outdoor";
    lighting: "bright" | "normal" | "dark";
    environment: "indoor" | "outdoor";
  };
  converted: boolean; // Did user add to cart?
  device: {
    type: "mobile" | "tablet" | "ar_glasses";
    os: "ios" | "android";
    arSupport: "arkit" | "arcore" | "webxr";
  };
}

export interface ARFeature {
  id: string;
  name: string;
  description: string;
  type: "visualization" | "measurement" | "customization" | "interaction";
  enabled: boolean;
  premium: boolean;
}

export interface VirtualTryOn {
  id: string;
  productId: string;
  userId: string;
  type: "room_placement" | "size_comparison" | "color_preview";
  photo?: string; // User's room photo
  result: string; // AR result image
  satisfied: boolean;
  feedback?: string;
  timestamp: Date;
}

export interface ARAnalytics {
  totalSessions: number;
  averageDuration: number; // seconds
  conversionRate: number; // percentage
  topProducts: {
    productId: string;
    productName: string;
    sessions: number;
    conversions: number;
    conversionRate: number;
  }[];
  deviceBreakdown: {
    ios: number;
    android: number;
  };
  placementSurfaces: {
    floor: number;
    table: number;
    wall: number;
    outdoor: number;
  };
  averageInteractions: number;
}

// AR models for products
export const arModels: ARModel[] = [
  {
    id: "ar-001",
    productId: "difusor-aromatico",
    format: "glb",
    fileUrl: "/models/difusor-zen.glb",
    fileSize: 2500000, // 2.5 MB
    dimensions: {
      width: 0.12, // 12 cm
      height: 0.15, // 15 cm
      depth: 0.12,
    },
    scale: 1.0,
    animations: ["steam_effect", "led_pulse"],
    materials: ["wood", "glass", "metal"],
    polycount: 15000,
    textureResolution: "2048x2048",
    optimized: true,
  },
];

// AR features available
export const arFeatures: ARFeature[] = [
  {
    id: "feat-001",
    name: "Visualização 3D",
    description: "Veja o produto em 3D de todos os ângulos",
    type: "visualization",
    enabled: true,
    premium: false,
  },
  {
    id: "feat-002",
    name: "AR em seu ambiente",
    description: "Coloque o produto virtualmente em sua casa",
    type: "visualization",
    enabled: true,
    premium: false,
  },
  {
    id: "feat-003",
    name: "Medição automática",
    description: "Meça automaticamente o espaço disponível",
    type: "measurement",
    enabled: true,
    premium: false,
  },
  {
    id: "feat-004",
    name: "Comparação de tamanho",
    description: "Compare com objetos do dia a dia",
    type: "measurement",
    enabled: true,
    premium: false,
  },
  {
    id: "feat-005",
    name: "Personalização em tempo real",
    description: "Mude cores e materiais ao vivo",
    type: "customization",
    enabled: true,
    premium: true,
  },
  {
    id: "feat-006",
    name: "Iluminação adaptativa",
    description: "Veja como o produto fica com diferentes iluminações",
    type: "visualization",
    enabled: true,
    premium: true,
  },
  {
    id: "feat-007",
    name: "Captura e compartilhamento",
    description: "Tire fotos e compartilhe nas redes sociais",
    type: "interaction",
    enabled: true,
    premium: false,
  },
  {
    id: "feat-008",
    name: "Múltiplos produtos",
    description: "Visualize vários produtos juntos",
    type: "visualization",
    enabled: true,
    premium: true,
  },
];

// Start AR session
export function startARSession(
  productId: string,
  userId?: string,
  device?: ARSession["device"]
): ARSession {
  const session: ARSession = {
    id: `ar-session-${Date.now()}`,
    userId,
    productId,
    startedAt: new Date(),
    duration: 0,
    interactions: [],
    placement: {
      surface: "floor",
      lighting: "normal",
      environment: "indoor",
    },
    converted: false,
    device: device || {
      type: "mobile",
      os: "ios",
      arSupport: "arkit",
    },
  };

  return session;
}

// End AR session
export function endARSession(
  sessionId: string,
  converted: boolean = false
): ARSession {
  // Mock implementation - find and update session
  const session = startARSession("difusor-aromatico");
  session.id = sessionId;
  session.endedAt = new Date();
  session.duration =
    (session.endedAt.getTime() - session.startedAt.getTime()) / 1000;
  session.converted = converted;

  return session;
}

// Track AR interaction
export function trackARInteraction(
  sessionId: string,
  interactionType: ARSession["interactions"][0]["type"]
): void {
  // Mock implementation
  console.log(`AR interaction tracked: ${sessionId} - ${interactionType}`);
}

// Check AR support
export interface ARSupport {
  supported: boolean;
  technology: "arkit" | "arcore" | "webxr" | "none";
  features: {
    planeDetection: boolean;
    lightEstimation: boolean;
    faceTracking: boolean;
    imageTracking: boolean;
    environmentTexturing: boolean;
    peopleOcclusion: boolean;
  };
  limitations: string[];
}

export function checkARSupport(
  userAgent: string,
  platform: string
): ARSupport {
  // Simplified detection - in production, use proper feature detection
  const isIOS = /iPhone|iPad|iPod/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);

  if (isIOS) {
    return {
      supported: true,
      technology: "arkit",
      features: {
        planeDetection: true,
        lightEstimation: true,
        faceTracking: true,
        imageTracking: true,
        environmentTexturing: true,
        peopleOcclusion: true,
      },
      limitations: ["Requires iOS 11+", "Better on iPhone 12+"],
    };
  } else if (isAndroid) {
    return {
      supported: true,
      technology: "arcore",
      features: {
        planeDetection: true,
        lightEstimation: true,
        faceTracking: false,
        imageTracking: true,
        environmentTexturing: true,
        peopleOcclusion: false,
      },
      limitations: ["Requires Android 7.0+", "ARCore compatible device"],
    };
  } else {
    return {
      supported: false,
      technology: "none",
      features: {
        planeDetection: false,
        lightEstimation: false,
        faceTracking: false,
        imageTracking: false,
        environmentTexturing: false,
        peopleOcclusion: false,
      },
      limitations: ["AR not supported on this device"],
    };
  }
}

// Generate AR Quick Look link (iOS)
export function generateARQuickLookLink(modelUrl: string): string {
  // iOS AR Quick Look format
  return `${modelUrl}#allowsContentScaling=0`;
}

// Generate Scene Viewer link (Android)
export function generateSceneViewerLink(
  modelUrl: string,
  title: string
): string {
  // Android Scene Viewer intent
  const encodedUrl = encodeURIComponent(modelUrl);
  const encodedTitle = encodeURIComponent(title);
  return `intent://arvr.google.com/scene-viewer/1.0?file=${encodedUrl}&mode=ar_preferred&title=${encodedTitle}#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`;
}

// Virtual try-on
export function createVirtualTryOn(
  productId: string,
  userId: string,
  type: VirtualTryOn["type"],
  photo?: string
): VirtualTryOn {
  return {
    id: `tryon-${Date.now()}`,
    productId,
    userId,
    type,
    photo,
    result: `/ar-results/${Date.now()}.jpg`,
    satisfied: false,
    timestamp: new Date(),
  };
}

// AR product recommendations
export interface ARRecommendation {
  productId: string;
  productName: string;
  reason: string;
  confidence: number; // 0-100
  arModelAvailable: boolean;
}

export function getARRecommendations(
  currentProductId: string,
  roomDimensions?: { width: number; height: number; depth: number }
): ARRecommendation[] {
  return [
    {
      productId: "oleo-lavanda",
      productName: "Óleo Essencial de Lavanda",
      reason: "Combina perfeitamente com o difusor",
      confidence: 95,
      arModelAvailable: true,
    },
    {
      productId: "suporte-difusor",
      productName: "Suporte Premium para Difusor",
      reason: "Eleva o difusor para melhor dispersão",
      confidence: 80,
      arModelAvailable: true,
    },
  ];
}

// AR analytics
export function getARAnalytics(): ARAnalytics {
  return {
    totalSessions: 1234,
    averageDuration: 145, // seconds
    conversionRate: 35.5, // Much higher than regular product views!
    topProducts: [
      {
        productId: "difusor-aromatico",
        productName: "Difusor Aromático Ultrassônico Zen",
        sessions: 567,
        conversions: 234,
        conversionRate: 41.3,
      },
      {
        productId: "luminaria-zen",
        productName: "Luminária Zen com Aromaterapia",
        sessions: 345,
        conversions: 112,
        conversionRate: 32.5,
      },
    ],
    deviceBreakdown: {
      ios: 65,
      android: 35,
    },
    placementSurfaces: {
      floor: 15,
      table: 60,
      wall: 5,
      outdoor: 20,
    },
    averageInteractions: 8.5,
  };
}

// AR measurement tool
export interface ARMeasurement {
  type: "distance" | "area" | "volume";
  value: number;
  unit: "cm" | "m" | "cm2" | "m2" | "cm3" | "m3";
  accuracy: number; // percentage
  points: {
    x: number;
    y: number;
    z: number;
  }[];
}

export function measureWithAR(
  points: ARMeasurement["points"],
  type: ARMeasurement["type"]
): ARMeasurement {
  // Mock implementation - in production, calculate from AR data
  let value = 0;
  let unit: ARMeasurement["unit"] = "cm";

  if (type === "distance") {
    // Calculate distance between two points
    if (points.length >= 2) {
      const dx = points[1].x - points[0].x;
      const dy = points[1].y - points[0].y;
      const dz = points[1].z - points[0].z;
      value = Math.sqrt(dx * dx + dy * dy + dz * dz) * 100; // Convert to cm
    }
  } else if (type === "area") {
    value = 2500; // Mock area in cm2
    unit = "cm2";
  } else if (type === "volume") {
    value = 125000; // Mock volume in cm3
    unit = "cm3";
  }

  return {
    type,
    value,
    unit,
    accuracy: 95,
    points,
  };
}

// AR social sharing
export interface ARShare {
  id: string;
  sessionId: string;
  userId: string;
  productId: string;
  image: string;
  platform: "instagram" | "facebook" | "twitter" | "whatsapp" | "pinterest";
  caption: string;
  hashtags: string[];
  sharedAt: Date;
  engagement: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

export function shareARExperience(
  sessionId: string,
  userId: string,
  productId: string,
  platform: ARShare["platform"],
  image: string
): ARShare {
  return {
    id: `share-${Date.now()}`,
    sessionId,
    userId,
    productId,
    image,
    platform,
    caption: "Olha que incrível! Testei este produto em AR na minha casa 🏠✨",
    hashtags: ["#MundoPetZen", "#AR", "#Aromaterapia", "#BemEstar"],
    sharedAt: new Date(),
    engagement: {
      views: 0,
      likes: 0,
      comments: 0,
      shares: 0,
    },
  };
}

// AR product customization
export interface ARCustomization {
  productId: string;
  options: {
    type: "color" | "material" | "size" | "pattern";
    name: string;
    value: string;
    preview: string; // texture/color preview
    price: number; // additional cost
  }[];
  currentSelection: Record<string, string>;
  totalPrice: number;
}

export function getARCustomizationOptions(
  productId: string
): ARCustomization {
  return {
    productId,
    options: [
      {
        type: "color",
        name: "Cor da Base",
        value: "wood_natural",
        preview: "#D2B48C",
        price: 0,
      },
      {
        type: "color",
        name: "Cor da Base",
        value: "wood_dark",
        preview: "#654321",
        price: 10.0,
      },
      {
        type: "color",
        name: "Cor da Base",
        value: "white",
        preview: "#FFFFFF",
        price: 0,
      },
      {
        type: "material",
        name: "Material do Topo",
        value: "glass",
        preview: "/materials/glass.jpg",
        price: 0,
      },
      {
        type: "material",
        name: "Material do Topo",
        value: "ceramic",
        preview: "/materials/ceramic.jpg",
        price: 15.0,
      },
      {
        type: "size",
        name: "Tamanho",
        value: "standard",
        preview: "12cm x 15cm",
        price: 0,
      },
      {
        type: "size",
        name: "Tamanho",
        value: "large",
        preview: "15cm x 20cm",
        price: 30.0,
      },
    ],
    currentSelection: {
      color: "wood_natural",
      material: "glass",
      size: "standard",
    },
    totalPrice: 129.9,
  };
}

// AR room scanner
export interface RoomScan {
  id: string;
  userId: string;
  roomType: "living_room" | "bedroom" | "bathroom" | "kitchen" | "office";
  dimensions: {
    width: number; // meters
    length: number;
    height: number;
    area: number; // m2
  };
  lighting: {
    natural: boolean;
    artificial: boolean;
    brightness: "dark" | "medium" | "bright";
  };
  furniture: {
    type: string;
    position: { x: number; y: number; z: number };
    dimensions: { width: number; height: number; depth: number };
  }[];
  walls: {
    color: string;
    texture: string;
  };
  floor: {
    material: string;
    color: string;
  };
  scannedAt: Date;
  recommendations: string[]; // Product IDs that fit well
}

export function scanRoom(userId: string): RoomScan {
  // Mock implementation - in production, use AR scanning
  return {
    id: `scan-${Date.now()}`,
    userId,
    roomType: "living_room",
    dimensions: {
      width: 4.5,
      length: 5.2,
      height: 2.8,
      area: 23.4,
    },
    lighting: {
      natural: true,
      artificial: true,
      brightness: "bright",
    },
    furniture: [
      {
        type: "sofa",
        position: { x: 1.0, y: 0, z: 2.0 },
        dimensions: { width: 2.0, height: 0.8, depth: 0.9 },
      },
      {
        type: "coffee_table",
        position: { x: 2.5, y: 0, z: 2.5 },
        dimensions: { width: 1.2, height: 0.4, depth: 0.6 },
      },
    ],
    walls: {
      color: "#F5F5DC",
      texture: "smooth",
    },
    floor: {
      material: "wood",
      color: "#8B4513",
    },
    scannedAt: new Date(),
    recommendations: ["difusor-aromatico", "luminaria-zen", "vela-aromatica"],
  };
}

// AR performance metrics
export interface ARPerformance {
  fps: number; // frames per second
  renderTime: number; // ms
  loadTime: number; // ms
  memoryUsage: number; // MB
  batteryImpact: "low" | "medium" | "high";
  quality: "low" | "medium" | "high" | "ultra";
}

export function getARPerformance(): ARPerformance {
  return {
    fps: 60,
    renderTime: 16.7,
    loadTime: 1200,
    memoryUsage: 150,
    batteryImpact: "medium",
    quality: "high",
  };
}
