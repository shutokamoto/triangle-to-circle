import React from 'react';
import { Volume2, VolumeX, RotateCcw, Sparkles } from 'lucide-react';
import { getPolygonName } from '../utils/geometry';

interface HeaderProps {
  n: number;
  isMuted: boolean;
  onToggleSound: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  n,
  isMuted,
  onToggleSound,
  onReset,
}) => {
  const polygonName = getPolygonName(n);

  return (
    <header
      id="app-header"
      className="w-full bg-sky-100/90 backdrop-blur-md border-b-4 border-sky-200 px-4 py-3 sm:px-6 sticky top-0 z-30 shadow-sm"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        {/* Left: App Title Badge in Yellow Pill with thick border and solid shadow */}
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400 border-4 border-yellow-600 rounded-full px-5 sm:px-7 py-2 shadow-[3px_3px_0px_#ca8a04] flex items-center gap-2">
            <span className="text-xl sm:text-2xl">📐</span>
            <h1 className="text-lg sm:text-2xl font-black text-yellow-950 tracking-tight">
              かたちの しんか
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-2xl border-3 border-sky-300 shadow-[2px_2px_0px_#7dd3fc]">
            <span className="text-sm font-black text-sky-900">{polygonName}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-800 text-xs font-black">
              角の数: {n}
            </span>
          </div>
        </div>

        {/* Right: Quick Tool Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            id="sound-toggle-btn"
            type="button"
            onClick={onToggleSound}
            className={`p-2.5 sm:p-3 rounded-2xl border-4 transition-all cursor-pointer flex items-center justify-center active:translate-y-0.5 active:shadow-none ${
              isMuted
                ? 'bg-slate-200 border-slate-400 text-slate-500 shadow-[2px_2px_0px_#94a3b8]'
                : 'bg-sky-400 border-sky-600 text-sky-950 shadow-[3px_3px_0px_#0284c7]'
            }`}
            title={isMuted ? '音を出す' : '音を消す'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 stroke-[2.5]" />}
          </button>

          {/* Reset Button */}
          <button
            id="reset-btn"
            type="button"
            onClick={onReset}
            className="p-2.5 sm:p-3 rounded-2xl bg-rose-400 hover:bg-rose-500 active:translate-y-0.5 active:shadow-none border-4 border-rose-600 text-rose-950 shadow-[3px_3px_0px_#e11d48] transition-all cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm font-black"
            title="さいしょ（正三角形）にもどす"
          >
            <RotateCcw className="w-4 h-4 stroke-[2.5]" />
            <span>さいしょに戻す</span>
          </button>
        </div>
      </div>
    </header>
  );
};
