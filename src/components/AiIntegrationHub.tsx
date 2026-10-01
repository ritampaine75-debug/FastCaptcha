import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Copy, 
  Check, 
  Terminal, 
  ExternalLink, 
  BookOpen,
  MessageSquareCode
} from 'lucide-react';

export interface AiIntegrationHubProps {
  theme?: 'dark' | 'light';
  className?: string;
}

export const AiIntegrationHub: React.FC<AiIntegrationHubProps> = ({
  theme = 'dark',
  className = ''
}) => {
  const [copied, setCopied] = useState<boolean>(false);

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
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className={`w-full max-w-xl mx-auto rounded-3xl border shadow-2xl overflow-hidden transition-all duration-300 ${
      theme === 'dark' ? 'bg-zinc-900/90 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
    } ${className}`}>
      
      <div className="p-6 sm:p-8 space-y-5">
        <div className="space-y-1.5 text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[11px] font-semibold border border-cyan-500/20">
            <MessageSquareCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Step-Consultant Meta-Prompt</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            🤖 Integrate with AI Agents
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Copy this prompt and hand it to your AI coding assistant (Cursor, ChatGPT, Claude, v0, Bolt). The AI will first read <a href="https://fast-captcha.vercel.app/llms.txt" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">llms.txt</a> and ask for your desired configuration before writing code.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleCopyPrompt}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer ${
            copied
              ? 'bg-emerald-500 text-zinc-950 shadow-emerald-500/30'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 shadow-cyan-500/20 active:scale-[0.99]'
          }`}
        >
          {copied ? (
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

        {/* Code Preview Container */}
        <div className="rounded-2xl bg-[#09090b] border border-zinc-800 overflow-hidden text-left w-full">
          <div className="px-4 py-2 border-b border-zinc-800/80 bg-zinc-950 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>ai-consultant-prompt.md</span>
            </span>
            <a 
              href="https://fast-captcha.vercel.app/llms.txt" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>/llms.txt</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <div className="p-4 text-xs font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap break-words select-all max-h-64 overflow-y-auto">
{aiPromptText}
          </div>
        </div>

        {/* AI Badges */}
        <div className="pt-1 flex flex-wrap items-center justify-center gap-2 text-[11px] text-zinc-400 font-medium">
          <span className="text-zinc-500">Tested with:</span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">Cursor</span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">Claude 3.7</span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">ChatGPT-4o</span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">v0</span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">Bolt.new</span>
        </div>

      </div>
    </div>
  );
};
export default AiIntegrationHub;
