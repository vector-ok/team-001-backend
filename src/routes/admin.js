const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { adminSignupSchema, adminUpdateSchema, loginSchema } = require('../validation/schemas');

const adminCtrl = require('../controllers/admin');

router.post('/admin/signup', validate(adminSignupSchema), adminCtrl.signup);
router.put('/admin/updateAdmin/:id', auth, validate(adminUpdateSchema), adminCtrl.updateAdmin);
router.post('/admin/login', validate(loginSchema), adminCtrl.login);

module.exports = router;
