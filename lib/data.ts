// --- IMPORTS ---
import { type FC, type ReactNode } from 'react';
import {
  Search,
  Plane,
  Calendar,
  Users,
  ChevronDown,
  ArrowRight,
  Bell,
  UserCircle,
  PlusCircle,
  ShoppingBasket,
  LayoutGrid,
  MapPin,
  Package,
  Settings,
  Building,
  Shield,
  FileText,
  Filter,
  MoreHorizontal,
  Download,
  Share2,
  Eye,
  Edit,
  ArrowLeft,
  Plus,
  GripVertical,
  TrendingUp,
  DollarSign,
  Target,
  Award,
  Zap,
  BarChart3,
  Crown,
  AlertCircle,
  ArrowUpRight,
  Clock,
  Phone,
  Mail,
  Globe,
  Briefcase,
  Star,
  LineChart,
  Home,
  Paperclip,
  MessageSquare,
  Flame,
  CheckCircle,
  XCircle,
  PauseCircle,
  ChevronRight,
  Coins,
  Receipt,
  Ticket,
  type LucideIcon, // Import the LucideIcon type
} from 'lucide-react';

// --- TYPE DEFINITIONS ---

export type PageId =
  | 'home'
  | 'my-dashboard'
  | 'analytics'
  | 'buy-leads'
  | 'my-leads'
  | 'my-itineraries'
  | 'my-products'
  | 'settings'
  | 'products'
  | 'bookings'
  | 'reports'
  | 'agents';

export type View = 'landing' | 'operator' | 'agent';

// ✨ NEW: Define a type for our navigation items
export interface NavItem {
  id: PageId;
  title: string;
  icon: LucideIcon;
  notification?: number; // The '?' makes this property optional
}

export type LeadStatus =
  | 'NEW'
  | 'QUALIFICATION'
  | 'QUOTING'
  | 'BOOKED'
  | 'OPERATIONS'
  | 'TRAVELING'
  | 'PRE_DEPARTURE';

export type LeadTemperature = 'HOT' | 'COLD' | 'HOLD';

export type PaymentStatus =
  | 'UNPAID'
  | 'DEPOSIT_PENDING'
  | 'DEPOSIT_PAID'
  | 'PARTIALLY_PAID'
  | 'FULLY_PAID';

export interface Task {
  id: string;
  description: string;
  dueDate: string; // ISO 8601 date string
  isCompleted: boolean;
  priority: 'Low' | 'Medium' | 'High';
}

export interface ActivityLog {
  id: string;
  type:
    | 'NOTE'
    | 'CALL'
    | 'EMAIL'
    | 'STATUS_CHANGE'
    | 'QUOTE_SENT'
    | 'FOLLOW_UP';
  content: string;
  timestamp: string; // ISO 8601 date string
  author: string; // agent/subAgent name
}

export interface Document {
  id: string;
  name: string;
  type: 'Quote' | 'Itinerary' | 'Voucher' | 'Ticket';
  url: string;
  uploadedAt: string;
}

export interface Lead {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  destination: string;
  travelDates: { from: string; to: string };
  travelerCount: number;
  estimatedValue: number;
  status: LeadStatus;
  temperature: LeadTemperature;
  assignedTo: SubAgent;
  source: string;
  tasks: Task[];
  activity: ActivityLog[];
  documents: Document[];
  payment: {
    total: number;
    paid: number;
    status: PaymentStatus;
  };
  aiScore: number; // A score from 0-100
  createdAt: string;
  updatedAt: string;
}

export interface SubAgent {
  id: string;
  name: string;
  avatarUrl: string;
}

// --- DATA ---

export const sidebarNavItems: Record<'agent' | 'operator', NavItem[]> = {
  agent: [
    { id: 'home', title: 'Home', icon: Home },
    { id: 'my-dashboard', title: 'My Dashboard', icon: LayoutGrid },
    {
      id: 'buy-leads',
      title: 'Buy Leads',
      icon: ShoppingBasket,
      notification: 12,
    },
    {
      id: 'my-leads',
      title: 'My Leads',
      icon: Target,
      notification: 3,
    },
    { id: 'my-itineraries', title: 'My Itineraries', icon: MapPin },
    { id: 'my-products', title: 'My Products', icon: Package },
    { id: 'settings', title: 'Settings', icon: Settings },
  ],
  operator: [
    { id: 'home', title: 'Home', icon: Home },
    { id: 'analytics', title: 'Analytics', icon: BarChart3 },
    { id: 'products', title: 'Products', icon: Package },
    { id: 'bookings', title: 'Bookings', icon: FileText },
    { id: 'agents', title: 'Agents', icon: Users },
    { id: 'reports', title: 'Reports', icon: LineChart },
    { id: 'settings', title: 'Settings', icon: Settings },
  ],
};

export const agentStats = {
  activeLeads: 42,
  conversionRate: 15.2,
  monthlyCommission: 5800,
  activeDeals: 11,
};

export const operatorStats = {
  totalRevenue: 485900,
  profitMargin: 21.5,
  bookingsThisMonth: 142,
  upcomingDepartures: 18,
};

