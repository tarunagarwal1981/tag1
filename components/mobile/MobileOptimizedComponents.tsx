// components/mobile/MobileOptimizedComponents.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Menu,
  X,
  Search,
  Bell,
  User,
  MessageSquare,
  Calendar,
  Target,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Home,
  Plus,
  Filter,
  Sort,
  Grid,
  List,
  Phone,
  Mail,
  Share,
  Download,
  Maximize2,
  Minimize2,
  Refresh,
  Wifi,
  WifiOff,
  Battery,
  Signal
} from 'lucide-react';
import { Button } from '@/components/ui/core/Button';
import { Card } from '@/components/ui/core/Card';
import { Badge } from '@/components/ui/core/Badge';
import { Input } from '@/components/ui/core/Input';
import { Avatar } from '@/components/ui/core/Avatar';
import { cn } from '@/lib/utils';
import { AdvancedAICopilot } from '../ai-system/AdvancedAICopilot';

// Mobile Navigation Component
export const MobileNavigation: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  userRole: 'agent' | 'operator';
  currentPath: string;
}> = ({ isOpen, onClose, userRole, currentPath }) => {
  const navItems = [
    { id: 'dashboard', title: 'Dashboard', icon: Home, path: `/${userRole}`, badge: 0 },
    { id: 'leads', title: 'Lead Hub', icon: Target, path: `/${userRole}/lead-hub`, badge: 8 },
    { id: 'messages', title: 'Messages', icon: MessageSquare, path: `/${userRole}/communication`, badge: 3 },
    { id: 'calendar', title: 'Calendar', icon: Calendar, path: `/${userRole}/calendar`, badge: 0 },
    { id: 'analytics', title: 'Analytics', icon: BarChart3, path: `/${userRole}/analytics`, badge: 0 },
    { id: 'settings', title: 'Settings', icon: Settings, path: `/${userRole}/settings`, badge: 0 }
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Navigation Panel */}
      <div className={cn(
        'fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-50 md:hidden',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">TravelHub Pro</h2>
                  <p className="text-sm text-gray-600 capitalize">{userRole} Dashboard</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
              <Avatar 
                size="md"
                fallback={userRole === 'agent' ? 'AS' : 'IT'}
                className="bg-blue-600 text-white"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {userRole === 'agent' ? 'Anya Sharma' : 'Incredible India Tours'}
                </p>
                <p className="text-sm text-gray-600">
                  {userRole === 'agent' ? 'Travel Agent' : 'Tour Operator'}
                </p>
              </div>
              <Badge variant="success" size="sm">Pro</Badge>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              
              return (
                <a
                  key={item.id}
                  href={item.path}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-4 px-6 py-4 transition-colors',
                    isActive 
                      ? 'bg-blue-50 border-r-4 border-blue-600 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <item.icon className={cn(
                    'h-5 w-5',
                    isActive ? 'text-blue-600' : 'text-gray-400'
                  )} />
                  <span className="font-medium">{item.title}</span>
                  {item.badge > 0 && (
                    <Badge variant="danger" size="sm" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </a>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-6 border-t bg-gray-50">
            <div className="text-center text-sm text-gray-500">
              TravelHub Pro v2.1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Mobile Header Component
export const MobileHeader: React.FC<{
  title: string;
  onMenuOpen: () => void;
  userRole: 'agent' | 'operator';
  showSearch?: boolean;
  showNotifications?: boolean;
}> = ({ title, onMenuOpen, userRole, showSearch = true, showNotifications = true }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200 md:hidden">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-amber-500 text-white text-center py-2 text-sm">
          <WifiOff className="inline h-4 w-4 mr-2" />
          You're offline. Some features may be limited.
        </div>
      )}

      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onMenuOpen}>
            <Menu className="h-5 w-5" />
          </Button>
          
          {!showSearchInput && (
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          {showSearch && (
            <>
              {showSearchInput ? (
                <div className="flex-1 mx-4">
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-sm"
                    autoFocus
                  />
                </div>
              ) : (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSearchInput(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              )}
              
              {showSearchInput && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowSearchInput(false);
                    setSearchQuery('');
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </>
          )}

          {/* Notifications */}
          {showNotifications && !showSearchInput && (
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </Button>
          )}

          {/* Profile */}
          {!showSearchInput && (
            <Avatar 
              size="sm"
              fallback={userRole === 'agent' ? 'AS' : 'IT'}
              className="bg-blue-600 text-white"
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Mobile AI Copilot
export const MobileAICopilot: React.FC<{
  userRole: 'agent' | 'operator';
  isVisible: boolean;
  onToggle: () => void;
}> = ({ userRole, isVisible, onToggle }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-4 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg active:scale-95 transition-all duration-200 z-40 md:hidden flex items-center justify-center"
      >
        🧠
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold">3</span>
        </div>
      </button>
    );
  }

  return (
    <div className={cn(
      'fixed inset-0 bg-white z-50 md:hidden transition-all duration-300',
      isFullScreen ? 'inset-0' : 'bottom-0 top-20'
    )}>
      {/* Mobile AI Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm">
            🧠
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Copilot</h3>
            <p className="text-xs text-gray-600">Your intelligent assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsFullScreen(!isFullScreen)}
          >
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* AI Content - Adapted for Mobile */}
      <div className="flex-1 p-4">
        <AdvancedAICopilot 
          userRole={userRole}
          currentContext={{ page: 'mobile' }}
        />
      </div>
    </div>
  );
};

// Mobile Card Layout with Swipe Gestures
export const MobileCardLayout: React.FC<{
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}> = ({ children, onSwipeLeft, onSwipeRight, className }) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  return (
    <div
      className={cn('touch-pan-y', className)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </div>
  );
};

// Mobile Dashboard Grid
export const MobileDashboardGrid: React.FC<{
  userRole: 'agent' | 'operator';
}> = ({ userRole }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const dashboardItems = userRole === 'agent' ? [
    {
      id: 'leads',
      title: 'Lead Management',
      description: '8 hot leads awaiting action',
      icon: Target,
      color: 'bg-blue-500',
      path: '/agent/lead-hub',
      badge: 8,
      priority: 'high'
    },
    {
      id: 'revenue',
      title: 'This Month\'s Revenue',
      description: '$15,200 earned so far',
      icon: BarChart3,
      color: 'bg-green-500',
      path: '/agent/analytics',
      badge: 0,
      priority: 'medium'
    },
    {
      id: 'messages',
      title: 'Messages',
      description: '3 new client messages',
      icon: MessageSquare,
      color: 'bg-purple-500',
      path: '/agent/communication',
      badge: 3,
      priority: 'high'
    },
    {
      id: 'calendar',
      title: 'Today\'s Schedule',
      description: '2 calls, 1 follow-up',
      icon: Calendar,
      color: 'bg-amber-500',
      path: '/agent/calendar',
      badge: 0,
      priority: 'medium'
    }
  ] : [
    {
      id: 'agents',
      title: 'Agent Network',
      description: '156 active agents',
      icon: User,
      color: 'bg-blue-500',
      path: '/operator/agents',
      badge: 0,
      priority: 'medium'
    },
    {
      id: 'leads',
      title: 'Lead Pipeline',
      description: '47 leads in queue',
      icon: Target,
      color: 'bg-green-500',
      path: '/operator/leads',
      badge: 47,
      priority: 'high'
    },
    {
      id: 'revenue',
      title: 'Monthly Revenue',
      description: '$245,000 generated',
      icon: BarChart3,
      color: 'bg-purple-500',
      path: '/operator/analytics',
      badge: 0,
      priority: 'high'
    },
    {
      id: 'messages',
      title: 'Agent Messages',
      description: '12 agent inquiries',
      icon: MessageSquare,
      color: 'bg-amber-500',
      path: '/operator/communication',
      badge: 12,
      priority: 'medium'
    }
  ];

  return (
    <div className="p-4 md:hidden">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Quick Access</h2>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Dashboard Items */}
      <div className={cn(
        viewMode === 'grid' 
          ? 'grid grid-cols-2 gap-4'
          : 'space-y-3'
      )}>
        {dashboardItems.map((item) => (
          <MobileCardLayout
            key={item.id}
            onSwipeLeft={() => window.location.href = item.path}
            className={cn(
              viewMode === 'grid' ? 'aspect-square' : 'h-20'
            )}
          >
            <a
              href={item.path}
              className="block h-full"
            >
              <Card className={cn(
                'h-full p-4 active:scale-95 transition-all duration-200',
                item.priority === 'high' && 'ring-2 ring-red-200 bg-red-50'
              )}>
                <div className={cn(
                  'flex',
                  viewMode === 'grid' ? 'flex-col items-center text-center h-full justify-center' : 'items-center gap-4'
                )}>
                  <div className={cn(
                    'rounded-full flex items-center justify-center text-white flex-shrink-0',
                    item.color,
                    viewMode === 'grid' ? 'w-12 h-12 mb-3' : 'w-10 h-10'
                  )}>
                    <item.icon className={cn(
                      viewMode === 'grid' ? 'h-6 w-6' : 'h-5 w-5'
                    )} />
                  </div>
                  
                  <div className={cn(
                    'flex-1',
                    viewMode === 'grid' && 'text-center'
                  )}>
                    <div className="flex items-center gap-2 justify-center">
                      <h3 className={cn(
                        'font-semibold text-gray-900',
                        viewMode === 'grid' ? 'text-sm' : 'text-base'
                      )}>
                        {item.title}
                      </h3>
                      {item.badge > 0 && (
                        <Badge variant="danger" size="sm">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className={cn(
                      'text-gray-600',
                      viewMode === 'grid' ? 'text-xs mt-1' : 'text-sm'
                    )}>
                      {item.description}
                    </p>
                  </div>

                  {viewMode === 'list' && (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </Card>
            </a>
          </MobileCardLayout>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[
            { label: 'Add Lead', icon: Plus, color: 'bg-blue-500' },
            { label: 'Call Client', icon: Phone, color: 'bg-green-500' },
            { label: 'Send Email', icon: Mail, color: 'bg-purple-500' },
            { label: 'Schedule', icon: Calendar, color: 'bg-amber-500' }
          ].map((action) => (
            <button
              key={action.label}
              className={cn(
                'flex-shrink-0 flex flex-col items-center gap-2 p-4 rounded-xl text-white active:scale-95 transition-all duration-200',
                action.color
              )}
            >
              <action.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// PWA Install Prompt
export const PWAInstallPrompt: React.FC = () => {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showInstallPrompt || localStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 md:max-w-md md:left-auto">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Download className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">
            Install TravelHub Pro
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Get quick access and work offline. Install our app for the best experience.
          </p>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleInstall}>
              Install
            </Button>
            <Button variant="outline" size="sm" onClick={handleDismiss}>
              Not now
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="p-1 -mt-1 -mr-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Mobile Status Bar (shows connection, battery, etc.)
export const MobileStatusBar: React.FC = () => {
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isOnline, setIsOnline] = useState(true);
  const [signalStrength, setSignalStrength] = useState(4);

  useEffect(() => {
    // Battery API
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }

    // Network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center justify-end gap-2 px-2 py-1 text-xs md:hidden">
      {/* Network Status */}
      <div className="flex items-center gap-1">
        {isOnline ? (
          <Wifi className="h-3 w-3 text-gray-600" />
        ) : (
          <WifiOff className="h-3 w-3 text-red-500" />
        )}
        <Signal className="h-3 w-3 text-gray-600" />
      </div>

      {/* Battery */}
      <div className="flex items-center gap-1">
        <Battery className="h-3 w-3 text-gray-600" />
        <span className="text-gray-600">{batteryLevel}%</span>
      </div>

      {/* Time */}
      <span className="text-gray-600">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
};

// Hook for detecting mobile device
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile;
};

// Hook for PWA capabilities
export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(isPWA);

    // Check if installable
    const handler = () => setIsInstallable(true);
    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  return { isInstallable, isInstalled };
};