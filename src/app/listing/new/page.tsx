'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const PROPERTY_TYPES = [
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'HOUSE', label: 'House' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'ROOM', label: 'Room' },
  { value: 'FLAT', label: 'Flat' },
  { value: 'DUPLEX', label: 'Duplex' },
  { value: 'BUNGALOW', label: 'Bungalow' },
  { value: 'PENTHOUSE', label: 'Penthouse' },
];

const LISTING_TYPES = [
  { value: 'RENT', label: 'To Rent' },
  { value: 'SALE', label: 'For Sale' },
  { value: 'SHARE', label: 'House Share' },
];

const BER_RATINGS = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2', 'E1', 'E2', 'F', 'G', 'Exempt'];

const COUNTIES = [
  // Republic of Ireland (26)
  'Carlow', 'Cavan', 'Clare', 'Cork', 'Donegal', 'Dublin', 'Galway', 'Kerry',
  'Kildare', 'Kilkenny', 'Laois', 'Leitrim', 'Limerick', 'Longford', 'Louth',
  'Mayo', 'Meath', 'Monaghan', 'Offaly', 'Roscommon', 'Sligo', 'Tipperary',
  'Waterford', 'Westmeath', 'Wexford', 'Wicklow',
  // Northern Ireland (6)
  'Antrim', 'Armagh', 'Derry', 'Down', 'Fermanagh', 'Tyrone',
];

const FEATURES = [
  { key: 'parking', label: 'Parking', icon: '🅿️' },
  { key: 'garden', label: 'Garden', icon: '🌿' },
  { key: 'petsAllowed', label: 'Pets Allowed', icon: '🐾' },
  { key: 'furnished', label: 'Furnished', icon: '🛋️' },
  { key: 'hapAccepted', label: 'HAP Accepted', icon: '🏛️' },
  { key: 'broadband', label: 'Broadband', icon: '📶' },
  { key: 'evCharging', label: 'EV Charging', icon: '⚡' },
  { key: 'alarm', label: 'Alarm System', icon: '🔔' },
  { key: 'wheelchairAccessible', label: 'Wheelchair Accessible', icon: '♿' },
  { key: 'washingMachine', label: 'Washing Machine', icon: '🧺' },
  { key: 'dryer', label: 'Dryer', icon: '💨' },
  { key: 'dishwasher', label: 'Dishwasher', icon: '🍽️' },
];

interface FormErrors {
  [key: string]: string;
}

interface PhotoFile {
  file: File;
  preview: string;
  id: string;
}

