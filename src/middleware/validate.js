const HttpError = require('../utils/httpError');

/**
 * Validates and sanitises req.body. Unknown keys are dropped and the parsed
 * value replaces the raw body so controllers only ever see trusted input.
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true
  });

  if (error) {
    const details = error.details.map((detail) => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return next(new HttpError(400, 'Invalid request payload.', details));
  }

  req.body = value;
  return next();
};

module.exports = { validate };
