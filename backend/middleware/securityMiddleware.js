import rateLimit from 'express-rate-limit';

/**
 * General API Rate Limiter
 * Restricts overall request traffic to prevent Denial-of-Service (DoS) attacks.
 * Limit: 300 requests per 15 minutes per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 300,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    status: 429,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  }
});

/**
 * Strict Authentication Rate Limiter (Brute-Force & Credential-Stuffing Protection)
 * Restricts repeated login/register attempts.
 * Limit: 10 attempts per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    status: 429,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
  }
});

export default {
  apiLimiter,
  authLimiter
};
