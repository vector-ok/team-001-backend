const logger = require('../utils/logger');

const GENERIC_MESSAGE = 'Oops! Something went wrong.';

const describeMongooseValidation = (error) =>
  Object.values(error.errors || {})
    .map((detail) => detail.message)
    .join(', ') || error.message;

const duplicateKeyMessage = (error) => {
  const [field] = Object.keys(error.keyValue || {});
  return field ? `${field} is already taken.` : 'That record already exists.';
};

const normalize = (error) => {
  if (error.code === 11000) return { status: 409, message: duplicateKeyMessage(error) };

  switch (error.name) {
    case 'ValidationError':
      return { status: 400, message: describeMongooseValidation(error) };
    case 'CastError':
      return { status: 400, message: `Invalid value for ${error.path}.` };
    case 'JsonWebTokenError':
    case 'TokenExpiredError':
      return { status: 401, message: 'Invalid or expired token.' };
    default:
      break;
  }

  if (error.type === 'entity.parse.failed') {
    return { status: 400, message: 'Request body is not valid JSON.' };
  }

  const status = error.status || error.statusCode || 500;
  return { status, message: error.message || GENERIC_MESSAGE };
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  const { status, message } = normalize(error);
  const log = {
    status,
    method: req.method,
    url: req.originalUrl,
    err: error
  };

  if (status >= 500) {
    logger.error(log, 'Unhandled request failure');
  } else {
    logger.warn(log, 'Request rejected');
  }

  const body = { message: status >= 500 ? GENERIC_MESSAGE : message };
  if (error.details) body.details = error.details;

  return res.status(status).json(body);
};

const notFoundHandler = (req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} was not found.` });
};

module.exports = { errorHandler, notFoundHandler };
