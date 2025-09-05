// File: components/ui/core/Progress.tsx
'use client';

import { cn } from '@/lib/utils';

interface ProgressProps {
  value?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  showValue?: boolean;
  animated?: boolean;
  striped?: boolean;
}

export const Progress = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'default',
  className,
  showValue = false,
  animated = false,
  striped = false
}: ProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-amber-600',
    danger: 'bg-red-600'
  };

  const backgroundVariants = {
    default: 'bg-blue-100',
    success: 'bg-green-100', 
    warning: 'bg-amber-100',
    danger: 'bg-red-100'
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div
        className={cn(
          'w-full overflow-hidden rounded-full',
          sizeClasses[size],
          backgroundVariants[variant]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            'h-full transition-all duration-300 ease-out rounded-full',
            variantClasses[variant],
            animated && 'animate-pulse',
            striped && 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:20px_20px] animate-[progress-stripes_1s_linear_infinite]'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {showValue && (
        <div className="mt-1 flex justify-between text-xs text-gray-600">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  );
};