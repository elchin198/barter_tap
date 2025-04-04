import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, ArrowRight, Plus, Home, Handshake, Book, 
  MonitorSmartphone, Car, Shirt, Building, Flower, 
  Gamepad2, Sofa, Dumbbell, CirclePlus, ArrowRightLeft,
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "../context/AuthContext";
import { cn } from "@/lib/utils";
import { Item } from "@shared/schema";
import { CompleteItem, createMockItem } from "../types/item"; // Added import


interface Category {
  id: string;
  name: string;
  displayName: string;
  icon: React.ReactNode;
}

interface ItemWithImage extends Item {
  mainImage: string;
  ownerName: string;
  ownerAvatar?: string;
  status: string;
  createdAt: Date;
  userId: number;
  subcategory: string | null;
  condition: string;
  updatedAt: Date;
}

export default function BarterTapHome() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Define categories with icons
  const categories: Category[] = [
    { id: "all", name: "all", displayName: t('categories.all', 'Hamısı'), icon: <Home /> },
    { id: "services", name: "services", displayName: t('categories.services', 'Xidmətlər'), icon: <Handshake /> },
    { id: "books", name: "books", displayName: t('categories.books', 'Kitablar'), icon: <Book /> },
    { id: "electronics", name: "electronics", displayName: t('categories.electronics', 'Elektronika'), icon: <MonitorSmartphone /> },
    { id: "vehicles", name: "vehicles", displayName: t('categories.vehicles', 'Nəqliyyat'), icon: <Car /> },
    { id: "clothing", name: "clothing", displayName: t('categories.clothing', 'Geyim'), icon: <Shirt /> },
    { id: "real-estate", name: "real-estate", displayName: t('categories.realEstate', 'Daşınmaz əmlak'), icon: <Building /> },
    { id: "garden", name: "garden", displayName: t('categories.garden', 'Bağ və bağça'), icon: <Flower /> },
    { id: "games", name: "games", displayName: t('categories.games', 'Oyunlar'), icon: <Gamepad2 /> },
    { id: "furniture", name: "furniture", displayName: t('categories.furniture', 'Mebel'), icon: <Sofa /> },
    { id: "sports", name: "sports", displayName: t('categories.sports', 'İdman'), icon: <Dumbbell /> },
  ];

  // Fetch all items
  const { data: apiItems = [] } = useQuery<ItemWithImage[]>({
    queryKey: ['/api/items', { featured: true }],
  });

  // Fetch recent items
  const { data: apiRecentItems = [] } = useQuery<ItemWithImage[]>({
    queryKey: ['/api/items', { recent: true }],
  });

  // Fake items for demonstration.  This section is updated to use CompleteItem and createMockItem
  const featuredItems: CompleteItem[] = [
    createMockItem({
      id: 1,
      title: "Apple MacBook Pro 16 inch",
      description: "Almost new laptop, used for just 3 months",
      price: 2500,
      category: "electronics", // lowercase to match interface
      city: "Bakı",
      mainImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca6?q=80&w=1000&auto=format&fit=crop",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 1,
      subcategory: "Laptops",
      condition: "Like New",
      viewCount: 120,
      featured: true,
      ownerName: "Ali Huseynov",
      ownerAvatar: "https://randomuser.me/api/portraits/men/1.jpg"
    } as any),
    createMockItem({
      id: 8,
      title: "PlayStation 5 with 2 controllers",
      description: "Brand new PS5 with extra controller",
      price: 1200,
      category: "electronics", // lowercase to match interface
      city: "Gəncə",
      mainImage: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1000&auto=format&fit=crop",
      ownerName: "Elvin Məmmədov",
      ownerAvatar: "https://randomuser.me/api/portraits/men/8.jpg",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 8,
      subcategory: "Consoles",
      condition: "New",
      viewCount: 85
    } as any)
  ];

  const fakeItems: ItemWithImage[] = [
    {
      id: 1,
      title: "iPhone 12 Pro Max",
      description: "Əla vəziyyətdə, qutuda yeni kimidir. Batareya 90% sağlamlıq. Heç bir cızıq yoxdur.",
      price: 400,
      category: "electronics",
      city: "Bakı",
      mainImage: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=500&auto=format&fit=crop",
      ownerName: "Anar",
      ownerAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      condition: "Əla",
      subcategory: "Telefonlar"
    },
    {
      id: 2,
      title: "Corporate Finance: Core Applications and Principles",
      description: "Maliyyə ixtisası üçün dərslik. Təmiz vəziyyətdə, qeydlər yoxdur.",
      price: 25,
      category: "books",
      city: "Bakı",
      mainImage: "https://images.unsplash.com/photo-1621944190310-e3cca1564bd7?q=80&w=500&auto=format&fit=crop",
      ownerName: "Sevil",
      ownerAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      condition: "Əla",
      subcategory: "Dərsliklər"
    },
    {
      id: 3,
      title: "Principles of Managerial Finance 13th Edition",
      description: "Universitet dərsliyi. Əla vəziyyətdə.",
      price: 20,
      category: "books",
      city: "Sumqayıt",
      mainImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=500&auto=format&fit=crop",
      ownerName: "Kamil",
      ownerAvatar: "https://randomuser.me/api/portraits/men/3.jpg",
      userId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      condition: "Əla",
      subcategory: "Dərsliklər"
    },
    {
      id: 4,
      title: "Corporate Finance Instructor",
      description: "Müəllim dərsliyi, bütün cavablar var.",
      price: 100,
      category: "books",
      city: "Bakı",
      mainImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=500&auto=format&fit=crop",
      ownerName: "Robert",
      ownerAvatar: "https://randomuser.me/api/portraits/men/4.jpg",
      userId: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      condition: "Əla",
      subcategory: "Dərsliklər"
    },
    {
      id: 5,
      title: "Linear Algebra and Its Applications",
      description: "Riyaziyyat dərsliyi, təmiz vəziyyətdə.",
      price: 25,
      category: "books",
      city: "Gəncə",
      mainImage: "https://images.unsplash.com/photo-1535927359948-10b50723004a?q=80&w=500&auto=format&fit=crop",
      ownerName: "Susanna",
      ownerAvatar: "https://randomuser.me/api/portraits/women/5.jpg",
      userId: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      condition: "Əla",
      subcategory: "Dərsliklər"
    },
    {
      id: 6,
      title: "Calculus: Early Transcendentals",
      description: "James Stewart müəllifindən riyaziyyat dərsliyi.",
      price: 220,
      category: "books",
      city: "Bakı",
      mainImage: "https://images.unsplash.com/photo-1592087276366-155c9910c200?q=80&w=500&auto=format&fit=crop",
      ownerName: "Günel",
      ownerAvatar: "https://randomuser.me/api/portraits/women/6.jpg",
      userId: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      condition: "Əla",
      subcategory: "Dərsliklər"
    },
    {
      id: 7,
      title: "Advanced Engineering Mathematics",
      description: "Mühəndislik üçün riyaziyyat dərsliyi.",
      price: 85,
      category: "books",
      city: "Bakı",
      mainImage: "https://images.unsplash.com/photo-1602518201448-c16d343d47df?q=80&w=500&auto=format&fit=crop",
      ownerName: "Əhməd",
      ownerAvatar: "https://randomuser.me/api/portraits/men/7.jpg",
      userId: 7,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      condition: "Əla",
      subcategory: "Dərsliklər"
    },
    {
      id: 8,
      title: "PlayStation 5 Digital Edition",
      description: "Yeni vəziyyətdə, tam qutuda, bir controller ilə.",
      price: 450,
      category: "games",
      city: "Bakı",
      mainImage: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=500&auto=format&fit=crop",
      ownerName: "Namiq",
      ownerAvatar: "https://randomuser.me/api/portraits/men/8.jpg",
      userId: 8,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      condition: "Yeni",
      subcategory: "Oyun Konsolu"
    }
  ];

  // Fake recent items
  const fakeRecentItems: ItemWithImage[] = [
    {
      id: 9,
      title: "Samsung Galaxy S22 Ultra",
      description: "Yeni model, 256GB, tam qutuda.",
      price: 700,
      category: "electronics",
      city: "Bakı",
      mainImage: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=500&auto=format&fit=crop",
      ownerName: "Natəvan",
      ownerAvatar: "https://randomuser.me/api/portraits/women/9.jpg",
      userId: 9,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      condition: "Yeni",
      subcategory: "Telefonlar"
    },
    {
      id: 10,
      title: "MacBook Pro M1 Pro 16 inch",
      description: "2021 model, 16GB RAM, 512GB SSD.",
      price: 1200,
      category: "electronics",
      city: "Bakı",
      mainImage: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=500&auto=format&fit=crop",
      ownerName: "Fərid",
      ownerAvatar: "https://randomuser.me/api/portraits/men/10.jpg",
      userId: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      condition: "Əla",
      subcategory: "Noutbuklar"
    },
    {
      id: 11,
      title: "Ikea MALM çarpayı",
      description: "İkili çarpayı, matras daxil deyil.",
      price: 180,
      category: "furniture",
      city: "Bakı",
      mainImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=500&auto=format&fit=crop",
      ownerName: "Lalə",
      ownerAvatar: "https://randomuser.me/api/portraits/women/11.jpg",
      userId: 11,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      condition: "Yaxşı",
      subcategory: "Yataq Mebelləri"
    },
    {
      id: 12,
      title: "Fitness klub üzvlüyü",
      description: "1 illik üzvlük, istənilən vaxt başlaya bilər.",
      price: 300,
      category: "sports",
      city: "Bakı",
      mainImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=500&auto=format&fit=crop",
      ownerName: "Vüsal",
      ownerAvatar: "https://randomuser.me/api/portraits/men/12.jpg",
      userId: 12,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "active",
      condition: "Yeni",
      subcategory: "Fitness"
    }
  ];

  // Combine API data with fake data
  const items = apiItems.length > 0 ? apiItems : fakeItems;
  const recentItems = apiRecentItems.length > 0 ? apiRecentItems : fakeRecentItems;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/items?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Search */}
      <div className="bg-white border-b border-gray-200 py-4 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Commented out to prevent duplicate logos
          <Link href="/">
            <img 
              src="/assets/logo.svg" 
              alt="BarterTap.az" 
              className="h-8"
              onError={(e) => {
                e.currentTarget.src = "/barter-logo.png";
                e.currentTarget.onerror = null;
              }}
            />
          </Link>
          */}

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Input
                type="text"
                placeholder={t('search.placeholder', 'Search for something to barter')}
                className="w-full rounded-full pl-10 pr-4 py-2 border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700 rounded-full flex items-center gap-2 shadow-sm"
                onClick={() => navigate("/items/new")}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">{t('common.listNewItem', 'List a new item')}</span>
                <span className="sm:hidden">Yeni elan</span>
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="rounded-full border-green-600 text-green-600 hover:bg-green-50 shadow-sm">
                    {t('common.login', 'Log in')}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="default" className="rounded-full bg-green-600 hover:bg-green-700 shadow-sm">
                    {t('common.signup', 'Sign up')}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Category Icons */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex overflow-x-auto gap-5 pb-2 hide-scrollbar">
          {categories.map((category) => (
            <div 
              key={category.id}
              onClick={() => {
                if (category.id === "all") {
                  setSelectedCategory(null);
                } else {
                  setSelectedCategory(category.id);
                  navigate(`/items?category=${category.id}`);
                }
              }}
              className="flex flex-col items-center cursor-pointer min-w-[75px]"
            >
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-2 transition-all shadow-sm",
                category.id === (selectedCategory || "all") 
                  ? "bg-green-100 text-green-600 ring-2 ring-green-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              )}>
                {category.icon}
              </div>
              <span className="text-xs font-medium text-center text-gray-700">{category.displayName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* All Offers Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t('allOffers.title', 'All offers')}</h2>

          {user && (
            <div className="hidden md:block"> {/* Yalnız masaüstü versiyada göstər */}
              <Link href="/items/new">
                <Button className="bg-green-600 hover:bg-green-700 rounded-full shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('common.listNewItem', 'List a new item')}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.slice(0, 8).map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        {/* View more button */}
        {items.length > 8 && (
          <div className="text-center mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate("/items")}
              className="rounded-full border-green-500 text-green-600 px-6 shadow-sm"
            >
              {t('common.viewAll', 'View all items')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Recently Added Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t('recentItems.title', 'Recently Added')}</h2>

          <Link href="/items?sort=newest">
            <Button variant="ghost" className="text-green-600 hover:text-green-800 hover:bg-green-50">
              {t('common.viewAll', 'View all')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Recent Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentItems.slice(0, 4).map((item) => (
            <ItemCard key={item.id} item={item} isRecent />
          ))}
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">{t('howItWorks.title', 'How It Works')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard 
              step="1" 
              title={t('howItWorks.step1.title', 'Add your items')} 
              description={t('howItWorks.step1.description', 'Add photos and descriptions of items you no longer need.')}
              icon={<Plus className="h-6 w-6 text-green-600" />}
            />
            <StepCard 
              step="2" 
              title={t('howItWorks.step2.title', 'Make offers')} 
              description={t('howItWorks.step2.description', 'Find items you want and offer your items in exchange.')}
              icon={<ArrowRightLeft className="h-6 w-6 text-green-600" />}
            />
            <StepCard 
              step="3" 
              title={t('howItWorks.step3.title', 'Exchange and rate')} 
              description={t('howItWorks.step3.description', 'Meet up, make the exchange and rate your experience.')}
              icon={<Handshake className="h-6 w-6 text-green-600" />}
            />
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              onClick={() => navigate("/how-it-works")}
              className="rounded-full border-green-500 text-green-600 px-6 shadow-sm"
            >
              {t('howItWorks.learnMore', 'Learn more about bartering')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t('cta.title', 'Join now and start bartering')}</h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle', 'Thousands of users have already gotten items they need without spending money. Join the bartering movement!')}
          </p>
          <Button 
            variant="default"
            className="bg-white text-green-600 hover:bg-green-50 rounded-full px-8 py-6 text-lg shadow-md"
            onClick={() => navigate("/register")}
          >
            {t('auth.register', 'Sign up for free')}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Item Card Component
function ItemCard({ item, isRecent = false }: { item: ItemWithImage; isRecent?: boolean }) {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative group">
      {/* Main content */}
      <div className="w-full bg-white overflow-hidden rounded-md shadow-sm">
        {/* Item Image */}
        <div 
          className="relative w-full h-48 bg-gray-100 cursor-pointer"
          onClick={() => navigate(`/items/${item.id}`)}
        >
          <img 
            src={item.mainImage || '/assets/placeholder-image.jpg'} 
            alt={item.title} 
            className="w-full h-full object-cover" 
          />

          {/* Owner label */}
          <div className="absolute left-0 bottom-0 bg-green-600 text-white px-4 py-1.5 text-sm font-medium shadow-sm">
            {item.ownerName} təklifi
          </div>
        </div>

        {/* Make an offer button */}
        <Button 
          className="w-full py-3 h-auto text-base font-medium rounded-none bg-green-600 hover:bg-green-700 text-white shadow-sm"
          onClick={() => navigate(`/offers/new?toItemId=${item.id}`)}
        >
          Təklif et
        </Button>

        {/* Item Info */}
        <div className="p-3">
          {/* Value */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">dəyər:</span>
            {item.price ? (
              <span className="font-bold">${item.price}</span>
            ) : (
              <span>Yalnız mübadilə</span>
            )}
            <Badge variant="outline" className="ml-1 bg-green-50 text-green-800 border-green-200 font-medium">
              Qismən Nağd
            </Badge>
          </div>

          {/* Title */}
          <h3 
            className="text-base font-medium line-clamp-1 mb-1 cursor-pointer hover:text-green-600"
            onClick={() => navigate(`/items/${item.id}`)}
          >
            {item.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-green-500" />
            <span>{item.city || "Naməlum Məkan"}</span>
          </div>
        </div>
      </div>

      {/* Exchange button (visible on hover) */}
      <div className="absolute top-1/2 transform -translate-y-1/2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          className="rounded-full w-14 h-14 p-0 flex items-center justify-center bg-green-600 hover:bg-green-700 shadow-md"
          onClick={() => navigate(`/offers/new?toItemId=${item.id}`)}
        >
          <ArrowRightLeft className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Exchange button on left (visible on hover) */}
      <div className="absolute top-1/2 transform -translate-y-1/2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="outline"
          className="rounded-full w-14 h-14 p-0 flex items-center justify-center bg-white border-gray-200 shadow-sm"
          onClick={() => navigate(`/items/${item.id}`)}
        >
          <ArrowRightLeft className="h-6 w-6 text-gray-600" />
        </Button>
      </div>
    </div>
  );
}

// Step Card Component
function StepCard({ step, title, description, icon }: { step: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center h-full hover:shadow-md hover:border-green-100 transition-all duration-300">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold shadow-sm">
        {step}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}