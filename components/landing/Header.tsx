// components/landing/Header.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // We'll create this in the next step
import { PlaneTakeoff } from 'lucide-react';

export const Header = () => {
  return (
    <header className="py-6 px-4 md:px-8 flex items-center justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <PlaneTakeoff className="h-8 w-8 text-blue-600" />
        <span className="text-2xl font-bold text-gray-900">TravelHub Pro</span>
      </Link>
      <nav className="hidden md:flex items-center space-x-6">
        <Link
          href="#features"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Features
        </Link>
        <Link
          href="#pricing"
          className="text-gray-600 hover:text-blue-600 transition-colors"
        >
          Pricing
        </Link>
      </nav>
      <div className="flex items-center space-x-4">
        <Link
          href="#"
          className="hidden sm:inline text-gray-600 hover:text-blue-600 transition-colors font-medium"
        >
          Log In
        </Link>
        <Link
          href="#"
          className="py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
};
