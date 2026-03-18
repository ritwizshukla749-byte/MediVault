const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const buildLimiter = ({ windowMs, max, message, keyGenerator }) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator,
    message: {
      message,
    },
  });

const authLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many authentication attempts. Please try again in a few minutes.",
});

const emergencyQrLimiter = buildLimiter({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: "Too many emergency profile requests. Please retry shortly.",
});

const reportUploadLimiter = buildLimiter({
  windowMs: 60 * 60 * 1000,
  max: 25,
  keyGenerator: (req) => (req.user && req.user.id ? req.user.id : ipKeyGenerator(req.ip)),
  message: "Too many report uploads. Please wait before uploading again.",
});

module.exports = {
  authLimiter,
  emergencyQrLimiter,
  reportUploadLimiter,
};
