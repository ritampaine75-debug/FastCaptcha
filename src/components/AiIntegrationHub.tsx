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
  Share2,
  BookOpen
} from 'lucide-react';

export interface AiIntegrationHubProps {
  theme?: 'dark' | 'light';
  className?: string;
}

type Framework = 'html' | 'react' | 'nextjs' | 'vue' | 'svelte' | 'angular' | 'php';
type ThemeOption = 'dark' | 'light';
type FormType = 'login' | 'registration' | 'contact' | 'checkout' | 'password_reset';

interface AiAssistant {
  id: string;
  name: string;
  badge: string;
  color: string;
}

const AI_ASSISTANTS: AiAssistant[] = [
  { id: 'cursor', name: 'Cursor AI', badge: 'Composer / Agent', color: 'from-cyan-500 to-blue-600' },
  { id: 'claude', name: 'Claude 3.7', badge: 'Artifacts', color: 'from-amber-500 to-orange-600' },
  { id: 'chatgpt', name: 'ChatGPT-4o', badge: 'Canvas', color: 'from-emerald-500 to-teal-600' },
  { id: 'v0', name: 'v0 by Vercel', badge: 'UI Gen', color: 'from-zinc-400 to-slate-200' },
  { id: 'bolt', name: 'Bolt.new', badge: 'WebContainer', color: 'from-blue-500 to-cyan-400' },
  { id: 'lovable', name: 'Lovable', badge: 'AI Builder', color: 'from-pink-500 to-rose-600' },
  { id: 'windsurf', name: 'Windsurf', badge: 'Cascade Flow', color: 'from-indigo-500 to-purple-600' },
];

export const AiIntegrationHub: React.FC<AiIntegrationHubProps> = ({
  theme = 'dark',
  className = ''
}) => {
  const [selectedFramework, setSelectedFramework] = useState<Framework>('html');
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>('dark');
  const [selectedForm, setSelectedForm] = useState<FormType>('login');
  const [selectedAssistant, setSelectedAssistant] = useState<string>('cursor');
  const [copied, setCopied] = useState<boolean>(false);

  const frameworkLabels: Record<Framework, { label: string; icon: string }> = {
    html: { label: 'Plain HTML / Vanilla JS', icon: '🌐' },
    react: { label: 'React (Vite / CRA)', icon: '⚛️' },
    nextjs: { label: 'Next.js (App / Pages)', icon: '▲' },
    vue: { label: 'Vue 3 (SFC / Nuxt)', icon: '🟢' },
    svelte: { label: 'Svelte / SvelteKit', icon: '🔥' },
    angular: { label: 'Angular', icon: '🅰️' },
    php: { label: 'PHP / WordPress', icon: '🐘' },
  };

  const formLabels: Record<FormType, string> = {
    login: 'Login / Sign In Form',
    registration: 'User Registration / Sign Up Form',
    contact: 'Contact & Support Inquiry Form',
    checkout: 'Checkout / Payment Wire Transfer',
    password_reset: 'Password Reset & Recovery',
  };

  // Generate the prompt using live Vercel domain: https://fast-captcha.vercel.app/
  const generatedPrompt = useMemo(() => {
    return `Please integrate the zero-API-key FastCaptcha widget into my ${formLabels[selectedForm]} in my ${frameworkLabels[selectedFramework].label} project. Follow these exact instructions:

1. Client-Side Widget:
   - Add this script tag inside the <head> or right before the </body> tag:
     <script src="https://fast-captcha.vercel.app/fast-captcha.js" defer></script>
   - Place this captcha element inside my form right above the submit button:
     <div class="fast-captcha" data-theme="${selectedTheme}"></div>
   - Note: The script automatically generates a hidden field named "fast_captcha_token" once verified. Keep the submit button disabled until verified.

2. Server-Side Verification:
   - When processing the form submission on the backend, extract "fast_captcha_token".
   - Make a POST request to verify the token:
     URL: https://fast-captcha.vercel.app/api/verify
     Headers: { "Content-Type": "application/json" }
     Body: JSON.stringify({ token: fast_captcha_token })
   - If the response is { "success": true }, proceed with the submission.
   - If { "success": false }, reject the submission and show an error to the user.

Ensure the widget is centered, responsive on mobile and desktop, and does not alter my existing form styles.`;
  }, [selectedFramework, selectedTheme, selectedForm]);

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
              <span>Live Hosted CDN: https://fast-captcha.vercel.app/</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-slate-100 via-cyan-200 to-blue-300 bg-clip-text text-transparent">
              🤖 Integrate FastCaptcha with Your AI Agent
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              No manual coding needed. Copy this prompt and send it to your AI coding assistant (Cursor, ChatGPT, Claude, v0, Bolt, Lovable, Windsurf) to add FastCaptcha to your website automatically.
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

          {/* 3. Theme Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Widget Theme</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['dark', 'light'] as const).map((t) => (
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
                  {t} Theme
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Vercel Domain Verification Endpoints Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-400 font-medium">Live CDN Script:</span>
            <code className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-[11px]">
              https://fast-captcha.vercel.app/fast-captcha.js
            </code>
          </div>

          <a 
            href="/llms.txt" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium text-xs underline"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View Machine-Readable AI Docs (/llms.txt)</span>
          </a>
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
              <span>{copied ? 'Copied Prompt to Clipboard!' : 'Copy Prompt for AI Agents'}</span>
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
              <span>Zero-Key CDN Auto-Inject</span>
            </div>
            <p className="text-[11px] text-slate-400">
              The AI embeds the live CDN script &amp; server verification with zero local packages.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
export default AiIntegrationHub;
