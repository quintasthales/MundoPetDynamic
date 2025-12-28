// Customer Data Platform (CDP) - Unified Customer Profiles

export interface UnifiedCustomerProfile {
  id: string;
  // Identity
  identities: CustomerIdentity[];
  primaryEmail: string;
  primaryPhone?: string;
  
  // Demographics
  demographics: {
    firstName: string;
    lastName: string;
    gender?: string;
    dateOfBirth?: Date;
    age?: number;
    location: {
      city: string;
      state: string;
      country: string;
      zipCode: string;
    };
  };
  
  // Behavioral Data
  behavior: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate?: Date;
    firstOrderDate?: Date;
    daysSinceLastOrder?: number;
    orderFrequency: number; // orders per month
    favoriteCategories: string[];
    favoriteProducts: string[];
    browsingHistory: BrowsingEvent[];
    searchHistory: string[];
    abandonedCarts: number;
  };
  
  // Engagement
  engagement: {
    emailEngagement: {
      opens: number;
      clicks: number;
      openRate: number;
      clickRate: number;
      lastOpened?: Date;
    };
    smsEngagement: {
      delivered: number;
      clicked: number;
      clickRate: number;
    };
    websiteEngagement: {
      totalVisits: number;
      totalPageViews: number;
      avgSessionDuration: number; // seconds
      lastVisit?: Date;
    };
    socialEngagement: {
      follows: boolean;
      likes: number;
      comments: number;
      shares: number;
    };
  };
  
  // Preferences
  preferences: {
    communicationChannels: string[];
    emailFrequency: "daily" | "weekly" | "monthly";
    productInterests: string[];
    priceRange: { min: number; max: number };
    brands: string[];
    sustainabilityPreference: boolean;
  };
  
  // Segments
  segments: string[];
  
  // Predictive Scores
  scores: {
    lifetimeValue: number;
    churnRisk: number; // 0-100
    purchaseProbability: number; // 0-100
    engagementScore: number; // 0-100
    loyaltyScore: number; // 0-100
    recommendationScore: number; // NPS-style
  };
  
  // Attributes
  attributes: {
    customerType: "new" | "returning" | "vip" | "at-risk" | "inactive";
    tier: "bronze" | "silver" | "gold" | "platinum";
    acquisitionChannel: string;
    acquisitionDate: Date;
    tags: string[];
  };
  
  // Metadata
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastSyncedAt: Date;
    dataQualityScore: number; // 0-100
  };
}

export interface CustomerIdentity {
  type: "email" | "phone" | "social" | "device" | "cookie";
  value: string;
  verified: boolean;
  primary: boolean;
  source: string;
  firstSeen: Date;
  lastSeen: Date;
}

export interface BrowsingEvent {
  timestamp: Date;
  page: string;
  productId?: string;
  category?: string;
  duration: number; // seconds
  device: string;
  source: string;
}

// CDP Functions
export class CustomerDataPlatform {
  private profiles: Map<string, UnifiedCustomerProfile> = new Map();
  
  // Profile Management
  getProfile(customerId: string): UnifiedCustomerProfile | undefined {
    return this.profiles.get(customerId);
  }
  
  createProfile(data: Partial<UnifiedCustomerProfile>): UnifiedCustomerProfile {
    const profile: UnifiedCustomerProfile = {
      id: data.id || `customer-${Date.now()}`,
      identities: data.identities || [],
      primaryEmail: data.primaryEmail || "",
      primaryPhone: data.primaryPhone,
      demographics: data.demographics || {
        firstName: "",
        lastName: "",
        location: {
          city: "",
          state: "",
          country: "Brasil",
          zipCode: "",
        },
      },
      behavior: {
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        orderFrequency: 0,
        favoriteCategories: [],
        favoriteProducts: [],
        browsingHistory: [],
        searchHistory: [],
        abandonedCarts: 0,
      },
      engagement: {
        emailEngagement: {
          opens: 0,
          clicks: 0,
          openRate: 0,
          clickRate: 0,
        },
        smsEngagement: {
          delivered: 0,
          clicked: 0,
          clickRate: 0,
        },
        websiteEngagement: {
          totalVisits: 0,
          totalPageViews: 0,
          avgSessionDuration: 0,
        },
        socialEngagement: {
          follows: false,
          likes: 0,
          comments: 0,
          shares: 0,
        },
      },
      preferences: {
        communicationChannels: ["email"],
        emailFrequency: "weekly",
        productInterests: [],
        priceRange: { min: 0, max: 1000 },
        brands: [],
        sustainabilityPreference: false,
      },
      segments: [],
      scores: {
        lifetimeValue: 0,
        churnRisk: 0,
        purchaseProbability: 0,
        engagementScore: 0,
        loyaltyScore: 0,
        recommendationScore: 0,
      },
      attributes: {
        customerType: "new",
        tier: "bronze",
        acquisitionChannel: "organic",
        acquisitionDate: new Date(),
        tags: [],
      },
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSyncedAt: new Date(),
        dataQualityScore: 50,
      },
    };
    
