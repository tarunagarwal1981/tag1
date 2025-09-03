// Complete Lead Management System - components/dashboard/agent/CompleteLeadManager.tsx
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
} from 'lucide-react';
import { leadsData, type Lead, type LeadStatus } from '@/lib/data';
import { cn } from '@/lib/utils';

type ViewMode = 'timeline' | 'list' | 'calendar' | 'analytics';
type FilterType = 'all' | 'hot' | 'overdue' | 'high-value' | 'this-week';

// AI Priority Engine
const calculateLeadPriority = (lead: Lead) => {
  let priority = 0;

  // AI Score weight (40%)
  priority += (lead.aiScore / 100) * 40;

  // Temperature weight (25%)
  if (lead.temperature === 'HOT') priority += 25;
  else if (lead.temperature === 'COLD') priority += 5;

  // Value weight (20%)
  priority += Math.min((lead.estimatedValue / 100000) * 20, 20);

  // Urgency weight (15%)
  const daysSinceUpdate =
    (new Date().getTime() - new Date(lead.updatedAt).getTime()) /
    (1000 * 60 * 60 * 24);
  if (daysSinceUpdate > 2) priority += 15;
  else if (daysSinceUpdate > 1) priority += 10;
  else priority += 5;

  return Math.round(priority);
};

// AI Recommendations Engine
const getAIRecommendations = (lead: Lead) => {
  const recommendations = [];
  const priority = calculateLeadPriority(lead);

  if (priority > 80) {
    recommendations.push({
      type: 'urgent',
      message: 'High conversion probability - call within 2 hours',
      action: 'Call Now',
    });
  }

  if (lead.aiScore > 85 && lead.status === 'NEW') {
    recommendations.push({
      type: 'opportunity',
      message: 'Premium lead detected - personalized approach recommended',
      action: 'Create Custom Pitch',
    });
  }

  if (lead.temperature === 'COLD' && lead.estimatedValue > 10000) {
    recommendations.push({
      type: 'strategy',
      message: 'High-value cold lead - consider value-driven follow-up',
      action: 'Send Value Proposition',
    });
  }

  return recommendations;
};

