'use client';

import { useEffect, useState } from 'react';

interface RecommendedListing {
  id: string;
  title: string;
  price: number;
  city: string;
  bedrooms: number;
  bathrooms: number;
  hapAccepted: boolean;
  petsAllowed: boolean;
  matchScore: number;
  images: { url: string }[];
}

export default function RecommendedListings() {
  const [listings, setListings] = useState<RecommendedListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/listings/recommended')
      .then(r => r.json())
      .then(data => setListings(data.listings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-gaff-slate flex items-center gap-2">
          ✨ Recommended for You
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (listings.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gaff-slate flex items-center gap-2">
        ✨ Recommended for You
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map(listing => (
          <a
            key={listing.id}
            href={`/listings/${listing.id}`}
            className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-[4/3] bg-gray-100">
              {listing.images[0] && (
                <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              )}
              <span className="absolute top-3 right-3 bg-gaff-teal text-white text-xs font-bold px-2 py-1 rounded-full">
                {listing.matchScore}% match
              </span>
            </div>
            <div className="p-4">
              <p className="text-lg font-bold text-gaff-slate">€{(listing.price / 100).toLocaleString()}<span className="text-sm font-normal text-gray-500">/mo</span></p>
              <p className="text-sm font-medium text-gaff-slate truncate">{listing.title}</p>
              <p className="text-xs text-gray-500">{listing.city} · {listing.bedrooms} bed · {listing.bathrooms} bath</p>
              <div className="flex gap-2 mt-2">
                {listing.hapAccepted && <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium">HAP ✓</span>}
                {listing.petsAllowed && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">Pets OK</span>}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
