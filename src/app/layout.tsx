import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
    description:
      'Every landlord verified. Every listing real. Free to list.',
    siteName: 'Gaff.ie',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-warm-white text-slate-dark font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