export const bookingRevenueData = [
  { name: 'Jan', revenue: 20000 },
  { name: 'Feb', revenue: 30000 },
  { name: 'Mar', revenue: 45000 },
  { name: 'Apr', revenue: 60000 },
  { name: 'May', revenue: 55000 },
  { name: 'Jun', revenue: 70000 },
  { name: 'Jul', revenue: 80000 },
  { name: 'Aug', revenue: 95000 },
  { name: 'Sep', revenue: 85000 },
  { name: 'Oct', revenue: 75000 },
  { name: 'Nov', revenue: 60000 },
  { name: 'Dec', revenue: 50000 },
];

export const topProductsData = [
  {
    id: 1,
    name: '10-Day Best of Japan',
    bookings: 120,
    image:
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'European Capitals Explorer',
    bookings: 210,
    image:
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Luxury Maldives Getaway',
    bookings: 85,
    image:
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=800&auto=format&fit=crop',
  },
];

export const recentBookingsData = [
  {
    id: 'BK-78912',
    product: '10-Day Best of Japan',
    customer: 'Rohan Gupta',
    date: '2025-08-31',
    amount: '€5,000',
    status: 'Confirmed',
  },
  {
    id: 'BK-78911',
    product: 'European Capitals Explorer',
    customer: 'Priya Singh',
    date: '2025-08-30',
    amount: '€6,400',
    status: 'Confirmed',
  },
  {
    id: 'BK-78910',
    product: 'Luxury Maldives Getaway',
    customer: 'Vikram Mehta',
    date: '2025-08-29',
    amount: '€8,000',
    status: 'Pending',
  },
  {
    id: 'BK-78909',
    product: '10-Day Best of Japan',
    customer: 'Anjali Rao',
    date: '2025-08-28',
    amount: '€2,500',
    status: 'Cancelled',
  },
];

export const dealCategories = [
  'Fixed Departure',
  'Top Air Fares',
  'Series Fares',
  'Group Fares',
];
export const dealsData = {
  'Fixed Departure': [
    {
      id: 1,
      from: 'Berlin',
      to: 'Vienna',
      price: 3085,
      imageUrl:
        'https://images.unsplash.com/photo-1549922259-f2458429034c?q=80&w=800&auto=format&fit=crop',
      airlineLogoUrl: 'https://logo.clearbit.com/lufthansa.com',
      tag: 'Hot Deal',
    },
    {
      id: 2,
      from: 'Paris',
      to: 'Rome',
      price: 2950,
      imageUrl:
        'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=800&auto=format&fit=crop',
      airlineLogoUrl: 'https://logo.clearbit.com/airfrance.com',
    },
    {
      id: 3,
      from: 'London',
      to: 'Barcelona',
      price: 2250,
      imageUrl:
        'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=800&auto=format&fit=crop',
      airlineLogoUrl: 'https://logo.clearbit.com/britishairways.com',
      tag: 'Limited Time',
    },
  ],
  'Top Air Fares': [
    {
      id: 6,
      from: 'Delhi',
      to: 'Dubai',
      price: 1850,
      imageUrl:
        'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=800&auto=format&fit=crop',
      airlineLogoUrl: 'https://logo.clearbit.com/emirates.com',
    },
    {
      id: 7,
      from: 'Mumbai',
      to: 'Singapore',
      price: 2100,
      imageUrl:
        'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?q=80&w=800&auto=format&fit=crop',
      airlineLogoUrl: 'https://logo.clearbit.com/singaporeair.com',
    },
  ],
  'Series Fares': [
    {
      id: 8,
      from: 'New York',
      to: 'Los Angeles',
      price: 3200,
      imageUrl:
        'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=800&auto=format&fit=crop',
      airlineLogoUrl: 'https://logo.clearbit.com/united.com',
    },
  ],
  'Group Fares': [
    {
      id: 9,
      from: 'Tokyo',
      to: 'Seoul',
      price: 1500,
      imageUrl:
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop',
      airlineLogoUrl: 'https://logo.clearbit.com/ana.co.jp',
      tag: 'Group Special',
    },
  ],
};

export const buyLeadsData = [
  {
    id: 1,
    title: 'Family Trip to Switzerland',
    travelers: 4,
    budget: '€8,000',
    dates: 'July 2026',
    quality: 'Hot',
    price: 50,
  },
  {
    id: 2,
    title: 'Honeymoon in Bali',
    travelers: 2,
    budget: '€5,000',
    dates: 'Sep 2025',
    quality: 'Warm',
    price: 35,
  },
  {
    id: 3,
    title: 'Corporate Retreat in Dubai',
    travelers: 15,
    budget: '€25,000',
    dates: 'Nov 2025',
    quality: 'Hot',
    price: 150,
  },
  {
    id: 4,
    title: 'Solo Backpacker - Southeast Asia',
    travelers: 1,
    budget: '€3,000',
    dates: 'Oct 2025',
    quality: 'Cold',
    price: 20,
  },
  {
    id: 5,
    title: 'Anniversary Trip to Paris',
    travelers: 2,
    budget: '€4,500',
    dates: 'Dec 2025',
    quality: 'Warm',
    price: 40,
  },
  {
    id: 6,
    title: 'Adventure Tour - New Zealand',
    travelers: 6,
    budget: '€12,000',
    dates: 'Mar 2026',
    quality: 'Hot',
    price: 85,
  },
];

