'use client';

import dynamic from 'next/dynamic';

const NeighbourhoodMap = dynamic(() => import('@/components/map/NeighbourhoodMap'), { ssr: false });

export default function AreaPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gaff-slate">📍 Neighbourhood Explorer</h1>
        <p className="text-gray-500 mt-1">Discover what&apos;s nearby — transport, schools, shops, and more</p>
      </div>
      <NeighbourhoodMap />
    </div>
  );
}
