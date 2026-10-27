const pino = require('pino');
const { config } = require('../config');

const logger = pino({
  level: config.logLevel,
  base: { service: 'betalife-backend' },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'password'],
    censor: '[redacted]'
  }
});

module.exports = logger;
