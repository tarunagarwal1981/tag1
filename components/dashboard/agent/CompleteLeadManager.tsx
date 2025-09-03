// components/dashboard/agent/CompleteLeadManager.tsx
'use client';

import { useState, useMemo } from 'react';
import { 
  Brain, Calendar, List, BarChart3, Plus, Search, Phone, Mail, MessageSquare, 
  Clock, AlertTriangle, CheckCircle2, TrendingUp, Users, DollarSign, MapPin, 
  Zap, Target, Star, ArrowRight, Eye, X, Send, Paperclip, ChevronDown, 
  User, Thermometer, Flag, FileText, Edit, Save, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface Lead {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  destination: string;
  travelDates: { from: string; to: string };
  travelerCount: number;
  estimatedValue: number;
  status: 'NEW' | 'QUALIFICATION' | 'QUOTING' | 'NEGOTIATION' | 'BOOKED' | 'OPERATIONS';
  temperature: 'HOT' | 'WARM' | 'COLD' | 'HOLD';
  aiScore: number;
  assignedTo: { name: string; avatarUrl: string };
  createdAt: string;
  updatedAt: string;
  activity: Activity[];
  tasks: Task[];
  payment: { total: number; paid: number; status: string };
}

interface Activity {
  id: string;
  type: 'CALL' | 'EMAIL' | 'WHATSAPP' | 'NOTE' | 'MEETING' | 'FOLLOW_UP';
  content: string;
  timestamp: string;
  author: string;
}

interface Task {
  id: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  isCompleted: boolean;
}

// Sample leads data
const sampleLeadsData: Lead[] = [
  {
    id: 'LEAD-001',
    clientName: 'Sarah & Mike Johnson',
    clientEmail: 'sarah.johnson@email.com',
    clientPhone: '+44 7700 900123',
    destination: 'Bali & Singapore',
    travelDates: { from: '2025-12-15', to: '2025-12-28' },
    travelerCount: 2,
    estimatedValue: 8500,
    status: 'QUOTING',
    temperature: 'HOT',
    aiScore: 92,
    assignedTo: { name: 'Anya Sharma', avatarUrl: '/api/placeholder/32/32' },
    createdAt: '2025-08-15T10:30:00Z',
    updatedAt: '2025-09-02T14:20:00Z',
    activity: [
      {
        id: '1',
        type: 'CALL',
        content: 'Client called - very interested in luxury villas. Budget confirmed at £8,500. Wants romantic settings for honeymoon.',
        timestamp: '2025-09-02T14:20:00Z',
        author: 'Anya Sharma'
      },
      {
        id: '2',
        type: 'EMAIL',
        content: 'Sent initial quote with 3 villa options in Ubud and Seminyak. Included romantic dinner packages.',
        timestamp: '2025-09-01T11:15:00Z',
        author: 'Anya Sharma'
      }
    ],
    tasks: [
      {
        id: 'T1',
        description: 'Follow up on villa selection',
        dueDate: '2025-09-04T10:00:00Z',
        priority: 'High',
        isCompleted: false
      },
      {
        id: 'T2',
        description: 'Send restaurant recommendations for Ubud',
        dueDate: '2025-09-03T16:00:00Z',
        priority: 'Medium',
        isCompleted: false
      }
    ],
    payment: { total: 8500, paid: 0, status: 'UNPAID' }
  },
  {
    id: 'LEAD-002',
    clientName: 'Robert Chen',
    clientEmail: 'robert.chen@techcorp.com',
    clientPhone: '+1 415 555 0123',
    destination: 'Tokyo Business Trip',
    travelDates: { from: '2025-10-10', to: '2025-10-15' },
    travelerCount: 1,
    estimatedValue: 3200,
    status: 'NEW',
    temperature: 'WARM',
    aiScore: 76,
    assignedTo: { name: 'James Miller', avatarUrl: '/api/placeholder/32/32' },
    createdAt: '2025-09-01T09:15:00Z',
    updatedAt: '2025-09-01T09:15:00Z',
    activity: [
      {
        id: '3',
        type: 'EMAIL',
        content: 'Initial inquiry received. Client needs business-class flights and 4-star hotel in Shibuya area.',
        timestamp: '2025-09-01T09:15:00Z',
        author: 'James Miller'
      }
    ],
    tasks: [
      {
        id: 'T3',
        description: 'Send initial quote for Tokyo business trip',
        dueDate: '2025-09-02T17:00:00Z',
        priority: 'High',
        isCompleted: false
      }
    ],
    payment: { total: 3200, paid: 0, status: 'UNPAID' }
  },
  {
    id: 'LEAD-003',
    clientName: 'Emily & David Wilson',
    clientEmail: 'emily.wilson@gmail.com',
    clientPhone: '+44 7890 123456',
    destination: 'European Grand Tour',
    travelDates: { from: '2026-06-01', to: '2026-06-21' },
    travelerCount: 4,
    estimatedValue: 18500,
    status: 'NEGOTIATION',
    temperature: 'HOT',
    aiScore: 88,
    assignedTo: { name: 'Anya Sharma', avatarUrl: '/api/placeholder/32/32' },
    createdAt: '2025-08-20T14:30:00Z',
    updatedAt: '2025-09-01T16:45:00Z',
    activity: [
      {
        id: '4',
        type: 'CALL',
        content: 'Family wants to visit Paris, Rome, Barcelona, and Amsterdam. Discussing hotel upgrades and train vs flight options.',
        timestamp: '2025-09-01T16:45:00Z',
        author: 'Anya Sharma'
      },
      {
        id: '5',
        type: 'NOTE',
        content: 'Kids are 8 and 12 years old. Need family-friendly activities. Budget flexibility for special experiences.',
        timestamp: '2025-08-25T11:20:00Z',
        author: 'Anya Sharma'
      }
    ],
    tasks: [
      {
        id: 'T4',
        description: 'Research family-friendly activities in each city',
        dueDate: '2025-09-03T14:00:00Z',
        priority: 'Medium',
        isCompleted: false
      },
      {
        id: 'T5',
        description: 'Calculate train vs flight costs for family',
        dueDate: '2025-09-02T12:00:00Z',
        priority: 'High',
        isCompleted: true
      }
    ],
    payment: { total: 18500, paid: 2000, status: 'DEPOSIT_PAID' }
  },
  {
    id: 'LEAD-004',
    clientName: 'Marcus Anderson',
    clientEmail: 'marcus.anderson@gmail.com',
    clientPhone: '+1 555 678 9012',
    destination: 'African Safari',
    travelDates: { from: '2025-11-15', to: '2025-11-29' },
    travelerCount: 2,
    estimatedValue: 12500,
    status: 'BOOKED',
    temperature: 'HOT',
    aiScore: 95,
    assignedTo: { name: 'Sarah Thompson', avatarUrl: '/api/placeholder/32/32' },
    createdAt: '2025-08-10T08:30:00Z',
    updatedAt: '2025-08-30T14:15:00Z',
    activity: [
      {
        id: '6',
        type: 'CALL',
        content: 'Final confirmation received. Client paid full amount. Excited about the Serengeti experience.',
        timestamp: '2025-08-30T14:15:00Z',
        author: 'Sarah Thompson'
      },
      {
        id: '7',
        type: 'EMAIL',
        content: 'Sent pre-departure information and packing list. All documents confirmed.',
        timestamp: '2025-08-28T10:30:00Z',
        author: 'Sarah Thompson'
      }
    ],
    tasks: [
      {
        id: 'T6',
        description: 'Send final itinerary and vouchers',
        dueDate: '2025-11-10T12:00:00Z',
        priority: 'High',
        isCompleted: false
      },
      {
        id: 'T7',
        description: 'Confirm safari guide and vehicle',
        dueDate: '2025-11-05T15:00:00Z',
        priority: 'Medium',
        isCompleted: false
      }
    ],
    payment: { total: 12500, paid: 12500, status: 'FULLY_PAID' }
  },
  {
    id: 'LEAD-005',
    clientName: 'Lisa Rodriguez',
    clientEmail: 'lisa.rodriguez@marketing.com',
    clientPhone: '+1 555 234 5678',
    destination: 'Iceland Northern Lights',
    travelDates: { from: '2026-02-10', to: '2026-02-17' },
    travelerCount: 1,
    estimatedValue: 4800,
    status: 'QUALIFICATION',
    temperature: 'COLD',
    aiScore: 65,
    assignedTo: { name: 'James Miller', avatarUrl: '/api/placeholder/32/32' },
    createdAt: '2025-08-28T16:45:00Z',
    updatedAt: '2025-08-29T09:20:00Z',
    activity: [
      {
        id: '8',
        type: 'EMAIL',
        content: 'Client interested in Northern Lights tour but concerned about weather conditions and budget.',
        timestamp: '2025-08-29T09:20:00Z',
        author: 'James Miller'
      }
    ],
    tasks: [
      {
        id: 'T8',
        description: 'Research best months for Northern Lights visibility',
        dueDate: '2025-09-05T17:00:00Z',
        priority: 'Medium',
        isCompleted: false
      },
      {
        id: 'T9',
        description: 'Prepare budget-friendly options',
        dueDate: '2025-09-03T12:00:00Z',
        priority: 'Medium',
        isCompleted: false
      }
    ],
    payment: { total: 4800, paid: 0, status: 'UNPAID' }
  }
];

type ViewMode = 'timeline' | 'list' | 'calendar' | 'analytics';
type FilterType = 'all' | 'hot' | 'overdue' | 'high-value' | 'this-week';

const statusOptions = ['NEW', 'QUALIFICATION', 'QUOTING', 'NEGOTIATION', 'BOOKED', 'OPERATIONS'];
const temperatureOptions = ['HOT', 'WARM', 'COLD', 'HOLD'];
const activityTypes = ['CALL', 'EMAIL', 'WHATSAPP', 'NOTE', 'MEETING', 'FOLLOW_UP'];
const priorityOptions = ['Low', 'Medium', 'High'];

// Lead Detail Panel Component
interface LeadDetailPanelProps {
  lead: Lead;
  onClose: () => void;
  onUpdateLead: (lead: Lead) => void;
}

const LeadDetailPanel: React.FC<LeadDetailPanelProps> = ({ lead, onClose, onUpdateLead }) => {
  const [newActivity, setNewActivity] = useState({ content: '', type: 'NOTE' });
  const [newTask, setNewTask] = useState({ description: '', priority: 'Medium', dueDate: '' });

  const addActivity = () => {
    if (!newActivity.content.trim()) return;
    
    const activity: Activity = {
      id: Date.now().toString(),
      type: newActivity.type as Activity['type'],
      content: newActivity.content,
      timestamp: new Date().toISOString(),
      author: lead.assignedTo.name
    };
    
    const updatedLead = {
      ...lead,
      activity: [activity, ...lead.activity],
      updatedAt: new Date().toISOString()
    };
    
    onUpdateLead(updatedLead);
    setNewActivity({ content: '', type: 'NOTE' });
  };

  const addTask = () => {
    if (!newTask.description.trim() || !newTask.dueDate) return;
    
    const task: Task = {
      id: Date.now().toString(),
      description: newTask.description,
      dueDate: newTask.dueDate,
      priority: newTask.priority as Task['priority'],
      isCompleted: false
    };
    
    const updatedLead = {
      ...lead,
      tasks: [task, ...lead.tasks]
    };
    
    onUpdateLead(updatedLead);
    setNewTask({ description: '', priority: 'Medium', dueDate: '' });
  };

  const updateStatus = (field: keyof Lead, value: any) => {
    const updatedLead = {
      ...lead,
      [field]: value,
      updatedAt: new Date().toISOString()
    };
    onUpdateLead(updatedLead);
  };

  const toggleTask = (taskId: string) => {
    const updatedTasks = lead.tasks.map(task => 
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    );
    onUpdateLead({ ...lead, tasks: updatedTasks });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-1/2 bg-white shadow-2xl z-50 overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <button className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium hover:bg-white/30 transition-colors">
                <Phone className="h-3 w-3 inline mr-1" />
                Call
              </button>
              <button className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium hover:bg-white/30 transition-colors">
                <MessageSquare className="h-3 w-3 inline mr-1" />
                WhatsApp
              </button>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{lead.clientName}</h2>
              <div className="space-y-1 text-white/90">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{lead.clientPhone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{lead.clientEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{lead.destination}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold mb-2">
                AI Score: {lead.aiScore}
              </div>
              <div className="text-2xl font-bold">
                £{lead.estimatedValue.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Quick Status Controls */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Status:</span>
              <select 
                value={lead.status} 
                onChange={(e) => updateStatus('status', e.target.value)}
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded px-2 py-1 text-sm text-white placeholder-white/70 focus:bg-white/30"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status} className="text-gray-900">{status}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">Temperature:</span>
              <select 
                value={lead.temperature} 
                onChange={(e) => updateStatus('temperature', e.target.value)}
                className="bg-white/20 backdrop-blur-sm border border-white/30 rounded px-2 py-1 text-sm text-white placeholder-white/70 focus:bg-white/30"
              >
                {temperatureOptions.map(temp => (
                  <option key={temp} value={temp} className="text-gray-900">{temp}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Quick Add Activity */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Add Activity</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <select 
                    value={newActivity.type}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, type: e.target.value }))}
                    className="px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {activityTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <button 
                    onClick={addActivity}
                    disabled={!newActivity.content.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
                <textarea
                  value={newActivity.content}
                  onChange={(e) => setNewActivity(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="What happened? Describe the interaction, outcome, or next steps..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows={3}
                />
              </div>
            </div>

            {/* Activity Timeline */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Activity Timeline</h3>
              <div className="space-y-4">
                {lead.activity.map((activity) => (
                  <div key={activity.id} className="flex gap-3 pb-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {activity.type === 'CALL' && <Phone className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'EMAIL' && <Mail className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'WHATSAPP' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'NOTE' && <FileText className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 text-sm">{activity.type}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{activity.content}</p>
                      <p className="text-xs text-gray-500 mt-1">by {activity.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Task */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Add Task</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Task description..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <div className="flex gap-2">
                  <select 
                    value={newTask.priority}
                    onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {priorityOptions.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
                  <input
                    type="datetime-local"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button 
                  onClick={addTask}
                  disabled={!newTask.description.trim() || !newTask.dueDate}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                >
                  Add Task
                </button>
              </div>
            </div>

            {/* Tasks List */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Tasks</h3>
              <div className="space-y-2">
                {lead.tasks.map((task) => (
                  <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg border ${task.isCompleted ? 'bg-gray-50' : 'bg-white'}`}>
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 h-4 w-4 rounded border-2 flex items-center justify-center transition-all mt-0.5 ${
                        task.isCompleted 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {task.isCompleted && <CheckCircle2 className="h-3 w-3" />}
                    </button>
                    
                    <div className="flex-1">
                      <span className={`text-sm block ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.description}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          task.priority === 'High' ? 'bg-red-100 text-red-700' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()} at {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {lead.tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No tasks yet. Add your first task above.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Timeline Lead Card Component
interface TimelineLeadCardProps {
  lead: Lead;
  onClick: (lead: Lead) => void;
}

const TimelineLeadCard: React.FC<TimelineLeadCardProps> = ({ lead, onClick }) => {
  const calculatePriority = (lead: Lead): number => {
    let priority = 0;
    priority += (lead.aiScore / 100) * 40;
    if (lead.temperature === 'HOT') priority += 25;
    priority += Math.min((lead.estimatedValue / 100000) * 20, 20);
    const daysSinceUpdate = (new Date().getTime() - new Date(lead.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > 2) priority += 15;
    return Math.round(priority);
  };

  const priority = calculatePriority(lead);
  const urgentTasks = lead.tasks.filter(t => !t.isCompleted && t.priority === 'High');
  const overdueTasks = lead.tasks.filter(t => !t.isCompleted && new Date(t.dueDate) < new Date());
  
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all duration-200 cursor-pointer" onClick={() => onClick(lead)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg text-gray-900">{lead.clientName}</h3>
            {lead.temperature === 'HOT' && (
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                🔥 Hot
              </span>
            )}
            <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full">
              <Brain className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">{lead.aiScore}</span>
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
              <span className="font-semibold text-emerald-600">£{lead.estimatedValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            priority > 80 ? "bg-red-100 text-red-700" :
            priority > 60 ? "bg-amber-100 text-amber-700" :
            "bg-blue-100 text-blue-700"
          }`}>
            Priority: {priority}
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            lead.status === 'NEW' ? "bg-blue-100 text-blue-700" :
            lead.status === 'QUALIFICATION' ? "bg-purple-100 text-purple-700" :
            lead.status === 'QUOTING' ? "bg-amber-100 text-amber-700" :
            lead.status === 'NEGOTIATION' ? "bg-orange-100 text-orange-700" :
            lead.status === 'BOOKED' ? "bg-green-100 text-green-700" :
            "bg-gray-100 text-gray-700"
          }`}>
            {lead.status}
          </div>
        </div>
      </div>

      {/* Show overdue or urgent tasks */}
      {(overdueTasks.length > 0 || urgentTasks.length > 0) && (
        <div className="mb-4">
          {overdueTasks.length > 0 ? (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-700">Overdue Tasks</span>
              </div>
              {overdueTasks.slice(0, 2).map(task => (
                <div key={task.id} className="text-sm text-red-600 mb-1 last:mb-0">
                  🚨 OVERDUE: {task.description}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-700">Urgent Tasks</span>
              </div>
              {urgentTasks.slice(0, 2).map(task => (
                <div key={task.id} className="text-sm text-orange-600 mb-1 last:mb-0">
                  ⚡ URGENT: {task.description}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payment Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Payment Progress</span>
          <span>{Math.round((lead.payment.paid / lead.payment.total) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.round((lead.payment.paid / lead.payment.total) * 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); console.log('Call', lead.clientName); }}
            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors"
          >
            <Phone className="h-3 w-3 inline mr-1" />
            Call
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); console.log('WhatsApp', lead.clientName); }}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
          >
            <MessageSquare className="h-3 w-3 inline mr-1" />
            WhatsApp
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); console.log('Email', lead.clientName); }}
            className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
          >
            <Mail className="h-3 w-3 inline mr-1" />
            Email
          </button>
        </div>

        <div className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
          <span>Manage</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

// Main Component
export function CompleteLeadManager() {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leads, setLeads] = useState<Lead[]>(sampleLeadsData);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  // Calculate priority for timeline sorting
  const calculateLeadPriority = (lead: Lead): number => {
    let priority = 0;
    priority += (lead.aiScore / 100) * 40;
    if (lead.temperature === 'HOT') priority += 25;
    priority += Math.min((lead.estimatedValue / 100000) * 20, 20);
    const daysSinceUpdate = (new Date().getTime() - new Date(lead.updatedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceUpdate > 2) priority += 15;
    return Math.round(priority);
  };

  // Filter leads based on current filter
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (searchTerm && !lead.clientName.toLowerCase().includes(searchTerm.toLowerCase()) 
          && !lead.destination.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
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
  }, [leads, filter, searchTerm]);

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailPanel(true);
  };

  const handleUpdateLead = (updatedLead: Lead) => {
    setLeads(prevLeads => 
      prevLeads.map(lead => 
        lead.id === updatedLead.id ? updatedLead : lead
      )
    );
    setSelectedLead(updatedLead);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lead Management Hub</h1>
          <p className="text-gray-600">AI-powered lead prioritization and management</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
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

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{filteredLeads.length}</div>
          <div className="text-sm text-gray-600">Total Leads</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {filteredLeads.filter(l => l.temperature === 'HOT').length}
          </div>
          <div className="text-sm text-gray-600">Hot Leads</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">
            £{Math.round(filteredLeads.reduce((sum, l) => sum + l.estimatedValue, 0) / 1000)}K
          </div>
          <div className="text-sm text-gray-600">Pipeline Value</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(filteredLeads.reduce((sum, l) => sum + l.aiScore, 0) / filteredLeads.length) || 0}
          </div>
          <div className="text-sm text-gray-600">Avg AI Score</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {filteredLeads.filter(l => l.status === 'BOOKED').length}
          </div>
          <div className="text-sm text-gray-600">Bookings</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={cn("transition-all duration-300", showDetailPanel ? 'mr-[50%]' : '')}>
        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <div className="space-y-6">
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
                <p className="text-gray-600">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              filteredLeads
                .sort((a, b) => calculateLeadPriority(b) - calculateLeadPriority(a))
                .map(lead => (
                  <TimelineLeadCard key={lead.id} lead={lead} onClick={handleLeadClick} />
                ))
            )}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Destination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AI Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-gray-900">
                                {lead.clientName}
                              </div>
                              {lead.temperature === 'HOT' && (
                                <span className="text-red-500" title="Hot Lead">🔥</span>
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
                          £{lead.estimatedValue.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full w-fit">
                          <Brain className="h-3 w-3 text-blue-600" />
                          <span className="text-sm font-medium text-blue-700">{lead.aiScore}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full',
                          lead.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'QUALIFICATION' ? 'bg-purple-100 text-purple-800' :
                          lead.status === 'QUOTING' ? 'bg-amber-100 text-amber-800' :
                          lead.status === 'NEGOTIATION' ? 'bg-orange-100 text-orange-800' :
                          lead.status === 'BOOKED' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        )}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          onClick={() => handleLeadClick(lead)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
              <p className="text-gray-600">
                Advanced calendar with task scheduling and follow-up management coming soon...
              </p>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {viewMode === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Status Distribution */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Status Distribution</h3>
                <div className="space-y-3">
                  {['NEW', 'QUALIFICATION', 'QUOTING', 'NEGOTIATION', 'BOOKED'].map(status => {
                    const count = filteredLeads.filter(l => l.status === status).length;
                    const percentage = filteredLeads.length > 0 ? Math.round((count / filteredLeads.length) * 100) : 0;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{status}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-900 w-8">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Temperature Analysis */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Temperature</h3>
                <div className="space-y-4">
                  {['HOT', 'WARM', 'COLD', 'HOLD'].map(temp => {
                    const count = filteredLeads.filter(l => l.temperature === temp).length;
                    const percentage = filteredLeads.length > 0 ? Math.round((count / filteredLeads.length) * 100) : 0;
                    const colorClasses = { 
                      HOT: 'bg-red-500', 
                      WARM: 'bg-orange-500', 
                      COLD: 'bg-blue-500', 
                      HOLD: 'bg-gray-500' 
                    };
                    return (
                      <div key={temp} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-4 h-4 rounded-full", colorClasses[temp as keyof typeof colorClasses])} />
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
            </div>

            {/* Performance Summary */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">
                    £{filteredLeads.length > 0 ? Math.round((filteredLeads.reduce((sum, l) => sum + l.estimatedValue, 0) / filteredLeads.length) / 1000) : 0}K
                  </div>
                  <div className="text-sm text-blue-700">Average Deal Size</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredLeads.length > 0 ? Math.round(filteredLeads.reduce((sum, l) => sum + l.aiScore, 0) / filteredLeads.length) : 0}
                  </div>
                  <div className="text-sm text-green-700">Average AI Score</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <div className="text-2xl font-bold text-red-600">
                    {filteredLeads.filter(l => 
                      l.tasks.some(t => !t.isCompleted && new Date(t.dueDate) < new Date())
                    ).length}
                  </div>
                  <div className="text-sm text-red-700">Overdue Items</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lead Detail Panel */}
      {showDetailPanel && selectedLead && (
        <LeadDetailPanel 
          lead={selectedLead} 
          onClose={() => setShowDetailPanel(false)}
          onUpdateLead={handleUpdateLead}
        />
      )}
    </div>
  );
}  