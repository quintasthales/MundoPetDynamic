// API Gateway and Microservices Architecture

export interface APIGateway {
  id: string;
  name: string;
  version: string;
  baseUrl: string;
  routes: APIRoute[];
  middleware: Middleware[];
  rateLimiting: RateLimitConfig;
  authentication: AuthConfig;
  cors: CORSConfig;
  caching: CacheConfig;
  monitoring: MonitoringConfig;
  status: "active" | "maintenance" | "deprecated";
}

export interface APIRoute {
  id: string;
  path: string;
  method: HTTPMethod;
  service: string;
  handler: string;
  authentication: boolean;
  rateLimit?: number; // requests per minute
  cache?: {
    enabled: boolean;
    ttl: number; // seconds
  };
  validation: {
    query?: Record<string, ValidationRule>;
    body?: Record<string, ValidationRule>;
    params?: Record<string, ValidationRule>;
  };
  response: {
    success: ResponseSchema;
    error: ResponseSchema;
  };
  documentation: {
    summary: string;
    description: string;
    tags: string[];
    examples: {
      request: any;
      response: any;
    }[];
  };
}

export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";

export interface ValidationRule {
  type: "string" | "number" | "boolean" | "array" | "object";
  required: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  enum?: any[];
}

export interface ResponseSchema {
  statusCode: number;
  schema: Record<string, any>;
}

export interface Middleware {
  id: string;
  name: string;
  type: "authentication" | "authorization" | "logging" | "validation" | "transformation" | "custom";
  order: number;
  enabled: boolean;
  config: Record<string, any>;
}

export interface RateLimitConfig {
  enabled: boolean;
  strategy: "fixed_window" | "sliding_window" | "token_bucket";
  limits: {
    anonymous: number; // requests per minute
    authenticated: number;
    premium: number;
  };
  burst?: number;
}

export interface AuthConfig {
  methods: ("api_key" | "jwt" | "oauth2" | "basic")[];
  jwt?: {
    secret: string;
    expiresIn: number; // seconds
    refreshEnabled: boolean;
  };
  oauth2?: {
    providers: string[];
    scopes: string[];
  };
}

export interface CORSConfig {
  enabled: boolean;
  origins: string[];
  methods: HTTPMethod[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  credentials: boolean;
  maxAge: number; // seconds
}

export interface CacheConfig {
  enabled: boolean;
  provider: "redis" | "memcached" | "memory";
  ttl: number; // seconds
  strategies: {
    route: string;
    ttl: number;
    keys: string[];
  }[];
}

export interface MonitoringConfig {
  enabled: boolean;
  metrics: {
    requestCount: boolean;
    responseTime: boolean;
    errorRate: boolean;
    throughput: boolean;
  };
  logging: {
    level: "debug" | "info" | "warn" | "error";
    format: "json" | "text";
    destination: "console" | "file" | "service";
  };
  tracing: {
    enabled: boolean;
    samplingRate: number; // percentage
  };
}

export interface Microservice {
  id: string;
  name: string;
  version: string;
  type: "rest" | "graphql" | "grpc" | "websocket";
  baseUrl: string;
  health: {
    endpoint: string;
    status: "healthy" | "degraded" | "unhealthy";
    lastCheck: Date;
  };
  deployment: {
    environment: "development" | "staging" | "production";
    instances: number;
    region: string[];
  };
  dependencies: {
    service: string;
    required: boolean;
  }[];
  resources: {
    cpu: string;
    memory: string;
    storage: string;
  };
  scaling: {
    min: number;
    max: number;
    targetCPU: number; // percentage
    targetMemory: number; // percentage
  };
}

export interface ServiceMesh {
  id: string;
  name: string;
  services: string[]; // service IDs
  features: {
    loadBalancing: boolean;
    circuitBreaker: boolean;
    retries: boolean;
    timeout: boolean;
    mtls: boolean;
  };
  policies: {
    retryPolicy: {
      maxAttempts: number;
      backoff: "exponential" | "linear";
      timeout: number; // milliseconds
    };
    circuitBreaker: {
      threshold: number; // failure percentage
      timeout: number; // milliseconds
      halfOpenRequests: number;
    };
    timeout: {
      request: number; // milliseconds
      idle: number; // milliseconds
    };
  };
}

export interface APIRequest {
  id: string;
  timestamp: Date;
  method: HTTPMethod;
  path: string;
  query: Record<string, any>;
  headers: Record<string, string>;
  body?: any;
  user?: {
    id: string;
    role: string;
  };
  ip: string;
  userAgent: string;
}

export interface APIResponse {
  requestId: string;
  statusCode: number;
  headers: Record<string, string>;
  body: any;
  duration: number; // milliseconds
  cached: boolean;
  timestamp: Date;
}

export interface APIMetrics {
  period: {
    start: Date;
    end: Date;
  };
  requests: {
    total: number;
    successful: number;
    failed: number;
    cached: number;
  };
  performance: {
    avgResponseTime: number; // ms
    p50: number;
    p95: number;
    p99: number;
  };
  errors: {
    total: number;
    byStatusCode: Record<number, number>;
    byEndpoint: Record<string, number>;
  };
  traffic: {
    byEndpoint: Record<string, number>;
    byMethod: Record<HTTPMethod, number>;
    byUser: Record<string, number>;
  };
}

// API Gateway Manager
export class APIGatewayManager {
  private gateways: Map<string, APIGateway> = new Map();
  private services: Map<string, Microservice> = new Map();
  private requests: Map<string, APIRequest> = new Map();
  private responses: Map<string, APIResponse> = new Map();
  
