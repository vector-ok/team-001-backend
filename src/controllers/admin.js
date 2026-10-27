const AdminModel = require('../models/admin');
const asyncHandler = require('../utils/asyncHandler');
const HttpError = require('../utils/httpError');
const { registerAccount, updateAccount } = require('../services/accountService');
const { verifyPassword, issueToken, serializeAccount } = require('../services/authService');

const requireAdminRole = (role) => {
  if (role !== 'admin') throw new HttpError(401, 'Permission denied!');
};

const signup = asyncHandler(async (req, res) => {
  requireAdminRole(req.body.role);

  await registerAccount(AdminModel, req.body);
  res.status(201).json({ message: 'Admin added successfully' });
});

const updateAdmin = asyncHandler(async (req, res) => {
  requireAdminRole(req.body.role);

  await updateAccount(AdminModel, req.params.id, req.body);
  res.status(200).json({ message: 'Admin updated successfully' });
});

const login = asyncHandler(async (req, res) => {
  const admin = await AdminModel.findOne({ email: req.body.email });

  if (!admin || req.body.role !== 'admin') throw new HttpError(401, 'Admin not found!');

  const valid = await verifyPassword(req.body.password, admin.password);
  if (!valid) throw new HttpError(401, 'Incorrect admin name or password!');

  res.status(200).json({
    ...serializeAccount(admin, 'adminId'),
    token: issueToken({ adminId: admin._id })
  });
});

module.exports = { signup, updateAdmin, login };
