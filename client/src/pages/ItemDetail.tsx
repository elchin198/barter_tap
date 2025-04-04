import { useState, useEffect, useRef } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, MessageCircle, Share2, AlertTriangle, Star, MapPin, Clock, 
  ExternalLink, UserCircle, Users, Package, CheckCircle, ShieldCheck,
  Calendar, Tag, BarChart, Eye, Bookmark, ThumbsUp, Camera, BookOpen,
  ChevronRight, AtSign, Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "../context/AuthContext";
import { Item, User as UserType } from "@shared/schema";
import { ReviewsSection, ReviewStars } from "@/components/reviews";
import UserItems from "@/components/items/UserItems";
import MessageModal from "@/components/messaging/MessageModal";
import SEO from "@/components/SEO";
import { useTranslation } from "react-i18next";
import LocationMap, { getCityCoordinates } from "@/components/map/LocationMap";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import NotFound from "./not-found";
import { BarterProgress, type BarterStatus } from "@/components/items/BarterProgress";
import RelatedItems from "@/components/items/RelatedItems";
import ImageGallery from "@/components/items/ImageGallery"; // Updated import

// Bu interfeys API-dən qaytarılan tam məlumat strukturunu təmsil edir
// API-dən gələn data ilə uyğun gəlməlidir
interface ItemDetailResponse {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  subcategory: string | null; // null olmalıdır, undefined yox
  condition: string;
  city: string;
  status: string;
  price: number;
  wantedExchange: string;
  viewCount: number;
  createdAt: string; // API string olaraq qaytarır, Date obyekti yaratmaq lazımdır istifadə zamanı
  updatedAt: string;
  images: Array<{
    id: number;
    filePath: string;
    isMain: boolean;
  }>;
  owner?: UserType & {
    rating?: number;
    reviewCount?: number;
  }; // Bu bəzən gəlməyə bilər
  isFavorite?: boolean; // Bu istifadəçi giriş etmədikdə gəlməyə bilər
  coordinates?: string; // JSON string with [lat, lng]
}

// This wrapper component handles parameter validation before rendering the main ItemDetail
export default function ItemDetailWrapper() {
  const [, params] = useRoute<{ id: string }>("/items/:id");
  const [, navigate] = useLocation();

  // Validate ID parameter first
  const itemId = params?.id ? parseInt(params.id) : -1;

  // Handle invalid ID early before rendering the main component
  if (itemId <= 0 || !params?.id) {
    navigate("/");
    return null;
  }

  // If ID is valid, render the actual ItemDetail component
  return <ItemDetailContent itemId={itemId} />;
}

