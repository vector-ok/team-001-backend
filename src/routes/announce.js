const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { announcementSchema, announcementUpdateSchema } = require('../validation/schemas');

const announceCtrl = require('../controllers/announce');

// post an announcement
router.post('/', auth, validate(announcementSchema), announceCtrl.createAnnouncement);

// update an announcement
router.put('/:id', auth, validate(announcementUpdateSchema), announceCtrl.updateAnnouncement);

// delete one announcement
router.delete('/:id', auth, announceCtrl.deleteAnnouncement);

// get one announcement by id
router.get('/:id', announceCtrl.getOneAnnouncement);

// get all announcement middleware
router.get('/', announceCtrl.getAllAnnouncements);

module.exports = router;
