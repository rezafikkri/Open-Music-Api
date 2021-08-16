const exportPlaylistSongsPayloadSchema = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const exportsValidator = {
  validateExportPlaylistSongsPayload(payload) {
    const validationResult = exportPlaylistSongsPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = exportsValidator;
