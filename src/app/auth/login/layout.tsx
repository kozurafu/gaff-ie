import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login — Gaff.ie',
  description: 'Sign in to your Gaff.ie account to manage listings, messages, and preferences.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
