import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useEffect, useState } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

// Kateqoriyalar və vəziyyətlər üçün məlumatlar
const CATEGORIES = [
  "Electronics", 
  "Clothing",
  "Books", 
  "Furniture",
  "Home & Garden",
  "Sports",
  "Toys & Games",
  "Vehicles",
  "Collectibles",
  "Beauty",
  "Health",
  "Jewelry",
  "Music",
  "Art",
  "Other"
];

const CONDITIONS = [
  "New",
  "Like New",
  "Good",
  "Fair",
  "Poor"
];

// Zod sxeması
const itemSchema = z.object({
  title: z.string().min(3, "Başlıq ən azı 3 simvol olmalıdır").max(100, "Başlıq 100 simvoldan çox olmamalıdır"),
  description: z.string().min(10, "Təsvir ən azı 10 simvol olmalıdır"),
  category: z.string().min(1, "Kateqoriya seçilməlidir"),
  subcategory: z.string().optional(),
  condition: z.string().min(1, "Vəziyyət seçilməlidir"),
  wantedExchange: z.string().min(3, "Nəyə dəyişdirmək istədiyinizi qeyd edin").max(200, "Çox uzundur"),
  city: z.string().optional(),
  price: z.coerce.number().optional(),
  imageFiles: z.any().optional(),
});

type ItemFormValues = z.infer<typeof itemSchema>;

