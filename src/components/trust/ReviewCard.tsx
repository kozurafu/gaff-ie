'use client';

interface ReviewCardProps {
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number;
  categories?: Record<string, number>;
  text?: string;
  createdAt: string;
}

function Stars({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < rating ? '#D97706' : '#E5E7EB'} stroke="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  communication: 'Communication',
  propertyCondition: 'Property Condition',
  fairness: 'Fairness',
  maintenance: 'Maintenance',
  responsiveness: 'Responsiveness',
};

export default function ReviewCard({ reviewerName, reviewerAvatar, rating, categories, text, createdAt }: ReviewCardProps) {
  return (
    <div className="p-4 bg-white border border-gray-100 rounded-xl space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gaff-teal/10 flex items-center justify-center text-gaff-teal font-bold text-sm shrink-0">
          {reviewerAvatar ? (
            <img src={reviewerAvatar} alt="" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            reviewerName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gaff-slate">{reviewerName}</p>
          <p className="text-xs text-gray-400">{new Date(createdAt).toLocaleDateString('en-IE', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
        </div>
        <Stars rating={rating} />
      </div>

      {categories && Object.keys(categories).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(categories).map(([key, value]) => (
            <span key={key} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-full">
              {CATEGORY_LABELS[key] || key}: {value}/5
            </span>
          ))}
        </div>
      )}

      {text && <p className="text-sm text-gray-700 leading-relaxed">{text}</p>}
    </div>
  );
}
