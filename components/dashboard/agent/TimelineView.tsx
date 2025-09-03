// Complete Timeline View - components/dashboard/agent/TimelineView.tsx

'use client';

import { useState } from 'react';
import {
  Brain,
  Calendar,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Users,
  DollarSign,
  MapPin,
  Star,
  ArrowRight,
  Plus,
  Edit,
  Eye,
  Flame,
  Flag,
  FileText,
  Send,
  X,
} from 'lucide-react';
import {
  leadsData,
  type Lead,
  type ActivityLog,
  subAgentsData,
} from '@/lib/data';
import { cn } from '@/lib/utils';

// Enhanced Priority Calculation
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
  const daysSinceUpdate =
    (new Date().getTime() - new Date(lead.updatedAt).getTime()) /
    (1000 * 60 * 60 * 24);
  if (daysSinceUpdate > 2) priority += 15;
  else if (daysSinceUpdate > 1) priority += 10;
  else priority += 5;

  // Overdue tasks weight (10%)
  const overdueTasks = lead.tasks.filter(
    (t) => !t.isCompleted && new Date(t.dueDate) < new Date()
  ).length;
  if (overdueTasks > 0) priority += 10;

  return Math.round(priority);
};

// AI Recommendations based on lead data
const getAIRecommendations = (lead: Lead) => {
  const recommendations = [];
  const priority = calculateLeadPriority(lead);
  const daysSinceUpdate =
    (new Date().getTime() - new Date(lead.updatedAt).getTime()) /
    (1000 * 60 * 60 * 24);

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
      message: 'Premium lead - use personalized approach',
      action: 'Create Custom Pitch',
    });
  }

  if (daysSinceUpdate > 3) {
    recommendations.push({
      type: 'follow-up',
      message: 'No activity for 3+ days - schedule follow-up',
      action: 'Schedule Follow-up',
    });
  }

  if (lead.temperature === 'COLD' && lead.estimatedValue > 15000) {
    recommendations.push({
      type: 'strategy',
      message: 'High-value cold lead - consider value proposition',
      action: 'Send Value Demo',
    });
  }

  return recommendations;
};

