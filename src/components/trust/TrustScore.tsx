'use client';

import type { BadgeLevel } from '@/lib/trustScore';

interface TrustScoreProps {
  score: number;
  badgeLevel: BadgeLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const BADGE_CONFIG: Record<BadgeLevel, { label: string; color: string; bg: string; icon: string }> = {
  bronze: { label: 'Bronze', color: 'text-amber-700', bg: 'bg-amber-50', icon: '🛡️' },
  silver: { label: 'Silver', color: 'text-gray-600', bg: 'bg-gray-50', icon: '🛡️' },
  gold: { label: 'Gold', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '🛡️' },
  platinum: { label: 'Platinum', color: 'text-gaff-teal', bg: 'bg-teal-50', icon: '✅' },
};

function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-gaff-teal';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-500';
}

function ringColor(score: number): string {
  if (score >= 80) return 'stroke-green-500';
  if (score >= 60) return 'stroke-gaff-teal';
  if (score >= 40) return 'stroke-yellow-500';
  return 'stroke-red-500';
}

export default function TrustScore({ score, badgeLevel, size = 'md', showLabel = true }: TrustScoreProps) {
  const badge = BADGE_CONFIG[badgeLevel];
  const sizes = { sm: 48, md: 72, lg: 96 };
  const s = sizes[size];
  const r = (s - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const fontSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-lg';

  return (
    <div className="flex items-center gap-3">
      <div className="relative" style={{ width: s, height: s }}>
        <svg width={s} height={s} className="-rotate-90">
          <circle cx={s / 2} cy={s / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
          <circle
            cx={s / 2} cy={s / 2} r={r}
            fill="none"
            className={ringColor(score)}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center font-bold ${fontSize} ${scoreColor(score)}`}>
          {score}
        </span>
      </div>
      {showLabel && (
        <div>
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${badge.bg} ${badge.color}`}>
            {badge.icon} {badge.label}
          </span>
          <p className="text-xs text-gray-500 mt-0.5">Trust Score</p>
        </div>
      )}
    </div>
  );
}
