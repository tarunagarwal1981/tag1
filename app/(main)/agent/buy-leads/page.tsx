// ===================================
// AGENT MARKETPLACE & PACKAGE PAGES
// ===================================

// File: app/(main)/agent/buy-leads/page.tsx (Lead Marketplace)
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/core/Card';
import { Button } from '@/components/ui/core/Button';
import { Badge } from '@/components/ui/core/Badge';
import { Input } from '@/components/ui/core/Input';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Users, 
  DollarSign,
  Calendar,
  Target,
  TrendingUp,
  Eye,
  Plus,
  ShoppingBag,
  Zap,
  Globe,
  Award,
  Check,
  Clock,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketplaceLead {
  id: string;
  title: string;
  destination: string;
  clientType: 'individual' | 'family' | 'group' | 'corporate';
  groupSize: number;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  travelDates: {
    start: string;
    end: string;
    flexibility: 'fixed' | 'flexible';
  };
  requirements: string[];
  leadScore: number;
  conversionRate: number;
  price: number;
  source: 'website' | 'social_media' | 'referral' | 'ai_generated';
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  competition: number; // number of agents viewing
  description: string;
  clientProfile: {
    previousBookings: number;
    averageSpend: number;
    responseRate: number;
    satisfaction: number;
  };
  sellerRating: number;
  timeLeft: string; // time until lead expires
  tags: string[];
  isVerified: boolean;
  isPremium: boolean;
  createdAt: string;
}

