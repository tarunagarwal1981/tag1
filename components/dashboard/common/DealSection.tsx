// components/dashboard/common/DealSection.tsx
import { DealCard } from '@/components/dashboard/common/DealCard';
import { ArrowRight } from 'lucide-react';

interface Deal {
  id: number;
  from: string;
  to: string;
  price: number;
  imageUrl: string;
  airlineLogoUrl: string;
  tag?: string;
}

interface DealSectionProps {
  title: string;
  deals: Deal[];
}

export const DealSection = ({ title, deals }: DealSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center text-blue-600 font-semibold cursor-pointer hover:underline transition-colors">
          <span>View All</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
        {deals.map((deal) => (
          <DealCard key={deal.id} {...deal} />
        ))}
      </div>
    </div>
  );
};
