'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface ListingImage {
  id: string;
  url: string;
  order: number;
  isPrimary: boolean;
  alt?: string;
}

interface ListingUser {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  createdAt?: string;
  phone?: string;
  _count?: { listings: number };
  verifications?: { status: string; type: string }[];
}

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  listingType: string;
  propertyType: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county: string;
  eircode?: string;
  berRating?: string;
  features?: Record<string, boolean>;
  furnished: string;
  hapAccepted: boolean;
  petsAllowed: boolean;
  parkingIncluded: boolean;
  availableFrom?: string;
  isPremium: boolean;
  viewCount: number;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
  images: ListingImage[];
  user: ListingUser;
}

interface SimilarListing {
  id: string;
  title: string;
  price: number;
  listingType: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  addressLine1: string;
  city: string;
  county: string;
  images: ListingImage[];
  user: { name: string; verifications?: { status: string }[] };
}

function formatPrice(price: number, listingType: string): string {
  const formatted = new Intl.NumberFormat('en-IE', { maximumFractionDigits: 0 }).format(price);
  return `€${formatted}`;
}

function formatPriceSuffix(listingType: string): string {
  if (listingType === 'RENT' || listingType === 'SHARE') return '/mo';
  return '';
}

function timeAgo(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return d.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' });
}

function isVerified(user: ListingUser): boolean {
  return user.verifications?.some(v => v.status === 'VERIFIED') ?? false;
}

const FEATURE_LABELS: Record<string, { label: string; icon: string }> = {
  parking: { label: 'Parking', icon: '🅿️' },
  garden: { label: 'Garden', icon: '🌿' },
  balcony: { label: 'Balcony', icon: '🏗️' },
  broadband: { label: 'Broadband', icon: '📶' },
  evCharging: { label: 'EV Charging', icon: '⚡' },
  alarm: { label: 'Alarm System', icon: '🔔' },
  wheelchairAccessible: { label: 'Wheelchair Accessible', icon: '♿' },
  washingMachine: { label: 'Washing Machine', icon: '🧺' },
  dryer: { label: 'Dryer', icon: '💨' },
  dishwasher: { label: 'Dishwasher', icon: '🍽️' },
  centralHeating: { label: 'Central Heating', icon: '🔥' },
  doubleGlazing: { label: 'Double Glazing', icon: '🪟' },
  cableTV: { label: 'Cable TV', icon: '📺' },
  storage: { label: 'Storage', icon: '📦' },
};

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Apartment',
  HOUSE: 'House',
  STUDIO: 'Studio',
  ROOM: 'Room',
  FLAT: 'Flat',
  DUPLEX: 'Duplex',
  BUNGALOW: 'Bungalow',
  PENTHOUSE: 'Penthouse',
};

const LISTING_TYPE_LABELS: Record<string, string> = {
  RENT: 'To Rent',
  SALE: 'For Sale',
  SHARE: 'House Share',
};

