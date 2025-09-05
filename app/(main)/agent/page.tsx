// File: app/(main)/agent/page.tsx - Complete Implementation
'use client';

import { useState, useEffect } from 'react';
import { DashboardHome } from '@/components/dashboard/common/DashboardHome';
import { EnhancedLeadManager } from '@/components/dashboard/agent/EnhancedLeadManager';
import { AdvancedAICopilot } from '@/components/ai-system/AdvancedAICopilot';
import { CommissionDashboard } from '@/lib/payment-system/PaymentManager';
import { Button } from '@/components/ui/core/Button';
import { Card } from '@/components/ui/core/Card';
import { Badge } from '@/components/ui/core/Badge';
import {
  Home,
  Users,
  Calendar,
  DollarSign,
  MessageSquare,
  BarChart3,
  Settings,
  Bell,
  Zap,
  Target,
  TrendingUp,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AgentDashboardPage() {
  const [activeView, setActiveView] = useState<'home' | 'leads' | 'bookings' | 'communications' | 'earnings' | 'analytics'>('home');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'lead', message: 'New high-value lead from Sarah Johnson', urgent: true },
    { id: 2, type: 'booking', message: 'Payment confirmation for Tokyo package', urgent: false },
    { id: 3, type: 'ai', message: 'AI suggests following up with 3 warm leads', urgent: false }
  ]);

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home, count: 0 },
    { id: 'leads', label: 'Lead Management', icon: Users, count: 24 },
    { id: 'bookings', label: 'Active Bookings', icon: Calendar, count: 8 },
    { id: 'communications', label: 'Messages', icon: MessageSquare, count: 5 },
    { id: 'earnings', label: 'Earnings', icon: DollarSign, count: 0 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, count: 0 }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <DashboardHome userRole="agent" />;
      case 'leads':
        return <EnhancedLeadManager userRole="agent" />;
      case 'bookings':
        return <ActiveBookingsManager userRole="agent" />;
      case 'communications':
        return <CommunicationHub userRole="agent" />;
      case 'earnings':
        return <CommissionDashboard userRole="agent" timeframe="month" />;
      case 'analytics':
        return <AnalyticsDashboard userRole="agent" />;
      default:
        return <DashboardHome userRole="agent" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <Card className="mb-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                    activeView === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.count > 0 && (
                    <Badge variant={activeView === item.id ? "secondary" : "default"} size="sm">
                      {item.count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              {notifications.filter(n => n.urgent).length} Alerts
            </Button>
            <Button variant="primary" size="sm">
              <Zap className="h-4 w-4 mr-2" />
              AI Assist
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <div className="space-y-6">
        {renderContent()}
      </div>

      {/* AI Copilot */}
      <AdvancedAICopilot 
        userRole="agent"
        currentContext={{
          page: activeView,
          leadCount: 24,
          activeBookings: 8,
          monthlyRevenue: 12500
        }}
      />
    </div>
  );
}
