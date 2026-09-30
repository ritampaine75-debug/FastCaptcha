import React, { useState, useRef } from 'react';
import { X, Sliders, Box, BrainCircuit, Sparkles, CheckCircle2, Lock, Shield } from 'lucide-react';

export interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark'
}) => {
  const [activeTab, setActiveTab] = useState<'slider' | '3d' | 'math'>('slider');
  
  // Slider puzzle sandbox state
  const [sliderPos, setSliderPos] = useState<number>(18);
  const targetSliderPos = 68;
  const isSliderSolved = Math.abs(sliderPos - targetSliderPos) < 4;

  // 3D cube rotation sandbox state
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 25, y: 35 });
  const [isDragging3D, setIsDragging3D] = useState(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const is3DSolved = Math.abs(rotation.x - 0) < 12 && Math.abs(rotation.y - 0) < 12;

  // Math challenge state
  const [mathAnswer, setMathAnswer] = useState<string>('');
  const [isMathVerified, setIsMathVerified] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePointerDown3D = (e: React.PointerEvent) => {
    setIsDragging3D(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove3D = (e: React.PointerEvent) => {
    if (!isDragging3D) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    setRotation(prev => ({
      x: Math.max(-80, Math.min(80, prev.x - dy * 0.6)),
      y: (prev.y + dx * 0.6) % 360
    }));
  };

  const handlePointerUp3D = () => {
    setIsDragging3D(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div 
        className="relative w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700/60 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                FastCaptcha Next-Gen Modes
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Preview Lab
                </span>
              </h3>
              <p className="text-xs text-slate-400">Interactive previews of upcoming zero-key verification modes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2 border-b border-slate-800/60 bg-slate-900/50">
          <button
            onClick={() => setActiveTab('slider')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'slider'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Slider Puzzle</span>
            <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
              Coming Soon
            </span>
          </button>

          <button
            onClick={() => setActiveTab('3d')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === '3d'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>3D Spatial Rotation</span>
            <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
              Coming Soon
            </span>
          </button>

          <button
            onClick={() => setActiveTab('math')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'math'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Math & Logic Trap</span>
            <span className="text-[9px] px-1.5 py-0.2 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
              Coming Soon
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* TAB 1: SLIDER PUZZLE */}
          {activeTab === 'slider' && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    Visual Jigsaw Puzzle Fit
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    User drags the slider to fit the missing puzzle piece into the background canvas slot.
                  </p>
                </div>
              </div>

              {/* Interactive Sandbox */}
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-4">
                <div className="relative w-full h-44 rounded-xl overflow-hidden bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 flex items-center justify-center select-none">
                  {/* Background grid design */}
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Target Slot */}
                  <div 
                    className="absolute w-12 h-12 rounded-xl border-2 border-dashed border-cyan-400/80 bg-cyan-950/40 shadow-inner flex items-center justify-center transition-all"
                    style={{ left: `${targetSliderPos}%`, top: '35%' }}
                  >
                    <span className="text-[10px] text-cyan-300 font-mono font-bold">SLOT</span>
                  </div>

                  {/* Moving Jigsaw Piece */}
                  <div
                    className={`absolute w-12 h-12 rounded-xl shadow-2xl flex items-center justify-center transition-all ${
                      isSliderSolved
                        ? 'bg-emerald-500 border-2 border-white scale-105 shadow-emerald-500/50'
                        : 'bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-cyan-200'
                    }`}
                    style={{ left: `${sliderPos}%`, top: '35%' }}
                  >
                    {isSliderSolved ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <Lock className="w-5 h-5 text-white/90" />
                    )}
                  </div>

                  {/* Status Overlay */}
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur text-[10px] font-mono border border-slate-800 flex items-center gap-1.5">
                    <span>Position: {Math.round(sliderPos)}%</span>
                    <span>|</span>
                    <span className={isSliderSolved ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                      {isSliderSolved ? 'ALIGNED ✓' : 'UNALIGNED'}
                    </span>
                  </div>
                </div>

                {/* Slider Track Control */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>Drag slider to match target slot</span>
                    <span className="text-cyan-400 font-mono">{sliderPos}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="88"
                    value={sliderPos}
                    onChange={(e) => setSliderPos(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 3D OBJECT ROTATION */}
          {activeTab === '3d' && (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    3D Spatial Orientation Challenge
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Rotate the 3D isometric artifact with your mouse/touch until the golden face points directly towards the screen.
                  </p>
                </div>
              </div>

              {/* Interactive 3D Cube Canvas */}
              <div 
                className="relative w-full h-52 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center select-none cursor-grab active:cursor-grabbing overflow-hidden"
                onPointerDown={handlePointerDown3D}
                onPointerMove={handlePointerMove3D}
                onPointerUp={handlePointerUp3D}
                onPointerLeave={handlePointerUp3D}
              >
                <div className="w-28 h-28 [perspective:600px] flex items-center justify-center">
                  <div
                    className="relative w-20 h-20 [transform-style:preserve-3d] transition-transform duration-75"
                    style={{
                      transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                    }}
                  >
                    {/* Front Face */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-white/60 flex flex-col items-center justify-center text-slate-900 font-bold text-xs shadow-lg [transform:translateZ(40px)]">
                      <Shield className="w-5 h-5 text-slate-950 mb-0.5" />
                      <span>TARGET</span>
                    </div>
                    {/* Back Face */}
                    <div className="absolute inset-0 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 text-xs [transform:rotateY(180deg)_translateZ(40px)]">
                      <span>BACK</span>
                    </div>
                    {/* Right Face */}
                    <div className="absolute inset-0 rounded-xl bg-cyan-900 border border-cyan-600 flex items-center justify-center text-cyan-200 text-xs [transform:rotateY(90deg)_translateZ(40px)]">
                      <span>RIGHT</span>
                    </div>
                    {/* Left Face */}
                    <div className="absolute inset-0 rounded-xl bg-indigo-900 border border-indigo-600 flex items-center justify-center text-indigo-200 text-xs [transform:rotateY(-90deg)_translateZ(40px)]">
                      <span>LEFT</span>
                    </div>
                    {/* Top Face */}
                    <div className="absolute inset-0 rounded-xl bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300 text-xs [transform:rotateX(90deg)_translateZ(40px)]">
                      <span>TOP</span>
                    </div>
                    {/* Bottom Face */}
                    <div className="absolute inset-0 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 text-xs [transform:rotateX(-90deg)_translateZ(40px)]">
                      <span>BOTTOM</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-2 flex items-center gap-3 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono">
                  <span>Angles: X={Math.round(rotation.x)}° Y={Math.round(rotation.y)}°</span>
                  <span className={is3DSolved ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                    {is3DSolved ? 'SOLVED ✓' : 'ALIGN TARGET TO FRONT'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MATH & LOGIC TRAP */}
          {activeTab === 'math' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Interactive Micro-Trap</span>
                  <p className="text-sm font-semibold text-slate-100">
                    What is <span className="font-mono text-cyan-300 text-base">7 + 5</span> minus <span className="font-mono text-amber-300 text-base">3</span>?
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Answer"
                    value={mathAnswer}
                    onChange={(e) => {
                      setMathAnswer(e.target.value);
                      setIsMathVerified(e.target.value === '9');
                    }}
                    className="w-20 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-center font-mono font-bold text-sm text-cyan-300 focus:outline-none focus:border-cyan-400"
                  />
                  {isMathVerified && (
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>FastCaptcha Modular Security Architecture</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
