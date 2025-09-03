// components/dashboard/common/SearchWidget.tsx
'use client';

import { useState } from 'react';
import {
  Search,
  Plane,
  Calendar,
  Users,
  ChevronDown,
  PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchInputProps {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  value?: string;
}

const SearchInput = ({ label, placeholder, icon, value }: SearchInputProps) => (
  <div className="flex-1">
    <label className="block text-xs font-medium text-gray-500 mb-1">
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={value}
        className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300"
      />
    </div>
  </div>
);

export const SearchWidget = () => {
  const [searchType, setSearchType] = useState('roundTrip');

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setSearchType('roundTrip')}
          className={`py-2 px-4 font-semibold text-sm transition-colors ${
            searchType === 'roundTrip'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Round Trip
        </button>
        <button
          onClick={() => setSearchType('oneWay')}
          className={`py-2 px-4 font-semibold text-sm transition-colors ${
            searchType === 'oneWay'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          One Way
        </button>
        <button
          onClick={() => setSearchType('multiCity')}
          className={`py-2 px-4 font-semibold text-sm transition-colors ${
            searchType === 'multiCity'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Multi City
        </button>
      </div>

      {/* Search Form */}
      <div className="space-y-4">
        {/* Input fields */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <SearchInput
            label="From"
            placeholder="City or airport"
            icon={<Plane />}
          />
          <SearchInput
            label="To"
            placeholder="City or airport"
            icon={<Plane className="transform -rotate-90" />}
          />
        </div>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <SearchInput
            label="Departure"
            placeholder="Select Date"
            icon={<Calendar />}
          />
          <SearchInput
            label="Return"
            placeholder="Select Date"
            icon={<Calendar />}
          />
        </div>

        {/* Passengers and Class */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <SearchInput
            label="Travelers"
            placeholder="1 Traveler"
            icon={<Users />}
            value="1 Traveler"
          />
          <SearchInput
            label="Class"
            placeholder="All Classes"
            icon={<ChevronDown />}
            value="All Classes"
          />
        </div>

        {/* Multi City Option */}
        {searchType === 'multiCity' && (
          <Button variant="outline" className="w-full space-x-2">
            <PlusCircle className="h-4 w-4" />
            <span>Add City</span>
          </Button>
        )}

        {/* Search Button */}
        <Button className="w-full h-12 text-lg font-bold">Search Flight</Button>
      </div>
    </div>
  );
};
