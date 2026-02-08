import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-primary-100 text-primary-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-primary-100 text-primary-800',
} as const;

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
} as const;

/**
 * Badge component for status indicators
 */
export function Badge({
  variant = 'default',
  size = 'sm',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}

interface DiscountBadgeProps {
  percentage: number;
  className?: string;
}

/**
 * Discount percentage badge
 */
export function DiscountBadge({ percentage, className }: DiscountBadgeProps) {
  if (percentage <= 0) return null;

  return (
    <Badge variant="error" className={cn('font-bold', className)}>
      -{percentage}%
    </Badge>
  );
}

interface StockBadgeProps {
  stock: number;
  lowStockThreshold?: number;
  className?: string;
}

/**
 * Stock status badge
 */
export function StockBadge({
  stock,
  lowStockThreshold = 5,
  className,
}: StockBadgeProps) {
  if (stock <= 0) {
    return (
      <Badge variant="error" className={className}>
        Agotado
      </Badge>
    );
  }

  if (stock <= lowStockThreshold) {
    return (
      <Badge variant="warning" className={className}>
        Quedan {stock}
      </Badge>
    );
  }

  return (
    <Badge variant="success" className={className}>
      En stock
    </Badge>
  );
}
