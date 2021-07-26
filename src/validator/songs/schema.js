const Joi = require('joi');

const songPayloadSchema = Joi.object({
  title: Joi.string().max(100).required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  performer: Joi.string().max(50).required(),
  genre: Joi.string().max(50),
  duration: Joi.number().max(32767),
});

module.exports = { songPayloadSchema };
