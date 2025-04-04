import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewStarsProps {
  initialRating?: number;
  maxRating?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  onChange?: (rating: number) => void;
  readOnly?: boolean;
  className?: string;
}

export default function ReviewStars({
  initialRating = 0,
  maxRating = 5,
  size = 'md',
  onChange,
  readOnly = false,
  className
}: ReviewStarsProps) {
  const [rating, setRating] = useState<number>(initialRating);
  const [hover, setHover] = useState<number | null>(null);

  // Update local rating if initialRating changes
  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleRatingChange = (index: number) => {
    if (readOnly) return;
    
    const newRating = index + 1;
    setRating(newRating);
    if (onChange) {
      onChange(newRating);
    }
  };

  // Get the star size based on the size prop
  const getStarSize = () => {
    switch(size) {
      case 'xs': return 'h-3 w-3';
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-6 w-6';
      case 'lg': return 'h-8 w-8';
      default: return 'h-5 w-5';
    }
  };

  // Get gap size based on the size prop
  const getGapSize = () => {
    switch(size) {
      case 'xs': return 'gap-0.5';
      case 'sm': return 'gap-1';
      case 'md': return 'gap-1.5';
      case 'lg': return 'gap-2';
      default: return 'gap-1';
    }
  };

  return (
    <div 
      className={cn(
        'flex items-center', 
        getGapSize(),
        readOnly ? '' : 'cursor-pointer',
        className
      )}
    >
      {[...Array(maxRating)].map((_, index) => {
        const ratingValue = index + 1;
        
        return (
          <Star
            key={index}
            className={cn(
              getStarSize(),
              'transition-colors duration-200',
              (hover !== null && hover >= ratingValue) || (hover === null && rating >= ratingValue)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 fill-gray-300',
              !readOnly && 'hover:text-yellow-500'
            )}
            onClick={() => handleRatingChange(index)}
            onMouseEnter={() => !readOnly && setHover(ratingValue)}
            onMouseLeave={() => !readOnly && setHover(null)}
          />
        );
      })}
    </div>
  );
}