const Joi = require('joi');

const userPayloadSchema = Joi.object({
  username: Joi.string().max(50).required(),
  password: Joi.string().required(),
  fullname: Joi.string().max(100).required(),
});

module.exports = { userPayloadSchema };
