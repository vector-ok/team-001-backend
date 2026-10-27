/**
 * Wraps an async route handler so rejections reach the error middleware
 * instead of hanging the request.
 */
const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

module.exports = asyncHandler;
