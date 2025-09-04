// components/ai-system/AIComponents.tsx
'use client';

import { useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Star,
  ThumbsUp,
  ThumbsDown,
  Copy,
  ExternalLink,
  Clock,
  Target,
  BarChart3,
  Users,
  DollarSign,
  Zap,
  Bot,
  Settings,
  Palette,
  Volume2,
  Mic,
  Globe,
  Shield,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/core/Button';
import { Card } from '@/components/ui/core/Card';
import { Badge } from '@/components/ui/core/Badge';
import { Input } from '@/components/ui/core/Input';
import { Select } from '@/components/ui/core/Select';
import { Avatar } from '@/components/ui/core/Avatar';
import { cn, formatCurrency, formatRelativeTime } from '@/lib/utils';
import { AIInsight, AIMessage, AIPersonality, AIAction, AIAnalytics } from './AdvancedAICopilot';

// AI Insight Card Component
export const AIInsightCard: React.FC<{
  insight: AIInsight;
  onRead: () => void;
  onAction?: () => void;
}> = ({ insight, onRead, onAction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getInsightIcon = () => {
    switch (insight.type) {
      case 'urgent':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'opportunity':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'prediction':
        return <Zap className="h-5 w-5 text-purple-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
    }
  };

  const getInsightBackground = () => {
    switch (insight.type) {
      case 'urgent':
        return 'border-red-200 bg-red-50 hover:bg-red-100';
      case 'opportunity':
        return 'border-green-200 bg-green-50 hover:bg-green-100';
      case 'warning':
        return 'border-amber-200 bg-amber-50 hover:bg-amber-100';
      case 'success':
        return 'border-green-200 bg-green-50 hover:bg-green-100';
      case 'prediction':
        return 'border-purple-200 bg-purple-50 hover:bg-purple-100';
      default:
        return 'border-blue-200 bg-blue-50 hover:bg-blue-100';
    }