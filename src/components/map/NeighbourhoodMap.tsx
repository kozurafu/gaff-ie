'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface NeighbourhoodMapProps {
  lat?: number;
  lng?: number;
  address?: string;
}

interface Amenity {
  name: string;
  type: string;
  emoji: string;
  lat: number;
  lng: number;
  distance?: string;
}

declare global {
  interface Window {
    L: any;
  }
}

const DUBLIN_CENTERS = [
  { name: 'Grand Canal Dock (Tech Hub)', lat: 53.3389, lng: -6.2389 },
  { name: 'IFSC / Docklands', lat: 53.3489, lng: -6.2439 },
  { name: "St Stephen's Green", lat: 53.3382, lng: -6.2591 },
  { name: 'Sandyford Business Park', lat: 53.2727, lng: -6.2209 },
  { name: 'Blanchardstown', lat: 53.3868, lng: -6.3756 },
];

const AMENITY_CATEGORIES = [
  { key: 'transport', label: 'Transport', emoji: '🚇', color: '#0D9488' },
  { key: 'schools', label: 'Schools', emoji: '🏫', color: '#D97706' },
  { key: 'shops', label: 'Shops', emoji: '🛒', color: '#7C3AED' },
  { key: 'health', label: 'Health', emoji: '🏥', color: '#EF4444' },
  { key: 'parks', label: 'Parks', emoji: '🌳', color: '#16A34A' },
];

export default function NeighbourhoodMap({ lat = 53.3498, lng = -6.2603, address = '42 Pearse Street, Dublin 2' }: NeighbourhoodMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [activeCategory, setActiveCategory] = useState('transport');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mapInstance.current) return;

    const L = window.L;
    const map = L.map(mapRef.current).setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Property marker
    const icon = L.divIcon({
      html: '<div style="background:#0D9488;width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:16px;">🏠</div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      className: '',
    });
    L.marker([lat, lng], { icon }).addTo(map).bindPopup(`<b>${address}</b>`);

    mapInstance.current = map;
    fetchAmenities('transport');
  }, [leafletLoaded]);

  const fetchAmenities = async (category: string) => {
    setActiveCategory(category);
    setLoading(true);

    // Use Overpass API for real OSM data
    const tagMap: Record<string, string> = {
      transport: '[railway=station]',
      schools: '[amenity=school]',
      shops: '[shop=supermarket]',
      health: '[amenity=pharmacy]',
      parks: '[leisure=park]',
    };

    const emojiMap: Record<string, string> = {
      transport: '🚇', schools: '🏫', shops: '🛒', health: '💊', parks: '🌳',
    };

    try {
      const query = `[out:json][timeout:10];node${tagMap[category]}(${lat - 0.015},${lng - 0.02},${lat + 0.015},${lng + 0.02});out body 20;`;
      const res = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await res.json();

      const results: Amenity[] = data.elements.map((el: any) => {
        const dx = (el.lon - lng) * 111320 * Math.cos(lat * Math.PI / 180);
        const dy = (el.lat - lat) * 110540;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return {
          name: el.tags?.name || `${category} amenity`,
          type: category,
          emoji: emojiMap[category],
          lat: el.lat,
          lng: el.lon,
          distance: dist < 1000 ? `${Math.round(dist)}m` : `${(dist / 1000).toFixed(1)}km`,
        };
      }).sort((a: any, b: any) => parseFloat(a.distance) - parseFloat(b.distance));

      setAmenities(results);

      // Update map markers
      if (mapInstance.current && window.L) {
        const L = window.L;
        // Clear old amenity markers (keep property marker)
        mapInstance.current.eachLayer((layer: any) => {
          if (layer._amenityMarker) mapInstance.current.removeLayer(layer);
        });

        const catConfig = AMENITY_CATEGORIES.find((c) => c.key === category);
        results.forEach((a: Amenity) => {
          const icon = L.divIcon({
            html: `<div style="background:${catConfig?.color || '#666'};width:24px;height:24px;border-radius:50%;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;font-size:12px;">${a.emoji}</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            className: '',
          });
          const marker = L.marker([a.lat, a.lng], { icon }).addTo(mapInstance.current).bindPopup(`<b>${a.name}</b><br>${a.distance}`);
          marker._amenityMarker = true;
        });
      }
    } catch {
      // Fallback with demo data
      setAmenities([
        { name: 'Pearse DART Station', type: 'transport', emoji: '🚇', lat: lat + 0.002, lng: lng + 0.003, distance: '350m' },
        { name: 'Grand Canal Dock Luas', type: 'transport', emoji: '🚊', lat: lat - 0.003, lng: lng + 0.005, distance: '500m' },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        onLoad={() => setLeafletLoaded(true)}
      />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {AMENITY_CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => fetchAmenities(cat.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
              activeCategory === cat.key
                ? 'text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={activeCategory === cat.key ? { backgroundColor: cat.color } : {}}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Map */}
      <div ref={mapRef} className="w-full rounded-2xl overflow-hidden border border-gray-200" style={{ height: 350 }}>
        {!leafletLoaded && (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-gaff-teal border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {/* Nearby amenities list */}
      <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gaff-slate">
            {AMENITY_CATEGORIES.find((c) => c.key === activeCategory)?.label} Nearby
          </h3>
          {loading && <div className="animate-spin w-4 h-4 border-2 border-gaff-teal border-t-transparent rounded-full" />}
        </div>
        {amenities.length === 0 && !loading && (
          <div className="px-4 py-6 text-center text-sm text-gray-400">No results found nearby</div>
        )}
        {amenities.slice(0, 8).map((a, i) => (
          <div key={i} className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">{a.emoji}</span>
              <span className="text-sm font-medium text-gaff-slate">{a.name}</span>
            </div>
            <span className="text-sm font-semibold text-gaff-teal">{a.distance}</span>
          </div>
        ))}
      </div>

      {/* Commute times */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="font-semibold text-sm text-gaff-slate mb-3">🚌 Commute Estimates</h3>
        <div className="space-y-2">
          {DUBLIN_CENTERS.map((center) => {
            const dx = (center.lng - lng) * 111320 * Math.cos(lat * Math.PI / 180);
            const dy = (center.lat - lat) * 110540;
            const distKm = Math.sqrt(dx * dx + dy * dy) / 1000;
            const walkMin = Math.round(distKm * 12);
            const transitMin = Math.round(distKm * 4 + 8);
            return (
              <div key={center.name} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-gray-600 flex-1">{center.name}</span>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gray-400">{distKm.toFixed(1)} km</span>
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">🚌 ~{transitMin} min</span>
                  {distKm < 3 && (
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">🚶 ~{walkMin} min</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
