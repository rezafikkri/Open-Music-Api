class SongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  async postSongHandler(request, h) {
    // validate payload
    this.validator.validateSongPayload(request.payload);

    const {
      title,
      year,
      performer,
      genre = null,
      duration = null,
    } = request.payload;
    const songId = await this.service.addSong(title, year, performer, genre, duration);

    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan',
      data: {
        songId,
      },
    })
      .code(201);
  }

  async getSongsHandler() {
    const songs = await this.service.getSongs();

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;

    const song = await this.service.getSongById(id);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    // validate payload
    this.validator.validateSongPayload(request.payload);

    const { id } = request.params;
    const {
      title,
      year,
      performer,
      genre = null,
      duration = null,
    } = request.payload;
    await this.service.editSongById(id, title, year, performer, genre, duration);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;

    await this.service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
