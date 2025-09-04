// components/dashboard/communication/EnhancedCommunicationHub.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Phone, 
  Mail, 
  Send, 
  Paperclip, 
  Smile,
  Search,
  Filter,
  Archive,
  Star,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  User,
  Users,
  Calendar,
  FileText,
  Image,
  Video,
  Mic,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/core/Button';
import { Card } from '@/components/ui/core/Card';
import { Badge } from '@/components/ui/core/Badge';
import { Input } from '@/components/ui/core/Input';
import { Avatar } from '@/components/ui/core/Avatar';
import { cn, formatRelativeTime } from '@/lib/utils';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'document' | 'voice' | 'system';
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  attachments?: MessageAttachment[];
  replyTo?: string;
  metadata?: {
    bookingId?: string;
    leadId?: string;
    packageId?: string;
  };
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'document' | 'voice' | 'video';
  name: string;
  url: string;
  size: number;
  thumbnail?: string;
}

export interface Conversation {
  id: string;
  type: 'whatsapp' | 'email' | 'internal' | 'sms';
  participants: Participant[];
  lastMessage: Message;
  unreadCount: number;
  isStarred: boolean;
  isArchived: boolean;
  tags: string[];
  leadId?: string;
  bookingId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Participant {
  id: string;
  name: string;
  role: 'client' | 'agent' | 'operator' | 'system';
  avatar?: string;
  phone?: string;
  email?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: 'greeting' | 'booking_confirmation' | 'payment_reminder' | 'itinerary' | 'custom';
  content: string;
  variables: string[];
  isActive: boolean;
}

// Enhanced Communication Hub Component
export const EnhancedCommunicationHub: React.FC<{
  userRole: 'agent' | 'operator';
  initialConversations?: Conversation[];
}> = ({ userRole, initialConversations = [] }) => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(conversations[0] || null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'starred' | 'archived'>('all');
  const [showTemplates, setShowTemplates] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter conversations based on search and filter type
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = searchQuery === '' || 
      conv.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterType === 'all' ||
      (filterType === 'unread' && conv.unreadCount > 0) ||
      (filterType === 'starred' && conv.isStarred) ||
      (filterType === 'archived' && conv.isArchived);

    return matchesSearch && matchesFilter;
  });

  // Get messages for active conversation
  const conversationMessages = messages.filter(m => m.conversationId === activeConversation?.id);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversation.id,
      senderId: 'current-user',
      senderName: userRole === 'agent' ? 'Anya Sharma' : 'Incredible India Tours',
      content: newMessage,
      type: 'text',
      timestamp: new Date().toISOString(),
      status: 'sending'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate message sending
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, status: 'sent' } : m
      ));
    }, 1000);

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === activeConversation.id 
        ? { ...conv, lastMessage: message, updatedAt: new Date().toISOString() }
        : conv
    ));
  };

  // Mark conversation as read
  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  return (
    <div className="h-[800px] flex bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <Button variant="ghost" size="sm" icon={<Settings className="h-4 w-4" />} />
          </div>
          
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1">
            {[
              { key: 'all', label: 'All', count: conversations.length },
              { key: 'unread', label: 'Unread', count: conversations.filter(c => c.unreadCount > 0).length },
              { key: 'starred', label: 'Starred', count: conversations.filter(c => c.isStarred).length }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setFilterType(filter.key as any)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                  filterType === filter.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                {filter.label} {filter.count > 0 && `(${filter.count})`}
              </button>
            ))}
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={activeConversation?.id === conversation.id}
              onClick={() => {
                setActiveConversation(conversation);
                markAsRead(conversation.id);
              }}
            />
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={activeConversation.participants[0]?.avatar}
                    alt={activeConversation.participants[0]?.name}
                    size="md"
                    fallback={activeConversation.participants[0]?.name.slice(0, 2)}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {activeConversation.participants[0]?.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" size="sm">
                        {activeConversation.type.toUpperCase()}
                      </Badge>
                      {activeConversation.participants[0]?.isOnline ? (
                        <Badge variant="success" size="sm">Online</Badge>
                      ) : (
                        <span className="text-xs text-gray-500">
                          Last seen {formatRelativeTime(new Date(activeConversation.participants[0]?.lastSeen || ''))}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" icon={<Phone className="h-4 w-4" />} />
                  <Button variant="ghost" size="sm" icon={<Video className="h-4 w-4" />} />
                  <Button variant="ghost" size="sm" icon={<MoreVertical className="h-4 w-4" />} />
                </div>
              </div>

              {/* Quick Actions */}
              {(activeConversation.leadId || activeConversation.bookingId) && (
                <div className="mt-3 flex gap-2">
                  {activeConversation.leadId && (
                    <Button variant="outline" size="sm">
                      View Lead
                    </Button>
                  )}
                  {activeConversation.bookingId && (
                    <Button variant="outline" size="sm">
                      View Booking
                    </Button>
                  )}
                  <Button variant="outline" size="sm" icon={<Calendar className="h-4 w-4" />}>
                    Schedule Call
                  </Button>
                </div>
              )}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {conversationMessages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={message.senderId === 'current-user'}
                />
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2">
                  <Avatar size="sm" />
                  <div className="bg-gray-100 rounded-2xl px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              {/* Quick Templates */}
              {showTemplates && (
                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-2">Quick Templates</div>
                  <div className="grid grid-cols-2 gap-2">
                    {mockTemplates.slice(0, 4).map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setNewMessage(template.content);
                          setShowTemplates(false);
                        }}
                        className="text-left p-2 bg-white rounded border hover:border-blue-300 transition-colors"
                      >
                        <div className="text-xs font-medium text-gray-900">{template.name}</div>
                        <div className="text-xs text-gray-500 truncate">{template.content}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-end gap-3">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" icon={<Paperclip className="h-4 w-4" />} />
                  <Button variant="ghost" size="sm" icon={<Image className="h-4 w-4" />} />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<FileText className="h-4 w-4" />}
                    onClick={() => setShowTemplates(!showTemplates)}
                  />
                </div>

                <div className="flex-1 relative">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    className="pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    icon={<Smile className="h-4 w-4" />}
                  />
                </div>

                <Button
                  variant="primary"
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  icon={<Send className="h-4 w-4" />}
                >
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Conversation Item Component
const ConversationItem: React.FC<{
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}> = ({ conversation, isActive, onClick }) => {
  const participant = conversation.participants[0];
  const hasUnread = conversation.unreadCount > 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        'p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50',
        isActive && 'bg-blue-50 border-blue-200'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar
            src={participant?.avatar}
            alt={participant?.name}
            size="md"
            fallback={participant?.name.slice(0, 2)}
          />
          {participant?.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={cn(
              'text-sm truncate',
              hasUnread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'
            )}>
              {participant?.name}
            </h4>
            <div className="flex items-center gap-1">
              {conversation.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
              <span className="text-xs text-gray-500">
                {formatRelativeTime(new Date(conversation.lastMessage.timestamp))}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className={cn(
              'text-sm truncate',
              hasUnread ? 'font-medium text-gray-900' : 'text-gray-500'
            )}>
              {conversation.type === 'whatsapp' && '📱 '}
              {conversation.type === 'email' && '✉️ '}
              {conversation.lastMessage.content}
            </p>
            
            <div className="flex items-center gap-1 ml-2">
              {hasUnread && (
                <Badge variant="info" size="sm">
                  {conversation.unreadCount}
                </Badge>
              )}
              
              {/* Message Status */}
              {conversation.lastMessage.senderId === 'current-user' && (
                <div className="text-gray-400">
                  {conversation.lastMessage.status === 'sending' && <Clock className="h-3 w-3" />}
                  {conversation.lastMessage.status === 'sent' && <Check className="h-3 w-3" />}
                  {conversation.lastMessage.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                  {conversation.lastMessage.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-500" />}
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {conversation.tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {conversation.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" size="sm">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Message Bubble Component
const MessageBubble: React.FC<{
  message: Message;
  isOwn: boolean;
}> = ({ message, isOwn }) => {
  return (
    <div className={cn('flex gap-2', isOwn ? 'justify-end' : 'justify-start')}>
      {!isOwn && (
        <Avatar
          src={message.senderAvatar}
          alt={message.senderName}
          size="sm"
          fallback={message.senderName.slice(0, 2)}
        />
      )}

      <div className={cn('max-w-xs lg:max-w-md')}>
        {!isOwn && (
          <div className="text-xs text-gray-500 mb-1">{message.senderName}</div>
        )}
        
        <div
          className={cn(
            'px-4 py-2 rounded-2xl',
            isOwn
              ? 'bg-blue-600 text-white rounded-br-md'
              : 'bg-gray-100 text-gray-900 rounded-bl-md'
          )}
        >
          {message.type === 'text' && (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
          
          {message.type === 'system' && (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm italic">{message.content}</p>
            </div>
          )}

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment) => (
                <AttachmentPreview key={attachment.id} attachment={attachment} />
              ))}
            </div>
          )}
        </div>

        <div className={cn('flex items-center gap-1 mt-1', isOwn ? 'justify-end' : 'justify-start')}>
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          
          {isOwn && (
            <div className="text-gray-400">
              {message.status === 'sending' && <Clock className="h-3 w-3" />}
              {message.status === 'sent' && <Check className="h-3 w-3" />}
              {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
              {message.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-500" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Attachment Preview Component
const AttachmentPreview: React.FC<{ attachment: MessageAttachment }> = ({ attachment }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
      {attachment.type === 'image' && <Image className="h-4 w-4" />}
      {attachment.type === 'document' && <FileText className="h-4 w-4" />}
      {attachment.type === 'voice' && <Mic className="h-4 w-4" />}
      {attachment.type === 'video' && <Video className="h-4 w-4" />}
      
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium truncate">{attachment.name}</div>
        <div className="text-xs opacity-75">{formatFileSize(attachment.size)}</div>
      </div>
    </div>
  );
};

// Utility function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Mock Data
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'whatsapp',
    participants: [
      {
        id: 'client-1',
        name: 'John Anderson',
        role: 'client',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        phone: '+1-555-0123',
        isOnline: true,
        lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      }
    ],
    lastMessage: {
      id: 'msg-1',
      conversationId: 'conv-1',
      senderId: 'client-1',
      senderName: 'John Anderson',
      content: 'Thanks for the updated itinerary! When do we need to make the final payment?',
      type: 'text',
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      status: 'read'
    },
    unreadCount: 1,
    isStarred: true,
    isArchived: false,
    tags: ['golden-triangle', 'urgent'],
    leadId: 'LEAD-001',
    bookingId: 'BOOK-001',
    createdAt: '2025-09-01T10:00:00Z',
    updatedAt: '2025-09-04T14:30:00Z'
  },
  {
    id: 'conv-2',
    type: 'email',
    participants: [
      {
        id: 'agent-1',
        name: 'Emma Thompson',
        role: 'agent',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        email: 'emma@britishheritage.com',
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ],
    lastMessage: {
      id: 'msg-2',
      conversationId: 'conv-2',
      senderId: 'current-user',
      senderName: 'Incredible India Tours',
      content: 'The Kerala package has been customized as per your requirements. Please find the updated quote attached.',
      type: 'text',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'delivered'
    },
    unreadCount: 0,
    isStarred: false,
    isArchived: false,
    tags: ['kerala', 'customization'],
    leadId: 'LEAD-002',
    createdAt: '2025-09-03T09:00:00Z',
    updatedAt: '2025-09-04T12:00:00Z'
  }
];

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'current-user',
    senderName: 'Incredible India Tours',
    content: 'Hello John! I hope you\'re excited about your upcoming Golden Triangle tour. I\'ve updated your itinerary based on your preferences.',
    type: 'text',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'read'
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'client-1',
    senderName: 'John Anderson',
    content: 'Thanks for the updated itinerary! When do we need to make the final payment?',
    type: 'text',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    status: 'read'
  }
];

const mockTemplates: MessageTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Booking Confirmation',
    category: 'booking_confirmation',
    content: 'Great news! Your booking for {{package_name}} has been confirmed. Your booking reference is {{booking_id}}.',
    variables: ['package_name', 'booking_id'],
    isActive: true
  },
  {
    id: 'tpl-2',
    name: 'Payment Reminder',
    category: 'payment_reminder',
    content: 'Friendly reminder: Your payment of {{amount}} for {{package_name}} is due on {{due_date}}.',
    variables: ['amount', 'package_name', 'due_date'],
    isActive: true
  },
  {
    id: 'tpl-3',
    name: 'Welcome Greeting',
    category: 'greeting',
    content: 'Welcome to TravelHub Pro! I\'m {{agent_name}} and I\'ll be assisting you with your travel plans.',
    variables: ['agent_name'],
    isActive: true
  },
  {
    id: 'tpl-4',
    name: 'Itinerary Ready',
    category: 'itinerary',
    content: 'Your custom itinerary for {{destination}} is ready! Please review the attached document and let me know if you need any changes.',
    variables: ['destination'],
    isActive: true
  }
];