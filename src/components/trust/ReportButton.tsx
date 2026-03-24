'use client';

import { useState } from 'react';

interface ReportButtonProps {
  listingId: string;
}

const REASONS = [
  { value: 'SCAM', label: 'Scam / Fraud' },
  { value: 'FAKE_LISTING', label: 'Fake Listing' },
  { value: 'MISLEADING', label: 'Misleading Information' },
  { value: 'INAPPROPRIATE', label: 'Inappropriate Content' },
  { value: 'DUPLICATE', label: 'Duplicate Listing' },
  { value: 'DISCRIMINATION', label: 'Discrimination' },
  { value: 'OTHER', label: 'Other' },
];

export default function ReportButton({ listingId }: ReportButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    setSubmitting(true);
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, reason, description }),
      });
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
        Report
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => !submitting && setOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            {done ? (
              <div className="text-center py-4">
                <p className="text-green-600 font-semibold text-lg">Report Submitted</p>
                <p className="text-sm text-gray-500 mt-1">We&apos;ll review this listing promptly.</p>
                <button onClick={() => { setOpen(false); setDone(false); }} className="mt-4 text-sm text-gaff-teal font-medium">Close</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-bold text-gaff-slate text-lg">Report Listing</h3>
                <p className="text-sm text-gray-500">Help us keep Gaff.ie safe. Select a reason below.</p>

                <div className="space-y-2">
                  {REASONS.map(r => (
                    <label key={r.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${reason === r.value ? 'border-gaff-teal bg-teal-50' : 'border-gray-100 hover:border-gray-200'}`}>
                      <input type="radio" name="reason" value={r.value} checked={reason === r.value} onChange={() => setReason(r.value)} className="accent-gaff-teal" />
                      <span className="text-sm font-medium text-gaff-slate">{r.label}</span>
                    </label>
                  ))}
                </div>

                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Additional details (optional)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gaff-teal focus:border-transparent resize-none"
                />

                <div className="flex gap-3">
                  <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={!reason || submitting} className="flex-1 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 disabled:opacity-50">
                    {submitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
