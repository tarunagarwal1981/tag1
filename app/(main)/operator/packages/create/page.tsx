// app/(main)/operator/packages/create/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TourBuilder } from '@/components/dashboard/operator/TourBuilder';
import { TourPackage } from '@/lib/tourPackageData';

export default function CreatePackagePage() {
  const router = useRouter();

  const handleSave = (packageData: TourPackage) => {
    // In a real app, this would save to your backend
    console.log('Saving package:', packageData);
    
    // Show success message and redirect
    alert('Package saved successfully!');
    router.push('/operator/packages');
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.push('/operator/packages');
    }
  };

  return (
    <TourBuilder 
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}