function GradientPlaceholder({ className, index = 0 }: { className?: string; index?: number }) {
  const gradients = [
    'from-teal-400/40 via-cyan-300/30 to-blue-400/40',
    'from-emerald-400/40 via-teal-300/30 to-cyan-400/40',
    'from-blue-400/40 via-indigo-300/30 to-purple-400/40',
    'from-cyan-400/40 via-teal-300/30 to-emerald-400/40',
  ];
  return (
    <div className={`bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center ${className ?? ''}`}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" className="opacity-40">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  );
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
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquirySending, setEnquirySending] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingListing, setSavingListing] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; role: string } | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  const toggleSave = async () => {
    if (savingListing) return;
    setSavingListing(true);
    try {
      const res = await fetch('/api/saved-listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: id }),
      });
      if (res.ok) {
        const data = await res.json();
        setSaved(data.saved);
      }
    } catch { /* ignore */ }
    setSavingListing(false);
  };

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.user) setCurrentUser(data.user); })
      .catch(() => {});
  }, []);

  // Fetch match score for tenants
  useEffect(() => {
    if (!id) return;
    fetch(`/api/listings/${id}/match`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.match) setMatchScore(data.match.score); })
      .catch(() => {});
  }, [id]);

  // Check saved state
  useEffect(() => {
    if (!id) return;
    fetch('/api/saved-listings')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.savedListings) {
          const isSaved = data.savedListings.some((s: { listingId: string }) => s.listingId === id);
          setSaved(isSaved);
        }
      })
      .catch(() => {});
  }, [id]);

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

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!galleryOpen || !listing) return;
    if (e.key === 'Escape') setGalleryOpen(false);
    if (e.key === 'ArrowLeft') setActiveImage(p => (p - 1 + (listing.images.length || 1)) % (listing.images.length || 1));
    if (e.key === 'ArrowRight') setActiveImage(p => (p + 1) % (listing.images.length || 1));
  }, [galleryOpen, listing]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const sendEnquiry = async () => {
    if (!enquiryMessage.trim()) return;
    setEnquirySending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: id, recipientId: listing?.user.id, text: enquiryMessage }),
      });
      if (res.ok) {
        setEnquirySent(true);
        setTimeout(() => { setEnquiryOpen(false); setEnquirySent(false); setEnquiryMessage(''); }, 2000);
      }
    } catch { /* ignore */ }
    setEnquirySending(false);
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[420px]">
              <div className="col-span-2 row-span-2 bg-gray-200" />
              <div className="bg-gray-200" />
              <div className="bg-gray-200" />
              <div className="bg-gray-200" />
              <div className="bg-gray-200" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-8">
              <div className="col-span-2 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-5 bg-gray-200 rounded w-1/2" />
                <div className="h-24 bg-gray-200 rounded" />
              </div>
              <div className="h-64 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h1>
          <p className="text-gray-500 mb-6">This property may have been removed or doesn&apos;t exist.</p>
          <Link href="/search" className="inline-block bg-gaff-teal text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gaff-teal-dark transition-colors">
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  const images = listing.images.length > 0
    ? listing.images.sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0) || a.order - b.order)
    : [];
  const hasImages = images.length > 0;
  const address = [listing.addressLine1, listing.addressLine2, listing.city, listing.county].filter(Boolean).join(', ');
  const verified = isVerified(listing.user);
  const memberSince = listing.user.createdAt
    ? new Date(listing.user.createdAt).toLocaleDateString('en-IE', { month: 'long', year: 'numeric' })
    : null;

  const activeFeatures = listing.features
    ? Object.entries(listing.features).filter(([, v]) => v).map(([k]) => k)
    : [];

  const badges = [
    verified && { label: 'Verified ✓', color: 'bg-green-50 text-green-700 border-green-200' },
    listing.hapAccepted && { label: 'HAP Welcome', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    listing.petsAllowed && { label: 'Pets Allowed', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    listing.furnished === 'YES' && { label: 'Furnished', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    listing.furnished === 'PARTIAL' && { label: 'Part Furnished', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    listing.parkingIncluded && { label: 'Parking Included', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  ].filter(Boolean) as { label: string; color: string }[];

  return (
    <div className="bg-gray-50 min-h-screen pb-20 lg:pb-0">
      {/* ── Photo Gallery ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 pt-4 sm:pt-6">
        {hasImages ? (
          <div
            className="relative grid grid-cols-1 sm:grid-cols-4 sm:grid-rows-2 gap-2 rounded-2xl overflow-hidden cursor-pointer group"
            style={{ height: 'clamp(240px, 50vw, 440px)' }}
            onClick={() => setGalleryOpen(true)}
          >
            {/* Large main image */}
            <div className="sm:col-span-2 sm:row-span-2 relative overflow-hidden">
              <img
                src={images[0].url}
                alt={images[0].alt || listing.title}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
            {/* Smaller images */}
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="hidden sm:block relative overflow-hidden">
                {images[i] ? (
                  <img src={images[i].url} alt={images[i].alt || ''} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                ) : (
                  <GradientPlaceholder className="w-full h-full" index={i} />
                )}
              </div>
            ))}
            {/* View all photos overlay */}
            <button className="absolute bottom-4 right-4 bg-white text-gray-900 text-sm font-semibold px-4 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-shadow flex items-center gap-2 z-10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
              View all {images.length} photos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 sm:grid-rows-2 gap-2 rounded-2xl overflow-hidden" style={{ height: 'clamp(240px, 50vw, 440px)' }}>
            <GradientPlaceholder className="sm:col-span-2 sm:row-span-2 w-full h-full" index={0} />
            {[1, 2, 3, 4].map(i => (
              <GradientPlaceholder key={i} className="hidden sm:flex w-full h-full" index={i} />
            ))}
          </div>
        )}
      </div>

      {/* ── Full-screen Gallery Modal ─────────────────────────── */}
      {galleryOpen && hasImages && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col" onClick={() => setGalleryOpen(false)}>
          <div className="flex items-center justify-between px-4 py-3 bg-black/80">
            <span className="text-white/70 text-sm font-medium">{activeImage + 1} / {images.length}</span>
            <button className="text-white/70 hover:text-white p-1" onClick={() => setGalleryOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center relative px-12" onClick={e => e.stopPropagation()}>
            <button
              className="absolute left-2 sm:left-4 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-colors"
              onClick={() => setActiveImage((activeImage - 1 + images.length) % images.length)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <img
              src={images[activeImage].url}
              alt={images[activeImage].alt || ''}
              className="max-h-[80vh] max-w-full object-contain rounded-lg"
            />
            <button
              className="absolute right-2 sm:right-4 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-colors"
              onClick={() => setActiveImage((activeImage + 1) % images.length)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
          {/* Thumbnail strip */}
          <div className="flex gap-2 justify-center px-4 py-3 bg-black/80 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={(e) => { e.stopPropagation(); setActiveImage(i); }}
                className={`shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all ${i === activeImage ? 'border-white opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Main Content ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gaff-teal bg-gaff-teal/10 px-2.5 py-1 rounded-full">
                  {LISTING_TYPE_LABELS[listing.listingType] || listing.listingType}
                </span>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {PROPERTY_TYPE_LABELS[listing.propertyType] || listing.propertyType}
                </span>
                {listing.isPremium && (
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">⭐ Premium</span>
                )}
                {matchScore !== null && matchScore > 0 && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${matchScore >= 70 ? 'bg-emerald-50 text-emerald-700' : matchScore >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                    🎯 {matchScore}% match
                  </span>
                )}
              </div>
              <div className="flex items-start justify-between gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{listing.title}</h1>
                {currentUser && currentUser.id === listing.user.id && (
                  <Link href={`/listing/${listing.id}/edit`} className="shrink-0 text-sm font-medium text-gaff-teal border border-gaff-teal/30 px-3 py-1.5 rounded-lg hover:bg-gaff-teal/5 transition-colors">
                    ✏️ Edit
                  </Link>
                )}
              </div>
              <p className="text-gray-500 mt-1 flex items-center gap-1.5">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                {address}
                {listing.eircode && <span className="text-gray-400 ml-1">· {listing.eircode}</span>}
              </p>

              {/* Price */}
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {formatPrice(listing.price, listing.listingType)}
                </span>
                <span className="text-gray-400 text-lg">{formatPriceSuffix(listing.listingType)}</span>
              </div>
            </div>

            {/* Key Features Row */}
            <div className="flex flex-wrap gap-4 sm:gap-6 py-4 px-5 bg-white rounded-xl border border-gray-100 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gaff-teal/10 rounded-lg flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2"><path d="M3 7v11m0-7h18M3 18h18M21 7v11M7 11V7a2 2 0 012-2h6a2 2 0 012 2v4" /></svg>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{listing.bedrooms}</div>
                  <div className="text-xs text-gray-400">Bed{listing.bedrooms !== 1 ? 's' : ''}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gaff-teal/10 rounded-lg flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2"><path d="M4 12h16a1 1 0 011 1v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a1 1 0 011-1z" /><path d="M6 12V5a2 2 0 012-2h0a2 2 0 012 2v1" /></svg>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{listing.bathrooms}</div>
                  <div className="text-xs text-gray-400">Bath{listing.bathrooms !== 1 ? 's' : ''}</div>
                </div>
              </div>
              {listing.sqft && (
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-gaff-teal/10 rounded-lg flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{listing.sqft.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">sq ft</div>
                  </div>
                </div>
              )}
              {listing.berRating && (
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-gaff-teal/10 rounded-lg flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{listing.berRating}</div>
                    <div className="text-xs text-gray-400">BER</div>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gaff-teal/10 rounded-lg flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{PROPERTY_TYPE_LABELS[listing.propertyType] || listing.propertyType}</div>
                  <div className="text-xs text-gray-400">Type</div>
                </div>
              </div>
            </div>

            {/* Badges */}
            {badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {badges.map(b => (
                  <span key={b.label} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${b.color}`}>
                    {b.label}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <section className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
              <div className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-line">{listing.description}</div>
            </section>

            {/* Features & Amenities */}
            {(activeFeatures.length > 0 || listing.parkingIncluded) && (
              <section className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Features & Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {listing.parkingIncluded && (
                    <div className="flex items-center gap-2.5 text-sm text-gray-700">
                      <span className="text-base">🅿️</span>
                      <span>Parking</span>
                    </div>
                  )}
                  {activeFeatures.map(f => {
                    const info = FEATURE_LABELS[f];
                    return (
                      <div key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                        <span className="text-base">{info?.icon || '✓'}</span>
                        <span>{info?.label || f}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Property Details */}
            <section className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Property Type', PROPERTY_TYPE_LABELS[listing.propertyType] || listing.propertyType],
                  ['Listing Type', LISTING_TYPE_LABELS[listing.listingType] || listing.listingType],
                  ['Furnished', listing.furnished === 'YES' ? 'Yes' : listing.furnished === 'PARTIAL' ? 'Partially' : 'No'],
                  ['HAP Accepted', listing.hapAccepted ? 'Yes' : 'No'],
                  ['Pets Allowed', listing.petsAllowed ? 'Yes' : 'No'],
                  ['Parking', listing.parkingIncluded ? 'Included' : 'No'],
                  ...(listing.eircode ? [['Eircode', listing.eircode]] : []),
                  ...(listing.availableFrom ? [['Available From', new Date(listing.availableFrom).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })]] : []),
                  ['Listed', timeAgo(listing.createdAt)],
                  ['Views', listing.viewCount.toLocaleString()],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className="text-sm font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Map Placeholder */}
            <section className="bg-white rounded-xl border border-gray-100 p-6 mb-5">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Location</h2>
              <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center">
                <div className="text-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" className="mx-auto mb-2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                  <p className="text-sm text-gray-500 font-medium">{address}</p>
                  {listing.eircode && <p className="text-xs text-gray-400 mt-1">{listing.eircode}</p>}
                </div>
              </div>
            </section>
          </div>

          {/* ── Right Sidebar ────────────────────────────────────── */}
          <div className="hidden lg:block lg:w-[360px] shrink-0">
            <div className="sticky top-6 space-y-4">
              {/* Landlord/Agent Card */}
              <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gaff-teal to-emerald-600 text-white font-bold text-xl flex items-center justify-center shrink-0">
                    {listing.user.avatar ? (
                      <img src={listing.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      listing.user.name?.charAt(0)?.toUpperCase() || 'L'
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{listing.user.name}</div>
                    <div className="flex items-center gap-1.5">
                      {verified && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="#15803d" stroke="none"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Verified
                        </span>
                      )}
                      <span className="text-xs text-gray-400 capitalize">{listing.user.role.toLowerCase()}</span>
                    </div>
                  </div>
                </div>

                {memberSince && (
                  <p className="text-xs text-gray-400 mb-1">Member since {memberSince}</p>
                )}
                {listing.user._count?.listings && (
                  <p className="text-xs text-gray-400 mb-1">
                    {listing.user._count.listings} active listing{listing.user._count.listings !== 1 ? 's' : ''}
                  </p>
                )}
                <p className="text-xs text-gray-400 mb-4">⚡ Typically responds within 2 hours</p>

                {/* Enquiry Button */}
                <button
                  onClick={() => setEnquiryOpen(!enquiryOpen)}
                  className="w-full bg-gaff-teal text-white py-3 rounded-lg font-semibold hover:bg-gaff-teal-dark transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                  Send Enquiry
                </button>

                {enquiryOpen && (
                  <div className="mt-3">
                    {enquirySent ? (
                      <div className="text-center py-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" className="mx-auto mb-2"><path d="M20 6L9 17l-5-5" /></svg>
                        <p className="text-sm font-medium text-gaff-teal">Enquiry sent!</p>
                      </div>
                    ) : (
                      <>
                        <textarea
                          value={enquiryMessage}
                          onChange={(e) => setEnquiryMessage(e.target.value)}
                          placeholder={`Hi, I'm interested in this ${(PROPERTY_TYPE_LABELS[listing.propertyType] || 'property').toLowerCase()} at ${listing.addressLine1}. Is it still available?`}
                          className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-gaff-teal/30 focus:border-gaff-teal"
                        />
                        <button
                          onClick={sendEnquiry}
                          disabled={enquirySending || !enquiryMessage.trim()}
                          className="w-full mt-2 bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                          {enquirySending ? 'Sending...' : 'Send Message'}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {listing.user.phone && (
                  <a
                    href={`tel:${listing.user.phone}`}
                    className="w-full mt-2 border border-gray-200 text-gray-900 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                    Call {listing.user.phone}
                  </a>
                )}

                <button className="w-full mt-2 border border-gray-200 text-gray-900 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></svg>
                  Request Callback
                </button>
              </div>

              {/* Trust Signal */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <div className="flex items-start gap-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" className="shrink-0 mt-0.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-800">Gaff.ie Protection</h4>
                    <p className="text-xs text-emerald-700/70 mt-1 leading-relaxed">
                      This listing has been reviewed. Report any issues and we&apos;ll investigate within 4 hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={toggleSave}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border transition-colors ${saved ? 'border-red-200 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                  {saved ? 'Saved' : 'Save'}
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Similar Properties ──────────────────────────────── */}
        {similar.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Similar properties nearby</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {similar.slice(0, 3).map((s) => (
                <Link key={s.id} href={`/listing/${s.id}`} className="block group">
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-[16/10] relative overflow-hidden">
                      {s.images?.[0] ? (
                        <img src={s.images[0].url} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <GradientPlaceholder className="w-full h-full" />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-xl font-bold text-gray-900">
                        {formatPrice(s.price, s.listingType)}
                        <span className="text-sm font-normal text-gray-400">{formatPriceSuffix(s.listingType)}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 truncate">{s.addressLine1}, {s.city}</p>
                      <div className="flex gap-3 mt-2 text-xs text-gray-400">
                        <span>{s.bedrooms} bed</span>
                        <span>{s.bathrooms} bath</span>
                        {s.sqft && <span>{s.sqft.toLocaleString()} ft²</span>}
                        <span className="capitalize">{s.propertyType.toLowerCase()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Mobile Fixed Enquiry Bar ─────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 lg:hidden z-40">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1">
            <div className="text-xl font-bold text-gray-900">
              {formatPrice(listing.price, listing.listingType)}
              <span className="text-sm font-normal text-gray-400">{formatPriceSuffix(listing.listingType)}</span>
            </div>
          </div>
          <button
            onClick={toggleSave}
            className={`p-2.5 rounded-lg border transition-colors ${saved ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400'}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </button>
          <button
            onClick={() => setEnquiryOpen(true)}
            className="bg-gaff-teal text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gaff-teal-dark transition-colors"
          >
            Send Enquiry
          </button>
        </div>
      </div>

      {/* Mobile Enquiry Modal */}
      {enquiryOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/50 flex items-end" onClick={() => setEnquiryOpen(false)}>
          <div className="bg-white w-full rounded-t-2xl p-6 pb-8" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-1">Send Enquiry</h3>
            <p className="text-sm text-gray-500 mb-4">to {listing.user.name}</p>
            {enquirySent ? (
              <div className="text-center py-6">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" className="mx-auto mb-2"><path d="M20 6L9 17l-5-5" /></svg>
                <p className="text-base font-medium text-gaff-teal">Enquiry sent successfully!</p>
              </div>
            ) : (
              <>
                <textarea
                  value={enquiryMessage}
                  onChange={(e) => setEnquiryMessage(e.target.value)}
                  placeholder={`Hi, I'm interested in this property at ${listing.addressLine1}. Is it still available?`}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none h-32 focus:outline-none focus:ring-2 focus:ring-gaff-teal/30 focus:border-gaff-teal"
                  autoFocus
                />
                <button
                  onClick={sendEnquiry}
                  disabled={enquirySending || !enquiryMessage.trim()}
                  className="w-full mt-3 bg-gaff-teal text-white py-3 rounded-lg font-semibold hover:bg-gaff-teal-dark transition-colors disabled:opacity-50"
                >
                  {enquirySending ? 'Sending...' : 'Send Message'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
