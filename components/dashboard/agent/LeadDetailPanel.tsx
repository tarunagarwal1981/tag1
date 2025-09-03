'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  UserCircle,
  MessageSquare,
  CheckCircle,
  Paperclip,
  Plus,
  ArrowUpRight,
  Receipt,
  Ticket,
} from 'lucide-react';
import type { Lead, ActivityLog, Task, Document } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ... (StatCard, etc., sub-components are the same as before) ...
// The following are copied from the previous response for completeness
const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
    <div className="flex-shrink-0 bg-gray-200 p-2 rounded-full">
      <Icon className="h-5 w-5 text-gray-600" />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);
const ActivityItem = ({ activity }: { activity: ActivityLog }) => (
  <div className="flex gap-3">
    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
      <MessageSquare className="h-4 w-4 text-gray-600" />
    </div>
    <div>
      <p className="text-sm text-gray-800">{activity.content}</p>
      <p className="text-xs text-gray-500">
        by {activity.author} on{' '}
        {new Date(activity.timestamp).toLocaleDateString()}
      </p>
    </div>
  </div>
);

const DocumentItem = ({ doc }: { doc: Document }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-200">
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 bg-blue-100 p-2 rounded-lg">
        {doc.type === 'Quote' && <Receipt className="h-5 w-5 text-blue-600" />}
        {doc.type === 'Itinerary' && (
          <MapPin className="h-5 w-5 text-blue-600" />
        )}
        {doc.type === 'Ticket' && <Ticket className="h-5 w-5 text-blue-600" />}
        {doc.type === 'Voucher' && (
          <Receipt className="h-5 w-5 text-blue-600" />
        )}
      </div>
      <div>
        <a
          href={doc.url}
          className="text-sm font-medium text-gray-800 hover:text-blue-600"
        >
          {doc.name}
        </a>
        <p className="text-xs text-gray-500">
          Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
    <Button variant="ghost" size="sm">
      <ArrowUpRight className="h-4 w-4" />
    </Button>
  </div>
);
// End of copied sub-components

interface LeadDetailPanelProps {
  lead: Lead;
  onClose: () => void;
  onUpdateLead: (updatedLead: Lead) => void;
}

export function LeadDetailPanel({
  lead,
  onClose,
  onUpdateLead,
}: LeadDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<
    'summary' | 'tasks' | 'activity' | 'documents'
  >('summary');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newActivity, setNewActivity] = useState('');

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = lead.tasks.map((t) =>
      t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
    );
    onUpdateLead({ ...lead, tasks: updatedTasks });
  };

  const handleAddTask = () => {
    if (!newTaskDesc.trim()) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      description: newTaskDesc,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      isCompleted: false,
      priority: 'Medium', // ADD THIS LINE
    };
    onUpdateLead({ ...lead, tasks: [newTask, ...lead.tasks] });
    setNewTaskDesc('');
  };

  const handleLogActivity = () => {
    if (!newActivity.trim()) return;
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      type: 'NOTE', // Defaulting to NOTE for simplicity
      content: newActivity,
      timestamp: new Date().toISOString(),
      author: 'Anya Sharma', // Assuming current user
    };
    onUpdateLead({ ...lead, activity: [newLog, ...lead.activity] });
    setNewActivity('');
  };

  const paymentPercentage = (lead.payment.paid / lead.payment.total) * 100;

  // The TaskItem component needs the onToggle callback
  const TaskItem = ({ task }: { task: Task }) => (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleToggleTask(task.id)}
          className={cn(
            'h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all',
            task.isCompleted
              ? 'bg-blue-600 border-blue-600'
              : 'border-gray-400 hover:border-blue-500'
          )}
        >
          {task.isCompleted && <CheckCircle className="h-4 w-4 text-white" />}
        </button>
        <div>
          <p
            className={cn(
              'text-sm text-gray-800',
              task.isCompleted && 'line-through text-gray-500'
            )}
          >
            {task.description}
          </p>
          <p className="text-xs text-gray-500">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: '0%' }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col"
    >
      {/* Header and Tabs are the same as before */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{lead.clientName}</h2>
          <p className="text-sm text-gray-500 truncate">{lead.destination}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="border-b">
        <nav className="flex -mb-px px-4 gap-6">
          <button
            onClick={() => setActiveTab('summary')}
            className={cn(
              'py-3 px-1 border-b-2 font-medium text-sm',
              activeTab === 'summary'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={cn(
              'py-3 px-1 border-b-2 font-medium text-sm',
              activeTab === 'tasks'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            Tasks ({lead.tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={cn(
              'py-3 px-1 border-b-2 font-medium text-sm',
              activeTab === 'activity'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            Activity ({lead.activity.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={cn(
              'py-3 px-1 border-b-2 font-medium text-sm',
              activeTab === 'documents'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            Documents ({lead.documents.length})
          </button>
        </nav>
      </div>

      {/* Content with interactive forms */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        {activeTab === 'summary' /* Summary content is the same */ && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard
                icon={MapPin}
                label="Destination"
                value={lead.destination}
              />
              <StatCard
                icon={Calendar}
                label="Travel Dates"
                value={`${new Date(
                  lead.travelDates.from
                ).toLocaleDateString()} - ${new Date(
                  lead.travelDates.to
                ).toLocaleDateString()}`}
              />
              <StatCard
                icon={Users}
                label="Travelers"
                value={lead.travelerCount}
              />
              <StatCard
                icon={DollarSign}
                label="Value"
                value={`€${lead.estimatedValue.toLocaleString()}`}
              />
              <StatCard
                icon={UserCircle}
                label="Assigned To"
                value={lead.assignedTo.name}
              />
              <StatCard
                icon={TrendingUp}
                label="AI Score"
                value={lead.aiScore}
              />
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-3">Payment Status</h3>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600">
                  {lead.payment.status.replace('_', ' ')}
                </span>
                <span className="text-sm font-bold text-gray-800">
                  €{lead.payment.paid.toLocaleString()} / €
                  {lead.payment.total.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${paymentPercentage}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-3">Client Contact</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />{' '}
                  <a
                    href={`mailto:${lead.clientEmail}`}
                    className="text-blue-600 hover:underline"
                  >
                    {lead.clientEmail}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />{' '}
                  <span>{lead.clientPhone}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'tasks' && (
          <div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="Add a new task..."
                className="flex-grow border border-gray-300 rounded-lg text-sm p-2"
              />
              <Button onClick={handleAddTask}>
                <Plus className="h-4 w-4 mr-2" /> Add Task
              </Button>
            </div>
            <div className="space-y-2">
              {lead.tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}
        {activeTab === 'activity' && (
          <div>
            <div className="relative">
              <textarea
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Log an activity (call, email, note...)"
                className="w-full border rounded-lg p-2 pr-20"
                rows={2}
              ></textarea>
              <Button
                size="sm"
                className="absolute right-2 top-2"
                onClick={handleLogActivity}
              >
                Log Activity
              </Button>
            </div>
            <div className="mt-6 space-y-4">
              {lead.activity.map((act) => (
                <ActivityItem key={act.id} activity={act} />
              ))}
            </div>
          </div>
        )}
        {activeTab === 'documents' && (
          <div>
            <Button variant="outline" className="w-full mb-4">
              <Paperclip className="h-4 w-4 mr-2" /> Upload Document
            </Button>
            <div className="space-y-3">
              {lead.documents.map((doc) => (
                <DocumentItem key={doc.id} doc={doc} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
