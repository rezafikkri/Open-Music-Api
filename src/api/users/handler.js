class UsersHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  async postUserHandler(request, h) {
    // validate payload
    this.validator.validateUserPayload(request.payload);

    const { username, password, fullname } = request.payload;
    const userId = await this.service.addUser(username, password, fullname);

    return h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId,
      },
    })
      .code(201);
  }
}

module.exports = UsersHandler;
