import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Properties — Gaff.ie',
  description: 'Search verified rental and sale properties across Ireland. Filter by location, price, bedrooms, property type, and more.',
  openGraph: {
    title: 'Search Properties — Gaff.ie',
    description: 'Browse verified properties across Ireland. Every landlord checked, every listing real.',
  },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
