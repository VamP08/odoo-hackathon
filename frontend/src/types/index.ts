// src/types/index.ts

export type UserRole = 'user' | 'admin';
export type ItemStatus = 'available' | 'pending_swap' | 'pending_redemption' | 'swapped' | 'redeemed' | 'archived';
export type SwapStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
export type RedemptionStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type Condition = 'New' | 'Like New' | 'Good' | 'Fair';

// Users table mirrors backend 'users' schema
export interface User {
  id: string;                     // UUID
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  points_balance: number;
  created_at: string;             // Timestamp
  updated_at: string;             // Timestamp
}

// Categories table
export interface Category {
  id: number;
  name: string;
}

// Tags table
export interface Tag {
  id: number;
  name: string;
}

// Items table mirrors backend 'items' schema
export interface Item {
  id: string;                     // UUID
  owner_id: string;               // FK to users.id
  category_id: number | null;     // FK to categories.id
  title: string;
  description?: string;
  size?: string;
  condition?: string;             // backend stores TEXT
  status: ItemStatus;
  point_cost?: number;
  is_approved: boolean;
  created_at: string;             // Timestamp
  updated_at: string;             // Timestamp

  // Hydrated fields
  images: string[];               // from item_images.image_url
  tags?: string[];                // from item_tags.join(tags.name)
  ownerName?: string;             // optional from users.full_name
  ownerAvatar?: string;           // optional from users.avatar_url
}

// Item images join table
export interface ItemImage {
  id: string;
  item_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

// Swaps table
export interface Swap {
  id: string;
  requester_id: string;
  requested_item_id: string;
  offered_item_id?: string;
  status: SwapStatus;
  created_at: string;
  updated_at: string;

  // hydrated
  requesterName?: string;
  requesterAvatar?: string;
  requestedItemTitle?: string;
  offeredItemTitle?: string;
  offeredItemImage?: string;
}

// Redemptions table
export interface Redemption {
  id: string;
  user_id: string;
  item_id: string;
  status: RedemptionStatus;
  created_at: string;
  updated_at: string;

  // hydrated
  itemTitle?: string;
}

// Points transactions ledger
export interface PointsTransaction {
  id: string;
  user_id: string;
  change_amount: number;
  transaction_type: string;       // e.g. 'earn_listing', 'redeem_item'
  reference_id?: string;
  created_at: string;

  // hydrated
  itemTitle?: string;
}

// Reviews table
export interface Review {
  id: string;
  reviewer_id: string;
  reviewee_id: string;
  item_id?: string;
  rating: number;
  comment?: string;
  created_at: string;

  // hydrated
  reviewerName?: string;
  revieweeName?: string;
}

// Auth context
export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
