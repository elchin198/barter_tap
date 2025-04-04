
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Activity,
  Package,
  Users,
  ShoppingCart,
  Heart,
  MessageCircle,
  Star,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import ItemCard from "@/components/items/ItemCard";
import { useTranslation } from "react-i18next";
import { Item } from "@shared/schema";

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: userItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ["/api/items/user"],
    queryFn: async () => {
      const res = await fetch("/api/items/user");
      if (!res.ok) throw new Error("İstifadəçi elanlarını yükləmək mümkün olmadı");
      return res.json();
    },
    enabled: !!user
  });

  const { data: offers = [], isLoading: offersLoading } = useQuery({
    queryKey: ["/api/offers"],
    queryFn: async () => {
      const res = await fetch("/api/offers");
      if (!res.ok) throw new Error("Təklifləri yükləmək mümkün olmadı");
      return res.json();
    },
    enabled: !!user
  });

  const { data: stats = {
    views: 0,
    favorites: 0,
    offers: 0,
    completed: 0,
    rating: 0
  }, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/user/stats"],
    queryFn: async () => {
      const res = await fetch("/api/user/stats");
      if (!res.ok) throw new Error("Statistikanı yükləmək mümkün olmadı");
      return res.json();
    },
    enabled: !!user
  });

  if (!user) {
    return (
      <Card className="m-8 p-8 text-center">
        <CardTitle>Daxil olmaq lazımdır</CardTitle>
        <CardDescription className="mt-2 mb-4">
          Şəxsi məlumatlar panelini görmək üçün hesabınıza daxil olun
        </CardDescription>
        <Button asChild>
          <Link to="/auth">Daxil ol</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Məlumat Lövhəsi</h1>

      <div className="grid gap-6 md:grid-cols-4 lg:grid-cols-4 mb-6">
        <DashboardCard
          title="Görüntülənmələr"
          value={stats.views}
          icon={<Activity className="h-5 w-5" />}
          description="Elanlarınızın görüntülənmə sayı"
        />
        <DashboardCard
          title="Elanlar"
          value={userItems.length}
          icon={<Package className="h-5 w-5" />}
          description="Aktiv elanlarınızın sayı"
        />
        <DashboardCard
          title="Təkliflər"
          value={offers.length}
          icon={<ShoppingCart className="h-5 w-5" />}
          description="Aldığınız mübadilə təklifləri"
        />
        <DashboardCard
          title="Reytinq"
          value={stats.rating.toFixed(1)}
          icon={<Star className="h-5 w-5" />}
          description="Ortalama istifadəçi reytinqiniz"
          valueClassName="text-yellow-500"
        />
      </div>

      <Tabs defaultValue="items" className="mt-8">
        <TabsList className="mb-4">
          <TabsTrigger value="items">Elanlarım</TabsTrigger>
          <TabsTrigger value="offers">Təkliflər</TabsTrigger>
          <TabsTrigger value="activity">Aktivlik</TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          {itemsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : userItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userItems.map((item: any) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <Card className="text-center p-8">
              <CardTitle className="mb-2">Hələki elanınız yoxdur</CardTitle>
              <CardDescription className="mb-4">
                Mübadilə etmək istədiyiniz əşyanı paylaşın
              </CardDescription>
              <Button asChild>
                <Link to="/items/create">Elan Yarat</Link>
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="offers">
          {offersLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : offers.length > 0 ? (
            <div className="grid gap-4">
              {offers.map((offer: any) => (
                <Card key={offer.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{offer.itemTitle || 'Təklif'}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(offer.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button asChild size="sm">
                        <Link to={`/offers/${offer.id}`}>Bax</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center p-8">
              <CardTitle className="mb-2">Hələki təklifiniz yoxdur</CardTitle>
              <CardDescription className="mb-4">
                Maraqlı əşyaları tapın və təklif göndərin
              </CardDescription>
              <Button asChild>
                <Link to="/items">Əşyalara Baxın</Link>
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Aktivlik Göstəriciləri</CardTitle>
              <CardDescription>
                Son 30 gündə hesabınızın aktivlik göstəriciləri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Görüntülənmələr</span>
                    <span className="text-sm text-muted-foreground">{stats.views}</span>
                  </div>
                  <Progress value={Math.min((stats.views / 100) * 100, 100)} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Bəyənmələr</span>
                    <span className="text-sm text-muted-foreground">{stats.favorites}</span>
                  </div>
                  <Progress value={Math.min((stats.favorites / 50) * 100, 100)} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tamamlanan Müqavilələr</span>
                    <span className="text-sm text-muted-foreground">{stats.completed}</span>
                  </div>
                  <Progress value={Math.min((stats.completed / 10) * 100, 100)} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
  valueClassName?: string;
}

function DashboardCard({ title, value, icon, description, valueClassName }: DashboardCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-gray-500">{title}</span>
            <span className={`text-2xl font-bold ${valueClassName || ''}`}>{value}</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            {icon}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">{description}</p>
      </CardContent>
    </Card>
  );
}
