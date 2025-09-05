// File: components/dashboard/common/DealCard.tsx
'use client';

import { ArrowRight, PlaneTakeoff, Star, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/core/Button';
import { Badge } from '@/components/ui/core/Badge';
import { Card } from '@/components/ui/core/Card';
import { cn, formatCurrency } from '@/lib/utils';

interface DealCardProps {
  id: number;
  from: string;
  to: string;
  price: number;
  imageUrl: string;
  airlineLogoUrl: string;
  tag?: string;
  duration?: string;
  rating?: number;
  onBook?: (dealId: number) => void;
}

export const DealCard = ({
  id,
  from,
  to,
  price,
  imageUrl,
  airlineLogoUrl,
  tag,
  duration = "7 days",
  rating = 4.5,
  onBook
}: DealCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
      <div className="relative">
        <img
          src={imageUrl}
          alt={`Travel package from ${from} to ${to}`}
          className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {tag && (
          <Badge variant="destructive" className="absolute top-3 left-3 shadow-lg">
            {tag}
          </Badge>
        )}
        
        <img
          src={airlineLogoUrl}
          alt="Provider"
          className="h-10 w-10 rounded-full border-2 border-white absolute -bottom-5 right-4 shadow-md bg-white object-cover"
        />
        
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-yellow-500 fill-current" />
            <span className="text-xs font-medium text-gray-700">{rating}</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {from} → {to}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {duration}
          </p>
        </div>
        
        <h3 className="font-bold text-gray-800 text-xl mb-1">
          {formatCurrency(price)}
        </h3>
        <p className="text-xs text-gray-400 mb-4">Starting from per person</p>
        
        <Button 
          className="w-full" 
          onClick={() => onBook?.(id)}
        >
          <span>Book Now</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};
