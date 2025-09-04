// components/ui/core/Input.tsx
import { cn } from '@/lib/utils';
import { forwardRef, InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant?: 'default' | 'filled' | 'flushed';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helper,
  startIcon,
  endIcon,
  variant = 'default',
  className,
  ...props
}, ref) => (
  <div className="space-y-1">
    {label && (
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
    )}
    
    <div className="relative">
      {startIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {startIcon}
        </div>
      )}
      
      <input
        ref={ref}
        className={cn(
          'block w-full rounded-lg border-gray-300 transition-all duration-200',
          'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'placeholder:text-gray-400',
          
          // Variant styles
          {
            'default': 'bg-white border border-gray-300 shadow-sm',
            'filled': 'bg-gray-50 border border-gray-200',
            'flushed': 'bg-transparent border-0 border-b-2 border-gray-200 rounded-none focus:ring-0'
          }[variant],
          
          // Icon padding
          startIcon && 'pl-10',
          endIcon && 'pr-10',
          
          // Error state
          error && 'border-danger-300 focus:ring-danger-500 focus:border-danger-500',
          
          className
        )}
        {...props}
      />
      
      {endIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
          {endIcon}
        </div>
      )}
    </div>
    
    {error && (
      <p className="text-sm text-danger-600">{error}</p>
    )}
    
    {helper && !error && (
      <p className="text-sm text-gray-500">{helper}</p>
    )}
  </div>
));

Input.displayName = 'Input';