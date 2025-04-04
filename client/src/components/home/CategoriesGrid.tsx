import React from 'react';
import { Link } from 'wouter';
import { useTranslation } from 'react-i18next';
import { 
  Car, Monitor, Settings, Home, Building2, 
  Wrench as Tool, Shirt, Smartphone, Bike, 
  WashingMachine, Baby, Cat, Briefcase, 
  Grid, Store
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  displayName: string;
  icon: React.ReactNode;
}

export default function CategoriesGrid() {
  const { t } = useTranslation();

  // Şəkildəki kateqoriyalar 
  const categories: CategoryItem[] = [
    {
      id: '1',
      name: 'transport',
      displayName: t('categories.transport', 'Nəqliyyat'),
      icon: <Car className="h-8 w-8 text-orange-600" />
    },
    {
      id: '2',
      name: 'electronics',
      displayName: t('categories.electronics', 'Elektronika'),
      icon: <Monitor className="h-8 w-8 text-blue-600" />
    },
    {
      id: '3',
      name: 'parts-accessories',
      displayName: 'Ehtiyat hissələri və aksesuarlar',
      icon: <Settings className="h-8 w-8 text-yellow-600" />
    },
    {
      id: '4',
      name: 'home-garden',
      displayName: 'Ev və bağ üçün',
      icon: <Home className="h-8 w-8 text-green-600" />
    },
    {
      id: '5',
      name: 'real-estate',
      displayName: 'Daşınmaz əmlak',
      icon: <Building2 className="h-8 w-8 text-purple-600" />
    },
    {
      id: '6',
      name: 'services-business',
      displayName: 'Xidmətlər və biznes',
      icon: <Tool className="h-8 w-8 text-red-600" />
    },
    {
      id: '7',
      name: 'personal-items',
      displayName: 'Şəxsi əşyalar',
      icon: <Shirt className="h-8 w-8 text-emerald-600" />
    },
    {
      id: '8',
      name: 'phones',
      displayName: 'Telefonlar',
      icon: <Smartphone className="h-8 w-8 text-indigo-600" />
    },
    {
      id: '9',
      name: 'hobby-leisure',
      displayName: 'Hobbi və asudə',
      icon: <Bike className="h-8 w-8 text-lime-600" />
    },
    {
      id: '10',
      name: 'household-appliances',
      displayName: 'Məişət texnikası',
      icon: <WashingMachine className="h-8 w-8 text-slate-600" />
    },
    {
      id: '11',
      name: 'kids',
      displayName: 'Uşaq aləmi',
      icon: <Baby className="h-8 w-8 text-pink-600" />
    },
    {
      id: '12',
      name: 'animals',
      displayName: 'Heyvanlar',
      icon: <Cat className="h-8 w-8 text-amber-600" />
    },
    {
      id: '13',
      name: 'jobs',
      displayName: 'İş elanları',
      icon: <Briefcase className="h-8 w-8 text-gray-600" />
    },
    {
      id: '14',
      name: 'catalog',
      displayName: 'Kataloq',
      icon: <Grid className="h-8 w-8 text-orange-500" />
    },
    {
      id: '15',
      name: 'stores',
      displayName: 'Mağazalar',
      icon: <Store className="h-8 w-8 text-rose-600" />
    }
  ];

  // İlk sıra: 8 kateqoriya
  const firstRow = categories.slice(0, 8);
  // İkinci sıra: qalan kateqoriyalar
  const secondRow = categories.slice(8);

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        {/* Birinci sıra - 8 kateqoriya */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 mb-6">
          {firstRow.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.name}`}
            >
              <div className="flex flex-col items-center cursor-pointer">
                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-2 border border-gray-100">
                  {category.icon}
                </div>
                <span className="text-xs text-gray-700 text-center leading-tight">
                  {category.displayName}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* İkinci sıra - qalan kateqoriyalar */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
          {secondRow.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.name}`}
            >
              <div className="flex flex-col items-center cursor-pointer">
                <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center mb-2 border border-gray-100">
                  {category.icon}
                </div>
                <span className="text-xs text-gray-700 text-center leading-tight">
                  {category.displayName}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}