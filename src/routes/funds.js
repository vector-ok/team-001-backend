const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { fundSchema, fundUpdateSchema } = require('../validation/schemas');

const fundCtrl = require('../controllers/funds');

// post funds middleware
router.post('/', auth, validate(fundSchema), fundCtrl.createFund);

// update a fund
router.put('/:id', auth, validate(fundUpdateSchema), fundCtrl.updateFund);

// delete one fund
router.delete('/:id', auth, fundCtrl.deleteFund);

// get one fund by id
router.get('/:id', fundCtrl.getOnefund);

// get all funds middleware
router.get('/', fundCtrl.getAllFunds);

module.exports = router;
