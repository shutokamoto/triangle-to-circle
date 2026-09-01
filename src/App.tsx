import { useState, useMemo, useEffect, useCallback } from 'react';
import { ViewOptions } from './types';
import {
  calculatePolygonMetrics,
  getPolygonVertices,
} from './utils/geometry';
import { toggleAudioMute, getAudioMuted, playStepSound } from './utils/audio';
import { Header } from './components/Header';
import { PolygonCanvas } from './components/PolygonCanvas';
import { SwitchToggles } from './components/SwitchToggles';
import { Controls } from './components/Controls';

export default function App() {
  const [n, setN] = useState<number>(3);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [isMuted, setIsMuted] = useState<boolean>(getAudioMuted());
  const [highlightedVertexIndex, setHighlightedVertexIndex] = useState<number | null>(null);

  // Switch states - default angles, length lines, and circle to ON
  const [options, setOptions] = useState<ViewOptions>({
    showAngles: true,
    showLengthLines: true,
    showCircle: true,
    showMagnifier: false,
  });

  // Calculate polygon metrics and vertices
  const metrics = useMemo(() => calculatePolygonMetrics(n), [n]);
  const vertices = useMemo(() => getPolygonVertices(n), [n]);

  // Sound toggle handler
  const handleToggleSound = useCallback(() => {
    const nextMuted = toggleAudioMute();
    setIsMuted(nextMuted);
  }, []);

  // Reset to equilateral triangle
  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setN(3);
    playStepSound(3);
  }, []);

  // Keyboard navigation for accessible & fun exploration
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        setN((prev) => {
          const next = Math.min(60, prev + 1);
          playStepSound(next);
          return next;
        });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        setN((prev) => {
          const next = Math.max(3, prev - 1);
          playStepSound(next);
          return next;
        });
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800 flex flex-col selection:bg-yellow-300 selection:text-yellow-950">
      {/* Top Header */}
      <Header
        n={n}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onReset={handleReset}
      />

      {/* Main Single-Screen Simulation Viewport */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-2 sm:p-4 flex flex-col gap-2.5 justify-center">
        {/* Compact Switch Toggles */}
        <section aria-label="表示スイッチ">
          <SwitchToggles options={options} onChange={setOptions} />
        </section>

        {/* Primary Interactive Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          {/* Left: Geometry Canvas */}
          <section
            aria-label="図形キャンバス"
            className="lg:col-span-6 xl:col-span-6 flex flex-col items-center justify-center"
          >
            <PolygonCanvas
              metrics={metrics}
              vertices={vertices}
              options={options}
              highlightedVertexIndex={highlightedVertexIndex}
              onSelectVertex={setHighlightedVertexIndex}
            />
          </section>

          {/* Right: Compact Controls */}
          <section
            aria-label="操作パネル"
            className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center"
          >
            <Controls
              n={n}
              onChangeN={setN}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying((p) => !p)}
              playSpeed={playSpeed}
              onChangeSpeed={setPlaySpeed}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
