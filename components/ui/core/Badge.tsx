// components/ui/core/Badge.tsx
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className 
}: BadgeProps) => (
  <span className={cn(
    'inline-flex items-center font-medium rounded-full',
    
    // Variant styles
    {
      'default': 'bg-gray-100 text-gray-800',
      'success': 'bg-success-100 text-success-800',
      'warning': 'bg-warning-100 text-warning-800',
      'danger': 'bg-danger-100 text-danger-800',
      'info': 'bg-primary-100 text-primary-800'
    }[variant],
    
    // Size styles
    {
      'sm': 'px-2 py-0.5 text-xs',
      'md': 'px-2.5 py-0.5 text-sm',
      'lg': 'px-3 py-1 text-sm'
    }[size],
    
    className
  )}>
    {children}
  </span>
);