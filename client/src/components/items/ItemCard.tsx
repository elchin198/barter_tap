import { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Edit, Trash2, Clock } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatRelativeTime } from "@/lib/utils";
import { Item } from "@shared/schema";
import { useAuth } from "../../context/AuthContext";

interface ItemCardProps {
  item: Item & { mainImage?: string };
  showActions?: boolean;
  isFavorite?: boolean;
}

export default function ItemCard({ item, showActions = false, isFavorite = false }: ItemCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [favorited, setFavorited] = useState(isFavorite);
  
  // Add to favorites mutation
  const addFavoriteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/favorites', { itemId: item.id });
    },
    onSuccess: () => {
      setFavorited(true);
      toast({ title: "Added to favorites" });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
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
      await apiRequest('DELETE', `/api/favorites/${item.id}`);
    },
    onSuccess: () => {
      setFavorited(false);
      toast({ title: "Removed from favorites" });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to remove from favorites", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });
  
  // Delete item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/items/${item.id}`);
    },
    onSuccess: () => {
      toast({ title: "Item deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/items'] });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to delete item", 
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
  
  const handleDeleteItem = () => {
    deleteItemMutation.mutate();
  };
  
  // Default image if none provided - daha yaxşı görsənən
  // Əşyanın başlığını istifadə edərək dinamik avatar yaratma
  const itemTitle = item.title || "BarterTap";
  let imageUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(itemTitle)}&background=3b82f6&color=fff&size=256`;
  
  try {
    // Əşyanın sahibi varsa və avatarı varsa (əşyalarda şəkil olmadığı halda)
    if (item.hasOwnProperty('owner') && (item as any).owner && (item as any).owner.avatar) {
      const ownerAvatar = (item as any).owner.avatar;
      if (ownerAvatar.startsWith('http')) {
        imageUrl = ownerAvatar;
      } else if (ownerAvatar.startsWith('/')) {
        imageUrl = `${window.location.origin}${ownerAvatar}`;
      } else {
        imageUrl = ownerAvatar;
      }
    }
    // Try to get image from any available property in the item object
    else if (item.mainImage) {
      // If it starts with http or https, use as is
      if (item.mainImage.startsWith('http')) {
        imageUrl = item.mainImage;
      } 
      // If it starts with a slash, it's a local path, prepend origin
      else if (item.mainImage.startsWith('/')) {
        imageUrl = `${window.location.origin}${item.mainImage}`;
      }
      // Otherwise use as is (relative path)
      else {
        imageUrl = item.mainImage;
      }
    // Check if this item has images property from the API response, which has a different structure
    } else if (item.hasOwnProperty('images') && Array.isArray((item as any).images) && (item as any).images.length > 0) {
      // Use the first image from the images array if available
      const firstImage = (item as any).images[0];
      
      if (firstImage) {
        // Try all possible property names
        const filePath = firstImage.filePath || firstImage.url || firstImage.path || firstImage.source;
        
        if (filePath) {
          if (filePath.startsWith('http')) {
            imageUrl = filePath;
          } else if (filePath.startsWith('/')) {
            imageUrl = `${window.location.origin}${filePath}`;
          } else {
            imageUrl = filePath;
          }
        }
      }
    // Fallback for legacy data formats
    } else if (item.hasOwnProperty('image') && (item as any).image) {
      const filePath = (item as any).image;
      if (filePath.startsWith('http')) {
        imageUrl = filePath;
      } else if (filePath.startsWith('/')) {
        imageUrl = `${window.location.origin}${filePath}`;
      } else {
        imageUrl = filePath;
      }
    } else if (typeof item === 'object') {
      // Try to find ANY property that might contain image data
      for (const key in item) {
        if (key.toLowerCase().includes('image') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('picture')) {
          const value = (item as any)[key];
          if (typeof value === 'string' && value.length > 0) {
            if (value.startsWith('http')) {
              imageUrl = value;
              break;
            } else if (value.startsWith('/')) {
              imageUrl = `${window.location.origin}${value}`;
              break;
            } else {
              imageUrl = value;
              break;
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error resolving image URL:", error);
    // Use default image on error
    imageUrl = "https://placehold.co/600x400/e2e8f0/64748b?text=Şəkil+Yoxdur";
  }
  
  // Status badge styling
  const getStatusBadge = () => {
    switch (item.status) {
      case 'active':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200 backdrop-blur-sm font-medium">
            Aktiv
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 backdrop-blur-sm font-medium">
            Gözləyir
          </Badge>
        );
      case 'completed':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 backdrop-blur-sm font-medium">
            Tamamlanıb
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col group hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-green-100 transform hover:-translate-y-1">
      <Link href={`/items/${item.id}`}>
        <div className="block relative pt-[75%] overflow-hidden bg-gray-100 cursor-pointer">
          <img 
            src={imageUrl} 
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/600x400/e2e8f0/64748b?text=Şəkil+Yoxdur";
            }}
          />
          
          {/* Status badge */}
          <div className="absolute top-3 left-3">
            {getStatusBadge()}
          </div>
          
          {/* Category badge */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="outline" className="bg-black/60 text-white border-transparent backdrop-blur-sm font-medium px-2.5 py-0.5">
              {item.category}
            </Badge>
          </div>
          
          {/* Favorite button - Enhanced Heart Icon */}
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleFavoriteToggle();
            }}
            className={`absolute top-3 right-3 ${
              favorited 
              ? "text-red-500 bg-white shadow-md scale-110" 
              : "text-gray-400 bg-white/80 hover:bg-white"
            } rounded-full w-10 h-10 flex items-center justify-center hover:text-red-500 hover:scale-110 transition-all duration-300 border border-gray-100 backdrop-blur-sm`}
            title={favorited ? "Favoritlərdən çıxar" : "Favorit et"}
          >
            <Heart 
              className={`h-6 w-6 ${favorited ? "animate-pulse" : ""}`} 
              fill={favorited ? "currentColor" : "none"} 
              strokeWidth={favorited ? 2 : 1.5}
            />
            {favorited && <span className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center border border-white">❤️</span>}
          </Button>
        </div>
      </Link>
      
      <CardContent className="flex-grow p-4 pb-2">
        <Link href={`/items/${item.id}`}>
          <h3 className="font-semibold text-lg line-clamp-1 mb-2 group-hover:text-green-600 transition-colors">
            {item.title}
          </h3>
        </Link>
        
        <div className="space-y-3">
          {/* Price section */}
          {item.price && item.price > 0 && (
            <div className="font-bold text-green-600 text-lg">
              {item.price} AZN
            </div>
          )}
          
          {/* Description preview */}
          <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
            {item.description}
          </p>
          
          {/* Badges row */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-100 font-medium">
              {item.condition}
            </Badge>
            
            {item.city && (
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-100 font-medium">
                {item.city}
              </Badge>
            )}
          </div>
          
          {/* Date info */}
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3 w-3 mr-1.5" />
            <span>Yayımlandı: {formatRelativeTime(item.createdAt)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-2 flex justify-between">
        {!showActions ? (
          <Link href={`/items/${item.id}`} className="w-full">
            <Button 
              variant="default" 
              size="sm" 
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-sm font-medium shadow-sm"
            >
              Ətraflı bax
            </Button>
          </Link>
        ) : (
          <div className="flex gap-2 w-full">
            <Link href={`/items/${item.id}`} className="flex-1">
              <Button variant="default" size="sm" className="w-full bg-green-600 hover:bg-green-700 shadow-sm">
                Bax
              </Button>
            </Link>
            <Link href={`/items/edit/${item.id}`}>
              <Button variant="outline" size="icon" className="border-green-200 text-green-600 hover:bg-green-50 shadow-sm">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" className="border-red-200 text-red-500 hover:bg-red-50 shadow-sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Əminsiniz?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu əməliyyat geri qaytarıla bilməz. Bu elanınızı birdəfəlik siləcək.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteItem} className="bg-red-500 hover:bg-red-600">
                    Sil
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
