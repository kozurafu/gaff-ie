'use client';

import { useState } from 'react';
import Script from 'next/script';

interface FurnitureItem {
  id: string;
  name: string;
  emoji: string;
  widthM: number;
  depthM: number;
  heightM: number;
  color: string;
}

const FURNITURE_ITEMS: FurnitureItem[] = [
  { id: 'sofa-3', name: '3-Seater Sofa', emoji: '🛋️', widthM: 2.1, depthM: 0.9, heightM: 0.85, color: '#6B7280' },
  { id: 'sofa-2', name: '2-Seater Sofa', emoji: '🛋️', widthM: 1.5, depthM: 0.85, heightM: 0.85, color: '#9CA3AF' },
  { id: 'bed-double', name: 'Double Bed', emoji: '🛏️', widthM: 1.4, depthM: 1.9, heightM: 0.5, color: '#A78BFA' },
  { id: 'bed-king', name: 'King Bed', emoji: '🛏️', widthM: 1.5, depthM: 2.0, heightM: 0.5, color: '#8B5CF6' },
  { id: 'bed-single', name: 'Single Bed', emoji: '🛏️', widthM: 0.9, depthM: 1.9, heightM: 0.5, color: '#C4B5FD' },
  { id: 'wardrobe', name: 'Wardrobe', emoji: '🗄️', widthM: 1.2, depthM: 0.6, heightM: 2.0, color: '#92400E' },
  { id: 'desk', name: 'Desk', emoji: '🪑', widthM: 1.2, depthM: 0.6, heightM: 0.75, color: '#D97706' },
  { id: 'dining-4', name: 'Dining Table (4)', emoji: '🪑', widthM: 1.2, depthM: 0.8, heightM: 0.75, color: '#B45309' },
  { id: 'dining-6', name: 'Dining Table (6)', emoji: '🪑', widthM: 1.6, depthM: 0.9, heightM: 0.75, color: '#A16207' },
  { id: 'bookshelf', name: 'Bookshelf', emoji: '📚', widthM: 0.8, depthM: 0.3, heightM: 1.8, color: '#78350F' },
];

interface PlacedItem {
  item: FurnitureItem;
  x: number;
  y: number;
  rotated: boolean;
}

const ROOM_SCALE = 50; // pixels per metre

