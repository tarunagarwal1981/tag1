// app/(main)/operator/leads/page.tsx

'use client';

import { OperatorLeadManager } from '@/components/dashboard/operator/OperatorLeadManager';

export default function OperatorLeadsPage() {
  return (
    <div className="relative">
      <OperatorLeadManager />
    </div>
  );
}