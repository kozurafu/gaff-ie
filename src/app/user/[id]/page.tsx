'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import TrustScore from '@/components/trust/TrustScore';
import type { BadgeLevel } from '@/lib/trustScore';

interface ProfileUser {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  profile?: { bio?: string; companyName?: string; rtbNumber?: string };
  verifications: string[];
  listings: {
    id: string;
    title: string;
    price: number;
    city: string;
    bedrooms: number;
    propertyType: string;
    listingType: string;
    images: { url: string }[];
  }[];
  reviewCount: number;
  avgRating: number;
  tenantPreference?: {
    preferredAreas: string[];
    budgetMin?: number;
    budgetMax?: number;
    bedroomsMin?: number;
    propertyTypes: string[];
    listingType: string;
    hapRequired: boolean;
  };
}

interface TrustData {
  total: number;
  badgeLevel: BadgeLevel;
  verification: number;
  reviews: number;
  responseRate: number;
  accountAge: number;
  profileCompleteness: number;
}

const BADGE_LABELS: Record<BadgeLevel, { label: string; color: string }> = {
  bronze: { label: '🛡️ Bronze Verified', color: 'bg-amber-50 text-amber-700' },
  silver: { label: '🛡️ Silver Verified', color: 'bg-gray-100 text-gray-700' },
  gold: { label: '🛡️ Gold Verified', color: 'bg-yellow-50 text-yellow-700' },
  platinum: { label: '✅ Platinum Verified', color: 'bg-teal-50 text-[#0C9B8A]' },
};

const ROLE_LABELS: Record<string, string> = {
  TENANT: 'Tenant',
  LANDLORD: 'Landlord',
  AGENT: 'Agent',
  ADMIN: 'Admin',
};

