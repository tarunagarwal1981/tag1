// File: components/ui/core/Separator.tsx
'use client';

import { cn } from '@/lib/utils';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  decorative?: boolean;
}

export const Separator = ({ 
  orientation = 'horizontal', 
  className,
  decorative = true 
}: SeparatorProps) => {
  return (
    <div
      role={decorative ? undefined : 'separator'}
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-gray-200',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className
      )}
    />
  );
};
