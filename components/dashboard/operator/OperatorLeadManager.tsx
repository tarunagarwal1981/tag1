// components/dashboard/operator/OperatorLeadManager.tsx
'use client';

import { useState, useMemo, FC } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Brain,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Globe,
  List,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Plus,
  Search,
  Star,
  Target,
  AlertTriangle,
  User,
  Users,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

//==============================================================================
// TYPE DEFINITIONS
//==============================================================================

interface OperatorActivity {
  id: string;
  type: 'AGENT_MESSAGE' | 'QUOTE_SENT' | 'CALL_SCHEDULED' | 'PACKAGE_CREATED' | 'BOOKING_CONFIRMED';
  content: string;
  timestamp: string;
  author: string;
  agentInvolved?: string;
}

interface OperatorTask {
  id: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  isCompleted: boolean;
  assignedTo: string;
  type: 'QUOTE_PREPARATION' | 'AGENT_FOLLOWUP' | 'PACKAGE_CUSTOMIZATION' | 'BOOKING_CONFIRMATION';
}

interface OperatorLead {
  id: string;
  agentName: string;
  agentCompany: string;
  agentCountry: string;
  agentRating: number;
  clientName: string;
  destination: string;
  travelerCount: number;
  estimatedValue: number;
  commissionRate: number;
  status: 'NEW_INQUIRY' | 'REVIEWING' | 'QUOTED' | 'NEGOTIATING' | 'CONFIRMED' | 'IN_PROGRESS';
  temperature: 'HOT' | 'WARM' | 'COLD' | 'HOLD';
  aiScore: number;
  createdAt: string;
  updatedAt: string;
  activity: OperatorActivity[];
  tasks: OperatorTask[];
}

type ViewMode = 'timeline' | 'list' | 'analytics';
type FilterType = 'all' | 'new-inquiries' | 'hot-leads' | 'pending-response' | 'high-commission';

//==============================================================================
// MOCK DATA
//==============================================================================

