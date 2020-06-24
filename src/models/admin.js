const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const adminSchema = mongoose.Schema({
  firstName: {
    type: String, required: true, min: 2, max: 50
  },
  lastName: {
    type: String, required: true, min: 2, max: 50
  },
  phoneNumber: {
    type: Number, required: false, min: 6, max: 13
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, required: false },
  doBirth: { type: String, required: false },
  sex: { type: String, required: false },
  imageUrl: { type: String, required: false },
  role: { type: String, required: true, default: 'not admin' },
  enabled: { type: Boolean, default: true }
});

adminSchema.plugin(uniqueValidator);
module.exports = mongoose.model('AdminModel', adminSchema);