export const myLeadsData = [
  {
    id: 1,
    name: 'Rohan Gupta',
    destination: 'Europe',
    status: 'Proposal Sent',
    lastContact: '2025-08-28',
    assigned: 'Aman S.',
  },
  {
    id: 2,
    name: 'Priya Singh',
    destination: 'Maldives',
    status: 'Converted',
    lastContact: '2025-08-25',
    assigned: 'Self',
  },
  {
    id: 3,
    name: 'Vikram Mehta',
    destination: 'USA West Coast',
    status: 'New',
    lastContact: '2025-09-01',
    assigned: 'Unassigned',
  },
  {
    id: 4,
    name: 'Anjali Rao',
    destination: 'Japan Cherry Blossom',
    status: 'Contacted',
    lastContact: '2025-08-30',
    assigned: 'Self',
  },
  {
    id: 5,
    name: 'Rahul Sharma',
    destination: 'Thailand',
    status: 'Follow Up',
    lastContact: '2025-08-27',
    assigned: 'Self',
  },
];

export const myItinerariesData = [
  {
    id: 1,
    title: "Sharma Family's Grand European Tour",
    client: 'Mr. Ramesh Sharma',
    dates: '15 Oct - 30 Oct 2025',
    status: 'Confirmed',
  },
  {
    id: 2,
    title: "Aditi's Bali Honeymoon",
    client: 'Aditi Rao',
    dates: '01 Dec - 08 Dec 2025',
    status: 'Sent to Client',
  },
  {
    id: 3,
    title: 'TechCorp Annual Retreat - Goa',
    client: 'TechCorp Inc.',
    dates: '20 Jan - 23 Jan 2026',
    status: 'Draft',
  },
  {
    id: 4,
    title: 'Wilson Family Australia Adventure',
    client: 'David Wilson',
    dates: '15 Feb - 02 Mar 2026',
    status: 'In Progress',
  },
];

export const myProductsData = [
  {
    id: 1,
    name: '10-Day Best of Japan',
    price: '€2,500',
    duration: '10D/9N',
    status: 'Active',
    imageUrl:
      'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=800&auto=format&fit=crop',
    bookings: 120,
  },
  {
    id: 2,
    name: 'Luxury Maldives Getaway',
    price: '€4,000',
    duration: '7D/6N',
    status: 'Active',
    imageUrl:
      'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=800&auto=format&fit=crop',
    bookings: 85,
  },
  {
    id: 3,
    name: 'Spiritual India Journey',
    price: '€1,800',
    duration: '12D/11N',
    status: 'Draft',
    imageUrl:
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800&auto=format&fit=crop',
    bookings: 0,
  },
  {
    id: 4,
    name: 'European Capitals Explorer',
    price: '€3,200',
    duration: '14D/13N',
    status: 'Active',
    imageUrl:
      'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop',
    bookings: 210,
  },
];

export const initialItineraryFormData = {
  title: 'Dream Honeymoon in Greece',
  client: 'Priya & Rohan',
  travelers: 2,
  startDate: '2026-05-10',
  endDate: '2026-05-20',
  days: [
    {
      day: 1,
      title: 'Arrival in Athens & Acropolis Visit',
      description: 'Arrive at Athens International Airport...',
      meals: { B: true, L: false, D: true },
      accommodation: 'Hotel Grande Bretagne, Athens',
    },
    {
      day: 2,
      title: 'Fly to Santorini & Oia Sunset',
      description: 'Morning flight to Santorini...',
      meals: { B: true, L: true, D: false },
      accommodation: 'Canaves Oia Suites, Santorini',
    },
  ],
  inclusions:
    '• International & Domestic Flights\n• 5-star hotel accommodations',
  exclusions: '• Visa fees\n• Travel insurance',
  totalCost: 9500,
};

export const subAgentsData: SubAgent[] = [
  {
    id: 'agent-1',
    name: 'Anya Sharma',
    avatarUrl: 'https://i.pravatar.cc/150?u=anya',
  },
  {
    id: 'agent-2',
    name: 'Rohan Verma',
    avatarUrl: 'https://i.pravatar.cc/150?u=rohan',
  },
  {
    id: 'agent-3',
    name: 'Priya Patel',
    avatarUrl: 'https://i.pravatar.cc/150?u=priya',
  },
];

export const kanbanColumnsData: { id: LeadStatus; title: string }[] = [
  { id: 'NEW', title: 'New Leads' },
  { id: 'QUALIFICATION', title: 'Qualification' },
  { id: 'QUOTING', title: 'Quoting' },
  { id: 'BOOKED', title: 'Booked / Deposit Paid' },
  { id: 'OPERATIONS', title: 'Operations' },
];

