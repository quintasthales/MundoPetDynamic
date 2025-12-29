// Comprehensive Content Management System (CMS)

export interface Content {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  status: "draft" | "published" | "scheduled" | "archived";
  author: ContentAuthor;
  content: ContentBody;
  seo: SEOMetadata;
  media: MediaAsset[];
  categories: string[];
  tags: string[];
  publishedAt?: Date;
  scheduledFor?: Date;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  analytics: ContentAnalytics;
}

export type ContentType =
  | "blog_post"
  | "page"
  | "product_guide"
  | "tutorial"
  | "video"
  | "podcast"
  | "newsletter"
  | "landing_page";

export interface ContentAuthor {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  socialLinks?: Record<string, string>;
}

export interface ContentBody {
  format: "markdown" | "html" | "rich_text";
  content: string;
  excerpt?: string;
  readingTime?: number; // minutes
  wordCount?: number;
}

export interface SEOMetadata {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: "summary" | "summary_large_image";
  canonicalUrl?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface MediaAsset {
  id: string;
  type: "image" | "video" | "audio" | "document";
  url: string;
  thumbnail?: string;
  title?: string;
  alt?: string;
  caption?: string;
  credit?: string;
  size: number; // bytes
  dimensions?: {
    width: number;
    height: number;
  };
  duration?: number; // seconds for video/audio
  uploadedAt: Date;
}

export interface ContentAnalytics {
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number; // seconds
  bounceRate: number; // percentage
  shares: {
    facebook: number;
    twitter: number;
    linkedin: number;
    whatsapp: number;
  };
  engagement: {
    likes: number;
    comments: number;
    bookmarks: number;
  };
  conversions: {
    leads: number;
    sales: number;
    revenue: number;
  };
}

// Blog Post
export interface BlogPost extends Content {
  type: "blog_post";
  featured: boolean;
  featuredImage: string;
  relatedPosts?: string[];
  series?: {
    id: string;
    name: string;
    order: number;
  };
}

// Landing Page
export interface LandingPage extends Content {
  type: "landing_page";
  sections: LandingPageSection[];
  ctaButton: {
    text: string;
    link: string;
    style: "primary" | "secondary" | "outline";
  };
  form?: {
    id: string;
    fields: FormField[];
  };
  abTest?: {
    variants: LandingPageVariant[];
    winner?: string;
  };
}

export interface LandingPageSection {
  id: string;
  type: "hero" | "features" | "testimonials" | "pricing" | "faq" | "cta" | "custom";
  content: any;
  order: number;
}

export interface LandingPageVariant {
  id: string;
  name: string;
  traffic: number; // percentage
  conversions: number;
  revenue: number;
}

export interface FormField {
  id: string;
  type: "text" | "email" | "phone" | "select" | "checkbox" | "textarea";
  label: string;
  placeholder?: string;
  required: boolean;
  validation?: string;
  options?: string[]; // for select
}

// Content Management System
export class ContentManagementSystem {
  private contents: Map<string, Content> = new Map();
  private categories: Map<string, ContentCategory> = new Map();
  private tags: Map<string, ContentTag> = new Map();
  
  // Create Content
  createContent(
    type: ContentType,
    data: Partial<Content>
  ): Content {
    const content: Content = {
      id: `content-${Date.now()}`,
      type,
      title: data.title || "Untitled",
      slug: this.generateSlug(data.title || "untitled"),
      status: "draft",
      author: data.author || {
        id: "system",
        name: "System",
      },
      content: data.content || {
        format: "markdown",
        content: "",
      },
      seo: data.seo || {},
      media: data.media || [],
      categories: data.categories || [],
      tags: data.tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      analytics: {
        views: 0,
        uniqueVisitors: 0,
        avgTimeOnPage: 0,
        bounceRate: 0,
        shares: {
          facebook: 0,
          twitter: 0,
          linkedin: 0,
          whatsapp: 0,
        },
        engagement: {
          likes: 0,
          comments: 0,
          bookmarks: 0,
        },
        conversions: {
          leads: 0,
          sales: 0,
          revenue: 0,
        },
      },
    };
    
    // Calculate reading time and word count
    if (content.content.format === "markdown" || content.content.format === "html") {
      const text = content.content.content.replace(/<[^>]*>/g, "");
      content.content.wordCount = text.split(/\s+/).length;
      content.content.readingTime = Math.ceil(content.content.wordCount / 200);
    }
    
    this.contents.set(content.id, content);
    return content;
  }
  