const operatorLeadsData: OperatorLead[] = [
    {
        id: 'OPL-001',
        agentName: 'Sarah Mitchell',
        agentCompany: 'UK Adventure Travel Ltd',
        agentCountry: 'United Kingdom',
        clientName: "Johnson Family (Sarah's client)",
        destination: 'Golden Triangle + Goa Beach',
        travelerCount: 4,
        estimatedValue: 8500,
        status: 'NEW_INQUIRY',
        temperature: 'HOT',
        aiScore: 92,
        agentRating: 4.9,
        createdAt: '2025-09-03T08:30:00Z',
        updatedAt: '2025-09-03T14:20:00Z',
        commissionRate: 15,
        activity: [
            { id: '1', type: 'AGENT_MESSAGE', content: "Agent Sarah sent inquiry for Johnson family - 4 travelers wanting cultural tour + beach relaxation. Budget confirmed at $8,500. High-priority client.", timestamp: '2025-09-03T14:20:00Z', author: 'System', agentInvolved: 'Sarah Mitchell' },
            { id: '2', type: 'QUOTE_SENT', content: 'Sent initial quote with Golden Triangle + Goa package options. Included luxury accommodations and private transfers.', timestamp: '2025-09-03T10:15:00Z', author: 'Raj Kumar', agentInvolved: 'Sarah Mitchell' }
        ],
        tasks: [
            { id: 'OT1', description: 'Create customized itinerary for Golden Triangle + Goa', dueDate: '2025-09-04T16:00:00Z', priority: 'High', isCompleted: false, assignedTo: 'Raj Kumar', type: 'PACKAGE_CUSTOMIZATION' },
            { id: 'OT2', description: 'Follow up with agent Sarah on client preferences', dueDate: '2025-09-04T10:00:00Z', priority: 'High', isCompleted: false, assignedTo: 'Priya Sharma', type: 'AGENT_FOLLOWUP' }
        ]
    },
    {
        id: 'OPL-002',
        agentName: 'James Wilson',
        agentCompany: 'European Escapes GmbH',
        agentCountry: 'Germany',
        clientName: "Mueller Couple (James's client)",
        destination: 'Kerala Backwaters & Hill Stations',
        travelerCount: 2,
        estimatedValue: 4200,
        status: 'QUOTED',
        temperature: 'WARM',
        aiScore: 78,
        agentRating: 4.6,
        createdAt: '2025-09-01T11:15:00Z',
        updatedAt: '2025-09-02T16:30:00Z',
        commissionRate: 12,
        activity: [
            { id: '3', type: 'QUOTE_SENT', content: 'Sent comprehensive Kerala package quote including houseboat stay, hill station hotels, and Ayurveda treatments.', timestamp: '2025-09-02T16:30:00Z', author: 'Anjali Nair', agentInvolved: 'James Wilson' },
            { id: '4', type: 'AGENT_MESSAGE', content: 'Agent James inquired about Kerala backwaters for German couple. Interested in authentic experiences and wellness treatments.', timestamp: '2025-09-01T11:15:00Z', author: 'System', agentInvolved: 'James Wilson' }
        ],
        tasks: [
            { id: 'OT3', description: 'Await agent response on Kerala quote', dueDate: '2025-09-05T12:00:00Z', priority: 'Medium', isCompleted: false, assignedTo: 'Anjali Nair', type: 'AGENT_FOLLOWUP' }
        ]
    },
    {
        id: 'OPL-003',
        agentName: 'Maria Rodriguez',
        agentCompany: 'Spain Travel Solutions',
        agentCountry: 'Spain',
        clientName: "Garcia Extended Family (Maria's client)",
        destination: 'Rajasthan Heritage Circuit',
        travelerCount: 8,
        estimatedValue: 15000,
        status: 'NEGOTIATING',
        temperature: 'HOT',
        aiScore: 85,
        agentRating: 4.7,
        createdAt: '2025-08-30T14:45:00Z',
        updatedAt: '2025-09-02T11:20:00Z',
        commissionRate: 18,
        activity: [
            { id: '5', type: 'AGENT_MESSAGE', content: 'Agent Maria negotiating final terms for Garcia family group. Requesting group discounts and additional cultural experiences.', timestamp: '2025-09-02T11:20:00Z', author: 'System', agentInvolved: 'Maria Rodriguez' },
            { id: '6', type: 'QUOTE_SENT', content: 'Sent revised Rajasthan heritage quote with group pricing and additional palace visits.', timestamp: '2025-09-01T15:30:00Z', author: 'Vikram Singh', agentInvolved: 'Maria Rodriguez' }
        ],
        tasks: [
            { id: 'OT4', description: 'Negotiate group pricing with hotels in Rajasthan', dueDate: '2025-09-04T14:00:00Z', priority: 'High', isCompleted: false, assignedTo: 'Vikram Singh', type: 'QUOTE_PREPARATION' }
        ]
    }
];

//==============================================================================
// HELPER FUNCTIONS & CONSTANTS
//==============================================================================

const calculateOpportunityScore = (lead: OperatorLead): number => {
  let score = 0;
  score += (lead.aiScore / 100) * 40;
  if (lead.temperature === 'HOT') score += 30;
  score += (lead.agentRating / 5) * 20;
  score += Math.min((lead.estimatedValue / 100000) * 10, 10);
  return Math.round(score);
};

//==============================================================================
// CHILD COMPONENTS
//==============================================================================

interface OperatorLeadCardProps {
  lead: OperatorLead;
  onClick: (lead: OperatorLead) => void;
}

