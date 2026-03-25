'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  users: { total: number; byRole: Record<string, number> };
  listings: { total: number; byStatus: Record<string, number> };
  messages: number;
  verifications: { pending: number; completed: number; rejected: number };
  recentReports: { id: string; reason: string; status: string; description: string | null; reporterName: string; listingTitle: string; listingId: string | null; createdAt: string }[];
  recentFlagged: { id: string; listingId: string; riskScore: number; status: string; title: string; city: string; createdAt: string }[];
  recentUsers: { id: string; name: string; email: string; role: string; createdAt: string }[];
}

function StatCard({ label, value, sub, icon }: { label: string; value: number | string; sub?: string; icon: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm font-medium text-gray-500">{label}</span>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => {
        if (r.status === 403) throw new Error('Admin access required');
        return r.json();
      })
      .then(setStats)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) return <div className="max-w-5xl mx-auto px-4 py-12 text-center text-red-600 font-medium">{error}</div>;
  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
      </div>
    </div>
  );

  if (!stats) return null;

  const roleBreakdown = Object.entries(stats.users.byRole).map(([r, c]) => `${c} ${r.toLowerCase()}s`).join(', ');
  const statusBreakdown = Object.entries(stats.listings.byStatus).map(([s, c]) => `${c} ${s.toLowerCase().replace('_', ' ')}`).join(', ');

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Platform overview and moderation</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/verifications" className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            Verifications
          </Link>
          <Link href="/admin/flagged" className="px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            Flagged
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon="👥" label="Total Users" value={stats.users.total} sub={roleBreakdown} />
        <StatCard icon="🏠" label="Total Listings" value={stats.listings.total} sub={statusBreakdown} />
        <StatCard icon="💬" label="Messages Sent" value={stats.messages} />
        <StatCard icon="🔍" label="Pending Verifications" value={stats.verifications.pending} sub={`${stats.verifications.completed} completed, ${stats.verifications.rejected} rejected`} />
      </div>

      {/* Activity Feed */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>🚨</span> Recent Reports
          </h2>
          {stats.recentReports.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No reports</p>
          ) : (
            <div className="space-y-3">
              {stats.recentReports.map(r => (
                <div key={r.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.status === 'OPEN' ? 'bg-red-50 text-red-700' : r.status === 'REVIEWING' ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'}`}>
                      {r.reason.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400">{timeAgo(r.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700 truncate">{r.listingTitle}</p>
                  <p className="text-xs text-gray-400">by {r.reporterName}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Flagged */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>⚠️</span> Flagged Listings
          </h2>
          {stats.recentFlagged.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No pending flags</p>
          ) : (
            <div className="space-y-3">
              {stats.recentFlagged.map(f => (
                <div key={f.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${f.riskScore > 70 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      Risk: {f.riskScore}
                    </span>
                    <span className="text-xs text-gray-400">{timeAgo(f.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-700 truncate">{f.title}</p>
                  <p className="text-xs text-gray-400">{f.city}</p>
                </div>
              ))}
            </div>
          )}
          <Link href="/admin/flagged" className="block text-center text-sm text-[#0C9B8A] font-medium mt-4 hover:underline">
            View all →
          </Link>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>🆕</span> Recent Registrations
          </h2>
          <div className="space-y-3">
            {stats.recentUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0">
                  {u.name[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{u.role}</span>
                  <p className="text-xs text-gray-400 mt-1">{timeAgo(u.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
