'use client';

import dynamic from 'next/dynamic';

const RoomMeasure = dynamic(() => import('@/components/ar/RoomMeasure'), { ssr: false });

export default function MeasurePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gaff-slate">📏 Room Measurement Tool</h1>
        <p className="text-gray-500 mt-1">Measure rooms from the floor plan or use AR on your phone</p>
      </div>
      <RoomMeasure />
    </div>
  );
}
