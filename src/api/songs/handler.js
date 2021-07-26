const ClientError = require('../../exceptions/ClientError');

class SongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;
  }

  async postSongHandler(request, h) {
    try {
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
    } catch (error) {
      // if error instanceof ClientError
      if (error instanceof ClientError) {
        throw error;
      }

      // Server error
      console.log(error);
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      })
        .code(500);
    }
  }

  async getSongsHandler(request, h) {
    try {
      const songs = await this.service.getSongs();

      return {
        status: 'success',
        data: {
          songs,
        },
      };
    } catch (error) {
      // if error instanceof ClientError
      if (error instanceof ClientError) {
        throw error;
      }

      // Server error
      console.log(error);
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      })
        .code(500);
    }
  }

  async getSongByIdHandler(request, h) {
    try {
      const { id } = request.params;

      const song = await this.service.getSongById(id);

      return {
        status: 'success',
        data: {
          song,
        },
      };
    } catch (error) {
      // if error instanceof ClientError
      if (error instanceof ClientError) {
        throw error;
      }

      // Server error
      console.log(error);
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      })
        .code(500);
    }
  }

  async putSongByIdHandler(request, h) {
    try {
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
    } catch (error) {
      // if error instanceof ClientError
      if (error instanceof ClientError) {
        throw error;
      }

      // Server error
      console.log(error);
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      })
        .code(500);
    }
  }

  async deleteSongByIdHandler(request, h) {
    try {
      const { id } = request.params;

      await this.service.deleteSongById(id);

      return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
      };
    } catch (error) {
      // if error instanceof ClientError
      if (error instanceof ClientError) {
        throw error;
      }

      // Server error
      console.log(error);
      return h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      })
        .code(500);
    }
  }
}

module.exports = SongsHandler;
