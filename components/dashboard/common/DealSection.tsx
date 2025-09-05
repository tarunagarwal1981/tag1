// File: components/dashboard/common/DealSection.tsx
'use client';

import { DealCard } from '@/components/dashboard/common/DealCard';
import { ArrowRight, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/core/Button';
import { useState } from 'react';
import { cn, formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/core/Badge';

interface Deal {
  id: number;
  from: string;
  to: string;
  price: number;
  imageUrl: string;
  airlineLogoUrl?: string;
  tag?: string;
  duration?: string;
  rating?: number;
}

interface DealSectionProps {
  title: string;
  deals: Deal[];
  showFilters?: boolean;
  onDealBook?: (dealId: number) => void;
}

export const DealSection = ({ 
  title, 
  deals, 
  showFilters = false, 
  onDealBook 
}: DealSectionProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'popularity'>('popularity');

  const sortedDeals = [...deals].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price - b.price;
      case 'rating':
        return (b.rating ?? 0) - (a.rating ?? 0);
      default:
        return b.id - a.id; // newest first
    }
  });

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600">{deals.length} packages available</p>
        </div>
        
        <div className="flex items-center gap-3">
          {showFilters && (
            <>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'rating' | 'popularity')}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1"
              >
                <option value="popularity">Most Popular</option>
                <option value="price">Price: Low to High</option>
                <option value="rating">Highest Rated</option>
              </select>
              
              <div className="flex items-center border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-1 rounded',
                    viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                  )}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-1 rounded',
                    viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
          
          <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
            <span>View All</span>
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Deals Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {sortedDeals.map((deal) => (
            <DealCard key={deal.id} {...deal} onBook={onDealBook} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {sortedDeals.map((deal) => (
            <div key={deal.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <img
                  src={deal.imageUrl}
                  alt={`${deal.from} to ${deal.to}`}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{deal.from} → {deal.to}</h4>
                  <p className="text-sm text-gray-600">{deal.duration}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {deal.tag && <Badge variant="secondary" size="sm">{deal.tag}</Badge>}
                    <span className="text-xs text-gray-500">⭐ {deal.rating}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">{formatCurrency(deal.price)}</div>
                  <Button size="sm" onClick={() => onDealBook?.(deal.id)}>
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};