    this.profiles.set(profile.id, profile);
    return profile;
  }
  
  updateProfile(
    customerId: string,
    updates: Partial<UnifiedCustomerProfile>
  ): UnifiedCustomerProfile | undefined {
    const profile = this.profiles.get(customerId);
    if (!profile) return undefined;
    
    const updatedProfile = {
      ...profile,
      ...updates,
      metadata: {
        ...profile.metadata,
        updatedAt: new Date(),
      },
    };
    
    this.profiles.set(customerId, updatedProfile);
    return updatedProfile;
  }
  
  // Identity Resolution
  mergeProfiles(profileIds: string[]): UnifiedCustomerProfile {
    const profiles = profileIds
      .map((id) => this.profiles.get(id))
      .filter((p) => p !== undefined) as UnifiedCustomerProfile[];
    
    if (profiles.length === 0) {
      throw new Error("No profiles found to merge");
    }
    
    // Merge logic - combine all data
    const mergedProfile: UnifiedCustomerProfile = {
      id: profiles[0].id,
      identities: profiles.flatMap((p) => p.identities),
      primaryEmail: profiles[0].primaryEmail,
      primaryPhone: profiles.find((p) => p.primaryPhone)?.primaryPhone,
      demographics: profiles[0].demographics,
      behavior: {
        totalOrders: profiles.reduce((sum, p) => sum + p.behavior.totalOrders, 0),
        totalSpent: profiles.reduce((sum, p) => sum + p.behavior.totalSpent, 0),
        averageOrderValue:
          profiles.reduce((sum, p) => sum + p.behavior.averageOrderValue, 0) /
          profiles.length,
        lastOrderDate: profiles
          .map((p) => p.behavior.lastOrderDate)
          .filter((d) => d)
          .sort((a, b) => b!.getTime() - a!.getTime())[0],
        firstOrderDate: profiles
          .map((p) => p.behavior.firstOrderDate)
          .filter((d) => d)
          .sort((a, b) => a!.getTime() - b!.getTime())[0],
        orderFrequency:
          profiles.reduce((sum, p) => sum + p.behavior.orderFrequency, 0) /
          profiles.length,
        favoriteCategories: [
          ...new Set(profiles.flatMap((p) => p.behavior.favoriteCategories)),
        ],
        favoriteProducts: [
          ...new Set(profiles.flatMap((p) => p.behavior.favoriteProducts)),
        ],
        browsingHistory: profiles.flatMap((p) => p.behavior.browsingHistory),
        searchHistory: [
          ...new Set(profiles.flatMap((p) => p.behavior.searchHistory)),
        ],
        abandonedCarts: profiles.reduce(
          (sum, p) => sum + p.behavior.abandonedCarts,
          0
        ),
      },
      engagement: {
        emailEngagement: {
          opens: profiles.reduce(
            (sum, p) => sum + p.engagement.emailEngagement.opens,
            0
          ),
          clicks: profiles.reduce(
            (sum, p) => sum + p.engagement.emailEngagement.clicks,
            0
          ),
          openRate:
            profiles.reduce(
              (sum, p) => sum + p.engagement.emailEngagement.openRate,
              0
            ) / profiles.length,
          clickRate:
            profiles.reduce(
              (sum, p) => sum + p.engagement.emailEngagement.clickRate,
              0
            ) / profiles.length,
          lastOpened: profiles
            .map((p) => p.engagement.emailEngagement.lastOpened)
            .filter((d) => d)
            .sort((a, b) => b!.getTime() - a!.getTime())[0],
        },
        smsEngagement: profiles[0].engagement.smsEngagement,
        websiteEngagement: {
          totalVisits: profiles.reduce(
            (sum, p) => sum + p.engagement.websiteEngagement.totalVisits,
            0
          ),
          totalPageViews: profiles.reduce(
            (sum, p) => sum + p.engagement.websiteEngagement.totalPageViews,
            0
          ),
          avgSessionDuration:
            profiles.reduce(
              (sum, p) => sum + p.engagement.websiteEngagement.avgSessionDuration,
              0
            ) / profiles.length,
          lastVisit: profiles
            .map((p) => p.engagement.websiteEngagement.lastVisit)
            .filter((d) => d)
            .sort((a, b) => b!.getTime() - a!.getTime())[0],
        },
        socialEngagement: profiles[0].engagement.socialEngagement,
      },
      preferences: profiles[0].preferences,
      segments: [...new Set(profiles.flatMap((p) => p.segments))],
      scores: {
        lifetimeValue: Math.max(...profiles.map((p) => p.scores.lifetimeValue)),
        churnRisk:
          profiles.reduce((sum, p) => sum + p.scores.churnRisk, 0) /
          profiles.length,
        purchaseProbability:
          profiles.reduce((sum, p) => sum + p.scores.purchaseProbability, 0) /
          profiles.length,
        engagementScore:
          profiles.reduce((sum, p) => sum + p.scores.engagementScore, 0) /
          profiles.length,
        loyaltyScore:
          profiles.reduce((sum, p) => sum + p.scores.loyaltyScore, 0) /
          profiles.length,
        recommendationScore:
          profiles.reduce((sum, p) => sum + p.scores.recommendationScore, 0) /
          profiles.length,
      },
      attributes: profiles[0].attributes,
      metadata: {
        createdAt: profiles[0].metadata.createdAt,
        updatedAt: new Date(),
        lastSyncedAt: new Date(),
        dataQualityScore:
          profiles.reduce((sum, p) => sum + p.metadata.dataQualityScore, 0) /
          profiles.length,
      },
    };
    
    // Remove old profiles
    profileIds.slice(1).forEach((id) => this.profiles.delete(id));
    
    // Update merged profile
    this.profiles.set(mergedProfile.id, mergedProfile);
    
    return mergedProfile;
  }
  
  // Segmentation
  segmentCustomers(): Map<string, UnifiedCustomerProfile[]> {
    const segments = new Map<string, UnifiedCustomerProfile[]>();
    
    this.profiles.forEach((profile) => {
      // VIP Customers
      if (profile.behavior.totalSpent > 5000) {
        this.addToSegment(segments, "vip", profile);
      }
      
      // High Value
      if (
        profile.behavior.totalSpent > 2000 &&
        profile.behavior.totalSpent <= 5000
      ) {
        this.addToSegment(segments, "high-value", profile);
      }
      
      // Frequent Buyers
      if (profile.behavior.orderFrequency > 2) {
        this.addToSegment(segments, "frequent", profile);
      }
      
      // At Risk
      if (
        profile.scores.churnRisk > 70 &&
        profile.behavior.totalOrders > 0
      ) {
        this.addToSegment(segments, "at-risk", profile);
      }
      
      // New Customers
      const daysSinceAcquisition =
        (Date.now() - profile.attributes.acquisitionDate.getTime()) /
        (1000 * 60 * 60 * 24);
      if (daysSinceAcquisition < 30) {
        this.addToSegment(segments, "new", profile);
      }
      
      // Inactive
      if (
        profile.behavior.daysSinceLastOrder &&
        profile.behavior.daysSinceLastOrder > 90
      ) {
        this.addToSegment(segments, "inactive", profile);
      }
    });
    
    return segments;
  }
  
  private addToSegment(
    segments: Map<string, UnifiedCustomerProfile[]>,
    segmentName: string,
    profile: UnifiedCustomerProfile
  ) {
    if (!segments.has(segmentName)) {
      segments.set(segmentName, []);
    }
    segments.get(segmentName)!.push(profile);
  }
  
  // Predictive Analytics
  calculateChurnRisk(profile: UnifiedCustomerProfile): number {
    let risk = 0;
    
    // Days since last order
    if (profile.behavior.daysSinceLastOrder) {
      if (profile.behavior.daysSinceLastOrder > 90) risk += 40;
      else if (profile.behavior.daysSinceLastOrder > 60) risk += 25;
      else if (profile.behavior.daysSinceLastOrder > 30) risk += 10;
    }
    
    // Order frequency decline
    if (profile.behavior.orderFrequency < 0.5) risk += 20;
    
    // Engagement decline
    if (profile.engagement.emailEngagement.openRate < 10) risk += 15;
    if (profile.engagement.websiteEngagement.totalVisits < 2) risk += 15;
    
    // Cart abandonment
    if (profile.behavior.abandonedCarts > 3) risk += 10;
    
    return Math.min(risk, 100);
  }
  
  calculateLifetimeValue(profile: UnifiedCustomerProfile): number {
    const avgOrderValue = profile.behavior.averageOrderValue;
    const orderFrequency = profile.behavior.orderFrequency;
    const customerLifespan = 24; // months
    
    return avgOrderValue * orderFrequency * customerLifespan;
  }
  
  calculateEngagementScore(profile: UnifiedCustomerProfile): number {
    let score = 0;
    
    // Email engagement
    score += profile.engagement.emailEngagement.openRate * 0.3;
    score += profile.engagement.emailEngagement.clickRate * 0.5;
    
    // Website engagement
    if (profile.engagement.websiteEngagement.totalVisits > 10) score += 20;
    if (profile.engagement.websiteEngagement.avgSessionDuration > 300)
      score += 15;
    
    // Social engagement
    if (profile.engagement.socialEngagement.follows) score += 10;
    score += Math.min(profile.engagement.socialEngagement.likes * 0.5, 15);
    
    // Purchase behavior
    if (profile.behavior.totalOrders > 5) score += 20;
    
    return Math.min(score, 100);
  }
  
  // Data Quality
  assessDataQuality(profile: UnifiedCustomerProfile): number {
    let score = 0;
    const maxScore = 100;
    
    // Identity completeness
    if (profile.primaryEmail) score += 15;
    if (profile.primaryPhone) score += 10;
    if (profile.identities.length > 1) score += 10;
    
    // Demographics completeness
    if (profile.demographics.firstName) score += 10;
    if (profile.demographics.lastName) score += 10;
    if (profile.demographics.dateOfBirth) score += 5;
    if (profile.demographics.location.city) score += 5;
    
    // Behavioral data
    if (profile.behavior.totalOrders > 0) score += 15;
    if (profile.behavior.browsingHistory.length > 0) score += 10;
    
    // Engagement data
    if (profile.engagement.emailEngagement.opens > 0) score += 5;
    if (profile.engagement.websiteEngagement.totalVisits > 0) score += 5;
    
    return Math.min(score, maxScore);
  }
  
  // Export & Sync
  exportProfile(customerId: string): string {
    const profile = this.profiles.get(customerId);
    if (!profile) throw new Error("Profile not found");
    
    return JSON.stringify(profile, null, 2);
  }
  
  importProfile(data: string): UnifiedCustomerProfile {
    const profile = JSON.parse(data) as UnifiedCustomerProfile;
    this.profiles.set(profile.id, profile);
    return profile;
  }
  
  syncWithExternalSources(customerId: string): void {
    // Simulate syncing with external data sources
    const profile = this.profiles.get(customerId);
    if (!profile) return;
    
    profile.metadata.lastSyncedAt = new Date();
    this.profiles.set(customerId, profile);
  }
}

