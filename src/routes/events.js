const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const multer = require('../middleware/multer.config');

const eventCtrl = require('../controllers/events');

// post event middleware
router.post('/', auth, multer, eventCtrl.createEvent);

// update one event
router.put('/:id', auth, multer, eventCtrl.updateEvent);

// delete one event
router.delete('/:id', eventCtrl.deleteEvent);

// get one event by id
router.get('/:id', eventCtrl.getOneEvent);

// get all events middleware
router.get('/', eventCtrl.getAllEvents);

module.exports = router;
