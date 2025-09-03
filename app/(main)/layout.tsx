// Updated Main Layout - app/(main)/layout.tsx

'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/dashboard/Header';
import { EnhancedSidebar } from '@/components/dashboard/EnhancedSidebar';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const role = pathname.startsWith('/operator') ? 'operator' : 'agent';

  return (
    <div className={cn('flex min-h-screen bg-gray-50')}>
      <EnhancedSidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
