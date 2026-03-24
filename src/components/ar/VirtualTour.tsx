'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface Hotspot {
  pitch: number;
  yaw: number;
  label: string;
  targetScene: string;
}

interface Scene {
  id: string;
  name: string;
  imageUrl: string;
  hotspots: Hotspot[];
}

interface VirtualTourProps {
  scenes?: Scene[];
}

const DEMO_SCENES: Scene[] = [
  {
    id: 'living-room',
    name: 'Living Room',
    imageUrl: 'https://pannellum.org/images/alma.jpg',
    hotspots: [
      { pitch: -5, yaw: 120, label: 'Go to Kitchen →', targetScene: 'kitchen' },
      { pitch: -5, yaw: -60, label: 'Go to Bedroom →', targetScene: 'bedroom' },
    ],
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    imageUrl: 'https://pannellum.org/images/cerro-toco-0.jpg',
    hotspots: [
      { pitch: -5, yaw: -120, label: '← Back to Living Room', targetScene: 'living-room' },
    ],
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    imageUrl: 'https://pannellum.org/images/alma.jpg',
    hotspots: [
      { pitch: -5, yaw: 60, label: '← Back to Living Room', targetScene: 'living-room' },
    ],
  },
];

declare global {
  interface Window {
    pannellum: any;
  }
}

export default function VirtualTour({ scenes = DEMO_SCENES }: VirtualTourProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const pannellumViewer = useRef<any>(null);
  const [currentScene, setCurrentScene] = useState(scenes[0]?.id || '');
  const [loaded, setLoaded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const initViewer = () => {
    if (!viewerRef.current || !window.pannellum || pannellumViewer.current) return;

    const sceneConfig: Record<string, any> = {};
    scenes.forEach((scene) => {
      sceneConfig[scene.id] = {
        title: scene.name,
        panorama: scene.imageUrl,
        type: 'equirectangular',
        autoLoad: true,
        hotSpots: scene.hotspots.map((h) => ({
          pitch: h.pitch,
          yaw: h.yaw,
          type: 'scene',
          text: h.label,
          sceneId: h.targetScene,
        })),
      };
    });

    pannellumViewer.current = window.pannellum.viewer(viewerRef.current, {
      default: {
        firstScene: scenes[0].id,
        autoLoad: true,
        compass: false,
        showControls: false,
      },
      scenes: sceneConfig,
    });

    pannellumViewer.current.on('scenechange', (sceneId: string) => {
      setCurrentScene(sceneId);
    });
  };

  useEffect(() => {
    if (loaded) initViewer();
    return () => {
      if (pannellumViewer.current) {
        pannellumViewer.current.destroy();
        pannellumViewer.current = null;
      }
    };
  }, [loaded]);

  const goToScene = (sceneId: string) => {
    pannellumViewer.current?.loadScene(sceneId);
    setCurrentScene(sceneId);
  };

  const toggleFullscreen = () => {
    if (!fullscreen) {
      viewerRef.current?.parentElement?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setFullscreen(!fullscreen);
  };

  return (
    <div className="space-y-3">
      <Script
        src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"
        onLoad={() => setLoaded(true)}
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"
      />

      {/* Room nav pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {scenes.map((scene) => (
          <button
            key={scene.id}
            onClick={() => goToScene(scene.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
              currentScene === scene.id
                ? 'bg-gaff-teal text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {scene.name}
          </button>
        ))}
      </div>

      {/* Viewer */}
      <div className="relative rounded-2xl overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
        <div ref={viewerRef} className="w-full h-full" />

        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm opacity-70">Loading 360° viewer...</p>
            </div>
          </div>
        )}

        {/* Controls overlay */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-sm transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">Drag to look around • Click hotspots to navigate between rooms</p>
    </div>
  );
}
