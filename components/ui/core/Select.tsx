// components/ui/core/Select.tsx
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { forwardRef, SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helper?: string;
  options: { value: string; label: string; disabled?: boolean }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helper,
  options,
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
      <select
        ref={ref}
        className={cn(
          'block w-full rounded-lg border-gray-300 bg-white pr-10 transition-all duration-200',
          'focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
          'appearance-none cursor-pointer',
          error && 'border-danger-300 focus:ring-danger-500 focus:border-danger-500',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>
    </div>
    
    {error && (
      <p className="text-sm text-danger-600">{error}</p>
    )}
    
    {helper && !error && (
      <p className="text-sm text-gray-500">{helper}</p>
    )}
  </div>
));

Select.displayName = 'Select';