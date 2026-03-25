'use client';

import { useState } from 'react';

const PRICE_OPTIONS = [
  '', '500', '750', '1000', '1250', '1500', '1750', '2000', '2500', '3000', '4000', '5000',
];
const BEDROOM_OPTIONS = ['Any', '1', '2', '3', '4', '5+'];
const PROPERTY_TYPES = ['Any', 'Apartment', 'House', 'Studio', 'Room Share', 'Duplex'];

export default function SearchBar({ variant = 'hero' }: { variant?: 'hero' | 'compact' }) {
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bedrooms, setBedrooms] = useState('Any');
  const [propertyType, setPropertyType] = useState('Any');
  const [focused, setFocused] = useState(false);

  const isHero = variant === 'hero';

  const inputClass =
    'w-full rounded-xl border border-gray-200/80 bg-white px-3.5 py-3 text-sm text-gaff-slate focus:outline-none focus:ring-2 focus:ring-gaff-teal/30 focus:border-gaff-teal/50 appearance-none transition-all placeholder:text-gray-400';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (location) params.set('location', location);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (bedrooms !== 'Any') params.set('bedrooms', bedrooms);
        if (propertyType !== 'Any') params.set('type', propertyType);
        window.location.href = `/search?${params.toString()}`;
      }}
      className={`w-full ${isHero ? 'max-w-4xl mx-auto' : 'max-w-full'}`}
    >
      <div
        className={`rounded-2xl p-4 md:p-5 grid gap-3 transition-all duration-300 ${
          isHero
            ? `glass shadow-xl ${focused ? 'shadow-glow-teal ring-1 ring-gaff-teal/20' : ''} grid-cols-1 sm:grid-cols-2 lg:grid-cols-5`
            : 'bg-white shadow-card border border-gray-100 grid-cols-1 sm:grid-cols-5'
        }`}
      >
        {/* Location */}
        <div className={isHero ? 'sm:col-span-2 lg:col-span-2' : ''}>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Location</label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <input
              type="text"
              placeholder="Dublin, Cork, Galway..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        {/* Price range - collapsed on mobile for hero */}
        <div className={isHero ? 'hidden sm:block' : ''}>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Min Price</label>
          <select value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className={inputClass}>
            <option value="">No min</option>
            {PRICE_OPTIONS.filter(Boolean).map((p) => (
              <option key={p} value={p}>€{Number(p).toLocaleString()}</option>
            ))}
          </select>
        </div>

        <div className={isHero ? 'hidden sm:block' : ''}>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Max Price</label>
          <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={inputClass}>
            <option value="">No max</option>
            {PRICE_OPTIONS.filter(Boolean).map((p) => (
              <option key={p} value={p}>€{Number(p).toLocaleString()}</option>
            ))}
          </select>
        </div>

        {/* Bedrooms */}
        <div className={isHero ? 'hidden lg:block' : ''}>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">Bedrooms</label>
          <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={inputClass}>
            {BEDROOM_OPTIONS.map((b) => (
              <option key={b} value={b}>{b === 'Any' ? 'Any beds' : `${b} bed${b === '1' ? '' : 's'}`}</option>
            ))}
          </select>
        </div>

        {/* Search button - full width row */}
        <div className={`${isHero ? 'sm:col-span-2 lg:col-span-5' : 'sm:col-span-5'} flex gap-3 items-end`}>
          {/* Property type on desktop */}
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className={`${inputClass} hidden lg:block flex-1`}
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t === 'Any' ? 'Any type' : t}</option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full lg:w-auto bg-gradient-to-r from-gaff-teal to-gaff-teal-dark hover:from-gaff-teal-dark hover:to-gaff-teal text-white font-semibold py-3 px-10 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
