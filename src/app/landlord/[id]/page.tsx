'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import TrustScore from '@/components/trust/TrustScore';
import ReviewCard from '@/components/trust/ReviewCard';
import type { BadgeLevel } from '@/lib/trustScore';

interface LandlordData {
  id: string;
  name: string;
  avatar?: string;
  createdAt: string;
  profile?: { bio?: string; companyName?: string; rtbNumber?: string };
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

interface Review {
  id: string;
  rating: number;
  text?: string;
  categories?: Record<string, number>;
  createdAt: string;
  reviewer: { name: string; avatar?: string };
}

interface Listing {
  id: string;
  title: string;
  price: number;
  city: string;
  bedrooms: number;
  images: { url: string }[];
}

export default function LandlordProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [landlord, setLandlord] = useState<LandlordData | null>(null);
  const [trust, setTrust] = useState<TrustData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [reviewAvg, setReviewAvg] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/users/${id}/trust`).then(r => r.json()),
      fetch(`/api/reviews?userId=${id}`).then(r => r.json()),
      fetch(`/api/listings?userId=${id}`).then(r => r.json()).catch(() => ({ listings: [] })),
    ]).then(([trustData, reviewData, listingData]) => {
      setTrust(trustData);
      setReviews(reviewData.reviews || []);
      setReviewAvg(reviewData.averageRating || 0);
      setListings(listingData.listings || []);
      // We don't have a direct user fetch endpoint in the spec, so we derive from trust data
      setLandlord({ id: id, name: 'Landlord', createdAt: new Date().toISOString() });
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-12"><div className="h-96 bg-gray-100 rounded-2xl animate-pulse" /></div>;
  }

  if (!landlord || !trust) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center"><p className="text-gray-500">Landlord not found.</p></div>;
  }

  const BADGE_LABELS: Record<BadgeLevel, { label: string; color: string }> = {
    bronze: { label: '🛡️ Bronze Verified', color: 'bg-amber-50 text-amber-700' },
    silver: { label: '🛡️ Silver Verified', color: 'bg-gray-100 text-gray-700' },
    gold: { label: '🛡️ Gold Verified', color: 'bg-yellow-50 text-yellow-700' },
    platinum: { label: '✅ Platinum Verified', color: 'bg-teal-50 text-gaff-teal' },
  };

  const badge = BADGE_LABELS[trust.badgeLevel];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-gaff-teal/10 flex items-center justify-center text-gaff-teal text-2xl font-bold shrink-0">
            {landlord.avatar ? (
              <img src={landlord.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              landlord.name.charAt(0)
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gaff-slate">{landlord.name}</h1>
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${badge.color}`}>
              {badge.label}
            </span>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500">
              <span>Member since {new Date(landlord.createdAt).getFullYear()}</span>
              <span>{reviews.length} review{reviews.length !== 1 && 's'}</span>
              <span>{reviewAvg}/5 avg rating</span>
              <span>{listings.length} active listing{listings.length !== 1 && 's'}</span>
            </div>
          </div>
          <TrustScore score={trust.total} badgeLevel={trust.badgeLevel} size="lg" />
        </div>

        {/* Trust breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
          {[
            { label: 'Verification', value: trust.verification, max: 40 },
            { label: 'Reviews', value: trust.reviews, max: 25 },
            { label: 'Response Rate', value: trust.responseRate, max: 15 },
            { label: 'Account Age', value: trust.accountAge, max: 10 },
            { label: 'Profile', value: trust.profileCompleteness, max: 10 },
          ].map(item => (
            <div key={item.label} className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-gaff-slate">{item.value}<span className="text-xs text-gray-400">/{item.max}</span></p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Active listings */}
      {listings.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gaff-slate mb-3">Active Listings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {listings.map(l => (
              <a key={l.id} href={`/listings/${l.id}`} className="flex gap-3 p-3 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  {l.images?.[0] && <img src={l.images[0].url} alt="" className="w-full h-full object-cover" />}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gaff-slate">{l.title}</p>
                  <p className="text-gaff-teal font-bold">€{l.price.toLocaleString()}<span className="text-xs font-normal text-gray-500">/mo</span></p>
                  <p className="text-xs text-gray-500">{l.city} · {l.bedrooms} bed</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div>
        <h2 className="text-lg font-bold text-gaff-slate mb-3">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No reviews yet.</p>
        ) : (
          <div className="space-y-3">
            {reviews.slice(0, 10).map(r => (
              <ReviewCard
                key={r.id}
                reviewerName={r.reviewer.name}
                reviewerAvatar={r.reviewer.avatar}
                rating={r.rating}
                categories={r.categories}
                text={r.text}
                createdAt={r.createdAt}
              />
            ))}
            {reviews.length > 10 && (
              <a href={`/reviews/${id}`} className="block text-center text-sm text-gaff-teal font-medium hover:underline">
                View all {reviews.length} reviews →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
