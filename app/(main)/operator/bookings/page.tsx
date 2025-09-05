// app/(main)/operator/bookings/page.tsx

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/core/Card';
import { Button } from '@/components/ui/core/Button';
import { Badge } from '@/components/ui/core/Badge';
import { 
  Calendar,
  Clock, 
  Users, 
  MapPin, 
  DollarSign,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Filter,
  Download,
  Eye,
  Edit,
  Phone,
  Mail,
  Navigation,
  Plane,
  Car,
  Hotel
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Booking {
  id: string;
  packageName: string;
  customerName: string;
  agentName: string;
  agentCompany: string;
  destination: string;
  travelDate: string;
  duration: number;
  groupSize: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'partial' | 'pending';
  bookingDate: string;
  specialRequests?: string;
}

export default function OperatorBookingsPage() {
  const [bookings] = useState<Booking[]>([
    {
      id: 'BK-2025-001',
      packageName: 'Golden Triangle + Rajasthan',
      customerName: 'John & Sarah Wilson',
      agentName: 'Priya Sharma',
      agentCompany: 'Global Travel Solutions',
      destination: 'Delhi, Agra, Jaipur, Udaipur',
      travelDate: '2025-10-15',
      duration: 12,
      groupSize: 2,
      totalAmount: 3500,
      status: 'confirmed',
      paymentStatus: 'paid',
      bookingDate: '2025-09-01'
    },
    {
      id: 'BK-2025-002',
      packageName: 'Kerala Backwaters Experience',
      customerName: 'Maria Rodriguez',
      agentName: 'Ahmed Hassan',
      agentCompany: 'Middle East Tours',
      destination: 'Cochin, Alleppey, Munnar',
      travelDate: '2025-09-25',
      duration: 8,
      groupSize: 4,
      totalAmount: 2800,
      status: 'pending',
      paymentStatus: 'partial',
      bookingDate: '2025-08-28'
    },
    {
      id: 'BK-2025-003',
      packageName: 'Himalayan Adventure Trek',
      customerName: 'David & Emma Thompson',
      agentName: 'Lisa Chen',
      agentCompany: 'UK Adventure Travel',
      destination: 'Manali, Leh, Ladakh',
      travelDate: '2025-11-05',
      duration: 15,
      groupSize: 6,
      totalAmount: 5400,
      status: 'confirmed',
      paymentStatus: 'paid',
      bookingDate: '2025-08-20'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled' | 'completed'>('all');
  const [stats] = useState({
    totalBookings: 234,
    confirmedBookings: 198,
    pendingBookings: 28,
    totalRevenue: 890000,
    avgBookingValue: 3800,
    upcomingDepartures: 45
  });

  const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🏨 Bookings & Operations</h1>
            <p className="text-emerald-100 text-lg">
              Manage customer bookings and operational logistics
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{stats.totalBookings}</div>
            <p className="text-emerald-100">Total Bookings</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { title: 'Total Bookings', value: stats.totalBookings, icon: Calendar, color: 'bg-blue-100 text-blue-600' },
          { title: 'Confirmed', value: stats.confirmedBookings, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
          { title: 'Pending', value: stats.pendingBookings, icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
          { title: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-100 text-purple-600' },
          { title: 'Avg Value', value: `$${stats.avgBookingValue}`, icon: DollarSign, color: 'bg-indigo-100 text-indigo-600' },
          { title: 'Departures', value: stats.upcomingDepartures, icon: Plane, color: 'bg-pink-100 text-pink-600' }
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', stat.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.title}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All Bookings' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'pending', label: 'Pending' },
              { key: 'cancelled', label: 'Cancelled' },
              { key: 'completed', label: 'Completed' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key as any)}
                className={cn(
                  'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                  filter === option.key 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" icon={<Download className="h-4 w-4" />}>
            Export
          </Button>
          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
            New Booking
          </Button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(booking.status)}
                    <span className="font-bold text-gray-900">{booking.id}</span>
                  </div>
                  <Badge className={cn('text-xs', getStatusColor(booking.status))}>
                    {booking.status.toUpperCase()}
                  </Badge>
                  <Badge className={cn('text-xs', 
                    booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                    booking.paymentStatus === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  )}>
                    {booking.paymentStatus.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Package & Customer Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{booking.packageName}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{booking.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.destination}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(booking.travelDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Agent Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Agent Details</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>{booking.agentName}</div>
                      <div>{booking.agentCompany}</div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                          <Phone className="h-3 w-3" />
                          Call
                        </button>
                        <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                          <Mail className="h-3 w-3" />
                          Email
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Trip Details</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Duration: {booking.duration} days</div>
                      <div>Group: {booking.groupSize} people</div>
                      <div>Booked: {new Date(booking.bookingDate).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Financial Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Financial</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="text-lg font-bold text-green-600">
                        ${booking.totalAmount.toLocaleString()}
                      </div>
                      <div>Per person: ${Math.round(booking.totalAmount / booking.groupSize)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 ml-4">
                <Button variant="ghost" size="sm" icon={<Eye className="h-4 w-4" />}>
                  View
                </Button>
                <Button variant="ghost" size="sm" icon={<Edit className="h-4 w-4" />}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" icon={<Navigation className="h-4 w-4" />}>
                  Track
                </Button>
              </div>
            </div>

            {/* Services Icons */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Plane className="h-4 w-4" />
                <span>Flights</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Hotel className="h-4 w-4" />
                <span>Hotels</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Car className="h-4 w-4" />
                <span>Transport</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>Guide</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Stats Footer */}
      <Card className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredBookings.length} of {bookings.length} bookings</span>
          <span>Total Revenue: ${stats.totalRevenue.toLocaleString()}</span>
        </div>
      </Card>
    </div>
  );
}