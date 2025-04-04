import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@shared/schema';
import ReviewStars from './ReviewStars';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserRatingProps {
  userId: number;
  minimal?: boolean;
  className?: string;
  displayUser?: User;
}

export default function UserRating({ 
  userId, 
  minimal = false,
  className,
  displayUser 
}: UserRatingProps) {
  // Get user rating info if not provided in displayUser prop
  const { data: userData, isLoading } = useQuery<User & { averageRating: number, reviewCount: number }>({
    queryKey: [`/api/users/${userId}/rating`],
    enabled: !displayUser, // Skip if displayUser was provided
  });

  // Use displayUser or fetched data
  const user = displayUser || userData;
  
  if (isLoading || !user) {
    return (
      <Card className={cn("", className)}>
        <CardHeader>
          <CardTitle><Skeleton className="h-5 w-1/3" /></CardTitle>
          <CardDescription><Skeleton className="h-4 w-2/3" /></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const rating = userData?.averageRating || user.rating || 0;
  const reviewCount = userData?.reviewCount || user.ratingCount || 0;
  
  if (minimal) {
    return (
      <Card className={cn("p-4", className)}>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <ReviewStars 
              readOnly 
              initialRating={rating}
              size="sm"
            />
          </div>
          <div className="text-sm">
            {rating > 0 ? (
              <span className="font-medium">{rating.toFixed(1)}/5</span>
            ) : (
              <span className="text-gray-500">Hələ rəy yoxdur</span>
            )}
            {reviewCount > 0 && (
              <span className="text-gray-500"> ({reviewCount} rəy)</span>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          İstifadəçi reytinqi
        </CardTitle>
        <CardDescription>
          Bu istifadəçi barter platformasında neçə rəy alıb
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="p-6 bg-amber-50 rounded-xl text-center border border-amber-100">
            <div className="text-3xl font-bold text-amber-600 mb-2">
              {rating > 0 ? rating.toFixed(1) : '—'}
            </div>
            <div className="flex items-center justify-center mb-2">
              <ReviewStars 
                readOnly 
                initialRating={rating}
                size="md"
              />
            </div>
            <div className="text-sm text-amber-700">
              {reviewCount > 0 ? `${reviewCount} rəy əsasında` : 'Hələ heç bir rəy yoxdur'}
            </div>
          </div>
          
          {user?.username && (
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-lg font-medium text-blue-600">{reviewCount}</div>
                <div className="text-xs text-blue-500">Ümumi rəylər</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="text-lg font-medium text-green-600">
                  {(user as any).completedTrades || '0'}
                </div>
                <div className="text-xs text-green-500">Tamamlanmış barter</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}