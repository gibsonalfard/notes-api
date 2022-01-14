const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const { InvariantError, NotFoundError, AuthenticationError } = require('../../exceptions');
const { Users } = require('../../models');

class User {
  constructor() {
    this.pool = new Pool();
  }

  /**
   * Add user with given payload
   * @param {object} props
   * @returns {Promise<string>}
   */
  async addUsers(props) {
    const { username, password, fullname } = props;

    await this.verifyExists(username);

    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users(id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, username, hashedPassword, fullname],
    };

    const user = await this.pool.query(query);

    if (!user.rows[0].id) {
      throw new InvariantError('ERROR_WHILE_ADD_USER');
    }

    return user.rows[0].id;
  }

  /**
   * Verify if user with specific username already exists
   * @param {string} username
   * @returns {Promise<void>}
   */
  async verifyExists(username) {
    const query = {
      text: 'SELECT * FROM users WHERE username=$1',
      values: [username],
    };

    const user = await this.pool.query(query);

    if (user.rows.length > 0) {
      throw new InvariantError('ALREADY_EXISTS');
    }
  }

  /**
   * Get user using specific userId
   * @param {string} id
   * @returns {Promise<object>}
   */
  async getOneById(id) {
    const query = {
      text: 'SELECT * FROM users WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('USER_NOT_FOUND');
    }

    return new Users(result.rows[0]);
  }

  /**
   * Authenticate user using username and password
   * @param {string} username
   * @param {string} password
   * @returns {Promise<string>}
   */
  async verify(username, password) {
    const query = {
      text: 'SELECT * FROM users WHERE username=$1',
      values: [username],
    };

    const user = await this.pool.query(query);

    if (!user.rows.length) {
      throw new AuthenticationError('AUTHENTICATION_FAILED');
    }

    const { id, password: hashedPassword } = new Users(user.rows[0]);
    const match = bcrypt.compare(password, hashedPassword);

    if (!match) {
      throw new AuthenticationError('AUTHENTICATION_FAILED');
    }

    return id;
  }
}

module.exports = User;
