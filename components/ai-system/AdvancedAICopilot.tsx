// components/ai-system/AdvancedAICopilot.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Users,
  ChevronRight,
  Lightbulb,
  ArrowRight,
  X,
  Minimize2,
  Maximize2,
  Send,
  Settings,
  BarChart3,
  Award,
  Eye,
  Edit,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Globe,
  PieChart,
  FileText,
  Camera,
  Image,
  Paperclip,
  BookOpen,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/core/Button';
import { Card } from '@/components/ui/core/Card';
import { Badge } from '@/components/ui/core/Badge';
import { Input } from '@/components/ui/core/Input';
import { Avatar } from '@/components/ui/core/Avatar';
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils';

// Enhanced AI System Types
export interface AIPersonality {
  id: string;
  name: string;
  description: string;
  avatar: string;
  expertise: string[];
  tone: 'professional' | 'friendly' | 'analytical' | 'creative';
  specializations: string[];
}

export interface AIInsight {
  id: string;
  type: 'urgent' | 'opportunity' | 'warning' | 'success' | 'info' | 'prediction';
  category: 'leads' | 'revenue' | 'performance' | 'market' | 'operations';
  title: string;
  message: string;
  details?: string;
  action?: {
    label: string;
    type: 'primary' | 'secondary';
    action: () => void;
  };
  confidence: number; // 0-100
  impact: 'low' | 'medium' | 'high' | 'critical';
  leadId?: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
  isRead: boolean;
  metadata?: Record<string, any>;
}

export interface AIConversation {
  id: string;
  messages: AIMessage[];
  context: {
    leadId?: string;
    bookingId?: string;
    packageId?: string;
    userRole: 'agent' | 'operator';
    currentPage?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AIMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: string;
  suggestions?: string[];
  attachments?: AIAttachment[];
  actions?: AIAction[];
  metadata?: {
    confidence?: number;
    model?: string;
    processingTime?: number;
    sources?: string[];
  };
}

export interface AIAttachment {
  id: string;
  type: 'image' | 'document' | 'chart' | 'table' | 'code';
  name: string;
  url?: string;
  data?: any;
  preview?: string;
}

export interface AIAction {
  id: string;
  label: string;
  type: 'button' | 'link' | 'form' | 'modal';
  action: string;
  params?: Record<string, any>;
  style?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export interface AIAnalytics {
  totalInteractions: number;
  avgResponseTime: number;
  topQueries: Array<{
    query: string;
    count: number;
    category: string;
  }>;
  satisfactionScore: number;
  automationSaved: {
    hours: number;
    tasks: number;
    value: number;
  };
}

// AI Personalities for different roles and contexts
const AI_PERSONALITIES: AIPersonality[] = [
  {
    id: 'aria-travel-expert',
    name: 'Aria - Travel Expert',
    description: 'Your intelligent travel industry specialist',
    avatar: '🧠',
    expertise: ['lead-management', 'itinerary-planning', 'customer-communication', 'market-analysis'],
    tone: 'professional',
    specializations: ['lead-scoring', 'conversion-optimization', 'travel-trends']
  },
  {
    id: 'zara-data-analyst',
    name: 'Zara - Analytics Guru',
    description: 'Data-driven insights and performance optimization',
    avatar: '📊',
    expertise: ['analytics', 'revenue-optimization', 'forecasting', 'reporting'],
    tone: 'analytical',
    specializations: ['business-intelligence', 'predictive-modeling', 'kpi-tracking']
  },
  {
    id: 'leo-sales-coach',
    name: 'Leo - Sales Coach',
    description: 'Sales strategy and conversion expert',
    avatar: '🎯',
    expertise: ['sales-strategy', 'negotiation', 'client-relations', 'closing-techniques'],
    tone: 'friendly',
    specializations: ['lead-conversion', 'objection-handling', 'sales-training']
  },
  {
    id: 'nova-creative-assistant',
    name: 'Nova - Creative Assistant',
    description: 'Content creation and marketing specialist',
    avatar: '✨',
    expertise: ['content-creation', 'marketing', 'branding', 'social-media'],
    tone: 'creative',
    specializations: ['copywriting', 'visual-content', 'campaign-strategy']
  }
];

// Advanced AI Copilot Component
export const AdvancedAICopilot: React.FC<{
  userRole: 'agent' | 'operator';
  currentContext?: {
    leadId?: string;
    bookingId?: string;
    packageId?: string;
    page?: string;
  };
}> = ({ userRole, currentContext }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activePersonality, setActivePersonality] = useState(AI_PERSONALITIES[0]);
  const [activeTab, setActiveTab] = useState<'chat' | 'insights' | 'analytics' | 'settings'>('insights');
  const [conversation, setConversation] = useState<AIConversation>({
    id: `conv-${Date.now()}`,
    messages: [],
    context: {
      userRole,
      currentPage: currentContext?.page,
      ...currentContext
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  // Initialize with welcome message and insights
  useEffect(() => {
    initializeCopilot();
    generateInitialInsights();
  }, [userRole, currentContext]);

  const initializeCopilot = () => {
    const welcomeMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      type: 'ai',
      content: `Hello! I'm ${activePersonality.name}, your AI copilot. I'm here to help you maximize your ${userRole === 'agent' ? 'sales performance' : 'business operations'}. What would you like to work on today?`,
      timestamp: new Date().toISOString(),
      suggestions: [
        userRole === 'agent' ? 'Show me my hot leads' : 'Analyze agent performance',
        'Create a follow-up strategy',
        'Generate market insights',
        'Optimize my workflow'
      ]
    };

    setConversation(prev => ({
      ...prev,
      messages: [welcomeMessage],
      updatedAt: new Date().toISOString()
    }));
  };

  const generateInitialInsights = () => {
    // Generate contextual insights based on user role and current context
    const newInsights: AIInsight[] = [
      {
        id: `insight-${Date.now()}-1`,
        type: 'opportunity',
        category: 'leads',
        title: userRole === 'agent' ? 'Hot Lead Alert' : 'High-Value Opportunity',
        message: userRole === 'agent' 
          ? 'You have 3 hot leads that need immediate attention. Johnson Family ($12,000) is your top priority.'
          : 'Agent Emma Thompson has converted 85% of her leads this month. Consider promoting her strategies.',
        confidence: 92,
        impact: 'high',
        priority: 'high',
        timestamp: new Date().toISOString(),
        isRead: false,
        action: {
          label: userRole === 'agent' ? 'View Hot Leads' : 'View Performance',
          type: 'primary',
          action: () => console.log('Navigate to leads')
        }
      },
      {
        id: `insight-${Date.now()}-2`,
        type: 'prediction',
        category: 'revenue',
        title: 'Revenue Forecast',
        message: `Based on current trends, you're projected to ${userRole === 'agent' ? 'earn $15,000' : 'generate $245,000'} in commissions this month.`,
        confidence: 87,
        impact: 'medium',
        priority: 'medium',
        timestamp: new Date().toISOString(),
        isRead: false
      },
      {
        id: `insight-${Date.now()}-3`,
        type: 'warning',
        category: 'operations',
        title: 'Attention Required',
        message: userRole === 'agent' 
          ? '2 leads have overdue follow-up tasks. Don\'t let them go cold!'
          : '5 agents have pending commission payouts totaling $23,000.',
        confidence: 100,
        impact: 'medium',
        priority: 'high',
        timestamp: new Date().toISOString(),
        isRead: false,
        action: {
          label: 'Fix Now',
          type: 'secondary',
          action: () => console.log('Fix overdue items')
        }
      }
    ];

    setInsights(newInsights);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      updatedAt: new Date().toISOString()
    }));

