const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const optionalText = (max = 255) => Joi.string().trim().max(max).allow('', null);

const optionalDate = Joi.date().empty([null, '']);

const password = Joi.string().min(6).max(128);

const email = Joi.string().trim().lowercase().email().required();

const phoneNumber = Joi.string()
  .trim()
  .pattern(/^\+?[0-9]{5,15}$/)
  .allow('', null)
  .messages({ 'string.pattern.base': 'phoneNumber must contain 5 to 15 digits' });

const profile = {
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  phoneNumber,
  email,
  password: password.required(),
  city: optionalText(100),
  orgName: optionalText(120),
  doBirth: optionalDate,
  sex: optionalText(20),
  imageUrl: optionalText(500),
  role: optionalText(30),
  enabled: Joi.boolean()
};

const userSignupSchema = Joi.object(profile);

const userUpdateSchema = Joi.object({ ...profile, password })
  .fork(['firstName', 'lastName', 'email'], (schema) => schema.optional())
  .min(1);

const adminSignupSchema = Joi.object(profile);

const adminUpdateSchema = Joi.object({ ...profile, password })
  .fork(['firstName', 'lastName', 'email'], (schema) => schema.optional())
  .min(1);

const loginSchema = Joi.object({
  email,
  password: password.required(),
  role: optionalText(30)
});

const eventSchema = Joi.object({
  postedBy: optionalText(120),
  organizerId: optionalText(120),
  sponsorId: optionalText(120),
  title: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().min(1).max(5000).required(),
  imageUrl: optionalText(500),
  createdDate: optionalDate,
  dueRegDate: optionalDate,
  startDate: optionalDate,
  endDate: optionalDate,
  targetAudience: optionalText(120),
  category: Joi.string().trim().min(1).max(80).required(),
  amountToPay: Joi.number().min(1).allow(null),
  paymentDetail: optionalText(500),
  like: Joi.number().integer().min(0).allow(null),
  location: optionalText(200),
  industry: optionalText(120),
  enabled: Joi.boolean()
});

const eventUpdateSchema = eventSchema.fork(['title', 'description', 'category'], (schema) => schema.optional()).min(1);

const fundSchema = Joi.object({
  id: objectId,
  title: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().min(1).max(5000).required(),
  website: optionalText(500),
  fundingBody: optionalText(200)
});

const fundUpdateSchema = fundSchema.fork(['title', 'description'], (schema) => schema.optional()).min(1);

const announcementSchema = Joi.object({
  id: objectId,
  postedBy: optionalText(120),
  title: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().min(1).max(5000).required(),
  role: optionalText(30),
  createdDate: optionalDate,
  admin: Joi.boolean(),
  trainee: Joi.boolean(),
  organizer: Joi.boolean(),
  sponsor: Joi.boolean(),
  linkedEvent: optionalText(120)
});

const announcementUpdateSchema = announcementSchema
  .fork(['title', 'description'], (schema) => schema.optional())
  .min(1);

module.exports = {
  userSignupSchema,
  userUpdateSchema,
  adminSignupSchema,
  adminUpdateSchema,
  loginSchema,
  eventSchema,
  eventUpdateSchema,
  fundSchema,
  fundUpdateSchema,
  announcementSchema,
  announcementUpdateSchema
};