// Sample Data
export function getSampleCustomerProfiles(): UnifiedCustomerProfile[] {
  return [
    {
      id: "customer-001",
      identities: [
        {
          type: "email",
          value: "joao.silva@email.com",
          verified: true,
          primary: true,
          source: "website",
          firstSeen: new Date("2024-01-15"),
          lastSeen: new Date("2025-01-15"),
        },
      ],
      primaryEmail: "joao.silva@email.com",
      primaryPhone: "+5511987654321",
      demographics: {
        firstName: "João",
        lastName: "Silva",
        gender: "male",
        dateOfBirth: new Date("1985-05-20"),
        age: 39,
        location: {
          city: "São Paulo",
          state: "SP",
          country: "Brasil",
          zipCode: "01310-100",
        },
      },
      behavior: {
        totalOrders: 28,
        totalSpent: 8450.5,
        averageOrderValue: 301.8,
        lastOrderDate: new Date("2025-01-10"),
        firstOrderDate: new Date("2024-01-20"),
        daysSinceLastOrder: 5,
        orderFrequency: 2.5,
        favoriteCategories: ["Difusores", "Óleos Essenciais"],
        favoriteProducts: [
          "Difusor Aromático Zen",
          "Óleo Essencial Lavanda",
        ],
        browsingHistory: [],
        searchHistory: ["difusor", "óleo lavanda", "vela aromática"],
        abandonedCarts: 2,
      },
      engagement: {
        emailEngagement: {
          opens: 145,
          clicks: 85,
          openRate: 42.5,
          clickRate: 25.2,
          lastOpened: new Date("2025-01-12"),
        },
        smsEngagement: {
          delivered: 28,
          clicked: 12,
          clickRate: 42.8,
        },
        websiteEngagement: {
          totalVisits: 185,
          totalPageViews: 850,
          avgSessionDuration: 425,
          lastVisit: new Date("2025-01-15"),
        },
        socialEngagement: {
          follows: true,
          likes: 45,
          comments: 8,
          shares: 3,
        },
      },
      preferences: {
        communicationChannels: ["email", "sms"],
        emailFrequency: "weekly",
        productInterests: ["Difusores", "Óleos Essenciais", "Velas"],
        priceRange: { min: 50, max: 500 },
        brands: ["Zen Aroma", "Pure Essential"],
        sustainabilityPreference: true,
      },
      segments: ["vip", "frequent", "engaged"],
      scores: {
        lifetimeValue: 12500,
        churnRisk: 15,
        purchaseProbability: 85,
        engagementScore: 92,
        loyaltyScore: 88,
        recommendationScore: 9,
      },
      attributes: {
        customerType: "vip",
        tier: "platinum",
        acquisitionChannel: "instagram",
        acquisitionDate: new Date("2024-01-15"),
        tags: ["high-value", "engaged", "advocate"],
      },
      metadata: {
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2025-01-15"),
        lastSyncedAt: new Date("2025-01-15"),
        dataQualityScore: 95,
      },
    },
  ];
}

