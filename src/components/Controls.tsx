import React, { useEffect, useRef } from 'react';
import { playStepSound } from '../utils/audio';
import { getPolygonName } from '../utils/geometry';

interface ControlsProps {
  n: number;
  onChangeN: (n: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playSpeed: 'slow' | 'normal' | 'fast';
  onChangeSpeed: (speed: 'slow' | 'normal' | 'fast') => void;
}

export const Controls: React.FC<ControlsProps> = ({
  n,
  onChangeN,
  isPlaying,
  onTogglePlay,
  playSpeed,
  onChangeSpeed,
}) => {
  const timerRef = useRef<number | null>(null);

  const presets = [
    { count: 3, label: '3' },
    { count: 4, label: '4' },
    { count: 5, label: '5' },
    { count: 6, label: '6' },
    { count: 8, label: '8' },
    { count: 12, label: '12' },
    { count: 24, label: '24' },
    { count: 50, label: '50' },
  ];

  // Step helper
  const handleStep = (delta: number) => {
    const nextN = Math.max(3, Math.min(60, n + delta));
    if (nextN !== n) {
      playStepSound(nextN);
      onChangeN(nextN);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextN = parseInt(e.target.value, 10);
    if (!isNaN(nextN) && nextN !== n) {
      playStepSound(nextN);
      onChangeN(nextN);
    }
  };

  const handlePresetClick = (targetN: number) => {
    playStepSound(targetN);
    onChangeN(targetN);
  };

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const intervals = {
      slow: 700,
      normal: 350,
      fast: 150,
    };

    timerRef.current = window.setInterval(() => {
      onChangeN((prev) => {
        const next = prev >= 50 ? 3 : prev + 1;
        playStepSound(next);
        return next;
      });
    }, intervals[playSpeed]);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isPlaying, playSpeed, onChangeN]);

  const polygonName = getPolygonName(n);

  return (
    <div
      id="controls-container"
      className="bg-sky-100 p-3 sm:p-4 rounded-3xl border-3 border-sky-200 shadow-[0_4px_0px_#bae6fd] flex flex-col gap-3"
    >
      {/* Top Stepper & Counter */}
      <div className="flex items-center justify-between gap-2">
        {/* Minus Step Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            id="step-minus-5-btn"
            type="button"
            onClick={() => handleStep(-5)}
            disabled={n <= 3}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-400 hover:bg-rose-500 active:translate-y-0.5 active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed text-white font-black text-xs flex items-center justify-center border-2 border-rose-600 shadow-[0_2px_0px_#e11d48] transition-all cursor-pointer"
            title="5つへらす"
          >
            -5
          </button>
          <button
            id="step-minus-1-btn"
            type="button"
            onClick={() => handleStep(-1)}
            disabled={n <= 3}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-rose-500 hover:bg-rose-600 active:translate-y-0.5 active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed text-white font-black text-xl flex items-center justify-center border-3 border-rose-700 shadow-[0_3px_0px_#be123c] transition-all cursor-pointer"
            title="1つへらす"
          >
            −
          </button>
        </div>

        {/* Center: Hero Corner Display Card */}
        <div className="flex-1 min-w-[140px] text-center px-3 py-1.5 bg-white rounded-2xl border-3 border-sky-300 shadow-[2px_2px_0px_#7dd3fc] flex flex-col items-center justify-center">
          <span className="text-[11px] text-sky-800 font-black">
            かどの数: {n}
          </span>
          <div className="flex items-center justify-center">
            <span className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {polygonName}
            </span>
          </div>
        </div>

        {/* Plus Step Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            id="step-plus-1-btn"
            type="button"
            onClick={() => handleStep(1)}
            disabled={n >= 60}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-emerald-500 hover:bg-emerald-600 active:translate-y-0.5 active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed text-white font-black text-xl flex items-center justify-center border-3 border-emerald-700 shadow-[0_3px_0px_#047857] transition-all cursor-pointer"
            title="1つふやす"
          >
            +
          </button>
          <button
            id="step-plus-5-btn"
            type="button"
            onClick={() => handleStep(5)}
            disabled={n >= 60}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-400 hover:bg-emerald-500 active:translate-y-0.5 active:shadow-none disabled:opacity-30 disabled:cursor-not-allowed text-white font-black text-xs flex items-center justify-center border-2 border-emerald-600 shadow-[0_2px_0px_#059669] transition-all cursor-pointer"
            title="5つふやす"
          >
            +5
          </button>
        </div>
      </div>

      {/* Main Slider */}
      <div className="w-full flex flex-col gap-1 px-1">
        <div className="flex justify-between items-center text-[11px] font-black text-sky-900">
          <span>3</span>
          <span className="text-slate-500 font-bold">スライダーで自由にへんか</span>
          <span>60</span>
        </div>

        <input
          id="polygon-n-slider"
          type="range"
          min="3"
          max="60"
          step="1"
          value={n}
          onChange={handleSliderChange}
          className="w-full h-4 bg-sky-200 rounded-full appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-600 transition-all border-2 border-sky-300 shadow-inner"
        />
      </div>

      {/* Preset Quick Select */}
      <div className="flex flex-col gap-1">
        <span className="text-[11px] text-sky-900 font-black px-1">
          代表的な図形
        </span>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
          {presets.map((p) => {
            const isSelected = n === p.count;
            return (
              <button
                key={p.count}
                id={`preset-btn-${p.count}`}
                type="button"
                onClick={() => handlePresetClick(p.count)}
                className={`py-2 px-1 rounded-xl font-black flex items-center justify-center border-2 transition-all cursor-pointer active:translate-y-0.5 active:shadow-none ${
                  isSelected
                    ? 'border-yellow-600 bg-yellow-400 text-yellow-950 shadow-[2px_2px_0px_#ca8a04] scale-105'
                    : 'border-sky-300 bg-white text-slate-800 shadow-[1px_1px_0px_#7dd3fc] hover:bg-yellow-50'
                }`}
              >
                <span className="text-sm font-black">{p.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Animation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t-2 border-sky-200">
        {/* Play/Pause Button */}
        <button
          id="toggle-animation-btn"
          type="button"
          onClick={onTogglePlay}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-sm border-3 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer ${
            isPlaying
              ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-700 shadow-[0_3px_0px_#be123c] animate-pulse'
              : 'bg-blue-500 hover:bg-blue-600 text-white border-blue-700 shadow-[0_3px_0px_#1d4ed8]'
          }`}
        >
          <span>{isPlaying ? '⏸️' : '▶️'}</span>
          <span>{isPlaying ? 'ていし' : 'じどう変化'}</span>
        </button>

        {/* Speed Selector */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border-2 border-sky-300 shadow-[1px_1px_0px_#7dd3fc]">
          {(['slow', 'normal', 'fast'] as const).map((spd) => {
            const labels = { slow: 'おそい', normal: 'ふつう', fast: 'はやい' };
            const isActive = playSpeed === spd;
            return (
              <button
                key={spd}
                id={`speed-btn-${spd}`}
                type="button"
                onClick={() => onChangeSpeed(spd)}
                className={`px-2 py-0.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-400 border border-sky-600 text-sky-950 shadow-[1px_1px_0px_#0284c7]'
                    : 'text-slate-600 hover:text-slate-900 border border-transparent'
                }`}
              >
                {labels[spd]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
