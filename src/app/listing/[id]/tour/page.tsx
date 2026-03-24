'use client';

import dynamic from 'next/dynamic';

const VirtualTour = dynamic(() => import('@/components/ar/VirtualTour'), { ssr: false });

export default function TourPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gaff-slate">🏠 360° Virtual Tour</h1>
        <p className="text-gray-500 mt-1">Explore every room without leaving your couch</p>
      </div>
      <VirtualTour />
    </div>
  );
}
