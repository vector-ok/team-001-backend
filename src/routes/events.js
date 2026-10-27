const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const unwrapEventBody = require('../middleware/eventBody');
const { validate } = require('../middleware/validate');
const { eventSchema, eventUpdateSchema } = require('../validation/schemas');

const eventCtrl = require('../controllers/events');

// post event middleware
router.post('/', auth, multer, unwrapEventBody, validate(eventSchema), eventCtrl.createEvent);

// update one event
router.put('/:id', auth, multer, unwrapEventBody, validate(eventUpdateSchema), eventCtrl.updateEvent);

// delete one event
router.delete('/:id', auth, eventCtrl.deleteEvent);

// get one event by id
router.get('/:id', eventCtrl.getOneEvent);

// get all events middleware
router.get('/', eventCtrl.getAllEvents);

module.exports = router;
