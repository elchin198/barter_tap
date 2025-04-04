// Database types and connections
import { 
  User, InsertUser,
  Item, InsertItem,
  Image, InsertImage,
  Favorite, InsertFavorite,
  Category, InsertCategory,
  Conversation, InsertConversation,
  ConversationParticipant, InsertConversationParticipant,
  Message, InsertMessage
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Items
  getItem(id: number): Promise<Item | undefined>;
  getItemsByUserId(userId: number): Promise<Item[]>;
  getItemsByCategory(category: string): Promise<Item[]>;
  getRecentItems(limit: number): Promise<Item[]>;
  searchItems(query: string, category?: string): Promise<Item[]>;
  createItem(item: InsertItem): Promise<Item>;
  updateItemStatus(id: number, status: 'active' | 'pending' | 'completed' | 'inactive'): Promise<Item | undefined>;

  // Images
  getImagesByItemId(itemId: number): Promise<Image[]>;
  createImage(image: InsertImage): Promise<Image>;

  // Favorites
  getFavoritesByUserId(userId: number): Promise<Favorite[]>;
  isFavorite(userId: number, itemId: number): Promise<boolean>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, itemId: number): Promise<void>;

  // Categories
  getAllCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryByName(name: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Conversations
  getConversation(id: number): Promise<Conversation | undefined>;
  getConversationByParticipants(userId1: number, userId2: number, itemId: number): Promise<Conversation | undefined>;
  getConversationsByUserId(userId: number): Promise<Conversation[]>;
  getConversationParticipants(conversationId: number): Promise<ConversationParticipant[]>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  addParticipantToConversation(participant: InsertConversationParticipant): Promise<ConversationParticipant>;

  // Messages
  getMessagesByConversationId(conversationId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessageStatus(id: number, status: 'sent' | 'delivered' | 'read'): Promise<Message | undefined>;
}

export class MemStorage implements IStorage {
  // ...[kod olduğu kimi saxlanılır, çünki problem yoxdur]
}

export const storage: IStorage = new MemStorage();