// CDP Analytics
export interface CDPAnalytics {
  totalProfiles: number;
  profilesCreatedToday: number;
  profilesUpdatedToday: number;
  avgDataQualityScore: number;
  identityResolutionRate: number;
  segmentDistribution: {
    segment: string;
    count: number;
    percentage: number;
  }[];
  topAcquisitionChannels: {
    channel: string;
    count: number;
  }[];
}

export function getCDPAnalytics(): CDPAnalytics {
  return {
    totalProfiles: 125000,
    profilesCreatedToday: 285,
    profilesUpdatedToday: 8500,
    avgDataQualityScore: 82.5,
    identityResolutionRate: 94.2,
    segmentDistribution: [
      { segment: "Occasional", count: 45000, percentage: 36 },
      { segment: "At Risk", count: 28000, percentage: 22.4 },
      { segment: "Inactive", count: 26000, percentage: 20.8 },
      { segment: "Frequent", count: 15000, percentage: 12 },
      { segment: "High Value", count: 8500, percentage: 6.8 },
      { segment: "VIP", count: 2500, percentage: 2 },
    ],
    topAcquisitionChannels: [
      { channel: "Organic Search", count: 42500 },
      { channel: "Instagram", count: 28500 },
      { channel: "Facebook", count: 18500 },
      { channel: "Direct", count: 15000 },
      { channel: "Email", count: 12000 },
    ],
  };
}
