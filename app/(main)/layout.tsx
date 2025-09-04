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

// components/ui/core/index.ts - Export all UI components
export { Button } from './Button';
export { Card } from './Card';
export { Badge } from './Badge';
export { Avatar } from './Avatar';
export { Input } from './Input';
export { Select } from './Select';

// types/index.ts - Centralized type definitions
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'agent' | 'operator' | 'admin';
  avatar?: string;
  plan: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  status: 'new' | 'qualified' | 'contacted' | 'proposal_sent' | 'negotiating' | 'booking_confirmed' | 'cancelled' | 'completed';
  source: string;
  destination: string;
  travelDates: {
    start: string;
    end: string;
  };
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  groupSize: number;
  requirements: string;
  score: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  agentId: string;
  estimatedValue: number;
  createdAt: string;
  updatedAt: string;
  tasks: Task[];
  activity: ActivityLog[];
  documents: Document[];
  payment?: {
    total: number;
    paid: number;
    currency: string;
  };
}

export interface Task {
  id: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  assignedTo?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  type: 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE' | 'BOOKING' | 'PAYMENT';
  content: string;
  timestamp: string;
  author: string;
  agentInvolved?: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'Quote' | 'Itinerary' | 'Ticket' | 'Voucher' | 'Contract';
  url: string;
  uploadedAt: string;
  size: number;
}

export interface TourPackage {
  id: string;
  title: string;
  destination: string;
  duration: number;
  description: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: DayItinerary[];
  images: PackageImage[];
  pricePerPerson: number;
  maxGroupSize: number;
  category: string;
  difficulty: 'easy' | 'moderate' | 'challenging' | 'extreme';
  bestTime: string;
  agentCommission: number;
  status: 'draft' | 'active' | 'paused' | 'archived';
  operatorId: string;
  createdAt: string;
  updatedAt: string;
  bookings: Booking[];
  reviews: Review[];
  metadata?: {
    cancellationPolicy?: string;
    paymentTerms?: string;
    tags?: string[];
  };
}

export interface DayItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  accommodation?: string;
  meals: string[];
  transport?: string;
}

export interface PackageImage {
  id: string;
  url: string;
  caption: string;
  isPrimary: boolean;
  order: number;
}

export interface Booking {
  id: string;
  packageId: string;
  leadId: string;
  agentId: string;
  operatorId: string;
  clientDetails: {
    name: string;
    email: string;
    phone: string;
    groupSize: number;
  };
  travelDates: {
    start: string;
    end: string;
  };
  totalAmount: number;
  paidAmount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'completed';
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  packageId: string;
  agentId: string;
  agentName: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: string;
}

export interface Commission {
  id: string;
  agentId: string;
  bookingId: string;
  amount: number;
  currency: string;
  rate: number;
  status: 'pending' | 'paid' | 'cancelled';
  paidAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'lead_assigned' | 'booking_confirmed' | 'payment_received' | 'commission_earned' | 'message_received' | 'package_updated' | 'system_alert';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

// Utility types
export type UserRole = 'agent' | 'operator' | 'admin';
export type LeadStatus = 'new' | 'qualified' | 'contacted' | 'proposal_sent' | 'negotiating' | 'booking_confirmed' | 'cancelled' | 'completed';
export type BookingStatus = 'pending' | 'confirmed' | 'paid' | 'cancelled' | 'completed';
export type PackageStatus = 'draft' | 'active' | 'paused' | 'archived';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD' | 'CAD';