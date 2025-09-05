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