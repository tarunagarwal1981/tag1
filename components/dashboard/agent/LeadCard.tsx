// Updated LeadCard.tsx - components/dashboard/agent/LeadCard.tsx

'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Flame,
  Clock,
  Users,
  TrendingUp,
  Flag,
  Brain,
  AlertTriangle,
  Phone,
  Mail,
  MessageSquare,
} from 'lucide-react';
import type { Lead, Task } from '@/lib/data';
import { cn } from '@/lib/utils';

// Helper function to check if a task is overdue
const isTaskOverdue = (task: Task): boolean => {
  if (task.isCompleted) return false;
  const dueDate = new Date(task.dueDate);
  const today = new Date('2025-09-02T00:00:00Z');
  dueDate.setUTCHours(0, 0, 0, 0);
  today.setUTCHours(0, 0, 0, 0);
  return dueDate < today;
};

// Helper to get the most urgent task
const getUrgentTask = (tasks: Task[]): Task | null => {
  const openTasks = tasks.filter((t) => !t.isCompleted);
  if (openTasks.length === 0) return null;

  const overdue = openTasks.find(isTaskOverdue);
  if (overdue) return overdue;

  const highPriority = openTasks.find((t) => t.priority === 'High');
  if (highPriority) return highPriority;

  const mediumPriority = openTasks.find((t) => t.priority === 'Medium');
  return mediumPriority || null;
};

export function LeadCard({
  lead,
  onSelectLead,
}: {
  lead: Lead;
  onSelectLead: (lead: Lead) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const urgentTask = getUrgentTask(lead.tasks);
  const progressPercent = Math.round(
    (lead.payment.paid / lead.payment.total) * 100
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onSelectLead(lead)}
      className="modern-card cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 touch-none p-4"
    >
      {/* Header with name and badges */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-sm flex-1 truncate pr-2">
          {lead.clientName}
        </h3>
        <div className="flex items-center gap-1 flex-shrink-0">
          {lead.temperature === 'HOT' && (
            <div className="status-hot status-indicator flex items-center gap-1">
              <Flame className="h-3 w-3" />
            </div>
          )}
          <div className="ai-indicator">
            <Brain className="h-3 w-3" />
            <span>{lead.aiScore}</span>
          </div>
        </div>
      </div>

      {/* Destination */}
      <p className="text-sm text-gray-600 mb-3 truncate">{lead.destination}</p>

      {/* Urgent Task Indicator */}
      {urgentTask && (
        <div
          className={cn(
            'flex items-center gap-2 text-xs mb-3 p-2 rounded-lg',
            isTaskOverdue(urgentTask)
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          )}
        >
          {isTaskOverdue(urgentTask) ? (
            <AlertTriangle className="h-3 w-3 flex-shrink-0" />
          ) : (
            <Clock className="h-3 w-3 flex-shrink-0" />
          )}
          <span className="truncate" title={urgentTask.description}>
            {isTaskOverdue(urgentTask) ? 'Overdue: ' : ''}
            {urgentTask.description}
          </span>
        </div>
      )}

      {/* Value and travelers */}
      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
        <div className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-emerald-500" />
          <span className="font-semibold text-emerald-600">
            €{lead.estimatedValue.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3 text-blue-500" />
          <span>{lead.travelerCount}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div
          className="progress-modern"
          style={{ '--progress': `${progressPercent}%` } as React.CSSProperties}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Phone className="h-3 w-3 text-gray-400" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Mail className="h-3 w-3 text-gray-400" />
          </button>
          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
            <MessageSquare className="h-3 w-3 text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <img
            src={lead.assignedTo.avatarUrl}
            alt={lead.assignedTo.name}
            className="h-6 w-6 rounded-full border border-gray-200"
          />
          <span className="text-xs font-medium text-gray-600 hidden sm:block">
            {lead.assignedTo.name.split(' ')[0]}
          </span>
          <div
            className={cn(
              'text-xs font-bold px-2 py-0.5 rounded-full ml-2',
              lead.aiScore > 85
                ? 'bg-emerald-100 text-emerald-800'
                : lead.aiScore > 70
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-800'
            )}
          >
            AI: {lead.aiScore}
          </div>
        </div>
      </div>
    </div>
  );
}
