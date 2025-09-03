// components/landing/Features.tsx
import { LayoutGrid, ShoppingBasket, MapPin, Package } from 'lucide-react';

const features = [
  {
    icon: LayoutGrid,
    title: 'Centralized Dashboard',
    description:
      'Manage all your business operations from a single, intuitive dashboard.',
  },
  {
    icon: ShoppingBasket,
    title: 'Lead Marketplace',
    description:
      'Access a curated marketplace of qualified leads to grow your client base.',
  },
  {
    icon: MapPin,
    title: 'Itinerary Builder',
    description:
      'Create stunning, custom itineraries in minutes with our drag-and-drop builder.',
  },
  {
    icon: Package,
    title: 'Product Management',
    description:
      'Effortlessly manage your tour packages, pricing, and availability.',
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 px-4 md:px-8">
      <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-lg hover:-translate-y-1"
          >
            <div className="p-4 rounded-full bg-blue-100 text-blue-600 mb-4">
              <feature.icon className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-500 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
