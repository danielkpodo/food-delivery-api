const rateLimit = require('express-rate-limit');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
/** Restrict all routes to only 100 requests per IP address every 1o minutes */
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // 100 requests per IP
  message: {
    statusCode: StatusCodes.TOO_MANY_REQUESTS,
    statusMessage: ReasonPhrases.TOO_MANY_REQUESTS,
    message: 'Too many requests, please try again later.',
  },
});

const loginLimiter = rateLimit({
  // 60000 ms (= 1 minute).
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login tries requests per `window` (here, per hour)
  message: {
    statusCode: StatusCodes.TOO_MANY_REQUESTS,
    statusMessage: ReasonPhrases.TOO_MANY_REQUESTS,
    message:
      'Too many login attempts from this IP, please try again after an hour',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = {
  limiter,
  loginLimiter,
};