  // Create Gateway
  createGateway(data: Omit<APIGateway, "id">): APIGateway {
    const gateway: APIGateway = {
      id: `gw-${Date.now()}`,
      ...data,
    };
    
    this.gateways.set(gateway.id, gateway);
    return gateway;
  }
  
  // Register Service
  registerService(data: Omit<Microservice, "id">): Microservice {
    const service: Microservice = {
      id: `svc-${Date.now()}`,
      ...data,
    };
    
    this.services.set(service.id, service);
    return service;
  }
  
  // Process Request
  async processRequest(request: Omit<APIRequest, "id" | "timestamp">): Promise<APIResponse> {
    const apiRequest: APIRequest = {
      id: `req-${Date.now()}`,
      timestamp: new Date(),
      ...request,
    };
    
    this.requests.set(apiRequest.id, apiRequest);
    
    const startTime = Date.now();
    
    // Simulate request processing
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
    
    const response: APIResponse = {
      requestId: apiRequest.id,
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Request-ID": apiRequest.id,
      },
      body: {
        success: true,
        data: {},
      },
      duration: Date.now() - startTime,
      cached: false,
      timestamp: new Date(),
    };
    
    this.responses.set(apiRequest.id, response);
    return response;
  }
  
  // Get Metrics
  getMetrics(period: { start: Date; end: Date }): APIMetrics {
    const requests = Array.from(this.requests.values()).filter(
      (r) => r.timestamp >= period.start && r.timestamp <= period.end
    );
    
    const responses = requests
      .map((r) => this.responses.get(r.id))
      .filter((r): r is APIResponse => r !== undefined);
    
    const successful = responses.filter((r) => r.statusCode >= 200 && r.statusCode < 300);
    const failed = responses.filter((r) => r.statusCode >= 400);
    const cached = responses.filter((r) => r.cached);
    
    const durations = responses.map((r) => r.duration).sort((a, b) => a - b);
    
    return {
      period,
      requests: {
        total: requests.length,
        successful: successful.length,
        failed: failed.length,
        cached: cached.length,
      },
      performance: {
        avgResponseTime: durations.reduce((a, b) => a + b, 0) / durations.length || 0,
        p50: durations[Math.floor(durations.length * 0.5)] || 0,
        p95: durations[Math.floor(durations.length * 0.95)] || 0,
        p99: durations[Math.floor(durations.length * 0.99)] || 0,
      },
      errors: {
        total: failed.length,
        byStatusCode: this.groupBy(failed, (r) => r.statusCode),
        byEndpoint: this.groupBy(
          failed.map((r) => {
            const req = this.requests.get(r.requestId);
            return req?.path || "unknown";
          }),
          (p) => p
        ),
      },
      traffic: {
        byEndpoint: this.groupBy(requests, (r) => r.path),
        byMethod: this.groupBy(requests, (r) => r.method),
        byUser: this.groupBy(
          requests.filter((r) => r.user),
          (r) => r.user!.id
        ),
      },
    };
  }
  
  private groupBy<T>(items: T[], keyFn: (item: T) => string | number): Record<string, number> {
    const result: Record<string, number> = {};
    items.forEach((item) => {
      const key = String(keyFn(item));
      result[key] = (result[key] || 0) + 1;
    });
    return result;
  }
  
  // Health Check
  async healthCheck(serviceId: string): Promise<{
    status: "healthy" | "degraded" | "unhealthy";
    checks: {
      name: string;
      status: boolean;
      message?: string;
    }[];
  }> {
    const service = this.services.get(serviceId);
    if (!service) throw new Error("Service not found");
    
    // Simulate health checks
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const checks = [
      { name: "database", status: true },
      { name: "cache", status: true },
      { name: "dependencies", status: true },
    ];
    
    const allHealthy = checks.every((c) => c.status);
    
    return {
      status: allHealthy ? "healthy" : "degraded",
      checks,
    };
  }
}

