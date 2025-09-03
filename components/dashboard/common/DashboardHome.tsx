// components/dashboard/common/DashboardHome.tsx
import { SearchWidget } from '@/components/dashboard/common/SearchWidget';
import { DealSection } from '@/components/dashboard/common/DealSection';
import { dealsData } from '@/lib/data';

export const DashboardHome = () => {
  return (
    <div className="space-y-8">
      <SearchWidget />

      <div className="space-y-8">
        <DealSection
          title="Fixed Departure"
          deals={dealsData['Fixed Departure']}
        />
        <DealSection title="Top Air Fares" deals={dealsData['Top Air Fares']} />
        <DealSection title="Series Fares" deals={dealsData['Series Fares']} />
        <DealSection title="Group Fares" deals={dealsData['Group Fares']} />
      </div>
    </div>
  );
};