export default function LeadMarketplacePage() {
  const [leads, setLeads] = useState<MarketplaceLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<MarketplaceLead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'premium' | 'verified' | 'urgent' | 'budget'>('all');
  const [sortBy, setSortBy] = useState<'score' | 'price' | 'budget' | 'urgency' | 'newest'>('score');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [cartTotal, setCartTotal] = useState(0);

  // Mock marketplace data
  useEffect(() => {
    const mockLeads: MarketplaceLead[] = [
      {
        id: 'ML001',
        title: 'Luxury European Honeymoon Package',
        destination: 'Paris, Rome, Venice',
        clientType: 'individual',
        groupSize: 2,
        budget: { min: 8000, max: 12000, currency: 'USD' },
        travelDates: { start: '2025-06-15', end: '2025-06-29', flexibility: 'flexible' },
        requirements: ['5-star hotels', 'romantic dinners', 'private tours', 'luxury transport'],
        leadScore: 95,
        conversionRate: 85,
        price: 299,
        source: 'website',
        urgency: 'high',
        competition: 3,
        description: 'Recently engaged couple planning dream honeymoon. Budget confirmed, dates flexible. Looking for ultra-luxury experience.',
        clientProfile: { previousBookings: 0, averageSpend: 0, responseRate: 95, satisfaction: 0 },
        sellerRating: 4.9,
        timeLeft: '2 hours',
        tags: ['honeymoon', 'luxury', 'europe', 'high-budget'],
        isVerified: true,
        isPremium: true,
        createdAt: '2025-09-05T10:00:00Z'
      },
      {
        id: 'ML002',
        title: 'Family Adventure Trip to Southeast Asia',
        destination: 'Thailand, Vietnam, Cambodia',
        clientType: 'family',
        groupSize: 5,
        budget: { min: 6000, max: 8500, currency: 'USD' },
        travelDates: { start: '2025-07-20', end: '2025-08-05', flexibility: 'fixed' },
        requirements: ['family-friendly activities', 'cultural experiences', 'safe accommodations'],
        leadScore: 88,
        conversionRate: 78,
        price: 199,
        source: 'referral',
        urgency: 'medium',
        competition: 7,
        description: 'Family with 3 children (ages 8, 12, 15) looking for educational and adventure trip.',
        clientProfile: { previousBookings: 2, averageSpend: 5500, responseRate: 89, satisfaction: 4.8 },
        sellerRating: 4.7,
        timeLeft: '1 day',
        tags: ['family', 'adventure', 'southeast-asia', 'educational'],
        isVerified: true,
        isPremium: false,
        createdAt: '2025-09-04T14:30:00Z'
      },
      {
        id: 'ML003',
        title: 'Corporate Team Building Retreat',
        destination: 'Bali, Indonesia',
        clientType: 'corporate',
        groupSize: 25,
        budget: { min: 15000, max: 25000, currency: 'USD' },
        travelDates: { start: '2025-10-15', end: '2025-10-20', flexibility: 'flexible' },
        requirements: ['conference facilities', 'team activities', 'luxury accommodation', 'catering'],
        leadScore: 92,
        conversionRate: 82,
        price: 399,
        source: 'ai_generated',
        urgency: 'urgent',
        competition: 2,
        description: 'Tech startup planning annual retreat. Need full-service planning including activities and venues.',
        clientProfile: { previousBookings: 1, averageSpend: 18000, responseRate: 92, satisfaction: 4.9 },
        sellerRating: 4.8,
        timeLeft: '4 hours',
        tags: ['corporate', 'retreat', 'luxury', 'team-building'],
        isVerified: true,
        isPremium: true,
        createdAt: '2025-09-05T08:15:00Z'
      },
      {
        id: 'ML004',
        title: 'Solo Adventure Travel - New Zealand',
        destination: 'Auckland, Queenstown, Milford Sound',
        clientType: 'individual',
        groupSize: 1,
        budget: { min: 3500, max: 5000, currency: 'USD' },
        travelDates: { start: '2025-11-01', end: '2025-11-21', flexibility: 'flexible' },
        requirements: ['adventure activities', 'solo-friendly', 'photography tours', 'hiking'],
        leadScore: 75,
        conversionRate: 65,
        price: 149,
        source: 'social_media',
        urgency: 'low',
        competition: 12,
        description: 'Photography enthusiast planning solo adventure. Experienced traveler, very specific requirements.',
        clientProfile: { previousBookings: 5, averageSpend: 4200, responseRate: 78, satisfaction: 4.3 },
        sellerRating: 4.5,
        timeLeft: '3 days',
        tags: ['solo', 'adventure', 'photography', 'new-zealand'],
        isVerified: false,
        isPremium: false,
        createdAt: '2025-09-03T16:45:00Z'
      },
      {
        id: 'ML005',
        title: 'Budget Backpacking Europe - Students',
        destination: 'Amsterdam, Berlin, Prague, Budapest',
        clientType: 'group',
        groupSize: 8,
        budget: { min: 1200, max: 2000, currency: 'USD' },
        travelDates: { start: '2025-08-10', end: '2025-08-25', flexibility: 'fixed' },
        requirements: ['hostels', 'budget meals', 'public transport', 'student discounts'],
        leadScore: 82,
        conversionRate: 71,
        price: 89,
        source: 'website',
        urgency: 'medium',
        competition: 15,
        description: 'University students planning graduation trip. Limited budget but high energy and enthusiasm.',
        clientProfile: { previousBookings: 0, averageSpend: 0, responseRate: 85, satisfaction: 0 },
        sellerRating: 4.2,
        timeLeft: '2 days',
        tags: ['budget', 'students', 'backpacking', 'europe'],
        isVerified: true,
        isPremium: false,
        createdAt: '2025-09-04T11:20:00Z'
      }
    ];
    
    setLeads(mockLeads);
    setFilteredLeads(mockLeads);
  }, []);

  // Filter and sort logic
  useEffect(() => {
    let filtered = leads.filter(lead => {
      const matchesSearch = searchQuery === '' || 
        lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFilter = selectedFilter === 'all' ||
        (selectedFilter === 'premium' && lead.isPremium) ||
        (selectedFilter === 'verified' && lead.isVerified) ||
        (selectedFilter === 'urgent' && lead.urgency === 'urgent') ||
        (selectedFilter === 'budget' && lead.budget.max <= 3000);

      return matchesSearch && matchesFilter;
    });

    // Sort logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score': return b.leadScore - a.leadScore;
        case 'price': return a.price - b.price;
        case 'budget': return b.budget.max - a.budget.max;
        case 'urgency': 
          const urgencyOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default: return 0;
      }
    });

    setFilteredLeads(filtered);
  }, [leads, searchQuery, selectedFilter, sortBy]);

  // Cart management
  useEffect(() => {
    const total = selectedLeads.reduce((sum, leadId) => {
      const lead = leads.find(l => l.id === leadId);
      return sum + (lead?.price || 0);
    }, 0);
    setCartTotal(total);
  }, [selectedLeads, leads]);

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handlePurchaseLeads = () => {
    if (selectedLeads.length === 0) {
      alert('Please select leads to purchase');
      return;
    }
    
    const confirmation = confirm(
      `Purchase ${selectedLeads.length} leads for $${cartTotal}?\n\nThis will give you exclusive access to contact these potential clients.`
    );
    
    if (confirmation) {
      // In real app, this would process payment and transfer leads
      alert(`Successfully purchased ${selectedLeads.length} leads! They will appear in your Lead Management dashboard.`);
      setSelectedLeads([]);
    }
  };

  const stats = {
    availableLeads: filteredLeads.length,
    avgScore: filteredLeads.length > 0 ? Math.round(filteredLeads.reduce((sum, l) => sum + l.leadScore, 0) / filteredLeads.length) : 0,
    avgBudget: filteredLeads.length > 0 ? Math.round(filteredLeads.reduce((sum, l) => sum + l.budget.max, 0) / filteredLeads.length) : 0,
    premiumLeads: filteredLeads.filter(l => l.isPremium).length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🛒 Lead Marketplace</h1>
            <p className="text-emerald-100 text-lg">
              Purchase qualified leads from verified sources worldwide
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{stats.avgScore}</div>
            <p className="text-emerald-100">Avg Lead Score</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: 'Available Leads', value: stats.availableLeads, icon: Target, color: 'bg-blue-100 text-blue-600', change: '+12 today' },
          { title: 'Premium Leads', value: stats.premiumLeads, icon: Award, color: 'bg-purple-100 text-purple-600', change: 'High quality' },
          { title: 'Avg Budget', value: `$${stats.avgBudget.toLocaleString()}`, icon: DollarSign, color: 'bg-green-100 text-green-600', change: '+15% this week' },
          { title: 'Cart Total', value: `$${cartTotal}`, icon: ShoppingCart, color: 'bg-amber-100 text-amber-600', change: `${selectedLeads.length} leads` }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={cn('p-3 rounded-lg', stat.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                <Badge variant="info" size="sm">{stat.change}</Badge>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.title}</div>
            </Card>
          );
        })}
      </div>

      {/* Filters & Controls */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Input
                placeholder="Search leads by destination, type, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                startIcon={<Search className="h-4 w-4" />}
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Leads</option>
                <option value="premium">Premium Only</option>
                <option value="verified">Verified Only</option>
                <option value="urgent">Urgent</option>
                <option value="budget">Budget (&lt;$3k)</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="score">Best Score</option>
                <option value="price">Lowest Price</option>
                <option value="budget">Highest Budget</option>
                <option value="urgency">Most Urgent</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedLeads.length > 0 && (
              <Button 
                variant="primary" 
                onClick={handlePurchaseLeads}
                icon={<ShoppingBag className="h-4 w-4" />}
              >
                Purchase {selectedLeads.length} Leads (${cartTotal})
              </Button>
            )}
            <Button variant="outline" icon={<Filter className="h-4 w-4" />}>
              Advanced Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Lead Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className={cn(
            'overflow-hidden transition-all duration-200 hover:shadow-xl cursor-pointer',
            selectedLeads.includes(lead.id) ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'
          )}>
            {/* Card Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight">{lead.title}</h3>
                  {lead.isPremium && <Badge variant="warning" size="sm">Premium</Badge>}
                  {lead.isVerified && <Badge variant="success" size="sm">Verified</Badge>}
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{lead.leadScore}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{lead.destination}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{lead.groupSize} {lead.groupSize === 1 ? 'person' : 'people'}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Budget Range</span>
                  <span className="text-lg font-bold text-green-600">
                    ${lead.budget.min.toLocaleString()} - ${lead.budget.max.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Travel Dates</span>
                  <span className="font-medium">
                    {new Date(lead.travelDates.start).toLocaleDateString()} - {new Date(lead.travelDates.end).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-4 line-clamp-3">{lead.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {lead.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" size="sm">{tag}</Badge>
                ))}
                {lead.tags.length > 3 && (
                  <Badge variant="outline" size="sm">+{lead.tags.length - 3} more</Badge>
                )}
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-900">{lead.conversionRate}%</div>
                  <div className="text-xs text-gray-600">Conversion</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{lead.competition}</div>
                  <div className="text-xs text-gray-600">Competing</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{lead.clientProfile.satisfaction || 'New'}</div>
                  <div className="text-xs text-gray-600">Client Rating</div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">${lead.price}</div>
                  <div className="text-xs text-gray-600">Lead price</div>
                </div>
                
                <div className="flex items-center gap-2">
                  {lead.urgency === 'urgent' && (
                    <div className="flex items-center gap-1 text-red-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{lead.timeLeft}</span>
                    </div>
                  )}
                  
                  <Button
                    variant={selectedLeads.includes(lead.id) ? "primary" : "outline"}
                    size="sm"
                    onClick={() => toggleLeadSelection(lead.id)}
                    icon={selectedLeads.includes(lead.id) ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  >
                    {selectedLeads.includes(lead.id) ? 'Selected' : 'Add to Cart'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredLeads.length === 0 && (
        <Card className="p-12 text-center">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No leads found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
          <Button variant="outline" onClick={() => { setSearchQuery(''); setSelectedFilter('all'); }}>
            Clear Filters
          </Button>
        </Card>
      )}

      {/* Floating Cart */}
      {selectedLeads.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="p-4 bg-blue-600 text-white shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                <span className="font-medium">{selectedLeads.length} leads selected</span>
              </div>
              <div className="text-xl font-bold">${cartTotal}</div>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handlePurchaseLeads}
                icon={<ArrowRight className="h-4 w-4" />}
              >
                Purchase Now
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
