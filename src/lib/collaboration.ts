// Real-time Collaboration and Team Features

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "manager" | "support" | "viewer";
  avatar?: string;
  status: "online" | "offline" | "away" | "busy";
  lastActive: Date;
  permissions: Permission[];
}

export interface Permission {
  resource: string; // e.g., "products", "orders", "customers"
  actions: ("view" | "create" | "edit" | "delete")[];
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  channels: Channel[];
  createdAt: Date;
}

export interface Channel {
  id: string;
  name: string;
  type: "general" | "orders" | "support" | "alerts" | "custom";
  members: string[]; // member IDs
  messages: Message[];
  unreadCount: number;
}

export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  content: string;
  type: "text" | "file" | "image" | "order" | "customer" | "product";
  metadata?: Record<string, any>;
  timestamp: Date;
  reactions: {
    emoji: string;
    userIds: string[];
  }[];
  mentions: string[]; // user IDs mentioned in message
  threadId?: string; // for threaded conversations
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, any>;
  timestamp: Date;
}

// Role-based Permissions
export const rolePermissions: Record<TeamMember["role"], Permission[]> = {
  owner: [
    {
      resource: "*",
      actions: ["view", "create", "edit", "delete"],
    },
  ],
  admin: [
    {
      resource: "products",
      actions: ["view", "create", "edit", "delete"],
    },
    {
      resource: "orders",
      actions: ["view", "create", "edit", "delete"],
    },
    {
      resource: "customers",
      actions: ["view", "create", "edit", "delete"],
    },
    {
      resource: "team",
      actions: ["view", "create", "edit"],
    },
    {
      resource: "settings",
      actions: ["view", "edit"],
    },
  ],
  manager: [
    {
      resource: "products",
      actions: ["view", "create", "edit"],
    },
    {
      resource: "orders",
      actions: ["view", "edit"],
    },
    {
      resource: "customers",
      actions: ["view", "edit"],
    },
  ],
  support: [
    {
      resource: "orders",
      actions: ["view", "edit"],
    },
    {
      resource: "customers",
      actions: ["view", "edit"],
    },
    {
      resource: "tickets",
      actions: ["view", "create", "edit"],
    },
  ],
  viewer: [
    {
      resource: "*",
      actions: ["view"],
    },
  ],
};

// Real-time Collaboration Features
export interface CollaborativeSession {
  id: string;
  resource: string; // e.g., "product:123", "order:456"
  activeUsers: {
    userId: string;
    cursor?: { x: number; y: number };
    selection?: string;
    lastActivity: Date;
  }[];
  locks: {
    field: string;
    userId: string;
    expiresAt: Date;
  }[];
}

export class CollaborationEngine {
  private sessions: Map<string, CollaborativeSession> = new Map();

  joinSession(sessionId: string, userId: string): CollaborativeSession {
    let session = this.sessions.get(sessionId);

    if (!session) {
      session = {
        id: sessionId,
        resource: sessionId,
        activeUsers: [],
        locks: [],
      };
      this.sessions.set(sessionId, session);
    }

    // Add user if not already in session
    if (!session.activeUsers.find(u => u.userId === userId)) {
      session.activeUsers.push({
        userId,
        lastActivity: new Date(),
      });
    }

    return session;
  }

  leaveSession(sessionId: string, userId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    // Remove user from session
    session.activeUsers = session.activeUsers.filter(u => u.userId !== userId);

    // Release all locks held by user
    session.locks = session.locks.filter(l => l.userId !== userId);

    // Clean up empty sessions
    if (session.activeUsers.length === 0) {
      this.sessions.delete(sessionId);
    }
  }

  updateCursor(
    sessionId: string,
    userId: string,
    cursor: { x: number; y: number }
  ): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const user = session.activeUsers.find(u => u.userId === userId);
    if (user) {
      user.cursor = cursor;
      user.lastActivity = new Date();
    }
  }

  lockField(sessionId: string, userId: string, field: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    // Check if field is already locked
    const existingLock = session.locks.find(l => l.field === field);
    if (existingLock && existingLock.userId !== userId) {
      return false; // Field is locked by another user
    }

    // Create or update lock
    session.locks = session.locks.filter(l => l.field !== field);
    session.locks.push({
      field,
      userId,
      expiresAt: new Date(Date.now() + 300000), // 5 minutes
    });

    return true;
  }

  unlockField(sessionId: string, userId: string, field: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.locks = session.locks.filter(
      l => !(l.field === field && l.userId === userId)
    );
  }
}

// Activity Feed
export interface ActivityFeed {
  activities: Activity[];
  filters: {
    userId?: string;
    resource?: string;
    action?: string;
    dateRange?: { start: Date; end: Date };
  };
}