export const enhancedLeadsWithHistory: Lead[] = [
  {
    id: 'LEAD-001',
    clientName: 'Arjun & Priya Sharma',
    clientEmail: 'arjun.sharma@techcorp.com',
    clientPhone: '+91 98765 43210',
    destination: 'Romantic Honeymoon - Santorini, Greece',
    travelDates: { from: '2026-02-14', to: '2026-02-24' },
    travelerCount: 2,
    estimatedValue: 4500,
    status: 'QUALIFICATION',
    temperature: 'HOT',
    assignedTo: subAgentsData[0],
    source: 'Website Lead Form - Valentine Special',
    tasks: [
      {
        id: 'T001',
        description:
          'Send customized Santorini honeymoon package with sunset villa options',
        dueDate: '2025-09-04T14:00:00Z',
        isCompleted: false,
        priority: 'High',
      },
      {
        id: 'T002',
        description: 'Follow up on Greece travel guide feedback',
        dueDate: '2025-09-03T10:00:00Z',
        isCompleted: true,
        priority: 'Medium',
      },
      {
        id: 'T003',
        description: 'Arrange virtual Santorini resort tour',
        dueDate: '2025-09-05T16:00:00Z',
        isCompleted: false,
        priority: 'High',
      },
    ],
    activity: [
      {
        id: 'A001',
        type: 'CALL',
        content:
          '45-min consultation call completed. Couple is very excited about Santorini. Budget confirmed at €4,500. They prefer sunset views and are flexible with dates in Feb 2026. Priya mentioned wanting a romantic dinner on the beach. Follow up with villa options.',
        timestamp: '2025-09-02T15:30:00Z',
        author: 'Anya Sharma',
      },
      {
        id: 'A002',
        type: 'EMAIL',
        content:
          'Sent welcome email with Greece travel guide PDF and initial Santorini overview. Also included visa requirements for Indian passport holders.',
        timestamp: '2025-09-02T16:15:00Z',
        author: 'Anya Sharma',
      },
      {
        id: 'A003',
        type: 'NOTE',
        content:
          'Client response: "Thank you for the detailed guide! We loved the sunset villa recommendations. Could you send more options with private pools? Also, what about couples spa experiences?"',
        timestamp: '2025-09-03T09:45:00Z',
        author: 'Anya Sharma',
      },
      {
        id: 'A004',
        type: 'EMAIL',
        content:
          'Responded with 5 luxury villa options with private pools and infinity views. Included spa package details from 3 top resorts. All within their budget range.',
        timestamp: '2025-09-03T11:20:00Z',
        author: 'Anya Sharma',
      },
      {
        id: 'A005',
        type: 'FOLLOW_UP',
        content:
          'Scheduled follow-up call for Sept 4th at 2 PM to discuss villa preferences and finalize booking.',
        timestamp: '2025-09-03T11:25:00Z',
        author: 'Anya Sharma',
      },
    ],
    documents: [
      {
        id: 'D001',
        name: 'Santorini_Honeymoon_Package_Options.pdf',
        type: 'Quote',
        url: '#santorini-options',
        uploadedAt: '2025-09-03T11:20:00Z',
      },
    ],
    payment: { total: 4500, paid: 0, status: 'UNPAID' },
    aiScore: 95,
    createdAt: '2025-09-02T09:15:00Z',
    updatedAt: '2025-09-03T11:25:00Z',
  },

  {
    id: 'LEAD-007',
    clientName: 'Startup Founders Group',
    clientEmail: 'team@innovatetech.com',
    clientPhone: '+91 98555 33333',
    destination: 'Entrepreneur Retreat - Bali, Indonesia',
    travelDates: { from: '2025-10-25', to: '2025-11-01' },
    travelerCount: 8,
    estimatedValue: 16000,
    status: 'QUOTING',
    temperature: 'HOT',
    assignedTo: subAgentsData[1],
    source: 'Startup Network Event',
    tasks: [
      {
        id: 'T009',
        description:
          'Revise Bali retreat package - add coworking spaces and team building activities',
        dueDate: '2025-08-31T17:00:00Z', // Overdue
        isCompleted: false,
        priority: 'High',
      },
      {
        id: 'T010',
        description: 'Schedule final presentation meeting with founding team',
        dueDate: '2025-09-04T09:00:00Z',
        isCompleted: false,
        priority: 'High',
      },
      {
        id: 'T011',
        description:
          'Research local networking events in Bali for startup founders',
        dueDate: '2025-09-03T12:00:00Z',
        isCompleted: true,
        priority: 'Medium',
      },
    ],
    activity: [
      {
        id: 'A009',
        type: 'EMAIL',
        content:
          'Initial inquiry received via startup event contact. 8 founders looking for a working retreat in Bali. Budget: €15-18K. Dates flexible in late Oct/early Nov.',
        timestamp: '2025-08-25T11:30:00Z',
        author: 'Rohan Verma',
      },
      {
        id: 'A010',
        type: 'CALL',
        content:
          'Spoke with Sarah (CTO) - group wants blend of work and relaxation. Need reliable WiFi, meeting spaces, and some team bonding activities. Prefer villa accommodation over hotel.',
        timestamp: '2025-08-26T14:20:00Z',
        author: 'Rohan Verma',
      },
      {
        id: 'A011',
        type: 'QUOTE_SENT',
        content:
          'Sent comprehensive Bali retreat package - €16,000 for 8 people, 7 nights. Included luxury villa with coworking space, team activities, and networking dinner.',
        timestamp: '2025-08-28T15:20:00Z',
        author: 'Rohan Verma',
      },
      {
        id: 'A012',
        type: 'EMAIL',
        content:
          'Client feedback: "Love the villa and coworking setup! Can you add more structured team building? Also curious about local startup scene connections." Revision needed.',
        timestamp: '2025-08-30T16:45:00Z',
        author: 'Rohan Verma',
      },
      {
        id: 'A013',
        type: 'NOTE',
        content:
          'OVERDUE: Need to send revised quote with enhanced team building program and local startup networking events. Client is keen but waiting for updates.',
        timestamp: '2025-09-02T10:30:00Z',
        author: 'Rohan Verma',
      },
      {
        id: 'A014',
        type: 'FOLLOW_UP',
        content:
          'WhatsApp message sent: "Hi Sarah! Working on the enhanced package with team building activities you requested. Will have it ready by Thursday. Thanks for your patience!"',
        timestamp: '2025-09-02T13:15:00Z',
        author: 'Rohan Verma',
      },
    ],
    documents: [
      {
        id: 'D002',
        name: 'Bali_Entrepreneur_Retreat_Quote_v1.pdf',
        type: 'Quote',
        url: '#bali-quote-v1',
        uploadedAt: '2025-08-28T15:20:00Z',
      },
    ],
    payment: { total: 16000, paid: 0, status: 'UNPAID' },
    aiScore: 87,
    createdAt: '2025-08-25T11:30:00Z',
    updatedAt: '2025-09-02T13:15:00Z',
  },

  {
    id: 'LEAD-010',
    clientName: 'Sanjay & Neha Agarwal',
    clientEmail: 'sanjay.neha@gmail.com',
    clientPhone: '+91 98111 22333',
    destination: 'Golden Triangle + Rajasthan - Luxury Train',
    travelDates: { from: '2025-11-15', to: '2025-11-28' },
    travelerCount: 2,
    estimatedValue: 8500,
    status: 'BOOKED',
    temperature: 'HOLD',
    assignedTo: subAgentsData[0],
    source: 'Luxury Travel Expo',
    tasks: [
      {
        id: 'T014',
        description:
          'Collect remaining 70% payment (€5,950) before November 1st',
        dueDate: '2025-10-15T12:00:00Z',
        isCompleted: false,
        priority: 'High',
      },
      {
        id: 'T015',
        description: 'Send detailed packing guide for luxury train journey',
        dueDate: '2025-10-20T10:00:00Z',
        isCompleted: false,
        priority: 'Medium',
      },
      {
        id: 'T016',
        description: 'Confirm dietary preferences for train dining',
        dueDate: '2025-10-10T15:00:00Z',
        isCompleted: false,
        priority: 'Medium',
      },
    ],
    activity: [
      {
        id: 'A014',
        type: 'NOTE',
        content:
          'Met at Luxury Travel Expo - couple interested in authentic Indian heritage experience. Budget €8-10K. Sanjay is history buff, Neha loves photography.',
        timestamp: '2025-08-10T10:15:00Z',
        author: 'Anya Sharma',
      },
      {
        id: 'A015',
        type: 'CALL',
        content:
          'Initial consultation call - discussed Maharaja Express vs Palace on Wheels. They prefer the Golden Chariot route with Rajasthan extension. Confirmed 2-week availability in November.',
        timestamp: '2025-08-12T16:30:00Z',
        author: 'Anya Sharma',
      },
      {
        id: 'A016',
        type: 'QUOTE_SENT',
        content:
          'Sent luxury train package quote - Golden Chariot + Rajasthan extension, €8,500 for 2 people, 13 days/12 nights. Included all meals, excursions, and heritage hotels.',
        timestamp: '2025-08-14T11:45:00Z',
        author: 'Anya Sharma',
      },
      {
        id: 'A017',
        type: 'EMAIL',
        content:
          'Client response: "This looks perfect! The palace hotels are exactly what we wanted. Ready to book. How does payment work?" Sent payment terms and booking form.',
        timestamp: '2025-08-15T09:20:00Z',
        author: 'Anya Sharma',
      },
      {
        id: 'A018',
        type: 'STATUS_CHANGE',
        content:
          'Booking confirmed! Received 30% deposit (€2,550). Train bookings secured for November 15-28. Heritage hotels confirmed.',
        timestamp: '2025-08-15T14:20:00Z',
        author: 'Anya Sharma',
      },
      {
        id: 'A019',
        type: 'EMAIL',
        content:
          'Sent booking confirmation with detailed itinerary, train ticket vouchers, and hotel confirmations. Also included pre-travel checklist.',
        timestamp: '2025-08-15T14:25:00Z',
        author: 'Anya Sharma',
      },
      {
        id: 'A020',
        type: 'CALL',
        content:
          'Check-in call - couple is very excited! Neha asked about best photography spots. Provided list of must-visit locations and timing tips.',
        timestamp: '2025-08-25T15:45:00Z',
        author: 'Anya Sharma',
      },
      {
        id: 'A021',
        type: 'NOTE',
        content:
          'Added note to collect dietary preferences - Neha is vegetarian, Sanjay has mild nut allergy. Need to inform train catering and hotels.',
        timestamp: '2025-09-01T11:30:00Z',
        author: 'Anya Sharma',
      },
    ],
    documents: [
      {
        id: 'D006',
        name: 'Golden_Triangle_Luxury_Train_Booking.pdf',
        type: 'Ticket',
        url: '#train-booking',
        uploadedAt: '2025-08-15T14:25:00Z',
      },
      {
        id: 'D007',
        name: 'Heritage_Hotels_Confirmations.pdf',
        type: 'Voucher',
        url: '#hotel-confirmations',
        uploadedAt: '2025-08-15T14:25:00Z',
      },
    ],
    payment: { total: 8500, paid: 2550, status: 'DEPOSIT_PAID' },
    aiScore: 96,
    createdAt: '2025-08-10T10:15:00Z',
    updatedAt: '2025-09-01T11:30:00Z',
  },

  {
    id: 'LEAD-013',
    clientName: 'Film Production House - "Mountain Dreams"',
    clientEmail: 'production@bollywoodfilms.com',
    clientPhone: '+91 99111 66666',
    destination: 'Film Shooting - Swiss Alps',
    travelDates: { from: '2025-09-10', to: '2025-09-25' },
    travelerCount: 35,
    estimatedValue: 87500,
    status: 'OPERATIONS',
    temperature: 'HOLD',
    assignedTo: subAgentsData[2],
    source: 'Entertainment Industry Contact',
    tasks: [
      {
        id: 'T020',
        description: 'Daily crew check-in and coordinate with location manager',
        dueDate: '2025-09-03T08:00:00Z',
        isCompleted: false,
        priority: 'High',
      },
      {
        id: 'T021',
        description:
          'Arrange equipment transportation from Zurich to filming locations',
        dueDate: '2025-09-08T12:00:00Z',
        isCompleted: false,
        priority: 'High',
      },
      {
        id: 'T022',
        description:
          'Coordinate catering for 35 crew members during 15-day shoot',
        dueDate: '2025-09-05T16:00:00Z',
        isCompleted: true,
        priority: 'Medium',
      },
    ],
    activity: [
      {
        id: 'A018',
        type: 'EMAIL',
        content:
          'Initial inquiry from Director Raj Kumar for filming "Mountain Dreams" - Swiss Alps location shoot. 35 crew members, 15-day schedule. Budget €80-90K.',
        timestamp: '2025-07-15T11:20:00Z',
        author: 'Priya Patel',
      },
      {
        id: 'A019',
        type: 'CALL',
        content:
          'Detailed discussion with production manager. Specific locations: Jungfraujoch, Matterhorn area, Interlaken. Need permits, accommodation, and local transport.',
        timestamp: '2025-07-18T14:30:00Z',
        author: 'Priya Patel',
      },
      {
        id: 'A020',
        type: 'NOTE',
        content:
          'Complex logistics: Star cast (5 people) need luxury accommodation. Technical crew (30 people) need practical, nearby lodging. Shooting equipment transportation critical.',
        timestamp: '2025-07-20T09:15:00Z',
        author: 'Priya Patel',
      },
      {
        id: 'A021',
        type: 'EMAIL',
        content:
          'Sent comprehensive filming package quote - €87,500. Included filming permits, luxury and standard accommodation, equipment transport, local crew, catering.',
        timestamp: '2025-07-25T16:45:00Z',
        author: 'Priya Patel',
      },
      {
        id: 'A022',
        type: 'STATUS_CHANGE',
        content:
          'Contract signed! Full payment received. Swiss filming permits approved by local authorities. All bookings confirmed.',
        timestamp: '2025-08-15T12:00:00Z',
        author: 'Priya Patel',
      },
      {
        id: 'A023',
        type: 'CALL',
        content:
          'Pre-departure briefing with director and production manager. Reviewed daily schedules, weather contingencies, and emergency contacts.',
        timestamp: '2025-09-01T10:00:00Z',
        author: 'Priya Patel',
      },
      {
        id: 'A024',
        type: 'NOTE',
        content:
          'CREW CURRENTLY IN SWITZERLAND: Day 3 of shooting going smoothly. Weather perfect for Jungfraujoch scenes. Director very happy with local crew coordination.',
        timestamp: '2025-09-02T18:00:00Z',
        author: 'Priya Patel',
      },
      {
        id: 'A025',
        type: 'FOLLOW_UP',
        content:
          'Daily check-in: Equipment transport to Matterhorn location completed. Catering arrangements confirmed for high-altitude shooting. All crew members accounted for.',
        timestamp: '2025-09-03T07:30:00Z',
        author: 'Priya Patel',
      },
    ],
    documents: [
      {
        id: 'D009',
        name: 'Swiss_Film_Shooting_Permits.pdf',
        type: 'Voucher',
        url: '#film-permits',
        uploadedAt: '2025-08-15T12:30:00Z',
      },
      {
        id: 'D010',
        name: 'Crew_Accommodation_Vouchers.pdf',
        type: 'Voucher',
        url: '#crew-accommodation',
        uploadedAt: '2025-08-20T14:00:00Z',
      },
      {
        id: 'D011',
        name: 'Equipment_Transport_Logistics.pdf',
        type: 'Voucher',
        url: '#equipment-transport',
        uploadedAt: '2025-09-01T16:15:00Z',
      },
    ],
    payment: { total: 87500, paid: 87500, status: 'FULLY_PAID' },
    aiScore: 99,
    createdAt: '2025-07-15T11:20:00Z',
    updatedAt: '2025-09-03T07:30:00Z',
  },

  {
    id: 'LEAD-016',
    clientName: 'Corporate - Global Consulting Inc.',
    clientEmail: 'events@globalconsulting.com',
    clientPhone: '+91 98999 88888',
    destination: 'Annual Leadership Summit - Dubai',
    travelDates: { from: '2025-12-05', to: '2025-12-08' },
    travelerCount: 50,
    estimatedValue: 125000,
    status: 'NEW',
    temperature: 'HOT',
    assignedTo: subAgentsData[1],
    source: 'Corporate Referral - Previous Client',
    tasks: [
      {
        id: 'T023',
        description: 'Prepare comprehensive Dubai leadership summit proposal',
        dueDate: '2025-09-05T17:00:00Z',
        isCompleted: false,
        priority: 'High',
      },
      {
        id: 'T024',
        description: 'Research luxury venue options in Dubai for 50 executives',
        dueDate: '2025-09-04T14:00:00Z',
        isCompleted: false,
        priority: 'High',
      },
    ],
    activity: [
      {
        id: 'A026',
        type: 'EMAIL',
        content:
          'Referral from TechCorp (previous successful client). Global Consulting Inc planning annual leadership summit in Dubai. 50 C-level executives. Premium budget €120-130K.',
        timestamp: '2025-09-02T08:45:00Z',
        author: 'Rohan Verma',
      },
      {
        id: 'A027',
        type: 'CALL',
        content:
          'Initial call with Emma (Chief People Officer) - Looking for luxury experience in Dubai Dec 5-8. Need 5-star accommodation, exclusive venues, team building, gala dinner.',
        timestamp: '2025-09-02T14:20:00Z',
        author: 'Rohan Verma',
      },
      {
        id: 'A028',
        type: 'NOTE',
        content:
          'HIGH PRIORITY: This is a significant opportunity! Previous client TechCorp had excellent experience with us. Global Consulting has 200+ employees, potential for future business.',
        timestamp: '2025-09-02T15:00:00Z',
        author: 'Rohan Verma',
      },
      {
        id: 'A029',
        type: 'FOLLOW_UP',
        content:
          'Scheduled comprehensive proposal presentation for Sept 6th at 11 AM. Need to prepare venue options, activity proposals, and detailed budget breakdown.',
        timestamp: '2025-09-02T15:30:00Z',
        author: 'Rohan Verma',
      },
    ],
    documents: [],
    payment: { total: 125000, paid: 0, status: 'UNPAID' },
    aiScore: 93,
    createdAt: '2025-09-02T08:45:00Z',
    updatedAt: '2025-09-02T15:30:00Z',
  },

  {
    id: 'LEAD-017',
    clientName: 'Retirement Group - Silver Travelers Club',
    clientEmail: 'coordinator@silvertravelers.in',
    clientPhone: '+91 97777 55555',
    destination: 'Senior-Friendly Golden Triangle Tour',
    travelDates: { from: '2026-01-20', to: '2026-02-05' },
    travelerCount: 15,
    estimatedValue: 22500,
    status: 'QUOTING',
    temperature: 'COLD',
    assignedTo: subAgentsData[2],
    source: 'Senior Travel Community',
    tasks: [
      {
        id: 'T025',
        description:
          'Revise quote with senior-friendly modifications and price reduction',
        dueDate: '2025-09-06T16:00:00Z',
        isCompleted: false,
        priority: 'Medium',
      },
    ],
    activity: [
      {
        id: 'A030',
        type: 'EMAIL',
        content:
          'Inquiry from Silver Travelers Club - 15 senior citizens (age 65-78) interested in Golden Triangle tour. Need wheelchair accessible transport, easy pace, medical support.',
        timestamp: '2025-08-20T10:30:00Z',
        author: 'Priya Patel',
      },
      {
        id: 'A031',
        type: 'CALL',
        content:
          'Spoke with Mrs. Krishnan (group coordinator). Group budget is tight - looking for €1,200-1,300 per person. Need ground floor rooms, lift access, flexible itinerary.',
        timestamp: '2025-08-22T15:45:00Z',
        author: 'Priya Patel',
      },
      {
        id: 'A032',
        type: 'QUOTE_SENT',
        content:
          'Sent senior-friendly Golden Triangle package - €1,500 per person (€22,500 total). Included medical support, accessible transport, ground floor rooms, flexible schedule.',
        timestamp: '2025-08-25T12:15:00Z',
        author: 'Priya Patel',
      },
      {
        id: 'A033',
        type: 'EMAIL',
        content:
          'Client feedback: "Package looks wonderful but price is above our budget. Can we remove some activities to bring it to €1,300 per person? Also, any group discounts?"',
        timestamp: '2025-08-28T14:20:00Z',
        author: 'Priya Patel',
      },
      {
        id: 'A034',
        type: 'NOTE',
        content:
          'PRICE SENSITIVE: Group coordinator mentioned many members are on fixed pensions. Need to find ways to reduce cost while maintaining quality and safety standards.',
        timestamp: '2025-08-28T16:00:00Z',
        author: 'Priya Patel',
      },
      {
        id: 'A035',
        type: 'CALL',
        content:
          'Discussion about cost reduction options: Remove shopping tours, change some meals to local restaurants vs hotels, use 4-star vs 5-star in some cities. Group agreed.',
        timestamp: '2025-09-01T11:30:00Z',
        author: 'Priya Patel',
      },
    ],
    documents: [
      {
        id: 'D012',
        name: 'Senior_Golden_Triangle_Quote_v1.pdf',
        type: 'Quote',
        url: '#senior-quote-v1',
        uploadedAt: '2025-08-25T12:15:00Z',
      },
    ],
    payment: { total: 22500, paid: 0, status: 'UNPAID' },
    aiScore: 68,
    createdAt: '2025-08-20T10:30:00Z',
    updatedAt: '2025-09-01T11:30:00Z',
  },
];

