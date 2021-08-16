const {
  postAuthenticationPayloadSchema,
  putAuthenticationPayloadSchema,
  deleteAuthenticationPayloadSChema,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const authenticationsValidator = {
  validatePostAuthenticationPayload(payload) {
    const validationResult = postAuthenticationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePutAuthenticationPayload(payload) {
    const validationResult = putAuthenticationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteAuthenticationPayload(payload) {
    const validationResult = deleteAuthenticationPayloadSChema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = authenticationsValidator;
