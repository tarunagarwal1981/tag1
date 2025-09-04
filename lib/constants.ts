// lib/constants.ts - Application constants
export const APP_CONFIG = {
    name: 'TravelHub Pro',
    version: '2.1.0',
    description: 'AI-Powered Travel Industry Platform',
    supportEmail: 'support@travelhubpro.com',
    website: 'https://travelhubpro.com'
  } as const;
  
  export const USER_ROLES = {
    AGENT: 'agent',
    OPERATOR: 'operator',
    ADMIN: 'admin'
  } as const;
  
  export const LEAD_STATUS = {
    NEW: 'new',
    QUALIFIED: 'qualified',
    CONTACTED: 'contacted',
    PROPOSAL_SENT: 'proposal_sent',
    NEGOTIATING: 'negotiating',
    BOOKING_CONFIRMED: 'booking_confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed'
  } as const;
  
  export const PACKAGE_STATUS = {
    DRAFT: 'draft',
    ACTIVE: 'active',
    PAUSED: 'paused',
    ARCHIVED: 'archived'
  } as const;
  
  export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PAID: 'paid',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    REFUNDED: 'refunded'
  } as const;
  
  export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  } as const;
  
  export const CURRENCIES = [
    { code: 'USD', symbol: ', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'AUD', symbol: 'A, name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C, name: 'Canadian Dollar' }
  ] as const;
  
  export const COUNTRIES = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' }
  ] as const;
  
  export const PACKAGE_CATEGORIES = [
    { id: 'cultural', name: 'Cultural', icon: '🏛️' },
    { id: 'adventure', name: 'Adventure', icon: '🏔️' },
    { id: 'nature', name: 'Nature', icon: '🌿' },
    { id: 'beach', name: 'Beach', icon: '🏖️' },
    { id: 'luxury', name: 'Luxury', icon: '✨' },
    { id: 'budget', name: 'Budget', icon: '💰' },
    { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦' },
    { id: 'romantic', name: 'Romantic', icon: '💕' },
    { id: 'spiritual', name: 'Spiritual', icon: '🕉️' },
    { id: 'wildlife', name: 'Wildlife', icon: '🦌' }
  ] as const;
  
  export const COMMISSION_TIERS = [
    { min: 0, max: 50000, rate: 10 },
    { min: 50001, max: 100000, rate: 12 },
    { min: 100001, max: 250000, rate: 15 },
    { min: 250001, max: 500000, rate: 18 },
    { min: 500001, max: Infinity, rate: 22 }
  ] as const;
  
  export const NOTIFICATION_TYPES = {
    LEAD_ASSIGNED: 'lead_assigned',
    BOOKING_CONFIRMED: 'booking_confirmed',
    PAYMENT_RECEIVED: 'payment_received',
    COMMISSION_EARNED: 'commission_earned',
    MESSAGE_RECEIVED: 'message_received',
    PACKAGE_UPDATED: 'package_updated',
    SYSTEM_ALERT: 'system_alert'
  } as const;