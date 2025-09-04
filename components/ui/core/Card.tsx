// components/ui/core/Card.tsx
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export const Card = ({ 
  children, 
  variant = 'default', 
  hover = false, 
  padding = 'md',
  className 
}: CardProps) => (
  <div className={cn(
    'modern-card',
    variant === 'glass' && 'glass',
    variant === 'elevated' && 'elevated',
    hover && 'interactive-hover',
    {
      'p-0': padding === 'none',
      'p-4': padding === 'sm',
      'p-6': padding === 'md',
      'p-8': padding === 'lg'
    },
    className
  )}>
    {children}
  </div>
);