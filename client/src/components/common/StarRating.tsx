import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  count?: number;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

const sizes = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-5 h-5' };

const StarRating: React.FC<StarRatingProps> = ({
  rating, maxRating = 5, size = 'md', showCount, count, interactive, onRate,
}) => {
  const [hovered, setHovered] = React.useState(0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, i) => {
          const filled = interactive ? (hovered || rating) > i : rating > i;
          const partial = !interactive && rating > i && rating < i + 1;
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => onRate?.(i + 1)}
              onMouseEnter={() => interactive && setHovered(i + 1)}
              onMouseLeave={() => interactive && setHovered(0)}
              className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}`}
            >
              <Star
                className={`${sizes[size]} transition-colors ${
                  filled
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-transparent text-slate-300 dark:text-slate-600'
                }`}
              />
            </button>
          );
        })}
      </div>
      {showCount && count !== undefined && (
        <span className="text-xs text-[var(--text-muted)] ml-0.5">({count})</span>
      )}
    </div>
  );
};

export default StarRating;
