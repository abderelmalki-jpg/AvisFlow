// Core domain types

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoUrl?: string;
  businesses: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  industry:
    | "restaurant"
    | "salon"
    | "auto"
    | "retail"
    | "service"
    | "other";
  logoUrl?: string;

  // Google integration
  googleAccountId?: string;
  googleAccessToken?: string; // Encrypted
  googleRefreshToken?: string; // Encrypted

  // Subscription
  subscriptionId?: string;
  subscriptionStatus:
    | "active"
    | "trialing"
    | "paused"
    | "canceled";
  monthlyQuota: number;
  currentMonthUsage: number;

  // Brand voice
  brandVoiceId?: string;

  // Team
  members: Record<string, "owner" | "admin" | "agent">;

  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  businessId: string;
  name: string;
  address: string;
  placeId?: string;
  googleBusinessId?: string;

  reviewCount: number;
  rating?: number;
  lastSyncedAt?: Date;

  settings: {
    autoApproveRating4Plus: boolean;
    requireManualReviewRating123: boolean;
  };

  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  businessId: string;
  locationId: string;

  // Google metadata
  googleReviewId: string;
  googleAuthorName: string;
  googleAuthorProfileUrl?: string;

  rating: number; // 1-5
  text: string;
  createdAt: Date;

  // Processing state
  status: "pending" | "replied" | "archived";
  repliedAt?: Date;

  // Generated reply
  generatedReplyId?: string;
  publishedReplyId?: string;

  // Metadata
  sentiment?: "positive" | "neutral" | "negative";
  syncedAt: Date;
}

export interface GeneratedReply {
  id: string;
  businessId: string;
  reviewId: string;

  // Generated content
  generatedText: string;
  brandVoiceId: string;

  // Editing
  editedText?: string;
  editedBy?: string;
  editedAt?: Date;

  // Status
  status: "draft" | "approved" | "published" | "rejected";
  approvedAt?: Date;
  approvedBy?: string;

  // Metadata
  tokenUsage: number;
  generatedAt: Date;
}

export interface ResponseHistory {
  id: string;
  businessId: string;
  locationId: string;
  reviewId: string;

  // Published reply
  replyText: string;
  publishedAt: Date;
  publishedBy: string;

  // Google metadata
  googleReplyId?: string;

  // Tracking
  googlePushStatus: "pending" | "success" | "failed";
  googlePushError?: string;
}

export interface BrandVoice {
  id: string;
  businessId: string;
  name: string;
  description: string;

  examples: Array<{
    review: string;
    replyTemplate: string;
  }>;

  systemPromptSegment: string;
  isDefault: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: string;
  businessId: string;

  stripeSubscriptionId: string;
  plan: "starter" | "pro" | "enterprise";

  monthlyQuota: number;
  monthlyPrice: number; // In cents

  status: "active" | "trialing" | "paused" | "canceled";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;

  autoRenew: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface UsageRecord {
  id: string;
  businessId: string;
  month: string; // YYYY-MM

  repliesGenerated: number;
  repliesPublished: number;
  reviewsSynced: number;

  costEstimate: number;

  createdAt: Date;
  updatedAt: Date;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// Auth context
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

// Dashboard state
export interface DashboardState {
  businessId: string;
  reviews: Review[];
  generatedReplies: Record<string, GeneratedReply>;
  responseHistory: ResponseHistory[];
  loading: boolean;
  error?: string;
}
