'use client';

import { useState } from 'react';

interface StreetViewProps {
  lat?: number;
  lng?: number;
  address?: string;
}

export default function StreetView({ lat = 53.3498, lng = -6.2603, address = '42 Pearse Street, Dublin 2' }: StreetViewProps) {
  const [provider, setProvider] = useState<'mapillary' | 'google'>('mapillary');
  const [loaded, setLoaded] = useState(false);

  // Mapillary embed (open source, no API key needed for embed)
  const mapillaryUrl = `https://www.mapillary.com/embed?style=photo&close=true&lat=${lat}&lng=${lng}&zoom=17`;
  // Google Maps embed (works without API key for basic embed)
  const googleUrl = `https://www.google.com/maps/embed?pb=!4v0!6m8!1m7!1s0!2m2!1d${lat}!2d${lng}!3f0!4f0!5f0.7820865974627469`;

  return (
    <div className="space-y-3">
      {/* Provider toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => { setProvider('mapillary'); setLoaded(false); }}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            provider === 'mapillary' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          🌍 Mapillary (Open Source)
        </button>
        <button
          onClick={() => { setProvider('google'); setLoaded(false); }}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            provider === 'google' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📍 Google Maps
        </button>
      </div>

      {/* Embed */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 border border-gray-200" style={{ aspectRatio: '16/9' }}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-gaff-teal border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm text-gray-500">Loading street view...</p>
            </div>
          </div>
        )}
        {provider === 'mapillary' ? (
          <iframe
            src={mapillaryUrl}
            className="w-full h-full border-0"
            onLoad={() => setLoaded(true)}
            allow="fullscreen"
            title="Mapillary Street View"
          />
        ) : (
          <iframe
            src={googleUrl}
            className="w-full h-full border-0"
            onLoad={() => setLoaded(true)}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Street View"
          />
        )}
      </div>

      <div className="bg-gaff-warm-dark rounded-xl p-3 flex items-start gap-3">
        <span className="text-lg">📍</span>
        <div>
          <p className="text-sm font-semibold text-gaff-slate">{address}</p>
          <p className="text-xs text-gray-500 mt-0.5">Drag to explore the neighbourhood virtually. Coverage may vary.</p>
        </div>
      </div>
    </div>
  );
}
