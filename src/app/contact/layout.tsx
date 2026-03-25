import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us — Gaff.ie',
  description: 'Get in touch with the Gaff.ie team. We\'re here to help with any questions about property listings in Ireland.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
