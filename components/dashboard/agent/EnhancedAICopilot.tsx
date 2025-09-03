// Fixed Enhanced AI Copilot - components/dashboard/agent/EnhancedAICopilot.tsx

'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { leadsData, type Lead } from '@/lib/data';
import { cn } from '@/lib/utils';

interface AIInsight {
  id: string;
  type: 'urgent' | 'opportunity' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  action?: string;
  leadId?: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

// AI Analytics Engine
const generateAIInsights = (leads: Lead[]): AIInsight[] => {
  const insights: AIInsight[] = [];
  const now = new Date();

  // Check for high-priority leads
  const hotLeads = leads.filter(
    (l) => l.temperature === 'HOT' && l.status === 'NEW'
  );
  if (hotLeads.length > 0) {
    insights.push({
      id: 'hot-leads',
      type: 'urgent',
      title: 'High-Priority Leads Detected',
      message: `${hotLeads.length} hot leads need immediate attention. Strike while the iron is hot!`,
      action: 'View Hot Leads',
      priority: 'high',
      timestamp: now.toISOString(),
    });
  }

  // Check for overdue tasks
  const overdueLeads = leads.filter((l) =>
    l.tasks.some((t) => !t.isCompleted && new Date(t.dueDate) < now)
  );
  if (overdueLeads.length > 0) {
    insights.push({
      id: 'overdue-tasks',
      type: 'warning',
      title: 'Overdue Tasks Alert',
      message: `${overdueLeads.length} leads have overdue tasks. Time to catch up!`,
      action: 'Fix Overdue Items',
      priority: 'high',
      timestamp: now.toISOString(),
    });
  }

  // Identify opportunities
  const highValueColdLeads = leads.filter(
    (l) => l.estimatedValue > 15000 && l.temperature === 'COLD'
  );
  if (highValueColdLeads.length > 0) {
    insights.push({
      id: 'high-value-opportunity',
      type: 'opportunity',
      title: 'High-Value Opportunity',
      message: `${highValueColdLeads.length} high-value leads are cold. Consider personalized outreach.`,
      action: 'Create Strategy',
      priority: 'medium',
      timestamp: now.toISOString(),
    });
  }

  return insights.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
};

// Smart Suggestions Generator
const generateSmartSuggestions = (leads: Lead[]): string[] => {
  const suggestions = [];

  // Time-based suggestions
  const currentHour = new Date().getHours();
  if (currentHour >= 14 && currentHour <= 16) {
    suggestions.push(
      '📞 Now is the optimal time for calls (2-4 PM has highest pickup rates)'
    );
  }

  // Performance suggestions
  const hotLeads = leads.filter((l) => l.temperature === 'HOT').length;
  if (hotLeads > 3) {
    suggestions.push(
      `🔥 You have ${hotLeads} hot leads - prioritize these for maximum conversion`
    );
  }

  return suggestions.slice(0, 4);
};

export function EnhancedAICopilot() {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'insights' | 'chat' | 'analytics'>(
    'insights'
  );
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [chatMessages, setChatMessages] = useState<AIMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // Generate AI insights
    const aiInsights = generateAIInsights(leadsData);
    setInsights(aiInsights);

    // Generate smart suggestions
    const smartSuggestions = generateSmartSuggestions(leadsData);
    setSuggestions(smartSuggestions);

    // Initialize with welcome message
    setChatMessages([
      {
        id: '1',
        type: 'ai',
        content:
          "Hi Anya! I'm your AI assistant. I can help you prioritize leads, draft messages, and provide insights. What would you like to work on?",
        timestamp: new Date().toISOString(),
        suggestions: [
          'Show me my urgent tasks',
          'Help me write a follow-up email',
          'Analyze my pipeline',
        ],
      },
    ]);
  }, []);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date().toISOString(),
    };

    setChatMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(chatInput),
        timestamp: new Date().toISOString(),
        suggestions: generateResponseSuggestions(chatInput),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
    }, 1000);

    setChatInput('');
  };

  const generateAIResponse = (input: string): string => {
    const lower = input.toLowerCase();

    if (lower.includes('urgent') || lower.includes('priority')) {
      const urgentCount = insights.filter((i) => i.priority === 'high').length;
      return `You have ${urgentCount} high-priority items that need attention. Your hottest lead is "${
        leadsData.find((l) => l.temperature === 'HOT')?.clientName
      }" with an AI score of ${
        leadsData.find((l) => l.temperature === 'HOT')?.aiScore
      }. I recommend calling them within the next 2 hours.`;
    }

    if (lower.includes('email') || lower.includes('message')) {
      return "I can help you craft the perfect follow-up message! Here's a template based on your lead's profile: 'Hi [Name], I hope you're doing well. Following up on our conversation about your upcoming [destination] trip. I've found some exclusive deals that match your preferences perfectly. Would you have 15 minutes this week to discuss?' Would you like me to customize this for a specific lead?";
    }

    if (lower.includes('pipeline') || lower.includes('analytics')) {
      const totalValue = leadsData.reduce(
        (sum, l) => sum + l.estimatedValue,
        0
      );
      const hotLeads = leadsData.filter((l) => l.temperature === 'HOT').length;
      return `Your pipeline analysis: Total value: €${Math.round(
        totalValue / 1000
      )}K, Hot leads: ${hotLeads}, Average AI score: ${Math.round(
        leadsData.reduce((sum, l) => sum + l.aiScore, 0) / leadsData.length
      )}. Focus on your top 3 hot leads for maximum impact this week.`;
    }

    return "I understand you'd like assistance with that. Could you be more specific about what you need help with? I can help you prioritize leads, draft communications, analyze performance, or provide strategic recommendations.";
  };

  const generateResponseSuggestions = (input: string): string[] => {
    const lower = input.toLowerCase();

    if (lower.includes('email') || lower.includes('message')) {
      return [
        'Customize for specific lead',
        'Create WhatsApp version',
        'Add urgency element',
      ];
    }

    if (lower.includes('urgent') || lower.includes('priority')) {
      return [
        'Show me the hot leads',
        'Create action plan',
        'Schedule follow-ups',
      ];
    }

    return ['Tell me more', 'Show alternatives', 'Create action plan'];
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <Brain className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-6 w-96 h-[calc(100vh-120px)] z-40 flex flex-col">
      {/* Header */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">AI Copilot</h3>
              <p className="text-xs text-gray-500">
                Your intelligent travel assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <Settings className="h-4 w-4 text-gray-500" />
            </button>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <Minimize2 className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('insights')}
            className={cn(
              'flex-1 text-xs font-medium py-2 px-3 rounded-md transition-all',
              activeTab === 'insights'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            )}
          >
            <Sparkles className="h-3 w-3 inline mr-1" />
            Insights
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={cn(
              'flex-1 text-xs font-medium py-2 px-3 rounded-md transition-all',
              activeTab === 'chat'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            )}
          >
            <MessageSquare className="h-3 w-3 inline mr-1" />
            Chat
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={cn(
              'flex-1 text-xs font-medium py-2 px-3 rounded-md transition-all',
              activeTab === 'analytics'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            )}
          >
            <BarChart3 className="h-3 w-3 inline mr-1" />
            Analytics
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="flex-1 custom-scrollbar overflow-y-auto space-y-3 pr-2">
            {/* Smart Suggestions */}
            <div className="glass-card p-4">
              <h4 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                Smart Suggestions
              </h4>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="text-xs text-gray-700 p-2 bg-white/50 rounded-lg"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="space-y-3">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="glass-card p-4 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                        insight.priority === 'high'
                          ? 'bg-red-500'
                          : insight.priority === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      )}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            'text-xs font-bold px-2 py-0.5 rounded-full',
                            insight.type === 'urgent'
                              ? 'bg-red-100 text-red-700'
                              : insight.type === 'warning'
                              ? 'bg-amber-100 text-amber-700'
                              : insight.type === 'opportunity'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-blue-100 text-blue-700'
                          )}
                        >
                          {insight.type.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">
                        {insight.title}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {insight.message}
                      </p>
                      {insight.action && (
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          {insight.action}
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 custom-scrollbar overflow-y-auto p-4 space-y-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex',
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[80%] p-3 rounded-lg text-sm',
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/80 text-gray-800 border'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.suggestions && (
                      <div className="mt-2 space-y-1">
                        {message.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => setChatInput(suggestion)}
                            className="block w-full text-left text-xs p-2 bg-blue-50 hover:bg-blue-100 rounded border text-blue-700 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about your leads..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                  className="btn-primary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>

              {/* Quick Prompts */}
              <div className="flex gap-1 mt-2">
                <button
                  onClick={() => setChatInput('Show me my urgent tasks')}
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  Urgent tasks
                </button>
                <button
                  onClick={() =>
                    setChatInput('Help me write a follow-up email')
                  }
                  className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors"
                >
                  Write email
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="flex-1 custom-scrollbar overflow-y-auto space-y-3 pr-2">
            {/* Performance Metrics */}
            <div className="glass-card p-4">
              <h4 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-yellow-500" />
                Performance Today
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-white/50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">12</div>
                  <div className="text-xs text-gray-600">Calls Made</div>
                </div>
                <div className="text-center p-2 bg-white/50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">8</div>
                  <div className="text-xs text-gray-600">Emails Sent</div>
                </div>
                <div className="text-center p-2 bg-white/50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">€45K</div>
                  <div className="text-xs text-gray-600">Pipeline Added</div>
                </div>
                <div className="text-center p-2 bg-white/50 rounded-lg">
                  <div className="text-lg font-bold text-emerald-600">2</div>
                  <div className="text-xs text-gray-600">Bookings</div>
                </div>
              </div>
            </div>

            {/* Market Trends */}
            <div className="glass-card p-4">
              <h4 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Market Trends
              </h4>
              <div className="space-y-3">
                <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-xs font-medium text-green-800">
                    Switzerland Packages ↗️
                  </p>
                  <p className="text-xs text-green-700">
                    +40% interest this month
                  </p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs font-medium text-blue-800">
                    Corporate Retreats 📈
                  </p>
                  <p className="text-xs text-blue-700">
                    Q4 season starting strong
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
