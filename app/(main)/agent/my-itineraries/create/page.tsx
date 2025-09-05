// app/(main)/agent/my-itineraries/create/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TourBuilder } from '@/components/dashboard/operator/TourBuilder';
import { TourPackage } from '@/lib/tourPackageData';

export default function AgentCreatePackagePage() {
  const router = useRouter();

  const handleSave = (packageData: TourPackage) => {
    // In a real app, this would save to your backend with agent context
    console.log('Agent saving package:', packageData);
    
    // Add agent-specific metadata
    const agentPackage = {
      ...packageData,
      createdBy: 'Travel Agent', // Mark as agent-created
      metadata: {
        ...packageData.metadata,
        isB2C: true, // Flag for direct client sales
        agentId: 'current-agent-id', // In real app, get from auth
        salesContext: 'direct-to-client',
      }
    };
    
    // Show success message and redirect to agent packages
    alert('Package created successfully! You can now sell this to your clients.');
    router.push('/agent/my-itineraries');
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.push('/agent/my-itineraries');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Agent-specific header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Package</h1>
              <p className="text-gray-600 mt-1">Build a custom travel package for your clients</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                🎯 Direct Client Sales
              </div>
              <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                100% Commission
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reuse existing TourBuilder component */}
      <TourBuilder 
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}