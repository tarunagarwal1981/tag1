// Lead Management Hub Page - app/(main)/agent/lead-hub/page.tsx

'use client';

import { EnhancedLeadManager } from '@/components/dashboard/agent/EnhancedLeadManager';
import { EnhancedAICopilot } from '@/components/dashboard/agent/EnhancedAICopilot';

export default function LeadHubPage() {
  return (
    <div className="relative">
      <EnhancedLeadManager userRole="agent" />
      <EnhancedAICopilot />
    </div>
  );
}
