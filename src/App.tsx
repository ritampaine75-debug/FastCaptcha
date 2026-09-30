import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Flame, 
  Database, 
  Activity, 
  Zap, 
  Layers, 
  Code2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Copy, 
  Check, 
  Sliders, 
  Box, 
  BrainCircuit, 
  Cpu, 
  Terminal, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  MousePointer, 
  Bot, 
  UserCheck, 
  ArrowRight,
  Server,
  Radio,
  ExternalLink
} from 'lucide-react';
import { FastCaptcha, FastCaptchaRef } from './components/FastCaptcha/FastCaptcha.tsx';
import { AiIntegrationHub } from './components/AiIntegrationHub.tsx';

interface DualHealthData {
  rtdbStatus: string;
  firestoreStatus: string;
  rtdbLatencyMs: number;
  firestoreLatencyMs: number;
  activeChallengesCount: number;
  failoverEventsCount: number;
  lastFailoverReason: string | null;
  lastSyncTimestamp: number;
  simulatedOutage: {
    rtdb: boolean;
    firestore: boolean;
  };
}

interface RateLimitMetrics {
  totalRequests: number;
  allowedRequests: number;
  throttled429Requests: number;
  blacklistedBlockedRequests: number;
  activeBlacklistCount: number;
  highestRequestsPerSec: number;
  blacklistedIps: Array<{
    ip: string;
    reason: string;
    remainingSeconds: number;
    burstCount: number;
  }>;
  recentEvents: Array<{
    id: string;
    ip: string;
    type: 'ALLOW' | '429_THROTTLE' | 'BLACKLIST_TRIGGER' | 'BLACKLIST_BLOCKED';
    rate: number;
    timestamp: number;
    details: string;
  }>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'demo' | 'aiHub' | 'dualDb' | 'ddos' | 'entropy' | 'modes' | 'docs'>('demo');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [widgetSize, setWidgetSize] = useState<'normal' | 'compact'>('normal');

  // Live Verification Result State
  const [verificationResult, setVerificationResult] = useState<{
    token: string;
    riskScore: number;
    entropyScore: number;
    syncSource: string;
    verifiedAt: string;
  } | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({ name: 'Alex Rivera', email: 'alex@example.com', amount: '2,500.00' });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Telemetry state
  const [dualHealth, setDualHealth] = useState<DualHealthData | null>(null);
  const [rateLimiterData, setRateLimiterData] = useState<RateLimitMetrics | null>(null);
  const [isAttacking, setIsAttacking] = useState<boolean>(false);
  const [attackReport, setAttackReport] = useState<any | null>(null);

  const captchaRef = useRef<FastCaptchaRef>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseTrailRef = useRef<Array<{ x: number; y: number; t: number }>>([]);

