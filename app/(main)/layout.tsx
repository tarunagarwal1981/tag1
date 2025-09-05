// app/(main)/layout.tsx - Updated main layout
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/dashboard/Header';
import { EnhancedSidebar } from '@/components/dashboard/EnhancedSidebar';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Determine user role from pathname
  const role = pathname.startsWith('/operator') ? 'operator' : 'agent';

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={cn('flex min-h-screen bg-gray-50')}>
      {/* Sidebar */}
      <EnhancedSidebar role={role} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header role={role} />
        
        {/* Page Content */}
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white px-8 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span>© 2025 TravelHub Pro</span>
                <span>•</span>
                <a href="#" className="hover:text-gray-700 transition-colors">
                  Privacy Policy
                </a>
                <span>•</span>
                <a href="#" className="hover:text-gray-700 transition-colors">
                  Terms of Service
                </a>
              </div>
              
              <div className="flex items-center space-x-4">
                <span>Version 2.1.0</span>
                <span>•</span>
                <a 
                  href="#" 
                  className="hover:text-gray-700 transition-colors flex items-center gap-1"
                >
                  Support
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