export default function FurniturePlacer() {
  const [placed, setPlaced] = useState<PlacedItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [roomWidth, setRoomWidth] = useState(5);
  const [roomDepth, setRoomDepth] = useState(4);
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);

  const addItem = (item: FurnitureItem) => {
    setPlaced((prev) => [...prev, { item, x: 20, y: 20, rotated: false }]);
  };

  const removeItem = (index: number) => {
    setPlaced((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleRotate = (index: number) => {
    setPlaced((prev) =>
      prev.map((p, i) => (i === index ? { ...p, rotated: !p.rotated } : p))
    );
  };

  const handleMouseDown = (index: number) => (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDragging(index);
    setSelected(placed[index].item.id);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging === null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPlaced((prev) =>
      prev.map((p, i) => (i === dragging ? { ...p, x, y } : p))
    );
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (dragging === null) return;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setPlaced((prev) =>
      prev.map((p, i) => (i === dragging ? { ...p, x, y } : p))
    );
  };

  const handleMouseUp = () => setDragging(null);

  const totalArea = placed.reduce((sum, p) => sum + p.item.widthM * p.item.depthM, 0);
  const roomArea = roomWidth * roomDepth;

  return (
    <div className="space-y-4">
      <Script
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
        type="module"
        onLoad={() => setModelViewerLoaded(true)}
      />

      {/* Room dimensions */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="font-semibold text-sm text-gaff-slate mb-3">Room Dimensions</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">Width</label>
            <input
              type="number"
              step="0.5"
              min="2"
              max="15"
              value={roomWidth}
              onChange={(e) => setRoomWidth(parseFloat(e.target.value) || 5)}
              className="w-20 px-2 py-1.5 border rounded-lg text-sm"
            />
            <span className="text-sm text-gray-400">m</span>
          </div>
          <span className="text-gray-300">×</span>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-500">Depth</label>
            <input
              type="number"
              step="0.5"
              min="2"
              max="15"
              value={roomDepth}
              onChange={(e) => setRoomDepth(parseFloat(e.target.value) || 4)}
              className="w-20 px-2 py-1.5 border rounded-lg text-sm"
            />
            <span className="text-sm text-gray-400">m</span>
          </div>
          <span className="text-sm text-gray-500 ml-auto">{roomArea.toFixed(1)} m²</span>
        </div>
      </div>

      {/* Furniture palette */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="font-semibold text-sm text-gaff-slate mb-3">Furniture — tap to add</h3>
        <div className="flex flex-wrap gap-2">
          {FURNITURE_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => addItem(item)}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 hover:bg-gaff-teal hover:text-white rounded-xl text-xs font-medium transition group"
            >
              <span>{item.emoji}</span>
              <span>{item.name}</span>
              <span className="text-gray-400 group-hover:text-white/70">
                {item.widthM}×{item.depthM}m
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Room canvas */}
      <div
        className="relative bg-white border-2 border-gray-200 rounded-2xl overflow-hidden cursor-move"
        style={{ width: roomWidth * ROOM_SCALE + 40, height: roomDepth * ROOM_SCALE + 40, maxWidth: '100%' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Grid */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ left: 20, top: 20 }}>
          {Array.from({ length: Math.ceil(roomWidth) + 1 }).map((_, i) => (
            <line key={`v${i}`} x1={i * ROOM_SCALE} y1={0} x2={i * ROOM_SCALE} y2={roomDepth * ROOM_SCALE} stroke="#E5E7EB" strokeWidth="1" />
          ))}
          {Array.from({ length: Math.ceil(roomDepth) + 1 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * ROOM_SCALE} x2={roomWidth * ROOM_SCALE} y2={i * ROOM_SCALE} stroke="#E5E7EB" strokeWidth="1" />
          ))}
          {/* Scale labels */}
          {Array.from({ length: Math.ceil(roomWidth) + 1 }).map((_, i) => (
            <text key={`lv${i}`} x={i * ROOM_SCALE} y={-4} textAnchor="middle" fontSize="10" fill="#9CA3AF">{i}m</text>
          ))}
        </svg>

        {/* Placed furniture */}
        {placed.map((p, i) => {
          const w = (p.rotated ? p.item.depthM : p.item.widthM) * ROOM_SCALE;
          const h = (p.rotated ? p.item.widthM : p.item.depthM) * ROOM_SCALE;
          return (
            <div
              key={i}
              className="absolute flex flex-col items-center justify-center text-white text-[10px] font-bold rounded-lg shadow-md select-none"
              style={{
                left: p.x - w / 2 + 20,
                top: p.y - h / 2 + 20,
                width: w,
                height: h,
                backgroundColor: p.item.color,
                opacity: dragging === i ? 0.7 : 0.85,
                cursor: 'grab',
                zIndex: dragging === i ? 50 : 10,
              }}
              onMouseDown={handleMouseDown(i)}
              onTouchStart={handleMouseDown(i)}
            >
              <span className="text-base">{p.item.emoji}</span>
              <span className="truncate max-w-full px-1">{p.item.name}</span>
              <div className="flex gap-1 mt-0.5">
                <button onClick={(e) => { e.stopPropagation(); toggleRotate(i); }} className="bg-white/30 rounded px-1 hover:bg-white/50">↻</button>
                <button onClick={(e) => { e.stopPropagation(); removeItem(i); }} className="bg-white/30 rounded px-1 hover:bg-red-400/50">✕</button>
              </div>
            </div>
          );
        })}

        {/* Door indicator */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-3 bg-gaff-teal rounded-t-lg flex items-center justify-center">
          <span className="text-[8px] text-white font-bold">DOOR</span>
        </div>
      </div>

      {/* Stats */}
      {placed.length > 0 && (
        <div className="bg-gaff-warm-dark rounded-xl p-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gaff-slate">{placed.length}</div>
            <div className="text-xs text-gray-500">Items</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gaff-teal">{totalArea.toFixed(1)} m²</div>
            <div className="text-xs text-gray-500">Furniture area</div>
          </div>
          <div>
            <div className={`text-lg font-bold ${totalArea > roomArea * 0.6 ? 'text-red-500' : 'text-green-600'}`}>
              {((totalArea / roomArea) * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-gray-500">Space used</div>
          </div>
        </div>
      )}
    </div>
  );
}
