const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const announceCtrl = require('../controllers/announce');

// post an announcement
router.post('/', auth, announceCtrl.createAnnouncement);

// update an announcement
router.put('/:id', auth, announceCtrl.updateAnnouncement);

// delete one announcement
router.delete('/:id', auth, announceCtrl.deleteAnnouncement);

// get one announcement by id
router.get('/:id', announceCtrl.getOneAnnouncement);

// get all announcement middleware
router.get('/', announceCtrl.getAllAnnouncements);

module.exports = router;
