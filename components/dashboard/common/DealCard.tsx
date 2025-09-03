// components/dashboard/common/DealCard.tsx
import { ArrowRight, PlaneTakeoff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface DealCardProps {
  from: string;
  to: string;
  price: number;
  imageUrl: string;
  airlineLogoUrl: string;
  tag?: string;
}

export const DealCard = ({
  from,
  to,
  price,
  imageUrl,
  airlineLogoUrl,
  tag,
}: DealCardProps) => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden group border border-gray-200 hover:border-blue-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="relative">
      <img
        src={imageUrl}
        alt={`Flight from ${from} to ${to}`}
        className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      {tag && (
        <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          {tag}
        </div>
      )}
      <img
        src={airlineLogoUrl}
        alt="Airline"
        className="h-10 w-10 rounded-full border-2 border-white absolute -bottom-5 right-4 shadow-md bg-white object-cover"
      />
    </div>
    <div className="p-4">
      <p className="text-xs text-gray-500 mb-1">
        {from} → {to}
      </p>
      <h3 className="font-bold text-gray-800 text-xl mb-1">
        €{price.toLocaleString()}
      </h3>
      <p className="text-xs text-gray-400 mb-4">Round trip per person</p>
      <Button className="w-full">View Details</Button>
    </div>
  </div>
);
