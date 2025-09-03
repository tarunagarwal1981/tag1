// Updated Root Layout - app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './modern.css'; // Add our modern CSS
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TravelHub Pro - AI-Powered Travel CRM',
  description:
    'Your intelligent travel management platform with AI-powered lead prioritization.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn('min-h-screen bg-gray-50 antialiased', inter.className)}
      >
        {children}
      </body>
    </html>
  );
}