export const followUpScenarios = [
  {
    leadId: 'LEAD-001',
    scenario: 'hot_honeymoon',
    nextActions: [
      'Send villa options with private pools and sunset views',
      'Arrange virtual resort tour',
      'Prepare romantic add-on packages (couples massage, private dinner)',
    ],
    urgency: 'High - Hot lead, wedding in 5 months',
  },
  {
    leadId: 'LEAD-007',
    scenario: 'overdue_revision',
    nextActions: [
      'Complete revised Bali package with enhanced team building',
      'Add local startup networking events',
      'Schedule final presentation meeting',
    ],
    urgency: 'Critical - Quote revision overdue by 3 days',
  },
  {
    leadId: 'LEAD-010',
    scenario: 'pre_travel_preparation',
    nextActions: [
      'Collect final payment (€5,950)',
      'Send detailed packing guide',
      'Confirm dietary preferences',
      'Arrange airport transfers',
    ],
    urgency: 'Medium - Travel in 2 months, payment due soon',
  },
  {
    leadId: 'LEAD-013',
    scenario: 'active_operations',
    nextActions: [
      'Daily crew check-ins',
      'Monitor weather conditions for outdoor shoots',
      'Coordinate equipment moves between locations',
      'Manage catering and accommodation logistics',
    ],
    urgency: 'High - Live operations, crew currently traveling',
  },
];

