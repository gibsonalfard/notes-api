const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { InvariantError } = require('../../exceptions');

class CollaborationsService {
  constructor() {
    this.pool = new Pool();
  }

  /**
       * Create collaboration to grant access to note
       * @param {Object} props
       * @returns {Promise<string>}
       */
  async create(props) {
    const { noteId, userId } = props;

    const id = `collab-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, noteId, userId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  /**
       * Revoke access from collaborator
       * @param {Object} props
       * @returns {Promise<void>}
       */
  async delete(props) {
    const { noteId, userId } = props;

    const query = {
      text: 'DELETE FROM collaborations WHERE note_id = $1 AND user_id = $2 RETURNING id',
      values: [noteId, userId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
  }

  /**
       * Verifiy if user have collaborator access to note
       * @param {Object} props
       * @return {Promise<void>}
       */
  async verify(props) {
    const { noteId, userId } = props;
    console.log({ noteId, userId });

    const query = {
      text: 'SELECT * FROM collaborations WHERE note_id = $1 AND user_id = $2',
      values: [noteId, userId],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal ditemukan');
    }
  }
}

module.exports = CollaborationsService;
