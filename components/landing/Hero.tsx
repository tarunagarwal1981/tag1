// components/landing/Hero.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const Hero = () => {
  return (
    <section className="relative py-20 px-4 md:px-8 text-center bg-white rounded-3xl shadow-lg mx-auto max-w-7xl mt-12">
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
          The All-In-One Platform for Travel Professionals
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          TravelHub Pro streamlines operations for Tour Operators and empowers
          Travel Agents to grow their business with a centralized, intelligent
          platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/operator">
            <Button size="lg">I'm a Tour Operator</Button>
          </Link>
          <Link href="/agent">
            <Button size="lg" variant="outline">
              I'm a Travel Agent
            </Button>
          </Link>
        </div>
      </div>
      {/* Add a subtle background graphic if desired */}
    </section>
  );
};
