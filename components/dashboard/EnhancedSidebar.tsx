// Enhanced Modern Sidebar - components/dashboard/EnhancedSidebar.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PlaneTakeoff,
  LogOut,
  Home,
  LayoutGrid,
  Target,
  Brain,
  MessageSquare,
  Calendar,
  BarChart3,
  Users,
  Settings,
  Bell,
  Search,
  Plus,
  Zap,
  TrendingUp,
  Award,
  Globe,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavItem {
  id: string;
  title: string;
  icon: any;
  href: string;
  badge?: number;
  isNew?: boolean;
}

interface SidebarProps {
  role: 'agent' | 'operator';
}

const agentNavItems: NavItem[] = [
  { id: 'home', title: 'Dashboard', icon: Home, href: '/agent' },
  {
    id: 'lead-hub',
    title: 'Lead Management',
    icon: Target,
    href: '/agent/lead-hub',
    badge: 8,
    isNew: true,
  },
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    icon: Brain,
    href: '/agent/ai-assistant',
    isNew: true,
  },
  {
    id: 'communication',
    title: 'Communication Hub',
    icon: MessageSquare,
    href: '/agent/communication',
    badge: 3,
  },
  {
    id: 'calendar',
    title: 'Schedule & Tasks',
    icon: Calendar,
    href: '/agent/calendar',
  },
  {
    id: 'analytics',
    title: 'Performance Analytics',
    icon: BarChart3,
    href: '/agent/analytics',
  },
  {
    id: 'my-itineraries',
    title: 'Itineraries',
    icon: LayoutGrid,
    href: '/agent/my-itineraries',
  },
  {
    id: 'marketplace',
    title: 'Lead Marketplace',
    icon: Globe,
    href: '/agent/buy-leads',
    badge: 12,
  },
  {
    id: 'team',
    title: 'Team & Collaboration',
    icon: Users,
    href: '/agent/team',
  },
];

const operatorNavItems: NavItem[] = [
  { id: 'home', title: 'Dashboard', icon: Home, href: '/operator' },
  {
    id: 'analytics',
    title: 'Business Analytics',
    icon: BarChart3,
    href: '/operator/analytics',
  },
  {
    id: 'agents',
    title: 'Agent Management',
    icon: Users,
    href: '/operator/agents',
  },
  {
    id: 'products',
    title: 'Product Catalog',
    icon: LayoutGrid,
    href: '/operator/products',
  },
  {
    id: 'bookings',
    title: 'Booking Operations',
    icon: Calendar,
    href: '/operator/bookings',
  },
  {
    id: 'performance',
    title: 'Performance Reports',
    icon: TrendingUp,
    href: '/operator/reports',
  },
];

export function EnhancedSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = role === 'agent' ? agentNavItems : operatorNavItems;

  return (
    <aside
      className={cn(
        'bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-72'
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <PlaneTakeoff className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  TravelHub Pro
                </h1>
                <p className="text-xs text-gray-500 capitalize">
                  {role} Dashboard
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LayoutGrid className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Quick Actions (for agents) */}
      {role === 'agent' && !isCollapsed && (
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Quick Actions
            </h3>
            <Zap className="h-4 w-4 text-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center gap-2 p-2 bg-white hover:bg-gray-50 rounded-lg transition-colors text-xs border">
              <Plus className="h-3 w-3 text-blue-500" />
              <span>Add Lead</span>
            </button>
            <button className="flex items-center gap-2 p-2 bg-white hover:bg-gray-50 rounded-lg transition-colors text-xs border">
              <Search className="h-3 w-3 text-green-500" />
              <span>Find Client</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href) && item.href !== `/${role}`);

            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center p-3 rounded-xl font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group relative',
                    isActive &&
                      'bg-blue-100 text-blue-700 font-semibold shadow-sm',
                    isCollapsed ? 'justify-center' : 'space-x-3'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 flex-shrink-0',
                      isActive && 'text-blue-600'
                    )}
                  />

                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.title}</span>

                      <div className="flex items-center gap-2">
                        {item.isNew && (
                          <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                            NEW
                          </span>
                        )}

                        {item.badge && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </>
                  )}

                  {/* Tooltip for collapsed mode */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                      {item.title}
                      {item.badge && (
                        <span className="ml-2 bg-red-500 px-1 rounded-full text-xs">
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

      {/* Performance Summary (for agents) */}
      {role === 'agent' && !isCollapsed && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Today's Summary
            </h3>
            <Award className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-white rounded-lg">
              <div className="text-lg font-bold text-blue-600">12</div>
              <div className="text-xs text-gray-600">Calls</div>
            </div>
            <div className="p-2 bg-white rounded-lg">
              <div className="text-lg font-bold text-green-600">8</div>
              <div className="text-xs text-gray-600">Emails</div>
            </div>
            <div className="p-2 bg-white rounded-lg">
              <div className="text-lg font-bold text-purple-600">3</div>
              <div className="text-xs text-gray-600">Bookings</div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile & Settings */}
      <div className="p-4 border-t border-gray-200">
        {!isCollapsed ? (
          <div className="space-y-3">
            {/* User Profile */}
            <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Anya Sharma</p>
                <p className="text-xs text-gray-500">Travel Agent • Pro Plan</p>
              </div>
              <Bell className="h-4 w-4 text-gray-400" />
            </div>

            {/* Settings & Logout */}
            <div className="flex space-x-2">
              <Link
                href={`/${role}/settings`}
                className="flex-1 flex items-center justify-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
              </Link>
              <button className="flex-1 flex items-center justify-center space-x-2 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <button className="w-full p-3 hover:bg-gray-100 rounded-lg transition-colors group relative">
              <Settings className="h-5 w-5 text-gray-500 mx-auto" />
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Settings
              </div>
            </button>
            <button className="w-full p-3 hover:bg-red-50 rounded-lg transition-colors group relative">
              <LogOut className="h-5 w-5 text-red-500 mx-auto" />
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                Logout
              </div>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
