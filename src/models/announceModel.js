const mongoose = require('mongoose');

const announceSchema = mongoose.Schema({
  postedBy: { type: String, required: false },
  linkedEvent: { type: String, required: false },
  title: { type: String, required: true },
  description: { type: String, required: true },
  role: { type: String, required: false },
  createdDate: { type: Date, default: Date.now },
  admin: { type: Boolean, required: false },
  trainee: { type: Boolean, required: false },
  organizer: { type: Boolean, required: false },
  sponsor: { type: Boolean, required: false }
});

module.exports = mongoose.model('AnnounceModel', announceSchema);