const VERIFICATION_LABELS: Record<string, string> = {
  ID: '🪪 ID Verified',
  PROPERTY: '🏠 Property Verified',
  EMPLOYMENT: '💼 Employment Verified',
  STUDENT: '🎓 Student Verified',
};

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [trust, setTrust] = useState<TrustData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d?.user) setCurrentUserId(d.user.id); })
      .catch(() => {});

    Promise.all([
      fetch(`/api/users/${id}/profile`).then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/users/${id}/trust`).then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/users/${id}/response-time`).then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([profileData, trustData, rtData]) => {
        if (profileData?.user) setUser(profileData.user);
        if (trustData) setTrust(trustData);
        if (rtData?.label) setResponseTime(rtData.label);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="text-4xl mb-3">😕</div>
        <h1 className="text-xl font-bold text-[#1E293B] mb-2">User not found</h1>
        <p className="text-gray-500 mb-4">This profile doesn&apos;t exist or has been removed.</p>
        <a href="/" className="text-[#0C9B8A] font-semibold hover:underline">← Back to home</a>
      </div>
    );
  }

  const badge = trust ? BADGE_LABELS[trust.badgeLevel] : null;
  const isOwnProfile = currentUserId === user.id;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header Card */}
      <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-[#0C9B8A]/10 flex items-center justify-center text-[#0C9B8A] text-2xl font-bold shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#1E293B]">{user.name}</h1>
              {isOwnProfile && (
                <a href="/dashboard/profile" className="text-xs font-medium text-[#0C9B8A] hover:underline">Edit profile</a>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">{ROLE_LABELS[user.role] || user.role}</span>
              {badge && (
                <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${badge.color}`}>
                  {badge.label}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              <span>Member since {new Date(user.createdAt).toLocaleDateString('en-IE', { month: 'long', year: 'numeric' })}</span>
              {user.reviewCount > 0 && <span>{user.avgRating}/5 avg · {user.reviewCount} review{user.reviewCount !== 1 ? 's' : ''}</span>}
              {(user.role === 'LANDLORD' || user.role === 'AGENT') && (
                <span>{user.listings.length} active listing{user.listings.length !== 1 ? 's' : ''}</span>
              )}
            </div>
            {responseTime && (user.role === 'LANDLORD' || user.role === 'AGENT') && (
              <p className="text-sm text-[#0C9B8A] mt-1 flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                {responseTime}
              </p>
            )}
          </div>
          {trust && <TrustScore score={trust.total} badgeLevel={trust.badgeLevel} size="lg" />}
        </div>

        {/* Verification badges */}
        {user.verifications.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {user.verifications.map((v) => (
              <span key={v} className="text-xs font-medium bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                {VERIFICATION_LABELS[v] || v}
              </span>
            ))}
            {user.emailVerified && (
              <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">
                ✉️ Email Verified
              </span>
            )}
          </div>
        )}

        {/* Trust breakdown */}
        {trust && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
            {[
              { label: 'Verification', value: trust.verification, max: 40 },
              { label: 'Reviews', value: trust.reviews, max: 25 },
              { label: 'Response Rate', value: trust.responseRate, max: 15 },
              { label: 'Account Age', value: trust.accountAge, max: 10 },
              { label: 'Profile', value: trust.profileCompleteness, max: 10 },
            ].map((item) => (
              <div key={item.label} className="text-center p-2 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold text-[#1E293B]">
                  {item.value}<span className="text-xs text-gray-400">/{item.max}</span>
                </p>
                <p className="text-xs text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bio */}
      {user.profile?.bio && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#1E293B] mb-2">About</h2>
          <p className="text-gray-600 text-sm whitespace-pre-line">{user.profile.bio}</p>
        </div>
      )}

      {/* Company info for landlords */}
      {user.profile?.companyName && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#1E293B] mb-2">Company</h2>
          <p className="text-gray-600 text-sm">{user.profile.companyName}</p>
          {user.profile.rtbNumber && (
            <p className="text-xs text-gray-400 mt-1">RTB: {user.profile.rtbNumber}</p>
          )}
        </div>
      )}

      {/* Tenant preferences summary */}
      {user.role === 'TENANT' && user.tenantPreference && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#1E293B] mb-3">Looking For</h2>
          <div className="flex flex-wrap gap-2">
            {user.tenantPreference.preferredAreas.length > 0 && (
              <span className="text-xs bg-[#0C9B8A]/10 text-[#0C9B8A] font-medium px-2.5 py-1 rounded-full">
                📍 {user.tenantPreference.preferredAreas.join(', ')}
              </span>
            )}
            {(user.tenantPreference.budgetMin || user.tenantPreference.budgetMax) && (
              <span className="text-xs bg-[#0C9B8A]/10 text-[#0C9B8A] font-medium px-2.5 py-1 rounded-full">
                💰 €{user.tenantPreference.budgetMin ?? 0} – €{user.tenantPreference.budgetMax ?? '∞'}
              </span>
            )}
            {user.tenantPreference.bedroomsMin && (
              <span className="text-xs bg-[#0C9B8A]/10 text-[#0C9B8A] font-medium px-2.5 py-1 rounded-full">
                🛏 {user.tenantPreference.bedroomsMin}+ beds
              </span>
            )}
            {user.tenantPreference.propertyTypes.length > 0 && (
              <span className="text-xs bg-[#0C9B8A]/10 text-[#0C9B8A] font-medium px-2.5 py-1 rounded-full">
                🏠 {user.tenantPreference.propertyTypes.join(', ')}
              </span>
            )}
            {user.tenantPreference.hapRequired && (
              <span className="text-xs bg-[#0C9B8A]/10 text-[#0C9B8A] font-medium px-2.5 py-1 rounded-full">
                HAP Required
              </span>
            )}
          </div>
        </div>
      )}

      {/* Active listings for landlords/agents */}
      {(user.role === 'LANDLORD' || user.role === 'AGENT') && user.listings.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-[#1E293B] mb-3">Active Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.listings.map((l) => {
              const isRent = l.listingType === 'RENT' || l.listingType === 'SHARE';
              return (
                <a
                  key={l.id}
                  href={`/listing/${l.id}`}
                  className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    {l.images?.[0] && (
                      <img src={l.images[0].url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[#1E293B]">{l.title}</p>
                    <p className="text-[#0C9B8A] font-bold">
                      €{l.price.toLocaleString()}
                      {isRent && <span className="text-xs font-normal text-gray-500">/mo</span>}
                    </p>
                    <p className="text-xs text-gray-500">
                      {l.city} · {l.bedrooms} bed{l.bedrooms !== 1 ? 's' : ''}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
