import React, { useState, useMemo } from 'react';
import { 
  Bot, 
  Sparkles, 
  Copy, 
  Check, 
  Code2, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Terminal, 
  ExternalLink, 
  CheckCircle2, 
  Zap, 
  Wand2, 
  ArrowRight,
  FileCode,
  Globe,
  Sliders,
  Share2
} from 'lucide-react';

export interface AiIntegrationHubProps {
  theme?: 'dark' | 'light';
  className?: string;
}

type Framework = 'react' | 'nextjs' | 'html' | 'vue' | 'svelte' | 'angular' | 'php';
type ThemeOption = 'dark' | 'light' | 'auto';
type FormType = 'login' | 'registration' | 'contact' | 'checkout' | 'password_reset';
type BackendTarget = 'express' | 'next_server_action' | 'fastapi' | 'php' | 'cloudflare';

interface AiAssistant {
  id: string;
  name: string;
  badge: string;
  color: string;
  url?: string;
}

const AI_ASSISTANTS: AiAssistant[] = [
  { id: 'cursor', name: 'Cursor AI', badge: 'Composer / Agent', color: 'from-cyan-500 to-blue-600' },
  { id: 'claude', name: 'Claude 3.7 Sonnet', badge: 'Artifacts', color: 'from-amber-500 to-orange-600', url: 'https://claude.ai' },
  { id: 'chatgpt', name: 'ChatGPT-4o', badge: 'Canvas', color: 'from-emerald-500 to-teal-600', url: 'https://chatgpt.com' },
  { id: 'v0', name: 'v0 by Vercel', badge: 'UI Gen', color: 'from-zinc-400 to-slate-200', url: 'https://v0.dev' },
  { id: 'bolt', name: 'Bolt.new', badge: 'Full-Stack WebContainer', color: 'from-blue-500 to-cyan-400', url: 'https://bolt.new' },
  { id: 'lovable', name: 'Lovable', badge: 'AI Builder', color: 'from-pink-500 to-rose-600' },
  { id: 'windsurf', name: 'Windsurf', badge: 'Cascade Flow', color: 'from-indigo-500 to-purple-600' },
];

