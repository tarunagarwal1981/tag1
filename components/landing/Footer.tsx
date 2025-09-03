// components/landing/Footer.tsx
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="py-8 px-4 md:px-8 text-center text-gray-500 text-sm">
      <p>
        &copy; {new Date().getFullYear()} TravelHub Pro. All rights reserved.
      </p>
    </footer>
  );
};
