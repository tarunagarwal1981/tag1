import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { LeadCard } from '@/components/dashboard/agent/LeadCard';
import type { Lead, LeadStatus } from '@/lib/data';

interface KanbanColumnProps {
  column: { id: LeadStatus; title: string };
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}

export function KanbanColumn({
  column,
  leads,
  onSelectLead,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const leadIds = leads.map((l) => l.id);

  return (
    <div className="w-80 flex-shrink-0 flex flex-col">
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="font-bold text-gray-800">{column.title}</h2>
        <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
          {leads.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className="flex-grow bg-gray-100 rounded-xl p-3 space-y-4 overflow-y-auto"
      >
        <SortableContext items={leadIds} strategy={verticalListSortingStrategy}>
          {leads.length > 0 ? (
            leads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onSelectLead={onSelectLead} />
            ))
          ) : (
            <div className="text-center text-sm text-gray-500 pt-10 h-20">
              Drop leads here
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}
