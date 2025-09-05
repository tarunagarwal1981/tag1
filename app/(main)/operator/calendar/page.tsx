// app/(main)/operator/calendar/page.tsx

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/core/Card';
import { Button } from '@/components/ui/core/Button';
import { Badge } from '@/components/ui/core/Badge';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Globe,
  Plus,
  Filter,
  Bell,
  CheckCircle,
  AlertTriangle,
  Plane,
  Hotel,
  Car,
  MapPin,
  Phone,
  Video,
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'meeting' | 'departure' | 'arrival' | 'deadline' | 'follow-up' | 'training';
  startTime: Date;
  endTime: Date;
  participants?: string[];
  location?: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'confirmed' | 'pending' | 'cancelled';
  agentName?: string;
  packageName?: string;
}

export default function OperatorCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 5)); // September 5, 2025
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const [events] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Agent Onboarding: New UK Partners',
      type: 'meeting',
      startTime: new Date(2025, 8, 5, 15, 0),
      endTime: new Date(2025, 8, 5, 16, 30),
      participants: ['Priya Sharma', 'James Wilson'],
      location: 'Video Conference',
      description: 'Onboarding session for new UK agent partners',
      priority: 'high',
      status: 'confirmed',
      agentName: 'Priya Sharma'
    },
    {
      id: '2',
      title: 'Golden Triangle Tour - Group Departure',
      type: 'departure',
      startTime: new Date(2025, 8, 6, 8, 0),
      endTime: new Date(2025, 8, 6, 10, 0),
      location: 'Delhi Airport Terminal 3',
      description: 'Wilson family group departure for 12-day Golden Triangle tour',
      priority: 'high',
      status: 'confirmed',
      packageName: 'Golden Triangle Classic',
      agentName: 'Priya Sharma'
    },
    {
      id: '3',
      title: 'Q3 Performance Review with Ahmed',
      type: 'meeting',
      startTime: new Date(2025, 8, 7, 14, 0),
      endTime: new Date(2025, 8, 7, 15, 0),
      participants: ['Ahmed Hassan'],
      location: 'Dubai Office',
      description: 'Quarterly performance review and new package discussions',
      priority: 'medium',
      status: 'confirmed',
      agentName: 'Ahmed Hassan'
    },
    {
      id: '4',
      title: 'Kerala Backwaters - Guest Arrival',
      type: 'arrival',
      startTime: new Date(2025, 8, 8, 16, 30),
      endTime: new Date(2025, 8, 8, 18, 0),
      location: 'Cochin Airport',
      description: 'Rodriguez family arrival for Kerala Backwaters experience',
      priority: 'medium',
      status: 'confirmed',
      packageName: 'Kerala Backwaters Experience',
      agentName: 'Maria Rodriguez'
    },
    {
      id: '5',
      title: 'New Package Launch Deadline',
      type: 'deadline',
      startTime: new Date(2025, 8, 10, 17, 0),
      endTime: new Date(2025, 8, 10, 17, 0),
      description: 'Final deadline for Himalayan Adventure package launch',
      priority: 'high',
      status: 'pending',
      packageName: 'Himalayan Adventure Trek'
    },
    {
      id: '6',
      title: 'Agent Training: New Booking System',
      type: 'training',
      startTime: new Date(2025, 8, 11, 10, 0),
      endTime: new Date(2025, 8, 11, 12, 0),
      participants: ['All Agents'],
      location: 'Online Webinar',
      description: 'Training session for new booking system features',
      priority: 'medium',
      status: 'confirmed'
    }
  ]);

  const [stats] = useState({
    upcomingDepartures: 12,
    agentMeetings: 8,
    pendingTasks: 5,
    thisWeekEvents: 15
  });

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="h-4 w-4" />;
      case 'departure': return <Plane className="h-4 w-4" />;
      case 'arrival': return <MapPin className="h-4 w-4" />;
      case 'deadline': return <AlertTriangle className="h-4 w-4" />;
      case 'follow-up': return <Phone className="h-4 w-4" />;
      case 'training': return <Users className="h-4 w-4" />;
      default: return <CalendarIcon className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'departure': return 'bg-green-100 text-green-700 border-green-200';
      case 'arrival': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'deadline': return 'bg-red-100 text-red-700 border-red-200';
      case 'follow-up': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'training': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  // Generate week view dates
  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getWeekDates();
  const todayEvents = events.filter(event => 
    event.startTime.toDateString() === new Date().toDateString()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">📅 Operations Calendar</h1>
            <p className="text-indigo-100 text-lg">
              Schedule management and operational coordination
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{stats.thisWeekEvents}</div>
            <p className="text-indigo-100">This Week</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: 'Departures', value: stats.upcomingDepartures, icon: Plane, color: 'bg-green-100 text-green-600' },
          { title: 'Agent Meetings', value: stats.agentMeetings, icon: Users, color: 'bg-blue-100 text-blue-600' },
          { title: 'Pending Tasks', value: stats.pendingTasks, icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-600' },
          { title: 'Week Events', value: stats.thisWeekEvents, icon: CalendarIcon, color: 'bg-purple-100 text-purple-600' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', stat.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.title}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronLeft className="h-4 w-4" />}
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(currentDate.getDate() - 7);
                setCurrentDate(newDate);
              }}
            />
            <h2 className="text-lg font-semibold text-gray-900">
              {currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric',
                day: 'numeric'
              })}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              icon={<ChevronRight className="h-4 w-4" />}
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(currentDate.getDate() + 7);
                setCurrentDate(newDate);
              }}
            />
          </div>
          
          <div className="flex gap-2">
            {['day', 'week', 'month'].map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType as any)}
                className={cn(
                  'px-3 py-1 rounded-lg text-sm font-medium transition-colors capitalize',
                  view === viewType 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {viewType}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" icon={<Filter className="h-4 w-4" />}>
            Filter
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700" icon={<Plus className="h-4 w-4" />}>
            New Event
          </Button>
        </div>
      </div>

      {/* Main Calendar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <Card className="p-0 overflow-hidden">
            {/* Week Header */}
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-7 gap-0">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <div key={day} className="p-4 text-center">
                    <div className="text-sm font-medium text-gray-500">{day}</div>
                    <div className={cn(
                      'text-lg font-semibold mt-1',
                      weekDates[index].toDateString() === new Date().toDateString() 
                        ? 'text-purple-600' 
                        : 'text-gray-900'
                    )}>
                      {weekDates[index].getDate()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Grid */}
            <div className="h-96 overflow-y-auto">
              <div className="grid grid-cols-7 gap-0 h-full">
                {weekDates.map((date, dayIndex) => (
                  <div key={dayIndex} className="border-r border-gray-200 last:border-r-0 p-2 space-y-1">
                    {events
                      .filter(event => event.startTime.toDateString() === date.toDateString())
                      .map((event) => (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={cn(
                            'p-2 rounded-lg text-xs cursor-pointer hover:shadow-sm transition-shadow border-l-4',
                            getEventTypeColor(event.type),
                            getPriorityColor(event.priority)
                          )}
                        >
                          <div className="flex items-center gap-1 mb-1">
                            {getEventTypeIcon(event.type)}
                            <span className="font-medium truncate">{event.title}</span>
                          </div>
                          <div className="text-xs opacity-75">
                            {event.startTime.toLocaleTimeString('en-US', { 
                              hour: 'numeric', 
                              minute: '2-digit',
                              hour12: true 
                            })}
                          </div>
                          {event.agentName && (
                            <div className="text-xs opacity-75">{event.agentName}</div>
                          )}
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Event Details Sidebar */}
        <div className="space-y-4">
          {/* Today's Events */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Today's Schedule</h3>
            <div className="space-y-3">
              {todayEvents.length > 0 ? (
                todayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className={cn(
                      'p-3 rounded-lg cursor-pointer hover:shadow-sm transition-shadow border-l-4',
                      getEventTypeColor(event.type),
                      getPriorityColor(event.priority)
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getEventTypeIcon(event.type)}
                      <span className="font-medium text-sm">{event.title}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      {event.startTime.toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No events scheduled for today</p>
              )}
            </div>
          </Card>

          {/* Selected Event Details */}
          {selectedEvent && (
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Event Details</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">{selectedEvent.title}</h4>
                  <Badge className={cn('text-xs mt-1', getEventTypeColor(selectedEvent.type))}>
                    {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>
                      {selectedEvent.startTime.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                  
                  {selectedEvent.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{selectedEvent.location}</span>
                    </div>
                  )}
                  
                  {selectedEvent.agentName && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{selectedEvent.agentName}</span>
                    </div>
                  )}
                  
                  {selectedEvent.packageName && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span>{selectedEvent.packageName}</span>
                    </div>
                  )}
                </div>
                
                {selectedEvent.description && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-1">Description</h5>
                    <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                  </div>
                )}
                
                {selectedEvent.participants && selectedEvent.participants.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Participants</h5>
                    <div className="space-y-1">
                      {selectedEvent.participants.map((participant, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {participant.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>{participant}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button variant="ghost" size="sm" icon={<Video className="h-4 w-4" />}>
                    Join Call
                  </Button>
                  <Button variant="ghost" size="sm" icon={<Mail className="h-4 w-4" />}>
                    Email
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start" 
                icon={<Plane className="h-4 w-4" />}
              >
                Track Departures
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start" 
                icon={<Users className="h-4 w-4" />}
              >
                Schedule Agent Meeting
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start" 
                icon={<Bell className="h-4 w-4" />}
              >
                Set Reminder
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start" 
                icon={<CalendarIcon className="h-4 w-4" />}
              >
                View All Events
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Upcoming Events Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Key Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events
            .filter(event => event.startTime > new Date())
            .slice(0, 6)
            .map((event) => (
              <div
                key={event.id}
                className={cn(
                  'p-4 rounded-lg border-l-4 hover:shadow-sm transition-shadow cursor-pointer',
                  getEventTypeColor(event.type),
                  getPriorityColor(event.priority)
                )}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getEventTypeIcon(event.type)}
                    <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                  </div>
                  <Badge className={cn('text-xs', 
                    event.priority === 'high' ? 'bg-red-100 text-red-700' :
                    event.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  )}>
                    {event.priority}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-3 w-3" />
                    <span>
                      {event.startTime.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    <span>
                      {event.startTime.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                  </div>
                  {event.agentName && (
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3" />
                      <span>{event.agentName}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>

                {event.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-xs py-1 px-2">
                      Confirm
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs py-1 px-2">
                      Reschedule
                    </Button>
                  </div>
                )}
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}