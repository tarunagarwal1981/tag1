// components/dashboard/operator/OperatorDashboard.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Target,
  Brain,
  Users,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Star,
  ArrowUpRight,
  Award,
  Zap,
  Plus,
  Package,
  Building2,
  Globe,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Calculate operator dashboard metrics
const calculateOperatorMetrics = () => {
  return {
    totalRevenue: 285000,
    activeLeads: 47,
    hotLeads: 12,
    conversionRate: 68,
    agentsWorking: 156,
    packagesLive: 89,
    avgResponseTime: 1.8,
    monthlyBookings: 143,
  };
};

// Modern KPI Card Component (same as agent)
const KPICard = ({
  icon: Icon,
  title,
  value,
  change,
  trend = 'up',
  onClick,
  href,
}: {
  icon: any;
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
  href?: string;
}) => {
  const content = (
    <div
      className={cn('modern-card p-6 interactive-hover cursor-pointer group')}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
          <Icon className="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
        </div>
        {change && (
          <div
            className={cn(
              'flex items-center text-xs font-medium',
              trend === 'up'
                ? 'text-emerald-600'
                : trend === 'down'
                ? 'text-red-600'
                : 'text-gray-500'
            )}
          >
            <ArrowUpRight className="h-3 w-3 mr-1" />
            {change}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return <div onClick={onClick}>{content}</div>;
};

// Activity Item Component (same as agent)
const ActivityItem = ({
  type,
  agent,
  action,
  time,
  value,
}: {
  type: 'booking' | 'inquiry' | 'call' | 'email';
  agent: string;
  action: string;
  time: string;
  value: number;
}) => {
  const icons = {
    booking: CheckCircle2,
    inquiry: MessageSquare,
    call: Phone,
    email: Mail,
  };

  const colors = {
    booking: 'text-emerald-500 bg-emerald-50',
    inquiry: 'text-blue-500 bg-blue-50',
    call: 'text-purple-500 bg-purple-50',
    email: 'text-green-500 bg-green-50',
  };

  const Icon = icons[type];

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center',
          colors[type]
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">
          <span className="font-semibold">{agent}</span> {action}
        </p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
      <div className="text-sm font-semibold text-emerald-600">
        ${value.toLocaleString()}
      </div>
    </div>
  );
};

export function OperatorDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [metrics, setMetrics] = useState(calculateOperatorMetrics());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const todaysActivities = [
    {
      type: 'booking' as const,
      agent: 'Emma Thompson',
      action: 'confirmed Golden Triangle package',
      time: '2 hours ago',
      value: 3400,
    },
    {
      type: 'inquiry' as const,
      agent: 'Marco Rossi',
      action: 'requested Kerala custom itinerary',
      time: '4 hours ago',
      value: 5200,
    },
    {
      type: 'booking' as const,
      agent: 'Sarah Mitchell',
      action: 'booked Rajasthan heritage tour',
      time: '1 day ago',
      value: 8500,
    },
    {
      type: 'call' as const,
      agent: 'Chen Wei',
      action: 'scheduled consultation call',
      time: '2 days ago',
      value: 6750,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-300">
      {/* Welcome Header */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, Incredible India Tours!
            </h1>
            <p className="text-gray-600">
              Here's your business performance overview for{' '}
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl">🇮🇳</div>
            <p className="text-sm text-gray-600">New Delhi, India</p>
            <p className="text-xs text-gray-500">12 years • 4.8★ rating</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          icon={DollarSign}
          title="Monthly Revenue"
          value={`$${(metrics.totalRevenue / 1000).toFixed(0)}K`}
          change="+12.5%"
          href="/operator/analytics"
        />
        <KPICard
          icon={Target}
          title="Active Leads"
          value={metrics.activeLeads}
          change="+8"
          href="/operator/leads"
        />
        <KPICard
          icon={Users}
          title="Agent Network"
          value={metrics.agentsWorking}
          change="+23"
          href="/operator/agents"
        />
        <KPICard
          icon={TrendingUp}
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          change="+5.2%"
          href="/operator/analytics"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Business Insights */}
        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Business Insights
            </h3>
            <Link 
              href="/operator/analytics"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              View analytics
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">{metrics.packagesLive}</div>
              <div className="text-sm text-blue-700">Live Packages</div>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-xl">
              <div className="text-2xl font-bold text-emerald-600">{metrics.monthlyBookings}</div>
              <div className="text-sm text-emerald-700">Monthly Bookings</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{metrics.avgResponseTime}h</div>
              <div className="text-sm text-purple-700">Response Time</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <div className="text-2xl font-bold text-amber-600">4.8★</div>
              <div className="text-sm text-amber-700">Agent Rating</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="modern-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Agent Activity
            </h3>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View all
            </button>
          </div>
          <div className="space-y-1">
            {todaysActivities.map((activity, index) => (
              <ActivityItem key={index} {...activity} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/operator/leads" className="block">
          <div className="flex items-center gap-3 p-4 modern-card hover:bg-blue-50 transition-colors border">
            <Target className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">Lead Management</p>
              <p className="text-xs text-gray-600">Manage agent inquiries</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-400 ml-auto" />
          </div>
        </Link>

        <Link href="/operator/packages" className="block">
          <div className="flex items-center gap-3 p-4 modern-card hover:bg-purple-50 transition-colors border">
            <Package className="h-6 w-6 text-purple-600" />
            <div>
              <p className="font-medium text-gray-900">Package Management</p>
              <p className="text-xs text-gray-600">Create & manage packages</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-400 ml-auto" />
          </div>
        </Link>

        <Link href="/operator/agents" className="block">
          <div className="flex items-center gap-3 p-4 modern-card hover:bg-green-50 transition-colors border">
            <Users className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-gray-900">Agent Network</p>
              <p className="text-xs text-gray-600">Partner relationships</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-400 ml-auto" />
          </div>
        </Link>

        <Link href="/operator/communication" className="block">
          <div className="flex items-center gap-3 p-4 modern-card hover:bg-amber-50 transition-colors border">
            <MessageSquare className="h-6 w-6 text-amber-600" />
            <div>
              <p className="font-medium text-gray-900">Communication Hub</p>
              <p className="text-xs text-gray-600">Agent messages</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-400 ml-auto" />
          </div>
        </Link>
      </div>
    </div>
  );
}