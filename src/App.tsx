import React, { useState, useRef } from 'react';
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
  Heart
} from 'lucide-react';
import { FastCaptcha, FastCaptchaRef } from './components/FastCaptcha/FastCaptcha.tsx';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const captchaRef = useRef<FastCaptchaRef>(null);

  const aiPromptText = `Please integrate the zero-API-key FastCaptcha widget into my form. Follow these exact instructions:

1. Client-Side Widget:
   - Add this script tag inside the <head> or right before the </body> tag:
     <script src="https://fast-captcha.vercel.app/fast-captcha.js" defer></script>
   - Place this captcha element inside my form right above the submit button:
     <div class="fast-captcha" data-theme="dark"></div>
   - Note: The script automatically generates a hidden input field named "fast_captcha_token" once verified. Keep the submit button disabled until verified.

2. Server-Side Verification:
   - When processing the form submission on the backend, extract "fast_captcha_token".
   - Make a POST request to verify the token:
     URL: https://fast-captcha.vercel.app/api/verify
     Headers: { "Content-Type": "application/json" }
     Body: JSON.stringify({ token: fast_captcha_token })
   - If the response is { "success": true }, proceed with the submission.
   - If { "success": false }, reject the submission and show an error to the user.

Ensure the widget is centered, responsive on mobile and desktop, and does not alter my existing form styles.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(aiPromptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2200);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText('<script src="https://fast-captcha.vercel.app/fast-captcha.js" defer></script>\n<div class="fast-captcha" data-theme="dark"></div>');
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2200);
  };

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitted(true);
  };

  const handleResetTest = () => {
    setIsSubmitted(false);
    setToken(null);
    captchaRef.current?.reset();
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden flex flex-col">
      
      {/* 1. MODERN HEADER & NAV */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                FastCaptcha
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase tracking-wider hidden sm:inline-block">
                Zero-API-Key
              </span>
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://fast-captcha.vercel.app/llms.txt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
            >
              <span>Docs (llms.txt)</span>
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

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-16">
        
        {/* 2. HERO SECTION & LIVE DEMO */}
        <section className="text-center space-y-6 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Public CDN & Live Vercel API</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            The Zero-Configuration Captcha for Modern Apps
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            No API keys, no secret setup. Protect your forms in seconds with advanced client entropy and lightweight proof-of-work verification.
          </p>

          {/* Interactive Live Demo Card */}
          <div className="pt-4">
            <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-900/70 border border-zinc-800 shadow-2xl backdrop-blur-xl space-y-5">
              
              <div className="text-left space-y-1 pb-2 border-b border-zinc-800/80">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  Interactive Sandbox Demo
                </h3>
                <p className="text-xs text-zinc-400">
                  Click the checkbox below to test the instant verification flow.
                </p>
              </div>

              {isSubmitted ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-white">Form Submitted Successfully!</p>
                    <p className="text-xs text-zinc-400 font-mono break-all px-2">
                      Verified Token: {token?.slice(0, 20)}...
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetTest}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-all"
                  >
                    Reset Sandbox
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTestSubmit} className="space-y-4">
                  {/* Live FastCaptcha Widget */}
                  <div className="flex justify-center py-2">
                    <FastCaptcha
                      ref={captchaRef}
                      theme="dark"
                      onVerify={(verifiedToken) => setToken(verifiedToken)}
                      onReset={() => setToken(null)}
                    />
                  </div>

                  {/* Test Submit Button */}
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

              {/* Quick Embed Snippet Toggle */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400 border-t border-zinc-800/60">
                <span>CDN: fast-captcha.js</span>
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedScript ? 'Copied HTML' : 'Copy HTML Tag'}</span>
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* 3. 🤖 1-CLICK AI AGENT INTEGRATION HUB (MOBILE-RESPONSIVE) */}
        <section className="w-full max-w-xl mx-auto space-y-4">
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl space-y-5 overflow-hidden">
            
            <div className="space-y-1.5 text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[11px] font-semibold border border-cyan-500/20">
                <Bot className="w-3.5 h-3.5" />
                <span>Zero-Prompt AI Generator</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Integrate with AI Coding Assistants
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Copy this prompt and hand it to ChatGPT, Claude, Cursor, v0, or Bolt to auto-embed FastCaptcha into your website.
              </p>
            </div>

            {/* Prominent Full-Width Copy Button */}
            <button
              type="button"
              onClick={handleCopyPrompt}
              className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl ${
                copiedPrompt
                  ? 'bg-emerald-500 text-zinc-950 shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 shadow-cyan-500/20 active:scale-[0.99] cursor-pointer'
              }`}
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied Prompt to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>📋 Copy Prompt for AI</span>
                </>
              )}
            </button>

            {/* Responsive Code Preview Block */}
            <div className="rounded-2xl bg-[#09090b] border border-zinc-800 overflow-hidden text-left">
              <div className="px-4 py-2 border-b border-zinc-800/80 bg-zinc-950 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>ai-prompt.txt</span>
                </span>
                <span className="text-[10px] text-zinc-500">Live Vercel URLs</span>
              </div>

              <div className="p-4 text-xs font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap break-words select-all max-h-56 overflow-y-auto">
{`Integrate zero-API-key FastCaptcha into my form:
1. Add script: <script src="https://fast-captcha.vercel.app/fast-captcha.js" defer></script>
2. Add widget: <div class="fast-captcha" data-theme="dark"></div>
3. Verify backend token: POST https://fast-captcha.vercel.app/api/verify with { token: fast_captcha_token }`}
              </div>
            </div>

            {/* AI Compatibility Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] text-zinc-400 font-medium">
              <span className="text-zinc-500">Works seamlessly with:</span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">Cursor</span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">Claude</span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">ChatGPT</span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">v0</span>
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">Bolt.new</span>
            </div>

          </div>
        </section>

        {/* 4. FEATURES & COMING SOON GRID */}
        <section className="space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-white">Engine Capabilities</h3>
            <p className="text-xs text-zinc-400">Built for speed, human accessibility, and resilient bot mitigation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Card 1 */}
            <div className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Checkbox Mode</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  Active
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Seamless zero-friction human verification with micro Proof-of-Work and non-blocking background workers.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Slider &amp; 3D Tilt</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                  Coming Soon
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Next-generation interactive spatial rotation puzzles and fluid visual alignment challenges.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white">Built-in DDoS Protection</h4>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-semibold">
                  Active
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                In-memory sliding window rate-limiting rejecting automated burst traffic exceeding 10 req/s per IP.
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* 5. FOOTER */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/60 py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
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
              Machine-Readable Docs (/llms.txt)
            </a>
            <a
              href="https://instagram.com/ritam_2024_0"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-400 transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
