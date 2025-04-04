
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const categories = [
  {
    id: "electronics",
    name: "Elektronika",
    icon: "📱",
    color: "#3B82F6",
    count: 245
  },
  {
    id: "clothing",
    name: "Geyim",
    icon: "👕",
    color: "#EC4899",
    count: 189
  },
  {
    id: "home",
    name: "Ev əşyaları",
    icon: "🏠",
    color: "#10B981",
    count: 167
  },
  {
    id: "sports",
    name: "İdman",
    icon: "⚽",
    color: "#F59E0B",
    count: 132
  },
  {
    id: "books",
    name: "Kitablar",
    icon: "📚",
    color: "#8B5CF6",
    count: 94
  },
  {
    id: "toys",
    name: "Oyuncaqlar",
    icon: "🧸",
    color: "#F97316",
    count: 76
  }
];

export function CategoriesSection() {
  const { t } = useTranslation();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Kateqoriyalar
          </h2>
          <Link href="/categories" className="text-primary font-medium hover:underline inline-flex items-center">
            Hamısına bax
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {categories.map((category) => (
            <motion.div 
              key={category.id}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Link href={`/category/${category.id}`}>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-full transition-all hover:shadow-md hover:border-primary/20 cursor-pointer flex flex-col items-center text-center">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-3"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} əşya</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default CategoriesSection;
