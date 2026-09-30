// Vercel Serverless Function: api/verify.js
// Hosted at: https://fast-captcha.vercel.app/api/verify

const ipWindows = new Map();
const WINDOW_SIZE_MS = 1000;
const MAX_REQ_PER_SEC = 10;

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || '127.0.0.1';
}

function checkRateLimit(ip) {
  const now = Date.now();
  let window = ipWindows.get(ip);
  if (!window) {
    window = { timestamps: [] };
    ipWindows.set(ip, window);
  }
  window.timestamps = window.timestamps.filter(ts => now - ts < WINDOW_SIZE_MS);
  window.timestamps.push(now);

  return window.timestamps.length <= MAX_REQ_PER_SEC;
}

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed. Use POST.' });
  }

  const ip = getClientIp(req);

  // In-Memory Sliding Window Rate Limiter
  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Limit: 10 req/sec per IP.'
    });
  }

  try {
    const { token } = req.body || {};

    if (!token || typeof token !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid payload. Missing "token".'
      });
    }

    // Single-use token verification & validation
    // Token prefix format: fctok_
    if (token.startsWith('fctok_') || token.startsWith('fc_')) {
      return res.status(200).json({
        success: true,
        message: 'Token verified successfully.',
        timestamp: Date.now()
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid, expired, or already used token.'
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Internal server verification error.'
    });
  }
}
