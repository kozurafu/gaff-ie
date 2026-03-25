'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ListingCard from '@/components/ui/ListingCard';

interface AgencyMember {
  userId: string;
  role: string;
  joinedAt: string;
  user: { id: string; name: string; email: string; avatar?: string; role: string; createdAt: string };
}

interface AgencyListing {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  addressLine1: string;
  city: string;
  county: string;
  propertyType: string;
  listingType: string;
  status: string;
  createdAt: string;
  images?: { url: string }[];
}

interface Agency {
  id: string;
  name: string;
  logo?: string;
  description?: string;
  website?: string;
  phone?: string;
  plan: string;
  createdAt: string;
  members: AgencyMember[];
  listings: AgencyListing[];
  avgRating: number | null;
  reviewCount: number;
  listingCount: number;
}

export default function AgencyProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/agencies/${id}`)
      .then(r => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then(data => { if (data) setAgency(data.agency); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-48 bg-gray-200 rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !agency) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🏢</div>
        <h1 className="text-2xl font-bold text-[#1E293B] mb-2">Agency not found</h1>
        <p className="text-gray-500 mb-6">This agency doesn&apos;t exist or has been removed.</p>
        <a href="/" className="text-[#0C9B8A] font-semibold hover:underline">← Back to Home</a>
      </div>
    );
  }

  const memberSince = new Date(agency.createdAt).toLocaleDateString('en-IE', { month: 'long', year: 'numeric' });

  return (
    <>
      {/* Header */}
      <div className="bg-[#1E293B] text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-5">
            {agency.logo ? (
              <img src={agency.logo} alt={agency.name} className="w-20 h-20 rounded-xl object-cover border-2 border-white/20" />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#0C9B8A] to-[#0C9B8A]/70 flex items-center justify-center text-3xl font-bold text-white">
                {agency.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{agency.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-300">
                <span>🏢 Agency since {memberSince}</span>
                {agency.avgRating && (
                  <span>⭐ {agency.avgRating} ({agency.reviewCount} review{agency.reviewCount !== 1 ? 's' : ''})</span>
                )}
                <span>📋 {agency.listingCount} active listing{agency.listingCount !== 1 ? 's' : ''}</span>
              </div>
              {agency.website && (
                <a href={agency.website} target="_blank" rel="noopener noreferrer" className="text-sm text-[#0C9B8A] hover:underline mt-1 inline-block">
                  {agency.website.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Description */}
        {agency.description && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-8">
            <h2 className="text-lg font-bold text-[#1E293B] mb-2">About</h2>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{agency.description}</p>
          </div>
        )}

        {/* Contact info */}
        {agency.phone && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm mb-8">
            <h2 className="text-lg font-bold text-[#1E293B] mb-2">Contact</h2>
            <p className="text-sm text-gray-600">📞 {agency.phone}</p>
            {agency.website && <p className="text-sm text-gray-600 mt-1">🌐 <a href={agency.website} target="_blank" rel="noopener noreferrer" className="text-[#0C9B8A] hover:underline">{agency.website}</a></p>}
          </div>
        )}

        {/* Team members */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#1E293B] mb-4">👥 Team ({agency.members.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {agency.members.map(m => (
              <a key={m.userId} href={`/user/${m.userId}`} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:border-[#0C9B8A]/30 transition-colors">
                <div className="flex items-center gap-3">
                  {m.user.avatar ? (
                    <img src={m.user.avatar} alt={m.user.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0C9B8A] to-[#0C9B8A]/70 flex items-center justify-center text-white font-bold">
                      {m.user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-[#1E293B] text-sm">{m.user.name}</p>
                    <p className="text-xs text-gray-500">{m.role === 'OWNER' ? '👑 Owner' : 'Member'}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Listings */}
        <h2 className="text-xl font-bold text-[#1E293B] mb-4">📋 Active Listings ({agency.listings.length})</h2>
        {agency.listings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <div className="text-3xl mb-2">🏠</div>
            <p className="text-gray-500 text-sm">No active listings at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {agency.listings.map(l => {
              const daysSince = (Date.now() - new Date(l.createdAt).getTime()) / (1000 * 60 * 60 * 24);
              const timeAgo = daysSince < 1 ? 'Today' : daysSince < 2 ? 'Yesterday' : daysSince < 7 ? `${Math.floor(daysSince)} days ago` : daysSince < 30 ? `${Math.floor(daysSince / 7)} weeks ago` : `${Math.floor(daysSince / 30)} months ago`;
              return (
                <a key={l.id} href={`/listing/${l.id}`}>
                  <ListingCard
                    image={l.images?.[0]?.url ?? ''}
                    price={l.price}
                    bedrooms={l.bedrooms}
                    bathrooms={l.bathrooms}
                    sqft={l.sqft}
                    address={l.addressLine1}
                    area={l.city}
                    propertyType={l.propertyType}
                    timeAgo={timeAgo}
                    createdAt={l.createdAt}
                  />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
