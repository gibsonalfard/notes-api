const { Pool } = require('pg');
const { InvariantError } = require('../../exceptions');

class Authentications {
  constructor() {
    this.pool = new Pool();
  }

  async create(token) {
    const query = {
      text: 'INSERT INTO authentications(token) VALUES($1)',
      values: [token],
    };

    await this.pool.query(query);
  }

  async verify(token) {
    const query = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token],
    };

    const refreshToken = await this.pool.query(query);

    if (!refreshToken.rows.length) {
      throw new InvariantError('INVALID_REFRESH_TOKEN');
    }
  }

  async delete(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this.pool.query(query);
  }
}

module.exports = Authentications;
