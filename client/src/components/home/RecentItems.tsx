import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Clock, Clock3, RefreshCw, MapPin, BadgeCheck, Heart } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import { Item, ItemWithImages } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { useApi } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function RecentItems() {
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { fetchFromApi } = useApi();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [favoriteItems, setFavoriteItems] = useState<number[]>([]);
  
  // Favoritləri yükləmək
  useEffect(() => {
    if (user) {
      fetchFromApi<{itemId: number}[]>('/api/favorites')
        .then(favorites => {
          setFavoriteItems(favorites.map(f => f.itemId));
        })
        .catch(error => {
          console.error('Failed to fetch favorites:', error);
        });
    }
  }, [user]);
  
  // Infinite query for items with pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['/api/items'],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        return await fetchFromApi<ItemWithImages[]>('/api/items', {
          params: {
            offset: pageParam,
            limit: 12
          }
        });
      } catch (error) {
        console.error('Failed to fetch items:', error);
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      // If we received fewer items than requested, there are no more pages
      return lastPage.length < 12 ? undefined : allPages.length * 12;
    },
    initialPageParam: 0,
  });
  
  // Flatten all pages of items into a single array
  const items = data?.pages.flat() || [];
  
  // Favorit əlavə etmə mutasiyası
  const addFavoriteMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest('POST', '/api/favorites', { itemId });
    },
    onSuccess: (_, itemId) => {
      setFavoriteItems(prev => [...prev, itemId]);
      toast({ title: "Favorit edildi" });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    },
    onError: (error) => {
      toast({ 
        title: "Favorit əlavə edilə bilmədi", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });
  
  // Favorit silmə mutasiyası
  const removeFavoriteMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await apiRequest('DELETE', `/api/favorites/${itemId}`);
    },
    onSuccess: (_, itemId) => {
      setFavoriteItems(prev => prev.filter(id => id !== itemId));
      toast({ title: "Favoritlərdən çıxarıldı" });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    },
    onError: (error) => {
      toast({ 
        title: "Favoritlərdən çıxarıla bilmədi", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });

  // Favorit əlavə etmə/silmə
  const handleFavoriteToggle = (itemId: number) => {
    if (!user) {
      toast({ 
        title: "Giriş tələb olunur", 
        description: "Zəhmət olmasa favorit etmək üçün əvvəlcə daxil olun",
        variant: "destructive"
      });
      return;
    }
    
    if (favoriteItems.includes(itemId)) {
      removeFavoriteMutation.mutate(itemId);
    } else {
      addFavoriteMutation.mutate(itemId);
    }
  };
  
  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (loadMoreRef.current && !observerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            setIsLoadingMore(true);
            fetchNextPage().finally(() => setIsLoadingMore(false));
          }
        },
        { threshold: 0.5 }
      );
      
      observer.observe(loadMoreRef.current);
      observerRef.current = observer;
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Tap.az style item cards
  const renderItemCard = (item: ItemWithImages, isPremium: boolean = false) => {
    const imageUrl = item.mainImage || (item.images && item.images.length > 0 ? item.images[0].filePath : null) || "/assets/placeholder-image.jpg";
    
    // Ana səhifədə elanlarda ItemCard komponentindən istifadə etmək yerinə, 
    // eyni stili saxlayaraq favorit düyməsini əlavə edək
    return (
      <Card key={item.id} className="overflow-hidden border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-300">
        <Link href={`/items/${item.id}`}>
          <div className="relative aspect-[4/3] bg-gray-100">
            <img 
              src={imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            {isPremium && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-yellow-500 text-xs font-medium">VIP</Badge>
              </div>
            )}
            {item.condition === 'Yeni' && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-green-500 text-xs font-medium">Yeni</Badge>
              </div>
            )}
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-black/40 text-white backdrop-blur-sm text-xs font-normal border-0">
                <Clock3 className="mr-1 h-3 w-3" /> 
                {formatRelativeTime(item.createdAt)}
              </Badge>
            </div>
            
            {/* Favorit/Like düyməsi */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleFavoriteToggle(item.id);
              }}
              className={`absolute top-3 right-3 ${
                favoriteItems.includes(item.id)
                ? "text-red-500 bg-white shadow-md scale-110" 
                : "text-gray-400 bg-white/80 hover:bg-white"
              } rounded-full w-10 h-10 flex items-center justify-center hover:text-red-500 hover:scale-110 transition-all duration-300 border border-gray-100 backdrop-blur-sm`}
              title={favoriteItems.includes(item.id) ? "Favoritlərdən çıxar" : "Favorit et"}
            >
              <Heart 
                className={`h-6 w-6 ${favoriteItems.includes(item.id) ? "animate-pulse" : ""}`} 
                fill={favoriteItems.includes(item.id) ? "currentColor" : "none"} 
                strokeWidth={favoriteItems.includes(item.id) ? 2 : 1.5}
              />
              {favoriteItems.includes(item.id) && <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border border-white">❤️</span>}
            </Button>
          </div>
        </Link>
        <CardContent className="p-3">
          <div className="text-sm font-medium text-gray-800 line-clamp-1 hover:text-green-600 transition-colors">
            <Link href={`/items/${item.id}`}>
              {item.title}
            </Link>
          </div>
          <div className="flex justify-between items-center mt-1">
            {item.city ? (
              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="h-3 w-3 mr-0.5" />
                <span>{item.city}</span>
              </div>
            ) : (
              <span className="text-xs text-gray-500">Bartertap.az</span>
            )}
            
            {item.status === 'active' && (
              <Badge className="h-5 px-1.5 text-[10px] bg-green-100 text-green-800 hover:bg-green-200">
                Aktiv
              </Badge>
            )}
            {item.status === 'pending' && (
              <Badge className="h-5 px-1.5 text-[10px] bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                Gözləyir
              </Badge>
            )}
            {item.status === 'completed' && (
              <Badge className="h-5 px-1.5 text-[10px] bg-blue-100 text-blue-800 hover:bg-blue-200">
                Tamamlandı
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Loading state with tap.az style skeletons
  if (isLoading) {
    return (
      <>
        {Array(9).fill(0).map((_, i) => (
          <div key={i} className="col-span-1">
            <Card className="overflow-hidden border border-gray-200">
              <div className="relative aspect-[4/3] bg-gray-100">
                <Skeleton className="h-full w-full" />
              </div>
              <CardContent className="p-3">
                <Skeleton className="h-5 w-full mb-2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </>
    );
  }
  
  // Error state
  if (isError) {
    return (
      <div className="col-span-full text-center p-8 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 mb-2">Elanları yükləyərkən xəta baş verdi</p>
        <p className="text-red-500 text-sm">{error.toString()}</p>
        <Button 
          variant="outline" 
          className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Yenidən cəhd edin
        </Button>
      </div>
    );
  }
  
  // Empty state
  if (items.length === 0) {
    return (
      <div className="col-span-full bg-white border border-dashed border-gray-300 rounded-md p-8 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="h-8 w-8 text-green-500" />
        </div>
        <h3 className="text-lg font-medium mb-2">Hələ ki, heç bir əşya əlavə edilməyib</h3>
        <p className="text-gray-600 mb-4 text-sm">
          İlk əşyanı əlavə edən siz olun və barterə başlayın!
        </p>
        <Link href="/items/new">
          <Button className="bg-green-600 hover:bg-green-700 text-sm">
            Əşya Əlavə Et
          </Button>
        </Link>
      </div>
    );
  }
  
  // Items list with tap.az style
  return (
    <>
      {items.map((item, index) => (
        <div key={item.id} className="col-span-1">
          {renderItemCard(item, index < 3)}
        </div>
      ))}
      
      {/* Load more indicator - tap.az style */}
      <div ref={loadMoreRef} className="col-span-full flex justify-center items-center py-4">
        {hasNextPage && (
          isLoadingMore || isFetchingNextPage ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-t-green-500 border-green-200 rounded-full animate-spin"></div>
              <span className="text-gray-500 text-sm">Yüklənir...</span>
            </div>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => fetchNextPage()}
              size="sm"
              className="text-sm border-gray-300 hover:bg-gray-50 hover:text-green-700 hover:border-green-300"
            >
              Daha çox elan göstər <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )
        )}
        
        {!hasNextPage && items.length > 12 && (
          <p className="text-gray-500 text-xs py-2">Bütün elanlar yükləndi</p>
        )}
      </div>
    </>
  );
}