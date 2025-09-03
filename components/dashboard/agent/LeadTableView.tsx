'use client';

import { useState } from 'react';
import type { Lead } from '@/lib/data';
import { ArrowDown, ArrowUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type SortKey = 'clientName' | 'estimatedValue' | 'updatedAt' | 'status';
type SortDirection = 'asc' | 'desc';

export function LeadTableView({
  leads,
  onSelectLead,
}: {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedLeads = [...leads].sort((a, b) => {
    let valA, valB;

    if (sortKey === 'updatedAt') {
      valA = new Date(a.updatedAt).getTime();
      valB = new Date(b.updatedAt).getTime();
    } else if (sortKey === 'estimatedValue') {
      valA = a.estimatedValue;
      valB = b.estimatedValue;
    } else {
      valA = a[sortKey];
      valB = b[sortKey];
    }

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const SortableHeader = ({
    label,
    sortKey: key,
  }: {
    label: string;
    sortKey: SortKey;
  }) => (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={() => handleSort(key)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortKey === key &&
          (sortDirection === 'asc' ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          ))}
      </div>
    </th>
  );

  const statusColors: { [key: string]: string } = {
    NEW: 'bg-blue-100 text-blue-800',
    QUALIFICATION: 'bg-purple-100 text-purple-800',
    QUOTING: 'bg-amber-100 text-amber-800',
    BOOKED: 'bg-green-100 text-green-800',
    OPERATIONS: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="p-4 flex-grow">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <SortableHeader label="Client Name" sortKey="clientName" />
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Destination
                </th>
                <SortableHeader label="Value" sortKey="estimatedValue" />
                <SortableHeader label="Status" sortKey="status" />
                <SortableHeader label="Last Updated" sortKey="updatedAt" />
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Assigned To
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.clientName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {lead.clientEmail}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {lead.destination}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    €{lead.estimatedValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={cn(
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        statusColors[lead.status]
                      )}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={lead.assignedTo.avatarUrl}
                        alt={lead.assignedTo.name}
                        className="h-8 w-8 rounded-full"
                      />
                      <div className="ml-3 text-sm font-medium text-gray-900">
                        {lead.assignedTo.name}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