const OperatorLeadCard: FC<OperatorLeadCardProps> = ({ lead, onClick }) => {
  const opportunityScore = calculateOpportunityScore(lead);
  const urgentTasks = lead.tasks.filter(t => !t.isCompleted && t.priority === 'High');
  const overdueTasks = lead.tasks.filter(t => !t.isCompleted && new Date(t.dueDate) < new Date());

  return (
    <div
      className="cursor-pointer rounded-xl border bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
      onClick={() => onClick(lead)}
    >
      {/* Header: Agent & Client Info */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-sm font-semibold text-white">
              {lead.agentName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{lead.agentName}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Building2 className="h-4 w-4" />
                <span>{lead.agentCompany}</span>
              </div>
            </div>
            {lead.temperature === 'HOT' && (
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                🔥 Hot
              </span>
            )}
          </div>

          <div className="mb-3 rounded-lg bg-blue-50 p-3">
            <div className="mb-1 flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900">Client: {lead.clientName}</span>
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
                <span className="font-semibold text-emerald-600">${lead.estimatedValue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1">
              <Brain className="h-3 w-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">AI {lead.aiScore}</span>
            </div>
            <div
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium',
                opportunityScore > 80 ? 'bg-red-100 text-red-700' :
                opportunityScore > 60 ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              )}
            >
              Opportunity: {opportunityScore}
            </div>
          </div>
          <div
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium',
               lead.status === 'NEW_INQUIRY' ? 'bg-blue-100 text-blue-700' :
               lead.status === 'REVIEWING' ? 'bg-purple-100 text-purple-700' :
               lead.status === 'QUOTED' ? 'bg-amber-100 text-amber-700' :
               lead.status === 'NEGOTIATING' ? 'bg-orange-100 text-orange-700' :
               lead.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
               'bg-gray-100 text-gray-700'
            )}
          >
            {lead.status.replace('_', ' ')}
          </div>
        </div>
      </div>

      {/* Footer: Details & Status */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">{lead.agentCountry}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current text-amber-400" />
            <span className="text-sm font-medium">{lead.agentRating}</span>
          </div>
          <div className="text-sm text-gray-600">
            Commission: <span className="font-semibold text-purple-600">{lead.commissionRate}%</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
            Updated: {new Date(lead.updatedAt).toLocaleDateString()}
        </div>
      </div>

      {/* Task Alerts */}
      {(overdueTasks.length > 0 || urgentTasks.length > 0) && (
        <div className="mb-4">
          {overdueTasks.length > 0 ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="mb-1 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-700">Action Required</span>
              </div>
              <div className="text-sm text-red-600">{overdueTasks[0].description}</div>
            </div>
          ) : (
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
              <div className="mb-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-700">High Priority Task</span>
              </div>
              <div className="text-sm text-orange-600">{urgentTasks[0].description}</div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200">
            <MessageSquare className="mr-1 inline h-3 w-3" />
            Message Agent
          </button>
          <button className="rounded-lg bg-green-100 px-3 py-1 text-sm font-medium text-green-700 transition-colors hover:bg-green-200">
            <FileText className="mr-1 inline h-3 w-3" />
            Send Quote
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
          <span>Manage</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};


interface OperatorLeadDetailPanelProps {
  lead: OperatorLead;
  onClose: () => void;
  onUpdateLead: (lead: OperatorLead) => void;
}

const OperatorLeadDetailPanel: FC<OperatorLeadDetailPanelProps> = ({ lead, onClose, onUpdateLead }) => {
  const [newActivity, setNewActivity] = useState({ content: '', type: 'AGENT_MESSAGE' });
  const [newTask, setNewTask] = useState({
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedTo: 'Raj Kumar',
    type: 'QUOTE_PREPARATION'
  });

  const activityTypes = ['AGENT_MESSAGE', 'QUOTE_SENT', 'CALL_SCHEDULED', 'PACKAGE_CREATED', 'BOOKING_CONFIRMED'];
  const taskTypes = ['QUOTE_PREPARATION', 'AGENT_FOLLOWUP', 'PACKAGE_CUSTOMIZATION', 'BOOKING_CONFIRMATION'];
  const statusOptions = ['NEW_INQUIRY', 'REVIEWING', 'QUOTED', 'NEGOTIATING', 'CONFIRMED', 'IN_PROGRESS'];
  const temperatureOptions = ['HOT', 'WARM', 'COLD', 'HOLD'];
  const teamMembers = ['Raj Kumar', 'Priya Sharma', 'Anjali Nair', 'Vikram Singh', 'Arjun Patel'];

  const addActivity = () => {
    if (!newActivity.content.trim()) return;

    const activity: OperatorActivity = {
      id: Date.now().toString(),
      type: newActivity.type as OperatorActivity['type'],
      content: newActivity.content,
      timestamp: new Date().toISOString(),
      author: 'Raj Kumar', // Should be dynamic based on logged-in user
      agentInvolved: lead.agentName
    };

    const updatedLead = {
      ...lead,
      activity: [activity, ...lead.activity],
      updatedAt: new Date().toISOString()
    };

    onUpdateLead(updatedLead);
    setNewActivity({ content: '', type: 'AGENT_MESSAGE' });
  };

  const addTask = () => {
    if (!newTask.description.trim() || !newTask.dueDate) return;

    const task: OperatorTask = {
      id: Date.now().toString(),
      description: newTask.description,
      dueDate: newTask.dueDate,
      priority: newTask.priority as OperatorTask['priority'],
      isCompleted: false,
      assignedTo: newTask.assignedTo,
      type: newTask.type as OperatorTask['type']
    };

    const updatedLead = { ...lead, tasks: [task, ...lead.tasks] };
    onUpdateLead(updatedLead);
    setNewTask({ description: '', priority: 'Medium', dueDate: '', assignedTo: 'Raj Kumar', type: 'QUOTE_PREPARATION' });
  };
  
  const updateLeadField = (field: keyof OperatorLead, value: any) => {
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
    <div className="fixed inset-y-0 right-0 z-50 w-1/2 overflow-hidden bg-white shadow-2xl">
      <div className="flex h-full flex-col">
        {/* Panel Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={onClose} className="text-white/80 transition-colors hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <button className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/30">
                <MessageSquare className="mr-1 inline h-3 w-3" /> Message Agent
              </button>
              <button className="rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/30">
                <FileText className="mr-1 inline h-3 w-3" /> Send Quote
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="mb-2 font-semibold">Travel Agent</h3>
              <div className="space-y-1 text-white/90">
                <div className="font-medium">{lead.agentName}</div>
                <div className="flex items-center gap-2"> <Building2 className="h-4 w-4" /> <span>{lead.agentCompany}</span> </div>
                <div className="flex items-center gap-2"> <Globe className="h-4 w-4" /> <span>{lead.agentCountry}</span> </div>
                <div className="flex items-center gap-1"> <Star className="h-4 w-4 text-amber-300" /> <span>{lead.agentRating} rating</span> </div>
              </div>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Client Request</h3>
              <div className="space-y-1 text-white/90">
                <div className="font-medium">{lead.clientName}</div>
                <div className="flex items-center gap-2"> <MapPin className="h-4 w-4" /> <span>{lead.destination}</span> </div>
                <div className="flex items-center gap-2"> <Users className="h-4 w-4" /> <span>{lead.travelerCount} travelers</span> </div>
                <div className="text-2xl font-bold">${lead.estimatedValue.toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Status:</span>
              <select value={lead.status} onChange={(e) => updateLeadField('status', e.target.value)} className="rounded border border-white/30 bg-white/20 px-2 py-1 text-sm text-white backdrop-blur-sm focus:bg-white/30">
                {statusOptions.map(status => <option key={status} value={status} className="text-gray-900">{status.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Priority:</span>
              <select value={lead.temperature} onChange={(e) => updateLeadField('temperature', e.target.value)} className="rounded border border-white/30 bg-white/20 px-2 py-1 text-sm text-white backdrop-blur-sm focus:bg-white/30">
                {temperatureOptions.map(temp => <option key={temp} value={temp} className="text-gray-900">{temp}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Commission:</span>
              <input type="number" value={lead.commissionRate} onChange={(e) => updateLeadField('commissionRate', parseInt(e.target.value))} className="w-16 rounded border border-white/30 bg-white/20 px-2 py-1 text-sm text-white backdrop-blur-sm focus:bg-white/30" min="5" max="25" />
              <span className="text-sm">%</span>
            </div>
          </div>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
            {/* Add Activity */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-3 font-medium text-gray-900">Add Update</h3>
              <div className="space-y-3">
                <textarea value={newActivity.content} onChange={(e) => setNewActivity(prev => ({ ...prev, content: e.target.value }))} placeholder="What action did you take? Quote sent, call scheduled..." className="w-full resize-none rounded-lg border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500" rows={3} />
                <div className="flex gap-2">
                  <select value={newActivity.type} onChange={(e) => setNewActivity(prev => ({ ...prev, type: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500">
                    {activityTypes.map(type => <option key={type} value={type}>{type.replace('_', ' ')}</option>)}
                  </select>
                  <button onClick={addActivity} disabled={!newActivity.content.trim()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50">Add</button>
                </div>
              </div>
            </div>

            {/* Activity Timeline */}
            <div>
              <h3 className="mb-3 font-medium text-gray-900">Activity Timeline</h3>
              <div className="space-y-4">
                {lead.activity.map((act) => (
                  <div key={act.id} className="flex gap-3 border-b border-gray-100 pb-3 last:border-b-0">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                      {act.type === 'AGENT_MESSAGE' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                      {act.type === 'QUOTE_SENT' && <Mail className="h-4 w-4 text-blue-600" />}
                      {act.type === 'CALL_SCHEDULED' && <Phone className="h-4 w-4 text-blue-600" />}
                      {act.type === 'PACKAGE_CREATED' && <Package className="h-4 w-4 text-blue-600" />}
                      {act.type === 'BOOKING_CONFIRMED' && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{act.type.replace('_', ' ')}</span>
                        <span className="text-xs text-gray-500">{new Date(act.timestamp).toLocaleDateString()} at {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-sm text-gray-700">{act.content}</p>
                      <p className="mt-1 text-xs text-gray-500">by {act.author}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Add Task */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-3 font-medium text-gray-900">Add Task</h3>
              <div className="space-y-3">
                <input type="text" value={newTask.description} onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))} placeholder="Task description..." className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                <div className="grid grid-cols-2 gap-2">
                  <select value={newTask.priority} onChange={(e) => setNewTask(prev => ({ ...prev, priority: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                  </select>
                  <select value={newTask.type} onChange={(e) => setNewTask(prev => ({ ...prev, type: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                    {taskTypes.map(type => <option key={type} value={type}>{type.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="datetime-local" value={newTask.dueDate} onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
                  <select value={newTask.assignedTo} onChange={(e) => setNewTask(prev => ({ ...prev, assignedTo: e.target.value }))} className="rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
                    {teamMembers.map(member => <option key={member} value={member}>{member}</option>)}
                  </select>
                </div>
                <button onClick={addTask} disabled={!newTask.description.trim() || !newTask.dueDate} className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50">Assign Task</button>
              </div>
            </div>

            {/* Tasks List */}
            <div>
              <h3 className="mb-3 font-medium text-gray-900">Team Tasks</h3>
              <div className="space-y-2">
                {lead.tasks.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <Calendar className="mx-auto mb-2 h-8 w-8 opacity-50" />
                    <p>No tasks assigned. Add your first task above.</p>
                  </div>
                ) : (
                  lead.tasks.map((task) => (
                    <div key={task.id} className={cn('flex items-start gap-3 rounded-lg border p-3', task.isCompleted ? 'bg-gray-50' : 'bg-white')}>
                      <button onClick={() => toggleTask(task.id)} className={cn('mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border-2 transition-all', task.isCompleted ? 'border-green-500 bg-green-500 text-white' : 'border-gray-300 hover:border-green-500')}>
                        {task.isCompleted && <CheckCircle2 className="h-3 w-3" />}
                      </button>
                      <div className="flex-1">
                        <span className={cn('block text-sm', task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900')}>{task.description}</span>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={cn('rounded-full px-2 py-0.5 text-xs', task.priority === 'High' ? 'bg-red-100 text-red-700' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700')}>{task.priority}</span>
                          <span className="text-xs text-gray-500">Assigned: {task.assignedTo}</span>
                          <span className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

//==============================================================================
// MAIN COMPONENT
//==============================================================================

export function OperatorLeadManager() {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [leads, setLeads] = useState<OperatorLead[]>(operatorLeadsData);
  const [selectedLead, setSelectedLead] = useState<OperatorLead | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  const filteredLeads = useMemo(() => {
    return leads
      .filter(lead => {
        if (filter === 'new-inquiries') return lead.status === 'NEW_INQUIRY';
        if (filter === 'hot-leads') return lead.temperature === 'HOT';
        if (filter === 'pending-response') return ['NEW_INQUIRY', 'REVIEWING'].includes(lead.status);
        if (filter === 'high-commission') return lead.commissionRate >= 15;
        return true;
      })
      .filter(lead => {
        if (!searchTerm) return true;
        const lowercasedSearch = searchTerm.toLowerCase();
        return (
          lead.agentName.toLowerCase().includes(lowercasedSearch) ||
          lead.agentCompany.toLowerCase().includes(lowercasedSearch) ||
          lead.destination.toLowerCase().includes(lowercasedSearch) ||
          lead.clientName.toLowerCase().includes(lowercasedSearch)
        );
      });
  }, [leads, filter, searchTerm]);

  const handleLeadClick = (lead: OperatorLead) => {
    setSelectedLead(lead);
    setShowDetailPanel(true);
  };

  const handleUpdateLead = (updatedLead: OperatorLead) => {
    setLeads(prevLeads => prevLeads.map(lead => (lead.id === updatedLead.id ? updatedLead : lead)));
    setSelectedLead(updatedLead);
  };
  
  const handleClosePanel = () => {
    setShowDetailPanel(false);
    setSelectedLead(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operator Lead Management Hub</h1>
          <p className="text-gray-600">Manage incoming inquiries from your travel agent network</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>Create Package</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button onClick={() => setViewMode('timeline')} className={cn('rounded-md px-3 py-2 text-sm font-medium transition-colors', viewMode === 'timeline' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}><Zap className="mr-2 inline h-4 w-4" />Timeline</button>
            <button onClick={() => setViewMode('list')} className={cn('rounded-md px-3 py-2 text-sm font-medium transition-colors', viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}><List className="mr-2 inline h-4 w-4" />List</button>
            <button onClick={() => setViewMode('analytics')} className={cn('rounded-md px-3 py-2 text-sm font-medium transition-colors', viewMode === 'analytics' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900')}><BarChart3 className="mr-2 inline h-4 w-4" />Analytics</button>
          </div>
          <select value={filter} onChange={(e) => setFilter(e.target.value as FilterType)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
            <option value="all">All Leads</option>
            <option value="new-inquiries">New Inquiries</option>
            <option value="hot-leads">Hot Leads</option>
            <option value="pending-response">Pending Response</option>
            <option value="high-commission">High Commission</option>
          </select>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search agents, clients, destinations..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>
      
      {/* Analytics Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="rounded-lg border bg-white p-4 text-center shadow-sm"><div className="text-2xl font-bold text-gray-900">{filteredLeads.length}</div><div className="text-sm text-gray-600">Total Inquiries</div></div>
          <div className="rounded-lg border bg-white p-4 text-center shadow-sm"><div className="text-2xl font-bold text-red-600">{filteredLeads.filter(l => l.temperature === 'HOT').length}</div><div className="text-sm text-gray-600">Hot Opportunities</div></div>
          <div className="rounded-lg border bg-white p-4 text-center shadow-sm"><div className="text-2xl font-bold text-emerald-600">${Math.round(filteredLeads.reduce((sum, l) => sum + l.estimatedValue, 0) / 1000)}K</div><div className="text-sm text-gray-600">Pipeline Value</div></div>
          <div className="rounded-lg border bg-white p-4 text-center shadow-sm"><div className="text-2xl font-bold text-blue-600">{filteredLeads.length > 0 ? Math.round(filteredLeads.reduce((sum, l) => sum + l.aiScore, 0) / filteredLeads.length) : 0}</div><div className="text-sm text-gray-600">Avg AI Score</div></div>
          <div className="rounded-lg border bg-white p-4 text-center shadow-sm"><div className="text-2xl font-bold text-purple-600">{filteredLeads.filter(l => ['CONFIRMED', 'IN_PROGRESS'].includes(l.status)).length}</div><div className="text-sm text-gray-600">Active Bookings</div></div>
      </div>
      
      {/* Main Content Area */}
      <div className={cn('transition-all duration-300', showDetailPanel ? 'mr-[50%]' : 'mr-0')}>
        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <div className="space-y-6">
            {filteredLeads.length === 0 ? (
              <div className="rounded-xl border bg-white py-12 text-center shadow-sm">
                <Target className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">No inquiries found</h3>
                <p className="text-gray-600">Try adjusting your filters or search term.</p>
              </div>
            ) : (
              filteredLeads
                .sort((a, b) => calculateOpportunityScore(b) - calculateOpportunityScore(a))
                .map(lead => <OperatorLeadCard key={lead.id} lead={lead} onClick={handleLeadClick} />)
            )}
          </div>
        )}
        
        {/* List View */}
        {viewMode === 'list' && (
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Agent & Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Destination</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Value & Commission</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">AI Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="cursor-pointer transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-sm font-semibold text-white">{lead.agentName.split(' ').map(n => n[0]).join('')}</div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="font-medium text-gray-900">{lead.agentName}</div>
                                    {lead.temperature === 'HOT' && <span className="text-xs text-red-500">🔥</span>}
                                </div>
                                <div className="text-sm text-gray-600">{lead.agentCompany}</div>
                                <div className="text-xs text-gray-500">Client: {lead.clientName}</div>
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><div className="text-sm text-gray-700">{lead.destination}</div><div className="text-xs text-gray-500">{lead.travelerCount} travelers</div></td>
                      <td className="px-6 py-4"><div className="text-sm font-semibold text-emerald-600">${lead.estimatedValue.toLocaleString()}</div><div className="text-xs text-purple-600">{lead.commissionRate}% commission</div></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1 w-12 overflow-hidden rounded-full bg-gray-200"><div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600" style={{ width: `${lead.aiScore}%` }} /></div>
                          <span className="text-sm font-medium">{lead.aiScore}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className={cn('inline-flex rounded-full px-2 py-1 text-xs font-semibold leading-5', lead.status === 'NEW_INQUIRY' ? 'bg-blue-100 text-blue-800' : lead.status === 'REVIEWING' ? 'bg-purple-100 text-purple-800' : lead.status === 'QUOTED' ? 'bg-amber-100 text-amber-800' : lead.status === 'NEGOTIATING' ? 'bg-orange-100 text-orange-800' : lead.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}>{lead.status.replace('_', ' ')}</span></td>
                      <td className="px-6 py-4 text-sm"><button onClick={() => handleLeadClick(lead)} className="font-medium text-blue-600 hover:text-blue-900">Manage</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {viewMode === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Inquiry Status Distribution</h3>
                <div className="space-y-3">
                  {['NEW_INQUIRY', 'REVIEWING', 'QUOTED', 'NEGOTIATING', 'CONFIRMED'].map(status => {
                    const count = filteredLeads.filter(l => l.status === status).length;
                    const percentage = filteredLeads.length > 0 ? Math.round((count / filteredLeads.length) * 100) : 0;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{status.replace('_', ' ')}</span>
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-32 rounded-full bg-gray-200"><div className="h-2 rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${percentage}%` }} /></div>
                          <span className="w-8 text-sm font-bold text-gray-900">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Top Agent Performance</h3>
                <div className="space-y-4">
                  {Array.from(new Set(filteredLeads.map(l => l.agentName))).slice(0, 5).map(agentName => {
                    const agentLeads = filteredLeads.filter(l => l.agentName === agentName);
                    const totalValue = agentLeads.reduce((sum, l) => sum + l.estimatedValue, 0);
                    const avgRating = agentLeads.length > 0 ? agentLeads[0].agentRating : 0;
                    return (
                      <div key={agentName} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-xs font-semibold text-white">{agentName.split(' ').map(n => n[0]).join('')}</div>
                            <div>
                                <div className="text-sm font-medium text-gray-900">{agentName}</div>
                                <div className="flex items-center gap-1"><Star className="h-3 w-3 fill-current text-amber-400" /><span className="text-xs text-gray-500">{avgRating}</span></div>
                            </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald-600">${Math.round(totalValue / 1000)}K</div>
                          <div className="text-xs text-gray-500">{agentLeads.length} inquiries</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Business Performance Summary</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                  <div className="rounded-xl bg-blue-50 p-4 text-center"><div className="text-2xl font-bold text-blue-600">${filteredLeads.length > 0 ? Math.round(filteredLeads.reduce((sum, l) => sum + l.estimatedValue, 0) / filteredLeads.length / 1000) : 0}K</div><div className="text-sm text-blue-700">Average Inquiry Value</div></div>
                  <div className="rounded-xl bg-green-50 p-4 text-center"><div className="text-2xl font-bold text-green-600">{filteredLeads.length > 0 ? Math.round(filteredLeads.reduce((sum, l) => sum + l.aiScore, 0) / filteredLeads.length) : 0}</div><div className="text-sm text-green-700">Average AI Score</div></div>
                  <div className="rounded-xl bg-purple-50 p-4 text-center"><div className="text-2xl font-bold text-purple-600">{filteredLeads.length > 0 ? Math.round(filteredLeads.reduce((sum, l) => sum + l.commissionRate, 0) / filteredLeads.length) : 0}%</div><div className="text-sm text-purple-700">Average Commission</div></div>
                  <div className="rounded-xl bg-red-50 p-4 text-center"><div className="text-2xl font-bold text-red-600">{filteredLeads.filter(l => l.tasks.some(t => !t.isCompleted && new Date(t.dueDate) < new Date())).length}</div><div className="text-sm text-red-700">Overdue Tasks</div></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lead Detail Panel */}
      {showDetailPanel && selectedLead && (
        <OperatorLeadDetailPanel
          lead={selectedLead}
          onClose={handleClosePanel}
          onUpdateLead={handleUpdateLead}
        />
      )}
    </div>
  );
}