  // Fetch Telemetry periodically
  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setDualHealth(data.dualDatabase);
        setRateLimiterData(data.rateLimiter);
      }
    } catch (e) {
      // Ignore in background
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 2000);
    return () => clearInterval(interval);
  }, []);

  // Track cursor movement on canvas in Entropy Tab
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (activeTab !== 'entropy') return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        mouseTrailRef.current.push({ x, y, t: performance.now() });
        if (mouseTrailRef.current.length > 50) mouseTrailRef.current.shift();
        drawCanvas();
      }
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [activeTab]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background grid
    ctx.strokeStyle = theme === 'dark' ? '#1e293b' : '#e2e8f0';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    const trail = mouseTrailRef.current;
    if (trail.length < 2) return;

    // Draw smooth bezier curve of user cursor
    ctx.beginPath();
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.moveTo(trail[0].x, trail[0].y);
    for (let i = 1; i < trail.length; i++) {
      const xc = (trail[i].x + trail[i - 1].x) / 2;
      const yc = (trail[i].y + trail[i - 1].y) / 2;
      ctx.quadraticCurveTo(trail[i - 1].x, trail[i - 1].y, xc, yc);
    }
    ctx.stroke();

    // Draw point markers
    trail.forEach((p, index) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, index === trail.length - 1 ? 5 : 2.5, 0, Math.PI * 2);
      ctx.fillStyle = index === trail.length - 1 ? '#10b981' : 'rgba(6, 182, 212, 0.6)';
      ctx.fill();
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationResult) {
      alert('Please complete the FastCaptcha verification first.');
      return;
    }
    setFormSubmitted(true);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleFailoverSimulation = async (target: 'rtdb' | 'firestore' | 'none', enabled: boolean = true) => {
    await fetch('/api/toggle-failover', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target, enabled }),
    });
    fetchTelemetry();
  };

  const triggerAttackSimulation = async (count: number) => {
    setIsAttacking(true);
    try {
      const res = await fetch('/api/simulate-attack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestCount: count, simulatedIp: '198.51.100.42' }),
      });
      const data = await res.json();
      setAttackReport(data.summary);
      fetchTelemetry();
    } finally {
      setIsAttacking(false);
    }
  };

  const resetBlacklist = async () => {
    await fetch('/api/rate-limit-reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
    setAttackReport(null);
    fetchTelemetry();
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* TOP STATUS NAVIGATION BAR */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-xl ${theme === 'dark' ? 'bg-slate-950/85 border-slate-800' : 'bg-white/85 border-slate-200 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20 text-white font-black text-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  FastCaptcha
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold uppercase tracking-wider">
                  v2.4 Zero-Key
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">Dual Firebase Failover & Anti-DDoS Engine</p>
            </div>
          </div>

          {/* Quick Dual Firebase Indicator */}
          <div className="hidden md:flex items-center gap-4 px-3 py-1.5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${dualHealth?.rtdbStatus === 'online' ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'}`} />
              <span className="text-slate-300 font-medium">RTDB:</span>
              <span className="font-mono text-cyan-400">{dualHealth?.rtdbLatencyMs || 24}ms</span>
            </div>
            <div className="h-3 w-[1px] bg-slate-700" />
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${dualHealth?.firestoreStatus === 'online' ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'}`} />
              <span className="text-slate-300 font-medium">Firestore:</span>
              <span className="font-mono text-cyan-400">{dualHealth?.firestoreLatencyMs || 38}ms</span>
            </div>
          </div>

          {/* Top Right Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute acoustic feedback' : 'Enable acoustic feedback'}
              className="p-2 rounded-xl border border-slate-800 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition-all"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title="Toggle Dark/Light Mode"
              className="p-2 rounded-xl border border-slate-800 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto no-scrollbar py-2 border-t border-slate-800/40">
          {[
            { id: 'demo', label: 'Interactive Workbench', icon: Zap },
            { id: 'aiHub', label: '🤖 AI Agent Hub', icon: Bot, isHighlight: true },
            { id: 'dualDb', label: 'Dual Firebase Failover', icon: Database },
            { id: 'ddos', label: 'Anti-DDoS & Rate Limiter', icon: Flame },
            { id: 'entropy', label: 'Behavioral Entropy Engine', icon: MousePointer },
            { id: 'modes', label: 'Extended Modes (3D/Slider)', icon: Layers },
            { id: 'docs', label: 'Embed & SDK Export', icon: Code2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                    : tab.isHighlight
                    ? 'bg-gradient-to-r from-cyan-500/15 to-indigo-500/15 text-cyan-300 hover:bg-cyan-500/25 border border-cyan-500/30'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.isHighlight && !isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* MAIN BODY CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TAB 1: INTERACTIVE WORKBENCH & PROTECTED FORM */}
        {activeTab === 'demo' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Protected Demo Form */}
            <div className="lg:col-span-7 space-y-6">
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-all ${theme === 'dark' ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'}`}>
                
                <div className="flex items-center justify-between pb-6 border-b border-slate-800/60">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2">
                      Protected Transaction Portal
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Simulate a high-security financial wire transfer protected by zero-key FastCaptcha.
                    </p>
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Live Protected
                  </span>
                </div>

                {formSubmitted ? (
                  <div className="py-10 text-center space-y-4 animate-fadeIn">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-100">Transfer Authorized & Executed</h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Transaction validated via single-use FastCaptcha token ({verificationResult?.token.slice(0, 16)}...). The token has been permanently consumed in Firebase.
                      </p>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setFormSubmitted(false);
                          setVerificationResult(null);
                          captchaRef.current?.reset();
                        }}
                        className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md"
                      >
                        Execute Another Transfer
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleFormSubmit} className="space-y-5 pt-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Recipient Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300">Recipient Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-cyan-500 transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-300">Transfer Amount ($ USD)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-sm">$</span>
                        <input
                          type="text"
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                          className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700 text-sm font-mono text-cyan-400 font-bold focus:outline-none focus:border-cyan-500 transition-colors"
                          required
                        />
                      </div>
                    </div>

                    {/* LIVE FASTCAPTCHA COMPONENT */}
                    <div className="pt-2 pb-1 space-y-2">
                      <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                        <span>Human Verification Check</span>
                        <span className="text-[11px] text-cyan-400 font-normal">Zero-API-Key</span>
                      </label>
                      
                      <div className="flex items-center justify-center sm:justify-start">
                        <FastCaptcha
                          ref={captchaRef}
                          theme={theme}
                          size={widgetSize}
                          soundEnabled={soundEnabled}
                          onVerify={(token, details) => {
                            setVerificationResult({
                              token,
                              riskScore: details.riskScore,
                              entropyScore: details.entropyScore,
                              syncSource: details.syncSource,
                              verifiedAt: new Date().toLocaleTimeString()
                            });
                          }}
                          onReset={() => setVerificationResult(null)}
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={!verificationResult}
                      className={`w-full py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                        verificationResult
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 shadow-cyan-500/25 cursor-pointer'
                          : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>{verificationResult ? 'Authorize Wire Transfer' : 'Complete FastCaptcha To Submit'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Live Telemetry & Inspector */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Verification Output Card */}
              <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${theme === 'dark' ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    Live Security Inspector
                  </h3>
                  {verificationResult && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                      TOKEN ISSUED
                    </span>
                  )}
                </div>

                {verificationResult ? (
                  <div className="space-y-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-[10px] text-slate-400 uppercase">Single-Use Token:</div>
                      <div className="text-cyan-300 break-all select-all font-semibold">
                        {verificationResult.token}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="text-[10px] text-slate-400">Risk Score</div>
                        <div className="text-emerald-400 font-bold text-sm">{verificationResult.riskScore} (Low)</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="text-[10px] text-slate-400">Entropy Score</div>
                        <div className="text-cyan-400 font-bold text-sm">{verificationResult.entropyScore} (Human)</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Sync Engine:</span>
                      <span className="text-slate-200">{verificationResult.syncSource}</span>
                    </div>

                    <button
                      onClick={() => {
                        captchaRef.current?.reset();
                        setVerificationResult(null);
                      }}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset & Retest Verification</span>
                    </button>
                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                    <Radio className="w-8 h-8 text-slate-600 mx-auto animate-pulse" />
                    <p>Click "I am not a robot" above to observe real-time PoW Web Worker execution and token generation.</p>
                  </div>
                )}
              </div>

              {/* Widget Customizer Card */}
              <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${theme === 'dark' ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Widget Customizer
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Theme Mode</span>
                    <div className="flex gap-1.5">
                      {(['dark', 'light'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className={`px-2.5 py-1 rounded-lg capitalize font-medium ${
                            theme === t ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Tactile Audio Feedback</span>
                    <button
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`px-3 py-1 rounded-lg font-medium ${
                        soundEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {soundEnabled ? 'Enabled' : 'Muted'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Token Single-Use TTL</span>
                    <span className="font-mono text-cyan-400">180 seconds (3 min)</span>
                  </div>
                </div>
              </div>

              {/* AI Hub Quick Launcher Card */}
              <div 
                onClick={() => setActiveTab('aiHub')}
                className="p-5 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-900/80 border border-cyan-500/30 shadow-xl cursor-pointer hover:border-cyan-400/60 transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    AI Integration Hub
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold uppercase">
                    Cursor / Claude / v0
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ask your AI coding assistant to embed FastCaptcha automatically with zero manual code.
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Open Prompt Generator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB: AI INTEGRATION HUB & PROMPT GENERATOR */}
        {activeTab === 'aiHub' && (
          <div className="animate-fadeIn">
            <AiIntegrationHub theme={theme} />
          </div>
        )}

        {/* TAB 2: DUAL FIREBASE FAILOVER ENGINE */}
        {activeTab === 'dualDb' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  Dual Firebase RTDB + Firestore Engine
                  <Database className="w-5 h-5 text-cyan-400" />
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Active parallel synchronization with atomic zero-downtime failover and single-use token lifecycle.
                </p>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFailoverSimulation('none')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Normal Dual Sync</span>
                </button>
              </div>
            </div>

            {/* Live Database Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Database 1: Firebase Realtime Database */}
              <div className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden ${
                dualHealth?.rtdbStatus === 'simulated_offline' 
                  ? 'bg-rose-950/20 border-rose-500/50' 
                  : 'bg-slate-900/70 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">Firebase Realtime Database</h3>
                      <p className="text-[11px] text-slate-400">hiiii-72d78-default-rtdb</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                    dualHealth?.rtdbStatus === 'online'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                  }`}>
                    {dualHealth?.rtdbStatus || 'online'}
                  </span>
                </div>

                <div className="space-y-3 text-xs mb-5">
                  <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Connection Latency:</span>
                    <span className="font-mono text-cyan-300 font-bold">{dualHealth?.rtdbLatencyMs || 24}ms</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Write Strategy:</span>
                    <span className="text-slate-200">Parallel Race + Heartbeat</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFailoverSimulation('rtdb', dualHealth?.rtdbStatus !== 'simulated_offline')}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                    dualHealth?.rtdbStatus === 'simulated_offline'
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40'
                  }`}
                >
                  {dualHealth?.rtdbStatus === 'simulated_offline' ? 'Bring RTDB Back Online' : 'Simulate RTDB Outage'}
                </button>
              </div>

              {/* Database 2: Cloud Firestore */}
              <div className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden ${
                dualHealth?.firestoreStatus === 'simulated_offline' 
                  ? 'bg-rose-950/20 border-rose-500/50' 
                  : 'bg-slate-900/70 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">Cloud Firestore</h3>
                      <p className="text-[11px] text-slate-400">hiiii-72d78 / fastcaptcha_challenges</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                    dualHealth?.firestoreStatus === 'online'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                  }`}>
                    {dualHealth?.firestoreStatus || 'online'}
                  </span>
                </div>

                <div className="space-y-3 text-xs mb-5">
                  <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Connection Latency:</span>
                    <span className="font-mono text-cyan-300 font-bold">{dualHealth?.firestoreLatencyMs || 38}ms</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400">Collection Path:</span>
                    <span className="font-mono text-slate-200">/fastcaptcha_challenges/{'{id}'}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFailoverSimulation('firestore', dualHealth?.firestoreStatus !== 'simulated_offline')}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all ${
                    dualHealth?.firestoreStatus === 'simulated_offline'
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40'
                  }`}
                >
                  {dualHealth?.firestoreStatus === 'simulated_offline' ? 'Bring Firestore Back Online' : 'Simulate Firestore Outage'}
                </button>
              </div>
            </div>

            {/* Failover Telemetry Logs */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                Failover & Single-Use Lifecycle Architecture
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-medium">Active In-Flight Challenges</div>
                  <div className="text-lg font-mono font-bold text-cyan-400">{dualHealth?.activeChallengesCount || 0}</div>
                  <div className="text-[10px] text-slate-500">Auto-expires at 180s TTL</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-medium">Failover Interventions</div>
                  <div className="text-lg font-mono font-bold text-emerald-400">{dualHealth?.failoverEventsCount || 0}</div>
                  <div className="text-[10px] text-slate-500">Zero dropped client requests</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-slate-400 font-medium">Atomic Deletion on Verification</div>
                  <div className="text-lg font-mono font-bold text-amber-400">100% Guaranteed</div>
                  <div className="text-[10px] text-slate-500">Replay attacks mathematically impossible</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANTI-DDOS & RATE LIMITER */}
        {activeTab === 'ddos' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  In-Memory Sliding-Window Anti-DDoS Filter
                  <Flame className="w-5 h-5 text-rose-500" />
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Rejects spam and bursts BEFORE touching Firebase or allocating CPU cycles.
                </p>
              </div>

              <button
                onClick={resetBlacklist}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset RAM Blacklist & Counters</span>
              </button>
            </div>

            {/* Threshold Spec Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Level 1: Standard Rate</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">&le; 10 req/s</span>
                </div>
                <p className="text-xs text-slate-400">Regular legitimate traffic is granted cryptographic PoW challenges.</p>
                <div className="text-lg font-mono font-bold text-emerald-400">{rateLimiterData?.allowedRequests || 0} allowed</div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Level 2: 429 Throttle</span>
                  <span className="text-xs font-mono font-bold text-amber-400">&gt; 10 req/s</span>
                </div>
                <p className="text-xs text-slate-400">Returns immediate HTTP 429 before database write attempt.</p>
                <div className="text-lg font-mono font-bold text-amber-400">{rateLimiterData?.throttled429Requests || 0} throttled</div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300">Level 3: RAM Blacklist</span>
                  <span className="text-xs font-mono font-bold text-rose-400">&gt; 50 req/s</span>
                </div>
                <p className="text-xs text-slate-400">High-velocity burst quarantines IP in RAM for 15 minutes.</p>
                <div className="text-lg font-mono font-bold text-rose-400">{rateLimiterData?.activeBlacklistCount || 0} quarantined</div>
              </div>
            </div>

            {/* Live Attack Simulator Suite */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                Live Attack Burst Simulator
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  disabled={isAttacking}
                  onClick={() => triggerAttackSimulation(5)}
                  className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all space-y-1"
                >
                  <div className="text-xs font-bold text-emerald-400">Normal Burst (5 req/s)</div>
                  <div className="text-[11px] text-slate-400">Expect: 100% Passed through</div>
                </button>

                <button
                  disabled={isAttacking}
                  onClick={() => triggerAttackSimulation(18)}
                  className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all space-y-1"
                >
                  <div className="text-xs font-bold text-amber-400">Spam Burst (18 req/s)</div>
                  <div className="text-[11px] text-slate-400">Expect: HTTP 429 Throttle</div>
                </button>

                <button
                  disabled={isAttacking}
                  onClick={() => triggerAttackSimulation(65)}
                  className="p-4 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-all space-y-1"
                >
                  <div className="text-xs font-bold text-rose-400">DDoS Attack Burst (65 req/s)</div>
                  <div className="text-[11px] text-slate-400">Expect: 15-Min RAM Blacklist</div>
                </button>
              </div>

              {attackReport && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-2 animate-fadeIn">
                  <div className="text-cyan-400 font-bold">Attack Simulation Results:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>Total: {attackReport.total}</div>
                    <div className="text-emerald-400">Allowed: {attackReport.allowed}</div>
                    <div className="text-amber-400">429 Throttled: {attackReport.blocked429}</div>
                    <div className="text-rose-400">Blacklisted: {attackReport.blacklisted}</div>
                  </div>
                </div>
              )}
            </div>

            {/* RAM Blacklist Table */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center justify-between">
                <span>Active RAM Blacklist (In-Memory IP Quarantine)</span>
                <span className="text-xs text-slate-400 font-mono font-normal">
                  {rateLimiterData?.blacklistedIps?.length || 0} IPs Active
                </span>
              </h3>

              {rateLimiterData?.blacklistedIps && rateLimiterData.blacklistedIps.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="py-2">IP Address</th>
                        <th className="py-2">Trigger Reason</th>
                        <th className="py-2">Burst Velocity</th>
                        <th className="py-2">Remaining Quarantine</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rateLimiterData.blacklistedIps.map((b, idx) => (
                        <tr key={idx} className="border-b border-slate-800/50">
                          <td className="py-2.5 text-rose-400 font-bold">{b.ip}</td>
                          <td className="py-2.5 text-slate-300">{b.reason}</td>
                          <td className="py-2.5 text-amber-400">{b.burstCount} req/s</td>
                          <td className="py-2.5 text-cyan-300">{b.remainingSeconds}s</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  No IPs currently quarantined in RAM. Run the DDoS Attack Burst above to test automatic blacklisting.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: BEHAVIORAL ENTROPY & TRAJECTORY */}
        {activeTab === 'entropy' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Biological Entropy & Trajectory Visualizer
                <MousePointer className="w-5 h-5 text-cyan-400" />
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Move your cursor over the canvas to watch FastCaptcha's non-blocking (useRef) biological micro-jitter analysis.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Canvas Area */}
              <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Interactive Trajectory Canvas (Move cursor below)</span>
                  <span className="text-cyan-400 font-mono">Sampling: 12ms resolution</span>
                </div>

                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                  <canvas
                    ref={canvasRef}
                    width={700}
                    height={320}
                    className="w-full h-80 cursor-crosshair block"
                  />
                </div>
              </div>

              {/* Entropy Metrics breakdown */}
              <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 text-xs">
                <h3 className="font-bold text-sm text-slate-100">Heuristic Signals</h3>

                <div className="space-y-3 font-mono">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Micro-Jitter Deviation</div>
                    <div className="text-sm font-bold text-emerald-400">Biological (&gt;0.12px variance)</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Trajectory Curvature</div>
                    <div className="text-sm font-bold text-cyan-400">Natural Arc (Ratio &lt; 0.95)</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase">Synthetic Bot Detection</div>
                    <div className="text-sm font-bold text-slate-200">Rejects straight lines (1.0 ratio)</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-slate-300 text-[11px] leading-relaxed">
                  <strong className="text-cyan-300">Strict useRef Rule: </strong>
                  The entropy tracker avoids any React component re-renders while moving the mouse, guaranteeing pure 60FPS fluid page animations.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: EXTENDED MODES (SLIDER, 3D, MATH) */}
        {activeTab === 'modes' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Modular Next-Gen Modes
                <Layers className="w-5 h-5 text-cyan-400" />
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                FastCaptcha's extensible plug-in architecture for specialized security challenges.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Slider Mode Card */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      <Sliders className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                      Preview Ready
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-100">Slider Jigsaw Puzzle</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Interactive jigsaw piece fitting with canvas masking and velocity curve validation.
                  </p>
                </div>
                <div className="text-xs font-mono text-cyan-400">Zero Server Image Storage</div>
              </div>

              {/* 3D Mode Card */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      <Box className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                      Preview Ready
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-100">3D Spatial Rotation</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Isometric artifact rotation with target angle alignment and WebGL spatial invariant testing.
                  </p>
                </div>
                <div className="text-xs font-mono text-indigo-400">AI Vision Scraper Immune</div>
              </div>

              {/* Math Mode Card */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <BrainCircuit className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                      Preview Ready
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-100">Math & Cognitive Trap</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Lightweight arithmetic logic trap designed to confuse scrapers while taking humans &lt;2s.
                  </p>
                </div>
                <div className="text-xs font-mono text-amber-400">Cognitive Micro-Gate</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: EMBED & SDK EXPORT */}
        {activeTab === 'docs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  Live CDN Embed &amp; Verification API
                  <Code2 className="w-5 h-5 text-cyan-400" />
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Zero local packages or API keys. Embed anywhere with a single script tag.
                </p>
              </div>

              <a
                href="/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-semibold hover:bg-cyan-500/20 transition-all"
              >
                <span>View /llms.txt AI Specs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Plain HTML / WordPress CDN Snippet */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 font-mono">1. Client HTML Script Tag</span>
                  <button
                    onClick={() => handleCopy(`<!-- FastCaptcha Live CDN -->
<script src="https://fast-captcha.vercel.app/fast-captcha.js" defer></script>

<!-- Add inside any <form> -->
<div class="fast-captcha" data-theme="dark"></div>`, 'html_cdn')}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
                  >
                    {copiedCode === 'html_cdn' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'html_cdn' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
{`<!-- FastCaptcha Live CDN -->
<script src="https://fast-captcha.vercel.app/fast-captcha.js" defer></script>

<!-- Add inside any <form> -->
<div class="fast-captcha" data-theme="dark"></div>`}
                </pre>
              </div>

              {/* Backend Verification Endpoint */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 font-mono">2. Server-Side Verification POST</span>
                  <button
                    onClick={() => handleCopy(`// Backend Token Verification POST
const response = await fetch('https://fast-captcha.vercel.app/api/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: req.body.fast_captcha_token })
});

const result = await response.json();
if (result.success) {
  // Allow form submission
} else {
  // Reject bot submission
}`, 'server_verify')}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
                  >
                    {copiedCode === 'server_verify' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'server_verify' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto">
{`// Backend Token Verification POST
const response = await fetch('https://fast-captcha.vercel.app/api/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: req.body.fast_captcha_token })
});

const result = await response.json();
if (result.success) {
  // Allow form submission
} else {
  // Reject bot submission
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
