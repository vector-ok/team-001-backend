const logger = require('../utils/logger');

const LEVELS = [
  { min: 500, level: 'error' },
  { min: 400, level: 'warn' }
];

/**
 * One structured line per request, emitted when the response finishes so the
 * status code and duration are already known.
 */
const requestLogger = (req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    const { level } = LEVELS.find((entry) => res.statusCode >= entry.min) || { level: 'info' };

    logger[level](
      {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        durationMs: Math.round(durationMs)
      },
      'request completed'
    );
  });

  next();
};

module.exports = { requestLogger };
