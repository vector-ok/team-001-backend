const HttpError = require('../utils/httpError');
const { hashPassword } = require('./authService');

/**
 * Writing an account means hashing a password first, which is the same dance
 * for users and admins. Keeping it here stops the two controllers from
 * drifting apart.
 */
const registerAccount = async (Model, payload) => {
  const { password, ...profile } = payload;
  return Model.create({ ...profile, password: await hashPassword(password) });
};

const updateAccount = async (Model, id, payload) => {
  const updates = { ...payload };

  if (updates.password) {
    updates.password = await hashPassword(updates.password);
  } else {
    delete updates.password;
  }

  const result = await Model.updateOne({ _id: id }, updates, { runValidators: true });

  if (result.matchedCount === 0) throw new HttpError(404, 'Account not found.');
  return result;
};

module.exports = { registerAccount, updateAccount };