  // Update Content
  updateContent(id: string, updates: Partial<Content>): Content | undefined {
    const content = this.contents.get(id);
    if (!content) return undefined;
    
    Object.assign(content, updates);
    content.updatedAt = new Date();
    content.version++;
    
    this.contents.set(id, content);
    return content;
  }
  
  // Publish Content
  publishContent(id: string): Content | undefined {
    const content = this.contents.get(id);
    if (!content) return undefined;
    
    content.status = "published";
    content.publishedAt = new Date();
    content.updatedAt = new Date();
    
    this.contents.set(id, content);
    return content;
  }
  
  // Schedule Content
  scheduleContent(id: string, scheduledFor: Date): Content | undefined {
    const content = this.contents.get(id);
    if (!content) return undefined;
    
    content.status = "scheduled";
    content.scheduledFor = scheduledFor;
    content.updatedAt = new Date();
    
    this.contents.set(id, content);
    return content;
  }
  
  // Get Content
  getContent(id: string): Content | undefined {
    return this.contents.get(id);
  }
  
  // Get Content by Slug
  getContentBySlug(slug: string): Content | undefined {
    return Array.from(this.contents.values()).find((c) => c.slug === slug);
  }
  
  // List Content
  listContent(filters?: {
    type?: ContentType;
    status?: Content["status"];
    category?: string;
    tag?: string;
    author?: string;
  }): Content[] {
    let contents = Array.from(this.contents.values());
    
    if (filters) {
      if (filters.type) {
        contents = contents.filter((c) => c.type === filters.type);
      }
      if (filters.status) {
        contents = contents.filter((c) => c.status === filters.status);
      }
      if (filters.category) {
        contents = contents.filter((c) => c.categories.includes(filters.category));
      }
      if (filters.tag) {
        contents = contents.filter((c) => c.tags.includes(filters.tag));
      }
      if (filters.author) {
        contents = contents.filter((c) => c.author.id === filters.author);
      }
    }
    
    return contents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  // Delete Content
  deleteContent(id: string): boolean {
    return this.contents.delete(id);
  }
  
  // Generate Slug
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  
  // Track View
  trackView(id: string, isUnique: boolean = false): void {
    const content = this.contents.get(id);
    if (!content) return;
    
    content.analytics.views++;
    if (isUnique) {
      content.analytics.uniqueVisitors++;
    }
    
    this.contents.set(id, content);
  }
  
  // Track Engagement
  trackEngagement(
    id: string,
    type: "like" | "comment" | "bookmark" | "share",
    platform?: string
  ): void {
    const content = this.contents.get(id);
    if (!content) return;
    
    if (type === "like") {
      content.analytics.engagement.likes++;
    } else if (type === "comment") {
      content.analytics.engagement.comments++;
    } else if (type === "bookmark") {
      content.analytics.engagement.bookmarks++;
    } else if (type === "share" && platform) {
      if (platform in content.analytics.shares) {
        content.analytics.shares[platform as keyof typeof content.analytics.shares]++;
      }
    }
    
    this.contents.set(id, content);
  }
}

export interface ContentCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string;
  order: number;
  contentCount: number;
}

export interface ContentTag {
  id: string;
  name: string;
  slug: string;
  contentCount: number;
}

// Media Library
export class MediaLibrary {
  private assets: Map<string, MediaAsset> = new Map();
  private folders: Map<string, MediaFolder> = new Map();
  
  // Upload Asset
  uploadAsset(
    file: {
      name: string;
      type: string;
      size: number;
      data: string; // base64
    },
    folderId?: string
  ): MediaAsset {
    const asset: MediaAsset = {
      id: `asset-${Date.now()}`,
      type: this.getAssetType(file.type),
      url: `/media/${file.name}`,
      title: file.name,
      size: file.size,
      uploadedAt: new Date(),
    };
    
    this.assets.set(asset.id, asset);
    
    if (folderId) {
      const folder = this.folders.get(folderId);
      if (folder) {
        folder.assetCount++;
      }
    }
    
    return asset;
  }
  
