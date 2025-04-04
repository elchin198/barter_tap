
// Common type definitions

export interface User {
  id: number;
  role: string;
  email: string;
  password: string;
  username: string;
  fullName: string | null;
  avatar: string | null;
  bio: string | null;
  phone: string | null;
  city: string | null;
  rating: number | null;
  ratingCount: number | null;
  reviewCount?: number;
  completedTrades?: number;
  active: boolean;
  createdAt: Date;
}

export interface Item {
  id: number;
  title: string;
  description: string;
  price: number;
  status: string;
  category: string;
  subcategory: string | null;
  condition: string;
  city: string | null;
  viewCount: number | null;
  favoriteCount: number | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemWithImage extends Item {
  mainImage: string;
  images?: string[];
  ownerName: string;
  ownerAvatar: string;
  owner?: User;
}

export interface ItemWithDetails extends Item {
  owner: User;
  images: string[];
  mainImage: string;
  viewCount?: number;
}

export interface Category {
  id: number;
  name: string;
  displayName: string;
  icon: string;
  parentId: number | null;
}

export interface Conversation {
  id: number;
  createdAt: Date;
  itemId: number | null;
  lastMessageAt: Date;
  participants?: User[];
  otherParticipant?: User;
  unreadCount?: number;
  lastMessage?: Message;
}

export interface Message {
  id: number;
  content: string;
  status: string;
  createdAt: Date;
  conversationId: number;
  senderId: number;
  isRead: boolean;
  sender?: User;
}

export interface Offer {
  id: number;
  status: string;
  message: string | null;
  createdAt: Date;
  updatedAt: Date;
  conversationId: number;
  fromUserId: number;
  toUserId: number;
  fromItemId: number;
  toItemId: number;
  fromItem?: ItemWithImage;
  toItem?: ItemWithImage;
  fromUser?: User;
  toUser?: User;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: Date;
  reviewerId: number;
  userId: number;
  reviewer?: User;
  user?: User;
}
