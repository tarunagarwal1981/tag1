// File: app/(main)/agent/communication/page.tsx
'use client';

import { EnhancedCommunicationHub } from '@/components/dashboard/communication/EnhancedCommunicationHub';
import { Card } from '@/components/ui/core/Card';
import { Badge } from '@/components/ui/core/Badge';
import {
  MessageSquare,
  Users,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useState } from 'react';

export default function CommunicationPage() {
  const [stats] = useState({
    totalMessages: 234,
    unreadMessages: 12,
    responseTime: '4.2 min',
    satisfaction: '98%'
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">📱 Communication Hub</h1>
        <p className="text-green-100 text-lg">
          Unified messaging with WhatsApp, Email, and SMS integration
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
            <Badge variant="info" size="sm">Today</Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.totalMessages}</div>
          <div className="text-sm text-gray-600">Total Messages</div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            {parseInt(stats.unreadMessages.toString()) > 0 && (
              <Badge variant="warning" size="sm">{stats.unreadMessages}</Badge>
            )}
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.unreadMessages}</div>
          <div className="text-sm text-gray-600">Unread Messages</div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <Badge variant="success" size="sm">Fast</Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.responseTime}</div>
          <div className="text-sm text-gray-600">Avg Response</div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <Badge variant="success" size="sm">{stats.satisfaction}</Badge>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.satisfaction}</div>
          <div className="text-sm text-gray-600">Satisfaction Rate</div>
        </Card>
      </div>

      {/* Enhanced Communication Hub */}
      <EnhancedCommunicationHub userRole="agent" />
    </div>
  );
}