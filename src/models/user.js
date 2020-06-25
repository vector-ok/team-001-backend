const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
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
  orgName: { type: String, required: false },
  doBirth: { type: Date, required: false },
  sex: { type: String, required: false },
  imageUrl: { type: String, required: false },
  role: { type: String, required: false, default: 'trainee' },
  enabled: { type: Boolean, default: true }
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('UserModel', userSchema);
