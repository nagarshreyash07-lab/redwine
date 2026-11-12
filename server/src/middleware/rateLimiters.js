import rateLimit from "express-rate-limit";

const base = { standardHeaders: "draft-7", legacyHeaders: false };

export const apiLimiter = rateLimit({
  ...base, windowMs: 15 * 60 * 1000, limit: 300,
  message: { message: "Too many requests. Please slow down." }
});

export const contactLimiter = rateLimit({
  ...base, windowMs: 60 * 60 * 1000, limit: 5,
  message: { message: "Too many messages from this connection. Please try again later." }
});

export const analyticsLimiter = rateLimit({
  ...base, windowMs: 60 * 1000, limit: 120,
  message: { message: "Too many analytics requests. Please try again shortly." }
});
