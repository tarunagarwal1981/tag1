// Calendar View Component - components/dashboard/agent/CalendarView.tsx

'use client';

import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Users,
  MapPin,
  DollarSign,
  X,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { leadsData, type Lead, type Task, type ActivityLog } from '@/lib/data';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'task' | 'travel' | 'follow-up' | 'meeting';
  date: Date;
  leadId: string;
  lead: Lead;
  priority: 'high' | 'medium' | 'low';
  isOverdue?: boolean;
  task?: Task;
}

// Schedule Follow-up Modal
const ScheduleFollowUpModal = ({
  lead,
  isOpen,
  onClose,
  onSchedule,
}: {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: string, type: string, notes: string) => void;
}) => {
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('');
  const [followUpType, setFollowUpType] = useState('CALL');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (followUpDate && followUpTime) {
      const dateTime = `${followUpDate}T${followUpTime}:00Z`;
      onSchedule(dateTime, followUpType, notes);
      setFollowUpDate('');
      setFollowUpTime('');
      setNotes('');
      onClose();
    }
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Schedule Follow-up - {lead.clientName}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Follow-up Type
              </label>
              <select
                value={followUpType}
                onChange={(e) => setFollowUpType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="CALL">Phone Call</option>
                <option value="EMAIL">Email Follow-up</option>
                <option value="MEETING">In-person Meeting</option>
                <option value="WHATSAPP">WhatsApp Message</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={followUpTime}
                  onChange={(e) => setFollowUpTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any specific notes for this follow-up..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Schedule Follow-up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Event Detail Modal
const EventDetailModal = ({
  event,
  isOpen,
  onClose,
  onMarkComplete,
  onReschedule,
}: {
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onMarkComplete: (eventId: string) => void;
  onReschedule: (eventId: string, newDate: string) => void;
}) => {
  if (!isOpen || !event) return null;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckCircle2 className="h-5 w-5 text-blue-600" />;
      case 'travel':
        return <MapPin className="h-5 w-5 text-green-600" />;
      case 'follow-up':
        return <Clock className="h-5 w-5 text-amber-600" />;
      case 'meeting':
        return <Users className="h-5 w-5 text-purple-600" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {getEventIcon(event.type)}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {event.date.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  at{' '}
                  {event.date.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Lead Details */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Lead Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Client:</span>
                <span className="font-medium">{event.lead.clientName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Destination:</span>
                <span>{event.lead.destination}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Value:</span>
                <span className="font-semibold text-emerald-600">
                  €{event.lead.estimatedValue.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-medium',
                    event.lead.status === 'NEW'
                      ? 'bg-blue-100 text-blue-700'
                      : event.lead.status === 'QUALIFICATION'
                      ? 'bg-purple-100 text-purple-700'
                      : event.lead.status === 'QUOTING'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-green-100 text-green-700'
                  )}
                >
                  {event.lead.status}
                </span>
              </div>
            </div>
          </div>

          {/* Task Details (if applicable) */}
          {event.task && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Task Details</h4>
              <p className="text-sm text-blue-800 mb-2">
                {event.task.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-blue-700">
                <span>Priority: {event.task.priority}</span>
                <span>
                  Due: {new Date(event.task.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {event.type === 'task' && !event.task?.isCompleted && (
              <button
                onClick={() => onMarkComplete(event.id)}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                Mark Complete
              </button>
            )}

            <button
              onClick={() => {
                const newDate = prompt(
                  'Enter new date (YYYY-MM-DD HH:MM):',
                  event.date.toISOString().slice(0, 16).replace('T', ' ')
                );
                if (newDate) {
                  onReschedule(event.id, newDate);
                }
              }}
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Reschedule
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
            <div className="flex gap-2">
              <button className="btn-secondary flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                Call
              </button>
              <button className="btn-secondary flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                Email
              </button>
              <button className="btn-secondary flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4" />
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Calendar View Component
export function CalendarView({
  leads,
  onUpdateLead,
}: {
  leads: Lead[];
  onUpdateLead: (updatedLead: Lead) => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Generate calendar events from leads data
  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = [];
    const now = new Date();

    leads.forEach((lead) => {
      // Add tasks as events
      lead.tasks.forEach((task) => {
        if (!task.isCompleted) {
          events.push({
            id: `task-${task.id}`,
            title: task.description,
            type: 'task',
            date: new Date(task.dueDate),
            leadId: lead.id,
            lead,
            priority: task.priority.toLowerCase() as 'high' | 'medium' | 'low',
            isOverdue: new Date(task.dueDate) < now,
            task,
          });
        }
      });

      // Add travel dates as events
      const departureDate = new Date(lead.travelDates.from);
      const returnDate = new Date(lead.travelDates.to);

      if (lead.status === 'BOOKED' || lead.status === 'OPERATIONS') {
        events.push({
          id: `travel-departure-${lead.id}`,
          title: `${lead.clientName} - Departure`,
          type: 'travel',
          date: departureDate,
          leadId: lead.id,
          lead,
          priority: 'high',
        });

        events.push({
          id: `travel-return-${lead.id}`,
          title: `${lead.clientName} - Return`,
          type: 'travel',
          date: returnDate,
          leadId: lead.id,
          lead,
          priority: 'medium',
        });
      }

      // Add follow-up reminders based on last activity
      const lastActivity = lead.activity[0];
      if (lastActivity) {
        const lastActivityDate = new Date(lastActivity.timestamp);
        const daysSinceActivity =
          (now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24);

        if (
          daysSinceActivity > 3 &&
          lead.status !== 'BOOKED' &&
          lead.status !== 'OPERATIONS'
        ) {
          const followUpDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
          events.push({
            id: `follow-up-${lead.id}`,
            title: `Follow up with ${lead.clientName}`,
            type: 'follow-up',
            date: followUpDate,
            leadId: lead.id,
            lead,
            priority: lead.temperature === 'HOT' ? 'high' : 'medium',
          });
        }
      }
    });

    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [leads]);

  // Get events for current month
  const monthEvents = calendarEvents.filter((event) => {
    const eventMonth = event.date.getMonth();
    const eventYear = event.date.getFullYear();
    return (
      eventMonth === currentDate.getMonth() &&
      eventYear === currentDate.getFullYear()
    );
  });

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentIterDate = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      // 6 weeks
      days.push(new Date(currentIterDate));
      currentIterDate.setDate(currentIterDate.getDate() + 1);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const getEventsForDay = (date: Date) => {
    return monthEvents.filter(
      (event) => event.date.toDateString() === date.toDateString()
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleScheduleFollowUp = (
    date: string,
    type: string,
    notes: string
  ) => {
    if (!selectedLead) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      description: `${type} follow-up${notes ? ': ' + notes : ''}`,
      dueDate: date,
      isCompleted: false,
      priority: 'Medium',
    };

    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      type: 'FOLLOW_UP',
      content: `Follow-up scheduled for ${new Date(date).toLocaleString()}${
        notes ? ' - ' + notes : ''
      }`,
      timestamp: new Date().toISOString(),
      author: 'Anya Sharma',
    };

    const updatedLead: Lead = {
      ...selectedLead,
      tasks: [newTask, ...selectedLead.tasks],
      activity: [newActivity, ...selectedLead.activity],
      updatedAt: new Date().toISOString(),
    };

    onUpdateLead(updatedLead);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  const handleMarkComplete = (eventId: string) => {
    const event = calendarEvents.find((e) => e.id === eventId);
    if (!event || !event.task) return;

    const updatedLead: Lead = {
      ...event.lead,
      tasks: event.lead.tasks.map((t) =>
        t.id === event.task!.id ? { ...t, isCompleted: true } : t
      ),
      updatedAt: new Date().toISOString(),
    };

    onUpdateLead(updatedLead);
    setShowEventDetail(false);
  };

  const today = new Date();
  const todayEvents = getEventsForDay(today);
  const upcomingEvents = calendarEvents
    .filter((event) => event.date > today)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendar View</h2>
          <p className="text-gray-600">
            Manage your follow-ups, deadlines, and travel dates
          </p>
        </div>
        <button
          onClick={() => {
            // Show leads dropdown to select one for scheduling
            const leadName = prompt('Enter client name to schedule follow-up:');
            const lead = leads.find((l) =>
              l.clientName.toLowerCase().includes(leadName?.toLowerCase() || '')
            );
            if (lead) {
              setSelectedLead(lead);
              setShowScheduleModal(true);
            }
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Follow-up</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="modern-card p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-GB', {
                  month: 'long',
                  year: 'numeric',
                })}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day Headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="p-2 text-center text-sm font-medium text-gray-500"
                >
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((day, index) => {
                const dayEvents = getEventsForDay(day);
                const isCurrentMonth =
                  day.getMonth() === currentDate.getMonth();
                const isToday = day.toDateString() === today.toDateString();

                return (
                  <div
                    key={index}
                    className={cn(
                      'min-h-[80px] p-1 border border-gray-100',
                      isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                      isToday && 'bg-blue-50 border-blue-200'
                    )}
                  >
                    <div
                      className={cn(
                        'text-sm font-medium mb-1',
                        isCurrentMonth ? 'text-gray-900' : 'text-gray-400',
                        isToday && 'text-blue-600 font-bold'
                      )}
                    >
                      {day.getDate()}
                    </div>

                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          className={cn(
                            'text-xs p-1 rounded cursor-pointer truncate',
                            event.type === 'task' && event.priority === 'high'
                              ? 'bg-red-100 text-red-700'
                              : event.type === 'task'
                              ? 'bg-blue-100 text-blue-700'
                              : event.type === 'travel'
                              ? 'bg-green-100 text-green-700'
                              : event.type === 'follow-up'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-purple-100 text-purple-700',
                            event.isOverdue &&
                              'bg-red-200 text-red-800 font-semibold'
                          )}
                        >
                          {event.isOverdue && '⚠️ '}
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Today's Events */}
          <div className="modern-card p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-500" />
              Today's Events
            </h3>
            <div className="space-y-2">
              {todayEvents.length > 0 ? (
                todayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => handleEventClick(event)}
                    className={cn(
                      'p-3 rounded-lg cursor-pointer border transition-colors',
                      event.isOverdue
                        ? 'bg-red-50 border-red-200 hover:bg-red-100'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {event.type === 'task' && (
                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                      )}
                      {event.type === 'travel' && (
                        <MapPin className="h-4 w-4 text-green-500" />
                      )}
                      {event.type === 'follow-up' && (
                        <Clock className="h-4 w-4 text-amber-500" />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {event.title}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {event.lead.clientName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {event.date.toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No events today
                </p>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="modern-card p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              Upcoming Events
            </h3>
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className="p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {event.title}
                    </span>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        event.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : event.priority === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      )}
                    >
                      {event.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {event.lead.clientName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {event.date.toLocaleDateString('en-GB')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="modern-card p-4">
            <h3 className="font-semibold text-gray-900 mb-3">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Events</span>
                <span className="font-semibold">{monthEvents.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Overdue Tasks</span>
                <span className="font-semibold text-red-600">
                  {monthEvents.filter((e) => e.isOverdue).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Follow-ups</span>
                <span className="font-semibold text-amber-600">
                  {monthEvents.filter((e) => e.type === 'follow-up').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Travel Dates</span>
                <span className="font-semibold text-green-600">
                  {monthEvents.filter((e) => e.type === 'travel').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ScheduleFollowUpModal
        lead={selectedLead}
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSchedule={handleScheduleFollowUp}
      />

      <EventDetailModal
        event={selectedEvent}
        isOpen={showEventDetail}
        onClose={() => setShowEventDetail(false)}
        onMarkComplete={handleMarkComplete}
        onReschedule={(eventId, newDate) => {
          console.log('Reschedule event:', eventId, newDate);
          setShowEventDetail(false);
        }}
      />
    </div>
  );
}
