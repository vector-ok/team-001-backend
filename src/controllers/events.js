const EventModel = require('../models/eventModel');
const { createCrudHandlers } = require('../utils/crudFactory');

const EVENT_FIELDS = [
  'postedBy',
  'organizerId',
  'sponsorId',
  'title',
  'description',
  'createdDate',
  'dueRegDate',
  'startDate',
  'endDate',
  'targetAudience',
  'category',
  'amountToPay',
  'paymentDetail',
  'like',
  'location',
  'industry',
  'enabled'
];

const absoluteImageUrl = (req, imagePath) => {
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  return `${req.protocol}://${req.get('host')}/images/${imagePath}`;
};

const buildEventPayload = (req) => {
  const payload = {};

  EVENT_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) payload[field] = req.body[field];
  });

  const image = req.body.imageUrl || (req.file && req.file.filename);
  if (image) payload.imageUrl = absoluteImageUrl(req, image);

  return payload;
};

const handlers = createCrudHandlers({
  Model: EventModel,
  resource: 'Event',
  buildPayload: buildEventPayload,
  messages: {
    created: 'Event post successful!',
    updated: 'Event updated successfully!',
    deleted: 'Event deleted!',
    notFound: 'Event not found.'
  }
});

module.exports = {
  createEvent: handlers.create,
  updateEvent: handlers.update,
  deleteEvent: handlers.remove,
  getOneEvent: handlers.getOne,
  getAllEvents: handlers.getAll
};
