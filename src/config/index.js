require('dotenv').config({ quiet: true });

const DEFAULT_PORT = 4000;
const DEFAULT_TOKEN_TTL = '24h';
const DEFAULT_LOG_LEVEL = 'info';
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const parsePort = (value) => {
  const port = Number.parseInt(value, 10);
  return Number.isInteger(port) && port > 0 ? port : DEFAULT_PORT;
};

const nodeEnv = process.env.NODE_ENV || 'development';

const config = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  isTest: nodeEnv === 'test',
  port: parsePort(process.env.PORT),
  mongoUri: process.env.STRING,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || DEFAULT_TOKEN_TTL,
  logLevel: process.env.LOG_LEVEL || (nodeEnv === 'test' ? 'silent' : DEFAULT_LOG_LEVEL),
  maxUploadBytes: MAX_UPLOAD_BYTES
};

/**
 * Fails fast on missing settings so a misconfigured deploy never starts
 * half working. Called from the bootstrap in src/index.js.
 */
const assertConfig = () => {
  const missing = [];
  if (!config.mongoUri) missing.push('STRING');
  if (!config.jwtSecret) missing.push('JWT_SECRET');

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}. See .env.example.`);
  }
};

const getJwtSecret = () => {
  if (!config.jwtSecret) {
    throw new Error('JWT_SECRET is not configured. See .env.example.');
  }
  return config.jwtSecret;
};

module.exports = { config, assertConfig, getJwtSecret };
