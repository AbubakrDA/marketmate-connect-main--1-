import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  className?: string;
}

export const StarRating = ({ rating, reviewCount, size = 'sm', showCount = true, className }: StarRatingProps) => {
  const sizeMap = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' };
  const textMap = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };
  const iconSize = sizeMap[size];
  const textSize = textMap[size];

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.floor(rating);
          const half = !filled && star === Math.ceil(rating) && rating % 1 >= 0.25;
          return (
            <span key={star} className="relative">
              <Star className={cn(iconSize, 'text-muted-foreground/30')} />
              {(filled || half) && (
                <Star
                  className={cn(iconSize, 'absolute inset-0 text-amber-500 fill-amber-500')}
                  style={half ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
                />
              )}
            </span>
          );
        })}
      </div>
      <span className={cn(textSize, 'font-medium text-foreground')}>{rating.toFixed(1)}</span>
      {showCount && reviewCount !== undefined && (
        <span className={cn(textSize, 'text-muted-foreground')}>({reviewCount})</span>
      )}
    </div>
  );
};