  private getAssetType(mimeType: string): MediaAsset["type"] {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    return "document";
  }
  
  // Get Asset
  getAsset(id: string): MediaAsset | undefined {
    return this.assets.get(id);
  }
  
  // List Assets
  listAssets(filters?: {
    type?: MediaAsset["type"];
    folderId?: string;
  }): MediaAsset[] {
    let assets = Array.from(this.assets.values());
    
    if (filters?.type) {
      assets = assets.filter((a) => a.type === filters.type);
    }
    
    return assets.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime());
  }
  
  // Delete Asset
  deleteAsset(id: string): boolean {
    return this.assets.delete(id);
  }
  
  // Create Folder
  createFolder(name: string, parent?: string): MediaFolder {
    const folder: MediaFolder = {
      id: `folder-${Date.now()}`,
      name,
      parent,
      assetCount: 0,
      createdAt: new Date(),
    };
    
    this.folders.set(folder.id, folder);
    return folder;
  }
}

export interface MediaFolder {
  id: string;
  name: string;
  parent?: string;
  assetCount: number;
  createdAt: Date;
}

// Content Templates
export interface ContentTemplate {
  id: string;
  name: string;
  type: ContentType;
  description: string;
  thumbnail?: string;
  structure: any;
  variables?: TemplateVariable[];
}

export interface TemplateVariable {
  name: string;
  type: "text" | "image" | "color" | "number";
  label: string;
  defaultValue?: any;
}

export function getContentTemplates(): ContentTemplate[] {
  return [
    {
      id: "blog-post-standard",
      name: "Blog Post Padrão",
      type: "blog_post",
      description: "Template padrão para posts de blog",
      structure: {
        sections: ["hero", "introduction", "content", "conclusion", "cta"],
      },
    },
    {
      id: "product-guide",
      name: "Guia de Produto",
      type: "product_guide",
      description: "Template para guias detalhados de produtos",
      structure: {
        sections: ["overview", "features", "how-to-use", "tips", "faq"],
      },
    },
    {
      id: "landing-page-lead",
      name: "Landing Page - Captura de Leads",
      type: "landing_page",
      description: "Template otimizado para captura de leads",
      structure: {
        sections: ["hero", "benefits", "testimonials", "form", "cta"],
      },
      variables: [
        { name: "headline", type: "text", label: "Título Principal" },
        { name: "subheadline", type: "text", label: "Subtítulo" },
        { name: "heroImage", type: "image", label: "Imagem Hero" },
        { name: "ctaText", type: "text", label: "Texto do Botão", defaultValue: "Começar Agora" },
      ],
    },
  ];
}

// Content Analytics
export interface ContentPerformance {
  contentId: string;
  title: string;
  type: ContentType;
  views: number;
  uniqueVisitors: number;
  avgTimeOnPage: number;
  bounceRate: number;
  engagementRate: number;
  conversionRate: number;
  revenue: number;
  roi: number;
}

export function getTopPerformingContent(limit: number = 10): ContentPerformance[] {
  return [
    {
      contentId: "content-001",
      title: "Guia Completo de Aromaterapia para Iniciantes",
      type: "product_guide",
      views: 125000,
      uniqueVisitors: 98500,
      avgTimeOnPage: 485,
      bounceRate: 28.5,
      engagementRate: 45.5,
      conversionRate: 8.5,
      revenue: 285000,
      roi: 1425,
    },
    {
      contentId: "content-002",
      title: "10 Benefícios da Lavanda para sua Saúde",
      type: "blog_post",
      views: 98500,
      uniqueVisitors: 78500,
      avgTimeOnPage: 325,
      bounceRate: 35.5,
      engagementRate: 38.5,
      conversionRate: 6.5,
      revenue: 185000,
      roi: 925,
    },
    {
      contentId: "content-003",
      title: "Como Escolher o Difusor Perfeito",
      type: "tutorial",
      views: 85000,
      uniqueVisitors: 68500,
      avgTimeOnPage: 285,
      bounceRate: 32.5,
      engagementRate: 42.5,
      conversionRate: 12.5,
      revenue: 385000,
      roi: 1925,
    },
  ];
}

