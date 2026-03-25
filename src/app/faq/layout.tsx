import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — Gaff.ie',
  description: 'Frequently asked questions about Gaff.ie — Ireland\'s verification-first property platform.',
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
