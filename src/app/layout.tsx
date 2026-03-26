import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { ToastProvider } from '@/components/ui/Toast';

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });

export const metadata: Metadata = {
  title: 'Gaff.ie — Find Your Next Gaff | Irish Property Platform',
  description:
    'The trustworthy Irish property platform. Every landlord verified, every listing real, every message answered. Free to list. No scams.',
  keywords: [
    'Irish property',
    'rent Ireland',
    'Dublin apartments',
    'Cork rentals',
    'Galway housing',
    'verified landlords',
    'HAP rentals',
  ],
  openGraph: {
    title: 'Gaff.ie — Find Your Next Gaff',
    description: 'Every landlord verified. Every listing real. Free to list.',
    siteName: 'Gaff.ie',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="font-sans text-white">
        <ToastProvider>
          <Suspense fallback={<div className="h-[76px]" />}>
            <Navbar />
          </Suspense>
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
