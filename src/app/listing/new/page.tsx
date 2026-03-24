'use client';

import { useState } from 'react';
import Footer from '@/components/ui/Footer';

const PROPERTY_TYPES = ['Apartment', 'House', 'Studio', 'Room Share', 'Duplex', 'Bungalow', 'Penthouse'];
const LISTING_TYPES = ['rent', 'sale', 'share'];
const BER_RATINGS = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', 'D1', 'D2', 'E1', 'E2', 'F', 'G', 'Exempt'];
const FEATURES = [
  'Central Heating', 'Double Glazing', 'Alarm', 'Washing Machine', 'Dryer', 'Dishwasher',
  'Garden', 'Balcony', 'Wheelchair Access', 'Cable TV', 'Broadband', 'Storage',
];

export default function NewListingPage() {
  const [form, setForm] = useState({
    title: '', description: '', propertyType: 'Apartment', listingType: 'rent',
    price: '', bedrooms: '1', bathrooms: '1', sqft: '', address: '', eircode: '',
    berRating: '', furnished: false, availableFrom: '',
    hapAccepted: false, petsAllowed: false, parking: false,
    features: [] as string[], images: ['', '', '', '', ''],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key: string, value: string | boolean | string[]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleFeature = (f: string) =>
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter((x) => x !== f) : [...prev.features, f],
    }));

  const setImage = (i: number, val: string) =>
    setForm((prev) => {
      const imgs = [...prev.images];
      imgs[i] = val;
      return { ...prev, images: imgs };
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const body = {
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        sqft: form.sqft ? Number(form.sqft) : undefined,
        images: form.images.filter(Boolean),
      };
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        window.location.href = `/listing/${data.listing?.id ?? data.id ?? ''}`;
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Failed to create listing');
      }
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gaff-teal/40 focus:border-gaff-teal';
  const selectClass = `${inputClass} appearance-none`;
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <>
      <div className="bg-gaff-slate text-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold">List your property</h1>
          <p className="text-gray-400 text-sm mt-1">Free to list. Reach thousands of verified tenants.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic info */}
          <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gaff-slate mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Title</label>
                <input required value={form.title} onChange={(e) => set('title', e.target.value)}
                  placeholder="Bright 2-bed apartment in Ranelagh" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea required value={form.description} onChange={(e) => set('description', e.target.value)}
                  placeholder="Describe the property, area, transport links..." rows={5}
                  className={`${inputClass} resize-none`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Property Type</label>
                  <select value={form.propertyType} onChange={(e) => set('propertyType', e.target.value)} className={selectClass}>
                    {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Listing Type</label>
                  <select value={form.listingType} onChange={(e) => set('listingType', e.target.value)} className={selectClass}>
                    {LISTING_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Details */}
          <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gaff-slate mb-4">Property Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Price (€)</label>
                <input type="number" required min="0" value={form.price} onChange={(e) => set('price', e.target.value)}
                  placeholder="2000" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Bedrooms</label>
                <select value={form.bedrooms} onChange={(e) => set('bedrooms', e.target.value)} className={selectClass}>
                  {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Bathrooms</label>
                <select value={form.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} className={selectClass}>
                  {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Sq Ft</label>
                <input type="number" min="0" value={form.sqft} onChange={(e) => set('sqft', e.target.value)}
                  placeholder="850" className={inputClass} />
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gaff-slate mb-4">Location</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Address</label>
                <input required value={form.address} onChange={(e) => set('address', e.target.value)}
                  placeholder="12 Ranelagh Road, Dublin 6" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Eircode</label>
                  <input value={form.eircode} onChange={(e) => set('eircode', e.target.value)}
                    placeholder="D06 F2X0" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>BER Rating</label>
                  <select value={form.berRating} onChange={(e) => set('berRating', e.target.value)} className={selectClass}>
                    <option value="">Select BER</option>
                    {BER_RATINGS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Features & options */}
          <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gaff-slate mb-4">Features & Options</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
              {FEATURES.map((f) => (
                <label key={f} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input type="checkbox" checked={form.features.includes(f)} onChange={() => toggleFeature(f)}
                    className="w-4 h-4 rounded border-gray-300 text-gaff-teal focus:ring-gaff-teal" />
                  {f}
                </label>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {([
                ['furnished', 'Furnished'],
                ['hapAccepted', 'HAP Accepted'],
                ['petsAllowed', 'Pets Allowed'],
                ['parking', 'Parking'],
              ] as const).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer bg-gray-50 rounded-lg px-3 py-2.5">
                  <input type="checkbox" checked={form[key] as boolean}
                    onChange={(e) => set(key, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-gaff-teal focus:ring-gaff-teal" />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
              ))}
            </div>

            <div className="mt-4">
              <label className={labelClass}>Available From</label>
              <input type="date" value={form.availableFrom} onChange={(e) => set('availableFrom', e.target.value)}
                className={inputClass} />
            </div>
          </section>

          {/* Images */}
          <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gaff-slate mb-4">Images</h2>
            <p className="text-sm text-gray-500 mb-3">Add up to 5 image URLs. The first will be the cover photo.</p>
            <div className="space-y-3">
              {form.images.map((img, i) => (
                <input key={i} value={img} onChange={(e) => setImage(i, e.target.value)}
                  placeholder={`Image URL ${i + 1}${i === 0 ? ' (cover photo)' : ''}`} className={inputClass} />
              ))}
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gaff-teal text-white py-3 rounded-lg font-semibold text-lg hover:bg-gaff-teal-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Publishing...' : '🏠 Publish Listing — Free'}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
