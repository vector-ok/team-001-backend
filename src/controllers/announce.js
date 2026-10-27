const AnnounceModel = require('../models/announceModel');
const { createCrudHandlers } = require('../utils/crudFactory');

const ANNOUNCEMENT_FIELDS = [
  'postedBy',
  'title',
  'description',
  'role',
  'createdDate',
  'admin',
  'trainee',
  'organizer',
  'sponsor',
  'linkedEvent'
];

const buildAnnouncementPayload = (req) => {
  const payload = {};

  if (req.body.id) payload._id = req.body.id;
  ANNOUNCEMENT_FIELDS.forEach((field) => {
    if (req.body[field] !== undefined) payload[field] = req.body[field];
  });

  return payload;
};

const handlers = createCrudHandlers({
  Model: AnnounceModel,
  resource: 'Announcement',
  buildPayload: buildAnnouncementPayload,
  messages: {
    created: 'Announcement post successful!',
    updated: 'Announcement updated successfully!',
    deleted: 'Announcement deleted!',
    notFound: 'Announcement not found.'
  }
});

module.exports = {
  createAnnouncement: handlers.create,
  updateAnnouncement: handlers.update,
  deleteAnnouncement: handlers.remove,
  getOneAnnouncement: handlers.getOne,
  getAllAnnouncements: handlers.getAll
};
