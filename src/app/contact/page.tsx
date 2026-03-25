'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-gaff-slate to-gray-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Get in Touch</h1>
          <p className="text-gray-300">We&apos;d love to hear from you. Questions, feedback, or partnership enquiries — drop us a line.</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        <div>
          {status === 'sent' ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-lg font-bold text-green-700 mb-2">Message Sent!</h3>
              <p className="text-sm text-green-600">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gaff-slate mb-1">Name</label>
                <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gaff-teal focus:border-transparent" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gaff-slate mb-1">Email</label>
                <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gaff-teal focus:border-transparent" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gaff-slate mb-1">Subject</label>
                <input type="text" required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gaff-teal focus:border-transparent" placeholder="What's this about?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gaff-slate mb-1">Message</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gaff-teal focus:border-transparent resize-none" placeholder="Tell us more..." />
              </div>
              {status === 'error' && <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>}
              <button type="submit" disabled={status === 'sending'} className="w-full py-3 bg-gaff-teal text-white font-semibold rounded-lg hover:bg-gaff-teal-dark transition-colors disabled:opacity-50">
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="font-bold text-gaff-slate mb-3">Contact Info</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <span className="text-gaff-teal">📧</span>
                <span>support@gaff.ie</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gaff-teal">📍</span>
                <span>Dublin, Ireland</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gaff-teal">⏰</span>
                <span>Mon–Fri, 9am–6pm IST</span>
              </div>
            </div>
          </div>
          {/* Map placeholder */}
          <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center text-gray-400 text-sm">
            <div className="text-center">
              <div className="text-3xl mb-2">🗺️</div>
              <p>Map coming soon</p>
              <p className="text-xs mt-1">Dublin, Ireland</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
