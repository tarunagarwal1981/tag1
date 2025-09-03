'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { KanbanBoard } from '@/components/dashboard/agent/KanbanBoard';
import { LeadDetailPanel } from '@/components/dashboard/agent/LeadDetailPanel';
import { LeadFiltersHeader } from '@/components/dashboard/agent/LeadFiltersHeader';
import { AddLeadModal } from '@/components/dashboard/agent/AddLeadModal';
import { LeadTableView } from '@/components/dashboard/agent/LeadTableView'; // <-- IMPORT NEW COMPONENT
import {
  leadsData as initialLeads,
  kanbanColumnsData,
  subAgentsData,
} from '@/lib/data';
import type { Lead, LeadStatus } from '@/lib/data';

export function LeadKanbanView() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeView, setActiveView] = useState<'kanban' | 'table'>('kanban');

  // All handler functions (handleDragEnd, handleUpdateLead, etc.) remain exactly the same
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLeads((prevLeads) => {
        const leadIndex = prevLeads.findIndex((l) => l.id === active.id);
        if (leadIndex !== -1) {
          const updatedLeads = [...prevLeads];
          const movedLead = {
            ...updatedLeads[leadIndex],
            status: over.id as LeadStatus,
            updatedAt: new Date().toISOString(),
          };
          updatedLeads[leadIndex] = movedLead;
          return updatedLeads;
        }
        return prevLeads;
      });
    }
  };
  const handleSelectLead = (lead: Lead) => setSelectedLead(lead);
  const handleClosePanel = () => setSelectedLead(null);
  const handleUpdateLead = (updatedLead: Lead) => {
    const newLeads = leads.map((l) =>
      l.id === updatedLead.id
        ? { ...updatedLead, updatedAt: new Date().toISOString() }
        : l
    );
    setLeads(newLeads);
    if (selectedLead && selectedLead.id === updatedLead.id) {
      setSelectedLead({ ...updatedLead, updatedAt: new Date().toISOString() });
    }
  };
  const handleAddLead = (
    newLeadData: Omit<
      Lead,
      | 'id'
      | 'status'
      | 'createdAt'
      | 'updatedAt'
      | 'assignedTo'
      | 'tasks'
      | 'activity'
      | 'documents'
      | 'payment'
      | 'aiScore'
    >
  ) => {
    const newLead: Lead = {
      ...newLeadData,
      id: `LEAD-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      status: 'NEW',
      assignedTo: subAgentsData[0],
      tasks: [],
      activity: [
        {
          id: `act-${Date.now()}`,
          type: 'STATUS_CHANGE',
          content: 'Lead Created',
          timestamp: new Date().toISOString(),
          author: 'System',
        },
      ],
      documents: [],
      payment: { total: newLeadData.estimatedValue, paid: 0, status: 'UNPAID' },
      aiScore: Math.floor(Math.random() * 30) + 60,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLeads([newLead, ...leads]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50/50">
      <LeadFiltersHeader
        onAddLeadClick={() => setIsAddModalOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {activeView === 'kanban' ? (
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-grow p-4 overflow-x-auto">
            <KanbanBoard
              columns={kanbanColumnsData}
              leads={leads}
              onSelectLead={handleSelectLead}
            />
          </div>
        </DndContext>
      ) : (
        // RENDER THE NEW TABLE VIEW COMPONENT
        <LeadTableView leads={leads} onSelectLead={handleSelectLead} />
      )}

      <AnimatePresence>
        {selectedLead && (
          <LeadDetailPanel
            key={selectedLead.id}
            lead={selectedLead}
            onClose={handleClosePanel}
            onUpdateLead={handleUpdateLead}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isAddModalOpen && (
          <AddLeadModal
            onClose={() => setIsAddModalOpen(false)}
            onAddLead={handleAddLead}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
