// Mobile App Backend and Comprehensive REST API

export interface MobileAppUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  deviceInfo: DeviceInfo[];
  pushTokens: PushToken[];
  preferences: MobilePreferences;
  appVersion: string;
  lastActive: Date;
  createdAt: Date;
}

export interface DeviceInfo {
  id: string;
  platform: "ios" | "android";
  model: string;
  osVersion: string;
  appVersion: string;
  lastUsed: Date;
  isActive: boolean;
}

export interface PushToken {
  token: string;
  platform: "ios" | "android";
  createdAt: Date;
  isActive: boolean;
}

export interface MobilePreferences {
  notifications: {
    orders: boolean;
    promotions: boolean;
    newProducts: boolean;
    priceDrops: boolean;
    backInStock: boolean;
  };
  language: string;
  currency: string;
  theme: "light" | "dark" | "auto";
  biometricEnabled: boolean;
}

// API Endpoints
export interface APIEndpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  authentication: "required" | "optional" | "none";
  rateLimit: {
    requests: number;
    window: number; // seconds
  };
  parameters?: APIParameter[];
  requestBody?: Record<string, any>;
  response: Record<string, any>;
}

export interface APIParameter {
  name: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  required: boolean;
  description: string;
  example?: any;
}

// Comprehensive API Documentation
export function getAPIEndpoints(): APIEndpoint[] {
  return [
    // Authentication
    {
      method: "POST",
      path: "/api/v1/auth/register",
      description: "Register a new user",
      authentication: "none",
      rateLimit: { requests: 5, window: 3600 },
      requestBody: {
        email: "user@example.com",
        password: "********",
        name: "John Doe",
        phone: "+5511999999999",
      },
      response: {
        user: { id: "user-123", email: "user@example.com", name: "John Doe" },
        token: "jwt-token-here",
      },
    },
    {
      method: "POST",
      path: "/api/v1/auth/login",
      description: "Login with email and password",
      authentication: "none",
      rateLimit: { requests: 10, window: 3600 },
      requestBody: {
        email: "user@example.com",
        password: "********",
        deviceInfo: {
          platform: "ios",
          model: "iPhone 14",
          osVersion: "17.0",
        },
      },
      response: {
        user: { id: "user-123", email: "user@example.com", name: "John Doe" },
        token: "jwt-token-here",
        refreshToken: "refresh-token-here",
      },
    },
    {
      method: "POST",
      path: "/api/v1/auth/refresh",
      description: "Refresh access token",
      authentication: "required",
      rateLimit: { requests: 100, window: 3600 },
      requestBody: {
        refreshToken: "refresh-token-here",
      },
      response: {
        token: "new-jwt-token-here",
        refreshToken: "new-refresh-token-here",
      },
    },
    {
      method: "POST",
      path: "/api/v1/auth/logout",
      description: "Logout and invalidate tokens",
      authentication: "required",
      rateLimit: { requests: 100, window: 3600 },
      response: {
        success: true,
      },
    },
    
    // Products
    {
      method: "GET",
      path: "/api/v1/products",
      description: "Get list of products with pagination and filters",
      authentication: "optional",
      rateLimit: { requests: 100, window: 60 },
      parameters: [
        { name: "page", type: "number", required: false, description: "Page number", example: 1 },
        { name: "limit", type: "number", required: false, description: "Items per page", example: 20 },
        { name: "category", type: "string", required: false, description: "Filter by category" },
        { name: "minPrice", type: "number", required: false, description: "Minimum price" },
        { name: "maxPrice", type: "number", required: false, description: "Maximum price" },
        { name: "sort", type: "string", required: false, description: "Sort by: price_asc, price_desc, newest, popular" },
        { name: "search", type: "string", required: false, description: "Search query" },
      ],
      response: {
        products: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 1250,
          pages: 63,
        },
      },
    },
    {
      method: "GET",
      path: "/api/v1/products/:id",
      description: "Get product details by ID",
      authentication: "optional",
      rateLimit: { requests: 200, window: 60 },
      response: {
        id: "prod-123",
        name: "Difusor Aromático",
        price: 129.9,
        description: "...",
        images: [],
        stock: 50,
        reviews: [],
      },
    },
    {
      method: "GET",
      path: "/api/v1/products/:id/recommendations",
      description: "Get product recommendations",
      authentication: "optional",
      rateLimit: { requests: 100, window: 60 },
      response: {
        recommendations: [],
      },
    },
    
    // Cart
    {
      method: "GET",
      path: "/api/v1/cart",
      description: "Get user's cart",
      authentication: "required",
      rateLimit: { requests: 200, window: 60 },
      response: {
        items: [],
        subtotal: 259.8,
        shipping: 15.0,
        tax: 27.48,
        total: 302.28,
      },
    },
    {
      method: "POST",
      path: "/api/v1/cart/add",
      description: "Add item to cart",
      authentication: "required",
      rateLimit: { requests: 100, window: 60 },
      requestBody: {
        productId: "prod-123",
        quantity: 2,
        variantId: "variant-456",
      },
      response: {
        cart: {},
        message: "Item added to cart",
      },
    },
    {
      method: "PUT",
      path: "/api/v1/cart/update/:itemId",
      description: "Update cart item quantity",
      authentication: "required",
      rateLimit: { requests: 100, window: 60 },
      requestBody: {
        quantity: 3,
      },
      response: {
        cart: {},
      },
    },
    {
      method: "DELETE",
      path: "/api/v1/cart/remove/:itemId",
      description: "Remove item from cart",
      authentication: "required",
      rateLimit: { requests: 100, window: 60 },
      response: {
        cart: {},
        message: "Item removed from cart",
      },
    },
    
    // Orders
    {
      method: "GET",
      path: "/api/v1/orders",
      description: "Get user's orders",
      authentication: "required",
      rateLimit: { requests: 100, window: 60 },
      parameters: [
        { name: "page", type: "number", required: false, description: "Page number" },
        { name: "limit", type: "number", required: false, description: "Items per page" },
        { name: "status", type: "string", required: false, description: "Filter by status" },
      ],
      response: {
        orders: [],
        pagination: {},
      },
    },
    {
      method: "GET",
      path: "/api/v1/orders/:id",
      description: "Get order details",
      authentication: "required",
      rateLimit: { requests: 200, window: 60 },
      response: {
        id: "order-123",
        orderNumber: "ORD12345678",
        status: "shipped",
        items: [],
        total: 302.28,
        tracking: {
          code: "BR123456789",
          status: "in_transit",
          updates: [],
        },
      },
    },
    {
      method: "POST",
      path: "/api/v1/orders/create",
      description: "Create new order",
      authentication: "required",
      rateLimit: { requests: 20, window: 3600 },
      requestBody: {
        items: [],
        shippingAddress: {},
        paymentMethod: "credit_card",
        paymentDetails: {},
      },
      response: {
        order: {},
        payment: {
          status: "success",
          transactionId: "txn-123",
        },
      },
    },
    
    // User Profile
    {
      method: "GET",
      path: "/api/v1/user/profile",
      description: "Get user profile",
      authentication: "required",
      rateLimit: { requests: 100, window: 60 },
      response: {
        id: "user-123",
        email: "user@example.com",
        name: "John Doe",
        avatar: "...",
        addresses: [],
        paymentMethods: [],
      },
    },
    {
      method: "PUT",
      path: "/api/v1/user/profile",
      description: "Update user profile",
      authentication: "required",
      rateLimit: { requests: 50, window: 3600 },
      requestBody: {
        name: "John Doe",
        phone: "+5511999999999",
        avatar: "base64-image-data",
      },
      response: {
        user: {},
        message: "Profile updated successfully",
      },
    },
    
    // Wishlist
    {
      method: "GET",
      path: "/api/v1/wishlist",
      description: "Get user's wishlist",
      authentication: "required",
      rateLimit: { requests: 100, window: 60 },
      response: {
        items: [],
        total: 15,
      },
    },
    {
      method: "POST",
      path: "/api/v1/wishlist/add",
      description: "Add item to wishlist",
      authentication: "required",
      rateLimit: { requests: 100, window: 60 },
      requestBody: {
        productId: "prod-123",
      },
      response: {
        message: "Item added to wishlist",
      },
    },
    {
      method: "DELETE",
      path: "/api/v1/wishlist/remove/:productId",
      description: "Remove item from wishlist",
      authentication: "required",
      rateLimit: { requests: 100, window: 60 },
      response: {
        message: "Item removed from wishlist",
      },
    },
    
    // Reviews
    {
      method: "GET",
      path: "/api/v1/products/:id/reviews",
      description: "Get product reviews",
      authentication: "optional",
      rateLimit: { requests: 100, window: 60 },
      parameters: [
        { name: "page", type: "number", required: false, description: "Page number" },
        { name: "sort", type: "string", required: false, description: "Sort by: recent, helpful, rating" },
      ],
      response: {
        reviews: [],
        stats: {
          average: 4.5,
          total: 285,
          distribution: { 5: 150, 4: 85, 3: 30, 2: 15, 1: 5 },
        },
      },
    },
    {
      method: "POST",
      path: "/api/v1/products/:id/reviews",
      description: "Submit product review",
      authentication: "required",
      rateLimit: { requests: 10, window: 3600 },
      requestBody: {
        rating: 5,
        title: "Excellent product!",
        comment: "Really loved this product...",
        images: [],
      },
      response: {
        review: {},
        message: "Review submitted successfully",
      },
    },
    
    // Notifications
    {
      method: "GET",
      path: "/api/v1/notifications",
      description: "Get user notifications",
      authentication: "required",
      rateLimit: { requests: 100, window: 60 },
      parameters: [
        { name: "unreadOnly", type: "boolean", required: false, description: "Show only unread" },
      ],
      response: {
        notifications: [],
        unreadCount: 5,
      },
    },
    {
      method: "PUT",
      path: "/api/v1/notifications/:id/read",
      description: "Mark notification as read",
      authentication: "required",
      rateLimit: { requests: 200, window: 60 },
      response: {
        success: true,
      },
    },
    {
      method: "POST",
      path: "/api/v1/push/register",
      description: "Register device for push notifications",
      authentication: "required",
      rateLimit: { requests: 50, window: 3600 },
      requestBody: {
        token: "push-token-here",
        platform: "ios",
        deviceInfo: {},
      },
      response: {
        success: true,
      },
    },
    
    // Search
    {
      method: "GET",
      path: "/api/v1/search",
      description: "Search products",
      authentication: "optional",
      rateLimit: { requests: 100, window: 60 },
      parameters: [
        { name: "q", type: "string", required: true, description: "Search query" },
        { name: "filters", type: "object", required: false, description: "Search filters" },
      ],
      response: {
        results: [],
        suggestions: [],
        facets: {},
      },
    },
    {
      method: "GET",
      path: "/api/v1/search/suggestions",
      description: "Get search suggestions",
      authentication: "optional",
      rateLimit: { requests: 200, window: 60 },
      parameters: [
        { name: "q", type: "string", required: true, description: "Partial query" },
      ],
      response: {
        suggestions: ["difusor aromático", "difusor ultrassônico"],
      },
    },
    
    // Loyalty
    {
      method: "GET",
      path: "/api/v1/loyalty/points",
      description: "Get user's loyalty points",
      authentication: "required",
      rateLimit: { requests: 100, window: 60 },
      response: {
        points: 2500,
        lifetimePoints: 8500,
        tier: "gold",
        nextTier: {
          tier: "platinum",
          pointsNeeded: 6500,
        },
      },
    },
    {
      method: "GET",
      path: "/api/v1/loyalty/rewards",
      description: "Get available rewards",
      authentication: "required",
      rateLimit: { requests: 100, window: 60 },
      response: {
        rewards: [],
      },
    },
    {
      method: "POST",
      path: "/api/v1/loyalty/redeem",
      description: "Redeem loyalty reward",
      authentication: "required",
      rateLimit: { requests: 20, window: 3600 },
      requestBody: {
        rewardId: "reward-123",
      },
      response: {
        success: true,
        coupon: {
          code: "LOYALTY10",
          discount: 10,
          expiresAt: "2025-01-31",
        },
      },
    },
  ];
}

