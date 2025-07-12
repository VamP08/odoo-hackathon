export interface User {
  id: string;
  email: string;
  name: string;
  points: number;
  role: 'user' | 'admin';
  avatar?: string;
  joinedDate: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  type: string;
  size: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  tags: string[];
  pointValue: number;
  uploaderId: string;
  uploaderName: string;
  uploaderAvatar?: string;
  uploadDate: string;
  status: 'available' | 'pending' | 'swapped';
  approved: boolean;
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar?: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  itemOwnerId: string;
  itemOwnerName: string;
  offeredItemId?: string;
  offeredItemTitle?: string;
  offeredItemImage?: string;
  pointsOffered?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdDate: string;
  completedDate?: string;
  message: string;
  response?: string;
  meetupLocation?: string;
  shippingAddress?: string;
  trackingNumber?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  swapRequestId?: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface PointTransaction {
  id: string;
  userId: string;
  type: 'earned' | 'spent' | 'bonus' | 'refund';
  amount: number;
  description: string;
  relatedItemId?: string;
  relatedItemTitle?: string;
  relatedSwapId?: string;
  timestamp: string;
}

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  favoriteCategories: string[];
  totalSwaps: number;
  rating: number;
  reviewCount: number;
  badges: string[];
  isVerified: boolean;
  lastActive: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}