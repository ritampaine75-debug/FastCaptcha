const ipWindows = new Map();
const ramBlacklist = new Map();
const WINDOW_SIZE_MS = 1000;
const MAX_REQ_PER_SEC = 10;
const BLACKLIST_BURST_THRESHOLD = 50;
const BLACKLIST_DURATION_MS = 15 * 60 * 1000;

export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.ip || req.socket.remoteAddress || '127.0.0.1';
}

export function rateLimiterMiddleware(req, res, next) {
  const now = Date.now();
  const ip = getClientIp(req);

  if (ramBlacklist.has(ip)) {
    const entry = ramBlacklist.get(ip);
    if (now < entry.expiresAt) {
      const remainingSeconds = Math.ceil((entry.expiresAt - now) / 1000);
      return res.status(403).json({
        success: false,
        error: 'IP_BLACKLISTED_RAM',
        message: `High-frequency DDoS attack detected. Quarantined for ${remainingSeconds}s.`
      });
    } else {
      ramBlacklist.delete(ip);
    }
  }

  let window = ipWindows.get(ip);
  if (!window) {
    window = { timestamps: [] };
    ipWindows.set(ip, window);
  }

  window.timestamps = window.timestamps.filter(ts => now - ts < WINDOW_SIZE_MS);
  window.timestamps.push(now);
  const currentReqCount = window.timestamps.length;

  if (currentReqCount > BLACKLIST_BURST_THRESHOLD) {
    ramBlacklist.set(ip, { ip, blacklistedAt: now, expiresAt: now + BLACKLIST_DURATION_MS, burstCount: currentReqCount });
    return res.status(429).json({
      success: false,
      error: 'DDOS_BURST_BLACKLISTED',
      message: `Critical limit exceeded (${currentReqCount} req/s > 50 req/s). Quarantined in RAM for 15 minutes.`
    });
  }

  if (currentReqCount > MAX_REQ_PER_SEC) {
    res.setHeader('Retry-After', '1');
    return res.status(429).json({
      success: false,
      error: 'TOO_MANY_REQUESTS',
      message: `Rate limit exceeded: max 10 req/s.`
    });
  }

  next();
}