export const followUpTemplates = {
  initial_contact:
    "Hi {clientName}, thank you for your inquiry about {destination}. I'd love to help you plan an amazing trip! When would be a good time for a brief call to discuss your preferences?",

  post_quote:
    "Hi {clientName}, I hope you had a chance to review the {destination} package I sent. I'm here to answer any questions or make adjustments to better fit your needs. What are your thoughts?",

  payment_reminder:
    "Hi {clientName}, just a friendly reminder that your {destination} trip is coming up! We'll need to collect the remaining payment of €{amount} by {dueDate} to secure all your bookings.",

  pre_travel:
    "Hi {clientName}, exciting! Your {destination} adventure starts in just {days} days. I've prepared your final travel documents and some last-minute tips. When's a good time to go through everything?",

  post_travel:
    "Hi {clientName}, welcome back from {destination}! I hope you had an incredible experience. I'd love to hear about your highlights and would really appreciate a quick review of our service.",
};

export const leadsData: Lead[] = [...enhancedLeadsWithHistory];

export const aiInsightsData = {
  todaysPriorities: [
    {
      id: 'AI001',
      leadId: 'LEAD-001',
      priority: 'HIGH',
      action: 'Call Arjun & Priya Sharma by 2 PM',
      reason: 'Hot honeymoon lead, 95% AI score, no contact in 24hrs',
      impact: 'High conversion probability',
      urgency: 'Today',
    },
    {
      id: 'AI002',
      leadId: 'LEAD-007',
      priority: 'HIGH',
      action: 'Revise Bali quote for Startup group',
      reason: 'Client requested changes, quote expires in 2 days',
      impact: '€16,000 revenue at risk',
      urgency: 'Today',
    },
    {
      id: 'AI003',
      leadId: 'LEAD-013',
      priority: 'MEDIUM',
      action: 'Arrange film equipment logistics',
      reason: 'Film crew departs in 8 days, complex logistics needed',
      impact: 'Client satisfaction for €87,500 booking',
      urgency: 'This week',
    },
  ],

  weeklyTrends: {
    hotLeads: 8,
    coldLeads: 3,
    averageResponseTime: '4.2 hours',
    conversionRate: '23%',
    totalPipeline: '€364,250',
  },

  smartSuggestions: [
    {
      title: 'Seasonal Opportunity',
      description:
        'Christmas/New Year bookings are 40% up. Focus on family packages.',
      action: 'Create festive season campaign',
    },
    {
      title: 'Risk Alert',
      description: "3 leads haven't been contacted in 48+ hours",
      action: 'Schedule immediate follow-ups',
    },
    {
      title: 'Upsell Opportunity',
      description: 'Luxury train booking client may be interested in extension',
      action: 'Suggest Rajasthan palace add-on',
    },
  ],
};
