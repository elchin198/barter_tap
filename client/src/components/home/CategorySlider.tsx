import React from 'react';
import { Link } from 'wouter';
import { 
  Smartphone, 
  BookOpen, 
  Shirt,
  Car, 
  Home, 
  Flower, 
  Gamepad2,
  Sofa,
  Dumbbell, 
  Briefcase,
  Laptop,
  Baby,
  PawPrint,
  Utensils,
  Music,
  Camera,
  Clock,
  Bike,
  Plane
} from 'lucide-react';

interface Category {
  id?: number;
  name: string;
  icon: React.ReactNode;
  color: string;
}

// Default categories with icons - tap.az style
const DEFAULT_CATEGORIES: Category[] = [
  {
    name: 'Elektronika',
    icon: <Smartphone className="w-5 h-5" />,
    color: 'text-indigo-600',
  },
  {
    name: 'Daşınmaz əmlak',
    icon: <Home className="w-5 h-5" />,
    color: 'text-cyan-600',
  },
  {
    name: 'Nəqliyyat',
    icon: <Car className="w-5 h-5" />,
    color: 'text-red-600',
  },
  {
    name: 'Məişət texnikası',
    icon: <Utensils className="w-5 h-5" />,
    color: 'text-green-600',
  },
  {
    name: 'Telefon və planşetlər',
    icon: <Smartphone className="w-5 h-5" />,
    color: 'text-blue-600',
  },
  {
    name: 'Geyim',
    icon: <Shirt className="w-5 h-5" />,
    color: 'text-pink-600',
  },
  {
    name: 'Ev üçün məhsullar',
    icon: <Sofa className="w-5 h-5" />,
    color: 'text-emerald-600',
  },
  {
    name: 'Kompüter avadanlığı',
    icon: <Laptop className="w-5 h-5" />,
    color: 'text-purple-600',
  },
  {
    name: 'Hobbi və asudə',
    icon: <Music className="w-5 h-5" />,
    color: 'text-amber-600',
  },
  {
    name: 'Uşaq aləmi',
    icon: <Baby className="w-5 h-5" />,
    color: 'text-orange-600',
  },
  {
    name: 'Heyvanlar',
    icon: <PawPrint className="w-5 h-5" />,
    color: 'text-lime-600',
  },
  {
    name: 'İdman və istirahət',
    icon: <Dumbbell className="w-5 h-5" />,
    color: 'text-blue-700',
  },
  {
    name: 'Kitab və jurnallar',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'text-yellow-600',
  },
  {
    name: 'Bitkilər',
    icon: <Flower className="w-5 h-5" />,
    color: 'text-emerald-700',
  },
  {
    name: 'Kolleksiya',
    icon: <Clock className="w-5 h-5" />,
    color: 'text-gray-600',
  },
  {
    name: 'Velosiped',
    icon: <Bike className="w-5 h-5" />,
    color: 'text-cyan-600',
  },
  {
    name: 'Oyunlar',
    icon: <Gamepad2 className="w-5 h-5" />,
    color: 'text-violet-600',
  },
  {
    name: 'Turizm və səyahət',
    icon: <Plane className="w-5 h-5" />,
    color: 'text-sky-600',
  },
  {
    name: 'Foto və video',
    icon: <Camera className="w-5 h-5" />,
    color: 'text-slate-600',
  },
  {
    name: 'Xidmətlər',
    icon: <Briefcase className="w-5 h-5" />,
    color: 'text-rose-600',
  }
];

export default function CategorySlider() {
  // Only show first 12 categories for display (rest can be shown on a categories page)
  const visibleCategories = DEFAULT_CATEGORIES.slice(0, 12);
  
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {visibleCategories.map((category, index) => (
        <Link key={index} href={`/items?category=${encodeURIComponent(category.name)}`}>
          <div className="flex flex-col items-center group hover:opacity-80 transition-opacity text-center w-24">
            <div className={`w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors`}>
              <div className="text-blue-600">
                {category.icon}
              </div>
            </div>
            <span className="text-sm font-medium text-center mt-2 line-clamp-1 text-gray-700 group-hover:text-blue-600 transition-colors">
              {category.name}
            </span>
          </div>
        </Link>
      ))}
      <Link href="/categories">
        <div className="flex flex-col items-center group hover:opacity-80 transition-opacity text-center w-24">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
            <span className="text-2xl font-medium text-gray-500">+</span>
          </div>
          <span className="text-sm font-medium text-center mt-2 line-clamp-1 text-gray-700 group-hover:text-blue-600 transition-colors">
            Hamısı
          </span>
        </div>
      </Link>
    </div>
  );
}