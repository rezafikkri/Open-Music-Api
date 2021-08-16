const Joi = require('joi');

const exportPlaylistSongsPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = exportPlaylistSongsPayloadSchema;
