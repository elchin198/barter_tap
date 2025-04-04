import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Star, StarHalf, ThumbsUp, ThumbsDown, User, MessageSquare, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "../../context/AuthContext";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

// Types
interface Review {
  id: number;
  reviewerId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    id: number;
    username: string;
    fullName?: string;
    avatar?: string;
  };
}

interface UserRating {
  averageRating: number;
  reviewCount: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// Reviews Section
export function ReviewsSection({ userId, minimal = false }: { userId: number; minimal?: boolean }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  
  // Fetch reviews
  const { data: reviews = [], isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: ['/api/reviews', { userId }],
  });
  
  // Fetch user rating
  const { data: userRating, isLoading: isLoadingRating } = useQuery<UserRating>({
    queryKey: ['/api/users', userId, 'rating'],
  });
  
  // Add review mutation
  const addReviewMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/reviews', {
        userId,
        rating: newReview.rating,
        comment: newReview.comment
      });
    },
    onSuccess: () => {
      toast({ title: "Review submitted successfully" });
      setNewReview({ rating: 5, comment: '' });
      setOpenReviewDialog(false);
      queryClient.invalidateQueries({ queryKey: ['/api/reviews', { userId }] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'rating'] });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to submit review", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });
  
  // Mini rating for when minimal=true
  if (minimal) {
    if (isLoadingRating) {
      return <div className="flex space-x-1 items-center text-gray-400 text-sm">Loading rating...</div>;
    }
    
    if (!userRating || userRating.reviewCount === 0) {
      return (
        <div className="flex space-x-1 items-center text-gray-400 text-sm">
          <Star className="h-4 w-4 text-gray-300" fill="currentColor" />
          <span>Rəy yoxdur</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center">
          <ReviewStars rating={userRating.averageRating} size="sm" />
        </div>
        <span className="text-sm text-gray-600">
          ({userRating.averageRating.toFixed(1)}, {userRating.reviewCount} rəy)
        </span>
      </div>
    );
  }
  
  // Full reviews section
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-500" />
          İstifadəçi Rəyləri
        </h3>
        
        {user && user.id !== userId && (
          <Dialog open={openReviewDialog} onOpenChange={setOpenReviewDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                Rəy yazın
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rəy yazın</DialogTitle>
                <DialogDescription>
                  Bu istifadəçi ilə əməkdaşlığınızı necə qiymətləndirirsiniz?
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 space-y-4">
                <div className="flex items-center justify-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      className={cn(
                        "p-1 h-auto",
                        newReview.rating >= star ? "text-amber-500" : "text-gray-300"
                      )}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    >
                      <Star className="h-8 w-8" fill="currentColor" />
                    </Button>
                  ))}
                </div>
                
                <Textarea
                  placeholder="Əməkdaşlıq təcrübənizi təsvir edin..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="h-32"
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenReviewDialog(false)}>Ləğv et</Button>
                <Button 
                  onClick={() => addReviewMutation.mutate()}
                  disabled={addReviewMutation.isPending}
                >
                  {addReviewMutation.isPending ? "Göndərilir..." : "Rəy göndər"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 pb-4">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Rating summary */}
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col items-center md:items-start">
                <span className="text-4xl font-bold text-blue-700">
                  {userRating?.averageRating.toFixed(1) || "0.0"}
                </span>
                <div className="mt-1">
                  <ReviewStars 
                    rating={userRating?.averageRating || 0} 
                    size="md"
                  />
                </div>
                <span className="text-sm text-gray-600 mt-1">
                  {userRating?.reviewCount || 0} rəy əsasında
                </span>
              </div>
            </div>
            
            {/* Rating distribution */}
            <div className="flex-1">
              {userRating && (
                <div className="space-y-1 w-full max-w-xs mx-auto">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = userRating.distribution[rating as keyof typeof userRating.distribution] || 0;
                    const percentage = userRating.reviewCount > 0 
                      ? Math.round((count / userRating.reviewCount) * 100) 
                      : 0;
                    
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <div className="flex items-center w-12">
                          <span className="text-sm">{rating}</span>
                          <Star className="h-3 w-3 ml-1 text-amber-500" fill="currentColor" />
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full flex-1 overflow-hidden">
                          <motion.div 
                            className="h-full bg-amber-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, delay: 0.1 * (6 - rating) }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-8 text-right">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">Bütün rəylər</TabsTrigger>
              <TabsTrigger value="positive">Müsbət</TabsTrigger>
              <TabsTrigger value="negative">Mənfi</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4 mt-2">
              {isLoadingReviews ? (
                <div className="text-center py-8 text-gray-500">Rəylər yüklənir...</div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Bu istifadəçiyə hələ heç bir rəy yazılmayıb.</div>
              ) : (
                <AnimatePresence initial={false}>
                  {reviews.map((review, index) => (
                    <ReviewCard key={review.id} review={review} delay={index * 0.1} />
                  ))}
                </AnimatePresence>
              )}
            </TabsContent>
            
            <TabsContent value="positive" className="space-y-4 mt-2">
              {isLoadingReviews ? (
                <div className="text-center py-8 text-gray-500">Rəylər yüklənir...</div>
              ) : reviews.filter(r => r.rating >= 4).length === 0 ? (
                <div className="text-center py-8 text-gray-500">Müsbət rəy tapılmadı.</div>
              ) : (
                <AnimatePresence initial={false}>
                  {reviews
                    .filter(review => review.rating >= 4)
                    .map((review, index) => (
                      <ReviewCard key={review.id} review={review} delay={index * 0.1} />
                    ))
                  }
                </AnimatePresence>
              )}
            </TabsContent>
            
            <TabsContent value="negative" className="space-y-4 mt-2">
              {isLoadingReviews ? (
                <div className="text-center py-8 text-gray-500">Rəylər yüklənir...</div>
              ) : reviews.filter(r => r.rating < 4).length === 0 ? (
                <div className="text-center py-8 text-gray-500">Mənfi rəy tapılmadı.</div>
              ) : (
                <AnimatePresence initial={false}>
                  {reviews
                    .filter(review => review.rating < 4)
                    .map((review, index) => (
                      <ReviewCard key={review.id} review={review} delay={index * 0.1} />
                    ))
                  }
                </AnimatePresence>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewCard({ review, delay = 0 }: { review: Review; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay }}
      className="p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage 
            src={review.reviewer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.reviewer.fullName || review.reviewer.username)}&background=3b82f6&color=fff`}
            alt={review.reviewer.username} 
          />
          <AvatarFallback>{review.reviewer.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{review.reviewer.fullName || review.reviewer.username}</h4>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-0.5">
                <ReviewStars rating={review.rating} size="sm" />
                <span>({review.rating})</span>
              </div>
            </div>
            <span className="text-xs text-gray-500 flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <p className="mt-2 text-gray-700">{review.comment}</p>
          
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="outline" className={cn(
              "text-xs",
              review.rating >= 4 
                ? "bg-green-50 text-green-700 border-green-200" 
                : review.rating === 3 
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-red-50 text-red-700 border-red-200"
            )}>
              {review.rating >= 4 
                ? <ThumbsUp className="h-3 w-3 mr-1" /> 
                : review.rating <= 2 
                  ? <ThumbsDown className="h-3 w-3 mr-1" /> 
                  : null
              }
              {review.rating >= 4 
                ? "Məmnun qaldım" 
                : review.rating === 3 
                  ? "Normal" 
                  : "Məmnun qalmadım"
              }
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Star rating component
type StarSize = "xs" | "sm" | "md" | "lg";

const starSizes: Record<StarSize, string> = {
  xs: "h-2.5 w-2.5",
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6"
};

export function ReviewStars({ 
  rating, 
  size = "md",
  className
}: { 
  rating: number; 
  size?: StarSize;
  className?: string;
}) {
  // Calculate full, half and empty stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className={cn("flex items-center", className)}>
      {/* Full stars */}
      {Array(fullStars).fill(0).map((_, i) => (
        <Star key={`full-${i}`} className={cn("text-amber-500", starSizes[size])} fill="currentColor" />
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <StarHalf className={cn("text-amber-500", starSizes[size])} fill="currentColor" />
      )}
      
      {/* Empty stars */}
      {Array(emptyStars).fill(0).map((_, i) => (
        <Star key={`empty-${i}`} className={cn("text-gray-300", starSizes[size])} />
      ))}
    </div>
  );
}