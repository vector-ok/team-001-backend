const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { config, getJwtSecret } = require('../config');

const SALT_ROUNDS = 10;

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

const verifyPassword = (password, hash) => bcrypt.compare(password, hash);

const issueToken = (payload) => jwt.sign(payload, getJwtSecret(), { expiresIn: config.jwtExpiresIn });

/**
 * The frontend expects a flat profile next to the token, including the legacy
 * `imageurl` key.
 */
const serializeAccount = (account, idField) => ({
  [idField]: account._id,
  firstName: account.firstName,
  lastName: account.lastName,
  phoneNumber: account.phoneNumber,
  city: account.city,
  orgName: account.orgName,
  doBirth: account.doBirth,
  sex: account.sex,
  role: account.role,
  enabled: account.enabled,
  imageurl: account.imageUrl
});

module.exports = {
  hashPassword,
  verifyPassword,
  issueToken,
  serializeAccount
};
