class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this.collaborationsService = collaborationsService;
    this.playlistsService = playlistsService;
    this.validator = validator;
  }

  async postCollaborationHandler(request, h) {
    // validate collaboration payload
    this.validator.validateCollaborationPayload(request.payload);

    const credentialId = request.auth.credentials.id;
    const { playlistId, userId } = request.payload;

    // verify playlist owner
    await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const collaborationId = await this.collaborationsService.addCollaboration(playlistId, userId);

    return h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    })
      .code(201);
  }

  async deleteCollaborationHandler(request) {
    // validate collaboration payload
    this.validator.validateCollaborationPayload(request.payload);

    const credentialId = request.auth.credentials.id;
    const { playlistId, userId } = request.payload;

    // verify playlist owner
    await this.playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    await this.collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
