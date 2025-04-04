import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import ReviewStars from './ReviewStars';

interface CreateReviewFormProps {
  toUserId: number;
  offerId: number;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

const reviewSchema = z.object({
  rating: z.number().min(1, 'Zəhmət olmasa reytinq seçin').max(5),
  comment: z.string().max(500, 'Rəy 500 simvoldan çox ola bilməz').optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export default function CreateReviewForm({
  toUserId,
  offerId,
  onSubmitSuccess,
  onCancel
}: CreateReviewFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [stars, setStars] = useState<number>(0);
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });
  
  const reviewMutation = useMutation({
    mutationFn: async (data: ReviewFormValues) => {
      const response = await apiRequest('POST', '/api/reviews', {
        offerId,
        toUserId,
        rating: data.rating,
        comment: data.comment
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/user/${toUserId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/reviews/offer/${offerId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${toUserId}/rating`] });
      
      toast({
        title: 'Rəy uğurla göndərildi',
        description: 'Rəyiniz istifadəçiyə göndərildi',
      });
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    },
    onError: (error) => {
      toast({
        title: 'Xəta',
        description: error.message || 'Rəy göndərilmədi. Xahiş edirik bir az sonra yenidən cəhd edin',
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (values: ReviewFormValues) => {
    reviewMutation.mutate(values);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>İstifadəçini qiymətləndirin</CardTitle>
        <CardDescription>
          Mübadiləni bitirdiyiniz üçün indi istifadəçini qiymətləndirə bilərsiniz
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Reytinq</FormLabel>
                  <FormControl>
                    <div className="flex justify-center py-4">
                      <ReviewStars
                        initialRating={field.value}
                        size="lg"
                        onChange={(value) => {
                          field.onChange(value);
                          setStars(value);
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Mübadiləyə qiymət verin: {stars === 0 ? 'Reytinq seçilməyib' : `${stars} ulduz`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rəy (ixtiyari)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Bu mübadilə haqqında fikirlərinizi yazın..."
                      className="min-h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Mübadiləni təsvir edin və necə keçdiyini bildirin
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end gap-3 mt-3">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Ləğv et
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={stars === 0 || reviewMutation.isPending}
              >
                {reviewMutation.isPending ? 'Göndərilir...' : 'Rəyi Göndər'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}