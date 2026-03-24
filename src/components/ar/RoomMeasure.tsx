'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
  label?: string;
}

interface Measurement {
  from: Point;
  to: Point;
  distanceM: number;
}

// Scale: pixels per metre (user configurable)
const DEFAULT_SCALE = 50;

export default function RoomMeasure() {
  const [points, setPoints] = useState<Point[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [mode, setMode] = useState<'measure' | 'calibrate'>('measure');
  const [calibrationLength, setCalibrationLength] = useState('1.0');
  const [arSupported, setArSupported] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check for WebXR support
    if ((navigator as unknown as Record<string, unknown>).xr) {
      ((navigator as unknown as Record<string, unknown>).xr as { isSessionSupported?: (mode: string) => Promise<boolean> }).isSessionSupported?.('immersive-ar')?.then(setArSupported).catch(() => {});
    }
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newPoint: Point = { x, y };

      if (mode === 'calibrate') {
        const newPoints = [...points, newPoint];
        setPoints(newPoints);
        if (newPoints.length === 2) {
          const dx = newPoints[1].x - newPoints[0].x;
          const dy = newPoints[1].y - newPoints[0].y;
          const pixelDist = Math.sqrt(dx * dx + dy * dy);
          const realMetres = parseFloat(calibrationLength) || 1;
          setScale(pixelDist / realMetres);
          setPoints([]);
          setMode('measure');
        }
        return;
      }

      const newPoints = [...points, newPoint];
      setPoints(newPoints);
      if (newPoints.length === 2) {
        const dx = newPoints[1].x - newPoints[0].x;
        const dy = newPoints[1].y - newPoints[0].y;
        const pixelDist = Math.sqrt(dx * dx + dy * dy);
        const distanceM = pixelDist / scale;
        setMeasurements((prev) => [...prev, { from: newPoints[0], to: newPoints[1], distanceM }]);
        setPoints([]);
      }
    },
    [points, scale, mode, calibrationLength]
  );

  const clearAll = () => {
    setMeasurements([]);
    setPoints([]);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => { setMode('measure'); setPoints([]); }}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            mode === 'measure'
              ? 'bg-gaff-teal text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📏 Measure
        </button>
        <button
          onClick={() => { setMode('calibrate'); setPoints([]); }}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
            mode === 'calibrate'
              ? 'bg-gaff-gold text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📐 Calibrate
        </button>
        <button onClick={clearAll} className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition">
          ✕ Clear
        </button>
        {mode === 'calibrate' && (
          <div className="flex items-center gap-2 ml-2">
            <label className="text-sm text-gray-600">Known length:</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={calibrationLength}
              onChange={(e) => setCalibrationLength(e.target.value)}
              className="w-20 px-2 py-1 border rounded-lg text-sm"
            />
            <span className="text-sm text-gray-500">m</span>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gaff-warm-dark rounded-xl p-3 text-sm text-gray-600">
        {mode === 'calibrate' ? (
          <p>🎯 Click two endpoints of a known distance (e.g., a door frame is ~2.0m tall). This calibrates the scale.</p>
        ) : (
          <p>👆 Tap two points on the floor plan to measure the distance between them. Calibrate first for accurate results.</p>
        )}
      </div>

      {/* Canvas area */}
      <div
        ref={canvasRef}
        onClick={handleClick}
        className="relative w-full aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-crosshair overflow-hidden select-none"
        style={{ touchAction: 'none' }}
      >
        {/* Placeholder floor plan */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-300">
          <div className="text-center">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mx-auto mb-2 text-gray-300">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="9" y1="9" x2="9" y2="21" />
            </svg>
            <p className="text-sm">Upload a floor plan or tap to measure</p>
          </div>
        </div>

        {/* SVG overlay for measurements */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {measurements.map((m, i) => {
            const midX = (m.from.x + m.to.x) / 2;
            const midY = (m.from.y + m.to.y) / 2;
            return (
              <g key={i}>
                <line x1={m.from.x} y1={m.from.y} x2={m.to.x} y2={m.to.y} stroke="#0D9488" strokeWidth="2" strokeDasharray="6 3" />
                <circle cx={m.from.x} cy={m.from.y} r="5" fill="#0D9488" />
                <circle cx={m.to.x} cy={m.to.y} r="5" fill="#0D9488" />
                <rect x={midX - 28} y={midY - 12} width="56" height="24" rx="6" fill="white" stroke="#0D9488" strokeWidth="1" />
                <text x={midX} y={midY + 4} textAnchor="middle" fontSize="12" fontWeight="600" fill="#0D9488">
                  {m.distanceM.toFixed(2)}m
                </text>
              </g>
            );
          })}
          {/* Active point */}
          {points.map((p, i) => (
            <circle key={`active-${i}`} cx={p.x} cy={p.y} r="6" fill={mode === 'calibrate' ? '#D97706' : '#0D9488'} opacity="0.8">
              <animate attributeName="r" values="6;9;6" dur="1s" repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
      </div>

      {/* Measurements list */}
      {measurements.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
          <div className="px-4 py-3 font-semibold text-sm text-gaff-slate">Measurements</div>
          {measurements.map((m, i) => (
            <div key={i} className="px-4 py-2.5 flex items-center justify-between text-sm">
              <span className="text-gray-600">Measurement {i + 1}</span>
              <span className="font-bold text-gaff-teal">{m.distanceM.toFixed(2)} m</span>
            </div>
          ))}
          <div className="px-4 py-2.5 flex items-center justify-between text-sm bg-gaff-warm">
            <span className="font-semibold text-gaff-slate">Total</span>
            <span className="font-bold text-gaff-teal-dark">
              {measurements.reduce((sum, m) => sum + m.distanceM, 0).toFixed(2)} m
            </span>
          </div>
        </div>
      )}

      {/* AR badge */}
      {arSupported && (
        <div className="bg-gradient-to-r from-gaff-teal to-gaff-teal-light text-white rounded-xl p-4 text-sm">
          <p className="font-semibold mb-1">📱 AR Measurement Available</p>
          <p className="opacity-90">Your device supports AR! Point your camera at a room to measure in real-time.</p>
        </div>
      )}
    </div>
  );
}
