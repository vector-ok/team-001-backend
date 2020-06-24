const mongoose = require('mongoose');

const fundSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  website: { type: String, required: false },
  fundingBody: { type: String, required: false }
});

module.exports = mongoose.model('FundModel', fundSchema);
