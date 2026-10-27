const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { userSignupSchema, userUpdateSchema, loginSchema } = require('../validation/schemas');

const userCtrl = require('../controllers/user');

router.post('/signup', validate(userSignupSchema), userCtrl.signup);
router.put('/updateUser/:id', auth, validate(userUpdateSchema), userCtrl.updateUser);
router.post('/login', validate(loginSchema), userCtrl.login);

module.exports = router;
