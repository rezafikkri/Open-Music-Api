const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

class PlaylistsService {
  constructor(songsService, collaborationsService, cacheService) {
    this.pool = new Pool();
    this.songsService = songsService;
    this.collaborationsService = collaborationsService;
    this.cacheService = cacheService;
  }

  async addPlaylist(name, owner) {
    const id = `playlist-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };
    const result = await this.pool.query(query);

    // if adding playlist doesn't work
    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    // delete playlists cache
    await this.cacheService.delete(`playlists:${owner}`);

    return result.rows[0].id;
  }

  async getPlaylists(userId) {
    try {
      // get playlists from cache
      const result = await this.cacheService.get(`playlists:${userId}`);
      return JSON.parse(result);
    } catch (error) {
      // if fail, get playlists from db
      const query = {
        text: `SELECT pl.id, pl.name, u.username FROM playlists pl
        INNER JOIN users u ON u.id = pl.owner
        LEFT JOIN collaborations c ON c.playlist_id = pl.id
        WHERE pl.owner = $1 OR c.user_id = $1`,
        values: [userId],
      };
      const result = await this.pool.query(query);
      const playlists = result.rows;

      // save playlists to cache
      await this.cacheService.set(`playlists:${userId}`, JSON.stringify(playlists));

      return playlists;
    }
  }

  async deletePlaylistById(id, owner) {
    // get all collaborator playlist
    const collaborators = await this.collaborationsService.getAllCollaboratorPlaylist(id);

    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };
    const result = await this.pool.query(query);

    // if deleting doesn't work
    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal dihapus. Id tidak ditemukan');
    }

    // delete playlists cache
    await this.cacheService.delete(`playlists:${owner}`);

    if (collaborators.length > 0) {
      // delete all collaborator playlist cache
      await this.cacheService.delete(collaborators.map((c) => `playlists:${c}`));
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT owner FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this.pool.query(query);

    // if the playlist doesn't exists
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlistOwner = result.rows[0].owner;

    // if playlistOwner not equal to owner
    if (playlistOwner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        await this.collaborationsService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }

  async addPlaylistSong(playlistId, songId) {
    const id = `playlistSong-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlistsongs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };
    const result = await this.pool.query(query);

    // if doesn't work add the song to playlist
    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

    // delete playlist songs cache
    await this.cacheService.delete(`playlistSongs:${playlistId}`);
  }

  async getPlaylistSongs(playlistId) {
    try {
      // get songs from cache
      const result = await this.cacheService.get(`playlistSongs:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      // if fail get songs from cache, get songs from db
      const query = {
        text: `SELECT s.id, s.title, s.performer FROM playlistsongs ps
        INNER JOIN songs s ON s.id = ps.song_id
        WHERE playlist_id = $1`,
        values: [playlistId],
      };
      const result = await this.pool.query(query);
      const songs = result.rows;

      // save songs to cache
      await this.cacheService.set(`playlistSongs:${playlistId}`, JSON.stringify(songs));

      return songs;
    }
  }

  async deletePlaylistSong(playlistId, songId) {
    const query = {
      text: 'DELETE FROM playlistsongs WHERE playlist_id = $1 AND song_id = $2 RETURNING id',
      values: [playlistId, songId],
    };
    const result = await this.pool.query(query);

    // if deleting doesn't work
    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal dihapus dari playlist');
    }

    // delete playlist songs cache
    await this.cacheService.delete(`playlistSongs:${playlistId}`);
  }
}

module.exports = PlaylistsService;
