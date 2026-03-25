'use client';

import { useEffect, useState } from 'react';

interface FlaggedItem {
  id: string;
  listingId: string;
  riskScore: number;
  flags: { type: string; severity: string; detail: string }[];
  status: string;
  title: string;
  addressLine1: string;
  city: string;
  price: number;
  listingType: string;
  listingStatus: string;
  userName: string;
  userEmail: string;
  createdAt: string;
}

export default function AdminFlaggedPage() {
  const [items, setItems] = useState<FlaggedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/flagged').then(r => r.json()).then(d => {
      setItems(d.flagged || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleAction = async (flagId: string, action: 'APPROVED' | 'REMOVED') => {
    await fetch('/api/admin/flagged', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ flagId, action }),
    });
    setItems(prev => prev.map(i => i.id === flagId ? { ...i, status: action } : i));
  };

  const severityColor = (s: string) => s === 'high' ? 'text-red-600 bg-red-50' : s === 'medium' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50';

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gaff-slate mb-6">Flagged Listings</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">No flagged listings.</p>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gaff-slate truncate">{item.title}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.riskScore > 70 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      Risk: {item.riskScore}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === 'PENDING' ? 'bg-gray-100 text-gray-600' : item.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{item.addressLine1}, {item.city} · €{item.price}/{item.listingType === 'RENT' ? 'mo' : ''} · by {item.userName}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(Array.isArray(item.flags) ? item.flags : []).map((f, i) => (
                      <span key={i} className={`text-xs px-2 py-1 rounded-md font-medium ${severityColor(f.severity)}`}>
                        {f.type}: {f.detail}
                      </span>
                    ))}
                  </div>
                </div>
                {item.status === 'PENDING' && (
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleAction(item.id, 'APPROVED')} className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded-lg hover:bg-green-600">Approve</button>
                    <button onClick={() => handleAction(item.id, 'REMOVED')} className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600">Remove</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
