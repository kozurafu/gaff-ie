'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const RoomMeasure = dynamic(() => import('@/components/ar/RoomMeasure'), { ssr: false });
const FurniturePlacer = dynamic(() => import('@/components/ar/FurniturePlacer'), { ssr: false });
const VirtualTour = dynamic(() => import('@/components/ar/VirtualTour'), { ssr: false });
const SunlightSim = dynamic(() => import('@/components/ar/SunlightSim'), { ssr: false });
const NeighbourhoodMap = dynamic(() => import('@/components/map/NeighbourhoodMap'), { ssr: false });
const StreetView = dynamic(() => import('@/components/map/StreetView'), { ssr: false });

interface Feature {
  id: string;
  name: string;
  emoji: string;
  description: string;
  tag: string;
}

const FEATURES: Feature[] = [
  { id: 'tour', name: '360° Virtual Tour', emoji: '🏠', description: 'Walk through every room from your phone', tag: 'Most Popular' },
  { id: 'measure', name: 'Room Measurements', emoji: '📏', description: 'Measure rooms and check dimensions', tag: 'AR' },
  { id: 'furniture', name: 'Will My Stuff Fit?', emoji: '🛋️', description: 'Drag your furniture into the room to check', tag: 'Interactive' },
  { id: 'sunlight', name: 'Sunlight Simulator', emoji: '☀️', description: 'See when each room gets natural light', tag: 'Unique' },
  { id: 'area', name: 'Neighbourhood Explorer', emoji: '📍', description: 'Transport, schools, shops — everything nearby', tag: 'Map' },
  { id: 'street', name: 'Street View', emoji: '🚶', description: 'Walk around the neighbourhood virtually', tag: 'Map' },
];

export default function FeaturesPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-gaff-teal text-white text-xs font-bold px-2.5 py-1 rounded-full">NEW</span>
          <span className="text-xs text-gray-400">Only on Gaff.ie</span>
        </div>
        <h1 className="text-3xl font-bold text-gaff-slate">Interactive Property Tools</h1>
        <p className="text-gray-500 mt-2">
          Go beyond photos. Measure rooms, check sunlight, explore the area — make smarter decisions about your next gaff.
        </p>
      </div>

      {/* Feature grid / accordion */}
      <div className="space-y-3">
        {FEATURES.map((feature) => (
          <div key={feature.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            {/* Header button */}
            <button
              onClick={() => setActive(active === feature.id ? null : feature.id)}
              className="w-full px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition text-left"
            >
              <span className="text-3xl">{feature.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-gaff-slate">{feature.name}</h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gaff-teal bg-gaff-teal/10 px-2 py-0.5 rounded-full">
                    {feature.tag}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{feature.description}</p>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`text-gray-400 transition-transform ${active === feature.id ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Content */}
            {active === feature.id && (
              <div className="px-5 pb-5 pt-2 border-t border-gray-50">
                {feature.id === 'tour' && <VirtualTour />}
                {feature.id === 'measure' && <RoomMeasure />}
                {feature.id === 'furniture' && <FurniturePlacer />}
                {feature.id === 'sunlight' && <SunlightSim />}
                {feature.id === 'area' && <NeighbourhoodMap />}
                {feature.id === 'street' && <StreetView />}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 bg-gradient-to-r from-gaff-teal to-gaff-teal-light rounded-2xl p-6 text-white text-center">
        <h2 className="text-xl font-bold mb-2">Like what you see?</h2>
        <p className="text-white/80 text-sm mb-4">These tools are free for every listing on Gaff.ie</p>
        <button className="bg-white text-gaff-teal font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition shadow-lg">
          View Full Listing →
        </button>
      </div>
    </div>
  );
}