// API Response Wrapper
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

// API Rate Limiting
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
  retryAfter?: number; // seconds
}

// Webhook Events
export interface WebhookEvent {
  id: string;
  type: string;
  data: any;
  timestamp: Date;
  signature: string;
}

export function getWebhookEvents(): string[] {
  return [
    "order.created",
    "order.updated",
    "order.shipped",
    "order.delivered",
    "order.canceled",
    "payment.succeeded",
    "payment.failed",
    "product.created",
    "product.updated",
    "product.deleted",
    "user.registered",
    "user.updated",
    "review.submitted",
    "review.approved",
    "inventory.low_stock",
    "inventory.out_of_stock",
  ];
}

// Mobile App Features
export interface MobileAppFeature {
  id: string;
  name: string;
  description: string;
  platform: "ios" | "android" | "both";
  minVersion: string;
  status: "active" | "beta" | "deprecated";
}

export function getMobileAppFeatures(): MobileAppFeature[] {
  return [
    {
      id: "biometric_auth",
      name: "Biometric Authentication",
      description: "Login with Face ID / Touch ID / Fingerprint",
      platform: "both",
      minVersion: "1.0.0",
      status: "active",
    },
    {
      id: "push_notifications",
      name: "Push Notifications",
      description: "Real-time notifications for orders, promotions, etc.",
      platform: "both",
      minVersion: "1.0.0",
      status: "active",
    },
    {
      id: "offline_mode",
      name: "Offline Mode",
      description: "Browse products and cart offline",
      platform: "both",
      minVersion: "1.2.0",
      status: "active",
    },
    {
      id: "ar_preview",
      name: "AR Product Preview",
      description: "View products in augmented reality",
      platform: "both",
      minVersion: "2.0.0",
      status: "beta",
    },
    {
      id: "voice_search",
      name: "Voice Search",
      description: "Search products using voice",
      platform: "both",
      minVersion: "1.5.0",
      status: "active",
    },
    {
      id: "barcode_scanner",
      name: "Barcode Scanner",
      description: "Scan product barcodes to add to cart",
      platform: "both",
      minVersion: "1.3.0",
      status: "active",
    },
    {
      id: "social_sharing",
      name: "Social Sharing",
      description: "Share products on social media",
      platform: "both",
      minVersion: "1.0.0",
      status: "active",
    },
    {
      id: "wishlist_sync",
      name: "Wishlist Sync",
      description: "Sync wishlist across devices",
      platform: "both",
      minVersion: "1.0.0",
      status: "active",
    },
    {
      id: "order_tracking",
      name: "Real-time Order Tracking",
      description: "Track orders in real-time with map",
      platform: "both",
      minVersion: "1.4.0",
      status: "active",
    },
    {
      id: "chat_support",
      name: "In-App Chat Support",
      description: "Chat with customer support",
      platform: "both",
      minVersion: "1.1.0",
      status: "active",
    },
  ];
}

