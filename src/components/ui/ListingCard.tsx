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
  timeAgo: string;
  propertyType: string;
}

export default function ListingCard({
  image,
  price,
  priceFrequency = 'month',
  bedrooms,
  bathrooms,
  sqft,
  address,
  area,
  verified = false,
  hapWelcome = false,
  timeAgo,
  propertyType,
}: ListingCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={address}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Save button */}
        <button
          onClick={() => setSaved(!saved)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          aria-label={saved ? 'Remove from saved' : 'Save property'}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={saved ? '#EF4444' : 'none'}
            stroke={saved ? '#EF4444' : '#6B7280'}
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </button>
        {/* Time badge */}
        <span className="absolute bottom-3 left-3 text-xs font-medium bg-black/60 text-white px-2.5 py-1 rounded-full backdrop-blur-sm">
          {timeAgo}
        </span>
        {/* Property type */}
        <span className="absolute top-3 left-3 text-xs font-semibold bg-teal-primary text-white px-2.5 py-1 rounded-full">
          {propertyType}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xl font-bold text-slate-dark">
            €{price.toLocaleString()}
            {priceFrequency === 'month' && (
              <span className="text-sm font-normal text-gray-500">/mo</span>
            )}
          </span>
        </div>

        {/* Address */}
        <h3 className="font-semibold text-slate-dark text-sm mb-1 truncate">{address}</h3>
        <p className="text-gray-500 text-xs mb-3">{area}</p>

        {/* Badges row */}
        <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            {bedrooms} bed{bedrooms !== 1 && 's'}
          </span>
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12h16a1 1 0 011 1v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a1 1 0 011-1z" />
              <path d="M6 12V5a2 2 0 012-2h3v2.25A1.75 1.75 0 0012.75 7h1.5A1.75 1.75 0 0016 5.25V3h0a2 2 0 012 2v7" />
            </svg>
            {bathrooms} bath{bathrooms !== 1 && 's'}
          </span>
          {sqft && (
            <span className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              {sqft} ft²
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {verified && <VerifiedBadge type="landlord" size="sm" />}
          {hapWelcome && (
            <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
              HAP Welcome
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
