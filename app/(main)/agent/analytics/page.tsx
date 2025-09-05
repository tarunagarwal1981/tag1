// File: app/(main)/agent/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/core/Card';
import { Button } from '@/components/ui/core/Button';
import { Badge } from '@/components/ui/core/Badge';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Users,
  Clock,
  Download,
  Filter,
  RefreshCw,
  Eye,
  ArrowUpRight,
  PieChart,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(false);

  const [analytics] = useState({
    totalLeads: 156,
    convertedLeads: 48,
    conversionRate: 30.8,
    totalRevenue: 89500,
    averageDealValue: 1864,
    responseTime: 2.4,
    customerSatisfaction: 4.8,
    monthlyGrowth: 23.5
  });

  const [chartData] = useState([
    { month: 'Jan', leads: 45, bookings: 12, revenue: 15000 },
    { month: 'Feb', leads: 52, bookings: 18, revenue: 24000 },
    { month: 'Mar', leads: 38, bookings: 14, revenue: 18500 },
    { month: 'Apr', leads: 65, bookings: 22, revenue: 32000 },
    { month: 'May', leads: 71, bookings: 28, revenue: 45000 },
    { month: 'Jun', leads: 59, bookings: 19, revenue: 28000 }
  ]);

  const kpiCards = [
    {
      title: 'Total Leads',
      value: analytics.totalLeads,
      change: '+12%',
      trend: 'up' as const,
      icon: Target,
      color: 'text-blue-600 bg-blue-100',
      description: 'This month'
    },
    {
      title: 'Conversion Rate',
      value: `${analytics.conversionRate}%`,
      change: '+8.3%',
      trend: 'up' as const,
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100',
      description: 'Lead to booking'
    },
    {
      title: 'Revenue',
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      change: '+23.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-100',
      description: 'Total earnings'
    },
    {
      title: 'Avg Deal Value',
      value: `$${analytics.averageDealValue.toLocaleString()}`,
      change: '-2.1%',
      trend: 'down' as const,
      icon: BarChart3,
      color: 'text-purple-600 bg-purple-100',
      description: 'Per booking'
    },
    {
      title: 'Response Time',
      value: `${analytics.responseTime}h`,
      change: '-15%',
      trend: 'up' as const,
      icon: Clock,
      color: 'text-amber-600 bg-amber-100',
      description: 'Average response'
    },
    {
      title: 'Satisfaction',
      value: `${analytics.customerSatisfaction}/5`,
      change: '+0.3',
      trend: 'up' as const,
      icon: Users,
      color: 'text-pink-600 bg-pink-100',
      description: 'Customer rating'
    }
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📊 Performance Analytics</h1>
            <p className="text-purple-100 text-lg">
              Track your success, optimize your strategies
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{analytics.conversionRate}%</div>
            <p className="text-purple-100">Conversion Rate</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 3 months</option>
            <option value="year">Last 12 months</option>
          </select>
          
          <Button variant="outline" icon={<Filter className="h-4 w-4" />}>
            Filter
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            icon={<RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />}
          >
            Refresh
          </Button>
          <Button variant="outline" icon={<Download className="h-4 w-4" />}>
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className={cn('p-3 rounded-lg group-hover:scale-110 transition-transform', kpi.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <Badge
                  variant={kpi.trend === 'up' ? 'success' : kpi.trend === 'down' ? 'destructive' : 'default'}
                  size="sm"
                >
                  {kpi.change}
                </Badge>
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">{kpi.value}</div>
              <div className="text-sm text-gray-600 mb-1">{kpi.title}</div>
              <div className="text-xs text-gray-500">{kpi.description}</div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
              <p className="text-sm text-gray-600">Monthly revenue performance</p>
            </div>
            <Button variant="ghost" size="sm" icon={<Eye className="h-4 w-4" />}>
              View Details
            </Button>
          </div>
          
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Interactive Revenue Chart</p>
              <p className="text-sm text-gray-500">Recharts implementation would show monthly trends</p>
            </div>
          </div>
        </Card>

        {/* Lead Funnel */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Lead Conversion Funnel</h3>
              <p className="text-sm text-gray-600">Track your lead journey</p>
            </div>
            <Button variant="ghost" size="sm" icon={<PieChart className="h-4 w-4" />}>
              View Breakdown
            </Button>
          </div>
          
          <div className="space-y-4">
            {[
              { stage: 'Total Leads', count: 156, percentage: 100, color: 'bg-blue-500' },
              { stage: 'Qualified', count: 124, percentage: 79, color: 'bg-green-500' },
              { stage: 'Quoted', count: 78, percentage: 50, color: 'bg-amber-500' },
              { stage: 'Negotiating', count: 52, percentage: 33, color: 'bg-orange-500' },
              { stage: 'Booked', count: 48, percentage: 31, color: 'bg-emerald-500' }
            ].map((stage, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium text-gray-700">{stage.stage}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', stage.color)}
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
                <div className="w-16 text-sm font-semibold text-gray-900">{stage.count}</div>
                <div className="w-12 text-xs text-gray-500">{stage.percentage}%</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance Insights */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">AI Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Strong Performance Trend</h4>
                  <p className="text-sm text-blue-700">
                    Your conversion rate improved 23% this month. Key factors: faster response times
                    and better lead qualification.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Optimization Opportunity</h4>
                  <p className="text-sm text-green-700">
                    Focus on luxury European packages - your conversion rate is 45% higher
                    for bookings over $3,000.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900 mb-1">Follow-up Reminder</h4>
                  <p className="text-sm text-amber-700">
                    You have 3 warm leads that haven't been contacted in 4+ days.
                    AI suggests immediate follow-up.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start gap-3">
                <Activity className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-900 mb-1">Peak Activity Hours</h4>
                  <p className="text-sm text-purple-700">
                    Your best response rates occur between 10-11 AM and 3-4 PM.
                    Schedule important calls during these windows.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Monthly Trend Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
            <p className="text-sm text-gray-600">Track leads, bookings, and revenue over time</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" size="sm">+23% Growth</Badge>
            <Button variant="outline" size="sm">Configure</Button>
          </div>
        </div>

        <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-700 mb-2">Interactive Analytics Dashboard</h4>
            <p className="text-gray-600 max-w-md">
              Advanced charts with drill-down capabilities, comparative analysis,
              and predictive forecasting would be implemented here using Recharts.
            </p>
            <div className="mt-4 space-x-4">
              <Button variant="outline" size="sm">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Revenue Details
              </Button>
              <Button variant="outline" size="sm">
                <PieChart className="h-4 w-4 mr-2" />
                Lead Sources
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}