// API Analytics
export interface APIAnalytics {
  totalRequests: number;
  successRate: number;
  avgResponseTime: number; // ms
  topEndpoints: {
    endpoint: string;
    requests: number;
    avgResponseTime: number;
  }[];
  errorRate: number;
  rateLimitHits: number;
  uniqueUsers: number;
  mobileAppUsers: {
    ios: number;
    android: number;
  };
}

export function getAPIAnalytics(): APIAnalytics {
  return {
    totalRequests: 12500000,
    successRate: 99.8,
    avgResponseTime: 85,
    topEndpoints: [
      {
        endpoint: "/api/v1/products",
        requests: 2850000,
        avgResponseTime: 65,
      },
      {
        endpoint: "/api/v1/products/:id",
        requests: 1985000,
        avgResponseTime: 45,
      },
      {
        endpoint: "/api/v1/cart",
        requests: 985000,
        avgResponseTime: 55,
      },
      {
        endpoint: "/api/v1/search",
        requests: 785000,
        avgResponseTime: 125,
      },
      {
        endpoint: "/api/v1/orders",
        requests: 485000,
        avgResponseTime: 95,
      },
    ],
    errorRate: 0.2,
    rateLimitHits: 2850,
    uniqueUsers: 125000,
    mobileAppUsers: {
      ios: 68500,
      android: 56500,
    },
  };
}

