// Updated Agent Dashboard Page - app/(main)/agent/my-dashboard/page.tsx

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
} from 'lucide-react';
import Link from 'next/link';
import { leadsData } from '@/lib/data';
import { EnhancedAICopilot } from '@/components/dashboard/agent/EnhancedAICopilot';
import { cn } from '@/lib/utils';

// Calculate dashboard metrics from real data
const calculateMetrics = () => {
  const total = leadsData.length;
  const hotLeads = leadsData.filter((l) => l.temperature === 'HOT').length;
  const totalValue = leadsData.reduce((sum, l) => sum + l.estimatedValue, 0);
  const avgAIScore = Math.round(
    leadsData.reduce((sum, l) => sum + l.aiScore, 0) / total
  );
  const conversionRate = Math.round(
    (leadsData.filter((l) => l.status === 'BOOKED').length / total) * 100
  );
  const overdueCount = leadsData.filter((l) =>
    l.tasks.some((t) => !t.isCompleted && new Date(t.dueDate) < new Date())
  ).length;

  return {
    total,
    hotLeads,
    totalValue,
    avgAIScore,
    conversionRate,
    overdueCount,
  };
};

// Modern KPI Card Component
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

// Activity Item Component
const ActivityItem = ({
  type,
  client,
  time,
  value,
}: {
  type: 'call' | 'email' | 'booking' | 'whatsapp';
  client: string;
  time: string;
  value: number;
}) => {
  const icons = {
    call: Phone,
    email: Mail,
    booking: CheckCircle2,
    whatsapp: MessageSquare,
  };

  const colors = {
    call: 'text-blue-500 bg-blue-50',
    email: 'text-green-500 bg-green-50',
    booking: 'text-emerald-500 bg-emerald-50',
    whatsapp: 'text-purple-500 bg-purple-50',
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
        <p className="text-sm font-medium text-gray-900">{client}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
      <div className="text-sm font-semibold text-gray-900">
        €{value.toLocaleString()}
      </div>
    </div>
  );
};

