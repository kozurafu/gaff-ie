'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReviewCard from '@/components/trust/ReviewCard';
import TrustScore from '@/components/trust/TrustScore';
import type { BadgeLevel } from '@/lib/trustScore';

interface Review {
  id: string;
  rating: number;
  text?: string;
  categories?: Record<string, number>;
  createdAt: string;
  reviewer: { name: string; avatar?: string };
}

export default function UserReviewsPage() {
  const { userId } = useParams<{ userId: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avg, setAvg] = useState(0);
  const [trust, setTrust] = useState<{ total: number; badgeLevel: BadgeLevel } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      fetch(`/api/reviews?userId=${userId}`).then(r => r.json()),
      fetch(`/api/users/${userId}/trust`).then(r => r.json()),
    ]).then(([reviewData, trustData]) => {
      setReviews(reviewData.reviews || []);
      setAvg(reviewData.averageRating || 0);
      setTrust(trustData);
    }).finally(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-12"><div className="h-96 bg-gray-100 rounded-2xl animate-pulse" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gaff-slate">Reviews</h1>
          <p className="text-gray-500">{reviews.length} review{reviews.length !== 1 && 's'} · {avg} avg rating</p>
        </div>
        {trust && <TrustScore score={trust.total} badgeLevel={trust.badgeLevel} size="md" />}
      </div>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No reviews yet.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => (
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
        </div>
      )}
    </div>
  );
}
