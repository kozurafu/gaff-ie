'use client';

import { useState, useMemo } from 'react';

interface SunlightSimProps {
  latitude?: number;
  longitude?: number;
  orientation?: number; // degrees from north, 0 = north-facing front
}

interface Room {
  name: string;
  facing: 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW';
  x: number;
  y: number;
  w: number;
  h: number;
}

const ROOMS: Room[] = [
  { name: 'Kitchen', facing: 'E', x: 0, y: 0, w: 120, h: 100 },
  { name: 'Living Room', facing: 'S', x: 120, y: 0, w: 140, h: 100 },
  { name: 'Bedroom 1', facing: 'W', x: 0, y: 100, w: 120, h: 90 },
  { name: 'Bedroom 2', facing: 'S', x: 120, y: 100, w: 140, h: 90 },
  { name: 'Bathroom', facing: 'N', x: 260, y: 0, w: 80, h: 90 },
];

// Simplified sun position calc for Dublin latitude
function getSunAzimuth(hour: number, month: number): number {
  // Very simplified: sun rises ~E, peaks ~S, sets ~W in northern hemisphere
  // Summer: wider arc (NE to NW), Winter: narrow arc (SE to SW)
  const seasonOffset = Math.cos(((month - 6) / 6) * Math.PI) * 30;
  if (hour < 6 || hour > 21) return -1; // below horizon
  const progress = (hour - 6) / 15; // 0 at 6am, 1 at 9pm
  return (progress * 240 - 120 + seasonOffset + 360) % 360; // degrees from north
}

function facingToAzimuth(facing: string): number {
  const map: Record<string, number> = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };
  return map[facing] ?? 0;
}

function getSunlightIntensity(sunAz: number, roomFacing: string, orientation: number): number {
  if (sunAz < 0) return 0;
  const roomAz = (facingToAzimuth(roomFacing) + orientation) % 360;
  let diff = Math.abs(sunAz - roomAz);
  if (diff > 180) diff = 360 - diff;
  if (diff > 90) return 0;
  return 1 - diff / 90;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function SunlightSim({ latitude = 53.35, longitude = -6.26, orientation = 0 }: SunlightSimProps) {
  const [hour, setHour] = useState(12);
  const [month, setMonth] = useState(5); // June
  const [playing, setPlaying] = useState(false);

  const sunAz = useMemo(() => getSunAzimuth(hour, month), [hour, month]);

  // Auto-play
  useState(() => {
    let interval: NodeJS.Timeout;
    if (playing) {
      interval = setInterval(() => {
        setHour((h) => (h >= 21 ? 6 : h + 0.5));
      }, 200);
    }
    return () => clearInterval(interval);
  });

  const formatHour = (h: number) => {
    const hrs = Math.floor(h);
    const mins = h % 1 === 0.5 ? '30' : '00';
    return `${hrs.toString().padStart(2, '0')}:${mins}`;
  };

  const sunX = sunAz >= 0 ? 160 + Math.sin((sunAz * Math.PI) / 180) * 140 : -50;
  const sunY = sunAz >= 0 ? 220 - Math.cos((sunAz * Math.PI) / 180) * 80 - (hour > 12 ? (hour - 12) * 5 : (12 - hour) * 5) : -50;

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gaff-slate">Time of Day</h3>
          <span className="text-lg font-bold text-gaff-gold">{formatHour(hour)}</span>
        </div>
        <input
          type="range"
          min="5"
          max="22"
          step="0.5"
          value={hour}
          onChange={(e) => setHour(parseFloat(e.target.value))}
          className="w-full accent-gaff-gold"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>5:00</span>
          <span>12:00</span>
          <span>22:00</span>
        </div>

        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gaff-slate">Month</h3>
          <span className="text-sm font-medium text-gaff-teal">{MONTHS[month]}</span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {MONTHS.map((m, i) => (
            <button
              key={m}
              onClick={() => setMonth(i)}
              className={`px-2 py-1 rounded-lg text-xs font-medium transition ${
                month === i ? 'bg-gaff-teal text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Floor plan with sunlight */}
      <div className="relative bg-gradient-to-b from-sky-100 to-sky-50 rounded-2xl p-4 overflow-hidden" style={{ minHeight: 280 }}>
        {/* Sun */}
        {sunAz >= 0 && (
          <div
            className="absolute w-12 h-12 rounded-full bg-yellow-300 shadow-lg shadow-yellow-200/50 flex items-center justify-center text-xl transition-all duration-500"
            style={{ left: sunX, top: Math.max(10, sunY - 60) }}
          >
            ☀️
          </div>
        )}

        {/* Compass */}
        <div className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/80 border border-gray-200 flex items-center justify-center">
          <span className="text-[10px] font-bold text-red-500" style={{ transform: `rotate(${-orientation}deg)` }}>N</span>
        </div>

        {/* Rooms */}
        <svg viewBox="-10 -10 360 210" className="w-full max-w-sm mx-auto">
          {ROOMS.map((room) => {
            const intensity = getSunlightIntensity(sunAz, room.facing, orientation);
            const fill = intensity > 0
              ? `rgba(251, 191, 36, ${intensity * 0.6})`
              : 'rgba(148, 163, 184, 0.1)';
            return (
              <g key={room.name}>
                <rect
                  x={room.x}
                  y={room.y}
                  width={room.w}
                  height={room.h}
                  fill={fill}
                  stroke="#94A3B8"
                  strokeWidth="2"
                  rx="4"
                  className="transition-all duration-500"
                />
                <text
                  x={room.x + room.w / 2}
                  y={room.y + room.h / 2 - 6}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill="#334155"
                >
                  {room.name}
                </text>
                <text
                  x={room.x + room.w / 2}
                  y={room.y + room.h / 2 + 10}
                  textAnchor="middle"
                  fontSize="9"
                  fill={intensity > 0.3 ? '#92400E' : '#94A3B8'}
                  fontWeight={intensity > 0.3 ? '600' : '400'}
                >
                  {intensity > 0.6 ? '☀️ Bright sun' : intensity > 0.3 ? '🌤️ Some sun' : intensity > 0 ? '⛅ Low light' : '🌑 No sun'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-2">
        {ROOMS.filter((r) => r.name !== 'Bathroom').map((room) => {
          // Find best sunlight hours
          const hours = [];
          for (let h = 6; h <= 21; h++) {
            const az = getSunAzimuth(h, month);
            if (getSunlightIntensity(az, room.facing, orientation) > 0.3) hours.push(h);
          }
          return (
            <div key={room.name} className="bg-white rounded-xl border border-gray-100 p-3">
              <div className="font-semibold text-xs text-gaff-slate">{room.name}</div>
              <div className="text-xs text-gray-500 mt-1">
                {hours.length > 0
                  ? `Best light: ${formatHour(hours[0])}–${formatHour(hours[hours.length - 1])}`
                  : 'Limited direct sunlight'}
              </div>
              <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gaff-gold-light to-gaff-gold rounded-full transition-all"
                  style={{ width: `${(hours.length / 16) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
