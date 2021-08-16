const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');

class CollaborationsService {
  constructor(cacheService) {
    this.pool = new Pool();
    this.cacheService = cacheService;
  }

  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };
    const result = await this.pool.query(query);

    // if not success add collaborations
    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }

    /* delete playlists cache,
     * Need for delete cache in collaborations because
     * Example:
     * If we have userA, userB and playlistA(owned by userA)
     * First, userB get playlists, then playlists is cached
     * Second, userA add userB as a collaborator for playlistA
     *
     * Here's the problem, if we don't clear playlists cache when adding and removing collaborators
     *
     * When userB get playlists again, playlistA is not in list, while userB is now a
     * playlistA collaborator, because get playlists from cache not from db.
     */
    await this.cacheService.delete(`playlists:${userId}`);

    return result.rows[0].id;
  }

  async deleteCollaboration(playlistId, userId) {
    const query = {
      text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id',
      values: [playlistId, userId],
    };
    const result = await this.pool.query(query);

    // if delete collaborator doesn't work
    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }

    // delete playlists cache
    await this.cacheService.delete(`playlists:${userId}`);
  }

  async verifyCollaborator(playlistId, userId) {
    const query = {
      text: 'SELECT id FROM collaborations WHERE playlist_id = $1 AND user_id = $2',
      values: [playlistId, userId],
    };
    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal diverifikasi');
    }
  }

  async getAllCollaboratorPlaylist(playlistId) {
    const query = {
      text: 'SELECT user_id FROM collaborations WHERE playlist_id = $1',
      values: [playlistId],
      rowMode: 'array',
    };
    const result = await this.pool.query(query);
    return result.rows.map((r) => r[0]);
  }
}

module.exports = CollaborationsService;
