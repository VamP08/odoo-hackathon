import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Item, SwapRequest, Message, PointTransaction, UserProfile } from '../types';

interface AppContextType {
  items: Item[];
  swapRequests: SwapRequest[];
  messages: Message[];
  pointTransactions: PointTransaction[];
  userProfiles: UserProfile[];
  addItem: (item: Omit<Item, 'id' | 'uploadDate'>) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  createSwapRequest: (request: Omit<SwapRequest, 'id' | 'createdDate'>) => void;
  updateSwapRequest: (id: string, updates: Partial<SwapRequest>) => void;
  sendMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  markMessageAsRead: (messageId: string) => void;
  addPointTransaction: (transaction: Omit<PointTransaction, 'id' | 'timestamp'>) => void;
  getUserProfile: (userId: string) => UserProfile | undefined;
  updateUserProfile: (userId: string, updates: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Mock data
const mockItems: Item[] = [
  {
    id: '1',
    title: 'Vintage Denim Jacket',
    description: 'Classic blue denim jacket from the 90s. Perfect condition with minimal wear. Great for layering and adding a vintage touch to any outfit.',
    images: [
      'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Outerwear',
    type: 'Jacket',
    size: 'M',
    condition: 'Like New',
    tags: ['vintage', 'denim', 'casual'],
    pointValue: 75,
    uploaderId: '3',
    uploaderName: 'Emma Wilson',
    uploaderAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    uploadDate: '2024-01-20',
    status: 'available',
    approved: true
  },
  {
    id: '2',
    title: 'Silk Evening Dress',
    description: 'Elegant black silk dress perfect for special occasions. Features a flattering A-line silhouette and delicate lace details.',
    images: [
      'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Dresses',
    type: 'Evening',
    size: 'S',
    condition: 'New',
    tags: ['silk', 'elegant', 'formal'],
    pointValue: 120,
    uploaderId: '4',
    uploaderName: 'Alex Chen',
    uploaderAvatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=150',
    uploadDate: '2024-01-18',
    status: 'available',
    approved: true
  },
  {
    id: '3',
    title: 'Wool Winter Coat',
    description: 'Warm and stylish wool coat in charcoal gray. Perfect for cold weather with a timeless design that never goes out of style.',
    images: [
      'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    category: 'Outerwear',
    type: 'Coat',
    size: 'L',
    condition: 'Good',
    tags: ['wool', 'winter', 'warm'],
    pointValue: 90,
    uploaderId: '5',
    uploaderName: 'Michael Brown',
    uploadDate: '2024-01-16',
    status: 'available',
    approved: true
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '3',
    senderName: 'Emma Wilson',
    senderAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    receiverId: '1',
    swapRequestId: '1',
    content: 'Hi! I\'m interested in your vintage denim jacket. Would you be open to swapping for my silk evening dress?',
    timestamp: '2024-01-20T10:30:00Z',
    read: false
  }
];

const mockPointTransactions: PointTransaction[] = [
  {
    id: '1',
    userId: '1',
    type: 'bonus',
    amount: 50,
    description: 'Welcome bonus for joining ReWear',
    timestamp: '2024-01-15T09:00:00Z'
  },
  {
    id: '2',
    userId: '1',
    type: 'earned',
    amount: 75,
    description: 'Item swapped successfully',
    relatedItemId: '1',
    relatedItemTitle: 'Vintage Denim Jacket',
    timestamp: '2024-01-18T14:30:00Z'
  }
];

const mockUserProfiles: UserProfile[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Sarah Johnson',
    points: 150,
    role: 'user',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedDate: '2024-01-15',
    bio: 'Sustainable fashion enthusiast who loves vintage pieces and eco-friendly brands.',
    location: 'San Francisco, CA',
    favoriteCategories: ['Outerwear', 'Dresses', 'Vintage'],
    totalSwaps: 12,
    rating: 4.8,
    reviewCount: 15,
    badges: ['Early Adopter', 'Eco Warrior', 'Top Swapper'],
    isVerified: true,
    lastActive: '2024-01-20T15:30:00Z'
  },
  {
    id: '3',
    email: 'emma@example.com',
    name: 'Emma Wilson',
    points: 200,
    role: 'user',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    joinedDate: '2024-01-10',
    bio: 'Fashion designer passionate about circular fashion and reducing textile waste.',
    location: 'New York, NY',
    favoriteCategories: ['Designer', 'Formal', 'Accessories'],
    totalSwaps: 25,
    rating: 4.9,
    reviewCount: 28,
    badges: ['Designer Pro', 'Community Leader', 'Verified Seller'],
    isVerified: true,
    lastActive: '2024-01-20T12:00:00Z'
  }
];
export function AppProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>(mockItems);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [pointTransactions, setPointTransactions] = useState<PointTransaction[]>(mockPointTransactions);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>(mockUserProfiles);

  const addItem = (item: Omit<Item, 'id' | 'uploadDate'>) => {
    const newItem: Item = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      uploadDate: new Date().toISOString().split('T')[0],
      approved: false
    };
    setItems(prev => [newItem, ...prev]);
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const createSwapRequest = (request: Omit<SwapRequest, 'id' | 'createdDate'>) => {
    const newRequest: SwapRequest = {
      ...request,
      id: Math.random().toString(36).substr(2, 9),
      createdDate: new Date().toISOString().split('T')[0]
    };
    setSwapRequests(prev => [newRequest, ...prev]);
  };

  const updateSwapRequest = (id: string, updates: Partial<SwapRequest>) => {
    setSwapRequests(prev => prev.map(request => 
      request.id === id ? { ...request, ...updates } : request
    ));
  };

  const sendMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  const markMessageAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const addPointTransaction = (transaction: Omit<PointTransaction, 'id' | 'timestamp'>) => {
    const newTransaction: PointTransaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setPointTransactions(prev => [newTransaction, ...prev]);
  };

  const getUserProfile = (userId: string): UserProfile | undefined => {
    return userProfiles.find(profile => profile.id === userId);
  };

  const updateUserProfile = (userId: string, updates: Partial<UserProfile>) => {
    setUserProfiles(prev => prev.map(profile => 
      profile.id === userId ? { ...profile, ...updates } : profile
    ));
  };
  const value = {
    items,
    swapRequests,
    messages,
    pointTransactions,
    userProfiles,
    addItem,
    updateItem,
    createSwapRequest,
    updateSwapRequest,
    sendMessage,
    markMessageAsRead,
    addPointTransaction,
    getUserProfile,
    updateUserProfile
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}