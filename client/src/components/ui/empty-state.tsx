
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Search, 
  Filter, 
  ShoppingBag, 
  Package, 
  Heart, 
  MessageSquare, 
  PlusCircle,
  ArrowRight
} from "lucide-react";

// Empty state type definitions
type EmptyStateType = 
  | "search" 
  | "filter" 
  | "items" 
  | "favorites" 
  | "messages" 
  | "orders" 
  | "custom";

interface EmptyStateProps {
  type?: EmptyStateType;
  title?: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  type = "custom",
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  // Type-based default configurations
  const configs: Record<EmptyStateType, { 
    title: string;
    description: string;
    icon: React.ReactNode;
    action?: { 
      label: string;
      href?: string;
    };
  }> = {
    search: {
      title: "Axtarışa uyğun nəticə tapılmadı",
      description: "Axtarış sorğunuzu dəyişdirin və ya filtirləri təmizləyin.",
      icon: <Search className="h-8 w-8 text-gray-400" />,
      action: {
        label: "Bütün filtrləri təmizlə",
      }
    },
    filter: {
      title: "Filtrlərə uyğun nəticə tapılmadı",
      description: "Filtirləri dəyişdirin və ya təmizləyin.",
      icon: <Filter className="h-8 w-8 text-gray-400" />,
      action: {
        label: "Filtirləri təmizlə",
      }
    },
    items: {
      title: "Hələ heç bir elanınız yoxdur",
      description: "Barter etmək istədiyiniz əşyaları əlavə etməyə başlayın.",
      icon: <Package className="h-8 w-8 text-gray-400" />,
      action: {
        label: "Yeni elan əlavə et",
        href: "/create-item"
      }
    },
    favorites: {
      title: "Seçilmiş elanlar yoxdur",
      description: "Bəyəndiyiniz elanları seçilmişlərə əlavə edin.",
      icon: <Heart className="h-8 w-8 text-gray-400" />,
      action: {
        label: "Elanlara baxın",
        href: "/search"
      }
    },
    messages: {
      title: "Mesajlarınız yoxdur",
      description: "Barter təklifləri göndərdikdə mesajlarınız burada görünəcək.",
      icon: <MessageSquare className="h-8 w-8 text-gray-400" />,
      action: {
        label: "Elanlara baxın",
        href: "/search"
      }
    },
    orders: {
      title: "Tamamlanmış əməliyyatlar yoxdur",
      description: "Barter əməliyyatlarınız tamamlandıqda burada görünəcək.",
      icon: <ShoppingBag className="h-8 w-8 text-gray-400" />,
    },
    custom: {
      title: title || "Nəticə tapılmadı",
      description: description || "Axtardığınız məlumat hal-hazırda mövcud deyil.",
      icon: icon || <Package className="h-8 w-8 text-gray-400" />,
    }
  };

  const config = configs[type];
  const finalTitle = title || config.title;
  const finalDescription = description || config.description;
  const finalIcon = icon || config.icon;
  const finalAction = action || config.action;

  return (
    <div className={cn("py-10 flex flex-col items-center text-center", className)}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {finalIcon}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">
        {finalTitle}
      </h3>
      <p className="text-gray-600 max-w-md mb-6">
        {finalDescription}
      </p>
      
      {finalAction && (
        finalAction.href ? (
          <Link href={finalAction.href}>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>{finalAction.label}</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Button 
            onClick={(finalAction as any).onClick} 
            className="flex items-center gap-2"
          >
            {finalAction.label}
          </Button>
        )
      )}
    </div>
  );
}
