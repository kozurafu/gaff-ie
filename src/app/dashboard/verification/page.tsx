'use client';

import { useEffect, useState } from 'react';
import VerificationFlow from '@/components/trust/VerificationFlow';
import TrustScore from '@/components/trust/TrustScore';
import type { BadgeLevel } from '@/lib/trustScore';

interface UserData {
  verifications: { type: string; status: string }[];
  emailVerified: boolean;
  profile?: { rtbNumber?: string | null };
}

interface TrustData {
  total: number;
  badgeLevel: BadgeLevel;
}

export default function VerificationPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [trust, setTrust] = useState<TrustData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
    ]).then(([me]) => {
      if (me?.id) {
        setUser(me);
        fetch(`/api/users/${me.id}/trust`).then(r => r.json()).then(setTrust);
      }
    }).finally(() => setLoading(false));
  }, []);

  function getSteps() {
    if (!user) return [];
    const vMap = new Map(user.verifications.map(v => [v.type, v.status]));

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
      {
        id: 'email',
        label: 'Email Verification',
        description: 'Verify your email address to get started. This is your Bronze badge.',
        status: stepStatus(user.emailVerified) as 'completed' | 'current' | 'pending' | 'rejected',
      },
      {
        id: 'id',
        label: 'ID Verification',
        description: 'Upload a valid photo ID (passport, driving licence) for Silver badge.',
        status: stepStatus(vMap.get('ID') === 'VERIFIED', 'ID'),
      },
      {
        id: 'property',
        label: 'Property Ownership',
        description: 'Provide property ownership documents for Gold badge.',
        status: stepStatus(vMap.get('PROPERTY') === 'VERIFIED', 'PROPERTY'),
      },
      {
        id: 'rtb',
        label: 'RTB Registration',
        description: 'Confirm your RTB registration number for Platinum badge — the highest trust level.',
        status: stepStatus(!!user.profile?.rtbNumber),
      },
    ];
  }

  const handleStartVerification = (stepId: string) => {
    // In production, this would open Stripe Identity, file upload, or RTB form
    alert(`Starting ${stepId} verification flow... (Integration pending)`);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500">Please log in to manage your verification.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gaff-slate">Verification Dashboard</h1>
        <p className="text-gray-500 mt-1">Build trust with tenants by verifying your identity and property.</p>
      </div>

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
          Verified landlords get <strong>3x more enquiries</strong> on Gaff.ie. Tenants trust verified profiles
          and are more likely to respond to your listings. Platinum landlords appear at the top of search results.
        </p>
      </div>
    </div>
  );
}
