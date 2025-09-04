// components/ui/core/Button.tsx
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}, ref) => (
  <button
    ref={ref}
    disabled={disabled || loading}
    className={cn(
      // Base styles
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-95',
      
      // Variant styles
      {
        'primary': 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
        'secondary': 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
        'success': 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 shadow-sm',
        'warning': 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 shadow-sm',
        'danger': 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 shadow-sm',
        'ghost': 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
        'outline': 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
      }[variant],
      
      // Size styles
      {
        'sm': 'px-3 py-2 text-sm rounded-lg gap-2',
        'md': 'px-4 py-2.5 text-sm rounded-lg gap-2',
        'lg': 'px-6 py-3 text-base rounded-lg gap-3',
        'xl': 'px-8 py-4 text-lg rounded-xl gap-3'
      }[size],
      
      className
    )}
    {...props}
  >
    {loading ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : icon ? (
      icon
    ) : null}
    {children}
  </button>
));

Button.displayName = 'Button';