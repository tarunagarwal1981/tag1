// File: app/(main)/agent/my-itineraries/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TourPackageManager } from '@/components/dashboard/operator/TourPackageManager';
import { Card } from '@/components/ui/core/Card';
import { Button } from '@/components/ui/core/Button';
import { Badge } from '@/components/ui/core/Badge';
import { 
  Package, 
  Plus, 
  TrendingUp, 
  Users, 
  DollarSign,
  Star,
  Eye,
  Share2,
  BarChart3,
  Calendar,
  Target,
  Globe,
  Award,
  Clock,
  ArrowUpRight,
  Sparkles,
  Zap,
  Heart,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AgentMyItinerariesPage() {
  const router = useRouter();
  
  // Agent-specific package stats
  const [packageStats, setPackageStats] = useState({
    totalPackages: 15,
    activePackages: 12,
    draftPackages: 3,
    totalBookings: 68,
    totalRevenue: 145000,
    monthlyRevenue: 18500,
    avgRating: 4.8,
    conversionRate: 28,
    repeatClients: 35,
    avgPackageValue: 2132,
    topCategory: 'Luxury',
    thisMonthBookings: 12
  });

  // Performance metrics for current month
  const [performanceMetrics, setPerformanceMetrics] = useState({
    viewsThisMonth: 1247,
    inquiriesThisMonth: 89,
    bookingsThisMonth: 12,
    revenueGrowth: 23.5,
    clientSatisfaction: 4.8,
    packageViews: 847,
    shareCount: 45
  });

  // Recent activity data
  const [recentActivity] = useState([
    {
      id: 1,
      type: 'booking',
      title: 'New booking: Bali Romance Package',
      client: 'Sarah & Mike Johnson',
      amount: 3200,
      time: '2 hours ago',
      status: 'confirmed'
    },
    {
      id: 2,
      type: 'inquiry',
      title: 'Package inquiry: European Grand Tour',
      client: 'Martinez Family',
      amount: 8500,
      time: '5 hours ago',
      status: 'pending'
    },
    {
      id: 3,
      type: 'review',
      title: 'New 5-star review received',
      client: 'David Chen',
      amount: 0,
      time: '1 day ago',
      status: 'completed'
    },
    {
      id: 4,
      type: 'share',
      title: 'Package shared on social media',
      client: 'Instagram Campaign',
      amount: 0,
      time: '2 days ago',
      status: 'active'
    }
  ]);

  const handleCreatePackage = () => {
    router.push('/agent/my-itineraries/create');
  };

  const handleViewAnalytics = () => {
    router.push('/agent/analytics?tab=packages');
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'booking': return <Calendar className="h-4 w-4 text-green-600" />;
      case 'inquiry': return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'review': return <Star className="h-4 w-4 text-yellow-600" />;
      case 'share': return <Share2 className="h-4 w-4 text-purple-600" />;
      default: return <Package className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'booking': return 'bg-green-50 border-green-200';
      case 'inquiry': return 'bg-blue-50 border-blue-200';
      case 'review': return 'bg-yellow-50 border-yellow-200';
      case 'share': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                  <Package className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">My Travel Packages</h1>
                  <p className="text-xl text-purple-100">
                    Create, manage, and sell amazing travel experiences
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold">{packageStats.totalPackages}</div>
                  <div className="text-purple-100 text-sm">Total Packages</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold">{packageStats.totalBookings}</div>
                  <div className="text-purple-100 text-sm">Bookings</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold">${(packageStats.totalRevenue / 1000).toFixed(0)}k</div>
                  <div className="text-purple-100 text-sm">Revenue</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold">{packageStats.avgRating}</div>
                  <div className="text-purple-100 text-sm">Avg Rating</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button 
                variant="secondary" 
                onClick={handleCreatePackage}
                className="bg-white text-purple-600 hover:bg-purple-50 border-0 shadow-lg"
                icon={<Plus className="h-5 w-5" />}
              >
                Create New Package
              </Button>
              <Button 
                variant="outline" 
                onClick={handleViewAnalytics}
                className="border-white/30 text-white hover:bg-white/10"
                icon={<BarChart3 className="h-5 w-5" />}
              >
                View Analytics
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <Sparkles className="h-24 w-24" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-10">
          <Globe className="h-32 w-32" />
        </div>
      </div>

      {/* Performance Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {[
          { 
            title: 'Active Packages', 
            value: packageStats.activePackages, 
            change: '+2 this month', 
            trend: 'up',
            icon: Eye, 
            color: 'bg-blue-100 text-blue-600',
            description: 'Live & bookable'
          },
          { 
            title: 'This Month Revenue', 
            value: `$${(packageStats.monthlyRevenue / 1000).toFixed(1)}k`, 
            change: `+${performanceMetrics.revenueGrowth}%`, 
            trend: 'up',
            icon: DollarSign, 
            color: 'bg-emerald-100 text-emerald-600',
            description: 'Monthly earnings'
          },
          { 
            title: 'Package Views', 
            value: performanceMetrics.packageViews, 
            change: '+18% this week', 
            trend: 'up',
            icon: TrendingUp, 
            color: 'bg-purple-100 text-purple-600',
            description: 'Total visibility'
          },
          { 
            title: 'Conversion Rate', 
            value: `${packageStats.conversionRate}%`, 
            change: '+3.2%', 
            trend: 'up',
            icon: Target, 
            color: 'bg-green-100 text-green-600',
            description: 'Views to bookings'
          },
          { 
            title: 'Client Rating', 
            value: packageStats.avgRating, 
            change: 'Excellent', 
            trend: 'neutral',
            icon: Star, 
            color: 'bg-yellow-100 text-yellow-600',
            description: 'Average satisfaction'
          },
          { 
            title: 'Repeat Clients', 
            value: `${packageStats.repeatClients}%`, 
            change: '+8% growth', 
            trend: 'up',
            icon: Heart, 
            color: 'bg-pink-100 text-pink-600',
            description: 'Customer loyalty'
          }
        ].map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className={cn('p-3 rounded-xl group-hover:scale-110 transition-transform', metric.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                {metric.trend !== 'neutral' && (
                  <Badge 
                    variant={metric.trend === 'up' ? 'success' : 'destructive'} 
                    size="sm"
                    className="shadow-sm"
                  >
                    {metric.change}
                  </Badge>
                )}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
              <div className="text-sm font-medium text-gray-700 mb-1">{metric.title}</div>
              <div className="text-xs text-gray-500">{metric.description}</div>
              {metric.trend === 'neutral' && (
                <div className="text-xs text-gray-500 mt-1">{metric.change}</div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card className="p-6 lg:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4 hover:shadow-md transition-all"
              onClick={handleCreatePackage}
            >
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Create Package</div>
                  <div className="text-sm text-gray-600">Build new travel experience</div>
                </div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Share2 className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Share Package</div>
                  <div className="text-sm text-gray-600">Send to clients & social media</div>
                </div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4 hover:shadow-md transition-all"
              onClick={handleViewAnalytics}
            >
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">View Analytics</div>
                  <div className="text-sm text-gray-600">Performance insights</div>
                </div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Award className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">Promote Package</div>
                  <div className="text-sm text-gray-600">Boost visibility & bookings</div>
                </div>
              </div>
            </Button>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <Button variant="ghost" size="sm" icon={<ArrowUpRight className="h-4 w-4" />}>
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id} 
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer',
                  getActivityColor(activity.type)
                )}
              >
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{activity.title}</h4>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-600">{activity.client}</span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  {activity.amount > 0 && (
                    <div className="font-semibold text-green-600">
                      +${activity.amount.toLocaleString()}
                    </div>
                  )}
                  <Badge 
                    variant={
                      activity.status === 'confirmed' ? 'success' :
                      activity.status === 'pending' ? 'warning' :
                      activity.status === 'completed' ? 'info' : 'default'
                    } 
                    size="sm"
                  >
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Agent Context Information */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-4 rounded-xl">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-blue-900 mb-3">Agent Package Management (B2C)</h3>
            <p className="text-blue-700 mb-4 text-lg">
              Create and manage travel packages for your direct clients. These packages are designed for 
              <strong> Business-to-Consumer (B2C)</strong> sales, where you sell directly to individual travelers, 
              families, groups, and corporate clients.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white/60 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-blue-900">Direct Client Sales</span>
                </div>
                <p className="text-sm text-blue-700">Sell packages directly to end customers without intermediaries</p>
              </div>
              
              <div className="bg-white/60 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-blue-900">Full Pricing Control</span>
                </div>
                <p className="text-sm text-blue-700">Set your own markup and pricing strategy for maximum profit</p>
              </div>
              
              <div className="bg-white/60 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-blue-900">100% Commission</span>
                </div>
                <p className="text-sm text-blue-700">Keep all profits from your package sales - no revenue sharing</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="info" className="px-3 py-1">Individual Travelers</Badge>
              <Badge variant="info" className="px-3 py-1">Family Vacations</Badge>
              <Badge variant="info" className="px-3 py-1">Group Tours</Badge>
              <Badge variant="info" className="px-3 py-1">Corporate Travel</Badge>
              <Badge variant="info" className="px-3 py-1">Honeymoons</Badge>
              <Badge variant="info" className="px-3 py-1">Adventure Tours</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Main Package Management Component */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Package Manager</h2>
              <p className="text-gray-600">Create, edit, and manage your travel packages</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1">
                {packageStats.activePackages} Active
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                {packageStats.draftPackages} Drafts
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {/* Pass userRole prop to reuse existing TourPackageManager */}
          <TourPackageManager userRole="agent" />
        </div>
      </div>
    </div>
  );
}