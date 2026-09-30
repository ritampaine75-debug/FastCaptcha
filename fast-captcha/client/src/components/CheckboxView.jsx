import React from 'react';

export const CheckboxView = ({
  status,
  theme = 'dark',
  size = 'normal',
  onTrigger,
  onOpenModesModal,
  errorMessage,
  onReset,
  powIterations,
  syncSource,
  isHumanScore
}) => {
  const isDark = theme === 'dark';
  const isVerifying = status === 'challenging' || status === 'verifying';
  const isVerified = status === 'verified';
  const isError = status === 'error' || status === 'rate_limited';

  return (
    <div
      className={`relative w-full max-w-[340px] rounded-2xl p-3.5 transition-all duration-300 select-none ${
        isDark ? 'fc-glass-dark text-slate-100' : 'fc-glass-light text-slate-800 shadow-lg'
      } ${
        isVerified
          ? 'fc-glow-success border-emerald-500/40 bg-emerald-950/10'
          : isError
          ? 'fc-glow-error border-rose-500/40 bg-rose-950/10'
          : isVerifying
          ? 'fc-glow-active border-cyan-500/40'
          : 'hover:border-cyan-500/30'
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div
          onClick={() => {
            if (status === 'idle') onTrigger();
            else if (isError) onReset();
          }}
          className="flex items-center gap-3.5 cursor-pointer group flex-1 py-1"
          role="button"
          tabIndex={0}
        >
          <div className="relative flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center">
            {status === 'idle' && (
              <div
                className={`w-7 h-7 rounded-lg border-2 transition-all flex items-center justify-center group-hover:scale-105 ${
                  isDark
                    ? 'border-slate-600 bg-slate-800/80 group-hover:border-cyan-400 group-hover:shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'border-slate-300 bg-white group-hover:border-cyan-500 group-hover:shadow-md'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-cyan-500/30 transition-all" />
              </div>
            )}

            {isVerifying && (
              <div className="relative w-7 h-7 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full border-2 border-slate-700/40 border-t-cyan-400 border-r-cyan-500 fc-spinner" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                </div>
              </div>
            )}

            {isVerified && (
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 fc-checkmark-animated">
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" className="fc-checkmark-path" />
                </svg>
              </div>
            )}

            {isError && (
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500 flex items-center justify-center text-rose-400 font-bold text-xs">
                !
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span
              className={`text-sm font-semibold tracking-tight transition-colors ${
                isVerified
                  ? 'text-emerald-400'
                  : isError
                  ? 'text-rose-400'
                  : isDark
                  ? 'text-slate-200 group-hover:text-cyan-300'
                  : 'text-slate-800 group-hover:text-cyan-600'
              }`}
            >
              {isVerified
                ? 'Verification Passed'
                : isVerifying
                ? 'Securing Challenge...'
                : isError
                ? 'Challenge Failed'
                : 'I am not a robot'}
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              {isVerified && `Verified Human (${Math.round((isHumanScore || 0.98) * 100)}%)`}
              {isVerifying && `Proof-of-Work Web Worker ${powIterations ? `(${powIterations}h)` : ''}`}
              {status === 'idle' && 'Zero-key micro PoW verification'}
              {isError && (errorMessage || 'Click to retry')}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end justify-center pl-2 border-l border-slate-700/30">
          <span className="text-xs font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            FastCaptcha
          </span>
          <button
            type="button"
            onClick={onOpenModesModal}
            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700/60 mt-0.5 font-medium"
          >
            Modes
          </button>
        </div>
      </div>

      {isVerified && syncSource && (
        <div className="mt-2 pt-2 border-t border-slate-700/30 flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span>Dual Sync: {syncSource}</span>
          <span className="font-mono text-emerald-400/90 text-[9px]">3min single-use TTL</span>
        </div>
      )}
    </div>
  );
};