// Sample Data
export function getAPIGatewaySampleData(): {
  totalRequests: number;
  successRate: number;
  avgResponseTime: number;
  p95ResponseTime: number;
  errorRate: number;
  cacheHitRate: number;
  throughput: number;
} {
  return {
    totalRequests: 12500000,
    successRate: 99.5,
    avgResponseTime: 45,
    p95ResponseTime: 185,
    errorRate: 0.5,
    cacheHitRate: 75.5,
    throughput: 2850,
  };
}

// Pre-configured Routes
export function getDefaultRoutes(): APIRoute[] {
  return [
    {
      id: "route-products-list",
      path: "/api/v1/products",
      method: "GET",
      service: "product-service",
      handler: "listProducts",
      authentication: false,
      rateLimit: 100,
      cache: {
        enabled: true,
        ttl: 300,
      },
      validation: {
        query: {
          page: { type: "number", required: false, min: 1 },
          limit: { type: "number", required: false, min: 1, max: 100 },
          category: { type: "string", required: false },
        },
      },
      response: {
        success: {
          statusCode: 200,
          schema: {
            data: "array",
            pagination: "object",
          },
        },
        error: {
          statusCode: 400,
          schema: {
            error: "string",
            message: "string",
          },
        },
      },
      documentation: {
        summary: "List products",
        description: "Retrieve a paginated list of products",
        tags: ["products"],
        examples: [
          {
            request: { page: 1, limit: 20 },
            response: { data: [], pagination: {} },
          },
        ],
      },
    },
    {
      id: "route-orders-create",
      path: "/api/v1/orders",
      method: "POST",
      service: "order-service",
      handler: "createOrder",
      authentication: true,
      rateLimit: 10,
      validation: {
        body: {
          items: { type: "array", required: true },
          shippingAddress: { type: "object", required: true },
          paymentMethod: { type: "string", required: true },
        },
      },
      response: {
        success: {
          statusCode: 201,
          schema: {
            orderId: "string",
            status: "string",
          },
        },
        error: {
          statusCode: 400,
          schema: {
            error: "string",
            message: "string",
          },
        },
      },
      documentation: {
        summary: "Create order",
        description: "Create a new order",
        tags: ["orders"],
        examples: [
          {
            request: {
              items: [{ productId: "123", quantity: 1 }],
              shippingAddress: {},
              paymentMethod: "credit_card",
            },
            response: { orderId: "ord-123", status: "pending" },
          },
        ],
      },
    },
  ];
}

// API Documentation
export interface APIDocumentation {
  title: string;
  version: string;
  description: string;
  baseUrl: string;
  authentication: {
    type: string;
    description: string;
  }[];
  endpoints: {
    path: string;
    method: HTTPMethod;
    summary: string;
    description: string;
    parameters: {
      name: string;
      in: "query" | "path" | "header" | "body";
      type: string;
      required: boolean;
      description: string;
    }[];
    responses: {
      code: number;
      description: string;
      schema: any;
    }[];
  }[];
}

export function generateAPIDocumentation(gateway: APIGateway): APIDocumentation {
  return {
    title: gateway.name,
    version: gateway.version,
    description: "MundoPetZen API Gateway",
    baseUrl: gateway.baseUrl,
    authentication: [
      {
        type: "Bearer Token",
        description: "JWT token in Authorization header",
      },
      {
        type: "API Key",
        description: "API key in X-API-Key header",
      },
    ],
    endpoints: gateway.routes.map((route) => ({
      path: route.path,
      method: route.method,
      summary: route.documentation.summary,
      description: route.documentation.description,
      parameters: [],
      responses: [
        {
          code: route.response.success.statusCode,
          description: "Success",
          schema: route.response.success.schema,
        },
        {
          code: route.response.error.statusCode,
          description: "Error",
          schema: route.response.error.schema,
        },
      ],
    })),
  };
}

// WebSocket Support
export interface WebSocketConnection {
  id: string;
  userId?: string;
  connectedAt: Date;
  lastActivity: Date;
  subscriptions: string[];
  metadata: Record<string, any>;
}

export interface WebSocketMessage {
  id: string;
  connectionId: string;
  type: "subscribe" | "unsubscribe" | "message" | "ping" | "pong";
  channel?: string;
  data?: any;
  timestamp: Date;
}

// GraphQL Support
export interface GraphQLSchema {
  types: {
    name: string;
    fields: {
      name: string;
      type: string;
      args?: Record<string, string>;
    }[];
  }[];
  queries: {
    name: string;
    type: string;
    args: Record<string, string>;
  }[];
  mutations: {
    name: string;
    type: string;
    args: Record<string, string>;
  }[];
  subscriptions?: {
    name: string;
    type: string;
    args: Record<string, string>;
  }[];
}