    setInputMessage('');
    setIsProcessing(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiResponse = await generateAIResponse(inputMessage);
    
    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, aiResponse],
      updatedAt: new Date().toISOString()
    }));

    setIsProcessing(false);
  };

  const generateAIResponse = async (input: string): Promise<AIMessage> => {
    const lower = input.toLowerCase();
    let content = '';
    let suggestions: string[] = [];
    let actions: AIAction[] = [];

    // Context-aware AI responses
    if (lower.includes('lead') || lower.includes('client')) {
      content = `I can help you optimize your lead management. Based on your current pipeline, I recommend focusing on the Johnson Family lead ($12,000 value) and the startup group inquiry ($16,000 value). Both show high conversion probability.

Here's what I suggest:
1. Call Johnson Family within 2 hours - they're in decision mode
2. Send a customized package proposal to the startup group
3. Follow up on the 3 overdue leads from last week

Would you like me to draft communication templates for any of these?`;

      suggestions = [
        'Draft email for Johnson Family',
        'Create startup group proposal',
        'Show overdue lead details',
        'Schedule follow-up reminders'
      ];

      actions = [
        {
          id: 'action-1',
          label: 'View Hot Leads',
          type: 'button',
          action: 'navigate:/leads?filter=hot',
          style: 'primary'
        },
        {
          id: 'action-2',
          label: 'Draft Email',
          type: 'modal',
          action: 'open-email-composer',
          style: 'secondary'
        }
      ];
    } else if (lower.includes('revenue') || lower.includes('earning') || lower.includes('commission')) {
      content = `Your revenue performance looks strong! Here's the breakdown:

📊 **This Month:**
- Current Pipeline: $89,500
- Projected Commissions: $15,000
- Conversion Rate: 68% (above average!)

🎯 **Quick Wins:**
- Convert your top 3 hot leads = +$6,500
- Upsell existing bookings = +$2,000
- Referral program activation = +$1,500

Your conversion rate is 23% higher than the industry average. Keep up the excellent work!`;

      suggestions = [
        'Show detailed breakdown',
        'Create action plan for hot leads',
        'Analyze conversion trends',
        'Set monthly goals'
      ];
    } else if (lower.includes('help') || lower.includes('what can you')) {
      content = `I'm your AI copilot trained specifically for travel professionals! Here's how I can help you:

🎯 **Lead Management:**
- Prioritize leads by conversion probability
- Draft personalized communications
- Automate follow-up sequences

📊 **Analytics & Insights:**
- Performance tracking and optimization
- Revenue forecasting and planning
- Market trend analysis

💬 **Communication:**
- Email and WhatsApp templates
- Client objection handling
- Negotiation strategies

🚀 **Workflow Optimization:**
- Task automation recommendations
- Time management insights
- Process improvements

What specific area would you like to dive into?`;

      suggestions = [
        'Help with lead prioritization',
        'Draft client communications',
        'Analyze my performance',
        'Optimize my workflow'
      ];
    } else {
      // Fallback response
      content = `I understand you're asking about "${input}". Let me provide some relevant insights and suggestions based on your current context.`;
      
      suggestions = [
        'Tell me more about this',
        'Show me related data',
        'Create an action plan',
        'Provide alternatives'
      ];
    }

    return {
      id: `msg-${Date.now()}`,
      type: 'ai',
      content,
      timestamp: new Date().toISOString(),
      suggestions,
      actions,
      metadata: {
        confidence: Math.floor(Math.random() * 20) + 80,
        model: activePersonality.name,
        processingTime: 1.5,
        sources: ['lead-database', 'performance-metrics', 'market-data']
      }
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    inputRef.current?.focus();
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  const toggleSpeaking = () => {
    setIsSpeaking(!isSpeaking);
    // Text-to-speech would be implemented here
  };

  const markInsightAsRead = (insightId: string) => {
    setInsights(prev => prev.map(insight => 
      insight.id === insightId ? { ...insight, isRead: true } : insight
    ));
  };

  // Minimized state
  if (isMinimized) {
    const unreadInsights = insights.filter(i => !i.isRead).length;
    
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 animate-pulse hover:animate-none hover:scale-110"
        >
          <Brain className="h-6 w-6" />
          {unreadInsights > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {unreadInsights}
            </div>
          )}
        </button>
      </div>
    );
  }

  // Expanded state
  const copilotSize = isExpanded 
    ? 'w-[800px] h-[700px]' 
    : 'w-96 h-[600px]';

  return (
    <div className={cn(
      'fixed top-20 right-6 z-40 flex flex-col transition-all duration-300',
      copilotSize
    )}>
      <Card className="flex flex-col h-full shadow-2xl border-0 bg-white/95 backdrop-blur-lg">
        {/* Header */}
        <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-lg">
                  {activePersonality.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  {activePersonality.name}
                  <Sparkles className="h-4 w-4 text-purple-500" />
                </h3>
                <p className="text-xs text-gray-600">{activePersonality.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
                title={isExpanded ? "Minimize" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
                title="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-white/50 rounded-lg p-1">
            {[
              { id: 'insights', label: 'Insights', icon: Lightbulb },
              { id: 'chat', label: 'Chat', icon: MessageSquare },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1 text-xs font-medium py-2 px-2 rounded-md transition-all',
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/30'
                )}
              >
                <tab.icon className="h-3 w-3" />
                {tab.label}
                {tab.id === 'insights' && insights.filter(i => !i.isRead).length > 0 && (
                  <Badge variant="danger" size="sm">
                    {insights.filter(i => !i.isRead).length}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="h-full overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {insights.map((insight) => (
                <AIInsightCard
                  key={insight.id}
                  insight={insight}
                  onRead={() => markInsightAsRead(insight.id)}
                  onAction={insight.action?.action}
                />
              ))}
              
              {insights.length === 0 && (
                <div className="text-center py-8">
                  <Lightbulb className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No new insights at the moment</p>
                  <p className="text-sm text-gray-400">I'm analyzing your data...</p>
                </div>
              )}
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="h-full flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {conversation.messages.map((message) => (
                  <AIMessageBubble
                    key={message.id}
                    message={message}
                    onSuggestionClick={handleSuggestionClick}
                  />
                ))}
                
                {isProcessing && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                    <span>{activePersonality.name} is thinking...</span>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-gray-200/50">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      placeholder={`Ask ${activePersonality.name} anything...`}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      className="pr-20"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                      <button
                        onClick={toggleListening}
                        className={cn(
                          "p-1.5 rounded-md transition-colors",
                          isListening ? "bg-red-100 text-red-600" : "hover:bg-gray-100"
                        )}
                        title="Voice input"
                      >
                        {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                      </button>
                      <button
                        onClick={toggleSpeaking}
                        className={cn(
                          "p-1.5 rounded-md transition-colors",
                          isSpeaking ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"
                        )}
                        title="Text-to-speech"
                      >
                        {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isProcessing}
                    icon={<Send className="h-4 w-4" />}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="h-full overflow-y-auto p-4 custom-scrollbar">
              <AIAnalyticsPanel userRole={userRole} />
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="h-full overflow-y-auto p-4 custom-scrollbar">
              <AISettingsPanel
                personalities={AI_PERSONALITIES}
                activePersonality={activePersonality}
                onPersonalityChange={setActivePersonality}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};