import React, { useState } from 'react';

export const ComingSoonModal = ({ isOpen, onClose, theme = 'dark' }) => {
  const [activeTab, setActiveTab] = useState('slider');
  const [sliderPos, setSliderPos] = useState(20);
  const isSliderSolved = Math.abs(sliderPos - 70) < 4;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 text-slate-100 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="font-bold text-base text-cyan-300">FastCaptcha Extended Modes</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg font-bold">×</button>
        </div>

        <div className="flex gap-2">
          {['slider', '3d', 'math'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize ${
                activeTab === t ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
              }`}
            >
              {t} Mode
            </button>
          ))}
        </div>

        {activeTab === 'slider' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="relative h-28 bg-slate-900 rounded-lg flex items-center overflow-hidden">
              <div className="absolute w-10 h-10 border-2 border-dashed border-cyan-400/70 rounded-lg" style={{ left: '70%' }} />
              <div 
                className={`absolute w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isSliderSolved ? 'bg-emerald-500 text-white' : 'bg-cyan-500 text-slate-900'
                }`}
                style={{ left: `${sliderPos}%` }}
              >
                {isSliderSolved ? '✓' : 'FIT'}
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="85"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>
        )}

        {activeTab === '3d' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            Interactive 3D isometric artifact rotation challenge.
          </div>
        )}

        {activeTab === 'math' && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            Zero-friction cognitive logic and arithmetic challenge traps.
          </div>
        )}

        <div className="flex justify-end">
          <button onClick={onClose} className="px-4 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
