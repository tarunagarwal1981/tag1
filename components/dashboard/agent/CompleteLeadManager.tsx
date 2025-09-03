// Enhanced CompleteLeadManager.tsx with Functional Views
'use client';

import { useState, useMemo } from 'react';
import { 
  Brain, 
  Calendar, 
  List, 
  BarChart3,
  Plus,
  Search,
  Filter,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Users,
  DollarSign,
  MapPin,
  Zap,
  Target,
  Star,
  ArrowRight,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Download,
  Calendar as CalendarIcon,
  PieChart,
  Activity,
  Award,
  Flame,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { leadsData, type Lead, type LeadStatus } from '@/lib/data';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: string;
  leadId: string;
  lead: Lead;
  priority?: string;     // Add this
  isOverdue?: boolean;   // Add this
  task?: any;           // Add this if needed
}

type ViewMode = 'timeline' | 'list' | 'calendar' | 'analytics';
type FilterType = 'all' | 'hot' | 'overdue' | 'high-value' | 'this-week';
type SortKey = 'clientName' | 'estimatedValue' | 'updatedAt' | 'status' | 'aiScore';
type SortDirection = 'asc' | 'desc';

// Calendar event generator from leads data
const generateCalendarEvents = (leads: Lead[]) => {
  const events: CalendarEvent[] = [];
  const now = new Date();

  leads.forEach(lead => {
    // Add tasks as events
    lead.tasks.forEach(task => {
      if (!task.isCompleted) {
        events.push({
          id: `task-${task.id}`,
          title: `${lead.clientName}: ${task.description}`,
          date: new Date(task.dueDate),
          type: 'task',
          priority: task.priority.toLowerCase(),
          leadId: lead.id,
          lead: lead,
          isOverdue: new Date(task.dueDate) < now
        });
      }
    });

    // Add travel dates as events
    if (lead.status === 'BOOKED' || lead.status === 'OPERATIONS') {
      events.push({
        id: `travel-${lead.id}`,
        title: `${lead.clientName} - ${lead.destination}`,
        date: new Date(lead.travelDates.from),
        type: 'travel',
        priority: 'high',
        leadId: lead.id,
        lead: lead
      });
    }

    // Add follow-up events based on last activity
    const lastActivity = lead.activity[0];
    if (lastActivity) {
      const lastActivityDate = new Date(lastActivity.timestamp);
      const daysSinceActivity = (now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysSinceActivity > 2 && lead.status !== 'BOOKED') {
        const followUpDate = new Date(now.getTime() + (24 * 60 * 60 * 1000));
        events.push({
          id: `followup-${lead.id}`,
          title: `Follow up: ${lead.clientName}`,
          date: followUpDate,
          type: 'followup',
          priority: lead.temperature === 'HOT' ? 'high' : 'medium',
          leadId: lead.id,
          lead: lead
        });
      }
    }
  });

  return events.sort((a, b) => a.date.getTime() - b.date.getTime());
};

