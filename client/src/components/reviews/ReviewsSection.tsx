import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import UserReviewsList from './UserReviewsList';
import CreateReviewForm from './CreateReviewForm';
import ReviewStars from './ReviewStars';
import { cn } from '@/lib/utils';
import { User, Review } from '@shared/schema';

interface ReviewsSectionProps {
  userId: number;
  offerId?: number;
  canReview?: boolean;
  minimal?: boolean;
  className?: string;
}

export default function ReviewsSection({ 
  userId, 
  offerId, 
  canReview = false,
  minimal = false,
  className 
}: ReviewsSectionProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('received');
  const [showCreateReview, setShowCreateReview] = useState<boolean>(false);
  
  // Get user rating info
  const { data: userData, isLoading: userLoading } = useQuery<User & { averageRating: number, reviewCount: number }>({
    queryKey: [`/api/users/${userId}/rating`],
  });

  // Check if user can review this offer
  const { data: reviewPermission } = useQuery<{ canReview: boolean }>({
    queryKey: [`/api/offers/${offerId}/can-review`],
    enabled: !!offerId && canReview,
  });

  // Get received reviews
  const { data: receivedReviews = [], isLoading: receivedLoading } = useQuery<Review[]>({
    queryKey: [`/api/reviews/user/${userId}`],
  });

  // Get reviews given by this user
  const { data: givenReviews = [], isLoading: givenLoading } = useQuery<Review[]>({
    queryKey: [`/api/reviews/user/${userId}`, { asReviewer: true }],
    enabled: !minimal, // Only load given reviews in full mode
  });

  if (minimal) {
    // Simplified display for user card
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex items-center justify-center flex-col text-center">
          <div className="flex items-center justify-center mb-2">
            <ReviewStars 
              readOnly
              initialRating={userData?.averageRating || 0}
              size="sm"
            />
          </div>
          <div className="text-sm">
            {userData?.averageRating ? (
              <span className="font-medium text-amber-600">{userData.averageRating.toFixed(1)}</span>
            ) : (
              <span className="text-gray-500">No rating yet</span>
            )}
            {userData?.reviewCount !== undefined && userData.reviewCount > 0 && (
              <span className="text-gray-500"> ({userData.reviewCount} reviews)</span>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>İstifadəçi reytinqi</CardTitle>
        <CardDescription>
          İstifadəçi mübadiləyə nə qədər etibarlıdır
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex justify-between items-center">
          <div className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg w-full max-w-sm mx-auto">
            <div className="text-4xl font-bold text-amber-600 mb-2">
              {userData?.averageRating ? userData.averageRating.toFixed(1) : '—'}
            </div>
            <div className="mb-2">
              <ReviewStars 
                readOnly
                initialRating={userData?.averageRating || 0}
                size="md"
              />
            </div>
            <div className="text-gray-500 text-sm">
              {userData?.reviewCount || 0} rəy əsasında
            </div>
          </div>
        </div>

        {canReview && reviewPermission?.canReview && (
          <div className="mb-6">
            {showCreateReview ? (
              <CreateReviewForm 
                toUserId={userId} 
                offerId={offerId!}
                onSubmitSuccess={() => {
                  setShowCreateReview(false);
                  toast({
                    title: "Rəy göndərildi",
                    description: "Rəyiniz uğurla göndərildi.",
                  });
                }}
                onCancel={() => setShowCreateReview(false)}
              />
            ) : (
              <Button 
                onClick={() => setShowCreateReview(true)}
                className="w-full"
              >
                Rəy bildirmək
              </Button>
            )}
          </div>
        )}

        <Tabs defaultValue="received" onValueChange={setActiveTab}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="received" className="flex-1">
              Alınan rəylər {receivedReviews.length > 0 && `(${receivedReviews.length})`}
            </TabsTrigger>
            <TabsTrigger value="given" className="flex-1">
              Verilən rəylər {givenReviews.length > 0 && `(${givenReviews.length})`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="received">
            <UserReviewsList 
              reviews={receivedReviews} 
              isLoading={receivedLoading}
              emptyMessage="Bu istifadəçi hələ rəy almayıb."
            />
          </TabsContent>
          
          <TabsContent value="given">
            <UserReviewsList 
              reviews={givenReviews} 
              isLoading={givenLoading}
              emptyMessage="Bu istifadəçi hələ rəy verməyib."
              showReceiverInfo
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}