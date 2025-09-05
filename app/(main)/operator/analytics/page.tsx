// app/(main)/operator/analytics/page.tsx

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/core/Card';
import { Button } from '@/components/ui/core/Button';
import { Badge } from '@/components/ui/core/Badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Globe, 
  Target,
  Download,
  Filter,
  RefreshCw,
  PieChart,
  Activity,
  ArrowUpRight,
  Calendar,
  Package,
  Star,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OperatorAnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const [analytics] = useState({
    totalRevenue: 1250000,
    agentNetwork: 156,
    avgCommissionRate: 18.5,
    totalBookings: 847,
    growthRate: 34.2,
    topPerformingAgent: 'Ahmed Hassan',
    marketReach: 23,
    customerSatisfaction: 4.8,
    packageCount: 45,
    conversionRate: 24.7
  });

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      change: '+34.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-100',
      description: 'This quarter'
    },
    {
      title: 'Agent Network',
      value: analytics.agentNetwork,
      change: '+23',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600 bg-blue-100',
      description: 'Active partners'
    },
    {
      title: 'Total Bookings',
      value: analytics.totalBookings,
      change: '+187',
      trend: 'up',
      icon: Target,
      color: 'text-purple-600 bg-purple-100',
      description: 'This quarter'
    },
    {
      title: 'Market Reach',
      value: `${analytics.marketReach} countries`,
      change: '+4',
      trend: 'up',
      icon: Globe,
      color: 'text-indigo-600 bg-indigo-100',
      description: 'Global presence'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.conversionRate}%`,
      change: '+3.1%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100',
      description: 'Lead to booking'
    },
    {
      title: 'Customer Rating',
      value: `${analytics.customerSatisfaction}/5`,
      change: '+0.2',
      trend: 'up',
      icon: Star,
      color: 'text-yellow-600 bg-yellow-100',
      description: 'Average rating'
    }
  ];

  const regionData = [
    { region: 'Europe', agents: 67, revenue: 485000, bookings: 324, growth: '+28%' },
    { region: 'North America', agents: 34, revenue: 285000, bookings: 198, growth: '+31%' },
    { region: 'Asia Pacific', agents: 28, revenue: 245000, bookings: 167, growth: '+42%' },
    { region: 'Middle East', agents: 19, revenue: 165000, bookings: 112, growth: '+38%' },
    { region: 'Latin America', agents: 8, revenue: 70000, bookings: 46, growth: '+15%' }
  ];

  const topPackages = [
    { name: 'Golden Triangle Classic', bookings: 89, revenue: 267000, rating: 4.9 },
    { name: 'Kerala Backwaters', bookings: 67, revenue: 201000, rating: 4.8 },
    { name: 'Rajasthan Heritage', bookings: 54, revenue: 189000, rating: 4.7 },
    { name: 'Himalayan Adventure', bookings: 43, revenue: 172000, rating: 4.8 },
    { name: 'South India Temple Tour', bookings: 38, revenue: 114000, rating: 4.6 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📊 Business Analytics</h1>
            <p className="text-slate-300 text-lg">
              Comprehensive insights into your operation performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-4xl font-bold">{analytics.growthRate}%</div>
              <p className="text-slate-300">Growth Rate</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-white border-white/20 hover:bg-white/10">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="ghost" size="sm" className="text-white border-white/20 hover:bg-white/10">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Timeframe:</span>
          </div>
          <div className="flex gap-2">
            {[
              { key: 'week', label: 'This Week' },
              { key: 'month', label: 'This Month' },
              { key: 'quarter', label: 'This Quarter' },
              { key: 'year', label: 'This Year' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setTimeframe(option.key as any)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  timeframe === option.key 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={cn('p-3 rounded-xl', kpi.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                {kpi.trend && (
                  <Badge 
                    className={cn('text-xs', 
                      kpi.trend === 'up' ? 'bg-green-100 text-green-700' : 
                      kpi.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {kpi.change}
                  </Badge>
                )}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{kpi.value}</div>
              <div className="text-sm font-medium text-gray-700 mb-1">{kpi.title}</div>
              <div className="text-xs text-gray-500">{kpi.description}</div>
            </Card>
          );
        })}
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Regional Performance */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Regional Performance</h3>
              <p className="text-sm text-gray-600">Revenue and growth by region</p>
            </div>
            <Button variant="ghost" size="sm" icon={<ArrowUpRight className="h-4 w-4" />}>
              View Details
            </Button>
          </div>
          
          <div className="space-y-4">
            {regionData.map((region, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {region.region.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{region.region}</h4>
                    <p className="text-sm text-gray-600">{region.agents} agents • {region.bookings} bookings</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${region.revenue.toLocaleString()}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">{region.growth}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Performing Packages */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Packages</h3>
              <p className="text-sm text-gray-600">Most popular packages by revenue</p>
            </div>
            <Button variant="ghost" size="sm" icon={<Package className="h-4 w-4" />}>
              Manage Packages
            </Button>
          </div>

          <div className="space-y-4">
            {topPackages.map((pkg, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{pkg.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{pkg.bookings} bookings</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{pkg.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">${pkg.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">${Math.round(pkg.revenue / pkg.bookings)} avg</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Revenue Trends Chart Placeholder */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
            <p className="text-sm text-gray-600">Monthly revenue and booking patterns</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" icon={<Filter className="h-4 w-4" />}>
              Filter
            </Button>
            <Button variant="ghost" size="sm" icon={<Download className="h-4 w-4" />}>
              Export
            </Button>
          </div>
        </div>

        <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <p className="text-blue-600 font-medium text-lg">Interactive Revenue Chart</p>
            <p className="text-sm text-blue-500 mt-2">
              Monthly trends, forecasting, and comparative analysis
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Bookings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Forecast</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8 text-emerald-600" />
            <div>
              <h4 className="font-semibold text-emerald-800">AI Insight</h4>
              <p className="text-sm text-emerald-700">Peak booking season is approaching. Consider launching targeted campaigns.</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-800">Growth Opportunity</h4>
              <p className="text-sm text-blue-700">Southeast Asia market shows 67% untapped potential for expansion.</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center gap-3">
            <Star className="h-8 w-8 text-purple-600" />
            <div>
              <h4 className="font-semibold text-purple-800">Performance</h4>
              <p className="text-sm text-purple-700">Customer satisfaction up 12% this quarter. Top-rated in luxury travel.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}