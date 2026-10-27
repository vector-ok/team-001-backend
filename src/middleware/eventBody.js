const HttpError = require('../utils/httpError');

const parseEventModel = (value) => {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'object') return value;

  try {
    return JSON.parse(value);
  } catch {
    throw new HttpError(400, 'eventModel must be valid JSON.');
  }
};

/**
 * Event updates used to arrive as a JSON encoded `eventModel` field when a file
 * was attached. Flatten it so one schema validation handles both shapes.
 */
module.exports = (req, res, next) => {
  if (!req.body || req.body.eventModel === undefined) return next();

  try {
    const { eventModel, ...rest } = req.body;
    req.body = { ...rest, ...parseEventModel(eventModel) };
    return next();
  } catch (error) {
    return next(error);
  }
};
