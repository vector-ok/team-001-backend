const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const FundCtrl = require('../controllers/funds');

// post funds middleware
router.post('/', auth, FundCtrl.createFund);

// update a fund
router.put('/:id', auth, FundCtrl.updateFund);

// delete one fund
router.delete('/:id', auth, FundCtrl.deleteFund);

// get one fund by id
router.get('/:id', FundCtrl.getOnefund);

// get all funds middleware
router.get('/', FundCtrl.getAllFunds);

module.exports = router;
