'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AddLeadModalProps {
  onClose: () => void;
  onAddLead: (data: any) => void;
}

export function AddLeadModal({ onClose, onAddLead }: AddLeadModalProps) {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    destination: '',
    estimatedValue: '',
    travelerCount: '',
    travelDates: { from: '', to: '' },
    source: 'Manual Entry',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'from' || name === 'to') {
      setFormData((prev) => ({
        ...prev,
        travelDates: { ...prev.travelDates, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const processedData = {
      ...formData,
      estimatedValue: parseFloat(formData.estimatedValue) || 0,
      travelerCount: parseInt(formData.travelerCount, 10) || 1,
    };
    onAddLead(processedData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Add New Lead</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Form Fields */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Client Email
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Client Phone
                </label>
                <input
                  type="tel"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Destination
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Estimated Value (€)
                </label>
                <input
                  type="number"
                  name="estimatedValue"
                  value={formData.estimatedValue}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Travelers
                </label>
                <input
                  type="number"
                  name="travelerCount"
                  value={formData.travelerCount}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  From Date
                </label>
                <input
                  type="date"
                  name="from"
                  value={formData.travelDates.from}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  To Date
                </label>
                <input
                  type="date"
                  name="to"
                  value={formData.travelDates.to}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg p-2 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="p-6 flex justify-end gap-3 bg-gray-50 border-t rounded-b-2xl">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Lead</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