// Generate analytics data
const generateAnalyticsData = (leads: Lead[]) => {
  const total = leads.length;
  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<LeadStatus, number>);
  
  const temperatureCounts = leads.reduce((acc, lead) => {
    acc[lead.temperature] = (acc[lead.temperature] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = leads.reduce((sum, lead) => sum + lead.estimatedValue, 0);
  const avgValue = Math.round(totalValue / total);
  const avgAIScore = Math.round(leads.reduce((sum, lead) => sum + lead.aiScore, 0) / total);
  
  const conversionRate = Math.round((statusCounts.BOOKED || 0) / total * 100);
  const hotLeads = leads.filter(l => l.temperature === 'HOT').length;
  const overdueCount = leads.filter(l => 
    l.tasks.some(t => !t.isCompleted && new Date(t.dueDate) < new Date())
  ).length;

  // Monthly trend data (simulated)
  const monthlyData = [
    { month: 'Jan', leads: 45, revenue: 180000, conversion: 12 },
    { month: 'Feb', leads: 52, revenue: 210000, conversion: 15 },
    { month: 'Mar', leads: 38, revenue: 165000, conversion: 18 },
    { month: 'Apr', leads: 65, revenue: 280000, conversion: 22 },
    { month: 'May', leads: 71, revenue: 320000, conversion: 25 },
    { month: 'Jun', leads: 58, revenue: 245000, conversion: 20 },
    { month: 'Jul', leads: 67, revenue: 290000, conversion: 28 },
    { month: 'Aug', leads: 73, revenue: 315000, conversion: 24 },
    { month: 'Sep', leads: total, revenue: Math.round(totalValue), conversion: conversionRate }
  ];

  return {
    overview: { total, totalValue, avgValue, avgAIScore, conversionRate, hotLeads, overdueCount },
    statusCounts,
    temperatureCounts,
    monthlyData
  };
};

// List View Component
const ListView = ({ 
  leads, 
  onSelectLead,
  sortKey,
  sortDirection,
  onSort
}: { 
  leads: Lead[]; 
  onSelectLead: (lead: Lead) => void;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
}) => {
  const SortableHeader = ({ label, sortKey: key }: { label: string; sortKey: SortKey }) => (
    <th 
      scope="col" 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
      onClick={() => onSort(key)}
    >
      <div className="flex items-center gap-2">
        {label}
        {sortKey === key && (
          sortDirection === 'asc' ? 
          <ArrowUp className="h-3 w-3" /> : 
          <ArrowDown className="h-3 w-3" />
        )}
      </div>
    </th>
  );

  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-800',
    QUALIFICATION: 'bg-purple-100 text-purple-800',
    QUOTING: 'bg-amber-100 text-amber-800',
    BOOKED: 'bg-green-100 text-green-800',
    OPERATIONS: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="modern-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <SortableHeader label="Client" sortKey="clientName" />
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destination
              </th>
              <SortableHeader label="Value" sortKey="estimatedValue" />
              <SortableHeader label="AI Score" sortKey="aiScore" />
              <SortableHeader label="Status" sortKey="status" />
              <SortableHeader label="Updated" sortKey="updatedAt" />
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr 
                key={lead.id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSelectLead(lead)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-900">
                          {lead.clientName}
                        </div>
                        {lead.temperature === 'HOT' && (
                          <Flame className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {lead.clientEmail}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{lead.destination}</div>
                  <div className="text-xs text-gray-500">
                    {lead.travelerCount} travelers
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-emerald-600">
                    €{lead.estimatedValue.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="ai-indicator">
                    <Brain className="h-3 w-3" />
                    <span>{lead.aiScore}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={cn(
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    statusColors[lead.status]
                  )}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(lead.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <Phone className="h-4 w-4 text-blue-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <Mail className="h-4 w-4 text-green-600" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Calendar View Component
const CalendarView = ({ leads }: { leads: Lead[] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const events = useMemo(() => generateCalendarEvents(leads), [leads]);
  
  const monthEvents = events.filter(event => {
    const eventMonth = event.date.getMonth();
    const eventYear = event.date.getFullYear();
    return eventMonth === currentDate.getMonth() && eventYear === currentDate.getFullYear();
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
      days.push(new Date(currentIterDate));
      currentIterDate.setDate(currentIterDate.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const getEventsForDay = (date: Date) => {
    return monthEvents.filter(event => 
      event.date.toDateString() === date.toDateString()
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = new Date();
  const upcomingEvents = events
    .filter(event => event.date > today)
    .slice(0, 8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <div className="modern-card p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
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
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday = day.toDateString() === today.toDateString();

              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-[80px] p-1 border border-gray-100",
                    isCurrentMonth ? "bg-white" : "bg-gray-50",
                    isToday && "bg-blue-50 border-blue-200"
                  )}
                >
                  <div className={cn(
                    "text-sm font-medium mb-1",
                    isCurrentMonth ? "text-gray-900" : "text-gray-400",
                    isToday && "text-blue-600 font-bold"
                  )}>
                    {day.getDate()}
                  </div>
                  
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        onClick={() => setSelectedEvent(event)}
                        className={cn(
                          "text-xs p-1 rounded cursor-pointer truncate",
                          event.type === 'task' && event.priority === 'high' ? "bg-red-100 text-red-700" :
                          event.type === 'task' ? "bg-blue-100 text-blue-700" :
                          event.type === 'travel' ? "bg-green-100 text-green-700" :
                          "bg-amber-100 text-amber-700",
                          event.isOverdue && "bg-red-200 text-red-800 font-semibold"
                        )}
                      >
                        {event.isOverdue && "⚠️ "}{event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming Events Sidebar */}
      <div className="space-y-6">
        <div className="modern-card p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            Upcoming Events
          </h3>
          <div className="space-y-2">
            {upcomingEvents.map(event => (
              <div
                key={event.id}
                onClick={() => setSelectedEvent(event)}
                className="p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {event.title}
                  </span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    event.priority === 'high' ? "bg-red-100 text-red-700" :
                    event.priority === 'medium' ? "bg-amber-100 text-amber-700" :
                    "bg-blue-100 text-blue-700"
                  )}>
                    {event.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {event.date.toLocaleDateString('en-GB')}
                </p>
              </div>
            ))}
          </div>
        </div>

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
                {monthEvents.filter(e => e.isOverdue).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Follow-ups</span>
              <span className="font-semibold text-amber-600">
                {monthEvents.filter(e => e.type === 'followup').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Travel Events</span>
              <span className="font-semibold text-green-600">
                {monthEvents.filter(e => e.type === 'travel').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics View Component
const AnalyticsView = ({ leads }: { leads: Lead[] }) => {
  const analytics = useMemo(() => generateAnalyticsData(leads), [leads]);

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = "blue" 
  }: { 
    title: string; 
    value: string | number; 
    change?: string; 
    icon: any; 
    color?: string; 
  }) => (
    <div className="modern-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-${color}-100 flex items-center justify-center`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
        {change && (
          <span className="text-sm font-medium text-green-600 flex items-center gap-1">
            <ArrowUp className="h-3 w-3" />
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-600">{title}</div>
    </div>
  );

  const ChartBar = ({ 
    label, 
    value, 
    maxValue, 
    color = "blue" 
  }: { 
    label: string; 
    value: number; 
    maxValue: number; 
    color?: string; 
  }) => (
    <div className="flex items-center gap-4">
      <div className="w-20 text-sm text-gray-600">{label}</div>
      <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
        <div 
          className={`bg-${color}-500 h-4 rounded-full transition-all duration-500`}
          style={{ width: `${(value / maxValue) * 100}%` }}
        />
      </div>
      <div className="w-8 text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );

  const maxStatusCount = Math.max(...Object.values(analytics.statusCounts));

  return (
    <div className="space-y-8">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads"
          value={analytics.overview.total}
          change="+12%"
          icon={Target}
          color="blue"
        />
        <MetricCard
          title="Pipeline Value"
          value={`€${Math.round(analytics.overview.totalValue / 1000)}K`}
          change="+18%"
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${analytics.overview.conversionRate}%`}
          change="+5.2%"
          icon={TrendingUp}
          color="purple"
        />
        <MetricCard
          title="Hot Leads"
          value={analytics.overview.hotLeads}
          change="+3"
          icon={Flame}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="modern-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            Lead Status Distribution
          </h3>
          <div className="space-y-4">
            {Object.entries(analytics.statusCounts).map(([status, count]) => (
              <ChartBar
                key={status}
                label={status}
                value={count}
                maxValue={maxStatusCount}
                color="blue"
              />
            ))}
          </div>
        </div>

        {/* Temperature Analysis */}
        <div className="modern-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-red-500" />
            Lead Temperature
          </h3>
          <div className="space-y-6">
            {Object.entries(analytics.temperatureCounts).map(([temp, count]) => {
              const percentage = Math.round((count / analytics.overview.total) * 100);
              const color = temp === 'HOT' ? 'red' : temp === 'COLD' ? 'blue' : 'amber';
              
              return (
                <div key={temp} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-${color}-500`} />
                    <span className="text-sm font-medium text-gray-700">{temp}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{count}</div>
                    <div className="text-xs text-gray-500">{percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="modern-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-500" />
            Monthly Performance Trend
          </h3>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {analytics.monthlyData.map((data, index) => {
              const maxLeads = Math.max(...analytics.monthlyData.map(d => d.leads));
              const height = (data.leads / maxLeads) * 100;
              
              return (
                <div key={data.month} className="flex flex-col items-center gap-2">
                  <div className="text-xs font-semibold text-gray-600">
                    {data.leads}
                  </div>
                  <div
                    className="w-8 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500 hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                    style={{ height: `${height}%` }}
                    title={`${data.month}: ${data.leads} leads, €${data.revenue.toLocaleString()} revenue`}
                  />
                  <span className="text-xs text-gray-500">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance Summary */}
        <div className="modern-card p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Performance Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">
                €{Math.round(analytics.overview.avgValue / 1000)}K
              </div>
              <div className="text-sm text-blue-700">Average Deal Size</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {analytics.overview.avgAIScore}
              </div>
              <div className="text-sm text-green-700">Average AI Score</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <div className="text-2xl font-bold text-red-600">
                {analytics.overview.overdueCount}
              </div>
              <div className="text-sm text-red-700">Overdue Items</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Enhanced Lead Manager Component
export function CompleteLeadManager() {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Filter and sort leads
  const processedLeads = useMemo(() => {
    let filtered = leadsData.filter(lead => {
      // Search filter
      if (searchTerm && !lead.clientName.toLowerCase().includes(searchTerm.toLowerCase()) 
          && !lead.destination.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Category filter
      switch (filter) {
        case 'hot':
          return lead.temperature === 'HOT';
        case 'overdue':
          return lead.tasks.some(t => !t.isCompleted && new Date(t.dueDate) < new Date());
        case 'high-value':
          return lead.estimatedValue > 10000;
        case 'this-week':
          const weekFromNow = new Date();
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          return lead.tasks.some(t => !t.isCompleted && new Date(t.dueDate) <= weekFromNow);
        default:
          return true;
      }
    });
    
    // Sort leads
    return filtered.sort((a, b) => {
      let valA: any, valB: any;
      
      switch (sortKey) {
        case 'updatedAt':
          valA = new Date(a.updatedAt).getTime();
          valB = new Date(b.updatedAt).getTime();
          break;
        case 'estimatedValue':
          valA = a.estimatedValue;
          valB = b.estimatedValue;
          break;
        case 'aiScore':
          valA = a.aiScore;
          valB = b.aiScore;
          break;
        case 'clientName':
          valA = a.clientName.toLowerCase();
          valB = b.clientName.toLowerCase();
          break;
        case 'status':
          valA = a.status;
          valB = b.status;
          break;
        default:
          valA = a.updatedAt;
          valB = b.updatedAt;
      }
      
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filter, searchTerm, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const handleAction = (action: string, lead: Lead) => {
    console.log(`Action: ${action} for lead: ${lead.clientName}`);
    // Implement actual actions here
  };

  const handleSelectLead = (lead: Lead) => {
    console.log('Selected lead:', lead.clientName);
    // Implement lead selection logic
  };

  // Calculate priority for timeline sorting
  const calculateLeadPriority = (lead: Lead) => {
    let priority = 0;
    
    // AI Score weight (30%)
    priority += (lead.aiScore / 100) * 30;
    
    // Temperature weight (25%)
    if (lead.temperature === 'HOT') priority += 25;
    else if (lead.temperature === 'COLD') priority += 5;
    
    // Value weight (20%)
    priority += Math.min((lead.estimatedValue / 100000) * 20, 20);
    
    // Urgency weight (15%)
    const daysSinceUpdate = (new Date().getTime() - new Date(lead.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > 2) priority += 15;
    else if (daysSinceUpdate > 1) priority += 10;
    else priority += 5;
    
    // Overdue tasks weight (10%)
    const overdueTasks = lead.tasks.filter(t => !t.isCompleted && new Date(t.dueDate) < new Date()).length;
    if (overdueTasks > 0) priority += 10;
    
    return Math.round(priority);
  };

  const TimelineLeadCard = ({ lead }: { lead: Lead }) => {
    const priority = calculateLeadPriority(lead);
    const urgentTasks = lead.tasks.filter(t => !t.isCompleted && t.priority === 'High');
    const overdueTasks = lead.tasks.filter(t => !t.isCompleted && new Date(t.dueDate) < new Date());
    
    return (
      <div className="modern-card p-6 hover:shadow-lg transition-all duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-lg text-gray-900">{lead.clientName}</h3>
              {lead.temperature === 'HOT' && (
                <span className="status-hot status-indicator flex items-center gap-1">
                  <Flame className="h-3 w-3" />
                  Hot
                </span>
              )}
              <div className="ai-indicator">
                <Brain className="h-3 w-3" />
                <span>{lead.aiScore}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{lead.destination}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{lead.travelerCount} travelers</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold text-emerald-600">€{lead.estimatedValue.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              priority > 80 ? "bg-red-100 text-red-700" :
              priority > 60 ? "bg-amber-100 text-amber-700" :
              "bg-blue-100 text-blue-700"
            )}>
              Priority: {priority}
            </div>
            
            <div className={cn(
              "px-3 py-1 rounded-full text-sm font-medium",
              lead.status === 'NEW' ? "bg-blue-100 text-blue-700" :
              lead.status === 'QUALIFICATION' ? "bg-purple-100 text-purple-700" :
              lead.status === 'QUOTING' ? "bg-amber-100 text-amber-700" :
              lead.status === 'BOOKED' ? "bg-green-100 text-green-700" :
              "bg-gray-100 text-gray-700"
            )}>
              {lead.status}
            </div>
          </div>
        </div>

        {/* Urgent Tasks */}
        {(urgentTasks.length > 0 || overdueTasks.length > 0) && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium text-red-700">
                {overdueTasks.length > 0 ? 'Overdue Tasks' : 'Urgent Tasks'}
              </span>
            </div>
            {(overdueTasks.length > 0 ? overdueTasks : urgentTasks).slice(0, 2).map(task => (
              <div key={task.id} className="text-sm text-red-600 bg-red-50 p-2 rounded mb-1 border border-red-200">
                <div className="flex items-center justify-between">
                  <span>{overdueTasks.includes(task) ? '🚨 OVERDUE: ' : '⚡ URGENT: '}{task.description}</span>
                  <span className="text-xs text-red-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Payment Progress</span>
            <span>{Math.round((lead.payment.paid / lead.payment.total) * 100)}%</span>
          </div>
          <div 
            className="progress-modern" 
            style={{ '--progress': `${Math.round((lead.payment.paid / lead.payment.total) * 100)}%` } as React.CSSProperties}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleAction('call', lead)}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Phone className="h-4 w-4" />
              <span>Call</span>
            </button>
            <button 
              onClick={() => handleAction('email', lead)}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </button>
            <button 
              onClick={() => handleAction('whatsapp', lead)}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <MessageSquare className="h-4 w-4" />
              <span>WhatsApp</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleSelectLead(lead)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View Details →
            </button>
            <img
              src={lead.assignedTo.avatarUrl}
              alt={lead.assignedTo.name}
              className="h-8 w-8 rounded-full border border-gray-200"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Management Hub</h1>
          <p className="text-gray-600">AI-powered lead prioritization and management</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Add Lead</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* View Mode Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'timeline' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Zap className="h-4 w-4 inline mr-2" />
              Timeline
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <List className="h-4 w-4 inline mr-2" />
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'calendar' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Calendar
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'analytics' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <BarChart3 className="h-4 w-4 inline mr-2" />
              Analytics
            </button>
          </div>

          {/* Filters */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Leads</option>
            <option value="hot">🔥 Hot Leads</option>
            <option value="overdue">⏰ Overdue</option>
            <option value="high-value">💎 High Value</option>
            <option value="this-week">📅 This Week</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'timeline' && (
        <div className="space-y-6">
          {processedLeads.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
              <p className="text-gray-600">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            processedLeads
              .sort((a, b) => calculateLeadPriority(b) - calculateLeadPriority(a))
              .map(lead => (
                <TimelineLeadCard key={lead.id} lead={lead} />
              ))
          )}
        </div>
      )}

      {viewMode === 'list' && (
        <ListView 
          leads={processedLeads}
          onSelectLead={handleSelectLead}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      )}

      {viewMode === 'calendar' && (
        <CalendarView leads={processedLeads} />
      )}

      {viewMode === 'analytics' && (
        <AnalyticsView leads={processedLeads} />
      )}
    </div>
  );
}