export function getActivityFeed(
  filters?: ActivityFeed["filters"]
): Activity[] {
  // Mock activities - in production, fetch from database
  const activities: Activity[] = [
    {
      id: "act-1",
      userId: "user-1",
      action: "created",
      resource: "product",
      resourceId: "prod-123",
      details: { name: "Difusor Aromático Zen" },
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: "act-2",
      userId: "user-2",
      action: "updated",
      resource: "order",
      resourceId: "order-456",
      details: { status: "shipped" },
      timestamp: new Date(Date.now() - 600000),
    },
    {
      id: "act-3",
      userId: "user-1",
      action: "replied",
      resource: "ticket",
      resourceId: "ticket-789",
      details: { message: "Problema resolvido!" },
      timestamp: new Date(Date.now() - 900000),
    },
  ];

  // Apply filters
  let filtered = activities;

  if (filters?.userId) {
    filtered = filtered.filter(a => a.userId === filters.userId);
  }

  if (filters?.resource) {
    filtered = filtered.filter(a => a.resource === filters.resource);
  }

  if (filters?.action) {
    filtered = filtered.filter(a => a.action === filters.action);
  }

  if (filters?.dateRange) {
    filtered = filtered.filter(
      a =>
        a.timestamp >= filters.dateRange!.start &&
        a.timestamp <= filters.dateRange!.end
    );
  }

  return filtered;
}

// Notifications
export interface Notification {
  id: string;
  userId: string;
  type: "mention" | "assignment" | "order" | "alert" | "message";
  title: string;
  message: string;
  link?: string;
  read: boolean;
  timestamp: Date;
  priority: "low" | "medium" | "high" | "urgent";
}

export function sendNotification(
  userId: string,
  notification: Omit<Notification, "id" | "userId" | "timestamp">
): Notification {
  const newNotification: Notification = {
    id: `notif-${Date.now()}`,
    userId,
    timestamp: new Date(),
    ...notification,
  };

  // In production, save to database and send via WebSocket/push notification
  console.log("Sending notification:", newNotification);

  return newNotification;
}

// Task Management
export interface Task {
  id: string;
  title: string;
  description: string;
  assignee?: string;
  assignedBy: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: Date;
  tags: string[];
  attachments: string[];
  comments: {
    id: string;
    userId: string;
    content: string;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export function createTask(
  task: Omit<Task, "id" | "createdAt" | "updatedAt" | "comments">
): Task {
  const newTask: Task = {
    id: `task-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
    comments: [],
    ...task,
  };

  // Send notification to assignee
  if (task.assignee) {
    sendNotification(task.assignee, {
      type: "assignment",
      title: "Nova tarefa atribuída",
      message: `Você foi atribuído à tarefa: ${task.title}`,
      link: `/tasks/${newTask.id}`,
      read: false,
      priority: task.priority,
    });
  }

  return newTask;
}

// Team Analytics
export interface TeamAnalytics {
  totalMembers: number;
  activeMembers: number;
  totalMessages: number;
  avgResponseTime: number; // minutes
  tasksCompleted: number;
  tasksInProgress: number;
  taskCompletionRate: number; // percentage
  topContributors: {
    userId: string;
    name: string;
    contributions: number;
  }[];
  activityByHour: {
    hour: number;
    count: number;
  }[];
}

export function getTeamAnalytics(): TeamAnalytics {
  return {
    totalMembers: 12,
    activeMembers: 8,
    totalMessages: 2850,
    avgResponseTime: 18,
    tasksCompleted: 145,
    tasksInProgress: 28,
    taskCompletionRate: 83.8,
    topContributors: [
      {
        userId: "user-1",
        name: "João Silva",
        contributions: 285,
      },
      {
        userId: "user-2",
        name: "Maria Santos",
        contributions: 245,
      },
      {
        userId: "user-3",
        name: "Pedro Costa",
        contributions: 198,
      },
    ],
    activityByHour: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: Math.floor(Math.random() * 100) + 20,
    })),
  };
}

// Shared Notes
export interface SharedNote {
  id: string;
  title: string;
  content: string;
  authorId: string;
  sharedWith: string[]; // user IDs
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
  history: {
    version: number;
    content: string;
    userId: string;
    timestamp: Date;
  }[];
}

// Video Conferencing Integration
export interface VideoCall {
  id: string;
  title: string;
  hostId: string;
  participants: string[];
  startTime: Date;
  endTime?: Date;
  recordingUrl?: string;
  status: "scheduled" | "in_progress" | "ended";
}

export function createVideoCall(
  hostId: string,
  title: string,
  participants: string[]
): VideoCall {
  const call: VideoCall = {
    id: `call-${Date.now()}`,
    title,
    hostId,
    participants,
    startTime: new Date(),
    status: "scheduled",
  };

  // Send notifications to participants
  participants.forEach(userId => {
    sendNotification(userId, {
      type: "message",
      title: "Nova chamada de vídeo",
      message: `${title} - Clique para participar`,
      link: `/calls/${call.id}`,
      read: false,
      priority: "high",
    });
  });

  return call;
}

// Export singleton instance
export const collaborationEngine = new CollaborationEngine();
