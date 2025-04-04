import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Car, Laptop, Wrench, Home, Building2, Hammer, Shirt, Smartphone, 
  Sofa, BookOpen, ShoppingCart, GraduationCap, Music, Dumbbell, 
  Globe, Monitor, Camera, Headphones, Watch, Coffee, Gift, PawPrint,
  Baby, Leaf, PaintBucket, Gamepad2, ShieldCheck, Plane, Tv2, Waves,
  LayoutGrid, List, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import SEO from '../components/SEO';
import { cn } from '@/lib/utils';

// Kateqoriya tipini təyin edirik
interface Category {
  id: string;
  name: string;
  displayName: string;
  icon: JSX.Element;
  color: string;
  itemCount: number;
  description?: string;
  popular?: boolean;
  subCategories?: { name: string; displayName: string; count: number }[];
}

// Əsas səhifə komponenti
export default function CategoriesPage() {
  const [_, navigate] = useLocation();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Kateqoriyalar siyahısı - real məlumatları əvəz edən fake məlumatlar
  const categories: Category[] = [
    {
      id: '1',
      name: 'neqliyyat',
      displayName: 'Nəqliyyat',
      icon: <Car className="h-8 w-8" />,
      color: '#ff6b35',
      itemCount: 243,
      description: 'Avtomobil, motosiklet, velosiped və digər nəqliyyat vasitələri',
      popular: true,
      subCategories: [
        { name: 'avtomobiller', displayName: 'Avtomobillər', count: 156 },
        { name: 'motosikletler', displayName: 'Motosikletlər', count: 45 },
        { name: 'velosipedler', displayName: 'Velosipedlər', count: 32 },
        { name: 'diger', displayName: 'Digər nəqliyyat', count: 10 }
      ]
    },
    {
      id: '2',
      name: 'elektronika',
      displayName: 'Elektronika',
      icon: <Laptop className="h-8 w-8" />,
      color: '#4169e1',
      itemCount: 198,
      description: 'Kompüterlər, noutbuklar və digər elektronik cihazlar',
      popular: true,
      subCategories: [
        { name: 'komputerler', displayName: 'Kompüterlər', count: 68 },
        { name: 'noutbuklar', displayName: 'Noutbuklar', count: 72 },
        { name: 'aksessuarlar', displayName: 'Aksesuarlar', count: 58 }
      ]
    },
    {
      id: '3',
      name: 'ehtiyat-hisseleri',
      displayName: 'Ehtiyat hissələri',
      icon: <Wrench className="h-8 w-8" />,
      color: '#ffd500',
      itemCount: 103,
      description: 'Avtomobil, elektronika və digər ehtiyat hissələri',
      subCategories: [
        { name: 'avtomobil-hisseleri', displayName: 'Avtomobil hissələri', count: 45 },
        { name: 'elektronika-hisseleri', displayName: 'Elektronika hissələri', count: 38 },
        { name: 'diger-hisseler', displayName: 'Digər hissələr', count: 20 }
      ]
    },
    {
      id: '4',
      name: 'ev-ve-bag',
      displayName: 'Ev və bağ',
      icon: <Home className="h-8 w-8" />,
      color: '#00cc66',
      itemCount: 156,
      description: 'Ev əşyaları, bağ və bağça ləvazimatları',
      popular: true,
      subCategories: [
        { name: 'ev-esyalari', displayName: 'Ev əşyaları', count: 84 },
        { name: 'bagca-levazimatlari', displayName: 'Bağça ləvazimatları', count: 46 },
        { name: 'temir-tikinti', displayName: 'Təmir və tikinti', count: 26 }
      ]
    },
    {
      id: '5',
      name: 'dasinmaz-emlak',
      displayName: 'Daşınmaz əmlak',
      icon: <Building2 className="h-8 w-8" />,
      color: '#5e548e',
      itemCount: 87,
      description: 'Mənzillər, evlər, torpaq sahələri',
      subCategories: [
        { name: 'menziller', displayName: 'Mənzillər', count: 38 },
        { name: 'evler', displayName: 'Evlər', count: 29 },
        { name: 'torpaq', displayName: 'Torpaq sahələri', count: 20 }
      ]
    },
    {
      id: '6',
      name: 'xidmetler',
      displayName: 'Xidmətlər',
      icon: <Hammer className="h-8 w-8" />,
      color: '#ff5f6d',
      itemCount: 112,
      description: 'Təmir, təhsil, sağlamlıq və digər xidmətlər',
      subCategories: [
        { name: 'temir', displayName: 'Təmir xidmətləri', count: 42 },
        { name: 'tehsil', displayName: 'Təhsil xidmətləri', count: 35 },
        { name: 'saglamliq', displayName: 'Sağlamlıq xidmətləri', count: 25 },
        { name: 'diger', displayName: 'Digər xidmətlər', count: 10 }
      ]
    },
    {
      id: '7',
      name: 'sexsi-esyalar',
      displayName: 'Şəxsi əşyalar',
      icon: <Shirt className="h-8 w-8" />,
      color: '#00b4d8',
      itemCount: 274,
      description: 'Geyim, aksesuar və digər şəxsi əşyalar',
      popular: true,
      subCategories: [
        { name: 'geyim', displayName: 'Geyim', count: 135 },
        { name: 'ayaqqabi', displayName: 'Ayaqqabı', count: 78 },
        { name: 'aksesuar', displayName: 'Aksesuar', count: 61 }
      ]
    },
    {
      id: '8',
      name: 'telefonlar',
      displayName: 'Telefonlar',
      icon: <Smartphone className="h-8 w-8" />,
      color: '#3d5a80',
      itemCount: 185,
      description: 'Smartfonlar və mobil telefonlar',
      popular: true,
      subCategories: [
        { name: 'smartfonlar', displayName: 'Smartfonlar', count: 125 },
        { name: 'qadjet', displayName: 'Qadjetlər', count: 60 }
      ]
    },
    {
      id: '9',
      name: 'mebel',
      displayName: 'Mebel',
      icon: <Sofa className="h-8 w-8" />,
      color: '#f4a261',
      itemCount: 143,
      description: 'Ev, ofis və bağça mebelləri',
      subCategories: [
        { name: 'ev-mebeli', displayName: 'Ev mebeli', count: 68 },
        { name: 'ofis-mebeli', displayName: 'Ofis mebeli', count: 45 },
        { name: 'bagca-mebeli', displayName: 'Bağça mebeli', count: 30 }
      ]
    },
    {
      id: '10',
      name: 'kitablar',
      displayName: 'Kitablar',
      icon: <BookOpen className="h-8 w-8" />,
      color: '#4ecdc4',
      itemCount: 219,
      description: 'Bədii, elmi və tədris kitabları',
      popular: true,
      subCategories: [
        { name: 'bedii', displayName: 'Bədii ədəbiyyat', count: 89 },
        { name: 'elmi', displayName: 'Elmi ədəbiyyat', count: 65 },
        { name: 'tedris', displayName: 'Tədris kitabları', count: 65 }
      ]
    },
    {
      id: '11',
      name: 'usaq-mallari',
      displayName: 'Uşaq malları',
      icon: <Baby className="h-8 w-8" />,
      color: '#ff9f1c',
      itemCount: 165,
      description: 'Oyuncaqlar, geyim və uşaq malları',
      subCategories: [
        { name: 'oyuncaqlar', displayName: 'Oyuncaqlar', count: 75 },
        { name: 'usaq-geyim', displayName: 'Uşaq geyimləri', count: 58 },
        { name: 'diger', displayName: 'Digər uşaq malları', count: 32 }
      ]
    },
    {
      id: '12',
      name: 'idman',
      displayName: 'İdman və istirahət',
      icon: <Dumbbell className="h-8 w-8" />,
      color: '#2ec4b6',
      itemCount: 98,
      description: 'İdman alətləri və istirahət malları',
      subCategories: [
        { name: 'idman-aletleri', displayName: 'İdman alətləri', count: 45 },
        { name: 'idman-geyim', displayName: 'İdman geyimləri', count: 32 },
        { name: 'turizm', displayName: 'Turizm ləvazimatları', count: 21 }
      ]
    },
    {
      id: '13',
      name: 'texnologiya',
      displayName: 'Texnologiya',
      icon: <Monitor className="h-8 w-8" />,
      color: '#fb8500',
      itemCount: 134,
      description: 'Kompüter, monitor və texnoloji avadanlıq',
      subCategories: [
        { name: 'monitor', displayName: 'Monitorlar', count: 45 },
        { name: 'printer', displayName: 'Printerlər', count: 32 },
        { name: 'komputer-hisseleri', displayName: 'Kompüter hissələri', count: 57 }
      ]
    },
    {
      id: '14',
      name: 'musiqi',
      displayName: 'Musiqi alətləri',
      icon: <Music className="h-8 w-8" />,
      color: '#8338ec',
      itemCount: 67,
      description: 'Gitara, piano və digər musiqi alətləri',
      subCategories: [
        { name: 'gitara', displayName: 'Gitara', count: 28 },
        { name: 'piano', displayName: 'Piano', count: 12 },
        { name: 'diger-aletler', displayName: 'Digər alətlər', count: 27 }
      ]
    },
    {
      id: '15',
      name: 'foto-video',
      displayName: 'Foto və video',
      icon: <Camera className="h-8 w-8" />,
      color: '#3a86ff',
      itemCount: 79,
      description: 'Kameralar, linzalar və foto-video avadanlıq',
      subCategories: [
        { name: 'kameralar', displayName: 'Kameralar', count: 35 },
        { name: 'linzalar', displayName: 'Linzalar', count: 25 },
        { name: 'aksessuarlar', displayName: 'Aksesuarlar', count: 19 }
      ]
    },
    {
      id: '16',
      name: 'hobbi',
      displayName: 'Hobbi və əyləncə',
      icon: <Gamepad2 className="h-8 w-8" />,
      color: '#9e2a2b',
      itemCount: 112,
      description: 'Kolleksiya, əl işləri və əyləncə üçün mallar',
      subCategories: [
        { name: 'kolleksiya', displayName: 'Kolleksiya', count: 38 },
        { name: 'el-isleri', displayName: 'Əl işləri', count: 45 },
        { name: 'eylence', displayName: 'Əyləncə', count: 29 }
      ]
    },
    {
      id: '17',
      name: 'tehsil',
      displayName: 'Təhsil və kurslar',
      icon: <GraduationCap className="h-8 w-8" />,
      color: '#0077b6',
      itemCount: 89,
      description: 'Dərslik, kurs və təhsil materialları',
      subCategories: [
        { name: 'derslikler', displayName: 'Dərsliklər', count: 34 },
        { name: 'kurslar', displayName: 'Kurslar', count: 42 },
        { name: 'online-tehsil', displayName: 'Online təhsil', count: 13 }
      ]
    },
    {
      id: '18',
      name: 'dizayn',
      displayName: 'Dizayn və incəsənət',
      icon: <PaintBucket className="h-8 w-8" />,
      color: '#e07a5f',
      itemCount: 62,
      description: 'Rəsm, dizayn və incəsənət materialları',
      subCategories: [
        { name: 'resm', displayName: 'Rəsm ləvazimatları', count: 28 },
        { name: 'dizayn', displayName: 'Dizayn materialları', count: 19 },
        { name: 'incesenət', displayName: 'İncəsənət işləri', count: 15 }
      ]
    },
    {
      id: '19',
      name: 'hediyyeler',
      displayName: 'Hədiyyələr',
      icon: <Gift className="h-8 w-8" />,
      color: '#e63946',
      itemCount: 103,
      description: 'Müxtəlif tədbirlər üçün hədiyyə əşyaları',
      subCategories: [
        { name: 'bayram', displayName: 'Bayram hədiyyələri', count: 45 },
        { name: 'ad-gunu', displayName: 'Ad günü hədiyyələri', count: 38 },
        { name: 'diger', displayName: 'Digər hədiyyələr', count: 20 }
      ]
    },
    {
      id: '20',
      name: 'heyvan-mallari',
      displayName: 'Heyvan malları',
      icon: <PawPrint className="h-8 w-8" />,
      color: '#6a994e',
      itemCount: 74,
      description: 'Ev heyvanları üçün yem və aksesuarlar',
      subCategories: [
        { name: 'yem', displayName: 'Heyvan yeməkləri', count: 32 },
        { name: 'aksessuarlar', displayName: 'Aksesuarlar', count: 28 },
        { name: 'bakim', displayName: 'Baxım məhsulları', count: 14 }
      ]
    },
    {
      id: '21',
      name: 'seyahet',
      displayName: 'Səyahət və turizm',
      icon: <Plane className="h-8 w-8" />,
      color: '#219ebc',
      itemCount: 56,
      description: 'Çanta, çadır və səyahət ləvazimatları',
      subCategories: [
        { name: 'canta', displayName: 'Çantalar', count: 22 },
        { name: 'cadir', displayName: 'Çadırlar', count: 18 },
        { name: 'levazimtlar', displayName: 'Ləvazimatlar', count: 16 }
      ]
    },
    {
      id: '22',
      name: 'qida',
      displayName: 'Qida və içkilər',
      icon: <Coffee className="h-8 w-8" />,
      color: '#7f4f24',
      itemCount: 48,
      description: 'Ev hazırlaması, organik məhsullar',
      subCategories: [
        { name: 'ev-hazirlamasi', displayName: 'Ev hazırlaması', count: 22 },
        { name: 'organik', displayName: 'Organik məhsullar', count: 16 },
        { name: 'ickiler', displayName: 'İçkilər', count: 10 }
      ]
    },
    {
      id: '23',
      name: 'dekor',
      displayName: 'Ev dekorasiyası',
      icon: <Leaf className="h-8 w-8" />,
      color: '#588157',
      itemCount: 92,
      description: 'İşıqlandırma, şəkillər, bitkilər, dekor',
      subCategories: [
        { name: 'isiqlandirma', displayName: 'İşıqlandırma', count: 34 },
        { name: 'bitki', displayName: 'Bitkilər', count: 28 },
        { name: 'dekor', displayName: 'Dekor əşyaları', count: 30 }
      ]
    },
    {
      id: '24',
      name: 'elektrik',
      displayName: 'Elektrik avadanlığı',
      icon: <Tv2 className="h-8 w-8" />,
      color: '#343a40',
      itemCount: 68,
      description: 'Televizor, kondisioner və məişət texnikası',
      subCategories: [
        { name: 'meiset-texnikasi', displayName: 'Məişət texnikası', count: 32 },
        { name: 'tv', displayName: 'Televizorlar', count: 22 },
        { name: 'kondisioner', displayName: 'Kondisionerlər', count: 14 }
      ]
    }
  ];

  // Populyar kateqoriyaları süzürük
  const popularCategories = categories.filter(category => category.popular);

  // Axtarış funksiyası
  const filteredCategories = categories.filter(
    category => 
      category.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Kateqoriyaya keçid
  const handleCategoryClick = (categoryName: string) => {
    navigate(`/category/${categoryName}`);
  };

  // Kateqoriya kartı komponenti
  const CategoryCard = ({ category }: { category: Category }) => {
    return (
      <motion.div 
        whileHover={{ y: -5 }}
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden"
        onClick={() => handleCategoryClick(category.name)}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center" 
              style={{ backgroundColor: `${category.color}20`, color: category.color }}
            >
              {category.icon}
            </div>
            <Badge variant="outline" className="text-xs">
              {category.itemCount} elan
            </Badge>
          </div>

          <h3 className="font-semibold text-lg mb-1">{category.displayName}</h3>
          {category.description && (
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {category.description}
            </p>
          )}

          {category.subCategories && (
            <div className="flex flex-wrap gap-2 mt-3">
              {category.subCategories.slice(0, 3).map(sub => (
                <Badge 
                  key={sub.name} 
                  variant="secondary"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800"
                >
                  {sub.displayName}
                </Badge>
              ))}
              {category.subCategories.length > 3 && (
                <Badge variant="outline">+{category.subCategories.length - 3}</Badge>
              )}
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  // Kateqoriya siyahı elementi komponenti
  const CategoryListItem = ({ category }: { category: Category }) => {
    return (
      <motion.div
        whileHover={{ backgroundColor: '#f9fafb' }}
        className="border-b border-gray-100 py-4 cursor-pointer"
        onClick={() => handleCategoryClick(category.name)}
      >
        <div className="flex items-center">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center mr-4" 
            style={{ backgroundColor: `${category.color}20`, color: category.color }}
          >
            {category.icon}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{category.displayName}</h3>
              <Badge variant="outline" className="text-xs">
                {category.itemCount} elan
              </Badge>
            </div>

            {category.description && (
              <p className="text-gray-600 text-sm mt-1">{category.description}</p>
            )}

            {category.subCategories && (
              <div className="flex flex-wrap gap-2 mt-2">
                {category.subCategories.slice(0, 4).map(sub => (
                  <Badge 
                    key={sub.name} 
                    variant="secondary"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs"
                  >
                    {sub.displayName} ({sub.count})
                  </Badge>
                ))}
                {category.subCategories.length > 4 && (
                  <Badge variant="outline" className="text-xs">+{category.subCategories.length - 4}</Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <SEO 
        title={t('categories.pageTitle', 'Kateqoriyalar - BarterTap.az')}
        description={t('categories.pageDescription', 'BarterTap.az platformasının bütün kateqoriyalarını kəşf edin. Müxtəlif elanları tapın və əşyalarınızı mübadilə edin.')} 
      />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Kateqoriyalar</h1>
          <p className="text-gray-600">
            Bütün kateqoriyalarımızı nəzərdən keçirin və lazım olan əşyaları tapın.
          </p>
        </div>

        {/* Axtarış və görünüş seçimləri */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Kateqoriya axtar..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-primary text-white' : ''}
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-primary text-white' : ''}
            >
              <List className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Populyar kateqoriyalar */}
        {searchQuery === '' && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6">Populyar kateqoriyalar</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {popularCategories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        )}

        {/* Bütün kateqoriyalar */}
        <div>
          <h2 className="text-xl font-semibold mb-6">
            {searchQuery ? `Axtarış nəticələri: ${filteredCategories.length}` : 'Bütün kateqoriyalar'}
          </h2>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCategories.map(category => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
              {filteredCategories.map(category => (
                <CategoryListItem key={category.id} category={category} />
              ))}
            </div>
          )}

          {/* Axtarış nəticəsi yoxdursa */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
              <h3 className="text-lg font-medium mb-2">Kateqoriya tapılmadı</h3>
              <p className="text-gray-600 mb-4">
                "{searchQuery}" üçün axtarış nəticəsi tapılmadı.
              </p>
              <Button onClick={() => setSearchQuery('')}>Bütün kateqoriyaları göstər</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}