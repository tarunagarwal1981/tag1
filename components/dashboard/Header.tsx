// components/dashboard/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  MessageSquare,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Plus,
  Zap,
  Calendar,
  Settings,
  LogOut,
  User,
  CreditCard,
  BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/core/Button';
import { Badge } from '@/components/ui/core/Badge';
import { Avatar } from '@/components/ui/core/Avatar';
import { Input } from '@/components/ui/core/Input';

interface HeaderProps {
  role?: 'agent' | 'operator';
}

export function Header({ role }: HeaderProps = {}) {
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Determine role from pathname if not provided
  const detectedRole = role || (pathname.startsWith('/operator') ? 'operator' : 'agent');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Mock data - would come from context/API in real app
  const userData = {
    name: detectedRole === 'agent' ? 'Anya Sharma' : 'Incredible India Tours',
    email: detectedRole === 'agent' ? 'anya@travelagency.com' : 'info@incredibleindiatours.com',
    avatar: detectedRole === 'agent' 
      ? 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150' 
      : 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150',
    role: detectedRole === 'agent' ? 'Travel Agent' : 'Tour Operator',
    plan: detectedRole === 'agent' ? 'Professional' : 'Enterprise'
  };

  const notifications = [
    {
      id: '1',
      type: detectedRole === 'agent' ? 'lead' : 'booking',
      title: detectedRole === 'agent' ? 'New qualified lead available' : 'New booking confirmed',
      message: detectedRole === 'agent' 
        ? 'High-value lead for Golden Triangle tour' 
        : 'Emma Thompson confirmed Kerala package',
      time: '5 min ago',
      unread: true
    },
    {
      id: '2',
      type: 'message',
      title: 'WhatsApp message received',
      message: detectedRole === 'agent' 
        ? 'Client inquiry about Rajasthan tour' 
        : 'Agent requesting package customization',
      time: '15 min ago',
      unread: true
    },
    {
      id: '3',
      type: 'payment',
      title: detectedRole === 'agent' ? 'Commission received' : 'Payment processed',
      message: detectedRole === 'agent' 
        ? '₹45,000 commission credited' 
        : '₹2,40,000 payment received from agent',
      time: '1 hour ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getPageTitle = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    const titleMap = {
      'agent': 'Agent Dashboard',
      'operator': 'Operator Dashboard', 
      'lead-hub': 'Lead Management Hub',
      'leads': 'Lead Generation',
      'packages': 'Package Management',
      'agents': 'Agent Network',
      'bookings': 'Bookings & Operations',
      'communication': 'Communication Hub',
      'analytics': 'Analytics & Reports',
      'buy-leads': 'Lead Marketplace',
      'my-itineraries': 'My Packages',
      'calendar': 'Calendar & Tasks',
      'settings': 'Settings'
    };

    return titleMap[lastSegment] || 'Dashboard';
  };

  const getBreadcrumb = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    return pathSegments.map(segment => 
      segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')
    ).join(' / ');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left Section - Page Info */}
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-gray-500">
              {getBreadcrumb()}
            </p>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <Input
              placeholder={detectedRole === 'agent' 
                ? "Search leads, packages, clients..." 
                : "Search packages, agents, bookings..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startIcon={<Search className="h-4 w-4" />}
              className="w-full bg-gray-50 border-gray-200 focus:bg-white"
            />
            
            {/* Search Results Dropdown */}
            {searchQuery && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4">
                  <p className="text-sm text-gray-500">
                    Search functionality would be implemented here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center space-x-3">
          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            {detectedRole === 'agent' ? (
              <>
                <Button variant="ghost" size="sm" icon={<Plus className="h-4 w-4" />}>
                  Add Lead
                </Button>
                <Button variant="primary" size="sm" icon={<Zap className="h-4 w-4" />}>
                  AI Assistant
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" icon={<Plus className="h-4 w-4" />}>
                  New Package
                </Button>
                <Button variant="primary" size="sm" icon={<BarChart3 className="h-4 w-4" />}>
                  Analytics
                </Button>
              </>
            )}
          </div>

          <div className="h-6 w-px bg-gray-200"></div>

          {/* Current Time */}
          <div className="hidden md:flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{currentTime.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}</span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 h-5 w-5 bg-danger-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                </div>
              )}
            </Button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                    <Badge variant="info" size="sm">{unreadCount} new</Badge>
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={cn(
                      "p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors",
                      notification.unread && "bg-primary-50/50"
                    )}>
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                          notification.unread ? "bg-primary-500" : "bg-gray-300"
                        )} />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 border-t border-gray-200">
                  <Button variant="ghost" size="sm" className="w-full">
                    View all notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2"
          >
            <MessageSquare className="h-5 w-5" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-success-500 rounded-full"></div>
          </Button>

          <div className="h-6 w-px bg-gray-200"></div>

          {/* Profile Dropdown */}
          <div className="relative">
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2"
              onClick={() => setShowProfile(!showProfile)}
            >
              <Avatar 
                src={userData.avatar}
                alt={userData.name}
                size="sm"
                fallback={userData.name.slice(0, 2)}
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                  {userData.name}
                </p>
                <p className="text-xs text-gray-500">
                  {userData.role}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <Avatar 
                      src={userData.avatar}
                      alt={userData.name}
                      size="md"
                      fallback={userData.name.slice(0, 2)}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {userData.name}
                      </h4>
                      <p className="text-xs text-gray-500 truncate">
                        {userData.email}
                      </p>
                      <Badge variant="info" size="sm" className="mt-1">
                        {userData.plan}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <Button variant="ghost" className="w-full justify-start" icon={<User className="h-4 w-4" />}>
                    Profile Settings
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" icon={<CreditCard className="h-4 w-4" />}>
                    Billing & Plan
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" icon={<Settings className="h-4 w-4" />}>
                    Preferences
                  </Button>
                  
                  <div className="border-t border-gray-200 mt-2 pt-2">
                    <Button variant="ghost" className="w-full justify-start text-danger-600 hover:text-danger-700 hover:bg-danger-50" icon={<LogOut className="h-4 w-4" />}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {showSearch && (
        <div className="border-t border-gray-200 p-4 md:hidden">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startIcon={<Search className="h-4 w-4" />}
            className="w-full"
          />
        </div>
      )}
    </header>
  );
}