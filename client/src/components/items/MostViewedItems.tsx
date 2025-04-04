import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Eye, MapPin, Clock3, Star, BadgeCheck } from "lucide-react";
import { Item, User } from "@shared/schema";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../ui/skeleton";
import { formatRelativeTime } from "@/lib/utils";

interface MostViewedItemsProps {
  limit?: number;
  className?: string;
  showTitle?: boolean;
}

interface ItemWithDetails extends Item {
  images?: Array<{ id: number; filePath: string; isMain: boolean }>;
  mainImage?: string;
  owner?: Omit<User, "password"> & { 
    rating?: number;
    reviewCount?: number;
  };
}

export default function MostViewedItems({ 
  limit = 4, 
  className = "", 
  showTitle = true 
}: MostViewedItemsProps) {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  
  const { data: items, isLoading } = useQuery<ItemWithDetails[]>({
    queryKey: ['/api/items/most-viewed', { limit }],
  });
  
  // Tap.az style item card
  const renderItemCard = (item: ItemWithDetails, isVIP: boolean = false) => {
    const imageUrl = item.mainImage || (item.images && item.images.length > 0 ? item.images[0]?.filePath : null) || "https://placehold.co/300x300/e2e8f0/64748b?text=No+Image";
    
    return (
      <Card key={item.id} className="overflow-hidden border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-300">
        <Link href={`/items/${item.id}`}>
          <div className="relative aspect-[4/3] bg-gray-100">
            <img 
              src={imageUrl} 
              alt={item.title} 
              className="w-full h-full object-cover"
            />
            {isVIP && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-yellow-500 text-xs font-medium">VIP</Badge>
              </div>
            )}
            {item.viewCount && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-purple-500 text-xs font-medium flex items-center gap-1">
                  <Eye className="h-3 w-3" /> 
                  {item.viewCount}
                </Badge>
              </div>
            )}
            <div className="absolute bottom-2 right-2">
              <Badge className="bg-black/40 text-white backdrop-blur-sm text-xs font-normal border-0">
                <Clock3 className="mr-1 h-3 w-3" /> 
                {formatRelativeTime(item.createdAt)}
              </Badge>
            </div>
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
            
            {item.owner?.rating !== undefined && (
              <div className="flex items-center text-amber-500 text-xs">
                <Star className="h-3 w-3 fill-amber-500 mr-0.5" />
                <span>{item.owner.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Loading state with tap.az style skeletons
  if (isLoading) {
    return (
      <div className={className}>
        {showTitle && (
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Eye className="mr-2 h-5 w-5 text-purple-500" /> 
              {t('home.mostViewed', 'Ən çox baxılan elanlar')}
            </h2>
          </div>
        )}
        {Array(limit).fill(0).map((_, i) => (
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
      </div>
    );
  }
  
  if (!items || items.length === 0) {
    return null;
  }
  
  return (
    <div className={className}>
      {showTitle && (
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <Eye className="mr-2 h-5 w-5 text-purple-500" /> 
            {t('home.mostViewed', 'Ən çox baxılan elanlar')}
          </h2>
          <Link href="/items?sort=views_desc" className="text-green-600 hover:underline flex items-center text-sm font-medium">
            {t('common.viewAll', 'Hamısına bax')} 
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      )}
      
      {items.map((item, index) => (
        <div key={item.id} className="col-span-1">
          {renderItemCard(item, index === 0 || index === 1)}
        </div>
      ))}
    </div>
  );
}