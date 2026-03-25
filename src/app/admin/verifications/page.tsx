'use client';

import { useEffect, useState } from 'react';

interface Verification {
  id: string;
  type: string;
  status: string;
  provider: string;
  providerRef: string | null;
  createdAt: string;
  verifiedAt: string | null;
  user: { id: string; name: string; email: string; role: string };
}

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchVerifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/verifications?status=${statusFilter}`);
      if (res.status === 403) { setError('Admin access required'); return; }
      const data = await res.json();
      setVerifications(data.verifications || []);
    } catch { setError('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVerifications(); }, [statusFilter]);

  const handleAction = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
    const reason = status === 'REJECTED' ? prompt('Reason for rejection (optional):') : undefined;
    if (status === 'REJECTED' && reason === null) return; // cancelled

    setActionLoading(id);
    try {
      const res = await fetch(`/api/verifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason: reason || undefined }),
      });
      if (res.ok) {
        setVerifications(prev => prev.filter(v => v.id !== id));
      }
    } finally { setActionLoading(null); }
  };

  const parseData = (ref: string | null) => {
    if (!ref) return null;
    try { return JSON.parse(ref); } catch { return null; }
  };

  if (error) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-center text-red-600 font-medium">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verification Queue</h1>
          <p className="text-gray-500 text-sm mt-1">Review and approve user verifications</p>
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="PENDING">Pending</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : verifications.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-2">✓</p>
          <p>No {statusFilter.toLowerCase()} verifications</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
          {verifications.map(v => {
            const data = parseData(v.providerRef);
            const isExpanded = expandedId === v.id;
            return (
              <div key={v.id}>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : v.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {v.type[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900">{v.user.name}</p>
                    <p className="text-xs text-gray-500">{v.user.email} · {v.user.role}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-teal-50 text-teal-700 shrink-0">
                    {v.type}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">
                    {new Date(v.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-gray-400 text-sm">{isExpanded ? '▲' : '▼'}</span>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-4 pt-0">
                    {data && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <p className="text-xs font-medium text-gray-500 mb-2">Submitted Data</p>
                        <dl className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(data).filter(([k]) => k !== 'adminReason').map(([k, val]) => (
                            <div key={k}>
                              <dt className="text-gray-400 text-xs">{k}</dt>
                              <dd className="text-gray-800 font-medium">{String(val)}</dd>
                            </div>
                          ))}
                        </dl>
                      </div>
                    )}
                    {statusFilter === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(v.id, 'VERIFIED')}
                          disabled={actionLoading === v.id}
                          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          {actionLoading === v.id ? '...' : '✓ Approve'}
                        </button>
                        <button
                          onClick={() => handleAction(v.id, 'REJECTED')}
                          disabled={actionLoading === v.id}
                          className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                          {actionLoading === v.id ? '...' : '✗ Reject'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
