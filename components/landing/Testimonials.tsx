// components/landing/Testimonials.tsx
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote:
      "TravelHub Pro has completely transformed how we manage our tour operations. We've seen a 25% increase in efficiency since we started using it.",
    name: 'Jane Doe',
    title: 'CEO, Global Tours',
  },
  {
    quote:
      'The itinerary builder is a game-changer. I can create and send professional itineraries to my clients in half the time.',
    name: 'John Smith',
    title: 'Senior Travel Agent',
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 px-4 md:px-8 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12">
        What Our Customers Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white p-8 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
            <p className="text-lg italic text-gray-700 mb-4">
              "{testimonial.quote}"
            </p>
            <p className="font-semibold text-gray-900">{testimonial.name}</p>
            <p className="text-sm text-gray-500">{testimonial.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
