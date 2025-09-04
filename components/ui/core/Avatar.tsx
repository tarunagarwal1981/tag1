// components/ui/core/Avatar.tsx
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';
import { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  fallback?: string;
}

export const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  className,
  fallback 
}: AvatarProps) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    'xs': 'h-6 w-6',
    'sm': 'h-8 w-8',
    'md': 'h-10 w-10',
    'lg': 'h-12 w-12',
    'xl': 'h-16 w-16',
    '2xl': 'h-20 w-20'
  };

  const iconSizes = {
    'xs': 'h-3 w-3',
    'sm': 'h-4 w-4',
    'md': 'h-5 w-5',
    'lg': 'h-6 w-6',
    'xl': 'h-8 w-8',
    '2xl': 'h-10 w-10'
  };

  return (
    <div className={cn(
      'relative flex items-center justify-center rounded-full bg-gray-100 overflow-hidden',
      sizeClasses[size],
      className
    )}>
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : fallback ? (
        <span className="text-xs font-medium text-gray-700 uppercase">
          {fallback}
        </span>
      ) : (
        <User className={cn('text-gray-400', iconSizes[size])} />
      )}
    </div>
  );
};
