'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  role: string;
}

export default function AgentTenantsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.user) { window.location.href = '/auth/login'; return; }
        if (data.user.role !== 'AGENT') { window.location.href = '/dashboard'; return; }
        setUser(data.user);
      })
      .catch(() => { window.location.href = '/auth/login'; })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <div className="bg-gaff-slate text-white py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold">Tenant Pipeline 👥</h1>
          <p className="text-gray-400 text-sm mt-1">View and match interested tenants to your properties</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <div className="text-4xl mb-3">👥</div>
          <h3 className="text-lg font-semibold text-gaff-slate mb-1">No tenant enquiries yet</h3>
          <p className="text-gray-500 text-sm mb-4 max-w-md mx-auto">
            When tenants express interest in your properties, they&apos;ll appear here. You can then vet them and match them to suitable listings.
          </p>
          <a href="/dashboard" className="inline-block bg-gaff-teal text-white px-6 py-2.5 rounded-lg font-semibold text-sm">
            Back to Dashboard
          </a>
        </div>

        <div className="mt-8 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-semibold text-gaff-slate mb-4">🔮 Coming Soon</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-center gap-2"><span className="text-gaff-teal">✓</span> View all tenant enquiries in one place</li>
            <li className="flex items-center gap-2"><span className="text-gaff-teal">✓</span> AI-powered tenant-property matching</li>
            <li className="flex items-center gap-2"><span className="text-gaff-teal">✓</span> Tenant vetting and reference checks</li>
            <li className="flex items-center gap-2"><span className="text-gaff-teal">✓</span> Bulk messaging and scheduling viewings</li>
            <li className="flex items-center gap-2"><span className="text-gaff-teal">✓</span> Pair tenants with landlord properties</li>
          </ul>
        </div>
      </div>
      
    </>
  );
}
