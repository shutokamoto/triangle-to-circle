import React from 'react';
import { ViewOptions } from '../types';
import { playToggleSound } from '../utils/audio';

interface SwitchTogglesProps {
  options: ViewOptions;
  onChange: (options: ViewOptions) => void;
}

export const SwitchToggles: React.FC<SwitchTogglesProps> = ({ options, onChange }) => {
  const toggle = (key: keyof ViewOptions) => {
    const nextVal = !options[key];
    playToggleSound(nextVal);
    onChange({
      ...options,
      [key]: nextVal,
    });
  };

  const toggleItems = [
    {
      id: 'toggle-angles',
      key: 'showAngles' as keyof ViewOptions,
      label: 'かくど',
      emoji: '📐',
      activeBg: 'bg-rose-400 border-rose-600 text-rose-950 shadow-[2px_2px_0px_#e11d48]',
      inactiveBg: 'bg-white border-slate-300 text-slate-600 shadow-[1px_1px_0px_#cbd5e1] hover:bg-rose-50',
    },
    {
      id: 'toggle-length',
      key: 'showLengthLines' as keyof ViewOptions,
      label: 'ながさ（中心線）',
      emoji: '📏',
      activeBg: 'bg-purple-400 border-purple-600 text-purple-950 shadow-[2px_2px_0px_#9333ea]',
      inactiveBg: 'bg-white border-slate-300 text-slate-600 shadow-[1px_1px_0px_#cbd5e1] hover:bg-purple-50',
    },
    {
      id: 'toggle-circle',
      key: 'showCircle' as keyof ViewOptions,
      label: 'めざす円',
      emoji: '⭕',
      activeBg: 'bg-sky-400 border-sky-600 text-sky-950 shadow-[2px_2px_0px_#0284c7]',
      inactiveBg: 'bg-white border-slate-300 text-slate-600 shadow-[1px_1px_0px_#cbd5e1] hover:bg-sky-50',
    },
    {
      id: 'toggle-magnifier',
      key: 'showMagnifier' as keyof ViewOptions,
      label: 'かどズーム',
      emoji: '🔍',
      activeBg: 'bg-amber-400 border-amber-600 text-amber-950 shadow-[2px_2px_0px_#d97706]',
      inactiveBg: 'bg-white border-slate-300 text-slate-600 shadow-[1px_1px_0px_#cbd5e1] hover:bg-amber-50',
    },
  ];

  return (
    <div
      id="switch-toggles-container"
      className="flex flex-wrap items-center justify-between gap-2 bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2 border-3 border-sky-200 shadow-[0_3px_0px_#bae6fd]"
    >
      <div className="flex items-center gap-1.5 text-xs font-black text-slate-700">
        <span className="text-sm">🎛️</span>
        <span>ひょうじ:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {toggleItems.map((item) => {
          const isActive = !!options[item.key];
          return (
            <button
              key={item.key}
              id={item.id}
              type="button"
              onClick={() => toggle(item.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-3 font-black text-xs sm:text-sm transition-all cursor-pointer active:translate-y-0.5 active:shadow-none ${
                isActive ? item.activeBg : item.inactiveBg
              }`}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-black border ${
                  isActive
                    ? 'bg-white/90 text-slate-900 border-black/20'
                    : 'bg-slate-200 text-slate-600 border-slate-300'
                }`}
              >
                {isActive ? 'ON' : 'OFF'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
