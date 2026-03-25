'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import VerificationFlow from '@/components/trust/VerificationFlow';
import TrustScore from '@/components/trust/TrustScore';
import type { BadgeLevel } from '@/lib/trustScore';

interface UserData {
  id: string;
  verifications: { type: string; status: string }[];
  emailVerified: boolean;
  profile?: { rtbNumber?: string | null };
}

interface TrustData {
  total: number;
  badgeLevel: BadgeLevel;
}

interface VerificationRecord {
  id: string;
  type: string;
  status: string;
  createdAt: string;
}

type ModalType = 'email' | 'id' | 'property' | 'employment' | null;

export default function VerificationPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-12"><div className="h-96 bg-gray-100 rounded-2xl animate-pulse" /></div>}>
      <VerificationPageInner />
    </Suspense>
  );
}

function VerificationPageInner() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<UserData | null>(null);
  const [trust, setTrust] = useState<TrustData | null>(null);
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalType>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const emailJustVerified = searchParams.get('emailVerified') === 'true';
  const stripeVerified = searchParams.get('verified') === 'true';

  const loadData = async () => {
    try {
      const meRes = await fetch('/api/auth/me');
      const me = await meRes.json();
      if (!me?.id) { setLoading(false); return; }

      const [trustRes, vRes] = await Promise.all([
        fetch(`/api/users/${me.id}/trust`),
        fetch('/api/verifications'),
      ]);
      const trustData = await trustRes.json();
      const vData = await vRes.json();

      setUser({ ...me, verifications: vData });
      setVerifications(vData);
      setTrust(trustData);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (emailJustVerified) setMessage('Email verified successfully! 🎉');
    if (stripeVerified) setMessage('ID verification submitted! Stripe is processing your documents. 🎉');
    loadData();
  }, []);

  const submitVerification = async (type: string, data: Record<string, string>) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/verifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
      });
      if (res.ok) {
        setMessage(`${type} verification submitted! We'll review it shortly.`);
        setModal(null);
        await loadData();
      } else {
        const err = await res.json();
        setMessage(err.error || 'Submission failed');
      }
    } finally { setSubmitting(false); }
  };

  const sendEmailVerification = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/verify-email', { method: 'POST' });
      const data = await res.json();
      setMessage(data.message || data.error);
      setModal(null);
    } finally { setSubmitting(false); }
  };

  function getSteps() {
    if (!user) return [];
    const vMap = new Map(verifications.map(v => [v.type, v.status]));

    const stepStatus = (check: boolean, vType?: string): 'completed' | 'current' | 'pending' | 'rejected' => {
      if (check) return 'completed';
      if (vType) {
        const s = vMap.get(vType);
        if (s === 'REJECTED') return 'rejected';
        if (s === 'PENDING') return 'current';
      }
      return 'pending';
    };

    return [
      { id: 'email', label: 'Email Verification', description: 'Verify your email address to get started.', status: stepStatus(user.emailVerified) },
      { id: 'id', label: 'ID Verification', description: 'Verify your identity with Stripe Identity (passport, driving licence, or ID card + selfie).', status: stepStatus(vMap.get('ID') === 'VERIFIED', 'ID') },
      { id: 'property', label: 'Property Ownership', description: 'Provide property ownership documents for Gold badge.', status: stepStatus(vMap.get('PROPERTY') === 'VERIFIED', 'PROPERTY') },
      { id: 'employment', label: 'Employment Verification', description: 'Verify your employment details.', status: stepStatus(vMap.get('EMPLOYMENT') === 'VERIFIED', 'EMPLOYMENT') },
    ];
  }

  const handleStartVerification = async (stepId: string) => {
    if (stepId === 'id') {
      // Use Stripe Identity for ID verification
      setSubmitting(true);
      try {
        const res = await fetch('/api/verifications/stripe-session', { method: 'POST' });
        const data = await res.json();
        if (res.ok && data.url) {
          window.location.href = data.url;
          return;
        }
        setMessage(data.error || 'Failed to start ID verification');
      } catch {
        setMessage('Failed to start ID verification');
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setModal(stepId as ModalType);
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-12"><div className="h-96 bg-gray-100 rounded-2xl animate-pulse" /></div>;
  }

  if (!user) {
    return <div className="max-w-2xl mx-auto px-4 py-12 text-center"><p className="text-gray-500">Please log in to manage your verification.</p></div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gaff-slate">Verification Dashboard</h1>
        <p className="text-gray-500 mt-1">Build trust by verifying your identity and property.</p>
      </div>

      {message && (
        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-sm text-teal-800">
          {message}
          <button onClick={() => setMessage('')} className="ml-2 text-teal-600 hover:text-teal-800">✕</button>
        </div>
      )}

      {trust && (
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <TrustScore score={trust.total} badgeLevel={trust.badgeLevel} size="lg" />
        </div>
      )}

      <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="font-bold text-gaff-slate mb-4">Verification Steps</h2>
        <VerificationFlow steps={getSteps()} onStartVerification={handleStartVerification} />
      </div>

      <div className="p-4 bg-teal-50 rounded-xl border border-teal-100">
        <p className="text-sm text-gaff-teal font-medium">🛡️ Why verify?</p>
        <p className="text-sm text-gray-600 mt-1">
          Verified users get <strong>3x more enquiries</strong> on Gaff.ie. Tenants trust verified profiles
          and are more likely to respond to your listings.
        </p>
      </div>

      {/* Modals */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            {modal === 'email' && <EmailModal onSubmit={sendEmailVerification} submitting={submitting} />}
            {modal === 'id' && <IDModal onSubmit={data => submitVerification('ID', data)} submitting={submitting} />}
            {modal === 'property' && <PropertyModal onSubmit={data => submitVerification('PROPERTY', data)} submitting={submitting} />}
            {modal === 'employment' && <EmploymentModal onSubmit={data => submitVerification('EMPLOYMENT', data)} submitting={submitting} />}
            <button onClick={() => setModal(null)} className="mt-3 text-sm text-gray-500 hover:text-gray-700 w-full text-center">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmailModal({ onSubmit, submitting }: { onSubmit: () => void; submitting: boolean }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Email Verification</h3>
      <p className="text-sm text-gray-600 mb-4">We&apos;ll send a verification link to your registered email address.</p>
      <button onClick={onSubmit} disabled={submitting} className="w-full py-2 bg-gaff-teal text-white rounded-lg font-medium hover:bg-gaff-teal-dark disabled:opacity-50">
        {submitting ? 'Sending...' : 'Send Verification Email'}
      </button>
    </div>
  );
}

function IDModal({ onSubmit, submitting }: { onSubmit: (data: Record<string, string>) => void; submitting: boolean }) {
  const [form, setForm] = useState({ fullName: '', dateOfBirth: '', documentType: 'passport' });
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">ID Verification</h3>
      <div className="space-y-3">
        <input placeholder="Full Name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
        <input type="date" placeholder="Date of Birth" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
        <select value={form.documentType} onChange={e => setForm({ ...form, documentType: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
          <option value="passport">Passport</option>
          <option value="driving_licence">Driving Licence</option>
          <option value="national_id">National ID</option>
        </select>
        <button onClick={() => onSubmit(form)} disabled={submitting || !form.fullName || !form.dateOfBirth} className="w-full py-2 bg-gaff-teal text-white rounded-lg font-medium hover:bg-gaff-teal-dark disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Submit for Review'}
        </button>
      </div>
    </div>
  );
}

function PropertyModal({ onSubmit, submitting }: { onSubmit: (data: Record<string, string>) => void; submitting: boolean }) {
  const [form, setForm] = useState({ addressLine1: '', city: 'Dublin', county: 'Dublin', eircode: '', ownershipEvidence: 'deed' });
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Property Verification</h3>
      <div className="space-y-3">
        <input placeholder="Address Line 1" value={form.addressLine1} onChange={e => setForm({ ...form, addressLine1: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="City" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          <input placeholder="County" value={form.county} onChange={e => setForm({ ...form, county: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
        </div>
        <input placeholder="Eircode" value={form.eircode} onChange={e => setForm({ ...form, eircode: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
        <select value={form.ownershipEvidence} onChange={e => setForm({ ...form, ownershipEvidence: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm">
          <option value="deed">Property Deed</option>
          <option value="utility_bill">Utility Bill</option>
          <option value="mortgage_statement">Mortgage Statement</option>
        </select>
        <button onClick={() => onSubmit(form)} disabled={submitting || !form.addressLine1 || !form.eircode} className="w-full py-2 bg-gaff-teal text-white rounded-lg font-medium hover:bg-gaff-teal-dark disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Submit for Review'}
        </button>
      </div>
    </div>
  );
}

function EmploymentModal({ onSubmit, submitting }: { onSubmit: (data: Record<string, string>) => void; submitting: boolean }) {
  const [form, setForm] = useState({ employer: '', position: '', startDate: '' });
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Employment Verification</h3>
      <div className="space-y-3">
        <input placeholder="Employer" value={form.employer} onChange={e => setForm({ ...form, employer: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
        <input placeholder="Position" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
        <input type="date" placeholder="Start Date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full border rounded-lg px-3 py-2 text-sm" />
        <button onClick={() => onSubmit(form)} disabled={submitting || !form.employer || !form.position || !form.startDate} className="w-full py-2 bg-gaff-teal text-white rounded-lg font-medium hover:bg-gaff-teal-dark disabled:opacity-50">
          {submitting ? 'Submitting...' : 'Submit for Review'}
        </button>
      </div>
    </div>
  );
}