export default function AgentDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [metrics, setMetrics] = useState(calculateMetrics());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const todaysActivities = [
    {
      type: 'call' as const,
      client: 'Arjun & Priya Sharma',
      time: '2 hours ago',
      value: 4500,
    },
    {
      type: 'email' as const,
      client: 'TechVentures Ltd',
      time: '4 hours ago',
      value: 18750,
    },
    {
      type: 'booking' as const,
      client: 'Mumbai Marketing',
      time: '1 day ago',
      value: 11250,
    },
    {
      type: 'whatsapp' as const,
      client: 'Dr. Vikram',
      time: '1 day ago',
      value: 3200,
    },
  ];

  const urgentLeads = leadsData
    .filter(
      (lead) =>
        lead.temperature === 'HOT' ||
        lead.tasks.some(
          (t) => !t.isCompleted && new Date(t.dueDate) < new Date()
        )
    )
    .slice(0, 5);

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Good{' '}
            {currentTime.getHours() < 12
              ? 'morning'
              : currentTime.getHours() < 18
              ? 'afternoon'
              : 'evening'}
            , Anya! 👋
          </h1>
          <p className="text-gray-600">
            You have{' '}
            <span className="font-semibold text-red-600">
              {metrics.overdueCount}
            </span>{' '}
            urgent items and{' '}
            <span className="font-semibold text-blue-600">
              {metrics.hotLeads}
            </span>{' '}
            hot leads today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/agent/lead-hub"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Lead</span>
          </Link>
          <div className="glass-card px-3 py-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          icon={Target}
          title="Active Leads"
          value={metrics.total}
          change="+3 this week"
          href="/agent/lead-hub"
        />
        <KPICard
          icon={DollarSign}
          title="Pipeline Value"
          value={`€${Math.round(metrics.totalValue / 1000)}K`}
          change="+12% this month"
        />
        <KPICard
          icon={TrendingUp}
          title="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          change="+5.2% improvement"
        />
        <KPICard
          icon={Brain}
          title="AI Score Avg"
          value={metrics.avgAIScore}
          change="+8 points"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Actions */}
          <div className="modern-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Urgent Actions Required
                  </h3>
                  <p className="text-sm text-gray-600">
                    High-priority leads and overdue items
                  </p>
                </div>
              </div>
              <Link
                href="/agent/lead-hub?filter=urgent"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-4">
              {urgentLeads.map((lead) => {
                const urgentTask = lead.tasks.find(
                  (t) => !t.isCompleted && t.priority === 'High'
                );
                const isOverdue =
                  urgentTask && new Date(urgentTask.dueDate) < new Date();

                return (
                  <div
                    key={lead.id}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border',
                      lead.temperature === 'HOT'
                        ? 'bg-red-50 border-red-200'
                        : 'bg-amber-50 border-amber-200'
                    )}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {lead.clientName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {lead.clientName}
                        </h4>
                        {lead.temperature === 'HOT' && (
                          <span className="status-hot status-indicator">
                            🔥
                          </span>
                        )}
                        <div className="ai-indicator">
                          <Brain className="h-3 w-3" />
                          <span>{lead.aiScore}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {lead.destination}
                      </div>
                      {urgentTask && (
                        <div className="text-sm font-medium text-red-700">
                          {isOverdue ? '🚨 OVERDUE: ' : '⚡ URGENT: '}
                          {urgentTask.description}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-emerald-600">
                        €{lead.estimatedValue.toLocaleString()}
                      </div>
                      <div className="flex gap-1 mt-1">
                        <button className="p-1 hover:bg-blue-100 rounded transition-colors">
                          <Phone className="h-4 w-4 text-blue-600" />
                        </button>
                        <button className="p-1 hover:bg-green-100 rounded transition-colors">
                          <Mail className="h-4 w-4 text-green-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Chart Placeholder */}
          <div className="modern-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                This Week's Performance
              </h3>
              <Link
                href="/agent/analytics"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View Analytics →
              </Link>
            </div>

            {/* Simple bar chart representation */}
            <div className="h-48 flex items-end justify-between gap-4 px-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'].map(
                (day, index) => {
                  const heights = [60, 75, 45, 85, 90, 65, 80];
                  const values = [2, 4, 1, 6, 7, 3, 5];
                  return (
                    <div key={day} className="flex flex-col items-center gap-2">
                      <div className="text-xs font-semibold text-gray-600">
                        {values[index]}
                      </div>
                      <div
                        className="w-12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500 hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                        style={{ height: `${heights[index]}%` }}
                        title={`${day}: ${values[index]} activities`}
                      />
                      <span className="text-xs text-gray-500">{day}</span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Today's Metrics */}
          <div className="modern-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Today's Activity
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-xs text-blue-600">Calls</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-xs text-green-600">Emails</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">15</div>
                <div className="text-xs text-purple-600">WhatsApp</div>
              </div>
              <div className="text-center p-3 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">3</div>
                <div className="text-xs text-emerald-600">Bookings</div>
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="modern-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              Quick Access
            </h3>

            <div className="space-y-3">
              <Link href="/agent/lead-hub" className="block">
                <div className="flex items-center gap-3 p-3 hover:bg-blue-50 rounded-lg transition-colors border">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Lead Management Hub
                    </p>
                    <p className="text-xs text-gray-600">
                      AI-powered lead prioritization
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </Link>

              <Link href="/agent/communication" className="block">
                <div className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors border">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Communication Hub
                    </p>
                    <p className="text-xs text-gray-600">
                      Messages & templates
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </Link>

              <Link href="/agent/calendar" className="block">
                <div className="flex items-center gap-3 p-3 hover:bg-purple-50 rounded-lg transition-colors border">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Schedule & Tasks
                    </p>
                    <p className="text-xs text-gray-600">
                      Follow-ups & deadlines
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-400 ml-auto" />
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="modern-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
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
      </div>

      {/* AI Copilot */}
      <EnhancedAICopilot />
    </div>
  );
}