// Add Comment Modal
const AddCommentModal = ({
  lead,
  isOpen,
  onClose,
  onAddComment,
}: {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
  onAddComment: (comment: string, type: ActivityLog['type']) => void;
}) => {
  const [comment, setComment] = useState('');
  const [commentType, setCommentType] = useState<ActivityLog['type']>('NOTE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onAddComment(comment.trim(), commentType);
      setComment('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Add Comment - {lead.clientName}
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
                Comment Type
              </label>
              <select
                value={commentType}
                onChange={(e) =>
                  setCommentType(e.target.value as ActivityLog['type'])
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="NOTE">General Note</option>
                <option value="CALL">Call Log</option>
                <option value="EMAIL">Email Log</option>
                <option value="FOLLOW_UP">Follow-up Reminder</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your comment..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Add Comment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Lead History Modal
const LeadHistoryModal = ({
  lead,
  isOpen,
  onClose,
}: {
  lead: Lead;
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  const sortedActivity = [...lead.activity].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const activityIcons = {
    NOTE: <FileText className="h-4 w-4 text-gray-600" />,
    CALL: <Phone className="h-4 w-4 text-blue-600" />,
    EMAIL: <Mail className="h-4 w-4 text-green-600" />,
    STATUS_CHANGE: <ArrowRight className="h-4 w-4 text-purple-600" />,
    QUOTE_SENT: <FileText className="h-4 w-4 text-orange-600" />,
    FOLLOW_UP: <Clock className="h-4 w-4 text-amber-600" />,
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] shadow-xl overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Complete History - {lead.clientName}
              </h3>
              <p className="text-sm text-gray-600">{lead.destination}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
          <div className="space-y-4">
            {sortedActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white flex items-center justify-center border shadow-sm">
                  {activityIcons[activity.type]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {activity.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500">
                      by {activity.author}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    {activity.content}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Timeline Lead Card
const TimelineLeadCard = ({
  lead,
  onAction,
  onAddComment,
  onViewHistory,
}: {
  lead: Lead;
  onAction: (action: string, lead: Lead) => void;
  onAddComment: (lead: Lead) => void;
  onViewHistory: (lead: Lead) => void;
}) => {
  const priority = calculateLeadPriority(lead);
  const recommendations = getAIRecommendations(lead);
  const urgentTasks = lead.tasks.filter(
    (t) => !t.isCompleted && t.priority === 'High'
  );
  const overdueTasks = lead.tasks.filter(
    (t) => !t.isCompleted && new Date(t.dueDate) < new Date()
  );
  const recentActivity = lead.activity.slice(0, 2);

  // Get latest communication
  const lastCommunication = lead.activity
    .filter((a) => ['CALL', 'EMAIL', 'FOLLOW_UP'].includes(a.type))
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )[0];

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
              <span className="status-hot status-indicator flex items-center gap-1">
                <Flame className="h-3 w-3" />
                Hot
              </span>
            )}
            <div className="ai-indicator">
              <Brain className="h-3 w-3" />
              <span>{lead.aiScore}</span>
            </div>
            <div
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                priority > 80
                  ? 'bg-red-100 text-red-700'
                  : priority > 60
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-blue-100 text-blue-700'
              )}
            >
              Priority: {priority}
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
              <span className="font-semibold text-emerald-600">
                €{lead.estimatedValue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(lead.travelDates.from).toLocaleDateString('en-GB', {
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                -{' '}
                {new Date(lead.travelDates.to).toLocaleDateString('en-GB', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Status and Last Communication */}
          <div className="flex items-center gap-4 mb-3">
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
              {lead.status.replace('_', ' ')}
            </div>

            {lastCommunication && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>
                  Last {lastCommunication.type.toLowerCase()}{' '}
                  {Math.round(
                    (new Date().getTime() -
                      new Date(lastCommunication.timestamp).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{' '}
                  days ago
                </span>
              </div>
            )}
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
          {recommendations.slice(0, 2).map((rec, index) => (
            <div key={index} className="flex items-center justify-between mb-1">
              <p className="text-sm text-blue-700">{rec.message}</p>
              <button
                onClick={() =>
                  onAction(rec.action.toLowerCase().replace(/\s+/g, '-'), lead)
                }
                className="text-xs font-medium text-blue-600 hover:text-blue-800 ml-2 whitespace-nowrap"
              >
                {rec.action} →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Urgent/Overdue Tasks */}
      {(urgentTasks.length > 0 || overdueTasks.length > 0) && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-700">
              {overdueTasks.length > 0 ? 'Overdue Tasks' : 'Urgent Tasks'}
            </span>
          </div>
          {(overdueTasks.length > 0 ? overdueTasks : urgentTasks)
            .slice(0, 2)
            .map((task) => (
              <div
                key={task.id}
                className="text-sm text-red-600 bg-red-50 p-2 rounded mb-1 border border-red-200"
              >
                <div className="flex items-center justify-between">
                  <span>
                    {overdueTasks.includes(task)
                      ? '🚨 OVERDUE: '
                      : '⚡ URGENT: '}
                    {task.description}
                  </span>
                  <span className="text-xs text-red-500">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Recent Activity */}
      {recentActivity.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Recent Activity
            </span>
            <button
              onClick={() => onViewHistory(lead)}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              View All →
            </button>
          </div>
          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-2 text-xs">
                <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center mt-0.5">
                  {activity.type === 'CALL' ? (
                    <Phone className="h-2 w-2" />
                  ) : activity.type === 'EMAIL' ? (
                    <Mail className="h-2 w-2" />
                  ) : (
                    <FileText className="h-2 w-2" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-gray-700">{activity.content}</p>
                  <p className="text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleDateString('en-GB')}{' '}
                    by {activity.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Payment Progress</span>
          <span>
            {Math.round((lead.payment.paid / lead.payment.total) * 100)}%
          </span>
        </div>
        <div
          className="progress-modern"
          style={
            {
              '--progress': `${Math.round(
                (lead.payment.paid / lead.payment.total) * 100
              )}%`,
            } as React.CSSProperties
          }
        />
      </div>

      {/* Action Buttons */}
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
          <button
            onClick={() => onAddComment(lead)}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Comment</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewHistory(lead)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
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

// Main Timeline View Component
export function TimelineView({
  leads,
  onUpdateLead,
}: {
  leads: Lead[];
  onUpdateLead: (updatedLead: Lead) => void;
}) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddComment, setShowAddComment] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Sort leads by priority
  const sortedLeads = [...leads].sort(
    (a, b) => calculateLeadPriority(b) - calculateLeadPriority(a)
  );

  const handleAction = (action: string, lead: Lead) => {
    console.log(`Action: ${action} for lead: ${lead.clientName}`);
    // Implement actual actions here
  };

  const handleAddComment = (comment: string, type: ActivityLog['type']) => {
    if (!selectedLead) return;

    const newActivity: ActivityLog = {
      id: `act-${Date.now()}`,
      type,
      content: comment,
      timestamp: new Date().toISOString(),
      author: 'Anya Sharma',
    };

    const updatedLead: Lead = {
      ...selectedLead,
      activity: [newActivity, ...selectedLead.activity],
      updatedAt: new Date().toISOString(),
    };

    onUpdateLead(updatedLead);
  };

  const handleViewHistory = (lead: Lead) => {
    setSelectedLead(lead);
    setShowHistory(true);
  };

  const handleAddCommentClick = (lead: Lead) => {
    setSelectedLead(lead);
    setShowAddComment(true);
  };

  return (
    <div className="space-y-6">
      {sortedLeads.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No leads found
          </h3>
          <p className="text-gray-600">
            Try adjusting your filters or search term.
          </p>
        </div>
      ) : (
        sortedLeads.map((lead) => (
          <TimelineLeadCard
            key={lead.id}
            lead={lead}
            onAction={handleAction}
            onAddComment={handleAddCommentClick}
            onViewHistory={handleViewHistory}
          />
        ))
      )}

      {/* Add Comment Modal */}
      {selectedLead && (
        <AddCommentModal
          lead={selectedLead}
          isOpen={showAddComment}
          onClose={() => setShowAddComment(false)}
          onAddComment={handleAddComment}
        />
      )}

      {/* Lead History Modal */}
      {selectedLead && (
        <LeadHistoryModal
          lead={selectedLead}
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
