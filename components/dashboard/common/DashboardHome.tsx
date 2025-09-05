// File: components/dashboard/common/DashboardHome.tsx
'use client';

import { useState, useEffect } from 'react';
import { SearchWidget } from '@/components/dashboard/common/SearchWidget';
import { DealSection } from '@/components/dashboard/common/DealSection';
import { Card } from '@/components/ui/core/Card';
import { Badge } from '@/components/ui/core/Badge';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Zap, 
  Target,
  Globe,
  MessageSquare,
  BarChart3,
  Search,
  History,
  Plane,
  Building,
  MapPin,
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/core/Button'; // Assuming Button is a core UI component

interface DashboardHomeProps {
  userRole: 'agent' | 'operator';
}

interface Deal {
  id: number;
  from: string;
  to: string;
  price: number;
  imageUrl: string;
  airlineLogoUrl: string;
  tag?: string;
  duration: string;
  rating: number;
}

interface DashboardStats {
  totalLeads: number;
  activeBookings: number;
  monthlyRevenue: number;
  conversionRate: number;
  avgDealValue: number;
  pendingTasks: number;
}

interface Activity {
  type: string;
  message: string;
  time: string;
  icon: any;
  color: string;
}

export const DashboardHome = ({ userRole }: DashboardHomeProps) => {
  const [dealsData, setDealsData] = useState<{
    'Fixed Departure': Deal[];
    'Top Air Fares': Deal[];
    'Series Fares': Deal[];
    'Group Fares': Deal[];
  }>({
    'Fixed Departure': [],
    'Top Air Fares': [],
    'Series Fares': [],
    'Group Fares': []
  });

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalLeads: 0,
    activeBookings: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    avgDealValue: 0,
    pendingTasks: 0
  });

  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  // Load sample data
  useEffect(() => {
    const sampleDeals: Deal[] = [
      {
        id: 1,
        from: 'London',
        to: 'Paris',
        price: 299,
        imageUrl: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop',
        airlineLogoUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=50&h=50&fit=crop',
        tag: 'Hot Deal',
        duration: '3 days',
        rating: 4.8
      },
      {
        id: 2,
        from: 'New York',
        to: 'Tokyo',
        price: 899,
        imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop',
        airlineLogoUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=50&h=50&fit=crop',
        duration: '7 days',
        rating: 4.6
      },
      {
        id: 3,
        from: 'Mumbai',
        to: 'Dubai',
        price: 450,
        imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=200&fit=crop',
        airlineLogoUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=50&h=50&fit=crop',
        tag: 'Best Value',
        duration: '5 days',
        rating: 4.7
      }
    ];

    setDealsData({
      'Fixed Departure': sampleDeals,
      'Top Air Fares': sampleDeals.slice(1),
      'Series Fares': sampleDeals.slice(0, 2),
      'Group Fares': sampleDeals.slice(1, 3)
    });

    setDashboardStats({
      totalLeads: userRole === 'agent' ? 24 : 156,
      activeBookings: userRole === 'agent' ? 8 : 47,
      monthlyRevenue: userRole === 'agent' ? 12500 : 89000,
      conversionRate: userRole === 'agent' ? 32 : 28,
      avgDealValue: userRole === 'agent' ? 1200 : 1800,
      pendingTasks: userRole === 'agent' ? 5 : 12
    });

    setRecentSearches(['Europe Tours', 'New York Flights', 'Group Travel']);
  }, [userRole]);

  const handleDealBook = (dealId: number) => {
    console.log('Booking deal:', dealId);
  };

  const handleSearch = (searchQuery: string) => {
    setIsSearching(true);
    setQuery(searchQuery);
    setIsExpanded(true);

    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          type: 'package',
          title: 'All-inclusive European Tour',
          description: 'Explore the best of Europe with this 14-day package.',
          location: 'Europe',
          price: 2500,
          rating: 4.9,
        },
        {
          id: 2,
          type: 'lead',
          title: 'Lead: Family Trip to Disney World',
          description: 'A family of 4 looking for a 7-day trip to Orlando.',
          location: 'Orlando, USA',
        },
        {
          id: 3,
          type: 'agent',
          title: 'Agent Profile: Sarah J.',
          description: 'Specializes in luxury and honeymoon travel.',
          location: 'Los Angeles, USA',
        },
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const recentActivities: Activity[] = [
    {
      type: 'booking',
      message: 'New booking confirmed for Tokyo package',
      time: '2 minutes ago',
      icon: Calendar,
      color: 'text-green-600 bg-green-100'
    },
    {
      type: 'lead',
      message: 'High-value lead generated via AI',
      time: '15 minutes ago',
      icon: Target,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      type: 'commission',
      message: 'Commission payment of $245 processed',
      time: '1 hour ago',
      icon: DollarSign,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {userRole === 'agent' ? 'Agent' : 'Operator'}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              {userRole === 'agent' 
                ? 'Ready to turn leads into amazing journeys?'
                : 'Manage your network and grow your business'
              }
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">${dashboardStats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-blue-100">This month's revenue</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <Badge variant="success" size="sm">+12%</Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {dashboardStats.totalLeads}
          </div>
          <div className="text-sm text-gray-600">Active Leads</div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <Badge variant="info" size="sm">Live</Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {dashboardStats.activeBookings}
          </div>
          <div className="text-sm text-gray-600">Active Bookings</div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <Badge variant="warning" size="sm">{dashboardStats.conversionRate}%</Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(dashboardStats.avgDealValue)}
          </div>
          <div className="text-sm text-gray-600">Avg Deal Value</div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-amber-600" />
            </div>
            {dashboardStats.pendingTasks > 0 && (
              <Badge variant="destructive" size="sm">{dashboardStats.pendingTasks}</Badge>
            )}
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {dashboardStats.pendingTasks}
          </div>
          <div className="text-sm text-gray-600">Pending Tasks</div>
        </Card>
      </div>

      {/* Search Widget */}
      <SearchWidget onSearch={handleSearch} onFocus={() => setIsExpanded(true)} onBlur={() => setIsExpanded(false)} />

      {/* Search Results */}
      {isExpanded && (query || searchResults.length > 0) && (
        <Card className="mt-4 p-6 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-600">AI is searching for the best results...</p>
              </div>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Search Results</h3>
                <Badge variant="success">{searchResults.length} results</Badge>
              </div>
              
              {searchResults.map((result: any) => (
                <div
                  key={result.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className={cn(
                    'p-3 rounded-lg',
                    result.type === 'package' ? 'bg-blue-100' :
                    result.type === 'lead' ? 'bg-green-100' :
                    'bg-purple-100'
                  )}>
                    {result.type === 'package' && <Plane className="h-5 w-5 text-blue-600" />}
                    {result.type === 'lead' && <Users className="h-5 w-5 text-green-600" />}
                    {result.type === 'agent' && <Building className="h-5 w-5 text-purple-600" />}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{result.title}</h4>
                    <p className="text-sm text-gray-600">{result.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {result.location}
                      </span>
                      {result.price && (
                        <span className="text-sm font-semibold text-green-600">
                          ${result.price}
                        </span>
                      )}
                      {result.rating && (
                        <span className="text-xs text-gray-500">⭐ {result.rating}</span>
                      )}
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No results found for "{query}"</p>
              <p className="text-sm text-gray-500 mt-2">Try different keywords or browse our suggestions</p>
            </div>
          )}
          
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <History className="h-4 w-4" />
                Recent Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(search)}
                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl text-white group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Lead Generator</h3>
              <p className="text-sm text-gray-600">Generate qualified leads automatically</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-xl text-white group-hover:scale-110 transition-transform">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Performance Analytics</h3>
              <p className="text-sm text-gray-600">Track your success metrics</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 rounded-xl text-white group-hover:scale-110 transition-transform">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Global Network</h3>
              <p className="text-sm text-gray-600">Connect with partners worldwide</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Deal Sections */}
      <div className="space-y-8">
        <DealSection
          title="🔥 Hot Fixed Departures"
          deals={dealsData['Fixed Departure']}
          showFilters={showFilters}
          onDealBook={handleDealBook}
        />
        <DealSection 
          title="✈️ Top Air Fares" 
          deals={dealsData['Top Air Fares']}
          onDealBook={handleDealBook}
        />
        <DealSection 
          title="🎫 Series Packages" 
          deals={dealsData['Series Fares']}
          onDealBook={handleDealBook}
        />
        <DealSection 
          title="👥 Group Deals" 
          deals={dealsData['Group Fares']}
          onDealBook={handleDealBook}
        />
      </div>

      {/* Recent Activity Feed */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={cn('p-2 rounded-lg', activity.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};