// app/(main)/operator/packages/edit/[id]/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TourBuilder } from '@/components/dashboard/operator/TourBuilder';
import { TourPackage, getPackageById } from '@/lib/tourPackageData';

export default function EditPackagePage() {
  const router = useRouter();
  const params = useParams();
  const packageId = params.id as string;
  
  const [packageData, setPackageData] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd fetch the package from your API
    const pkg = getPackageById(packageId);
    if (pkg) {
      setPackageData(pkg);
    } else {
      // Package not found, redirect to packages list
      router.push('/operator/packages');
    }
    setLoading(false);
  }, [packageId, router]);

  const handleSave = (updatedPackage: TourPackage) => {
    // In a real app, this would update the package in your backend
    console.log('Updating package:', updatedPackage);
    
    // Show success message and redirect
    alert('Package updated successfully!');
    router.push('/operator/packages');
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.push('/operator/packages');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading package...</p>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Package Not Found</h1>
          <p className="text-gray-600 mb-4">The package you're looking for doesn't exist.</p>
          <button 
            onClick={() => router.push('/operator/packages')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <TourBuilder 
      initialPackage={packageData}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}