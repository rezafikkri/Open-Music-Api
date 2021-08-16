class UploadsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  async postUploadPictureHandler(request, h) {
    const { data } = request.payload;
    // validate picture headers
    this.validator.validatePictureHeaders(data.hapi.headers);

    const filename = await this.service.writeFile(data, data.hapi);

    return h.response({
      status: 'success',
      message: 'Gambar berhasil diunggah',
      data: {
        pictureUrl: `http://${process.env.HOST}:${process.env.PORT}/upload/pictures/${filename}`,
      },
    })
      .code(201);
  }
}

module.exports = UploadsHandler;
