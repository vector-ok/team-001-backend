const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  phoneNumber: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 15
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  city: { type: String, required: false },
  orgName: { type: String, required: false },
  doBirth: { type: Date, required: false },
  sex: { type: String, required: false },
  imageUrl: { type: String, required: false },
  role: { type: String, required: false, default: 'trainee' },
  enabled: { type: Boolean, default: true }
});

module.exports = mongoose.model('UserModel', userSchema);
