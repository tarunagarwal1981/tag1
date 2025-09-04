// components/dashboard/EnhancedSidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PlaneTakeoff,
  Home,
  Target,
  Brain,
  MessageSquare,
  Calendar,
  BarChart3,
  Users,
  Settings,
  Search,
  Plus,
  Zap,
  Globe,
  Package,
  UserPlus,
  ChevronLeft,
  Bell,
  Award,
  CreditCard,
  FileText,
  TrendingUp,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Badge } from '@/components/ui/core/Badge';
import { Button } from '@/components/ui/core/Button';
import { Avatar } from '@/components/ui/core/Avatar';

interface NavItem {
  id: string;
  title: string;
  icon: any;
  href: string;
  badge?: number;
  isNew?: boolean;
  description?: string;
}

interface SidebarProps {
  role: 'agent' | 'operator';
}

// Streamlined navigation items based on our analysis
const agentNavItems: NavItem[] = [
  { 
    id: 'dashboard', 
    title: 'Overview', 
    icon: Home, 
    href: '/agent',
    description: 'Your performance dashboard'
  },
  {
    id: 'lead-hub',
    title: 'Lead Hub',
    icon: Target,
    href: '/agent/lead-hub',
    badge: 8,
    isNew: true,
    description: 'Manage leads & AI assistant'
  },
  {
    id: 'marketplace',
    title: 'Lead Marketplace',
    icon: Globe,
    href: '/agent/buy-leads',
    badge: 12,
    description: 'Buy qualified leads'
  },
  {
    id: 'packages',
    title: 'My Packages',
    icon: Package,
    href: '/agent/my-itineraries',
    description: 'Bookings & itineraries'
  },
  {
    id: 'communication',
    title: 'Messages',
    icon: MessageSquare,
    href: '/agent/communication',
    badge: 3,
    description: 'WhatsApp & email hub'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: BarChart3,
    href: '/agent/analytics',
    description: 'Performance insights'
  },
  {
    id: 'calendar',
    title: 'Calendar',
    icon: Calendar,
    href: '/agent/calendar',
    description: 'Schedule & tasks'
  }
];

const operatorNavItems: NavItem[] = [
  { 
    id: 'dashboard', 
    title: 'Overview', 
    icon: Home, 
    href: '/operator',
    description: 'Business dashboard'
  },
  {
    id: 'lead-generation',
    title: 'Lead Generation',
    icon: Zap,
    href: '/operator/leads',
    badge: 47,
    isNew: true,
    description: 'AI-powered lead generation'
  },
  {
    id: 'packages',
    title: 'Package Management',
    icon: Package,
    href: '/operator/packages',
    description: 'Create & manage tours'
  },
  {
    id: 'agents',
    title: 'Agent Network',
    icon: Users,
    href: '/operator/agents',
    badge: 156,
    description: 'Partner relationships'
  },
  {
    id: 'bookings',
    title: 'Bookings',
    icon: Calendar,
    href: '/operator/bookings',
    description: 'Operations management'
  },
  {
    id: 'communication',
    title: 'Messages',
    icon: MessageSquare,
    href: '/operator/communication',
    badge: 12,
    description: 'Agent communications'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: TrendingUp,
    href: '/operator/analytics',
    description: 'Business intelligence'
  },
  {
    id: 'payments',
    title: 'Payments',
    icon: CreditCard,
    href: '/operator/payments',
    description: 'Revenue & commissions'
  }
];

export function EnhancedSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = role === 'agent' ? agentNavItems : operatorNavItems;
  
  // Mock user data - would come from auth context in real app
  const userData = {
    name: role === 'agent' ? 'Anya Sharma' : 'Incredible India Tours',
    email: role === 'agent' ? 'anya@travelagency.com' : 'info@incredibleindiatours.com',
    avatar: role === 'agent' ? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150' : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150',
    plan: role === 'agent' ? 'Professional' : 'Enterprise',
    notifications: role === 'agent' ? 3 : 8
  };

  return (
    <aside
      className={cn(
        'bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300 relative z-40',
        isCollapsed ? 'w-20' : 'w-80'
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-primary-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <PlaneTakeoff className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  TravelHub Pro
                </h1>
                <p className="text-xs text-primary-600 font-medium capitalize">
                  {role} Dashboard
                </p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0 hover:bg-white/50"
          >
            <ChevronLeft className={cn(
              "h-4 w-4 text-gray-500 transition-transform duration-200",
              isCollapsed && "rotate-180"
            )} />
          </Button>
        </div>
      </div>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <Avatar 
              src={userData.avatar}
              alt={userData.name}
              size="md"
              fallback={userData.name.slice(0, 2)}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {userData.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userData.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="info" size="sm">
                {userData.plan}
              </Badge>
              {userData.notifications > 0 && (
                <div className="relative">
                  <Bell className="h-4 w-4 text-gray-400" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-danger-500 rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-white font-medium">
                      {userData.notifications > 9 ? '9+' : userData.notifications}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Quick Actions
            </h3>
            <Zap className="h-4 w-4 text-primary-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {role === 'agent' ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-xs h-8"
                  icon={<Plus className="h-3 w-3" />}
                >
                  Add Lead
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-xs h-8"
                  icon={<Search className="h-3 w-3" />}
                >
                  Find Package
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-xs h-8"
                  icon={<Package className="h-3 w-3" />}
                >
                  New Package
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start text-xs h-8"
                  icon={<UserPlus className="h-3 w-3" />}
                >
                  Invite Agent
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 custom-scrollbar overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href) && item.href !== `/${role}`);

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 relative',
                    isActive && 'bg-primary-50 text-primary-700 shadow-sm border border-primary-200',
                    isCollapsed ? 'justify-center' : 'justify-start'
                  )}
                >
                  <div className={cn(
                    'flex items-center justify-center rounded-lg transition-colors duration-200',
                    isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600',
                    isCollapsed ? 'w-8 h-8' : 'w-6 h-6 mr-3'
                  )}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  
                  {!isCollapsed && (
                    <>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{item.title}</span>
                          {item.isNew && (
                            <Badge variant="success" size="sm">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.description}
                        </p>
                      </div>
                      
                      {item.badge && (
                        <Badge 
                          variant={isActive ? 'info' : 'default'} 
                          size="sm"
                          className="ml-2"
                        >
                          {item.badge > 99 ? '99+' : item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                  
                  {/* Collapsed state tooltip */}
                  {isCollapsed && (
                    <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.title}
                      {item.badge && (
                        <span className="ml-2 bg-white/20 px-1.5 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50/50">
        {!isCollapsed ? (
          <div className="space-y-2">
            <Link
              href={`/${role}/settings`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            >
              <Settings className="h-4 w-4" />
              <span className="text-sm">Settings</span>
            </Link>
            
            <div className="pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>TravelHub Pro v2.1</span>
                <Award className="h-3 w-3" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Link
              href={`/${role}/settings`}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
            >
              <Settings className="h-4 w-4" />
            </Link>
            <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
          </div>
        )}
      </div>
    </aside>
  );
}