import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { APP_CONFIG } from '@/constants';

interface RatingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

const sizeClasses = {
  sm: 'h-3.5 w-3.5',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
} as const;

/**
 * Star rating display component
 */
export function Rating({
  value,
  max = APP_CONFIG.RATING.MAX,
  size = 'md',
  showValue = false,
  reviewCount,
  className,
}: RatingProps) {
  const roundedValue = Math.round(value * 2) / 2; // Round to nearest 0.5

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex" aria-label={`${value} de ${max} estrellas`}>
        {Array.from({ length: max }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = roundedValue >= starValue;
          const isHalf = !isFilled && roundedValue >= starValue - 0.5;

          return (
            <span key={index} className="relative">
              {/* Background star (empty) */}
              <Star
                className={cn(
                  sizeClasses[size],
                  'text-gray-300'
                )}
                fill="currentColor"
              />
              {/* Foreground star (filled) */}
              {(isFilled || isHalf) && (
                <Star
                  className={cn(
                    sizeClasses[size],
                    'absolute inset-0 text-yellow-400',
                    isHalf && 'clip-path-half'
                  )}
                  fill="currentColor"
                  style={isHalf ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
                />
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-700">{value.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-sm text-gray-500">({reviewCount})</span>
      )}
    </div>
  );
}

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

/**
 * Interactive star rating input
 */
export function RatingInput({
  value,
  onChange,
  max = APP_CONFIG.RATING.MAX,
  size = 'lg',
  disabled = false,
  className,
}: RatingInputProps) {
  const handleClick = (starValue: number) => {
    if (!disabled) {
      onChange(starValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, starValue: number) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onChange(starValue);
    }
  };

  return (
    <div
      className={cn('flex gap-1', className)}
      role="radiogroup"
      aria-label="Calificación"
    >
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isSelected = value >= starValue;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            onKeyDown={(e) => handleKeyDown(e, starValue)}
            disabled={disabled}
            className={cn(
              'transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 rounded',
              disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'
            )}
            role="radio"
            aria-checked={isSelected}
            aria-label={`${starValue} estrella${starValue > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isSelected ? 'text-yellow-400' : 'text-gray-300'
              )}
              fill="currentColor"
            />
          </button>
        );
      })}
    </div>
  );
}
