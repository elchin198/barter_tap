
// Basic Item interface that all other item interfaces extend
export interface BaseItem {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  city: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  subcategory: string | null;
  condition: string;
  viewCount: number | null;
  featured: boolean;
  location?: string | null;
}

// Item with owner information
export interface ItemWithOwner extends BaseItem {
  ownerName: string;
  ownerAvatar: string | null;
}

// Item with image information
export interface ItemWithImage extends BaseItem {
  mainImage: string;
  images?: string[];
}

// Combine both for a complete item representation
export interface CompleteItem extends BaseItem {
  mainImage: string;
  images?: string[];
  ownerName: string;
  ownerAvatar: string | null;
}

// Mock data helper to convert string dates to Date objects
export const createItemWithDates = (item: any): BaseItem => {
  return {
    ...item,
    createdAt: new Date(item.createdAt || new Date()),
    updatedAt: new Date(item.updatedAt || new Date()),
    city: item.city || null,
    subcategory: item.subcategory || null,
    condition: item.condition || 'used',
    viewCount: item.viewCount || 0,
    featured: item.featured || false,
    status: item.status || 'active'
  };
};

// Helper to create mock item data that matches the required interface
export const createMockItem = (mockData: any): CompleteItem => {
  return {
    ...createItemWithDates(mockData),
    mainImage: mockData.mainImage || '',
    images: mockData.images || [],
    ownerName: mockData.ownerName || 'Unknown User',
    ownerAvatar: mockData.ownerAvatar || null
  };
};
