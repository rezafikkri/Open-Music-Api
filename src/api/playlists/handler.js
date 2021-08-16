class PlaylistsHandler {
  constructor(playlistsService, songsService, validator) {
    this.playlistsService = playlistsService;
    this.songsService = songsService;
    this.validator = validator;
  }

  async postPlaylistHandler(request, h) {
    // validate payload
    this.validator.validatePlaylistPayload(request.payload);

    const { name } = request.payload;
    const owner = request.auth.credentials.id;

    const playlistId = await this.playlistsService.addPlaylist(name, owner);

    return h.response({
      status: 'success',
      message: 'Playlist berhasil ditambahkan',
      data: {
        playlistId,
      },
    })
      .code(201);
  }

  async getPlaylistsHandler(request) {
    const userId = request.auth.credentials.id;
    const playlists = await this.playlistsService.getPlaylists(userId);

    return {
      status: 'success',
      data: {
        playlists,
      },
    };
  }

  async deletePlaylistHandler(request) {
    const { id } = request.params;
    const owner = request.auth.credentials.id;

    // verify playlist owner
    await this.playlistsService.verifyPlaylistOwner(id, owner);

    await this.playlistsService.deletePlaylistById(id, owner);

    return {
      status: 'success',
      message: 'Playlist berhasil dihapus',
    };
  }

  async postPlaylistSongHandler(request, h) {
    // validate payload
    this.validator.validatePostPlaylistSongPayload(request.payload);

    const playlistId = request.params.id;
    const userId = request.auth.credentials.id;
    const { songId } = request.payload;

    // verify playlist access
    await this.playlistsService.verifyPlaylistAccess(playlistId, userId);
    // verify song id
    await this.songsService.verifyValidSongId(songId);

    await this.playlistsService.addPlaylistSong(playlistId, songId);

    return h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke playlist',
    })
      .code(201);
  }

  async getPlaylistSongsHandler(request) {
    const playlistId = request.params.id;
    const userId = request.auth.credentials.id;

    // verify playlist access
    await this.playlistsService.verifyPlaylistAccess(playlistId, userId);

    const songs = await this.playlistsService.getPlaylistSongs(playlistId);

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    const playlistId = request.params.id;
    const userId = request.auth.credentials.id;
    const { songId } = request.payload;

    // verify playlist access
    await this.playlistsService.verifyPlaylistAccess(playlistId, userId);
    // verify song id
    await this.songsService.verifyValidSongId(songId);

    await this.playlistsService.deletePlaylistSong(playlistId, songId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist',
    };
  }
}

module.exports = PlaylistsHandler;
