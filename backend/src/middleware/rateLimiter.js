// backend/src/middleware/rateLimiter.js
import rateLimit from "express-rate-limit";

// ✅ Global limiter — har IP ke liye 15 min mein max 200 requests
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Bahut zyada requests. 15 minute baad dobara koshish karein.",
  },
});

// ✅ Auth limiter — login/register pe strict: 15 min mein max 10 attempts
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Bahut zyada login attempts. 15 minute baad dobara koshish karein.",
  },
  skipSuccessfulRequests: true, // successful requests count nahi honge
});