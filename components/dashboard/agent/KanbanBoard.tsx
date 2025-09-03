import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanColumn } from '@/components/dashboard/agent/KanbanColumn';
import type { Lead, LeadStatus } from '@/lib/data';

interface KanbanBoardProps {
  columns: { id: LeadStatus; title: string }[];
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export function KanbanBoard({
  columns,
  leads,
  onSelectLead,
}: KanbanBoardProps) {
  const columnIds = columns.map((c) => c.id);
  return (
    <div className="flex gap-6 h-full w-max">
      <SortableContext
        items={columnIds}
        strategy={horizontalListSortingStrategy}
      >
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            leads={leads.filter((lead) => lead.status === column.id)}
            onSelectLead={onSelectLead}
          />
        ))}
      </SortableContext>
    </div>
  );
}
