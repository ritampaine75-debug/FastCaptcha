import { Router } from 'express';
import crypto from 'crypto';
import { saveCaptchaChallenge, consumeCaptchaChallenge } from '../config/firebaseDual.js';
import { rateLimiterMiddleware, getClientIp } from '../middleware/rateLimiter.js';

export const captchaRoutes = Router();
const SECRET = process.env.CAPTCHA_SECRET || 'fast_captcha_secret_key_2026';

function sign(str) {
  return crypto.createHmac('sha256', SECRET).update(str).digest('hex');
}

captchaRoutes.get('/challenge', rateLimiterMiddleware, async (req, res) => {
  try {
    const ip = getClientIp(req);
    const challengeId = 'fc_' + crypto.randomBytes(16).toString('hex');
    const nonceSeed = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now();
    const expiresAt = timestamp + (180 * 1000);
    const prefix = '000';
    const signature = sign(`${challengeId}:${nonceSeed}:${prefix}:${timestamp}`);

    const record = { challengeId, nonceSeed, prefix, timestamp, expiresAt, signature, ip };
    const syncInfo = await saveCaptchaChallenge(record);

    res.json({ success: true, challengeId, nonceSeed, prefix, timestamp, signature, expiresAt, syncInfo });
  } catch (err) {
    res.status(500).json({ success: false, error: 'CHALLENGE_ERROR', message: err.message });
  }
});

captchaRoutes.post('/verify', rateLimiterMiddleware, async (req, res) => {
  try {
    const { challengeId, nonce, hash, signature } = req.body;
    if (!challengeId || nonce === undefined || !hash || !signature) {
      return res.status(400).json({ success: false, error: 'MISSING_PARAMS' });
    }

    const record = await consumeCaptchaChallenge(challengeId);
    if (!record || Date.now() > record.expiresAt) {
      return res.status(400).json({ success: false, error: 'TOKEN_INVALID_OR_EXPIRED' });
    }

    const expectedSig = sign(`${record.challengeId}:${record.nonceSeed}:${record.prefix}:${record.timestamp}`);
    if (expectedSig !== signature) {
      return res.status(403).json({ success: false, error: 'SIGNATURE_INVALID' });
    }

    const computedHash = crypto.createHash('sha256').update(record.nonceSeed + nonce).digest('hex');
    if (computedHash !== hash || !hash.startsWith(record.prefix)) {
      return res.status(400).json({ success: false, error: 'POW_INVALID' });
    }

    const verifiedToken = 'fctok_' + crypto.randomBytes(24).toString('hex');
    res.json({ success: true, isHuman: true, verifiedToken, entropyScore: 0.98, riskScore: 0.02 });
  } catch (err) {
    res.status(500).json({ success: false, error: 'VERIFY_ERROR', message: err.message });
  }
});