export const AiIntegrationHub: React.FC<AiIntegrationHubProps> = ({
  theme = 'dark',
  className = ''
}) => {
  const [selectedFramework, setSelectedFramework] = useState<Framework>('react');
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>('dark');
  const [selectedForm, setSelectedForm] = useState<FormType>('login');
  const [selectedBackend, setSelectedBackend] = useState<BackendTarget>('express');
  const [includeAntiDdos, setIncludeAntiDdos] = useState<boolean>(true);
  const [selectedAssistant, setSelectedAssistant] = useState<string>('cursor');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'code_preview' | 'instructions'>('prompt');

  const frameworkLabels: Record<Framework, { label: string; ext: string; icon: string }> = {
    react: { label: 'React (Vite / CRA)', ext: 'JSX/TSX', icon: '⚛️' },
    nextjs: { label: 'Next.js (App / Pages)', ext: 'TSX', icon: '▲' },
    html: { label: 'Vanilla HTML / JS', ext: 'HTML', icon: '🌐' },
    vue: { label: 'Vue 3 (SFC / Nuxt)', ext: 'VUE', icon: '🟢' },
    svelte: { label: 'Svelte / SvelteKit', ext: 'SVELTE', icon: '🔥' },
    angular: { label: 'Angular', ext: 'TS/HTML', icon: '🅰️' },
    php: { label: 'PHP / Laravel / WordPress', ext: 'PHP', icon: '🐘' },
  };

  const formLabels: Record<FormType, string> = {
    login: 'Login / Sign In Form',
    registration: 'User Registration / Sign Up Form',
    contact: 'Contact & Support Inquiry Form',
    checkout: 'Checkout / Payment Wire Transfer',
    password_reset: 'Password Reset & Account Recovery',
  };

  const backendLabels: Record<BackendTarget, string> = {
    express: 'Node.js Express / Fastify',
    next_server_action: 'Next.js Server Actions / Route Handlers',
    fastapi: 'Python FastAPI / Flask',
    php: 'PHP Backend Script',
    cloudflare: 'Cloudflare Worker / Edge Runtime',
  };

  // Generate an ultra-high precision prompt for AI models
  const generatedPrompt = useMemo(() => {
    const fw = frameworkLabels[selectedFramework].label;
    const form = formLabels[selectedForm];
    const th = selectedTheme;
    const bk = backendLabels[selectedBackend];

    let clientInstructions = '';
    if (selectedFramework === 'react') {
      clientInstructions = `1. FRONTEND CLIENT INTEGRATION (React):
   - Import the zero-key FastCaptcha component into the ${form} component:
     \`\`\`tsx
     import { FastCaptcha } from 'fast-captcha-react';
     // Or local component: import { FastCaptcha } from '@/components/FastCaptcha';
     \`\`\`
   - Add state to hold the verified pass token:
     \`const [captchaToken, setCaptchaToken] = useState<string | null>(null);\`
   - Place the widget directly above the submit button:
     \`\`\`tsx
     <FastCaptcha
       theme="${th}"
       onVerify={(token, details) => {
         setCaptchaToken(token);
         console.log('FastCaptcha verified with score:', details.riskScore);
       }}
       onReset={() => setCaptchaToken(null)}
     />
     \`\`\`
   - Lock the form submission button with \`disabled={!captchaToken}\` so bots cannot submit without solving the micro Proof-of-Work.`;
    } else if (selectedFramework === 'nextjs') {
      clientInstructions = `1. FRONTEND CLIENT INTEGRATION (Next.js App/Pages):
   - Mark the component with \`'use client';\` at the top.
   - Import and place the FastCaptcha widget in your ${form}:
     \`\`\`tsx
     'use client';
     import { useState } from 'react';
     import { FastCaptcha } from 'fast-captcha-react';

     export function ${selectedForm === 'login' ? 'LoginForm' : 'ProtectedForm'}() {
       const [captchaToken, setCaptchaToken] = useState<string | null>(null);

       return (
         <form action={handleSubmit}>
           {/* Existing form input fields */}
           
           <div className="my-4 flex justify-center">
             <FastCaptcha 
               theme="${th}" 
               onVerify={(token) => setCaptchaToken(token)}
               onReset={() => setCaptchaToken(null)} 
             />
           </div>

           <input type="hidden" name="fast_captcha_token" value={captchaToken || ''} />
           
           <button type="submit" disabled={!captchaToken} className="w-full">
             Submit
           </button>
         </form>
       );
     }
     \`\`\``;
    } else if (selectedFramework === 'html') {
      clientInstructions = `1. FRONTEND CLIENT INTEGRATION (Vanilla HTML/JS):
   - Add the FastCaptcha standalone bundle in your HTML \`<head>\` or right before \`</body>\`:
     \`\`\`html
     <script src="https://cdn.fastcaptcha.dev/fast-captcha.min.js" defer></script>
     <link rel="stylesheet" href="https://cdn.fastcaptcha.dev/fast-captcha.min.css">
     \`\`\`
   - In your ${form} HTML, inject the container before the submit button:
     \`\`\`html
     <div id="fastcaptcha-container" class="fast-captcha" data-theme="${th}"></div>
     <input type="hidden" name="fast_captcha_token" id="fast_captcha_token" value="">
     \`\`\`
   - Attach listener in JavaScript:
     \`\`\`javascript
     window.FastCaptcha?.render('fastcaptcha-container', {
       theme: '${th}',
       onVerify: function(token) {
         document.getElementById('fast_captcha_token').value = token;
         document.getElementById('submit-btn').disabled = false;
       }
     });
     \`\`\``;
    } else if (selectedFramework === 'vue') {
      clientInstructions = `1. FRONTEND CLIENT INTEGRATION (Vue 3 / Nuxt 3):
   - Import and use FastCaptcha inside your ${form} SFC:
     \`\`\`vue
     <script setup>
     import { ref } from 'vue';
     import { FastCaptcha } from 'fast-captcha-vue';

     const captchaToken = ref(null);
     const onVerify = (token) => { captchaToken.value = token; };
     const onReset = () => { captchaToken.value = null; };
     </script>

     <template>
       <form @submit.prevent="handleSubmit">
         <!-- Form fields -->
         <FastCaptcha theme="${th}" @verify="onVerify" @reset="onReset" />
         <button :disabled="!captchaToken" type="submit">Submit</button>
       </form>
     </template>
     \`\`\``;
    } else {
      clientInstructions = `1. FRONTEND CLIENT INTEGRATION (${fw}):
   - Embed FastCaptcha widget in the ${form} template right above the submit trigger.
   - Configure theme="${th}" with automatic Proof-of-Work Web Worker and biological entropy verification.
   - Store the resulting single-use \`fast_captcha_token\` and disable form submission until validation passes.`;
    }

    let backendInstructions = '';
    if (selectedBackend === 'express') {
      backendInstructions = `2. BACKEND VERIFICATION ROUTE (Node.js Express):
   - In the API endpoint processing this ${form} submission:
     \`\`\`typescript
     app.post('/api/${selectedForm}', async (req, res) => {
       const { fast_captcha_token, ...formData } = req.body;

       if (!fast_captcha_token) {
         return res.status(400).json({ success: false, message: 'Missing FastCaptcha token' });
       }

       // Verify token with FastCaptcha verification kernel or local dual failover
       const verifyRes = await fetch('https://api.fastcaptcha.dev/api/verify', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ token: fast_captcha_token })
       });

       const verifyResult = await verifyRes.json();
       if (!verifyResult.success || !verifyResult.isHuman) {
         return res.status(403).json({ 
           success: false, 
           message: 'Captcha verification failed. Please try again.' 
         });
       }

       // Captcha is valid and consumed -> Process legitimate form data safely
       return res.json({ success: true, message: 'Processed successfully' });
     });
     \`\`\``;
    } else if (selectedBackend === 'next_server_action') {
      backendInstructions = `2. BACKEND SERVER ACTION VERIFICATION (Next.js):
   - In your server action file (e.g. \`app/actions.ts\`):
     \`\`\`typescript
     'use server';

     export async function submit${selectedForm === 'login' ? 'Login' : 'Form'}(formData: FormData) {
       const token = formData.get('fast_captcha_token') as string;

       if (!token) {
         return { error: 'Captcha token missing' };
       }

       const verifyRes = await fetch('https://api.fastcaptcha.dev/api/verify', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ token }),
         cache: 'no-store'
       });

       const data = await verifyRes.json();
       if (!data.success || (data.riskScore && data.riskScore > 0.5)) {
         return { error: 'Bot or replay attack detected. Captcha rejected.' };
       }

       // Token consumed & verified -> Execute secure business logic
       return { success: true };
     }
     \`\`\``;
    } else if (selectedBackend === 'fastapi') {
      backendInstructions = `2. BACKEND VERIFICATION (Python FastAPI):
   - In your endpoint router:
     \`\`\`python
     import httpx
     from fastapi import FastAPI, HTTPException, Body

     @app.post("/api/${selectedForm}")
     async def handle_${selectedForm}(payload: dict = Body(...)):
         token = payload.get("fast_captcha_token")
         if not token:
             raise HTTPException(status_code=400, detail="Missing FastCaptcha token")

         async with httpx.AsyncClient() as client:
             res = await client.post(
                 "https://api.fastcaptcha.dev/api/verify",
                 json={"token": token}
             )
             verification = res.json()

         if not verification.get("success"):
             raise HTTPException(status_code=403, detail="Captcha verification failed")

         return {"status": "success", "message": "Verified human submission"}
     \`\`\``;
    } else {
      backendInstructions = `2. BACKEND VERIFICATION (${bk}):
   - Extract \`fast_captcha_token\` from the incoming POST request.
   - Send verification POST payload to the FastCaptcha verify endpoint:
     \`POST https://api.fastcaptcha.dev/api/verify\` with \`{"token": fast_captcha_token}\`
   - Only allow form mutation if \`response.success === true\`.`;
    }

    const ddosSection = includeAntiDdos ? `
3. IN-MEMORY ANTI-DDOS & RATE LIMITING BEST PRACTICES:
   - Reject high-frequency requests (>10 req/sec per IP) immediately with HTTP 429 Too Many Requests before running database operations.
   - For sustained burst attacks (>50 req/sec), quarantine the IP in memory for 15 minutes.
   - FastCaptcha tokens are strictly single-use (3-minute TTL) and are consumed atomically to prevent replay attacks.` : '';

    return `Please integrate the zero-API-key FastCaptcha widget into my ${form} in my ${fw} project with ${bk} backend.

Follow these exact architectural requirements:

${clientInstructions}

${backendInstructions}
${ddosSection}

4. UX & STYLING REQUIREMENTS:
   - Ensure the FastCaptcha widget is responsive, perfectly centered, and matches the ${th} theme styling.
   - Do not break existing CSS grid/flexbox layouts or margins.
   - Keep 60FPS fluid animations using non-blocking micro Proof-of-Work.

Please output the complete modified frontend file and backend API file with clear inline comments.`;
  }, [selectedFramework, selectedTheme, selectedForm, selectedBackend, includeAntiDdos]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const estimatedTokens = Math.round(generatedPrompt.length / 4);

  return (
    <div className={`relative w-full rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
      theme === 'dark' ? 'bg-slate-900/80 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
    } ${className}`}>
      
      {/* Top Banner with AI Glow */}
      <div className="relative p-6 sm:p-8 bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-950/40 border-b border-slate-800/60 overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Integration Hub & Prompt Generator</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-slate-100 via-cyan-200 to-blue-300 bg-clip-text text-transparent">
              🤖 Integrate FastCaptcha with Your AI Agent
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              No manual coding needed. Select your stack below, copy the optimized instruction prompt, and paste it to your favorite AI coding assistant (Cursor, Claude, ChatGPT, v0, Bolt, Lovable, Windsurf) to add zero-key FastCaptcha automatically.
            </p>
          </div>

          {/* Quick AI Assistant Picker Badges */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Works Seamlessly With:</span>
            <div className="flex flex-wrap gap-1.5">
              {AI_ASSISTANTS.slice(0, 5).map((assistant) => (
                <button
                  key={assistant.id}
                  onClick={() => {
                    setSelectedAssistant(assistant.id);
                    handleCopyPrompt();
                  }}
                  title={`Click to copy prompt for ${assistant.name}`}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 border ${
                    selectedAssistant === assistant.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-500/20 scale-105'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>{assistant.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Configuration Controls Panel */}
      <div className="p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 1. Framework Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Framework</span>
            </label>
            <select
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value as Framework)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
            >
              {Object.entries(frameworkLabels).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.icon} {value.label}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Target Form Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Protected Form</span>
            </label>
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value as FormType)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-100 focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
            >
              {Object.entries(formLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Theme & Appearance Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Widget Theme</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['dark', 'light', 'auto'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTheme(t)}
                  className={`py-2 rounded-xl text-xs font-bold capitalize transition-all border ${
                    selectedTheme === t
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary Options Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">Backend Environment:</span>
            <select
              value={selectedBackend}
              onChange={(e) => setSelectedBackend(e.target.value as BackendTarget)}
              className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              {Object.entries(backendLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
            <input
              type="checkbox"
              checked={includeAntiDdos}
              onChange={(e) => setIncludeAntiDdos(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400 bg-slate-900 border-slate-700 accent-cyan-400"
            />
            <span>Include In-Memory Anti-DDoS (>10 req/s rate limiter)</span>
          </label>
        </div>

        {/* Generated Prompt Code Window Container */}
        <div className="rounded-3xl bg-slate-950 border border-slate-800 shadow-inner overflow-hidden">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/80 bg-slate-900/60 text-xs">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-slate-400 text-[11px] font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>ai-integration-prompt.md</span>
                <span className="text-[10px] text-slate-500 font-normal">({estimatedTokens} tokens)</span>
              </span>
            </div>

            {/* Primary Action Button: Copy Prompt */}
            <button
              onClick={handleCopyPrompt}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md ${
                copied
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20 active:scale-95'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Prompt to Clipboard!' : 'Copy Optimized AI Prompt'}</span>
            </button>
          </div>

          {/* Prompt Code Content */}
          <div className="relative p-5 max-h-80 overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
            {generatedPrompt}
          </div>
        </div>

        {/* Footer How-To Step Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 space-y-1.5">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[10px]">1</span>
              <span>Copy Instruction Prompt</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Customize your framework, theme, and form above, then click the copy button.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 space-y-1.5">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-[10px]">2</span>
              <span>Paste into AI Assistant</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Paste directly into Cursor Composer, ChatGPT, Claude 3.7, v0, Bolt, or Windsurf.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[10px]">3</span>
              <span>Instant Zero-Key Protection</span>
            </div>
            <p className="text-[11px] text-slate-400">
              The AI applies the widget, Web Worker PoW, and server validation automatically.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
export default AiIntegrationHub;
