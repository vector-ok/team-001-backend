const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const adminCtrl = require('../controllers/admin');

router.post('/admin/signup', adminCtrl.signup);
router.put('/admin/updateAdmin/:id', auth, adminCtrl.updateAdmin);
router.post('/admin/login', adminCtrl.login);

module.exports = router;
