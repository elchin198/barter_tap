
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Info, ArrowRight, Camera, Search, ArrowLeftRight, MapPin, ThumbsUp, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HowItWorksSection() {
  const steps = [
    {
      icon: <Camera className="h-6 w-6 text-white" />,
      title: "Əşyalarınızı əlavə edin",
      description: "Artıq ehtiyacınız olmayan əşyaların şəkilləri və təsvirini əlavə edin."
    },
    {
      icon: <Search className="h-6 w-6 text-white" />,
      title: "İstədiyiniz əşyaları tapın",
      description: "Platformada sizə lazım olan əşyaları axtarın və ya təkliflərə baxın."
    },
    {
      icon: <ArrowLeftRight className="h-6 w-6 text-white" />,
      title: "Təklif göndərin",
      description: "Bəyəndiyiniz əşya üçün öz əşyanızı təklif edin və razılaşma əldə edin."
    },
    {
      icon: <MapPin className="h-6 w-6 text-white" />,
      title: "Görüşün və dəyişdirin",
      description: "Qarşı tərəflə görüşüb əşyaları dəyişdirin və əməliyyatı tamamlayın."
    },
    {
      icon: <ThumbsUp className="h-6 w-6 text-white" />,
      title: "Qiymətləndirin",
      description: "Dəyişim təcrübənizi qiymətləndirərək icmaya töhfə verin."
    }
  ];
  
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-96 h-96 bg-blue-50 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Barter necə işləyir?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sadə 5 addımda əşyalarınızı dəyişin
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              BarterTap.az vasitəsilə istifadə etmədiyiniz əşyaları dəyişdirərək yeni əşyalar əldə etmək çox sadədir.
            </p>
          </motion.div>
        </div>
        
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[28px] top-12 bottom-12 w-1 bg-gradient-to-b from-primary/60 to-primary/20 hidden md:block"></div>
          
          <div className="space-y-8 relative">
            {steps.map((step, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex items-start gap-6"
              >
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/20 relative z-10">
                  {step.icon}
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex-1 md:max-w-xl hover:shadow-md hover:border-primary/20 transition-all duration-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/how-it-works">
            <Button variant="outline" className="group">
              Ətraflı öyrənin
              <ArrowRightCircle className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
