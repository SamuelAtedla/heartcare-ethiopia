const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Limits each IP to 50 requests per 15 mins (stricter for medical apps)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many requests. Please try again later."
});

const securityMiddleware = (app) => {
  app.use(helmet()); // Sets security headers (XSS protection, etc.)
  app.use(apiLimiter);
};

module.exports = securityMiddleware;