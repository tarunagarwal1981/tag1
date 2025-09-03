// Lead Management Hub Page - app/(main)/agent/lead-hub/page.tsx

'use client';

import { CompleteLeadManager } from '@/components/dashboard/agent/CompleteLeadManager';
import { EnhancedAICopilot } from '@/components/dashboard/agent/EnhancedAICopilot';

export default function LeadHubPage() {
  return (
    <div className="relative">
      <CompleteLeadManager />
      <EnhancedAICopilot />
    </div>
  );
}
