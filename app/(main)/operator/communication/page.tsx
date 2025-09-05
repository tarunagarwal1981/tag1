// app/(main)/operator/communication/page.tsx

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/core/Card';
import { Button } from '@/components/ui/core/Button';
import { Badge } from '@/components/ui/core/Badge';
import { 
  MessageSquare,
  Clock, 
  Users, 
  TrendingUp,
  Zap,
  Mail,
  Phone,
  Send,
  Search,
  Filter,
  MoreVertical,
  Paperclip,
  Smile,
  Check,
  CheckCheck,
  Globe,
  Star,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  agentName: string;
  agentCompany: string;
  country: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  status: 'online' | 'offline' | 'away';
  priority: 'high' | 'medium' | 'low';
  category: 'booking' | 'inquiry' | 'support' | 'partnership';
}

interface Message {
  id: string;
  sender: 'operator' | 'agent';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'document';
}

export default function OperatorCommunicationPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>('conv-1');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [conversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      agentName: 'Priya Sharma',
      agentCompany: 'Global Travel UK',
      country: 'United Kingdom',
      lastMessage: 'Can we discuss the new Golden Triangle package pricing?',
      timestamp: '2 min ago',
      unreadCount: 3,
      status: 'online',
      priority: 'high',
      category: 'booking'
    },
    {
      id: 'conv-2',
      agentName: 'Ahmed Hassan',
      agentCompany: 'ME Adventures',
      country: 'UAE',
      lastMessage: 'Thank you for the quick response on the Rajasthan tour',
      timestamp: '15 min ago',
      unreadCount: 0,
      status: 'online',
      priority: 'medium',
      category: 'support'
    },
    {
      id: 'conv-3',
      agentName: 'Lisa Chen',
      agentCompany: 'Asia Pacific Tours',
      country: 'Australia',
      lastMessage: 'Looking for exclusive packages for luxury segment',
      timestamp: '1 hour ago',
      unreadCount: 1,
      status: 'away',
      priority: 'medium',
      category: 'inquiry'
    },
    {
      id: 'conv-4',
      agentName: 'Maria Rodriguez',
      agentCompany: 'Latin Expeditions',
      country: 'Brazil',
      lastMessage: 'Partnership application submitted for review',
      timestamp: '3 hours ago',
      unreadCount: 0,
      status: 'offline',
      priority: 'low',
      category: 'partnership'
    }
  ]);

  const [messages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      content: 'Hello! Can we discuss the new Golden Triangle package pricing for my UK clients?',
      timestamp: '10:30 AM',
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-2',
      sender: 'operator',
      content: 'Hi Priya! Absolutely. The new pricing structure offers better margins for agents. Let me send you the details.',
      timestamp: '10:32 AM',
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-3',
      sender: 'agent',
      content: 'That sounds great! My clients are particularly interested in luxury accommodations.',
      timestamp: '10:35 AM',
      status: 'read',
      type: 'text'
    },
    {
      id: 'msg-4',
      sender: 'operator',
      content: 'Perfect! We have exclusive partnerships with premium hotels. Would you like to schedule a call to discuss specifics?',
      timestamp: '10:37 AM',
      status: 'delivered',
      type: 'text'
    }
  ]);

  const [stats] = useState({
    totalMessages: 1247,
    activeAgents: 47,
    responseTime: '2.1 min',
    satisfaction: '96%',
    automationRate: '78%'
  });

  const filteredConversations = conversations.filter(conv =>
    conv.agentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.agentCompany.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'booking': return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'inquiry': return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'support': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'partnership': return <Users className="h-4 w-4 text-green-500" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">🌐 Communication Hub</h1>
        <p className="text-emerald-100 text-lg">
          Manage agent communications and global messaging operations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { title: 'Total Messages', value: stats.totalMessages, icon: MessageSquare, color: 'bg-blue-100 text-blue-600' },
          { title: 'Active Agents', value: stats.activeAgents, icon: Users, color: 'bg-green-100 text-green-600' },
          { title: 'Avg Response', value: stats.responseTime, icon: Clock, color: 'bg-amber-100 text-amber-600' },
          { title: 'Satisfaction', value: stats.satisfaction, icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
          { title: 'Automation', value: stats.automationRate, icon: Zap, color: 'bg-indigo-100 text-indigo-600' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', stat.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.title}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Communication Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        
        {/* Conversations List */}
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Agent Conversations</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" icon={<Filter className="h-4 w-4" />} />
                <Button variant="ghost" size="sm" icon={<MoreVertical className="h-4 w-4" />} />
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>

          <div className="overflow-y-auto h-[500px]">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={cn(
                  'p-4 border-l-4 cursor-pointer hover:bg-gray-50 transition-colors',
                  selectedConversation === conversation.id ? 'bg-blue-50 border-l-blue-500' : getPriorityColor(conversation.priority),
                  'border-b border-gray-100'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {conversation.agentName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={cn('absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white', getStatusColor(conversation.status))}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900 truncate">{conversation.agentName}</h4>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(conversation.category)}
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-red-100 text-red-700 text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-1">{conversation.agentCompany}</p>
                    <p className="text-sm text-gray-500 truncate mb-2">{conversation.lastMessage}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-400">{conversation.country}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Message Thread */}
        <Card className="lg:col-span-2 p-0 overflow-hidden flex flex-col">
          {selectedConv ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedConv.agentName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className={cn('absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white', getStatusColor(selectedConv.status))}></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedConv.agentName}</h3>
                      <p className="text-sm text-gray-600">{selectedConv.agentCompany} • {selectedConv.country}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" icon={<Phone className="h-4 w-4" />} />
                    <Button variant="ghost" size="sm" icon={<Mail className="h-4 w-4" />} />
                    <Button variant="ghost" size="sm" icon={<MoreVertical className="h-4 w-4" />} />
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex',
                      message.sender === 'operator' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div
                      className={cn(
                        'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                        message.sender === 'operator'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className={cn(
                        'flex items-center justify-between mt-1',
                        message.sender === 'operator' ? 'text-blue-100' : 'text-gray-500'
                      )}>
                        <span className="text-xs">{message.timestamp}</span>
                        {message.sender === 'operator' && (
                          <div className="ml-2">
                            {message.status === 'read' ? (
                              <CheckCheck className="h-3 w-3" />
                            ) : message.status === 'delivered' ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && newMessage.trim()) {
                          handleSendMessage();
                        }
                      }}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                      <Button variant="ghost" size="sm" icon={<Paperclip className="h-4 w-4" />} />
                      <Button variant="ghost" size="sm" icon={<Smile className="h-4 w-4" />} />
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    icon={<Send className="h-4 w-4" />}
                    disabled={!newMessage.trim()}
                    onClick={handleSendMessage}
                  >
                    Send
                  </Button>
                </div>

                {/* Quick Templates */}
                <div className="flex gap-2 mt-3">
                  <span className="text-xs text-gray-500 mr-2">Quick replies:</span>
                  {[
                    'Application approved',
                    'Please review new packages', 
                    'Commission payment processed'
                  ].map((template, index) => (
                    <button
                      key={index}
                      onClick={() => setNewMessage(template)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}