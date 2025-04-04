import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, MessageSquare } from 'lucide-react';
import ReviewStars from './ReviewStars';
import { Link } from 'wouter';
import { cn } from '@/lib/utils';
import { Review, User } from '@shared/schema';

interface UserReviewsListProps {
  reviews: Review[];
  isLoading?: boolean;
  showReceiverInfo?: boolean;
  emptyMessage?: string;
  maxItems?: number;
  className?: string;
}

export default function UserReviewsList({
  reviews,
  isLoading = false,
  showReceiverInfo = false,
  emptyMessage = "Rəy tapılmadı",
  maxItems,
  className,
}: UserReviewsListProps) {
  const [expanded, setExpanded] = useState(false);
  
  const displayedReviews = expanded || !maxItems
    ? reviews
    : reviews.slice(0, maxItems);
  
  if (isLoading) {
    return (
      <div className={cn("space-y-4", className)}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 p-4 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (reviews.length === 0) {
    return (
      <div className={cn("text-center py-8 text-gray-500", className)}>
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      {displayedReviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          showReceiverInfo={showReceiverInfo}
        />
      ))}
      
      {maxItems && reviews.length > maxItems && !expanded && (
        <div className="text-center mt-4">
          <Button
            variant="outline"
            onClick={() => setExpanded(true)}
          >
            Bütün rəyləri göstər ({reviews.length})
          </Button>
        </div>
      )}
    </div>
  );
}

interface ReviewCardProps {
  review: Review;
  showReceiverInfo?: boolean;
}

function ReviewCard({ review, showReceiverInfo = false }: ReviewCardProps) {
  // Get user info based on whether we're showing receiver or reviewer info
  const userId = showReceiverInfo ? review.toUserId : review.fromUserId;
  
  // Fetch user details
  const { data: user, isLoading } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
  });
  
  if (isLoading || !user) {
    return (
      <Card className="p-4 flex gap-4 animate-pulse">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <Link href={`/profile/${user.id}`}>
          <Avatar className="h-10 w-10 cursor-pointer">
            <AvatarImage src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || user.username)}`} />
            <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <Link href={`/profile/${user.id}`} className="font-medium hover:underline">
                {user.fullName || user.username}
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ReviewStars readOnly initialRating={review.rating} size="xs" />
                <span>{review.rating}/5</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          {review.comment && (
            <div className="mt-2 bg-gray-50 p-3 rounded-lg text-sm">
              <div className="flex items-start gap-2">
                <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{review.comment}</p>
              </div>
            </div>
          )}
          
          {showReceiverInfo && review.offerId && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                Təklif #{review.offerId}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}