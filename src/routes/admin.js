const express = require('express');

const router = express.Router();

const adminCtrl = require('../controllers/admin');

router.post('/admin/signup', adminCtrl.signup);
router.post('/admin/login', adminCtrl.login);

module.exports = router;
