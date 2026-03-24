'use client';

import { useEffect, useState } from 'react';
import ReviewCard from '@/components/trust/ReviewCard';
import WriteReview from '@/components/trust/WriteReview';

interface Review {
  id: string;
  rating: number;
  text?: string;
  categories?: Record<string, number>;
  createdAt: string;
  reviewer: { name: string; avatar?: string };
}

export default function DashboardReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [writeMode, setWriteMode] = useState(false);
  const [revieweeId, setRevieweeId] = useState('');

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(me => {
      if (me?.id) {
        setUserId(me.id);
        fetch(`/api/reviews?userId=${me.id}`).then(r => r.json()).then(data => {
          setReviews(data.reviews || []);
        });
      }
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-2xl mx-auto px-4 py-12"><div className="h-64 bg-gray-100 rounded-2xl animate-pulse" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gaff-slate">My Reviews</h1>
          <p className="text-gray-500">{reviews.length} review{reviews.length !== 1 && 's'} received</p>
        </div>
        <button
          onClick={() => setWriteMode(!writeMode)}
          className="px-4 py-2 bg-gaff-teal text-white text-sm font-medium rounded-lg hover:bg-gaff-teal-dark transition-colors"
        >
          {writeMode ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {writeMode && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Enter user ID to review"
            value={revieweeId}
            onChange={e => setRevieweeId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gaff-teal"
          />
          {revieweeId && (
            <WriteReview
              revieweeId={revieweeId}
              revieweeName="User"
              onSubmit={() => { setWriteMode(false); window.location.reload(); }}
            />
          )}
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-center text-gray-400 py-12">No reviews received yet.</p>
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

      <a href={`/reviews/${userId}`} className="block text-center text-sm text-gaff-teal font-medium hover:underline">
        View my public review page →
      </a>
    </div>
  );
}
