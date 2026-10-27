const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config');

const unauthorized = (res) => res.status(401).json({ message: 'Invalid request!' });

/**
 * Verifies the bearer token and, when the client also sends an id in the body,
 * makes sure it matches the token subject.
 */
module.exports = (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || '').split(' ');

  if (scheme !== 'Bearer' || !token) return unauthorized(res);

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    const body = req.body || {};
    const tokenId = decoded.userId || decoded.adminId;
    const claimedId = body.userId || body.adminId;

    if (claimedId && String(claimedId) !== String(tokenId)) return unauthorized(res);

    req.auth = decoded;
    return next();
  } catch {
    return unauthorized(res);
  }
};
