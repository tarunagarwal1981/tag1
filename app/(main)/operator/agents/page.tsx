// app/(main)/operator/agents/page.tsx

'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/core/Card';
import { Button } from '@/components/ui/core/Button';
import { Badge } from '@/components/ui/core/Badge';
import { 
  Users, 
  Globe,
  TrendingUp,
  DollarSign,
  Star,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  UserCheck,
  Award,
  Target,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Agent {
  id: string;
  name: string;
  company: string;
  country: string;
  city: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalBookings: number;
  totalRevenue: number;
  commission: number;
  rating: number;
  responseRate: number;
  specialties: string[];
  lastActive: string;
}

export default function OperatorAgentsPage() {
  const [agents] = useState<Agent[]>([
    {
      id: 'AG-001',
      name: 'Priya Sharma',
      company: 'Global Travel Solutions',
      country: 'United Kingdom',
      city: 'London',
      email: 'priya@globaltraveluk.com',
      phone: '+44 20 7123 4567',
      joinDate: '2024-03-15',
      status: 'active',
      tier: 'gold',
      totalBookings: 47,
      totalRevenue: 125000,
      commission: 18,
      rating: 4.8,
      responseRate: 96,
      specialties: ['Luxury Travel', 'Cultural Tours', 'Honeymoon'],
      lastActive: '2 hours ago'
    },
    {
      id: 'AG-002',
      name: 'Ahmed Hassan',
      company: 'Middle East Adventures',
      country: 'United Arab Emirates',
      city: 'Dubai',
      email: 'ahmed@meadventures.ae',
      phone: '+971 4 123 4567',
      joinDate: '2024-01-20',
      status: 'active',
      tier: 'platinum',
      totalBookings: 89,
      totalRevenue: 230000,
      commission: 22,
      rating: 4.9,
      responseRate: 98,
      specialties: ['Adventure Travel', 'Desert Safari', 'Business Travel'],
      lastActive: '1 hour ago'
    },
    {
      id: 'AG-003',
      name: 'Lisa Chen',
      company: 'Asia Pacific Tours',
      country: 'Australia',
      city: 'Sydney',
      email: 'lisa@aptours.com.au',
      phone: '+61 2 9123 4567',
      joinDate: '2024-05-10',
      status: 'active',
      tier: 'silver',
      totalBookings: 23,
      totalRevenue: 68000,
      commission: 15,
      rating: 4.6,
      responseRate: 89,
      specialties: ['Family Travel', 'Educational Tours'],
      lastActive: '30 minutes ago'
    },
    {
      id: 'AG-004',
      name: 'Maria Rodriguez',
      company: 'Latin America Expeditions',
      country: 'Brazil',
      city: 'São Paulo',
      email: 'maria@laexpeditions.com.br',
      phone: '+55 11 9123 4567',
      joinDate: '2024-02-28',
      status: 'pending',
      tier: 'bronze',
      totalBookings: 8,
      totalRevenue: 15000,
      commission: 12,
      rating: 4.3,
      responseRate: 78,
      specialties: ['Eco Tourism', 'Wildlife'],
      lastActive: '1 day ago'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [tierFilter, setTierFilter] = useState<'all' | 'bronze' | 'silver' | 'gold' | 'platinum'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [stats] = useState({
    totalAgents: 156,
    activeAgents: 134,
    pendingApprovals: 12,
    totalRevenue: 1250000,
    avgCommission: 18.5,
    topPerformer: 'Ahmed Hassan'
  });

  const filteredAgents = agents.filter(agent => {
    const matchesFilter = filter === 'all' || agent.status === filter;
    const matchesTier = tierFilter === 'all' || agent.tier === tierFilter;
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.country.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesTier && matchesSearch;
  });

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'gold': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'silver': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'bronze': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'inactive': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🌍 Agent Network</h1>
            <p className="text-blue-100 text-lg">
              Manage your global network of travel agent partners
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{stats.totalAgents}</div>
            <p className="text-blue-100">Total Agents</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { title: 'Total Agents', value: stats.totalAgents, icon: Users, color: 'bg-blue-100 text-blue-600' },
          { title: 'Active', value: stats.activeAgents, icon: UserCheck, color: 'bg-green-100 text-green-600' },
          { title: 'Pending', value: stats.pendingApprovals, icon: Calendar, color: 'bg-yellow-100 text-yellow-600' },
          { title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'bg-purple-100 text-purple-600' },
          { title: 'Avg Commission', value: `${stats.avgCommission}%`, icon: BarChart3, color: 'bg-indigo-100 text-indigo-600' },
          { title: 'Top Performer', value: stats.topPerformer, icon: Award, color: 'bg-pink-100 text-pink-600' }
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

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'active', label: 'Active' },
                { key: 'pending', label: 'Pending' },
                { key: 'inactive', label: 'Inactive' }
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

          {/* Tier Filter */}
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Tier:</span>
            <div className="flex gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'platinum', label: 'Platinum' },
                { key: 'gold', label: 'Gold' },
                { key: 'silver', label: 'Silver' },
                { key: 'bronze', label: 'Bronze' }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => setTierFilter(option.key as any)}
                  className={cn(
                    'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                    tierFilter === option.key 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700" icon={<Plus className="h-4 w-4" />}>
            Add Agent
          </Button>
        </div>
      </div>

      {/* Agents List */}
      <div className="space-y-4">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {agent.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{agent.name}</h3>
                    <p className="text-gray-600">{agent.company}</p>
                  </div>
                  <Badge className={cn('text-xs border', getTierColor(agent.tier))}>
                    {agent.tier.toUpperCase()}
                  </Badge>
                  <Badge className={cn('text-xs', getStatusColor(agent.status))}>
                    {agent.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Contact Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{agent.city}, {agent.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{agent.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{agent.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Performance</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Bookings:</span>
                        <span className="font-medium">{agent.totalBookings}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Revenue:</span>
                        <span className="font-medium text-green-600">${agent.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{agent.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Business Details */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Business Details</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Commission:</span>
                        <span className="font-medium">{agent.commission}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Response Rate:</span>
                        <span className="font-medium">{agent.responseRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Joined:</span>
                        <span>{new Date(agent.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Specialties & Activity */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Specialties</h4>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {agent.specialties.map((specialty, index) => (
                          <Badge key={index} className="text-xs bg-blue-50 text-blue-600">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500">
                        Last active: {agent.lastActive}
                      </div>
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
                <Button variant="ghost" size="sm" icon={<Mail className="h-4 w-4" />}>
                  Message
                </Button>
                <Button variant="ghost" size="sm" icon={<BarChart3 className="h-4 w-4" />}>
                  Analytics
                </Button>
              </div>
            </div>

            {/* Performance Bar */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Performance Score</span>
                <span className="font-medium">{Math.round((agent.rating * 20 + agent.responseRate) / 2)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.round((agent.rating * 20 + agent.responseRate) / 2)}%` }}
                ></div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Footer */}
      <Card className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredAgents.length} of {agents.length} agents</span>
          <div className="flex gap-6">
            <span>Total Network Revenue: ${stats.totalRevenue.toLocaleString()}</span>
            <span>Average Commission: {stats.avgCommission}%</span>
          </div>
        </div>
      </Card>
    </div>
  );
}