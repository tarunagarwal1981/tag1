// app/(main)/agent/my-itineraries/edit/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TourBuilder } from '@/components/dashboard/operator/TourBuilder';
import { TourPackage, getPackageById } from '@/lib/tourPackageData';

export default function AgentEditPackagePage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.id as string;
  
  const [packageData, setPackageData] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [agentStats, setAgentStats] = useState({
    clientInquiries: 0,
    directBookings: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    // In a real app, you'd fetch the agent's package from your API
    const pkg = getPackageById(packageId);
    if (pkg) {
      setPackageData(pkg);
      
      // Simulate agent-specific stats for this package
      setAgentStats({
        clientInquiries: Math.floor(Math.random() * 15) + 5,
        directBookings: Math.floor(Math.random() * 8) + 2,
        totalRevenue: Math.floor(Math.random() * 25000) + 5000
      });
    } else {
      // Package not found, redirect to agent packages list
      router.push('/agent/my-itineraries');
    }
    setLoading(false);
  }, [packageId, router]);

  const handleSave = (updatedPackage: TourPackage) => {
    // In a real app, this would update the agent's package in your backend
    console.log('Agent updating package:', updatedPackage);
    
    // Add agent-specific metadata
    const agentPackage = {
      ...updatedPackage,
      lastEditedBy: 'Travel Agent',
      metadata: {
        ...updatedPackage.metadata,
        isB2C: true,
        agentId: 'current-agent-id',
        salesContext: 'direct-to-client',
        lastEditedDate: new Date().toISOString()
      }
    };
    
    // Show success message and redirect
    alert('Package updated successfully! Your clients will see the latest version.');
    router.push('/agent/my-itineraries');
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.push('/agent/my-itineraries');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your package...</p>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Package Not Found</h1>
          <p className="text-gray-600 mb-6">The package you're looking for doesn't exist in your portfolio.</p>
          <button 
            onClick={() => router.push('/agent/my-itineraries')}
            className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Back to My Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Agent-specific header with package stats */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Package</h1>
              <p className="text-gray-600 mt-1">
                Editing: <span className="font-medium">{packageData.title}</span>
              </p>
            </div>
            
            {/* Package Performance Stats */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-600">{agentStats.clientInquiries}</div>
                <div className="text-xs text-gray-500">Client Inquiries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{agentStats.directBookings}</div>
                <div className="text-xs text-gray-500">Direct Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">${agentStats.totalRevenue.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Total Revenue</div>
              </div>
              <div className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                🎯 B2C Package
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reuse existing TourBuilder component with initial data */}
      <TourBuilder 
        initialPackage={packageData}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}