export default function CreateItem() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const MAX_IMAGES = 5; // Maksimum şəkil sayı

  // Giriş etməmiş istifadəçini yönləndir
  useEffect(() => {
    if (!user) {
      toast({
        title: "Giriş tələb olunur",
        description: "Əşya əlavə etmək üçün hesabınıza daxil olun",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);

  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subcategory: "",
      condition: "",
      wantedExchange: "",
      city: "",
      price: undefined,
      imageFiles: [],
    },
  });

  // Şəkillərin yüklənməsini idarə et
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // FileList-i array-ə çevirib yalnız şəkilləri saxlayırıq
    const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

    // Yüklənən şəkillərin limiti aşıb-aşmadığını yoxla
    if (uploadedImages.length + newFiles.length > MAX_IMAGES) {
      toast({
        title: "Həddindən çox şəkil",
        description: `Maksimum ${MAX_IMAGES} şəkil yükləyə bilərsiniz.`,
        variant: "destructive"
      });
      return;
    }

    // Yeni şəkilləri array-ə əlavə et
    setUploadedImages(prev => [...prev, ...newFiles]);

    // Şəkilləri forma məlumatlarına əlavə et
    form.setValue('imageFiles', [...uploadedImages, ...newFiles]);
  };

  // Şəkili önbaxışdan silmək
  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages.splice(index, 1);
    setUploadedImages(newImages);
    form.setValue('imageFiles', newImages);
  };

  // Əşya yaratmaq üçün mutasiya
  const createItemMutation = useMutation({
    mutationFn: async (data: ItemFormValues) => {
      const response = await apiRequest("POST", "/api/items", {
        title: data.title,
        description: data.description,
        category: data.category,
        subcategory: data.subcategory,
        condition: data.condition,
        wantedExchange: data.wantedExchange,
        city: data.city,
        price: data.price,
        status: "active"
      });
      return await response.json();
    },
    onSuccess: async (data) => {
      // Şəkillər varsa yüklə
      if (uploadedImages.length > 0) {
        setIsUploading(true);

        try {
          for (let i = 0; i < uploadedImages.length; i++) {
            const formData = new FormData();
            formData.append("image", uploadedImages[i]);
            formData.append("itemId", data.id.toString());
            formData.append("isPrimary", i === 0 ? "true" : "false");

            await apiRequest("POST", "/api/images", formData);
          }

          toast({
            title: "Elan uğurla yaradıldı",
            description: "Elanınız uğurla yaradıldı və şəkillər yükləndi.",
          });

          // Sorğuları yenilə
          queryClient.invalidateQueries({ queryKey: ['/api/items'] });

          navigate(`/item/${data.id}`);
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Şəkilləri yükləmək mümkün olmadı",
            description: "Elan yaradıldı, lakin şəkilləri yükləmək mümkün olmadı. Profil səhifəsindən yenidən cəhd edin.",
          });

          navigate(`/item/${data.id}`);
        } finally {
          setIsUploading(false);
        }
      } else {
        toast({
          title: "Elan uğurla yaradıldı",
          description: "Elanınız uğurla yaradıldı.",
        });

        // Sorğuları yenilə
        queryClient.invalidateQueries({ queryKey: ['/api/items'] });

        navigate(`/item/${data.id}`);
      }
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Xəta baş verdi",
        description: error.message || "Elan yaradılarkən xəta baş verdi.",
      });
    },
  });

  const onSubmit = (data: ItemFormValues) => {
    // Yüklənmiş şəkilləri forma məlumatlarına əlavə et
    data.imageFiles = uploadedImages;
    createItemMutation.mutate(data);
  };

  if (!user) {
    return null; // istifadəçi yoxdursa hər hansı bir şey göstərmə (yönləndirilir)
  }

  return (
    <div className="container max-w-3xl mx-auto py-10 px-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Yeni elan yerləşdir</CardTitle>
          <CardDescription>
            Dəyişdirmək istədiyiniz əşya haqqında məlumat daxil edin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Başlıq</FormLabel>
                    <FormControl>
                      <Input placeholder="Əşyanın adı və əsas xüsusiyyətləri" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kateqoriya</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Kateqoriya seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt kateqoriya (istəyə bağlı)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Alt kateqoriya" 
                          {...field} 
                          value={field.value || ''} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vəziyyəti</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Vəziyyətini seçin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CONDITIONS.map((condition) => (
                            <SelectItem key={condition} value={condition}>
                              {condition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Şəhər (istəyə bağlı)</FormLabel>
                      <FormControl>
                        <Input placeholder="Şəhər" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qiymət dəyəri (istəyə bağlı)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value ? parseInt(e.target.value) : undefined;
                            field.onChange(value);
                          }}
                          value={field.value === undefined ? '' : field.value}
                        />
                      </FormControl>
                      <FormDescription>
                        Bu əşyanın təxmini dəyəri nə qədərdir?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wantedExchange"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nəyə dəyişdirmək istəyirsiniz?</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Məsələn: iPhone 13, PlayStation 5, Velosiped və s." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Təsvir</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Əşyanın təsviri, vəziyyəti, xüsusiyyətləri" 
                        className="min-h-[120px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageFiles"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şəkillər (maksimum {MAX_IMAGES})</FormLabel>
                    <FormControl>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors">
                        <label className="flex flex-col items-center justify-center cursor-pointer">
                          <Upload className="w-8 h-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500 mb-1">Şəkilləri buraya sürükləyin və ya klikləyin</span>
                          <span className="text-xs text-gray-400">{`Maksimum ${MAX_IMAGES} şəkil, hər biri 5MB-a qədər`}</span>
                          <Input 
                            type="file" 
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Şəkil önbaxışları */}
              {uploadedImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Seçilmiş şəkillər:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {uploadedImages.map((file, index) => (
                      <div 
                        key={index} 
                        className="relative group rounded-md overflow-hidden border border-gray-200"
                      >
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`Yüklənən şəkil ${index+1}`}
                          className="w-full h-28 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Şəkili sil"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {index === 0 && (
                          <Badge className="absolute bottom-1 left-1 bg-blue-600 text-xs px-1 py-0">
                            Əsas şəkil
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={createItemMutation.isPending || isUploading}
              >
                {createItemMutation.isPending || isUploading
                  ? "Elan yerləşdirilir..."
                  : "Elanı yerləşdir"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}