// Timeline Item Component
const TimelineLeadCard = ({
  lead,
  onAction,
}: {
  lead: Lead;
  onAction: (action: string, lead: Lead) => void;
}) => {
  const priority = calculateLeadPriority(lead);
  const recommendations = getAIRecommendations(lead);
  const urgentTasks = lead.tasks.filter(
    (t) => !t.isCompleted && t.priority === 'High'
  );

  return (
    <div className="modern-card p-6 hover:shadow-lg transition-all duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg text-gray-900">
              {lead.clientName}
            </h3>
            {lead.temperature === 'HOT' && (
              <span className="status-hot status-indicator">🔥 Hot</span>
            )}
            <div className="ai-indicator">
              <Brain className="h-3 w-3" />
              <span>{lead.aiScore}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
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
              <span className="font-semibold text-emerald-600">
                €{lead.estimatedValue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium',
              priority > 80
                ? 'bg-red-100 text-red-700'
                : priority > 60
                ? 'bg-amber-100 text-amber-700'
                : 'bg-blue-100 text-blue-700'
            )}
          >
            Priority: {priority}
          </div>

          <div
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium',
              lead.status === 'NEW'
                ? 'bg-blue-100 text-blue-700'
                : lead.status === 'QUALIFICATION'
                ? 'bg-purple-100 text-purple-700'
                : lead.status === 'QUOTING'
                ? 'bg-amber-100 text-amber-700'
                : lead.status === 'BOOKED'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            )}
          >
            {lead.status}
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              AI Recommendation
            </span>
          </div>
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-center justify-between">
              <p className="text-sm text-blue-700">{rec.message}</p>
              <button
                onClick={() =>
                  onAction(rec.action.toLowerCase().replace(/\s+/g, '-'), lead)
                }
                className="text-xs font-medium text-blue-600 hover:text-blue-800 ml-2"
              >
                {rec.action} →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Urgent Tasks */}
      {urgentTasks.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-700">
              Urgent Tasks
            </span>
          </div>
          {urgentTasks.map((task) => (
            <div
              key={task.id}
              className="text-sm text-red-600 bg-red-50 p-2 rounded mb-1"
            >
              {task.description}
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAction('call', lead)}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Phone className="h-4 w-4" />
            <span>Call</span>
          </button>
          <button
            onClick={() => onAction('email', lead)}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </button>
          <button
            onClick={() => onAction('whatsapp', lead)}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <MessageSquare className="h-4 w-4" />
            <span>WhatsApp</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onAction('view-details', lead)}
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

// Analytics Summary Component
const AnalyticsSummary = ({ leads }: { leads: Lead[] }) => {
  const analytics = useMemo(() => {
    const total = leads.length;
    const hotLeads = leads.filter((l) => l.temperature === 'HOT').length;
    const totalValue = leads.reduce((sum, l) => sum + l.estimatedValue, 0);
    const avgAIScore = Math.round(
      leads.reduce((sum, l) => sum + l.aiScore, 0) / total
    );
    const conversionRate = Math.round(
      (leads.filter((l) => l.status === 'BOOKED').length / total) * 100
    );

    return { total, hotLeads, totalValue, avgAIScore, conversionRate };
  }, [leads]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div className="modern-card p-4 text-center">
        <div className="text-2xl font-bold text-gray-900">
          {analytics.total}
        </div>
        <div className="text-sm text-gray-600">Total Leads</div>
      </div>
      <div className="modern-card p-4 text-center">
        <div className="text-2xl font-bold text-red-600">
          {analytics.hotLeads}
        </div>
        <div className="text-sm text-gray-600">Hot Leads</div>
      </div>
      <div className="modern-card p-4 text-center">
        <div className="text-2xl font-bold text-emerald-600">
          €{Math.round(analytics.totalValue / 1000)}K
        </div>
        <div className="text-sm text-gray-600">Pipeline Value</div>
      </div>
      <div className="modern-card p-4 text-center">
        <div className="text-2xl font-bold text-blue-600">
          {analytics.avgAIScore}
        </div>
        <div className="text-sm text-gray-600">Avg AI Score</div>
      </div>
      <div className="modern-card p-4 text-center">
        <div className="text-2xl font-bold text-purple-600">
          {analytics.conversionRate}%
        </div>
        <div className="text-sm text-gray-600">Conversion Rate</div>
      </div>
    </div>
  );
};

export function CompleteLeadManager() {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort leads
  const processedLeads = useMemo(() => {
    let filtered = leadsData.filter((lead) => {
      // Search filter
      if (
        searchTerm &&
        !lead.clientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !lead.destination.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      switch (filter) {
        case 'hot':
          return lead.temperature === 'HOT';
        case 'overdue':
          return lead.tasks.some(
            (t) => !t.isCompleted && new Date(t.dueDate) < new Date()
          );
        case 'high-value':
          return lead.estimatedValue > 10000;
        case 'this-week':
          const weekFromNow = new Date();
          weekFromNow.setDate(weekFromNow.getDate() + 7);
          return lead.tasks.some(
            (t) => !t.isCompleted && new Date(t.dueDate) <= weekFromNow
          );
        default:
          return true;
      }
    });

    // Sort by AI priority
    return filtered.sort(
      (a, b) => calculateLeadPriority(b) - calculateLeadPriority(a)
    );
  }, [filter, searchTerm]);

  const handleAction = (action: string, lead: Lead) => {
    console.log(`Action: ${action} for lead: ${lead.clientName}`);
    // Implement actual actions here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Lead Management Hub
          </h1>
          <p className="text-gray-600">
            AI-powered lead prioritization and management
          </p>
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
                viewMode === 'timeline'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Zap className="h-4 w-4 inline mr-2" />
              Timeline
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <List className="h-4 w-4 inline mr-2" />
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'calendar'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Calendar className="h-4 w-4 inline mr-2" />
              Calendar
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                viewMode === 'analytics'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
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

      {/* Analytics Summary */}
      <AnalyticsSummary leads={processedLeads} />

      {/* Content based on view mode */}
      {viewMode === 'timeline' && (
        <div className="space-y-6">
          {processedLeads.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No leads found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search term.
              </p>
            </div>
          ) : (
            processedLeads.map((lead) => (
              <TimelineLeadCard
                key={lead.id}
                lead={lead}
                onAction={handleAction}
              />
            ))
          )}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="modern-card p-6">
          <div className="text-center py-12">
            <List className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              List View
            </h3>
            <p className="text-gray-600">Detailed table view coming next...</p>
          </div>
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="modern-card p-6">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Calendar View
            </h3>
            <p className="text-gray-600">
              Follow-up scheduling calendar coming next...
            </p>
          </div>
        </div>
      )}

      {viewMode === 'analytics' && (
        <div className="modern-card p-6">
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Analytics Dashboard
            </h3>
            <p className="text-gray-600">
              Detailed analytics and reporting coming next...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
