'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ListingCard from '@/components/ui/ListingCard';

const LOCATIONS = ['All Ireland', 'Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Belfast', 'Kilkenny', 'Drogheda'];
const PRICE_OPTIONS = ['', '500', '750', '1000', '1250', '1500', '1750', '2000', '2500', '3000', '4000', '5000'];
const BEDROOM_OPTIONS = ['Any', '1', '2', '3', '4', '5+'];
const PROPERTY_TYPES = ['Any', 'Apartment', 'House', 'Studio', 'Room Share', 'Duplex'];
const LISTING_TYPES = ['rent', 'sale', 'share'] as const;
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

interface Listing {
  id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft?: number;
  address: string;
  area: string;
  images?: string[];
  verified?: boolean;
  hapWelcome?: boolean;
  createdAt?: string;
  propertyType: string;
  listingType?: string;
}

interface ApiResponse {
  listings: Listing[];
  total: number;
  page: number;
  totalPages: number;
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gaff-warm flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>}>
      <SearchPageInner />
    </Suspense>
  );
}

function SearchPageInner() {
  const searchParams = useSearchParams();

  const [location, setLocation] = useState(searchParams.get('location') || 'Dublin');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || 'Any');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || 'Any');
  const [listingType, setListingType] = useState(searchParams.get('listingType') || 'rent');
  const [hapAccepted, setHapAccepted] = useState(false);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [moreFilters, setMoreFilters] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (location && location !== 'All Ireland') params.set('location', location);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms !== 'Any') params.set('bedrooms', bedrooms);
    if (propertyType !== 'Any') params.set('propertyType', propertyType);
    if (listingType) params.set('listingType', listingType);
    if (hapAccepted) params.set('hapAccepted', 'true');
    if (petsAllowed) params.set('petsAllowed', 'true');
    params.set('page', String(page));

    try {
      const res = await fetch(`/api/listings?${params}`);
      if (res.ok) {
        const data: ApiResponse = await res.json();
        setListings(data.listings ?? []);
        setTotalPages(data.totalPages ?? 1);
        setTotal(data.total ?? 0);
      } else {
        setListings([]);
      }
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [location, minPrice, maxPrice, bedrooms, propertyType, listingType, hapAccepted, petsAllowed, page]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const selectClass =
    'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gaff-slate focus:outline-none focus:ring-2 focus:ring-gaff-teal/30 focus:border-gaff-teal/50 appearance-none transition-all';

  return (
    <div className="min-h-screen bg-gaff-warm">
      {/* Listing type tabs — Daft style */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-6 h-12">
            {LISTING_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => { setListingType(t); setPage(1); }}
                className={`relative text-sm font-semibold capitalize transition-colors h-full flex items-center ${
                  listingType === t
                    ? 'text-gaff-teal'
                    : 'text-gray-500 hover:text-gaff-slate'
                }`}
              >
                {t === 'sale' ? 'Buy' : t}
                {listingType === t && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gaff-teal rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter bar — Daft style horizontal */}
      <div className="bg-white border-b border-gray-100 sticky top-[60px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Location */}
            <div className="relative">
              <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <select value={location} onChange={(e) => { setLocation(e.target.value); setPage(1); }} className={`${selectClass} pl-8 w-40`}>
                {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <select value={propertyType} onChange={(e) => { setPropertyType(e.target.value); setPage(1); }} className={`${selectClass} w-32`}>
              {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t === 'Any' ? 'Type' : t}</option>)}
            </select>

            <select value={bedrooms} onChange={(e) => { setBedrooms(e.target.value); setPage(1); }} className={`${selectClass} w-28`}>
              {BEDROOM_OPTIONS.map((b) => <option key={b} value={b}>{b === 'Any' ? 'Beds' : `${b} bed${b === '1' ? '' : 's'}`}</option>)}
            </select>

            <select value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} className={`${selectClass} w-28`}>
              <option value="">Min €</option>
              {PRICE_OPTIONS.filter(Boolean).map((p) => <option key={p} value={p}>€{Number(p).toLocaleString()}</option>)}
            </select>

            <select value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} className={`${selectClass} w-28`}>
              <option value="">Max €</option>
              {PRICE_OPTIONS.filter(Boolean).map((p) => <option key={p} value={p}>€{Number(p).toLocaleString()}</option>)}
            </select>

            <button
              onClick={() => setMoreFilters(!moreFilters)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                moreFilters || hapAccepted || petsAllowed
                  ? 'border-gaff-teal text-gaff-teal bg-gaff-teal-50'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="8" y2="18" /></svg>
              More
              {(hapAccepted || petsAllowed) && (
                <span className="w-1.5 h-1.5 rounded-full bg-gaff-teal" />
              )}
            </button>

            <div className="ml-auto hidden sm:block">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`${selectClass} w-44`}>
                {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          {/* Expanded filters */}
          {moreFilters && (
            <div className="flex flex-wrap gap-4 pt-3 mt-3 border-t border-gray-100 animate-slide-down">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={hapAccepted} onChange={(e) => { setHapAccepted(e.target.checked); setPage(1); }}
                  className="w-4 h-4 rounded border-gray-300 text-gaff-teal focus:ring-gaff-teal" />
                <span className="text-sm text-gray-700">HAP Accepted</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={petsAllowed} onChange={(e) => { setPetsAllowed(e.target.checked); setPage(1); }}
                  className="w-4 h-4 rounded border-gray-300 text-gaff-teal focus:ring-gaff-teal" />
                <span className="text-sm text-gray-700">Pets Allowed</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Result count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            {loading ? 'Searching...' : (
              <>
                <span className="font-semibold text-gaff-slate">{total}</span> properties
                {location !== 'All Ireland' ? ` in ${location}` : ' in Ireland'}
              </>
            )}
          </p>
          <div className="sm:hidden">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`${selectClass} text-xs`}>
              {SORT_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" className="mx-auto mb-4">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <h3 className="text-lg font-semibold text-gaff-slate mb-1">No properties found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your filters or searching a different area.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.map((l) => (
                <a key={l.id} href={`/listing/${l.id}`} className="block">
                  <ListingCard
                    image={l.images?.[0] ?? '/placeholder-1.jpg'}
                    price={l.price}
                    bedrooms={l.bedrooms}
                    bathrooms={l.bathrooms}
                    sqft={l.sqft}
                    address={l.address}
                    area={l.area}
                    verified={l.verified}
                    hapWelcome={l.hapWelcome}
                    timeAgo={l.createdAt ? timeAgo(l.createdAt) : 'Recently'}
                    propertyType={l.propertyType}
                  />
                </a>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  disabled={page <= 1}
                  onClick={() => { setPage(page - 1); window.scrollTo(0, 0); }}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-white bg-white transition-colors"
                >
                  ← Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <button
                      key={p}
                      onClick={() => { setPage(p); window.scrollTo(0, 0); }}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                        page === p ? 'bg-gaff-teal text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  disabled={page >= totalPages}
                  onClick={() => { setPage(page + 1); window.scrollTo(0, 0); }}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-white bg-white transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return 'Today';
  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
}
