import { Request, Response, NextFunction } from 'express';

interface TokenWindow {
  timestamps: number[];
  burstViolations: number;
}

interface BlacklistEntry {
  ip: string;
  reason: string;
  blacklistedAt: number;
  expiresAt: number;
  burstCount: number;
}

const ipWindows = new Map<string, TokenWindow>();
const ramBlacklist = new Map<string, BlacklistEntry>();

const rateLimiterMetrics = {
  totalRequests: 0,
  allowedRequests: 0,
  throttled429Requests: 0,
  blacklistedBlockedRequests: 0,
  activeBlacklistCount: 0,
  highestRequestsPerSec: 0,
  recentEvents: [] as Array<{
    id: string;
    ip: string;
    type: 'ALLOW' | '429_THROTTLE' | 'BLACKLIST_TRIGGER' | 'BLACKLIST_BLOCKED';
    rate: number;
    timestamp: number;
    details: string;
  }>
};

const WINDOW_SIZE_MS = 1000;
const MAX_REQ_PER_SEC = 10;
const BLACKLIST_BURST_THRESHOLD = 50;
const BLACKLIST_DURATION_MS = 15 * 60 * 1000;

export function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || '127.0.0.1';
}

export function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction): void {
  const now = Date.now();
  const ip = getClientIp(req);
  rateLimiterMetrics.totalRequests++;

  if (ramBlacklist.has(ip)) {
    const entry = ramBlacklist.get(ip)!;
    if (now < entry.expiresAt) {
      rateLimiterMetrics.blacklistedBlockedRequests++;
      const remainingSeconds = Math.ceil((entry.expiresAt - now) / 1000);
      
      res.status(403).json({
        success: false,
        error: 'IP_BLACKLISTED_RAM',
        message: `High-frequency DDoS attack detected. Quarantined in RAM for ${remainingSeconds} more seconds.`,
        retryAfterSeconds: remainingSeconds
      });
      return;
    } else {
      ramBlacklist.delete(ip);
    }
  }

  let window = ipWindows.get(ip);
  if (!window) {
    window = { timestamps: [], burstViolations: 0 };
    ipWindows.set(ip, window);
  }

  window.timestamps = window.timestamps.filter(ts => now - ts < WINDOW_SIZE_MS);
  window.timestamps.push(now);

  const currentReqCount = window.timestamps.length;
  if (currentReqCount > rateLimiterMetrics.highestRequestsPerSec) {
    rateLimiterMetrics.highestRequestsPerSec = currentReqCount;
  }

  if (currentReqCount > BLACKLIST_BURST_THRESHOLD) {
    const expiresAt = now + BLACKLIST_DURATION_MS;
    ramBlacklist.set(ip, {
      ip,
      reason: `Sustained high-velocity burst (${currentReqCount} requests in 1000ms)`,
      blacklistedAt: now,
      expiresAt,
      burstCount: currentReqCount
    });

    res.status(429).json({
      success: false,
      error: 'DDOS_BURST_BLACKLISTED',
      message: `Critical threshold exceeded (${currentReqCount} req/s > 50 req/s). IP quarantined in RAM for 15 minutes.`,
      blacklistedForMinutes: 15
    });
    return;
  }

  if (currentReqCount > MAX_REQ_PER_SEC) {
    rateLimiterMetrics.throttled429Requests++;
    window.burstViolations++;

    res.setHeader('Retry-After', '1');
    res.status(429).json({
      success: false,
      error: 'TOO_MANY_REQUESTS',
      message: `Rate limit exceeded: max 10 req/s. Current velocity: ${currentReqCount} req/s.`,
      retryAfterSeconds: 1
    });
    return;
  }

  rateLimiterMetrics.allowedRequests++;
  next();
}

export function getRateLimiterMetrics() {
  rateLimiterMetrics.activeBlacklistCount = ramBlacklist.size;
  const blacklistList = Array.from(ramBlacklist.values()).map(e => ({
    ...e,
    remainingSeconds: Math.max(0, Math.ceil((e.expiresAt - Date.now()) / 1000))
  }));

  return {
    ...rateLimiterMetrics,
    blacklistedIps: blacklistList,
    activeIpWindowsCount: ipWindows.size
  };
}

export function resetRateLimiter(ipToClear?: string) {
  if (ipToClear) {
    ramBlacklist.delete(ipToClear);
    ipWindows.delete(ipToClear);
  } else {
    ramBlacklist.clear();
    ipWindows.clear();
  }
  rateLimiterMetrics.activeBlacklistCount = ramBlacklist.size;
  return getRateLimiterMetrics();
}
