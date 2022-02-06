const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { InvariantError, NotFoundError, AuthorizationError } = require('../../exceptions');
const { Notes } = require('../../models');

class Note {
  constructor(collaborationService) {
    this.pool = new Pool();
    this.collaborationService = collaborationService;
  }

  /**
     * Insert note data to postgres
     * @param {object} props
     * @param {string} props.title
     * @param {string} props.body
     * @param {string[]} props.tags
     * @returns {Promise<string>}
     */
  async addNotes(props) {
    const {
      title, body, tags, owner,
    } = props;

    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO notes (id, title, body, tags, owner) VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, title, body, tags, owner],
    };

    const result = await this.pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('ERROR_WHILE_ADD_NOTE');
    }

    return result.rows[0].id;
  }

  /**
     * Get all notes in databases;
     * @returns {Promise<object[]>}
     */
  async getNotes(owner) {
    const query = {
      text: `SELECT n.* FROM notes n
        LEFT JOIN collaborations c ON (n.id=c.note_id) 
        WHERE n.owner = $1 OR c.user_id = $1
        GROUP BY n.id`,
      values: [owner],
    };
    const result = await this.pool.query(query);

    return result.rows.map((row) => new Notes(row));
  }

  /**
     * Return note with specific id
     * @param {string} id
     * @returns {Promise<object>}
     */
  async getNoteById(id) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('NOTE_NOT_EXISTS');
    }

    return new Notes(result.rows[0]);
  }

  /**
     * Update note record by id
     * @param {string} id
     * @param {object} props
     * @param {string} props.title
     * @param {string} props.body
     * @param {string[]} props.tags
     * @returns {Promise<void>}
     */
  async updateNoteById(id, props) {
    const { title, tags, body } = props;

    const query = {
      text: 'UPDATE notes SET title=$1, body=$2, tags=$3 WHERE id=$4 RETURNING id',
      values: [title, body, tags, id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('NOTE_NOT_EXISTS');
    }
  }

  /**
     * delete note record using
     * @param {string} id
     * @returns {void}
     */
  async deleteNoteById(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id=$1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('NOTE_NOT_EXISTS');
    }
  }

  /**
   * Check if user is owner of note
   * @param {string} id
   * @param {string} owner
   * @returns {Promise<void>}
   */
  async verifyNoteOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('NOTE_NOT_EXISTS');
    }

    const note = result.rows[0];

    if (note.owner !== owner) {
      throw new AuthorizationError('FORBIDDEN');
    }
  }

  async verifyNoteAccess(noteId, userId) {
    try {
      await this.verifyNoteOwner(noteId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this.collaborationService.verify({ noteId, userId });
      } catch {
        throw error;
      }
    }
  }
}

module.exports = Note;
