'use client';

import { useState, useEffect } from 'react';

const PROPERTY_TYPES = ['APARTMENT', 'HOUSE', 'STUDIO', 'ROOM', 'DUPLEX'] as const;
const LISTING_TYPES = ['RENT', 'BUY', 'SHARE'] as const;
const COMMUTE_MODES = [
  { value: 'driving', label: '🚗 Driving' },
  { value: 'public_transport', label: '🚌 Public Transport' },
  { value: 'cycling', label: '🚲 Cycling' },
  { value: 'walking', label: '🚶 Walking' },
];
const AMENITIES = [
  { key: 'parking', label: 'Parking' },
  { key: 'garden', label: 'Garden/Balcony' },
  { key: 'pets', label: 'Pet-friendly' },
  { key: 'furnished', label: 'Furnished' },
  { key: 'dishwasher', label: 'Dishwasher' },
  { key: 'dryer', label: 'Dryer' },
  { key: 'broadband', label: 'High-speed broadband' },
  { key: 'ev_charging', label: 'EV charging' },
  { key: 'wheelchair', label: 'Wheelchair accessible' },
  { key: 'storage', label: 'Storage' },
  { key: 'ensuite', label: 'En-suite' },
  { key: 'public_transport', label: 'Public transport nearby' },
  { key: 'gym', label: 'Gym' },
  { key: 'balcony', label: 'Balcony' },
];
const ALERT_OPTIONS = ['instant', 'daily', 'weekly'] as const;

interface FormData {
  preferredAreas: string[];
  maxCommute: number | null;
  commuteAddress: string;
  commuteMode: string;
  budgetMin: number | null;
  budgetMax: number | null;
  bedroomsMin: number | null;
  propertyTypes: string[];
  listingType: string;
  moveInDate: string;
  leaseLengthMin: number | null;
  amenityPrefs: Record<string, 'nice' | 'must'>;
  hapRequired: boolean;
  alertFrequency: string;
  emailAlerts: boolean;
}

const defaultForm: FormData = {
  preferredAreas: [],
  maxCommute: null,
  commuteAddress: '',
  commuteMode: '',
  budgetMin: null,
  budgetMax: null,
  bedroomsMin: null,
  propertyTypes: [],
  listingType: 'RENT',
  moveInDate: '',
  leaseLengthMin: null,
  amenityPrefs: {},
  hapRequired: false,
  alertFrequency: 'instant',
  emailAlerts: true,
};

