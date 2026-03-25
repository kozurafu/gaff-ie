'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'What is Gaff.ie?',
    a: 'Gaff.ie is an Irish property platform for renting, buying, and sharing homes. We built it because the existing options — particularly Daft.ie — have become expensive, unreliable, and full of fake listings. We\'re verification-first, free to list, and powered by AI scam detection.',
  },
  {
    q: 'How is Gaff.ie different from Daft?',
    a: 'Three big differences: (1) Free basic listings — Daft charges €135–€999. (2) Every landlord is verified before they can list. (3) Our messaging actually works, with read receipts and real-time delivery. Plus our AI scam detection catches fake listings before they go live.',
  },
  {
    q: 'Is it free to list a property?',
    a: 'Yes! Basic listings are completely free, forever. We offer optional premium features — like priority placement and featured badges — but you\'ll never need to pay just to advertise a property.',
  },
  {
    q: 'How does landlord verification work?',
    a: 'When a landlord signs up, we verify their identity through our verification partner. They\'ll need to confirm property ownership or management authority. This means every listing you see on Gaff.ie is from a real, verified person.',
  },
  {
    q: 'How do I report a suspicious listing?',
    a: 'Every listing has a "Report" button. Click it, select a reason (scam, fake listing, already let, etc.), add any details, and submit. Our trust & safety team reviews reports promptly, and our AI flags suspicious listings automatically.',
  },
  {
    q: 'Is my data safe?',
    a: 'Absolutely. We\'re fully GDPR compliant. Your personal data is encrypted, never sold to third parties, and you can request deletion at any time. We take privacy seriously — it\'s the law, and it\'s the right thing to do.',
  },
  {
    q: 'How do I contact support?',
    a: 'Head to our Contact page or email support@gaff.ie. We aim to respond within 24 hours, Monday to Friday.',
  },
  {
    q: 'What areas do you cover?',
    a: 'All 32 counties of Ireland. We launched with a focus on Dublin but we\'re nationwide from day one. Whether you\'re looking in Cork, Galway, Limerick, or Leitrim — we\'ve got you covered.',
  },
  {
    q: 'Can estate agents use Gaff.ie?',
    a: 'Yes! We have agent accounts with team management, bulk listing tools, and analytics. Agent subscription plans are coming soon with tiered pricing for agencies of all sizes.',
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="font-semibold text-gaff-slate group-hover:text-gaff-teal transition-colors pr-4">{q}</span>
        <svg className={`w-5 h-5 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="pb-5 text-gray-600 text-sm leading-relaxed pr-10">{a}</div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-gaff-slate to-gray-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-gray-300">Everything you need to know about Gaff.ie</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} q={faq.q} a={faq.a} />
        ))}
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="font-bold text-gaff-slate text-lg mb-2">Still have questions?</h3>
          <p className="text-gray-500 text-sm mb-4">We&apos;re here to help.</p>
          <a href="/contact" className="inline-block px-6 py-2.5 bg-gaff-teal text-white font-semibold rounded-lg hover:bg-gaff-teal-dark transition-colors text-sm">Contact Us</a>
        </div>
      </section>
    </main>
  );
}
