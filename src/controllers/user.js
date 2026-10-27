const UserModel = require('../models/user');
const asyncHandler = require('../utils/asyncHandler');
const HttpError = require('../utils/httpError');
const { registerAccount, updateAccount } = require('../services/accountService');
const { verifyPassword, issueToken, serializeAccount } = require('../services/authService');

const signup = asyncHandler(async (req, res) => {
  await registerAccount(UserModel, req.body);
  res.status(201).json({ message: 'User added successfully' });
});

const updateUser = asyncHandler(async (req, res) => {
  if (req.body.role === 'admin') throw new HttpError(401, 'Log in as user!');

  await updateAccount(UserModel, req.params.id, req.body);
  res.status(200).json({ message: 'User updated successfully' });
});

const login = asyncHandler(async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });

  if (!user) throw new HttpError(401, 'User not found!');

  const valid = await verifyPassword(req.body.password, user.password);
  if (!valid) throw new HttpError(401, 'Incorrect username or password!');

  res.status(200).json({
    ...serializeAccount(user, 'userId'),
    token: issueToken({ userId: user._id })
  });
});

module.exports = { signup, updateUser, login };
