'use client';

import { useState } from 'react';
import VerifiedBadge from './VerifiedBadge';

interface ListingCardProps {
  image: string;
  price: number;
  priceFrequency?: 'month' | 'total';
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  address: string;
  area: string;
  verified?: boolean;
  hapWelcome?: boolean;
  petsAllowed?: boolean;
  parkingIncluded?: boolean;
  timeAgo: string;
  propertyType: string;
  createdAt?: string;
}

function getFreshnessBadge(createdAt?: string): { label: string; className: string } | null {
  if (!createdAt) return null;
  const now = Date.now();
  const created = new Date(createdAt).getTime();
  const daysSince = (now - created) / (1000 * 60 * 60 * 24);
  if (daysSince < 3) return { label: '✨ New', className: 'bg-emerald-500 text-white' };
  if (daysSince > 14) {
    const weeks = Math.floor(daysSince / 7);
    return { label: `Listed ${weeks} week${weeks !== 1 ? 's' : ''} ago`, className: 'bg-amber-100 text-amber-700' };
  }
  return null;
}

const typeGradients: Record<string, string> = {
  Apartment: 'from-gaff-teal/80 via-gaff-teal-dark/60 to-gaff-slate/70',
  House: 'from-emerald-600/70 via-teal-700/60 to-gaff-slate/70',
  Studio: 'from-violet-600/70 via-indigo-600/60 to-gaff-slate/70',
  'Room Share': 'from-amber-600/70 via-orange-600/60 to-gaff-slate/70',
  Duplex: 'from-cyan-600/70 via-blue-600/60 to-gaff-slate/70',
};

const typeIcons: Record<string, React.ReactNode> = {
  Apartment: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-white/20">
      <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01" />
    </svg>
  ),
  House: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-white/20">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Studio: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-white/20">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
    </svg>
  ),
  default: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="text-white/20">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
  ),
};

export default function ListingCard({
  price,
  priceFrequency = 'month',
  bedrooms,
  bathrooms,
  sqft,
  address,
  area,
  verified = false,
  hapWelcome = false,
  petsAllowed = false,
  parkingIncluded = false,
  timeAgo,
  propertyType,
  createdAt,
}: ListingCardProps) {
  const [saved, setSaved] = useState(false);

  const gradient = typeGradients[propertyType] || typeGradients.Apartment;
  const icon = typeIcons[propertyType] || typeIcons.default;
  const freshness = getFreshnessBadge(createdAt);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300 shadow-card border border-gray-100/80">
      {/* Image placeholder with gradient */}
      <div className={`relative aspect-[4/3] bg-gradient-to-br ${gradient} overflow-hidden`}>
        {/* Decorative icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
        {/* Mesh overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.1),transparent_60%)]" />

        {/* Price badge */}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-gaff-slate font-bold text-lg px-3 py-1 rounded-xl shadow-sm">
          €{price.toLocaleString()}
          {priceFrequency === 'month' && (
            <span className="text-xs font-normal text-gray-400">/mo</span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={() => setSaved(!saved)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white hover:scale-110 transition-all"
          aria-label={saved ? 'Remove from saved' : 'Save property'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? '#EF4444' : 'none'} stroke={saved ? '#EF4444' : '#6B7280'} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>

        {/* Property type badge */}
        <span className="absolute top-3 left-3 text-xs font-semibold bg-white/90 backdrop-blur-sm text-gaff-slate px-2.5 py-1 rounded-full">
          {propertyType}
        </span>

        {/* Freshness badge */}
        {freshness && (
          <span className={`absolute top-3 left-3 mt-8 text-xs font-semibold px-2.5 py-1 rounded-full ${freshness.className}`}>
            {freshness.label}
          </span>
        )}

        {/* Time badge */}
        <span className="absolute bottom-3 left-3 text-xs font-medium bg-black/50 text-white/90 px-2.5 py-1 rounded-full backdrop-blur-sm">
          {timeAgo}
        </span>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-gaff-slate text-base mb-1 truncate group-hover:text-gaff-teal transition-colors">{address}</h3>
        <p className="text-gray-400 text-sm mb-4">{area}</p>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-sm text-gaff-slate-600 mb-4">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            {bedrooms} bed{bedrooms !== 1 && 's'}
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 12h16a1 1 0 011 1v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a1 1 0 011-1z" /><path d="M6 12V5a2 2 0 012-2h3v2.25A1.75 1.75 0 0012.75 7h1.5A1.75 1.75 0 0016 5.25V3h0a2 2 0 012 2v7" /></svg>
            {bathrooms} bath{bathrooms !== 1 && 's'}
          </span>
          {sqft && (
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
              {sqft} ft²
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {verified && (
            <VerifiedBadge type="landlord" size="sm" />
          )}
          {hapWelcome && (
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
              HAP
            </span>
          )}
          {petsAllowed && (
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 gap-1">
              🐾 Pets OK
            </span>
          )}
          {parkingIncluded && (
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 gap-1">
              🅿️ Parking
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
