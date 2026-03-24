'use client';

import { useState } from 'react';

interface WriteReviewProps {
  revieweeId: string;
  revieweeName: string;
  onSubmit?: () => void;
}

const CATEGORIES = [
  { key: 'communication', label: 'Communication' },
  { key: 'propertyCondition', label: 'Property Condition' },
  { key: 'fairness', label: 'Fairness' },
  { key: 'maintenance', label: 'Maintenance' },
];

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          className="focus:outline-none"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={i <= (hover || value) ? '#D97706' : '#E5E7EB'} stroke="none">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function WriteReview({ revieweeId, revieweeName, onSubmit }: WriteReviewProps) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState('');
  const [categories, setCategories] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select an overall rating'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revieweeId, rating, text, categories }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit review');
      }
      setSuccess(true);
      onSubmit?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
        <p className="text-green-700 font-semibold">✓ Review submitted successfully!</p>
        <p className="text-sm text-green-600 mt-1">Thank you for helping build trust on Gaff.ie</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-white border border-gray-100 rounded-xl">
      <h3 className="font-bold text-gaff-slate">Review {revieweeName}</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Overall Rating</label>
        <StarInput value={rating} onChange={setRating} />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Category Ratings</label>
        {CATEGORIES.map(cat => (
          <div key={cat.key} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{cat.label}</span>
            <StarInput value={categories[cat.key] || 0} onChange={v => setCategories(prev => ({ ...prev, [cat.key]: v }))} />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gaff-teal focus:border-transparent resize-none"
          placeholder="Share your experience..."
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 bg-gaff-teal text-white font-semibold rounded-lg hover:bg-gaff-teal-dark transition-colors disabled:opacity-50"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
