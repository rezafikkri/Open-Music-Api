const Joi = require('joi');

const playlistPayloadSchema = Joi.object({
  name: Joi.string().max(100).required(),
});

const postPlaylistSongPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = {
  playlistPayloadSchema,
  postPlaylistSongPayloadSchema,
};