// SDK Information
export interface SDKInfo {
  platform: "ios" | "android" | "react-native" | "flutter";
  language: string;
  version: string;
  repository: string;
  documentation: string;
  features: string[];
}

export function getSDKs(): SDKInfo[] {
  return [
    {
      platform: "ios",
      language: "Swift",
      version: "2.0.0",
      repository: "https://github.com/mundopetzen/ios-sdk",
      documentation: "https://docs.mundopetzen.com/sdk/ios",
      features: [
        "Complete API wrapper",
        "Automatic token refresh",
        "Offline caching",
        "Image optimization",
        "Push notifications",
      ],
    },
    {
      platform: "android",
      language: "Kotlin",
      version: "2.0.0",
      repository: "https://github.com/mundopetzen/android-sdk",
      documentation: "https://docs.mundopetzen.com/sdk/android",
      features: [
        "Complete API wrapper",
        "Automatic token refresh",
        "Offline caching",
        "Image optimization",
        "Push notifications",
      ],
    },
    {
      platform: "react-native",
      language: "TypeScript",
      version: "1.5.0",
      repository: "https://github.com/mundopetzen/react-native-sdk",
      documentation: "https://docs.mundopetzen.com/sdk/react-native",
      features: [
        "Cross-platform support",
        "TypeScript definitions",
        "Hooks API",
        "Automatic caching",
      ],
    },
    {
      platform: "flutter",
      language: "Dart",
      version: "1.3.0",
      repository: "https://github.com/mundopetzen/flutter-sdk",
      documentation: "https://docs.mundopetzen.com/sdk/flutter",
      features: [
        "Cross-platform support",
        "Type-safe API",
        "Automatic caching",
        "State management",
      ],
    },
  ];
}
