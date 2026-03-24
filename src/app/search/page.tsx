'use client';

import { useState, useEffect, useCallback } from 'react';
import ListingCard from '@/components/ui/ListingCard';
import Footer from '@/components/ui/Footer';

const LOCATIONS = ['All Ireland', 'Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Belfast', 'Kilkenny', 'Drogheda'];
const PRICE_OPTIONS = ['', '500', '750', '1000', '1250', '1500', '1750', '2000', '2500', '3000', '4000', '5000'];
const BEDROOM_OPTIONS = ['Any', '1', '2', '3', '4', '5+'];
const PROPERTY_TYPES = ['Any', 'Apartment', 'House', 'Studio', 'Room Share', 'Duplex'];
const LISTING_TYPES = ['rent', 'sale', 'share'] as const;

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
  const [location, setLocation] = useState('Dublin');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('Any');
  const [propertyType, setPropertyType] = useState('Any');
  const [listingType, setListingType] = useState<string>('rent');
  const [hapAccepted, setHapAccepted] = useState(false);
  const [petsAllowed, setPetsAllowed] = useState(false);

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

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
    'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gaff-slate focus:outline-none focus:ring-2 focus:ring-gaff-teal/40 focus:border-gaff-teal appearance-none';

  const FilterPanel = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
        <select value={location} onChange={(e) => { setLocation(e.target.value); setPage(1); }} className={selectClass}>
          {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Listing Type</label>
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {LISTING_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => { setListingType(t); setPage(1); }}
              className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${
                listingType === t ? 'bg-gaff-teal text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Min Price</label>
          <select value={minPrice} onChange={(e) => { setMinPrice(e.target.value); setPage(1); }} className={selectClass}>
            <option value="">No min</option>
            {PRICE_OPTIONS.filter(Boolean).map((p) => <option key={p} value={p}>€{Number(p).toLocaleString()}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Max Price</label>
          <select value={maxPrice} onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }} className={selectClass}>
            <option value="">No max</option>
            {PRICE_OPTIONS.filter(Boolean).map((p) => <option key={p} value={p}>€{Number(p).toLocaleString()}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Bedrooms</label>
        <select value={bedrooms} onChange={(e) => { setBedrooms(e.target.value); setPage(1); }} className={selectClass}>
          {BEDROOM_OPTIONS.map((b) => <option key={b} value={b}>{b === 'Any' ? 'Any' : `${b} bed${b === '1' ? '' : 's'}`}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Property Type</label>
        <select value={propertyType} onChange={(e) => { setPropertyType(e.target.value); setPage(1); }} className={selectClass}>
          {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="space-y-3 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={hapAccepted} onChange={(e) => { setHapAccepted(e.target.checked); setPage(1); }}
            className="w-4 h-4 rounded border-gray-300 text-gaff-teal focus:ring-gaff-teal" />
          <span className="text-sm text-gray-700">HAP Accepted</span>
          <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">Irish housing aid</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={petsAllowed} onChange={(e) => { setPetsAllowed(e.target.checked); setPage(1); }}
            className="w-4 h-4 rounded border-gray-300 text-gaff-teal focus:ring-gaff-teal" />
          <span className="text-sm text-gray-700">Pets Allowed</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div className="bg-gaff-slate text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Find your gaff</h1>
          <p className="text-gray-400 text-sm mt-1">
            {loading ? 'Searching...' : `${total} verified properties found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="md:hidden w-full mb-4 flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="8" y2="18" />
          </svg>
          Filters
        </button>

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20 shadow-sm">
              <h2 className="text-sm font-semibold text-gaff-slate mb-4">Filters</h2>
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile filters drawer */}
          {filtersOpen && (
            <div className="fixed inset-0 z-40 md:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
              <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gaff-slate">Filters</h2>
                  <button onClick={() => setFiltersOpen(false)} className="p-1 text-gray-400">✕</button>
                </div>
                <FilterPanel />
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full mt-4 bg-gaff-teal text-white py-2.5 rounded-lg font-semibold"
                >
                  Show results
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-1/3" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-3">🏠</div>
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
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      disabled={page <= 1}
                      onClick={() => setPage(page - 1)}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50"
                    >
                      ← Previous
                    </button>
                    <span className="text-sm text-gray-500 px-3">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      disabled={page >= totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
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
