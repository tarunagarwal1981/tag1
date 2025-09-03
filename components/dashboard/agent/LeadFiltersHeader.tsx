import { Button } from '@/components/ui/button';
import { Filter, Plus, Search, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeadFiltersHeaderProps {
  onAddLeadClick: () => void;
  activeView: 'kanban' | 'table';
  setActiveView: (view: 'kanban' | 'table') => void;
}

export function LeadFiltersHeader({
  onAddLeadClick,
  activeView,
  setActiveView,
}: LeadFiltersHeaderProps) {
  return (
    <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* ... Title and Search bar remain the same ... */}
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-gray-900">
            My Leads Pipeline
          </h1>
          <p className="text-sm text-gray-500">
            Manage your leads from inquiry to operations.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* View Switcher */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveView('kanban')}
              className={cn(
                'p-1.5 rounded-md',
                activeView === 'kanban' && 'bg-white shadow-sm'
              )}
            >
              <LayoutGrid className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={() => setActiveView('table')}
              className={cn(
                'p-1.5 rounded-md',
                activeView === 'table' && 'bg-white shadow-sm'
              )}
            >
              <List className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <Button
            variant="outline"
            className="hidden sm:flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
          <Button onClick={onAddLeadClick} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Lead</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
