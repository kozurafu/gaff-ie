'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import VerifiedBadge from '@/components/ui/VerifiedBadge';
import ListingCard from '@/components/ui/ListingCard';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  listingType: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  address: string;
  area: string;
  eircode?: string;
  berRating?: string;
  features?: string[];
  images?: string[];
  furnished?: boolean;
  hapAccepted?: boolean;
  petsAllowed?: boolean;
  parking?: boolean;
  availableFrom?: string;
  verified?: boolean;
  landlord?: { id: string; name: string; verified: boolean; joinedDate?: string; listingsCount?: number };
  createdAt?: string;
}

interface SimilarListing {
  id: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  address: string;
  area: string;
  images?: string[];
  verified?: boolean;
  hapWelcome?: boolean;
  propertyType: string;
  createdAt?: string;
}

export default function ListingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [listing, setListing] = useState<Listing | null>(null);
  const [similar, setSimilar] = useState<SimilarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then((data) => {
        setListing(data.listing ?? data);
        setSimilar(data.similar ?? []);
      })
      .catch(() => setError('Listing not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="aspect-[2/1] bg-gray-100 rounded-xl" />
          <div className="flex gap-2">
            {[1,2,3,4].map(i => <div key={i} className="w-24 h-16 bg-gray-100 rounded-lg" />)}
          </div>
          <div className="h-8 bg-gray-100 rounded w-2/3" />
          <div className="h-4 bg-gray-100 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="text-center py-20">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1" className="mx-auto mb-4">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <h1 className="text-2xl font-bold text-gaff-slate mb-2">Listing not found</h1>
        <p className="text-gray-500 mb-6">This property may have been removed or doesn&apos;t exist.</p>
        <a href="/search" className="inline-block bg-gaff-teal text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gaff-teal-dark transition-colors">
          Back to search
        </a>
      </div>
    );
  }

  const images = listing.images?.length ? listing.images : ['/placeholder-1.jpg'];

  const detailItems = [
    { label: 'Type', value: listing.propertyType, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg> },
    { label: 'Bedrooms', value: listing.bedrooms, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v11m0-7h18M3 18h18M21 7v11M7 11V7a2 2 0 012-2h6a2 2 0 012 2v4"/></svg> },
    { label: 'Bathrooms', value: listing.bathrooms, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 12h16a1 1 0 011 1v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a1 1 0 011-1z"/></svg> },
    ...(listing.sqft ? [{ label: 'Size', value: `${listing.sqft.toLocaleString()} ft²`, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg> }] : []),
    ...(listing.berRating ? [{ label: 'BER', value: listing.berRating, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg> }] : []),
  ];

  const propertyDetails = [
    { label: 'Furnished', value: listing.furnished ? 'Yes' : 'No' },
    { label: 'HAP Accepted', value: listing.hapAccepted ? 'Yes' : 'No', highlight: listing.hapAccepted },
    { label: 'Pets Allowed', value: listing.petsAllowed ? 'Yes' : 'No', highlight: listing.petsAllowed },
    { label: 'Parking', value: listing.parking ? 'Yes' : 'No', highlight: listing.parking },
    ...(listing.eircode ? [{ label: 'Eircode', value: listing.eircode }] : []),
    ...(listing.availableFrom ? [{ label: 'Available', value: new Date(listing.availableFrom).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' }) }] : []),
  ];

  return (
    <div className="bg-gaff-warm min-h-screen">
      {/* Gallery — Daft-style big image */}
      <div className="bg-gaff-slate">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="relative rounded-xl overflow-hidden cursor-pointer group" onClick={() => setGalleryOpen(true)}>
            {/* Main image with gradient placeholder */}
            <div className="aspect-[2/1] sm:aspect-[2.5/1] bg-gradient-to-br from-gaff-teal/60 to-gaff-slate relative">
              <img
                src={images[activeImage]}
                alt={listing.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
            {images.length > 1 && (
              <button className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-gaff-slate text-sm font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-white transition-colors flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                View all {images.length} photos
              </button>
            )}
            {listing.verified && (
              <div className="absolute top-4 left-4">
                <VerifiedBadge type="landlord" size="md" />
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
              {images.slice(0, 6).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    i === activeImage ? 'border-gaff-teal opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gaff-teal/40 to-gaff-slate/40 relative">
                    <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full-screen gallery */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setGalleryOpen(false)}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white z-10 p-2" onClick={() => setGalleryOpen(false)}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
            onClick={(e) => { e.stopPropagation(); setActiveImage((activeImage - 1 + images.length) % images.length); }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <img src={images[activeImage]} alt="" className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg" onClick={(e) => e.stopPropagation()} />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
            onClick={(e) => { e.stopPropagation(); setActiveImage((activeImage + 1) % images.length); }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <div className="absolute bottom-4 text-white/60 text-sm">
            {activeImage + 1} / {images.length}
          </div>
        </div>
      )}

      {/* Key details bar — Daft style */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase text-gaff-teal tracking-wide">{listing.listingType} · {listing.propertyType}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gaff-slate">{listing.title}</h1>
              <p className="text-gray-500 text-sm mt-0.5 flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {listing.address}{listing.area ? `, ${listing.area}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSaved(!saved)}
                className={`p-2.5 rounded-lg border transition-colors ${saved ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'}`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </button>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-bold text-gaff-slate">€{listing.price.toLocaleString()}</div>
                <div className="text-xs text-gray-400">{listing.listingType === 'sale' ? 'Asking price' : 'per month'}</div>
              </div>
            </div>
          </div>

          {/* Quick stats row — Daft style */}
          <div className="flex flex-wrap gap-5 mt-4 pt-4 border-t border-gray-100">
            {detailItems.map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <span className="text-gaff-teal">{item.icon}</span>
                <span className="text-gray-500">{item.label}:</span>
                <span className="font-semibold text-gaff-slate">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content + sidebar */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: content */}
          <div className="flex-1 min-w-0">
            {/* Description */}
            <section className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
              <h2 className="text-lg font-bold text-gaff-slate mb-3">Description</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{listing.description}</p>
            </section>

            {/* Features grid */}
            {listing.features && listing.features.length > 0 && (
              <section className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
                <h2 className="text-lg font-bold text-gaff-slate mb-4">Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {listing.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                      {f}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Property details */}
            <section className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
              <h2 className="text-lg font-bold text-gaff-slate mb-4">Property Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {propertyDetails.map((d) => (
                  <div key={d.label} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5">
                    <span className="text-sm text-gray-500">{d.label}</span>
                    <span className={`text-sm font-semibold ${('highlight' in d && d.highlight) ? 'text-gaff-teal' : 'text-gaff-slate'}`}>
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right sidebar — Daft-style pinned contact card */}
          <div className="lg:w-[340px] shrink-0">
            <div className="sticky top-[130px] space-y-4">
              {/* Contact card */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gaff-teal to-gaff-teal-dark text-white font-bold text-lg flex items-center justify-center shrink-0">
                    {listing.landlord?.name?.charAt(0) ?? 'L'}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gaff-slate truncate">{listing.landlord?.name ?? 'Landlord'}</div>
                    {listing.landlord?.verified && <VerifiedBadge type="landlord" size="sm" />}
                  </div>
                </div>

                {listing.landlord?.joinedDate && (
                  <p className="text-xs text-gray-400 mb-1">Member since {listing.landlord.joinedDate}</p>
                )}
                {listing.landlord?.listingsCount && (
                  <p className="text-xs text-gray-400 mb-4">{listing.landlord.listingsCount} active listing{listing.landlord.listingsCount !== 1 ? 's' : ''}</p>
                )}

                {/* Contact actions — Daft style */}
                <button
                  onClick={() => setMessageOpen(!messageOpen)}
                  className="w-full bg-gaff-teal text-white py-3 rounded-lg font-semibold hover:bg-gaff-teal-dark transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  Email Advertiser
                </button>

                {messageOpen && (
                  <div className="mt-3 animate-slide-down">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Hi, I'm interested in this ${listing.propertyType.toLowerCase()} at ${listing.address}...`}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-gaff-teal/30 focus:border-gaff-teal/50"
                    />
                    <button
                      onClick={() => { alert('Message sent! (Demo)'); setMessageOpen(false); setMessage(''); }}
                      className="w-full mt-2 bg-gaff-slate text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gaff-slate-light transition-colors"
                    >
                      Send Message
                    </button>
                  </div>
                )}

                <button className="w-full mt-2 border border-gray-200 text-gaff-slate py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                  Request Callback
                </button>
              </div>

              {/* Trust signal */}
              <div className="bg-gaff-teal-50 rounded-xl p-4 border border-gaff-teal-100">
                <div className="flex items-start gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0D9488" strokeWidth="2" className="shrink-0 mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  <div>
                    <h4 className="text-sm font-semibold text-gaff-teal-dark">Gaff.ie Protection</h4>
                    <p className="text-xs text-gaff-teal-dark/70 mt-1 leading-relaxed">
                      This listing has been reviewed. Report any issues and we&apos;ll investigate within 4 hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Share */}
              <button className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gaff-slate py-2 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share this listing
              </button>
            </div>
          </div>
        </div>

        {/* Similar listings */}
        {similar.length > 0 && (
          <section className="mt-12 mb-4">
            <h2 className="text-xl font-bold text-gaff-slate mb-5">Similar properties nearby</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.slice(0, 3).map((s) => (
                <a key={s.id} href={`/listing/${s.id}`}>
                  <ListingCard
                    image={s.images?.[0] ?? '/placeholder-1.jpg'}
                    price={s.price}
                    bedrooms={s.bedrooms}
                    bathrooms={s.bathrooms}
                    sqft={s.sqft}
                    address={s.address}
                    area={s.area}
                    verified={s.verified}
                    hapWelcome={s.hapWelcome}
                    timeAgo="Recently"
                    propertyType={s.propertyType}
                  />
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
