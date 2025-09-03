// components/dashboard/Header.tsx
'use client';

import { useState } from 'react';
import { Search, Bell, UserCircle, ChevronDown } from 'lucide-react';

export const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm py-4 px-8">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-lg hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for bookings, clients, or products..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* User & Notifications */}
        <div className="flex items-center space-x-4 ml-auto">
          <div className="relative">
            <Bell className="h-6 w-6 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
          </div>

          <div
            className="relative flex items-center space-x-2 cursor-pointer p-1 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            <span className="font-medium text-gray-700 hidden sm:block">
              Anya Sharma
            </span>
            <UserCircle className="h-8 w-8 text-gray-400" />
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform ${
                isProfileMenuOpen ? 'rotate-180' : ''
              }`}
            />

            {isProfileMenuOpen && (
              <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-48 animate-in slide-in-from-top-2 z-50">
                <div className="py-1 px-4 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                  Profile
                </div>
                <div className="py-1 px-4 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                  Settings
                </div>
                <div className="h-px bg-gray-200 my-1"></div>
                <div className="py-1 px-4 text-sm text-red-500 hover:bg-gray-100 transition-colors cursor-pointer">
                  Log Out
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