// The main component with all the logic, only rendered when we have a valid ID
function ItemDetailContent({ itemId }: { itemId: number }) {
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Define animation hooks before any conditional returns to maintain consistent hook order
  const scrollRef = useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: scrollRef,
    offset: ["start start", "end start"] 
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -20]);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedItemForOffer, setSelectedItemForOffer] = useState<number | null>(null);
  const [favorited, setFavorited] = useState(false);
  const [openMessageModal, setOpenMessageModal] = useState(false);

  // Fetch item details
  const { data: item, isLoading, error, isError } = useQuery<ItemDetailResponse>({
    queryKey: [`/api/items/${itemId}`],
    retry: 3, // Try 3 times if fails
    retryDelay: 1000, // Wait 1 second between retries
    // useQuery'nin uyğun overload'ını istifadə etmək üçün options istifadə edirik
    // onError parametri olmadan
  });

  // Handle error separately
  if (isError || (!isLoading && !item)) {
    return (
      <NotFound 
        title={t('errors.itemNotFoundTitle', 'Əşya tapılmadı')}
        message={t('errors.itemNotFoundDescription', 'Axtardığınız əşya mövcud deyil və ya silinmişdir.')}
      />
    );
  }

  // Fetch user's items for making offers
  const { data: userItems = [] } = useQuery<(Item & { mainImage?: string })[]>({
    queryKey: ['/api/items', { userId: user?.id }],
    enabled: !!user,
  });

  // Set initial favorited state
  useEffect(() => {
    if (item) {
      setFavorited(!!item.isFavorite);
    }
  }, [item]);

  // Add to favorites mutation
  const addFavoriteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/favorites', { itemId });
    },
    onSuccess: () => {
      setFavorited(true);
      toast({ title: "Added to favorites" });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      queryClient.invalidateQueries({ queryKey: [`/api/items/${itemId}`] });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to add to favorites", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  // Remove from favorites mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/favorites/${itemId}`);
    },
    onSuccess: () => {
      setFavorited(false);
      toast({ title: "Removed from favorites" });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      queryClient.invalidateQueries({ queryKey: [`/api/items/${itemId}`] });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to remove from favorites", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/conversations', {
        otherUserId: item?.userId,
        itemId,
        message
      });
    },
    onSuccess: () => {
      toast({ title: "Message sent successfully" });
      setMessage("");
      navigate("/messages");
    },
    onError: (error) => {
      toast({ 
        title: "Failed to send message", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  // Send offer mutation
  const sendOfferMutation = useMutation({
    mutationFn: async () => {
      if (!selectedItemForOffer) return;

      await apiRequest('POST', '/api/offers', {
        toUserId: item?.userId,
        fromItemId: selectedItemForOffer,
        toItemId: itemId
      });
    },
    onSuccess: () => {
      toast({ title: "Offer sent successfully" });
      setSelectedItemForOffer(null);
      queryClient.invalidateQueries({ queryKey: ['/api/offers'] });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to send offer", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  const handleFavoriteToggle = () => {
    if (!user) {
      toast({ 
        title: "Authentication required", 
        description: "Please log in to add items to favorites",
        variant: "destructive"
      });
      return;
    }

    if (favorited) {
      removeFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({ 
        title: "Message required", 
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    sendMessageMutation.mutate();
  };

  const handleSendOffer = () => {
    if (!selectedItemForOffer) {
      toast({ 
        title: "Item selection required", 
        description: "Please select an item to offer",
        variant: "destructive"
      });
      return;
    }

    sendOfferMutation.mutate();
  };

  // Handle loading states
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-b-orange-500 border-l-blue-300 border-r-orange-300 rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  // Əmin olaq ki, item dəyəri var
  // Aşağıdakı kod null-safety təmin edir - əgər item yoxdursa, yuxarıdakı error handling kodu çalışmalıdır
  // Bu kod heç vaxt ifa edilməyəcək, lakin TypeScript üçün lazımdır
  if (!item) {
    return null;
  }

  // Get images with default if none
  const images = item.images && item.images.length > 0 
    ? item.images 
    : [{ id: 0, filePath: "https://placehold.co/600x400/e2e8f0/64748b?text=Şəkil+Yoxdur", isMain: true }];

  // Image gallery will use the enhanced options defined below

  // Get status badge
  const getStatusBadge = () => {
    switch (item.status) {
      case 'active':
        return <Badge className="bg-green-500">{t('items.active', 'Aktiv')}</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">{t('items.pending', 'Gözləyir')}</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">{t('items.completed', 'Tamamlanıb')}</Badge>;
      default:
        return null;
    }
  };

  // Check if user is the owner - ensure we have item first
  const isOwner = user?.id === item?.userId;

  // Filter out tradeable items (user's active items excluding current item)
  const tradeableItems = userItems.filter(i => i.status === 'active' && i.id !== itemId);

  // Define SEO meta data for item detail page
  const itemTitle = t('seo.itemTitle', `${item.title} | BarterTap.az - Əşya Mübadiləsi`);
  const itemDescription = t(
    'seo.itemDescription', 
    `${item.description.substring(0, 150)}${item.description.length > 150 ? '...' : ''} – BarterTap.az üzərindən barter edin.`
  );
  const itemKeywords = t(
    'seo.itemKeywords',
    `barter, ${item.title}, ${item.category}, əşya mübadiləsi, dəyişmək, ${item.condition}, pulsuz mübadilə`
  );

  // We no longer need these options since we're using our own ImageGallery component
  const setImageIndex = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="container mx-auto px-4 py-8" ref={scrollRef}>
      {/* Page-specific SEO */}
      <SEO 
        title={itemTitle}
        description={itemDescription}
        keywords={itemKeywords}
        pathName={location}
        ogImage={images[0]?.filePath}
      />

      {/* Sticky Header with Key Item Info */}
      <AnimatePresence>
        <motion.div 
          className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 py-3 px-4 mb-6 rounded-lg shadow-sm"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 relative flex-shrink-0">
                <img 
                  src={images[0]?.filePath} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
                {item.status === 'completed' && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <CheckCircle className="text-white h-6 w-6" />
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-base font-bold line-clamp-1">{item.title}</h2>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {item.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {getStatusBadge()}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleFavoriteToggle}
                className={favorited ? "text-red-500" : "text-gray-400"}
              >
                <Heart className="h-5 w-5" fill={favorited ? "currentColor" : "none"} />
              </Button>
              {user && !isOwner && (
                <Button 
                  variant="default"
                  size="sm"
                  onClick={() => navigate(`/offers/new?toItemId=${item.id}`)}
                  className="flex items-center gap-1"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Təklif göndər</span>
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Images with Enhanced Gallery */}
        <motion.div 
          className="space-y-4"
          style={{ opacity, scale, y }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {images.length > 0 && (
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <div className="relative aspect-w-4 aspect-h-3 bg-gray-100 rounded-lg overflow-hidden">
                <ImageGallery
                  images={images.map(image => image.filePath)}
                  title={item.title}
                  variant="large"
                />
              </div>

              {/* Image count badge */}
              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs flex items-center">
                  <Camera className="h-3 w-3 mr-1" />
                  {images.length} şəkil
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Item details - Enhanced with animations */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">{item.title}</h1>
                </div>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Tag className="h-4 w-4 mr-1 text-blue-500" />
                    {item.category}
                  </span>
                  <span className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-amber-500" />
                    {item.condition}
                  </span>
                  <span className="flex items-center">
                    <Eye className="h-4 w-4 mr-1 text-violet-500" />
                    {item.viewCount || 0} {t('item.views', 'baxış')}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant={favorited ? "outline" : "ghost"}
                  size="icon"
                  onClick={handleFavoriteToggle}
                  className={`${favorited 
                    ? "text-red-500 border-red-200 bg-red-50 hover:bg-red-100" 
                    : "text-gray-400 hover:text-red-400 hover:bg-red-50"
                  } relative transition-all duration-300 transform ${favorited ? "scale-110" : ""} hover:scale-110`}
                  title={favorited ? "Favoritlərdən çıxar" : "Favorit et"}
                >
                  <Heart 
                    className={`h-6 w-6 ${favorited ? "animate-pulse" : ""}`} 
                    fill={favorited ? "currentColor" : "none"} 
                    strokeWidth={favorited ? 2 : 1.5}
                  />
                  {favorited && (
                    <span className="absolute -top-2 -right-2 text-xs font-bold text-red-500">❤️</span>
                  )}
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-500 transition-all">
                  <Share2 className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Key Item Info - Styled as Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              <motion.div 
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 flex flex-col items-center justify-center border border-blue-200"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white p-2 rounded-full mb-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-xs text-gray-500 mb-1">Yerləşdirildi</span>
                <span className="text-sm font-medium text-blue-700">{new Date(item.createdAt).toLocaleDateString()}</span>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 flex flex-col items-center justify-center border border-green-200"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white p-2 rounded-full mb-2">
                  <MapPin className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-xs text-gray-500 mb-1">Yerləşir</span>
                <span className="text-sm font-medium text-green-700">{item.city || "N/A"}</span>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 flex flex-col items-center justify-center border border-amber-200"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white p-2 rounded-full mb-2">
                  <Star className="h-5 w-5 text-amber-500" />
                </div>
                <span className="text-xs text-gray-500 mb-1">Vəziyyət</span>
                <span className="text-sm font-medium text-amber-700">{item.condition}</span>
              </motion.div>
            </div>

            <motion.div 
              className="prose max-w-none"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Əşya haqqında məlumat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-gray-700 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>

              {/* Barter Progress Status Card - New Addition */}
              <Card className="border-none shadow-sm overflow-hidden mt-4">
                <CardContent className="p-4">
                  <BarterProgress 
                    status={(item.status === 'active' ? 'pending' : 
                            item.status === 'pending' ? 'accepted' : 
                            item.status === 'completed' ? 'completed' : 'pending') as BarterStatus}
                    className="mt-2"
                  />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Owner information - Enhanced Design (yalnız owner datası varsa göstərilir) */}
          {item.owner ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="overflow-hidden border-none shadow-md bg-gradient-to-tr from-blue-50 via-white to-blue-50">
                <CardHeader className="pb-2 bg-white/80 backdrop-blur-sm border-b">
                  <CardTitle className="text-base flex items-center gap-2">
                    <UserCircle className="h-5 w-5 text-blue-600" />
                    Bu elanı yerləşdirən
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16 border-4 border-white shadow-md">
                        <AvatarImage 
                          src={item.owner.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.owner.fullName || item.owner.username)}&background=3b82f6&color=fff`} 
                          alt={item.owner.username} 
                        />
                        <AvatarFallback className="bg-blue-500 text-white text-xl">
                          {item.owner.username?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center border-2 border-white shadow-sm">
                        <ShieldCheck className="h-3 w-3" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-lg">{item.owner.fullName || item.owner.username}</h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <AtSign className="h-3 w-3 mr-1" />
                            {item.owner.username}
                          </p>
                        </div>

                        <Link href={`/profile/${item.owner.username}`}>
                          <Button variant="outline" size="sm" className="text-sm flex items-center gap-1.5 border-blue-200 shadow-sm hover:bg-blue-50">
                            <ExternalLink className="h-3 w-3" />
                            Profilə bax
                          </Button>
                        </Link>
                      </div>

                      <div className="mt-3">
                        <ReviewsSection userId={item.userId} minimal={true} />

                        {/* İstifadəçi statusu - yalnız createdAt varsa göstərilir */}
                        <div className="flex gap-2 flex-wrap">
                          {item.owner.createdAt && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              <Clock className="h-3 w-3 mr-1" />
                              <span className="text-xs">Üzv: {new Date(item.owner.createdAt).toLocaleDateString()}</span>
                            </Badge>
                          )}

                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            <span className="text-xs">Təsdiqlənmiş</span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Card className="overflow-hidden border-none shadow-md bg-gradient-to-tr from-blue-50 via-white to-blue-50">
              <CardHeader className="pb-2 bg-white/80 backdrop-blur-sm border-b">
                <CardTitle className="text-base flex items-center gap-2">
                  <UserCircle className="h-5 w-5 text-blue-600" />
                  Bu elanı yerləşdirən
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-col items-center justify-center py-4">
                  <Avatar className="h-16 w-16 border-4 border-white shadow-md mb-2">
                    <AvatarFallback className="bg-blue-500 text-white text-xl">?</AvatarFallback>
                  </Avatar>
                  <p className="text-sm text-gray-600">İstifadəçi məlumatları yüklənir...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Statistika kartları */}
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <motion.div 
                className="p-3 bg-blue-50 rounded-lg flex flex-col items-center border border-blue-100"
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <Package className="h-5 w-5 text-blue-600 mb-1" />
                <span className="block text-lg font-medium text-blue-600">17</span>
                <span className="text-xs text-gray-600">Aktiv elan</span>
              </motion.div>

              <motion.div 
                className="p-3 bg-green-50 rounded-lg flex flex-col items-center border border-green-100"
                whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <ThumbsUp className="h-5 w-5 text-green-600 mb-1" />
                <span className="block text-lg font-medium text-green-600">23</span>
                <span className="text-xs text-gray-600">Tamamlanmış barter</span>
              </motion.div>
            </div>

            {/* Təklif və mesaj düymələri */}
            {user && !isOwner && (
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => setOpenMessageModal(true)}
                  className="flex items-center gap-1.5 border border-blue-200"
                  variant="outline"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">Mesaj yazın</span>
                </Button>

                <Button 
                  onClick={() => navigate(`/offers/new?toItemId=${item.id}`)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-blue-500"
                >
                  <Share2 className="h-4 w-4" />
                  <span className="text-sm">Təklif göndərin</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Location Map with Enhanced Design */}
      {item.city && item.city !== "N/A" && (
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xl font-bold flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Yerləşdiyi yer
            </h3>
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
              {item.city}
            </Badge>
          </div>
          <div className="h-[400px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
            <LocationMap 
              markers={[{
                id: item.id,
                position: getCityCoordinates(item.city), 
                title: item.title,
                city: item.city
              }]}
              singleMarker={true}
              zoom={13}
            />
          </div>
        </motion.div>
      )}

      {/* User's other items - Enhanced Design */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <Package className="h-5 w-5 mr-2 text-blue-600" />
            Bu istifadəçinin digər elanları
          </h3>
          <Link href={`/items?userId=${item.userId}`}>
            <Button variant="outline" size="sm" className="text-xs border-blue-200 hover:bg-blue-50">
              Hamısına bax
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <UserItems userId={item.userId} excludeItemId={item.id} className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" />
      </motion.div>

      {/* Message Modal */}
      {item.owner && 
        <MessageModal 
          isOpen={openMessageModal}
          onClose={() => setOpenMessageModal(false)}
          item={item}
          recipient={item.owner}
          onSend={(messageText: string) => {
            setMessage(messageText);
            handleSendMessage();
            setOpenMessageModal(false);
          }}
        />
      }

      {/* Related Items - newly implemented component */}
      <motion.div 
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
      >
        <RelatedItems
          itemId={item.id}
          category={item.category || ""}
          city={item.city || ""}
        />
      </motion.div>
    </div>
  );
}