export default function PreferencesPage() {
  const [form, setForm] = useState<FormData>(defaultForm);
  const [areaInput, setAreaInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/preferences')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.preferences) {
          const p = data.preferences;
          setForm({
            preferredAreas: p.preferredAreas ?? [],
            maxCommute: p.maxCommute,
            commuteAddress: p.commuteAddress ?? '',
            commuteMode: p.commuteMode ?? '',
            budgetMin: p.budgetMin,
            budgetMax: p.budgetMax,
            bedroomsMin: p.bedroomsMin,
            propertyTypes: p.propertyTypes ?? [],
            listingType: p.listingType ?? 'RENT',
            moveInDate: p.moveInDate ? p.moveInDate.split('T')[0] : '',
            leaseLengthMin: p.leaseLengthMin,
            amenityPrefs: p.amenityPrefs ?? {},
            hapRequired: p.hapRequired ?? false,
            alertFrequency: p.alertFrequency ?? 'instant',
            emailAlerts: p.emailAlerts ?? true,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          moveInDate: form.moveInDate || null,
        }),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const addArea = () => {
    const val = areaInput.trim();
    if (val && !form.preferredAreas.includes(val)) {
      setForm({ ...form, preferredAreas: [...form.preferredAreas, val] });
      setAreaInput('');
    }
  };

  const removeArea = (area: string) => {
    setForm({ ...form, preferredAreas: form.preferredAreas.filter((a) => a !== area) });
  };

  const togglePropertyType = (type: string) => {
    setForm({
      ...form,
      propertyTypes: form.propertyTypes.includes(type)
        ? form.propertyTypes.filter((t) => t !== type)
        : [...form.propertyTypes, type],
    });
  };

  const cycleAmenity = (key: string) => {
    const current = form.amenityPrefs[key];
    const next: Record<string, 'nice' | 'must' | undefined> = {
      undefined: 'nice',
      nice: 'must',
      must: undefined,
    };
    const newVal = next[String(current)] as 'nice' | 'must' | undefined;
    const newPrefs = { ...form.amenityPrefs };
    if (newVal) {
      newPrefs[key] = newVal;
    } else {
      delete newPrefs[key];
    }
    setForm({ ...form, amenityPrefs: newPrefs });
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-[#1a1a2e] text-white py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <a href="/dashboard" className="text-sm text-gray-400 hover:text-white mb-2 inline-block">← Dashboard</a>
          <h1 className="text-2xl font-bold">My Ideal Gaff 🏡</h1>
          <p className="text-gray-400 text-sm mt-1">Tell us what you&apos;re looking for and we&apos;ll find matches for you.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Location */}
        <Section title="📍 Location">
          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Areas</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={areaInput}
              onChange={(e) => setAreaInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addArea())}
              placeholder="e.g. Dublin 6, Ranelagh..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C9B8A]/30 focus:border-[#0C9B8A]"
            />
            <button onClick={addArea} className="px-4 py-2 bg-[#0C9B8A] text-white rounded-lg text-sm font-medium hover:bg-[#0a8a7a]">Add</button>
          </div>
          {form.preferredAreas.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {form.preferredAreas.map((area) => (
                <span key={area} className="inline-flex items-center gap-1 bg-[#0C9B8A]/10 text-[#0C9B8A] px-3 py-1 rounded-full text-sm font-medium">
                  {area}
                  <button onClick={() => removeArea(area)} className="hover:text-red-500 ml-1">×</button>
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Commute to (address)</label>
              <input
                type="text"
                value={form.commuteAddress}
                onChange={(e) => setForm({ ...form, commuteAddress: e.target.value })}
                placeholder="e.g. Trinity College Dublin"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C9B8A]/30 focus:border-[#0C9B8A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Commute (mins)</label>
              <input
                type="number"
                value={form.maxCommute ?? ''}
                onChange={(e) => setForm({ ...form, maxCommute: e.target.value ? Number(e.target.value) : null })}
                placeholder="30"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C9B8A]/30 focus:border-[#0C9B8A]"
              />
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Commute Mode</label>
            <div className="flex flex-wrap gap-2">
              {COMMUTE_MODES.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setForm({ ...form, commuteMode: form.commuteMode === m.value ? '' : m.value })}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${form.commuteMode === m.value ? 'bg-[#0C9B8A] text-white border-[#0C9B8A]' : 'border-gray-200 text-gray-600 hover:border-[#0C9B8A]/50'}`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Budget */}
        <Section title="💶 Budget">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min (€/month)</label>
              <input
                type="number"
                value={form.budgetMin ?? ''}
                onChange={(e) => setForm({ ...form, budgetMin: e.target.value ? Number(e.target.value) : null })}
                placeholder="500"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C9B8A]/30 focus:border-[#0C9B8A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max (€/month)</label>
              <input
                type="number"
                value={form.budgetMax ?? ''}
                onChange={(e) => setForm({ ...form, budgetMax: e.target.value ? Number(e.target.value) : null })}
                placeholder="2000"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C9B8A]/30 focus:border-[#0C9B8A]"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.hapRequired}
                onChange={(e) => setForm({ ...form, hapRequired: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0C9B8A]"></div>
            </label>
            <span className="text-sm text-gray-700">HAP accepted required</span>
          </div>
        </Section>

        {/* Property Type */}
        <Section title="🏠 Property">
          <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
          <div className="flex gap-2 mb-4">
            {LISTING_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setForm({ ...form, listingType: t })}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${form.listingType === t ? 'bg-[#0C9B8A] text-white border-[#0C9B8A]' : 'border-gray-200 text-gray-600 hover:border-[#0C9B8A]/50'}`}
              >
                {t === 'BUY' ? 'Buy' : t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">Property Types</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {PROPERTY_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => togglePropertyType(t)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${form.propertyTypes.includes(t) ? 'bg-[#0C9B8A] text-white border-[#0C9B8A]' : 'border-gray-200 text-gray-600 hover:border-[#0C9B8A]/50'}`}
              >
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Bedrooms</label>
              <input
                type="number"
                value={form.bedroomsMin ?? ''}
                onChange={(e) => setForm({ ...form, bedroomsMin: e.target.value ? Number(e.target.value) : null })}
                placeholder="1"
                min={0}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C9B8A]/30 focus:border-[#0C9B8A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Move-in Date</label>
              <input
                type="date"
                value={form.moveInDate}
                onChange={(e) => setForm({ ...form, moveInDate: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C9B8A]/30 focus:border-[#0C9B8A]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Lease (months)</label>
              <input
                type="number"
                value={form.leaseLengthMin ?? ''}
                onChange={(e) => setForm({ ...form, leaseLengthMin: e.target.value ? Number(e.target.value) : null })}
                placeholder="6"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0C9B8A]/30 focus:border-[#0C9B8A]"
              />
            </div>
          </div>
        </Section>

        {/* Amenities */}
        <Section title="✨ Amenities">
          <p className="text-sm text-gray-500 mb-3">Click to cycle: <span className="text-gray-400">Off</span> → <span className="text-[#0C9B8A]">Nice to have</span> → <span className="text-orange-500">Must have</span></p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {AMENITIES.map((a) => {
              const val = form.amenityPrefs[a.key];
              return (
                <button
                  key={a.key}
                  onClick={() => cycleAmenity(a.key)}
                  className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-sm text-left transition-colors ${
                    val === 'must'
                      ? 'bg-orange-50 border-orange-300 text-orange-700'
                      : val === 'nice'
                      ? 'bg-[#0C9B8A]/5 border-[#0C9B8A]/40 text-[#0C9B8A]'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  <span>{a.label}</span>
                  <span className="text-xs font-medium">
                    {val === 'must' ? '🔴 Must' : val === 'nice' ? '🟢 Nice' : '—'}
                  </span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Notifications */}
        <Section title="🔔 Notifications">
          <label className="block text-sm font-medium text-gray-700 mb-2">Alert Frequency</label>
          <div className="flex gap-2 mb-4">
            {ALERT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setForm({ ...form, alertFrequency: opt })}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${form.alertFrequency === opt ? 'bg-[#0C9B8A] text-white border-[#0C9B8A]' : 'border-gray-200 text-gray-600 hover:border-[#0C9B8A]/50'}`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.emailAlerts}
                onChange={(e) => setForm({ ...form, emailAlerts: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0C9B8A]"></div>
            </label>
            <span className="text-sm text-gray-700">Email alerts</span>
          </div>
        </Section>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#0C9B8A] text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-[#0a8a7a] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
          {saved && <span className="text-sm text-[#0C9B8A] font-medium">✓ Saved!</span>}
        </div>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-[#1a1a2e] mb-4">{title}</h2>
      {children}
    </div>
  );
}
