'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Package, Plus, Search, Filter, Grid, List, Eye, Edit, Copy, Trash2,
  BarChart3, Users, DollarSign, Calendar, MapPin, Star, TrendingUp,
  Settings, Download, Share2, Globe, Clock, AlertCircle, CheckCircle2,
  Image, FileText, Send, MessageSquare, Heart, Bookmark, Camera,
  ChevronDown, ChevronRight, MoreVertical, ExternalLink, Zap,
  Target, Award, ArrowUpRight, RefreshCw, Mail, Phone, Building2,
  Activity, PieChart, TrendingDown, PlayCircle, PauseCircle,
  Archive, Layers, Shield, Sparkles, Crown, Lightning, Utensils
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { tourPackagesData, TourPackage, getPackageStats } from '@/lib/tourPackageData';

export function TourPackageManager() {
  const router = useRouter();
  const [packages, setPackages] = useState<TourPackage[]>(tourPackagesData);
  const [selectedPackage, setSelectedPackage] = useState<TourPackage | null>(null);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'analytics'>('grid');
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'draft' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'bookings' | 'revenue'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showDetailPanel, setShowDetailPanel] = useState(false);
  const [showPDFGenerator, setShowPDFGenerator] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['all', 'CULTURAL', 'ADVENTURE', 'LUXURY', 'BUDGET', 'HONEYMOON', 'FAMILY', 'WILDLIFE'];

  // Enhanced filtering and sorting
  const filteredPackages = useMemo(() => {
    let filtered = packages.filter(pkg => {
      const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
      const matchesTab = activeTab === 'all' ||
        (activeTab === 'active' && pkg.status === 'ACTIVE') ||
        (activeTab === 'draft' && pkg.status === 'DRAFT') ||
        (activeTab === 'archived' && pkg.status === 'ARCHIVED');
      return matchesSearch && matchesCategory && matchesTab;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      switch (sortBy) {
        case 'name':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'created':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'bookings':
          aValue = a.bookings.length;
          bValue = b.bookings.length;
          break;
        case 'revenue':
          aValue = a.bookings.reduce((sum, b) => sum + b.totalAmount, 0);
          bValue = b.bookings.reduce((sum, b) => sum + b.totalAmount, 0);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [packages, searchQuery, selectedCategory, activeTab, sortBy, sortOrder]);

  const enhancedStats = useMemo(() => {
    const stats = getPackageStats();
    const avgRating = packages.reduce((sum, pkg) => {
      const pkgAvg = pkg.reviews.length > 0 ?
        pkg.reviews.reduce((s, r) => s + r.rating, 0) / pkg.reviews.length : 0;
      return sum + pkgAvg;
    }, 0) / packages.length;

    const topPerformers = [...packages]
      .sort((a, b) => b.bookings.length - a.bookings.length)
      .slice(0, 3);

    const recentBookings = packages.reduce((sum, pkg) => {
      const recent = pkg.bookings.filter(b =>
        new Date(b.bookingDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length;
      return sum + recent;
    }, 0);

    return {
      ...stats,
      avgRating: avgRating || 0,
      topPerformers,
      recentBookings,
      conversionRate: stats.totalBookings > 0 ? ((stats.totalBookings / (stats.total * 10)) * 100) : 0
    };
  }, [packages]);

  // Event handlers
  const handlePackageSelect = (pkg: TourPackage) => {
    setSelectedPackage(pkg);
    setShowDetailPanel(true);
  };

  const handleCreatePackage = () => {
    router.push('/operator/packages/create');
  };

  const handleEditPackage = (pkg: TourPackage) => {
    router.push(`/operator/packages/edit/${pkg.id}`);
  };

  const handleGeneratePDF = (pkg: TourPackage) => {
    setSelectedPackage(pkg);
    setShowPDFGenerator(true);
  };

  const handleDuplicatePackage = (pkg: TourPackage) => {
    const duplicated: TourPackage = {
      ...pkg,
      id: `pkg-${Date.now()}`,
      title: `${pkg.title} (Copy)`,
      status: 'DRAFT',
      bookings: [],
      reviews: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPackages(prev => [duplicated, ...prev]);
    alert('Package duplicated successfully!');
  };

  const handleArchivePackage = (pkg: TourPackage) => {
    if (confirm(`Archive "${pkg.title}"? This will hide it from agents but preserve all data.`)) {
      setPackages(prev => prev.map(p =>
        p.id === pkg.id ? { ...p, status: 'ARCHIVED' } : p
      ));
      alert('Package archived successfully!');
    }
  };

  const handleBulkAction = (action: string) => {
    const selectedCount = selectedPackages.length;
    if (selectedCount === 0) {
      alert('Please select packages first');
      return;
    }

    switch (action) {
      case 'activate':
        setPackages(prev => prev.map(p =>
          selectedPackages.includes(p.id) ? { ...p, status: 'ACTIVE' } : p
        ));
        alert(`${selectedCount} packages activated`);
        break;
      case 'deactivate':
        setPackages(prev => prev.map(p =>
          selectedPackages.includes(p.id) ? { ...p, status: 'INACTIVE' } : p
        ));
        alert(`${selectedCount} packages deactivated`);
        break;
      case 'archive':
        if (confirm(`Archive ${selectedCount} packages?`)) {
          setPackages(prev => prev.map(p =>
            selectedPackages.includes(p.id) ? { ...p, status: 'ARCHIVED' } : p
          ));
          alert(`${selectedCount} packages archived`);
        }
        break;
      case 'export':
        const csvData = packages.filter(p => selectedPackages.includes(p.id))
          .map(p => `${p.title},${p.destination},${p.pricePerPerson},${p.status}`)
          .join('\n');
        const blob = new Blob([`Title,Destination,Price,Status\n${csvData}`], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'packages_export.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert(`${selectedCount} packages exported`);
        break;
    }
    setSelectedPackages([]);
    setShowBulkActions(false);
  };

  const handleSelectPackage = (packageId: string, selected: boolean) => {
    if (selected) {
      setSelectedPackages(prev => [...prev, packageId]);
    } else {
      setSelectedPackages(prev => prev.filter(id => id !== packageId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedPackages(filteredPackages.map(p => p.id));
    } else {
      setSelectedPackages([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Quick Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Main Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tour Package Management</h1>
                <p className="text-gray-600 mt-1">Create, manage and distribute your tour packages to agents worldwide</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLoading(true)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
              </button>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors">
                <Download className="h-4 w-4" />
                Export All
              </button>
              <button
                onClick={handleCreatePackage}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                Create Package
              </button>
            </div>
          </div>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-blue-700">{enhancedStats.total}</div>
                  <div className="text-xs text-blue-600">Total Packages</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-green-700">{enhancedStats.active}</div>
                  <div className="text-xs text-green-600">Active</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <DollarSign className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-700">
                    {(enhancedStats.totalRevenue / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-purple-600">Revenue</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-orange-700">{enhancedStats.totalBookings}</div>
                  <div className="text-xs text-orange-600">Total Bookings</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <Star className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-yellow-700">{enhancedStats.avgRating.toFixed(1)}</div>
                  <div className="text-xs text-yellow-600">Avg Rating</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold text-indigo-700">{enhancedStats.conversionRate.toFixed(1)}%</div>
                  <div className="text-xs text-indigo-600">Conversion</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Controls */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Bulk Selection */}
              {selectedPackages.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {selectedPackages.length} selected
                  </span>
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
                  >
                    Bulk Actions
                  </button>
                </div>
              )}

              {/* Quick Filters */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('active')}
                  className={cn(
                    'px-3 py-1 rounded-md text-sm transition-colors',
                    activeTab === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:bg-gray-200'
                  )}
                >
                  Active Only
                </button>
                <button
                  onClick={() => setActiveTab('draft')}
                  className={cn(
                    'px-3 py-1 rounded-md text-sm transition-colors',
                    activeTab === 'draft'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'text-gray-600 hover:bg-gray-200'
                  )}
                >
                  Drafts
                </button>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-green-500" />
                <span>{enhancedStats.recentBookings} bookings this month</span>
              </div>
              <div className="flex items-center gap-1">
                <Crown className="h-3 w-3 text-yellow-500" />
                <span>Top: {enhancedStats.topPerformers[0]?.title.substring(0, 20)}...</span>
              </div>
            </div>
          </div>

          {/* Bulk Actions Panel */}
          {showBulkActions && selectedPackages.length > 0 && (
            <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Bulk Actions:</span>
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200 transition-colors"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkAction('archive')}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                >
                  Archive
                </button>
                <button
                  onClick={() => handleBulkAction('export')}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
                >
                  Export CSV
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="p-6">
          {viewMode === 'analytics' ? (
            <EnhancedPackageAnalytics
              packages={packages}
              stats={enhancedStats}
            />
          ) : viewMode === 'grid' ? (
            <EnhancedPackageGridView
              packages={filteredPackages}
              selectedPackages={selectedPackages}
              onPackageSelect={handlePackageSelect}
              onGeneratePDF={handleGeneratePDF}
              onEditPackage={handleEditPackage}
              onDuplicatePackage={handleDuplicatePackage}
              onArchivePackage={handleArchivePackage}
              onSelectPackage={handleSelectPackage}
            />
          ) : (
            <EnhancedPackageListView
              packages={filteredPackages}
              selectedPackages={selectedPackages}
              onPackageSelect={handlePackageSelect}
              onGeneratePDF={handleGeneratePDF}
              onEditPackage={handleEditPackage}
              onDuplicatePackage={handleDuplicatePackage}
              onArchivePackage={handleArchivePackage}
              onSelectPackage={handleSelectPackage}
            />
          )}
        </div>
      </div>

      {/* Enhanced PDF Generator */}
      {showPDFGenerator && selectedPackage && (
        <EnhancedBrochureGenerator
          package={selectedPackage}
          onClose={() => setShowPDFGenerator(false)}
        />
      )}

      {/* Enhanced Detail Panel */}
      {showDetailPanel && selectedPackage && (
        <EnhancedPackageDetailPanel
          package={selectedPackage}
          onClose={() => setShowDetailPanel(false)}
          onUpdate={(updatedPackage) => {
            setPackages(prev => prev.map(p =>
              p.id === updatedPackage.id ? updatedPackage : p
            ));
            setSelectedPackage(updatedPackage);
          }}
          onGeneratePDF={() => {
            setShowDetailPanel(false);
            setShowPDFGenerator(true);
          }}
          onEditPackage={handleEditPackage}
          onDuplicatePackage={handleDuplicatePackage}
          onArchivePackage={handleArchivePackage}
        />
      )}
    </div>
  );
}

// Enhanced Package Grid View Component
interface EnhancedPackageGridViewProps {
  packages: TourPackage[];
  selectedPackages: string[];
  onPackageSelect: (pkg: TourPackage) => void;
  onGeneratePDF: (pkg: TourPackage) => void;
  onEditPackage: (pkg: TourPackage) => void;
  onDuplicatePackage: (pkg: TourPackage) => void;
  onArchivePackage: (pkg: TourPackage) => void;
  onSelectPackage: (id: string, selected: boolean) => void;
}

const EnhancedPackageGridView: React.FC<EnhancedPackageGridViewProps> = ({
  packages,
  selectedPackages,
  onPackageSelect,
  onGeneratePDF,
  onEditPackage,
  onDuplicatePackage,
  onArchivePackage,
  onSelectPackage
}) => {
  if (packages.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No packages found</h3>
        <p className="text-gray-500 mb-6">Try adjusting your search or filters, or create your first package</p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto">
          <Plus className="h-4 w-4" />
          Create First Package
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {packages.map((pkg) => (
        <EnhancedPackageCard
          key={pkg.id}
          package={pkg}
          isSelected={selectedPackages.includes(pkg.id)}
          onSelect={onPackageSelect}
          onGeneratePDF={onGeneratePDF}
          onEditPackage={onEditPackage}
          onDuplicatePackage={onDuplicatePackage}
          onArchivePackage={onArchivePackage}
          onSelectPackage={onSelectPackage}
        />
      ))}
    </div>
  );
};

// Enhanced Package Card Component
interface EnhancedPackageCardProps {
  package: TourPackage;
  isSelected: boolean;
  onSelect: (pkg: TourPackage) => void;
  onGeneratePDF: (pkg: TourPackage) => void;
  onEditPackage: (pkg: TourPackage) => void;
  onDuplicatePackage: (pkg: TourPackage) => void;
  onArchivePackage: (pkg: TourPackage) => void;
  onSelectPackage: (id: string, selected: boolean) => void;
}

const EnhancedPackageCard: React.FC<EnhancedPackageCardProps> = ({
  package: pkg,
  isSelected,
  onSelect,
  onGeneratePDF,
  onEditPackage,
  onDuplicatePackage,
  onArchivePackage,
  onSelectPackage
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const primaryImage = pkg.images.find(img => img.isPrimary) || pkg.images[0];
  const totalBookings = pkg.bookings.length;
  const totalRevenue = pkg.bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const avgRating = pkg.reviews.length > 0
    ? pkg.reviews.reduce((sum, r) => sum + r.rating, 0) / pkg.reviews.length
    : 0;
  const recentBookings = pkg.bookings.filter(b =>
    new Date(b.bookingDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'INACTIVE': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'ARCHIVED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'CULTURAL': return '🏛️';
      case 'ADVENTURE': return '🏔️';
      case 'LUXURY': return '👑';
      case 'BUDGET': return '💰';
      case 'HONEYMOON': return '💕';
      case 'FAMILY': return '👨‍👩‍👧‍👦';
      case 'WILDLIFE': return '🦁';
      default: return '🌍';
    }
  };

  const handleActionClick = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    switch (action) {
      case 'pdf': onGeneratePDF(pkg); break;
      case 'edit': onEditPackage(pkg); break;
      case 'duplicate': onDuplicatePackage(pkg); break;
      case 'archive': onArchivePackage(pkg); break;
    }
    setShowActions(false);
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl border-2 overflow-hidden transition-all duration-300 cursor-pointer group relative',
        isSelected ? 'border-blue-500 shadow-lg ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300 hover:shadow-lg',
        isHovered && 'transform hover:-translate-y-1'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(pkg)}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelectPackage(pkg.id, e.target.checked);
          }}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>

      {/* Image with Overlay */}
      <div className="relative h-48 overflow-hidden">
        {primaryImage ? (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
            <Camera className="h-12 w-12 text-white opacity-75" />
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <Image className="h-12 w-12 text-white opacity-75" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Status Badge */}
        <div className={cn(
          'absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm',
          getStatusColor(pkg.status)
        )}>
          {pkg.status === 'ACTIVE' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
          {pkg.status.charAt(0) + pkg.status.slice(1).toLowerCase()}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
          <span>{getCategoryIcon(pkg.category)}</span>
          {pkg.category.charAt(0) + pkg.category.slice(1).toLowerCase()}
        </div>

        {/* Quick Action Button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditPackage(pkg);
            }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
          >
            <Edit className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-sm leading-5">
              {pkg.title}
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{pkg.destination}</span>
            </div>
          </div>
          <div className="relative ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>

            {/* Enhanced Actions Dropdown */}
            {showActions && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[160px]">
                <button
                  onClick={(e) => handleActionClick(e, 'edit')}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors"
                >
                  <Edit className="h-3 w-3" />
                  Edit Package
                </button>
                <button
                  onClick={(e) => handleActionClick(e, 'pdf')}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 flex items-center gap-2 transition-colors"
                >
                  <FileText className="h-3 w-3" />
                  Generate PDF
                </button>
                <button
                  onClick={(e) => handleActionClick(e, 'duplicate')}
                  className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 flex items-center gap-2 transition-colors"
                >
                  <Copy className="h-3 w-3" />
                  Duplicate
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={(e) => handleActionClick(e, 'archive')}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <Archive className="h-3 w-3" />
                  Archive
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-xs text-blue-600 font-medium">{pkg.duration} Days</div>
            <Clock className="h-3 w-3 text-blue-500 mx-auto mt-1" />
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-xs text-green-600 font-medium">Max {pkg.maxGroupSize}</div>
            <Users className="h-3 w-3 text-green-500 mx-auto mt-1" />
          </div>
        </div>

        {/* Performance Metrics */}
        {(totalBookings > 0 || avgRating > 0) && (
          <div className="flex items-center justify-between mb-3 text-xs text-gray-600">
            {totalBookings > 0 && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3 text-blue-500" />
                <span>{totalBookings} bookings</span>
                {recentBookings > 0 && (
                  <span className="bg-green-100 text-green-700 px-1 rounded">+{recentBookings}</span>
                )}
              </div>
            )}
            {avgRating > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span>{avgRating.toFixed(1)}</span>
              </div>
            )}
          </div>
        )}

        {/* Revenue Display */}
        {totalRevenue > 0 && (
          <div className="text-xs text-gray-600 mb-3 p-2 bg-purple-50 rounded">
            <div className="flex items-center justify-between">
              <span>Total Revenue</span>
              <span className="font-semibold text-purple-700">${totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Price and Commission */}
        <div className="flex items-end justify-between pt-3 border-t border-gray-100">
          <div>
            <div className="text-xl font-bold text-gray-900">${pkg.pricePerPerson}</div>
            <div className="text-xs text-gray-500">per person</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-green-600">{pkg.agentCommission}%</div>
            <div className="text-xs text-green-500">commission</div>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onGeneratePDF(pkg);
            }}
            className="flex-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-center"
          >
            PDF
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditPackage(pkg);
            }}
            className="flex-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-center"
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(pkg);
            }}
            className="flex-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-center"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Package List View
interface EnhancedPackageListViewProps {
  packages: TourPackage[];
  selectedPackages: string[];
  onPackageSelect: (pkg: TourPackage) => void;
  onGeneratePDF: (pkg: TourPackage) => void;
  onEditPackage: (pkg: TourPackage) => void;
  onDuplicatePackage: (pkg: TourPackage) => void;
  onArchivePackage: (pkg: TourPackage) => void;
  onSelectPackage: (id: string, selected: boolean) => void;
}

const EnhancedPackageListView: React.FC<EnhancedPackageListViewProps> = ({
  packages,
  selectedPackages,
  onPackageSelect,
  onGeneratePDF,
  onEditPackage,
  onDuplicatePackage,
  onArchivePackage,
  onSelectPackage
}) => {
  if (packages.length === 0) {
    return (
      <div className="text-center py-16">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">No packages found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {packages.map((pkg) => {
        const totalBookings = pkg.bookings.length;
        const totalRevenue = pkg.bookings.reduce((sum, b) => sum + b.totalAmount, 0);
        const avgRating = pkg.reviews.length > 0
          ? pkg.reviews.reduce((sum, r) => sum + r.rating, 0) / pkg.reviews.length
          : 0;
        const isSelected = selectedPackages.includes(pkg.id);

        return (
          <div
            key={pkg.id}
            className={cn(
              'bg-white border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer',
              isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
            )}
            onClick={() => onPackageSelect(pkg)}
          >
            <div className="flex items-center gap-4">
              {/* Selection Checkbox */}
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelectPackage(pkg.id, e.target.checked);
                }}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />

              {/* Package Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{pkg.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {pkg.destination}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {pkg.duration} days
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Max {pkg.maxGroupSize}
                      </div>
                    </div>
                  </div>

                  {/* Status and Category */}
                  <div className="flex items-center gap-2 ml-4">
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      pkg.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                        pkg.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                    )}>
                      {pkg.status.charAt(0) + pkg.status.slice(1).toLowerCase()}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                      {pkg.category.charAt(0) + pkg.category.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="flex items-center gap-6 mt-3 text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="h-3 w-3" />
                    <span>{totalBookings} bookings</span>
                  </div>
                  {avgRating > 0 && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      <span>{avgRating.toFixed(1)}</span>
                    </div>
                  )}
                  {totalRevenue > 0 && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <DollarSign className="h-3 w-3" />
                      <span>${totalRevenue.toLocaleString()} revenue</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-green-600">
                    <Award className="h-3 w-3" />
                    <span>{pkg.agentCommission}% commission</span>
                  </div>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">${pkg.pricePerPerson}</div>
                  <div className="text-xs text-gray-500">per person</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onGeneratePDF(pkg);
                    }}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    PDF
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditPackage(pkg);
                    }}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Enhanced Package Analytics Component
interface EnhancedPackageAnalyticsProps {
  packages: TourPackage[];
  stats: any;
}

const EnhancedPackageAnalytics: React.FC<EnhancedPackageAnalyticsProps> = ({ packages, stats }) => {
  const categoryStats = useMemo(() => {
    const categories = packages.reduce((acc, pkg) => {
      if (!acc[pkg.category]) {
        acc[pkg.category] = { count: 0, revenue: 0, bookings: 0 };
      }
      acc[pkg.category].count++;
      acc[pkg.category].revenue += pkg.bookings.reduce((sum, b) => sum + b.totalAmount, 0);
      acc[pkg.category].bookings += pkg.bookings.length;
      return acc;
    }, {} as Record<string, { count: number; revenue: number; bookings: number }>);

    return Object.entries(categories).map(([category, data]) => ({
      category,
      ...data,
      avgPrice: data.count > 0 ? data.revenue / data.bookings || 0 : 0
    }));
  }, [packages]);

  const monthlyTrends = useMemo(() => {
    return [
      { month: 'Jan', bookings: 45, revenue: 67500 },
      { month: 'Feb', bookings: 52, revenue: 78000 },
      { month: 'Mar', bookings: 61, revenue: 91500 },
      { month: 'Apr', bookings: 58, revenue: 87000 },
      { month: 'May', bookings: 71, revenue: 106500 },
      { month: 'Jun', bookings: 68, revenue: 102000 }
    ];
  }, []);

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-blue-600 text-sm font-medium">+12.5%</span>
          </div>
          <div className="text-2xl font-bold text-blue-900 mb-1">{stats.conversionRate.toFixed(1)}%</div>
          <div className="text-blue-700 text-sm">Conversion Rate</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500 rounded-lg">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-green-600 text-sm font-medium">+8.3%</span>
          </div>
          <div className="text-2xl font-bold text-green-900 mb-1">
            {`$${(stats.totalRevenue / stats.totalBookings || 0).toFixed(0)}`}
          </div>
          <div className="text-green-700 text-sm">Avg Booking Value</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
            <span className="text-purple-600 text-sm font-medium">+0.2</span>
          </div>
          <div className="text-2xl font-bold text-purple-900 mb-1">{stats.avgRating.toFixed(1)}</div>
          <div className="text-purple-700 text-sm">Average Rating</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-500 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-orange-600 text-sm font-medium">This month</span>
          </div>
          <div className="text-2xl font-bold text-orange-900 mb-1">{stats.recentBookings}</div>
          <div className="text-orange-700 text-sm">Recent Bookings</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Category</h3>
          <div className="space-y-4">
            {categoryStats.map((cat, index) => (
              <div key={cat.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-3 h-3 rounded-full',
                    index === 0 ? 'bg-blue-500' :
                      index === 1 ? 'bg-green-500' :
                        index === 2 ? 'bg-purple-500' :
                          'bg-orange-500'
                  )} />
                  <div>
                    <div className="font-medium text-gray-900">{cat.category}</div>
                    <div className="text-sm text-gray-500">{cat.count} packages</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">${cat.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">{cat.bookings} bookings</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <div className="space-y-4">
            {monthlyTrends.map((month, index) => (
              <div key={month.month} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 text-sm text-gray-600">{month.month}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${(month.bookings / 80) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="font-semibold text-gray-900">{month.bookings}</div>
                  <div className="text-sm text-gray-500">${(month.revenue / 1000).toFixed(0)}K</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Packages</h3>
        <div className="space-y-3">
          {stats.topPerformers.map((pkg: TourPackage, index: number) => {
            const revenue = pkg.bookings.reduce((sum, b) => sum + b.totalAmount, 0);
            const avgRating = pkg.reviews.length > 0
              ? pkg.reviews.reduce((sum, r) => sum + r.rating, 0) / pkg.reviews.length
              : 0;

            return (
              <div key={pkg.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                  )}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{pkg.title}</div>
                    <div className="text-sm text-gray-500">{pkg.destination}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{pkg.bookings.length} bookings</div>
                    <div className="text-gray-500">${revenue.toLocaleString()}</div>
                  </div>
                  {avgRating > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{avgRating.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="text-right">
                    <div className="font-semibold text-green-600">${pkg.pricePerPerson}</div>
                    <div className="text-xs text-green-500">{pkg.agentCommission}% comm.</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Enhanced Package Detail Panel
interface EnhancedPackageDetailPanelProps {
  package: TourPackage;
  onClose: () => void;
  onUpdate: (pkg: TourPackage) => void;
  onGeneratePDF: () => void;
  onEditPackage: (pkg: TourPackage) => void;
  onDuplicatePackage: (pkg: TourPackage) => void;
  onArchivePackage: (pkg: TourPackage) => void;
}

const EnhancedPackageDetailPanel: React.FC<EnhancedPackageDetailPanelProps> = ({
  package: pkg,
  onClose,
  onUpdate,
  onGeneratePDF,
  onEditPackage,
  onDuplicatePackage,
  onArchivePackage
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'itinerary' | 'bookings' | 'reviews'>('overview');

  const totalRevenue = pkg.bookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const avgRating = pkg.reviews.length > 0
    ? pkg.reviews.reduce((sum, r) => sum + r.rating, 0) / pkg.reviews.length
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">{pkg.title}</h2>
                <span className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium',
                  pkg.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                    pkg.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                )}>
                  {pkg.status}
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {pkg.destination}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {pkg.duration} days
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Max {pkg.maxGroupSize}
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  ${pkg.pricePerPerson}/person
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all duration-200 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-blue-600">{pkg.bookings.length}</div>
              <div className="text-xs text-blue-500">Bookings</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-green-500">Revenue</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-yellow-600">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</div>
              <div className="text-xs text-yellow-500">Rating</div>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-purple-600">{pkg.agentCommission}%</div>
              <div className="text-xs text-purple-500">Commission</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: Eye },
              { key: 'itinerary', label: 'Itinerary', icon: Calendar },
              { key: 'bookings', label: 'Bookings', icon: Users },
              { key: 'reviews', label: 'Reviews', icon: Star }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={cn(
                  'flex items-center gap-2 py-4 border-b-2 transition-colors',
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.key === 'bookings' && pkg.bookings.length > 0 && (
                  <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">
                    {pkg.bookings.length}
                  </span>
                )}
                {tab.key === 'reviews' && pkg.reviews.length > 0 && (
                  <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs">
                    {pkg.reviews.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Package Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{pkg.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Highlights</h3>
                  <div className="space-y-2">
                    {pkg.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included</h3>
                  <div className="space-y-2">
                    {pkg.inclusions.slice(0, 5).map((inclusion, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{inclusion}</span>
                      </div>
                    ))}
                    {pkg.inclusions.length > 5 && (
                      <div className="text-sm text-blue-600 cursor-pointer">
                        +{pkg.inclusions.length - 5} more inclusions...
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Package Stats & Info */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Category</div>
                      <div className="font-medium text-gray-900">{pkg.category}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Difficulty</div>
                      <div className="font-medium text-gray-900">{pkg.difficulty}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Created</div>
                      <div className="font-medium text-gray-900">
                        {new Date(pkg.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Last Updated</div>
                      <div className="font-medium text-gray-900">
                        {new Date(pkg.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Revenue Analytics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Total Bookings</span>
                      <span className="font-semibold text-blue-900">{pkg.bookings.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Total Revenue</span>
                      <span className="font-semibold text-blue-900">${totalRevenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Avg Booking Value</span>
                      <span className="font-semibold text-blue-900">
                        ${pkg.bookings.length > 0 ? (totalRevenue / pkg.bookings.length).toFixed(0) : '0'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Commission Rate</span>
                      <span className="font-semibold text-blue-900">{pkg.agentCommission}%</span>
                    </div>
                  </div>
                </div>

                {pkg.reviews.length > 0 && (
                  <div className="bg-yellow-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-4">Recent Reviews</h3>
                    <div className="space-y-3">
                      {pkg.reviews.slice(0, 2).map((review) => (
                        <div key={review.id} className="border-b border-yellow-200 pb-3 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    'h-4 w-4',
                                    i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  )}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-yellow-800">{review.agentName}</span>
                          </div>
                          <p className="text-sm text-yellow-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Day-by-Day Itinerary</h3>
              <div className="space-y-4">
                {pkg.itinerary.map((day, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 text-blue-700 rounded-full w-10 h-10 flex items-center justify-center font-semibold text-sm">
                        {day.day}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{day.title}</h4>
                        <p className="text-gray-600 mb-4">{day.description}</p>

                        {day.activities.length > 0 && (
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-800 mb-2">Activities</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {day.activities.map((activity, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                                  {activity}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          {day.accommodation && (
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {day.accommodation}
                            </div>
                          )}
                          {day.meals.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Utensils className="h-3 w-3" />
                              {day.meals.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Bookings ({pkg.bookings.length})</h3>
                <div className="text-sm text-gray-500">
                  Total Revenue: ${totalRevenue.toLocaleString()}
                </div>
              </div>

              {pkg.bookings.length > 0 ? (
                <div className="space-y-3">
                  {pkg.bookings.map((booking) => (
                    <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">{booking.clientName}</div>
                          <div className="text-sm text-gray-600">via {booking.agentName}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Booked: {new Date(booking.bookingDate).toLocaleDateString()} •
                            Travel: {new Date(booking.travelDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">${booking.totalAmount.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">{booking.paxCount} travelers</div>
                          <div className={cn(
                            'text-xs px-2 py-1 rounded-full mt-1',
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                              booking.status === 'PAID' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'
                          )}>
                            {booking.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h4>
                  <p className="text-gray-500">This package hasn't received any bookings yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Reviews ({pkg.reviews.length})</h3>
                {avgRating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold text-gray-900">{avgRating.toFixed(1)}</span>
                    <span className="text-gray-500">average</span>
                  </div>
                )}
              </div>

              {pkg.reviews.length > 0 ? (
                <div className="space-y-4">
                  {pkg.reviews.map((review) => (
                    <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-gray-900">{review.agentName}</div>
                          <div className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                'h-4 w-4',
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              )}
                            />
                          ))}
                          <span className="ml-2 font-medium text-gray-900">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                      {review.verified && (
                        <div className="flex items-center gap-1 mt-3">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">Verified booking</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
                  <p className="text-gray-500">This package hasn't received any reviews yet.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onEditPackage(pkg)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit Package
              </button>
              <button
                onClick={onGeneratePDF}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white flex items-center gap-2 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Generate PDF
              </button>
              <button
                onClick={() => onDuplicatePackage(pkg)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white flex items-center gap-2 transition-colors"
              >
                <Copy className="h-4 w-4" />
                Duplicate
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onArchivePackage(pkg)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Archive className="h-4 w-4" />
                Archive
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Brochure Generator
interface EnhancedBrochureGeneratorProps {
  package: TourPackage;
  onClose: () => void;
}

const EnhancedBrochureGenerator: React.FC<EnhancedBrochureGeneratorProps> = ({
  package: pkg,
  onClose
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState('professional');
  const [includeItinerary, setIncludeItinerary] = useState(true);
  const [includeImages, setIncludeImages] = useState(true);
  const [includeTerms, setIncludeTerms] = useState(true);
  const [customBranding, setCustomBranding] = useState({
    companyName: 'Your Tour Company',
    companyLogo: '',
    contactEmail: 'info@yourcompany.com',
    contactPhone: '+1-234-567-8900',
    website: 'www.yourcompany.com',
    address: '123 Travel Street, City, Country'
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [
    {
      id: 'professional',
      name: 'Professional',
      description: 'Clean, business-focused layout',
      preview: 'bg-gradient-to-br from-blue-50 to-white',
      features: ['Clean typography', 'Business colors', 'Structured layout']
    },
    {
      id: 'colorful',
      name: 'Vibrant',
      description: 'Eye-catching, colorful design',
      preview: 'bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50',
      features: ['Bold colors', 'Dynamic layout', 'Eye-catching design']
    },
    {
      id: 'luxury',
      name: 'Luxury',
      description: 'Premium, high-end look',
      preview: 'bg-gradient-to-br from-amber-50 to-white',
      features: ['Premium feel', 'Elegant typography', 'Sophisticated colors']
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple, clean design',
      preview: 'bg-gradient-to-br from-gray-50 to-white',
      features: ['Simple layout', 'Clean lines', 'Focus on content']
    }
  ];

  const handleGeneratePDF = async () => {
    setIsGenerating(true);

    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate enhanced brochure content
    const brochureContent = `
${customBranding.companyName}
${'='.repeat(customBranding.companyName.length)}

${pkg.title}
${'-'.repeat(pkg.title.length)}

🌍 DESTINATION: ${pkg.destination}
📅 DURATION: ${pkg.duration} days
👥 GROUP SIZE: Up to ${pkg.maxGroupSize} travelers
💰 PRICE: ${pkg.pricePerPerson} per person
⭐ AGENT COMMISSION: ${pkg.agentCommission}%

📖 DESCRIPTION:
${pkg.description}

✨ PACKAGE HIGHLIGHTS:
${pkg.highlights.map((h, i) => `${i + 1}. ${h}`).join('\n')}

✅ WHAT'S INCLUDED:
${pkg.inclusions.map(i => `• ${i}`).join('\n')}

${includeItinerary && pkg.itinerary.length > 0 ? `
📋 DETAILED ITINERARY:
${pkg.itinerary.map(day => `
Day ${day.day}: ${day.title}
${day.description}
Activities: ${day.activities.join(', ')}
${day.accommodation ? `Accommodation: ${day.accommodation}` : ''}
${day.meals.length > 0 ? `Meals: ${day.meals.join(', ')}` : ''}
`).join('\n')}
` : ''}

${includeTerms ? `
📋 BOOKING INFORMATION:
${pkg.metadata?.cancellationPolicy || 'Standard cancellation policy applies.'}
` : ''}

📞 CONTACT US:
${customBranding.companyName}
📧 ${customBranding.contactEmail}
📞 ${customBranding.contactPhone}
🌐 ${customBranding.website}
📍 ${customBranding.address}

Generated on: ${new Date().toLocaleDateString()}
Template: ${templates.find(t => t.id === selectedTemplate)?.name}
    `;

    const blob = new Blob([brochureContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pkg.title.replace(/[^a-zA-Z0-9]/g, '_')}_brochure_${selectedTemplate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsGenerating(false);
    onClose();
    alert('✅ Professional brochure downloaded successfully!\n\nIn a real application, this would generate a beautifully formatted PDF with your selected template and branding.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Generate Package Brochure</h2>
              <p className="text-gray-600 mt-1">Create a professional PDF brochure for "{pkg.title}"</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-lg transition-colors text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Settings Panel */}
          <div className="w-1/3 border-r border-gray-200 p-6 space-y-6">
            {/* Template Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                Choose Template
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={cn(
                      'border-2 rounded-lg p-4 cursor-pointer transition-all duration-200',
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    )}
                  >
                    <div className={cn('w-full h-16 rounded mb-3', template.preview)}></div>
                    <div className="font-medium text-gray-900">{template.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{template.description}</div>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Options */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-500" />
                Include Content
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeItinerary}
                    onChange={(e) => setIncludeItinerary(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Full Itinerary</span>
                    <div className="text-xs text-gray-500">Day-by-day activities and details</div>
                  </div>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeImages}
                    onChange={(e) => setIncludeImages(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Package Images</span>
                    <div className="text-xs text-gray-500">Photo gallery and visuals</div>
                  </div>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={includeTerms}
                    onChange={(e) => setIncludeTerms(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Terms & Conditions</span>
                    <div className="text-xs text-gray-500">Booking policies and terms</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Custom Branding */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-green-500" />
                Company Branding
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={customBranding.companyName}
                    onChange={(e) => setCustomBranding({ ...customBranding, companyName: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={customBranding.contactEmail}
                    onChange={(e) => setCustomBranding({ ...customBranding, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="contact@company.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={customBranding.contactPhone}
                    onChange={(e) => setCustomBranding({ ...customBranding, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1-234-567-8900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={customBranding.website}
                    onChange={(e) => setCustomBranding({ ...customBranding, website: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="www.company.com"
                  />
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Generate Professional PDF
                  </>
                )}
              </button>

              {/* Quick Share Options */}
              <div className="mt-4">
                <div className="text-xs font-medium text-gray-700 mb-2">Quick Actions:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => alert('WhatsApp sharing would be implemented here')}
                    className="flex items-center justify-center gap-1 bg-green-500 text-white py-2 rounded text-xs hover:bg-green-600 transition-colors"
                  >
                    <MessageSquare className="h-3 w-3" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => alert('Email sharing would be implemented here')}
                    className="flex items-center justify-center gap-1 bg-blue-500 text-white py-2 rounded text-xs hover:bg-blue-600 transition-colors"
                  >
                    <Mail className="h-3 w-3" />
                    Email
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 p-6">
            <div className="h-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Live Preview
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FileText className="h-4 w-4" />
                  A4 Format
                </div>
              </div>

              {/* PDF Preview */}
              <div className={cn(
                'bg-white border-2 border-gray-300 rounded-lg shadow-xl p-8 h-full overflow-y-auto transform hover:scale-[1.02] transition-transform duration-200',
                selectedTemplate === 'professional' && 'bg-gradient-to-br from-blue-50 to-white',
                selectedTemplate === 'colorful' && 'bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50',
                selectedTemplate === 'minimal' && 'bg-gradient-to-br from-gray-50 to-white',
                selectedTemplate === 'luxury' && 'bg-gradient-to-br from-amber-50 to-white'
              )}>
                <BrochurePreview
                  package={pkg}
                  template={selectedTemplate}
                  branding={customBranding}
                  includeItinerary={includeItinerary}
                  includeImages={includeImages}
                  includeTerms={includeTerms}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Additional Info */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Lightning className="h-4 w-4 text-yellow-500" />
                <span>Generated in seconds</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Professional quality</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-blue-500" />
                <span>Ready to share worldwide</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Brochure Preview Component
interface BrochurePreviewProps {
  package: TourPackage;
  template: string;
  branding: any;
  includeItinerary: boolean;
  includeImages: boolean;
  includeTerms: boolean;
}

const BrochurePreview: React.FC<BrochurePreviewProps> = ({
  package: pkg,
  template,
  branding,
  includeItinerary,
  includeImages,
  includeTerms
}) => {
  const getTemplateColors = () => {
    switch (template) {
      case 'professional': return {
        primary: 'text-blue-700',
        accent: 'bg-blue-100',
        border: 'border-blue-200',
        gradient: 'from-blue-600 to-blue-700'
      };
      case 'colorful': return {
        primary: 'text-purple-700',
        accent: 'bg-purple-100',
        border: 'border-purple-200',
        gradient: 'from-purple-600 to-pink-600'
      };
      case 'minimal': return {
        primary: 'text-gray-700',
        accent: 'bg-gray-100',
        border: 'border-gray-200',
        gradient: 'from-gray-600 to-gray-700'
      };
      case 'luxury': return {
        primary: 'text-amber-800',
        accent: 'bg-amber-100',
        border: 'border-amber-200',
        gradient: 'from-amber-600 to-amber-700'
      };
      default: return {
        primary: 'text-blue-700',
        accent: 'bg-blue-100',
        border: 'border-blue-200',
        gradient: 'from-blue-600 to-blue-700'
      };
    }
  };

  const colors = getTemplateColors();

  return (
    <div className="space-y-6 text-sm max-w-4xl">
      {/* Header */}
      <div className="text-center pb-6 border-b-2 border-gray-200">
        <div className={cn('text-3xl font-bold mb-3 bg-gradient-to-r bg-clip-text text-transparent', colors.gradient)}>
          {branding.companyName}
        </div>
        <div className="text-gray-600 italic">Presents</div>
      </div>

      {/* Package Title */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{pkg.title}</h1>
        <div className={cn('inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold', colors.accent, colors.primary)}>
          <Crown className="h-4 w-4" />
          {pkg.category.charAt(0) + pkg.category.slice(1).toLowerCase()} Experience
        </div>
      </div>

      {/* Key Details Grid */}
      <div className={cn('border-2 rounded-xl p-6', colors.border)}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className={cn('p-3 rounded-full inline-flex mb-2', colors.accent)}>
              <MapPin className={cn('h-5 w-5', colors.primary)} />
            </div>
            <div className="font-semibold text-gray-900">{pkg.destination}</div>
            <div className="text-xs text-gray-500">Destination</div>
          </div>
          <div className="text-center">
            <div className={cn('p-3 rounded-full inline-flex mb-2', colors.accent)}>
              <Calendar className={cn('h-5 w-5', colors.primary)} />
            </div>
            <div className="font-semibold text-gray-900">{pkg.duration} Days</div>
            <div className="text-xs text-gray-500">Duration</div>
          </div>
          <div className="text-center">
            <div className={cn('p-3 rounded-full inline-flex mb-2', colors.accent)}>
              <Users className={cn('h-5 w-5', colors.primary)} />
            </div>
            <div className="font-semibold text-gray-900">Max {pkg.maxGroupSize}</div>
            <div className="text-xs text-gray-500">Group Size</div>
          </div>
          <div className="text-center">
            <div className={cn('p-3 rounded-full inline-flex mb-2', colors.accent)}>
              <DollarSign className={cn('h-5 w-5', colors.primary)} />
            </div>
            <div className="font-semibold text-gray-900">${pkg.pricePerPerson}</div>
            <div className="text-xs text-gray-500">Per Person</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h2 className={cn('text-2xl font-bold mb-4', colors.primary)}>About This Experience</h2>
        <p className="text-gray-700 leading-relaxed text-base">{pkg.description}</p>
      </div>

      {/* Highlights */}
      {pkg.highlights && pkg.highlights.length > 0 && (
        <div>
          <h2 className={cn('text-2xl font-bold mb-4', colors.primary)}>Experience Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pkg.highlights.map((highlight, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Images Placeholder */}
      {includeImages && (
        <div>
          <h2 className={cn('text-2xl font-bold mb-4', colors.primary)}>Photo Gallery</h2>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Itinerary */}
      {includeItinerary && pkg.itinerary && pkg.itinerary.length > 0 && (
        <div>
          <h2 className={cn('text-2xl font-bold mb-4', colors.primary)}>Detailed Itinerary</h2>
          <div className="space-y-4">
            {pkg.itinerary.slice(0, 4).map((day, index) => (
              <div key={index} className={cn('border-l-4 pl-6 py-3', colors.border)}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-gradient-to-r', colors.gradient)}>
                    {day.day}
                  </div>
                  <div className="font-bold text-gray-900">{day.title}</div>
                </div>
                <div className="text-gray-600 mb-2">{day.description}</div>
                {day.highlights && day.highlights.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">{day.highlights[0]}</span>
                  </div>
                )}
              </div>
            ))}
            {pkg.itinerary.length > 4 && (
              <div className="text-center text-gray-500 text-sm py-3 border border-gray-200 rounded-lg">
                ... and {pkg.itinerary.length - 4} more exciting days
              </div>
            )}
          </div>
        </div>
      )}

      {/* Inclusions */}
      {pkg.inclusions && pkg.inclusions.length > 0 && (
        <div>
          <h2 className={cn('text-2xl font-bold mb-4', colors.primary)}>What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {pkg.inclusions.map((inclusion, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{inclusion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Terms */}
      {includeTerms && (
        <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-700">Terms & Conditions</h3>
          <p>{pkg.metadata?.cancellationPolicy || 'Standard booking terms and conditions apply. Cancellation policy varies by package.'}</p>
        </div>
      )}

      {/* Contact Footer */}
      <div className={cn('border-t-2 pt-6 text-center', colors.border)}>
        <div className={cn('text-2xl font-bold mb-4 bg-gradient-to-r bg-clip-text text-transparent', colors.gradient)}>
          Ready to Book Your Adventure?
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center justify-center gap-2">
            <Mail className="h-4 w-4" />
            {branding.contactEmail}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" />
            {branding.contactPhone}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Globe className="h-4 w-4" />
            {branding.website}
          </div>
          <div className="flex items-center justify-center gap-2">
            <Building2 className="h-4 w-4" />
            {branding.address}
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-400">
          Generated by {branding.companyName} • {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};