import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register — Gaff.ie',
  description: 'Create your free Gaff.ie account. List properties for free or find your next home in Ireland.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
