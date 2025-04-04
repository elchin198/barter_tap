import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Icons
import { 
  ArrowRightLeft, 
  Check, 
  X, 
  Calendar,
  MessageSquare,
  AlertTriangle, 
  ArrowLeft,
  Loader2
} from "lucide-react";

// Types
import { Item } from "@shared/schema";

interface ItemWithDetails extends Item {
  mainImage?: string;
  images?: string[];
  owner?: {
    id: number;
    username: string;
    fullName?: string;
    avatar?: string;
    rating?: number;
  };
}

export default function NewOffer() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Get query params (toItemId is the item we want to offer for)
  const [match, params] = useRoute('/offers/new');
  const searchParams = new URLSearchParams(window.location.search);
  const toItemId = searchParams.get('toItemId') || "";

  // Form state
  const [message, setMessage] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the item we want to make an offer for
  const { data: toItem, isLoading: toItemLoading, error: toItemError } = useQuery<ItemWithDetails>({
    queryKey: [`/api/items/${toItemId}`],
    enabled: !!toItemId,
  });

  // Fetch user's own items that can be offered
  const { data: myItems = [], isLoading: myItemsLoading } = useQuery<ItemWithDetails[]>({
    queryKey: ['/api/items/my-items'],
    enabled: !!user,
  });

  // Create offer mutation
  const createOfferMutation = useMutation({
    mutationFn: async (data: { fromItemId: number, toItemId: number, message: string }) => {
      const response = await apiRequest("POST", "/api/offers", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/offers'] });
      toast({
        title: t('offers.offerSent', 'Təklif göndərildi'),
        description: t('offers.offerSentSuccess', 'Təklifiniz uğurla göndərildi. Təkliflər səhifəsindən təklifinizin vəziyyətini izləyə bilərsiniz.'),
      });
      navigate('/offers');
    },
    onError: (error: Error) => {
      toast({
        title: t('offers.offerFailed', 'Təklif göndərilmədi'),
        description: error.message || t('offers.unknownError', 'Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.'),
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItemId) {
      toast({
        title: t('offers.selectItemRequired', 'Əşya seçilmədi'),
        description: t('offers.selectItemRequiredDesc', 'Mübadilə üçün öz əşyanızı seçməlisiniz.'),
        variant: "destructive",
      });
      return;
    }

    if (!toItem) {
      toast({
        title: t('offers.targetItemError', 'Hədəf əşya tapılmadı'),
        description: t('offers.targetItemErrorDesc', 'Mübadilə etmək istədiyiniz əşya tapılmadı.'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    createOfferMutation.mutate({
      fromItemId: selectedItemId,
      toItemId: parseInt(toItemId),
      message
    });
  };

  // Redirect if not logged in
  if (!authLoading && !user) {
    navigate('/login?redirect=/offers/new' + (toItemId ? `?toItemId=${toItemId}` : ''));
    return null;
  }

  // Show error if target item not found
  if (toItemError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('offers.itemNotFound', 'Əşya tapılmadı')}</AlertTitle>
          <AlertDescription>
            {t('offers.itemNotFoundDesc', 'Mübadilə etmək istədiyiniz əşya tapılmadı. Zəhmət olmasa başqa bir əşya seçin.')}
          </AlertDescription>
        </Alert>

        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.backToItems', 'Əşyalara qayıt')}
        </Button>
      </div>
    );
  }

  // Define SEO metadata
  const newOfferTitle = t('seo.newOfferTitle', 'Yeni Mübadilə Təklifi | BarterTap.az');
  const newOfferDescription = t(
    'seo.newOfferDescription', 
    'BarterTap.az platformasında barter təklifi göndərin. Öz əşyanızı başqasının əşyası ilə mübadilə edin.'
  );
  const newOfferKeywords = t(
    'seo.newOfferKeywords',
    'əşya mübadiləsi, barter təklifi, əşya dəyişmək, pulsuz mübadilə, təklif göndərmək'
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* SEO */}
      <SEO 
        title={newOfferTitle}
        description={newOfferDescription}
        keywords={newOfferKeywords}
      />

      {/* Page header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="mb-4 p-0 hover:bg-transparent hover:text-blue-600"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('common.back', 'Geri')}
        </Button>

        <h1 className="text-3xl font-bold">{t('offers.newOffer', 'Yeni mübadilə təklifi')}</h1>
        <p className="text-gray-600 mt-2">
          {t('offers.newOfferDescription', 'Öz əşyanızı başqa əşya ilə mübadilə etmək üçün təklif göndərin.')}
        </p>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Target item details */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold mb-4">{t('offers.targetItem', 'Mübadilə etmək istədiyiniz əşya')}</h2>

          {toItemLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-md" />
                  <Skeleton className="h-6 w-2/3" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : toItem ? (
            <Card>
              <CardContent className="p-0">
                {/* Item image */}
                <div className="relative aspect-square overflow-hidden rounded-t-lg">
                  <img 
                    src={toItem.mainImage || '/placeholder-image.jpg'} 
                    alt={toItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  {/* Item title & price */}
                  <h3 className="text-xl font-bold mb-2">{toItem.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    {toItem.price ? (
                      <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                        {toItem.price} ₼
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                        {t('items.exchangeOnly', 'Yalnız mübadilə')}
                      </Badge>
                    )}
                  </div>

                  {/* Item owner */}
                  {toItem.owner && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={toItem.owner.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(toItem.owner.fullName || toItem.owner.username)}`}
                          alt={toItem.owner.username}
                        />
                        <AvatarFallback>{toItem.owner.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{toItem.owner.fullName || toItem.owner.username}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('offers.noItemSelected', 'Əşya seçilmədi')}</AlertTitle>
              <AlertDescription>
                {t('offers.noItemSelectedDesc', 'Mübadilə üçün hədəf əşya seçilmədi. Zəhmət olmasa əvvəlcə bir əşya seçin.')}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Right column - Make an offer form */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">{t('offers.selectYourItem', 'Öz əşyanızı seçin')}</h2>

          <form onSubmit={handleSubmit}>
            {myItemsLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4 flex gap-4">
                      <Skeleton className="h-24 w-24 rounded-md" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : myItems.length > 0 ? (
              <div className="space-y-6">
                <RadioGroup 
                  value={selectedItemId?.toString() || ""} 
                  onValueChange={value => setSelectedItemId(parseInt(value))}
                >
                  {myItems.map((item) => (
                    <Card 
                      key={item.id}
                      className={`border-2 ${selectedItemId === item.id ? 'border-blue-600' : 'border-gray-200'} transition-colors hover:border-blue-300`}
                    >
                      <CardContent className="p-4 flex gap-4">
                      <div className="relative h-24 w-24 overflow-hidden rounded-md flex-shrink-0">
                      <img
    src={item.mainImage ? `/uploads/items/${item.mainImage}` : '/placeholder-image.jpg'}
    alt={item.title}
    className="h-full w-full object-cover"
  />
</div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{item.category}</p>
                            </div>

                            <div className="flex-shrink-0">
                              <RadioGroupItem 
                                value={item.id.toString()} 
                                id={`item-${item.id}`}
                                className="h-5 w-5"
                              />
                            </div>
                          </div>

                          <div className="mt-2">
                            {item.price ? (
                              <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                                {item.price} ₼
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                                {t('items.exchangeOnly', 'Yalnız mübadilə')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </RadioGroup>

                <div className="mt-6 space-y-4">
                  <h3 className="font-medium">{t('offers.addMessage', 'Təklifinizə mesaj əlavə edin (ixtiyari)')}</h3>
                  <Textarea
                    placeholder={t('offers.messagePlaceholder', 'Məsələn: Mən sizin əşyanızla mübadilə etmək istəyirəm. Yerli görüş üçün əlaqə saxlaya bilərsiniz.')}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                  >
                    {t('common.cancel', 'İmtina et')}
                  </Button>

                  <Button
                    type="submit"
                    disabled={!selectedItemId || isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('offers.sending', 'Göndərilir...')}
                      </>
                    ) : (
                      <>
                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                        {t('offers.sendOffer', 'Təklifi göndər')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">{t('offers.noItemsAvailable', 'Təklif ediləcək əşyanız yoxdur')}</h3>
                    <p className="text-gray-600 mb-6">
                      {t('offers.noItemsAvailableDesc', 'Təklif göndərmək üçün əvvəlcə öz əşyanızı əlavə etməlisiniz.')}
                    </p>
                    <Button onClick={() => navigate('/items/new')}>
                      {t('common.addItem', 'Əşya əlavə et')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}