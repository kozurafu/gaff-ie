'use client';

import { useState } from 'react';

const PRICE_OPTIONS = [
  '', '500', '750', '1000', '1250', '1500', '1750', '2000', '2500', '3000', '4000', '5000',
];
const BEDROOM_OPTIONS = ['Any', '1', '2', '3', '4', '5+'];
const PROPERTY_TYPES = ['Any', 'Apartment', 'House', 'Studio', 'Room Share', 'Duplex'];
const LISTING_TABS = [
  { value: 'rent', label: 'Rent' },
  { value: 'sale', label: 'Buy' },
  { value: 'share', label: 'Share' },
];

export default function SearchBar({ variant = 'hero' }: { variant?: 'hero' | 'compact' }) {
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('Any');
  const [propertyType, setPropertyType] = useState('Any');
  const [listingType, setListingType] = useState('rent');
  const [expanded, setExpanded] = useState(false);

  const isHero = variant === 'hero';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('listingType', listingType);
    if (location) params.set('location', location);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms !== 'Any') params.set('bedrooms', bedrooms);
    if (propertyType !== 'Any') params.set('type', propertyType);
    window.location.href = `/search?${params.toString()}`;
  };

  const inputClass =
    'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gaff-slate focus:outline-none focus:ring-2 focus:ring-gaff-teal/30 focus:border-gaff-teal/50 appearance-none transition-all placeholder:text-gray-400';

  if (!isHero) {
    // Compact variant for search page — simple horizontal bar
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className="bg-white rounded-xl border border-gray-200 p-3 flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[180px]">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <input type="text" placeholder="Location..." value={location} onChange={(e) => setLocation(e.target.value)} className={`${inputClass} pl-9`} />
            </div>
          </div>
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className={`${inputClass} w-36`}>
            {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t === 'Any' ? 'Any type' : t}</option>)}
          </select>
          <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={`${inputClass} w-28`}>
            {BEDROOM_OPTIONS.map((b) => <option key={b} value={b}>{b === 'Any' ? 'Beds' : `${b} bed${b === '1' ? '' : 's'}`}</option>)}
          </select>
          <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={`${inputClass} w-32`}>
            <option value="">Max price</option>
            {PRICE_OPTIONS.filter(Boolean).map((p) => <option key={p} value={p}>€{Number(p).toLocaleString()}</option>)}
          </select>
          <button type="submit" className="bg-gaff-teal hover:bg-gaff-teal-dark text-white font-semibold py-2.5 px-6 rounded-lg transition-colors flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            Search
          </button>
        </div>
      </form>
    );
  }

  // Hero variant — Daft-style with tabs
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      {/* Listing type tabs */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/10">
          {LISTING_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setListingType(tab.value)}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${
                listingType === tab.value
                  ? 'bg-white text-gaff-slate shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-xl shadow-xl p-2 flex items-center gap-2">
        <div className="flex-1 relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
          <input
            type="text"
            placeholder="County, area, or town..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-3.5 text-sm text-gaff-slate placeholder:text-gray-400 focus:outline-none rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="bg-gaff-teal hover:bg-gaff-teal-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

      {/* Expandable filters */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1 mx-auto"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="14" y2="12" /><line x1="4" y1="18" x2="8" y2="18" /></svg>
        {expanded ? 'Less filters' : 'More filters'}
      </button>

      {expanded && (
        <div className="mt-3 bg-white rounded-xl shadow-lg p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-down">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Min Price</label>
            <select value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className={inputClass}>
              <option value="">No min</option>
              {PRICE_OPTIONS.filter(Boolean).map((p) => <option key={p} value={p}>€{Number(p).toLocaleString()}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Max Price</label>
            <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={inputClass}>
              <option value="">No max</option>
              {PRICE_OPTIONS.filter(Boolean).map((p) => <option key={p} value={p}>€{Number(p).toLocaleString()}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Bedrooms</label>
            <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={inputClass}>
              {BEDROOM_OPTIONS.map((b) => <option key={b} value={b}>{b === 'Any' ? 'Any beds' : `${b} bed${b === '1' ? '' : 's'}`}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Property Type</label>
            <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className={inputClass}>
              {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t === 'Any' ? 'Any type' : t}</option>)}
            </select>
          </div>
        </div>
      )}
    </form>
  );
}