// SEO Manager
export class SEOManager {
  // Analyze Content SEO
  analyzeSEO(content: Content): SEOAnalysis {
    const score = this.calculateSEOScore(content);
    const issues = this.findSEOIssues(content);
    const suggestions = this.generateSEOSuggestions(content, issues);
    
    return {
      score,
      issues,
      suggestions,
      keywords: this.extractKeywords(content),
    };
  }
  
  private calculateSEOScore(content: Content): number {
    let score = 100;
    
    // Title length
    if (!content.title || content.title.length < 30 || content.title.length > 60) {
      score -= 10;
    }
    
    // Meta description
    if (!content.seo.metaDescription || content.seo.metaDescription.length < 120) {
      score -= 10;
    }
    
    // Keywords
    if (!content.seo.keywords || content.seo.keywords.length === 0) {
      score -= 10;
    }
    
    // Images with alt text
    const imagesWithoutAlt = content.media.filter((m) => m.type === "image" && !m.alt);
    if (imagesWithoutAlt.length > 0) {
      score -= 5 * Math.min(imagesWithoutAlt.length, 4);
    }
    
    // Content length
    if (content.content.wordCount && content.content.wordCount < 300) {
      score -= 15;
    }
    
    return Math.max(0, score);
  }
  
  private findSEOIssues(content: Content): SEOIssue[] {
    const issues: SEOIssue[] = [];
    
    if (!content.title || content.title.length < 30) {
      issues.push({
        severity: "warning",
        message: "Título muito curto (recomendado: 30-60 caracteres)",
      });
    }
    
    if (!content.seo.metaDescription) {
      issues.push({
        severity: "error",
        message: "Meta description ausente",
      });
    }
    
    if (!content.seo.keywords || content.seo.keywords.length === 0) {
      issues.push({
        severity: "warning",
        message: "Palavras-chave não definidas",
      });
    }
    
    return issues;
  }
  
  private generateSEOSuggestions(content: Content, issues: SEOIssue[]): string[] {
    const suggestions: string[] = [];
    
    issues.forEach((issue) => {
      if (issue.message.includes("Título")) {
        suggestions.push("Expanda o título para incluir palavras-chave relevantes");
      }
      if (issue.message.includes("Meta description")) {
        suggestions.push("Adicione uma meta description atraente de 120-160 caracteres");
      }
      if (issue.message.includes("Palavras-chave")) {
        suggestions.push("Defina 3-5 palavras-chave relevantes para o conteúdo");
      }
    });
    
    return suggestions;
  }
  
  private extractKeywords(content: Content): string[] {
    // Mock implementation - in production, use NLP
    return ["aromaterapia", "bem-estar", "óleos essenciais"];
  }
}

export interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  suggestions: string[];
  keywords: string[];
}

export interface SEOIssue {
  severity: "error" | "warning" | "info";
  message: string;
}

// CMS Analytics
export interface CMSAnalytics {
  totalContent: number;
  publishedContent: number;
  draftContent: number;
  scheduledContent: number;
  totalViews: number;
  totalUniqueVisitors: number;
  avgEngagementRate: number;
  topAuthors: {
    authorId: string;
    authorName: string;
    contentCount: number;
    totalViews: number;
  }[];
  contentByType: {
    type: ContentType;
    count: number;
    views: number;
  }[];
}

export function getCMSAnalytics(): CMSAnalytics {
  return {
    totalContent: 1850,
    publishedContent: 1285,
    draftContent: 485,
    scheduledContent: 80,
    totalViews: 8500000,
    totalUniqueVisitors: 2850000,
    avgEngagementRate: 38.5,
    topAuthors: [
      {
        authorId: "author-001",
        authorName: "Maria Silva",
        contentCount: 285,
        totalViews: 2850000,
      },
      {
        authorId: "author-002",
        authorName: "João Santos",
        contentCount: 185,
        totalViews: 1985000,
      },
    ],
    contentByType: [
      { type: "blog_post", count: 850, views: 4850000 },
      { type: "product_guide", count: 285, views: 2185000 },
      { type: "tutorial", count: 185, views: 985000 },
      { type: "landing_page", count: 125, views: 485000 },
    ],
  };
}