export default function NewListingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('APARTMENT');
  const [listingType, setListingType] = useState('RENT');
  const [bedrooms, setBedrooms] = useState('1');
  const [bathrooms, setBathrooms] = useState('1');
  const [sqft, setSqft] = useState('');
  const [berRating, setBerRating] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('Dublin');
  const [eircode, setEircode] = useState('');
  const [price, setPrice] = useState('');
  const [priceFrequency, setPriceFrequency] = useState('month');
  const [featureFlags, setFeatureFlags] = useState<Record<string, boolean>>({});
  const [photos, setPhotos] = useState<PhotoFile[]>([]);
  const [availableFrom, setAvailableFrom] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data?.user) { window.location.href = '/auth/login'; return; }
        if (data.user.role === 'TENANT') { window.location.href = '/search'; return; }
        setAuthorized(true);
        setAuthChecked(true);
      })
      .catch(() => { window.location.href = '/auth/login'; });
  }, []);

  const toggleFeature = (key: string) => {
    setFeatureFlags(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 10 - photos.length;
    const toAdd = files.slice(0, remaining);
    const newPhotos: PhotoFile[] = toAdd.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).slice(2),
    }));
    setPhotos(prev => [...prev, ...newPhotos]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id);
      if (photo) URL.revokeObjectURL(photo.preview);
      return prev.filter(p => p.id !== id);
    });
  };

  const movePhoto = (id: string, direction: -1 | 1) => {
    setPhotos(prev => {
      const idx = prev.findIndex(p => p.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!title.trim()) errs.title = 'Title is required';
    else if (title.trim().length < 10) errs.title = 'Title must be at least 10 characters';
    if (!description.trim()) errs.description = 'Description is required';
    else if (description.trim().length < 30) errs.description = 'Description must be at least 30 characters';
    if (!addressLine1.trim()) errs.addressLine1 = 'Address is required';
    if (!city.trim()) errs.city = 'City/Town is required';
    if (!price || Number(price) <= 0) errs.price = 'Valid price is required';
    if (eircode && !/^[A-Za-z0-9]{7}$/.test(eircode.replace(/\s/g, ''))) errs.eircode = 'Invalid Eircode format';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Extract special fields from features
      const hapAccepted = !!featureFlags.hapAccepted;
      const petsAllowed = !!featureFlags.petsAllowed;
      const parkingIncluded = !!featureFlags.parking;
      const furnished = featureFlags.furnished ? 'YES' : 'NO';

      // Build features object (excluding fields that are top-level in schema)
      const features: Record<string, boolean> = {};
      for (const f of FEATURES) {
        if (f.key !== 'parking' && f.key !== 'petsAllowed' && f.key !== 'hapAccepted' && f.key !== 'furnished') {
          features[f.key] = !!featureFlags[f.key];
        }
      }

      // Convert price to cents
      const priceInCents = Math.round(Number(price) * 100);

      const body: Record<string, unknown> = {
        title: title.trim(),
        description: description.trim(),
        propertyType,
        listingType,
        price: priceInCents,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        sqft: sqft ? Number(sqft) : undefined,
        berRating: berRating || undefined,
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim() || undefined,
        city: city.trim(),
        county,
        eircode: eircode.replace(/\s/g, '') || undefined,
        hapAccepted,
        petsAllowed,
        parkingIncluded,
        furnished,
        features,
        availableFrom: availableFrom || undefined,
        status: 'ACTIVE',
      };

      // Upload photos if any — for now just send URLs (placeholder)
      // In production this would upload to S3/Cloudflare R2 first
      if (photos.length > 0) {
        // For now, convert to base64 data URLs as a fallback
        const imageData = await Promise.all(
          photos.map(async (p, i) => {
            return { url: p.preview, order: i, isPrimary: i === 0 };
          })
        );
        body.images = imageData;
      }

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        const newId = data.listing?.id ?? data.id;
        router.push(`/listing/${newId}`);
      } else {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data.error || 'Failed to create listing. Please try again.');
      }
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field?: string) =>
    `w-full rounded-lg border ${field && errors[field] ? 'border-red-300 focus:ring-red-300' : 'border-gray-200 focus:ring-gaff-teal/40 focus:border-gaff-teal'} px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors bg-white`;
  const selectClass = (field?: string) => `${inputClass(field)} appearance-none`;
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';
  const sectionTitle = 'text-lg font-bold text-gray-900 mb-1';
  const sectionSubtitle = 'text-sm text-gray-500 mb-5';

  if (!authChecked || !authorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gaff-teal border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-10">
          <h1 className="text-2xl sm:text-3xl font-bold">List your property</h1>
          <p className="text-gray-400 mt-2">Free to list. Reach thousands of verified tenants across Ireland.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {submitError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Section 1: Property Basics ─────────────────────── */}
          <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-gaff-teal/10 rounded-lg flex items-center justify-center text-gaff-teal font-bold text-sm">1</div>
              <h2 className={sectionTitle}>Property Basics</h2>
            </div>
            <p className={sectionSubtitle}>Tell us about your property.</p>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Listing Title *</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Bright 2-bed apartment in Ranelagh with balcony"
                  className={inputClass('title')}
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the property, area, transport links, nearby amenities..."
                  rows={6}
                  className={`${inputClass('description')} resize-none`}
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
                <p className="text-xs text-gray-400 mt-1">{description.length} characters</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Property Type</label>
                  <select value={propertyType} onChange={e => setPropertyType(e.target.value)} className={selectClass()}>
                    {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Listing Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {LISTING_TYPES.map(t => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setListingType(t.value)}
                        className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${listingType === t.value
                          ? 'bg-gaff-teal text-white border-gaff-teal shadow-sm'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gaff-teal/40'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 2: Details ─────────────────────────────── */}
          <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-gaff-teal/10 rounded-lg flex items-center justify-center text-gaff-teal font-bold text-sm">2</div>
              <h2 className={sectionTitle}>Property Details</h2>
            </div>
            <p className={sectionSubtitle}>Bedrooms, bathrooms, and other specs.</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Bedrooms</label>
                <select value={bedrooms} onChange={e => setBedrooms(e.target.value)} className={selectClass()}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <option key={n} value={n}>{n === 0 ? 'Studio' : n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Bathrooms</label>
                <select value={bathrooms} onChange={e => setBathrooms(e.target.value)} className={selectClass()}>
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Size (sq ft)</label>
                <input
                  type="number"
                  min="0"
                  value={sqft}
                  onChange={e => setSqft(e.target.value)}
                  placeholder="850"
                  className={inputClass()}
                />
              </div>
              <div>
                <label className={labelClass}>BER Rating</label>
                <select value={berRating} onChange={e => setBerRating(e.target.value)} className={selectClass()}>
                  <option value="">Select BER</option>
                  {BER_RATINGS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className={labelClass}>Available From</label>
              <input
                type="date"
                value={availableFrom}
                onChange={e => setAvailableFrom(e.target.value)}
                className={inputClass()}
              />
            </div>
          </section>

          {/* ── Section 3: Address ─────────────────────────────── */}
          <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-gaff-teal/10 rounded-lg flex items-center justify-center text-gaff-teal font-bold text-sm">3</div>
              <h2 className={sectionTitle}>Address</h2>
            </div>
            <p className={sectionSubtitle}>Where is the property located?</p>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Address Line 1 *</label>
                <input
                  value={addressLine1}
                  onChange={e => setAddressLine1(e.target.value)}
                  placeholder="e.g. 12 Ranelagh Road"
                  className={inputClass('addressLine1')}
                />
                {errors.addressLine1 && <p className="text-xs text-red-500 mt-1">{errors.addressLine1}</p>}
              </div>

              <div>
                <label className={labelClass}>Address Line 2</label>
                <input
                  value={addressLine2}
                  onChange={e => setAddressLine2(e.target.value)}
                  placeholder="e.g. Apt 4, Block B"
                  className={inputClass()}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>City / Town *</label>
                  <input
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="e.g. Dublin"
                    className={inputClass('city')}
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className={labelClass}>County</label>
                  <select value={county} onChange={e => setCounty(e.target.value)} className={selectClass()}>
                    {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Eircode</label>
                  <input
                    value={eircode}
                    onChange={e => setEircode(e.target.value)}
                    placeholder="D06 F2X0"
                    maxLength={8}
                    className={inputClass('eircode')}
                  />
                  {errors.eircode && <p className="text-xs text-red-500 mt-1">{errors.eircode}</p>}
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 4: Pricing ─────────────────────────────── */}
          <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-gaff-teal/10 rounded-lg flex items-center justify-center text-gaff-teal font-bold text-sm">4</div>
              <h2 className={sectionTitle}>Pricing</h2>
            </div>
            <p className={sectionSubtitle}>Set your asking price.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Price (€) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">€</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder={listingType === 'SALE' ? '350000' : '2000'}
                    className={`${inputClass('price')} pl-8`}
                  />
                </div>
                {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
              </div>

              {(listingType === 'RENT' || listingType === 'SHARE') && (
                <div>
                  <label className={labelClass}>Price Frequency</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'month', label: 'Per Month' },
                      { value: 'week', label: 'Per Week' },
                    ].map(f => (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => setPriceFrequency(f.value)}
                        className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${priceFrequency === f.value
                          ? 'bg-gaff-teal text-white border-gaff-teal shadow-sm'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gaff-teal/40'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ── Section 5: Features ────────────────────────────── */}
          <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-gaff-teal/10 rounded-lg flex items-center justify-center text-gaff-teal font-bold text-sm">5</div>
              <h2 className={sectionTitle}>Features & Amenities</h2>
            </div>
            <p className={sectionSubtitle}>Select all that apply.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FEATURES.map(f => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => toggleFeature(f.key)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${featureFlags[f.key]
                    ? 'bg-gaff-teal/5 border-gaff-teal text-gaff-teal shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="text-lg">{f.icon}</span>
                  <span>{f.label}</span>
                  {featureFlags[f.key] && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-auto shrink-0"><path d="M20 6L9 17l-5-5" /></svg>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* ── Section 6: Photos ──────────────────────────────── */}
          <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-gaff-teal/10 rounded-lg flex items-center justify-center text-gaff-teal font-bold text-sm">6</div>
              <h2 className={sectionTitle}>Photos</h2>
            </div>
            <p className={sectionSubtitle}>Add up to 10 photos. The first photo will be the cover image. Drag to reorder.</p>

            {/* Photo previews */}
            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                {photos.map((photo, i) => (
                  <div key={photo.id} className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-gray-200">
                    <img src={photo.preview} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-2 left-2 bg-gaff-teal text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Cover</span>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => movePhoto(photo.id, -1)}
                          className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="w-7 h-7 bg-red-500/90 rounded-full flex items-center justify-center text-white hover:bg-red-500"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                      </button>
                      {i < photos.length - 1 && (
                        <button
                          type="button"
                          onClick={() => movePhoto(photo.id, 1)}
                          className="w-7 h-7 bg-white/90 rounded-full flex items-center justify-center text-gray-700 hover:bg-white"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload button */}
            {photos.length < 10 && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-gaff-teal/40 hover:bg-gaff-teal/5 transition-colors"
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" className="mx-auto mb-3">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <p className="text-sm font-medium text-gray-600">Click to add photos</p>
                <p className="text-xs text-gray-400 mt-1">{photos.length}/10 photos · JPG, PNG, WebP</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handlePhotos}
              className="hidden"
            />
          </section>

          {/* Submit */}
          <div className="pt-2 pb-12">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gaff-teal text-white py-4 rounded-xl font-bold text-lg hover:bg-gaff-teal-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gaff-teal/20 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  🏠 Publish Listing
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              By publishing, you confirm this listing complies with Irish rental legislation and Gaff.ie&apos;s terms of service.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
