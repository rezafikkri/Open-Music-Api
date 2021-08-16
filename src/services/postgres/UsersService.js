const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../../exceptions/InvariantError');
const AuthenticationError = require('../../exceptions/AuthenticationError');

class UsersService {
  constructor() {
    this.pool = new Pool();
  }

  async addUser(username, password, fullname) {
    // verify username
    await this.verifyNewUsername(username);

    const id = `user-${nanoid(16)}`;
    const hasedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hasedPassword, fullname],
    };
    const result = await this.pool.query(query);

    // if not success add user
    if (!result.rows.length) {
      throw new InvariantError('User gagal ditambahkan.');
    }

    return result.rows[0].id;
  }

  async verifyNewUsername(username) {
    const query = {
      text: 'SELECT id FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this.pool.query(query);

    // if exists username
    if (result.rows.length) {
      throw new InvariantError('Gagal menambahkan user. Username sudah digunakan.');
    }
  }

  async verifyUserCredential(username, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE username = $1',
      values: [username],
    };
    const result = await this.pool.query(query);

    // if not exists user
    if (!result.rows.length) {
      throw new AuthenticationError('Kredensial yang Anda berikan salah');
    }

    const { id, password: hasedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hasedPassword);

    // if password worng
    if (!match) {
      throw new AuthenticationError('Kredensial yang anda berikan salah');
    }

    return id;
  }
}

module.exports = UsersService;
