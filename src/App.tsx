import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Bot, 
  Lock, 
  Zap, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  ArrowRight,
  Terminal,
  RefreshCw,
  Compass,
  MoveHorizontal,
  BookOpen,
  MessageSquareCode
} from 'lucide-react';
import { FastCaptcha, FastCaptchaRef } from './components/FastCaptcha/FastCaptcha.tsx';

type CaptchaMode = 'checkbox' | 'slider' | 'tilt';

export default function App() {
  const [activeMode, setActiveMode] = useState<CaptchaMode>('checkbox');
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Checkbox widget ref
  const checkboxRef = useRef<FastCaptchaRef>(null);

  // Slider State
  const [sliderProgress, setSliderProgress] = useState<number>(0);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const [sliderVerified, setSliderVerified] = useState<boolean>(false);
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  // 3D Tilt State
  const [tiltRotation, setTiltRotation] = useState<{ x: number; y: number; angle: number }>({ x: 0, y: 0, angle: 35 });
  const [targetTiltAngle] = useState<number>(0);
  const [tiltVerified, setTiltVerified] = useState<boolean>(false);
  const [isDraggingTilt, setIsDraggingTilt] = useState<boolean>(false);
  const tiltCardRef = useRef<HTMLDivElement>(null);

  // Exact Interactive Step-Consultant Meta-Prompt
  const aiPromptText = `You are an expert full-stack developer integrating the zero-API-key FastCaptcha system (hosted at https://fast-captcha.vercel.app/).

STEP 1: READ LIVE DOCUMENTATION
First, read the official machine-readable documentation:
URL: https://fast-captcha.vercel.app/llms.txt
CDN Script: https://fast-captcha.vercel.app/fast-captcha.js
Verification Endpoint: https://fast-captcha.vercel.app/api/verify (POST)

STEP 2: ASK ME (THE USER) FOR CONFIGURATION BEFORE CODING
Do not write the final code immediately. First, ask me these two questions:
1. "Which pages/forms do you want to protect? (e.g., Login, Registration, Contact Form, Payment)"
2. "Which verification flow do you want to implement?"
   - Mode A: Checkbox Mode only ("I am not a robot")
   - Mode B: Slide to Verify only
   - Mode C: 3D Tilt Alignment only
   - Mode D: Multi-Step Chain (e.g., Step 1 Checkbox -> Step 2 Slider -> Step 3 3D Tilt)
   - Mode E: Mixed (e.g., Checkbox on Login, Slider on Payments)

STEP 3: IMPLEMENTATION RULES (AFTER I ANSWER)
Once I reply with my desired setup:
- Inject the standalone script: <script src="https://fast-captcha.vercel.app/fast-captcha.js" defer></script>
- Set up the container with the selected mode(s):
  <div class="fast-captcha" data-mode="checkbox|slider|tilt|multistep" data-theme="dark"></div>
- Listen for the fastcaptcha:verified DOM event or use the automatically injected <input type="hidden" name="fast_captcha_token" />.
- On my backend form handler, verify the token by making a POST call to:
  https://fast-captcha.vercel.app/api/verify
  with body: { "token": fast_captcha_token, "mode": "<mode_used>" }
- Keep the submit button disabled until verification is complete.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(aiPromptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2200);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText('<script src="https://fast-captcha.vercel.app/fast-captcha.js" defer></script>\n<div class="fast-captcha" data-mode="checkbox" data-theme="dark"></div>');
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2200);
  };

  const handleModeChange = (mode: CaptchaMode) => {
    setActiveMode(mode);
    setToken(null);
    setIsSubmitted(false);
    setSliderProgress(0);
    setSliderVerified(false);
    setTiltVerified(false);
    setTiltRotation({ x: 0, y: 0, angle: 35 });
    if (checkboxRef.current) {
      checkboxRef.current.reset();
    }
  };

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitted(true);
  };

  const handleResetTest = () => {
    setIsSubmitted(false);
    setToken(null);
    setSliderProgress(0);
    setSliderVerified(false);
    setTiltVerified(false);
    setTiltRotation({ x: 0, y: 0, angle: 35 });
    if (checkboxRef.current) {
      checkboxRef.current.reset();
    }
  };

  // ----------------------------------------------------
  // SLIDER INTERACTION HANDLERS (MOUSE & TOUCH)
  // ----------------------------------------------------
  const handleSliderMove = useCallback((clientX: number) => {
    if (!isDraggingSlider || sliderVerified) return;
    const track = sliderTrackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width - 44));
    const maxOffset = rect.width - 44;
    const progress = Math.min(100, Math.max(0, (offsetX / maxOffset) * 100));
    setSliderProgress(progress);

    if (progress >= 95) {
      setIsDraggingSlider(false);
      setSliderProgress(100);
      setSliderVerified(true);
      const generatedToken = 'fctok_slide_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      setToken(generatedToken);
    }
  }, [isDraggingSlider, sliderVerified]);

  const handleSliderEnd = useCallback(() => {
    if (sliderVerified) return;
    setIsDraggingSlider(false);
    if (sliderProgress < 95) {
      setSliderProgress(0);
    }
  }, [sliderProgress, sliderVerified]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleSliderMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handleSliderMove(e.touches[0].clientX);
    };
    const onEnd = () => handleSliderEnd();

    if (isDraggingSlider) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDraggingSlider, handleSliderMove, handleSliderEnd]);

  // ----------------------------------------------------
  // 3D TILT ALIGNMENT HANDLERS
  // ----------------------------------------------------
  const handleTiltPointerMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (tiltVerified) return;
    const card = tiltCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) / rect.width - 0.5;
    const y = (clientY - rect.top) / rect.height - 0.5;

    const angle = Math.round((x * 60) + (y * 20));
    setTiltRotation({ x: y * 25, y: -x * 25, angle });

    if (Math.abs(angle - targetTiltAngle) <= 4 && (isDraggingTilt || 'touches' in e)) {
      setTiltRotation({ x: 0, y: 0, angle: 0 });
      setTiltVerified(true);
      const generatedToken = 'fctok_tilt_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      setToken(generatedToken);
      setIsDraggingTilt(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden flex flex-col">
      
      {/* 1. HEADER & NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                FastCaptcha
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase tracking-wider hidden sm:inline-block">
                Zero-API-Key • Free
              </span>
            </div>
          </div>

          {/* Header Action Links */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://fast-captcha.vercel.app/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Docs (llms.txt)</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>

            <a
              href="https://instagram.com/ritam_2024_0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 hover:from-cyan-500/20 hover:to-indigo-500/20 border border-cyan-500/30 text-cyan-300 transition-all flex items-center gap-1.5"
            >
              <span className="text-xs">🇮🇳</span>
              <span className="hidden sm:inline">Built by</span>
              <span className="font-bold">@ritam_2024_0</span>
            </a>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
        
        {/* 2. HERO SANDBOX & MODE SWITCHER */}
        <section className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Zero-Key Captcha Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Next-Generation Zero-Key Captcha Engine
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            No registration, no API keys, and zero UI lag. Try the live interactive modes below:
          </p>

          {/* Mode Selector Tabs (Pills) */}
          <div className="flex items-center justify-center p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800 max-w-md mx-auto">
            <button
              onClick={() => handleModeChange('checkbox')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'checkbox'
                  ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Checkbox</span>
            </button>

            <button
              onClick={() => handleModeChange('slider')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'slider'
                  ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <MoveHorizontal className="w-3.5 h-3.5" />
              <span>Slide to Verify</span>
            </button>

            <button
              onClick={() => handleModeChange('tilt')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'tilt'
                  ? 'bg-cyan-500 text-zinc-950 shadow-md shadow-cyan-500/20'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>3D Tilt Alignment</span>
            </button>
          </div>

          {/* Active Interactive Sandbox Card */}
          <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-2xl backdrop-blur-xl space-y-6">
            
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="text-left">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  {activeMode === 'checkbox' && 'Standard Checkbox Mode'}
                  {activeMode === 'slider' && 'Interactive Slider Puzzle'}
                  {activeMode === 'tilt' && '3D Tilt Alignment Puzzle'}
                </span>
                <span className="text-[11px] text-zinc-400 block mt-0.5">
                  {activeMode === 'checkbox' && 'Click the box for micro PoW verification'}
                  {activeMode === 'slider' && 'Drag thumb to the right edge (100%)'}
                  {activeMode === 'tilt' && 'Move mouse or drag to level the shield to 0°'}
                </span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                token ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {token ? 'Verified' : 'Pending'}
              </span>
            </div>

            {isSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Form Submitted Successfully!</p>
                  <p className="text-xs text-zinc-400 font-mono break-all px-2">
                    Token: {token?.slice(0, 22)}...
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetTest}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-all cursor-pointer"
                >
                  Test Again
                </button>
              </div>
            ) : (
              <form onSubmit={handleTestSubmit} className="space-y-5">
                
                {/* 1. CHECKBOX MODE WIDGET */}
                {activeMode === 'checkbox' && (
                  <div className="flex justify-center py-2">
                    <FastCaptcha
                      ref={checkboxRef}
                      theme="dark"
                      onVerify={(verifiedToken) => setToken(verifiedToken)}
                      onReset={() => setToken(null)}
                    />
                  </div>
                )}

                {/* 2. SLIDER PUZZLE MODE */}
                {activeMode === 'slider' && (
                  <div className="py-2 space-y-2">
                    <div 
                      ref={sliderTrackRef}
                      className={`relative w-full h-12 rounded-2xl border transition-colors flex items-center overflow-hidden select-none ${
                        sliderVerified
                          ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                          : 'bg-zinc-950 border-zinc-700 hover:border-zinc-600'
                      }`}
                    >
                      {/* Active Fill Track */}
                      <div 
                        className={`absolute left-0 top-0 bottom-0 transition-all duration-75 ${
                          sliderVerified ? 'bg-emerald-500/30' : 'bg-cyan-500/20'
                        }`}
                        style={{ width: `${sliderProgress}%` }}
                      />

                      {/* Track Center Instruction */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs font-semibold text-zinc-400">
                        {sliderVerified ? (
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <Check className="w-4 h-4" />
                            Verification Complete
                          </span>
                        ) : (
                          <span>Slide to Verify &gt;&gt;</span>
                        )}
                      </div>

                      {/* Draggable Thumb */}
                      <div
                        onMouseDown={() => !sliderVerified && setIsDraggingSlider(true)}
                        onTouchStart={() => !sliderVerified && setIsDraggingSlider(true)}
                        className={`absolute left-1 top-1 bottom-1 w-10 rounded-xl flex items-center justify-center transition-transform cursor-grab active:cursor-grabbing shadow-lg select-none ${
                          sliderVerified
                            ? 'bg-emerald-500 text-zinc-950 shadow-emerald-500/30'
                            : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-zinc-950 hover:scale-105 active:scale-95'
                        }`}
                        style={{
                          transform: `translateX(${(sliderProgress / 100) * ((sliderTrackRef.current?.offsetWidth || 300) - 48)}px)`
                        }}
                      >
                        {sliderVerified ? (
                          <Check className="w-5 h-5 font-black" />
                        ) : (
                          <ArrowRight className="w-5 h-5 font-bold animate-pulse" />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. 3D TILT ALIGNMENT MODE */}
                {activeMode === 'tilt' && (
                  <div className="py-2 space-y-3">
                    <div
                      ref={tiltCardRef}
                      onMouseMove={handleTiltPointerMove}
                      onTouchMove={handleTiltPointerMove}
                      onMouseDown={() => setIsDraggingTilt(true)}
                      onMouseUp={() => setIsDraggingTilt(false)}
                      onTouchStart={() => setIsDraggingTilt(true)}
                      onTouchEnd={() => setIsDraggingTilt(false)}
                      className={`relative w-full h-36 rounded-2xl border p-4 flex flex-col items-center justify-center cursor-pointer transition-all duration-150 overflow-hidden select-none ${
                        tiltVerified
                          ? 'bg-emerald-950/30 border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                          : 'bg-zinc-950 border-zinc-700 hover:border-cyan-500/50'
                      }`}
                      style={{
                        perspective: '800px'
                      }}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:12px_12px] opacity-40" />

                      {/* Rotating Target Object */}
                      <div
                        className="relative z-10 p-3.5 rounded-2xl transition-transform duration-100 flex items-center justify-center shadow-xl"
                        style={{
                          transform: `rotateX(${tiltRotation.x}deg) rotateY(${tiltRotation.y}deg) rotate(${tiltRotation.angle}deg)`,
                          background: tiltVerified 
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : 'linear-gradient(135deg, #06b6d4, #2563eb)'
                        }}
                      >
                        <ShieldCheck className="w-8 h-8 text-white" />
                      </div>

                      <div className="relative z-10 mt-3 text-center">
                        <span className={`text-xs font-bold ${tiltVerified ? 'text-emerald-400' : 'text-zinc-300'}`}>
                          {tiltVerified ? '✓ Shield Aligned (0°)' : `Current Angle: ${tiltRotation.angle}° (Aim for 0°)`}
                        </span>
                        <span className="text-[10px] text-zinc-500 block">
                          {tiltVerified ? 'Human validation confirmed' : 'Tilt or drag to balance the shield vertically'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={!token}
                  className={`w-full py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                    token
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-cyan-500/25 active:scale-[0.99] cursor-pointer'
                      : 'bg-zinc-800/80 text-zinc-500 cursor-not-allowed border border-zinc-800'
                  }`}
                >
                  <span>{token ? 'Test Submit (Verified)' : 'Verify Captcha to Submit'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Quick Embed Snippet Action */}
            <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800/60">
              <span>CDN: fast-captcha.js</span>
              <button
                type="button"
                onClick={handleCopyScript}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedScript ? 'Copied HTML' : 'Copy HTML Tag'}</span>
              </button>
            </div>

          </div>
        </section>

        {/* 3. MOBILE-OPTIMIZED AI INTEGRATION HUB (INTERACTIVE CONSULTANT META-PROMPT) */}
        <section className="w-full max-w-xl mx-auto space-y-4">
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl space-y-5 overflow-hidden w-full">
            
            <div className="space-y-1.5 text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[11px] font-semibold border border-cyan-500/20">
                <MessageSquareCode className="w-3.5 h-3.5 text-cyan-400" />
                <span>Interactive Step-Consultant Meta-Prompt</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                🤖 Integrate with AI Agents (Cursor, ChatGPT, Claude, v0, Bolt)
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Copy this prompt and hand it to your AI coding assistant. The AI will first read <a href="https://fast-captcha.vercel.app/llms.txt" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">llms.txt</a> and consult you on your desired flow before generating code.
              </p>
            </div>

            {/* Single-Click Action Button */}
            <button
              type="button"
              onClick={handleCopyPrompt}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
                copiedPrompt
                  ? 'bg-emerald-500 text-zinc-950 shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 shadow-cyan-500/20 active:scale-[0.99]'
              }`}
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>📋 Copy Integration Prompt</span>
                </>
              )}
            </button>

            {/* Mobile-Friendly Code Preview Block */}
            <div className="rounded-2xl bg-[#09090b] border border-zinc-800 overflow-hidden text-left w-full">
              <div className="px-4 py-2 border-b border-zinc-800/80 bg-zinc-950 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ai-consultant-prompt.md</span>
                </span>
                <span className="text-[10px] text-zinc-500">Live Vercel URLs</span>
              </div>

              <div className="p-4 text-xs font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap break-words select-all max-h-64 overflow-y-auto">
{aiPromptText}
              </div>
            </div>

            {/* AI Assistant Compatibility Tags */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-zinc-400 font-medium">
              <span className="text-zinc-500">Tested with:</span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">Cursor Composer</span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">Claude 3.7 Sonnet</span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">ChatGPT-4o</span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">v0 by Vercel</span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">Bolt.new</span>
            </div>

          </div>
        </section>

      </main>

      {/* 4. FOOTER */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/60 py-8 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span>FastCaptcha</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-zinc-300">
              Developed in India <span className="text-xs">🇮🇳</span> by
              <a
                href="https://instagram.com/ritam_2024_0"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 font-semibold ml-1 underline decoration-cyan-500/40"
              >
                @ritam_2024_0
              </a>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://fast-captcha.vercel.app/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              https://fast-captcha.vercel.app/llms.txt
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
