import rateLimit from 'express-rate-limit';

// General API limiter (e.g., 100 requests per 15 minutes)
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Max 100 requests per IP
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// // Login route limiter (stricter)
// export const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // Only 5 login attempts per IP
//   message: 'Too many login attempts. Please try again after 15 minutes.',
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // Forgot password limiter (stricter)
// export const forgotPasswordLimiter = rateLimit({
//   windowMs: 30 * 60 * 1000, // 30 minutes
//   max: 3,
//   message: 'Too many password reset requests. Try again later.',
//   standardHeaders: true,
//   legacyHeaders: false,
// });
