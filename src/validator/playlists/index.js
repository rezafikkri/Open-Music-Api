const {
  playlistPayloadSchema,
  postPlaylistSongPayloadSchema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const playlistsValidator = {
  validatePlaylistPayload(payload) {
    const validationResult = playlistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostPlaylistSongPayload(payload) {
    const validationResult = postPlaylistSongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = playlistsValidator;
