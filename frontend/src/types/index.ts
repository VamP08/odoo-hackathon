// types/index.ts

export type UserRole = 'user' | 'admin';
export type ItemStatus = 'available' | 'pending_swap' | 'pending_redemption' | 'swapped' | 'redeemed' | 'archived';
export type SwapStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';
export type RedemptionStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';
export type Condition = 'New' | 'Like New' | 'Good' | 'Fair';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: UserRole;
  points_balance: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface Item {
  id: string;
  owner_id: string;
  category_id: number | null;
  title: string;
  description?: string;
  size?: string;
  condition?: string;
  status: ItemStatus;
  point_cost?: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;

  // hydrated fields
  images: string[]; // pulled from item_images
  tags?: string[];
  ownerName?: string;
  ownerAvatar?: string;
}

export interface ItemImage {
  id: string;
  item_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

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

export interface PointsTransaction {
  id: string;
  user_id: string;
  change_amount: number;
  transaction_type: string; // can be refined to an enum like 'earn_listing', etc.
  reference_id?: string;
  created_at: string;

  // hydrated
  itemTitle?: string;
}

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

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
