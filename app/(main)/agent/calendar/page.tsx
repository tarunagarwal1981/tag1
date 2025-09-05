// File: app/(main)/agent/calendar/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/core/Card';
import { Button } from '@/components/ui/core/Button';
import { Badge } from '@/components/ui/core/Badge';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Phone,
  Video,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  CheckCircle,
  AlertTriangle,
  FileText,
  Edit
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'agenda'>('month');

  const [events] = useState([
    {
      id: 1,
      title: 'Follow-up Call: Sarah Johnson',
      type: 'call',
      date: new Date(2025, 8, 5, 10, 30), // Sep 5, 2025 10:30 AM
      duration: 30,
      leadId: 'LEAD-001',
      priority: 'high',
      status: 'scheduled'
    },
    {
      id: 2,
      title: 'Client Meeting: Tokyo Package Review',
      type: 'meeting',
      date: new Date(2025, 8, 5, 14, 0), // Sep 5, 2025 2:00 PM
      duration: 60,
      leadId: 'LEAD-002',
      priority: 'medium',
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'Task: Prepare Bali Itinerary',
      type: 'task',
      date: new Date(2025, 8, 6, 9, 0), // Sep 6, 2025 9:00 AM
      duration: 120,
      leadId: 'LEAD-003',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 4,
      title: 'Payment Follow-up: Mumbai Client',
      type: 'task',
      date: new Date(2025, 8, 7, 11, 0), // Sep 7, 2025 11:00 AM
      duration: 15,
      leadId: 'LEAD-004',
      priority: 'urgent',
      status: 'overdue'
    }
  ]);

  const todayEvents = events.filter(event =>
    event.date.toDateString() === new Date().toDateString()
  );

  const upcomingEvents = events.filter(event => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return event.date >= today && event.date <= nextWeek;
  }).sort((a, b) => a.date.getTime() - b.date.getTime());

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'meeting': return <Video className="h-4 w-4" />;
      case 'task': return <CheckCircle className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getEventColor = (priority: string, status: string) => {
    if (status === 'overdue') return 'bg-red-100 text-red-700 border-red-200';
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📅 Schedule & Tasks</h1>
            <p className="text-indigo-100 text-lg">
              Manage your calendar, tasks, and follow-ups
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{todayEvents.length}</div>
            <p className="text-indigo-100">Today's Tasks</p>
          </div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center border border-gray-300 rounded-lg p-1">
            {['month', 'week', 'day', 'agenda'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={cn(
                  'px-3 py-1 rounded text-sm font-medium transition-colors',
                  viewMode === mode
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Search className="h-4 w-4" />}>
            Search
          </Button>
          <Button variant="primary" icon={<Plus className="h-4 w-4" />}>
            Add Event
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-700 mb-2">Interactive Calendar View</h4>
                <p className="text-gray-600 max-w-md">
                  Full calendar implementation with drag-and-drop scheduling,
                  recurring events, and timezone support.
                </p>
                <div className="mt-4 space-x-4">
                  <Button variant="outline" size="sm">Month View</Button>
                  <Button variant="outline" size="sm">Week View</Button>
                  <Button variant="outline" size="sm">Day View</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
              <Badge variant="info" size="sm">{todayEvents.length} events</Badge>
            </div>
            
            {todayEvents.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No events scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayEvents.map((event) => (
                  <div key={event.id} className={cn(
                    'p-3 rounded-lg border cursor-pointer hover:shadow-sm transition-all',
                    getEventColor(event.priority, event.status)
                  )}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{event.title}</h4>
                        <p className="text-xs opacity-75">
                          {event.date.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })} • {event.duration} min
                        </p>
                      </div>
                      {event.status === 'overdue' && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Upcoming Events */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Upcoming</h3>
              <Badge variant="default" size="sm">{upcomingEvents.length} events</Badge>
            </div>
            
            <div className="space-y-3">
              {upcomingEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={cn('p-2 rounded-lg', getEventColor(event.priority, event.status))}>
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{event.title}</h4>
                    <p className="text-xs text-gray-600">
                      {event.date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })} at {event.date.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>

            {upcomingEvents.length > 5 && (
              <Button variant="ghost" className="w-full mt-4" size="sm">
                View All ({upcomingEvents.length - 5} more)
              </Button>
            )}
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-start">
                <Plus className="h-4 w-4 mr-3" />
                Schedule Follow-up
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-3" />
                Schedule Call
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Video className="h-4 w-4 mr-3" />
                Video Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-3" />
                Create Task
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}