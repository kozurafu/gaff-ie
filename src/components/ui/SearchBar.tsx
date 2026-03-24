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

  const isHero = variant === 'hero';

  const selectClass =
    'w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm text-slate-dark focus:outline-none focus:ring-2 focus:ring-teal-primary/40 focus:border-teal-primary appearance-none';

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={`w-full ${isHero ? 'max-w-4xl mx-auto' : 'max-w-full'}`}
    >
      <div
        className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-6 grid gap-3 ${
          isHero
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6'
            : 'grid-cols-1 sm:grid-cols-5'
        }`}
      >
        {/* Location */}
        <div className={isHero ? 'sm:col-span-2 lg:col-span-2' : ''}>
          <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <input
              type="text"
              placeholder="Dublin, Cork, Galway..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={`${selectClass} pl-9`}
            />
          </div>
        </div>

        {/* Min Price */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Min Price</label>
          <select value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className={selectClass}>
            <option value="">No min</option>
            {PRICE_OPTIONS.filter(Boolean).map((p) => (
              <option key={p} value={p}>€{Number(p).toLocaleString()}</option>
            ))}
          </select>
        </div>

        {/* Max Price */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Max Price</label>
          <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className={selectClass}>
            <option value="">No max</option>
            {PRICE_OPTIONS.filter(Boolean).map((p) => (
              <option key={p} value={p}>€{Number(p).toLocaleString()}</option>
            ))}
          </select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Bedrooms</label>
          <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={selectClass}>
            {BEDROOM_OPTIONS.map((b) => (
              <option key={b} value={b}>{b === 'Any' ? 'Any beds' : `${b} bed${b === '1' ? '' : 's'}`}</option>
            ))}
          </select>
        </div>

        {/* Property Type + Search */}
        <div className={isHero ? 'sm:col-span-2 lg:col-span-1 flex flex-col' : 'flex flex-col'}>
          <label className="block text-xs font-medium text-gray-500 mb-1 lg:hidden">Type</label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className={`${selectClass} lg:hidden`}
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Search button */}
        <div className={`${isHero ? 'sm:col-span-2 lg:col-span-6' : 'sm:col-span-5'} flex gap-3 items-end`}>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className={`${selectClass} hidden lg:block flex-1`}
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full lg:w-auto bg-teal-primary hover:bg-teal-dark text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
