class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this.producerService = producerService;
    this.playlistsService = playlistsService;
    this.validator = validator;
  }

  async postExportPlaylistSongsHandler(request, h) {
    // validate payload
    this.validator.validateExportPlaylistSongsPayload(request.payload);

    const userId = request.auth.credentials.id;
    const playlistId = request.params.id;

    // verify playlists access
    await this.playlistsService.verifyPlaylistAccess(playlistId, userId);

    const message = {
      playlistId,
      targetEmail: request.payload.targetEmail,
    };

    await this.producerService.sendMessage('exports:playlistSongs', JSON.stringify(message));

    return h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    })
      .code(201);
  }
}

module.exports = ExportsHandler;
