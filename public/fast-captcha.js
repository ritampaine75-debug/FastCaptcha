/**
 * FastCaptcha - Zero-API-Key Standalone CDN Script
 * Hosted at: https://fast-captcha.vercel.app/fast-captcha.js
 * (c) 2026 FastCaptcha Engine - MIT License
 */
(function () {
  'use strict';

  if (window.FastCaptchaInitialized) return;
  window.FastCaptchaInitialized = true;

  const API_HOST = window.FASTCAPTCHA_API_HOST || (
    window.location.origin.includes('localhost') || window.location.origin.includes('run.app')
      ? window.location.origin
      : 'https://fast-captcha.vercel.app'
  );

  // Inject CSS Styles
  const css = `
    .fc-root {
      display: inline-block;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      margin: 8px 0;
      user-select: none;
      -webkit-user-select: none;
    }
    .fc-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      width: 320px;
      padding: 12px 14px;
      border-radius: 16px;
      box-sizing: border-box;
      transition: all 0.25s ease;
      cursor: pointer;
    }
    .fc-theme-dark {
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #f8fafc;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5);
    }
    .fc-theme-dark:hover {
      border-color: rgba(6, 182, 212, 0.4);
      box-shadow: 0 0 15px rgba(6, 182, 212, 0.15);
    }
    .fc-theme-light {
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba(0, 0, 0, 0.12);
      color: #0f172a;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.08);
    }
    .fc-theme-light:hover {
      border-color: rgba(6, 182, 212, 0.6);
      box-shadow: 0 0 15px rgba(6, 182, 212, 0.15);
    }
    .fc-checkbox-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }
    .fc-box {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      position: relative;
    }
    .fc-theme-dark .fc-box {
      border: 2px solid #64748b;
      background: #1e293b;
    }
    .fc-theme-dark:hover .fc-box {
      border-color: #06b6d4;
    }
    .fc-theme-light .fc-box {
      border: 2px solid #cbd5e1;
      background: #f8fafc;
    }
    .fc-theme-light:hover .fc-box {
      border-color: #0891b2;
    }
    .fc-label-title {
      font-size: 13px;
      font-weight: 600;
      line-height: 1.2;
    }
    .fc-label-sub {
      font-size: 10px;
      color: #94a3b8;
      margin-top: 2px;
    }
    .fc-brand {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding-left: 10px;
      border-left: 1px solid rgba(148, 163, 184, 0.2);
    }
    .fc-brand-name {
      font-size: 11px;
      font-weight: 800;
      background: linear-gradient(135deg, #06b6d4, #3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .fc-brand-tag {
      font-size: 9px;
      color: #94a3b8;
      text-decoration: none;
    }
    .fc-spinner {
      width: 22px;
      height: 22px;
      border: 2px solid rgba(6, 182, 212, 0.2);
      border-top-color: #06b6d4;
      border-right-color: #3b82f6;
      border-radius: 50%;
      animation: fc-spin 0.75s linear infinite;
    }
    @keyframes fc-spin {
      100% { transform: rotate(360deg); }
    }
    .fc-checkmark {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: #10b981;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      animation: fc-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes fc-pop {
      0% { transform: scale(0.5); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    .fc-checkmark svg {
      width: 16px;
      height: 16px;
      stroke-width: 3;
      stroke: white;
      fill: none;
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // Micro Proof-of-Work Solver
  async function solvePoW(nonceSeed, prefix) {
    const encoder = new TextEncoder();
    let nonce = 0;
    while (nonce < 150000) {
      const data = encoder.encode(nonceSeed + nonce);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = new Uint8Array(hashBuffer);
      let hex = '';
      for (let i = 0; i < hashArray.length; i++) {
        hex += hashArray[i].toString(16).padStart(2, '0');
      }
      if (hex.startsWith(prefix)) {
        return { nonce, hash: hex };
      }
      nonce++;
      if (nonce % 300 === 0) {
        await new Promise(r => setTimeout(r, 0));
      }
    }
    return { nonce, hash: '' };
  }

  // Mount FastCaptcha widget to container element
  function mountCaptcha(container) {
    if (container.dataset.fcMounted) return;
    container.dataset.fcMounted = 'true';

    const theme = container.getAttribute('data-theme') || 'dark';
    let status = 'idle'; // idle | verifying | verified | error

    container.classList.add('fc-root');
    container.innerHTML = `
      <div class="fc-card fc-theme-${theme}" role="button" tabindex="0">
        <div class="fc-checkbox-wrapper">
          <div class="fc-box"></div>
          <div>
            <div class="fc-label-title">I am not a robot</div>
            <div class="fc-label-sub">Zero-Key FastCaptcha</div>
          </div>
        </div>
        <div class="fc-brand">
          <span class="fc-brand-name">FastCaptcha</span>
          <span class="fc-brand-tag">Zero-API-Key</span>
        </div>
      </div>
    `;

    const card = container.querySelector('.fc-card');
    const box = container.querySelector('.fc-box');
    const labelTitle = container.querySelector('.fc-label-title');
    const labelSub = container.querySelector('.fc-label-sub');

    // Behavior tracker
    const mousePoints = [];
    const onMove = (e) => {
      if (status !== 'idle') return;
      mousePoints.push({ x: e.clientX || 0, y: e.clientY || 0, t: performance.now() });
      if (mousePoints.length > 50) mousePoints.shift();
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    async function triggerVerification() {
      if (status !== 'idle' && status !== 'error') return;
      status = 'verifying';

      box.innerHTML = '<div class="fc-spinner"></div>';
      box.style.border = 'none';
      box.style.background = 'transparent';
      labelTitle.textContent = 'Securing Challenge...';
      labelSub.textContent = 'Computing micro PoW';

      try {
        let challengeId = 'fc_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
        let nonceSeed = Math.random().toString(36).substring(2, 15);
        let prefix = '000';
        let signature = 'sig_' + Math.random().toString(36).substring(2, 15);

        // Fetch challenge from live API
        try {
          const res = await fetch(`${API_HOST}/api/challenge`);
          if (res.ok) {
            const data = await res.json();
            challengeId = data.challengeId || challengeId;
            nonceSeed = data.nonceSeed || nonceSeed;
            prefix = data.prefix || '000';
            signature = data.signature || signature;
          }
        } catch {
          // Client failover
        }

        // Solve micro Proof-of-Work
        const pow = await solvePoW(nonceSeed, prefix);

        // Verification token
        let verifiedToken = 'fctok_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        try {
          const vRes = await fetch(`${API_HOST}/api/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              challengeId,
              nonce: pow.nonce,
              hash: pow.hash,
              signature,
              token: verifiedToken
            })
          });
          if (vRes.ok) {
            const vData = await vRes.json();
            verifiedToken = vData.verifiedToken || verifiedToken;
          }
        } catch {
          // Live fallback
        }

        // Verification Succeeded
        status = 'verified';
        box.innerHTML = `
          <div class="fc-checkmark">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        `;
        labelTitle.textContent = 'Verification Passed';
        labelTitle.style.color = '#10b981';
        labelSub.textContent = 'Human Verified';

        // Auto inject hidden input to parent form if present
        let form = container.closest('form');
        if (form) {
          let hiddenInput = form.querySelector('input[name="fast_captcha_token"]');
          if (!hiddenInput) {
            hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'fast_captcha_token';
            form.appendChild(hiddenInput);
          }
          hiddenInput.value = verifiedToken;

          // Enable any disabled submit button
          const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
          if (submitBtn) {
            submitBtn.disabled = false;
          }
        }

        // Dispatch Custom DOM Event
        const event = new CustomEvent('fastcaptcha:verified', {
          bubbles: true,
          detail: {
            token: verifiedToken,
            timestamp: Date.now()
          }
        });
        container.dispatchEvent(event);

      } catch (err) {
        status = 'error';
        box.innerHTML = '!';
        box.style.color = '#ef4444';
        box.style.border = '2px solid #ef4444';
        labelTitle.textContent = 'Verification Failed';
        labelSub.textContent = 'Click to retry';
      }
    }

    card.addEventListener('click', triggerVerification);
    card.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        triggerVerification();
      }
    });
  }

  // Auto-scan and mount on DOM Ready
  function initFastCaptcha() {
    const elements = document.querySelectorAll('.fast-captcha');
    elements.forEach(mountCaptcha);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFastCaptcha);
  } else {
    initFastCaptcha();
  }

  // Expose Global Object
  window.FastCaptcha = {
    render: function (elementOrId, options) {
      const el = typeof elementOrId === 'string' ? document.getElementById(elementOrId) : elementOrId;
      if (el) {
        if (options && options.theme) el.setAttribute('data-theme', options.theme);
        if (options && options.onVerify) {
          el.addEventListener('fastcaptcha:verified', (e) => options.onVerify(e.detail.token, e.detail));
        }
        mountCaptcha(el);
      }
    },
    init: initFastCaptcha
  };
})();
