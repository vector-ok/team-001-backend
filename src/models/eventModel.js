const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  organizerId: { type: String, required: false },
  sponsorId: { type: String, required: false },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: false },
  createdDate: { type: Date, default: Date.now },
  dueRegDate: { type: Date, required: false },
  startDate: { type: Date, required: false },
  endDate: { type: Date, required: false },
  targetAudience: { type: String, required: false },
  category: { type: String, required: true },
  amountToPay: { type: Number, min: 1, required: false },
  paymentDetail: { type: String, required: false },
  like: { type: Number, required: false },
  location: { type: String, required: false },
  industry: { type: String, required: false },
  enabled: { type: Boolean, required: false }
});

module.exports = mongoose.model('EventModel', eventSchema);
