import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  title: string;
  variant?: "default" | "compact" | "large";
}

export default function ImageGallery({ images, title, variant = "default" }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullscreenMode, setFullscreenMode] = useState(false);
  const [fullscreenIndex, setFullscreenIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Ensure there's always at least one placeholder image
  const galleryImages = images.length > 0 
    ? images 
    : ['https://via.placeholder.com/800x600?text=No+Image+Available'];

  const handlePrevious = () => {
    setSelectedIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handleFullscreenPrevious = () => {
    setFullscreenIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleFullscreenNext = () => {
    setFullscreenIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const openFullscreen = (index: number) => {
    setFullscreenIndex(index);
    setFullscreenMode(true);
  };
  
  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenMode) {
        if (e.key === 'ArrowLeft') {
          handleFullscreenPrevious();
        } else if (e.key === 'ArrowRight') {
          handleFullscreenNext();
        } else if (e.key === 'Escape') {
          setFullscreenMode(false);
        } else if (e.key === 'z') {
          setIsZoomed(!isZoomed);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenMode, isZoomed]);

  // Determine layout based on variant
  const mainImageClasses = {
    default: "h-[350px] md:h-[400px] lg:h-[450px]",
    compact: "h-[250px] md:h-[300px] lg:h-[350px]",
    large: "h-[400px] md:h-[500px] lg:h-[600px]"
  };

  const thumbnailContainerClasses = {
    default: "flex overflow-x-auto py-2 gap-2 mt-2",
    compact: "grid grid-cols-5 gap-2 mt-2",
    large: "flex overflow-x-auto py-3 gap-3 mt-3"
  };

  const thumbnailClasses = {
    default: "h-16 w-16 md:h-20 md:w-20",
    compact: "h-12 w-12 md:h-14 md:w-14",
    large: "h-20 w-20 md:h-24 md:w-24"
  };

  return (
    <div className="relative">
      {/* Main Image Display */}
      <div className={cn(
        "relative w-full overflow-hidden rounded-lg bg-gray-100", 
        mainImageClasses[variant]
      )}>
        <img 
          src={galleryImages[selectedIndex]} 
          alt={`${title} - Image ${selectedIndex + 1}`}
          className="w-full h-full object-contain" 
        />
        
        {/* Navigation Buttons */}
        {galleryImages.length > 1 && (
          <>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/70 hover:bg-white"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-white/70 hover:bg-white"
              onClick={handleNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
        
        {/* Fullscreen button */}
        <Dialog open={fullscreenMode} onOpenChange={setFullscreenMode}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="absolute bottom-2 right-2 rounded-full bg-white/70 hover:bg-white"
              onClick={() => openFullscreen(selectedIndex)}
            >
              <Maximize className="h-5 w-5" />
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[90vw] h-[90vh] p-0 bg-black">
            <div className="relative h-full w-full flex items-center justify-center">
              <img 
                src={galleryImages[fullscreenIndex]} 
                alt={`${title} - Fullscreen Image ${fullscreenIndex + 1}`}
                className={cn(
                  "max-h-full max-w-full transition-transform duration-300",
                  isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
                )}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {/* Navigation for fullscreen */}
              {galleryImages.length > 1 && !isZoomed && (
                <>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/40"
                    onClick={handleFullscreenPrevious}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/40"
                    onClick={handleFullscreenNext}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Image counter and zoom button */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-black/50 px-4 py-2 rounded-full text-white">
                <span>
                  {fullscreenIndex + 1} / {galleryImages.length}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
              </div>

              {/* Close button */}
              <DialogClose className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70">
                <X className="h-6 w-6" />
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Image Counter */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {selectedIndex + 1} / {galleryImages.length}
          </div>
        )}
      </div>
      
      {/* Thumbnails */}
      {galleryImages.length > 1 && (
        <div className={cn("thumbnails", thumbnailContainerClasses[variant])}>
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className={cn(
                thumbnailClasses[variant],
                "cursor-pointer rounded-md overflow-hidden transition-all border-2",
                selectedIndex === index ? "border-blue-500" : "border-transparent hover:border-gray-300"
              )}
              onClick={() => setSelectedIndex(index)}
            >
              <img 
                src={image} 
                alt={`${title} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover" 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}