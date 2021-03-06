class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this.authenticationsService = authenticationsService;
    this.usersService = usersService;
    this.tokenManager = tokenManager;
    this.validator = validator;
  }

  async postAuthenticationHandler(request, h) {
    // validate payload
    this.validator.validatePostAuthenticationPayload(request.payload);

    const { username, password } = request.payload;
    const id = await this.usersService.verifyUserCredential(username, password);

    const accessToken = this.tokenManager.generateAccessToken({ id });
    const refreshToken = this.tokenManager.generateRefreshToken({ id });

    await this.authenticationsService.addRefreshToken(refreshToken);

    return h.response({
      status: 'success',
      message: 'Authentication berhasil ditambahkan',
      data: {
        accessToken,
        refreshToken,
      },
    })
      .code(201);
  }

  async putAuthenticationHandler(request) {
    // validate payload
    this.validator.validatePutAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    // verify refresh token signature
    const { id } = this.tokenManager.verifyRefreshToken(refreshToken);
    // verify refresh token available in database
    await this.authenticationsService.verifyRefreshToken(refreshToken);

    const accessToken = this.tokenManager.generateAccessToken({ id });

    return {
      status: 'success',
      message: 'Authentication berhasil diperbarui',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request) {
    // validate payload
    this.validator.validateDeleteAuthenticationPayload(request.payload);

    const { refreshToken } = request.payload;
    // verify refresh token signature
    this.tokenManager.verifyRefreshToken(refreshToken);
    // verify refresh token available in database
    await this.authenticationsService.verifyRefreshToken(refreshToken);

    await this.authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'Refresh token berhasil dihapus',
    };
  }
}

module.exports = AuthenticationsHandler;
