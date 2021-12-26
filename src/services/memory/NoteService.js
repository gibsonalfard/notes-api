const { nanoid } = require('nanoid');
const { InvariantError, NotFoundError } = require('../../exceptions');

class NoteService {
  constructor() {
    this.notes = [];
  }

  /**
   * Add note to saved array
   * @param {object} props
   * @param {string} props.title
   * @param {string} props.body
   * @param {string[]} props.tags
   * @returns {string}
   */
  addNotes({ title, body, tags }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
      title, tags, body, id, createdAt, updatedAt,
    };

    this.notes.push(newNote);

    const isSuccess = this.notes.filter((note) => note.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('ERROR_WHILE_ADD_NOTE');
    }

    return id;
  }

  /**
   * Get all note record
   * @returns {object[]}
   */
  getNotes() {
    return this.notes;
  }

  /**
   * Get note by id
   * @param {string} id
   * @returns {object}
   */
  getNoteById(id) {
    const note = this.notes.filter((n) => n.id === id)[0];

    if (!note) {
      throw new NotFoundError('NOTE_NOT_EXISTS');
    }

    return note;
  }

  /**
   * Update note record by id
   * @param {string} id
   * @param {object} props
   * @param {string} props.title
   * @param {string} props.body
   * @param {string[]} props.tags
   * @returns {void}
   */
  updateNoteById(id, props) {
    const { title, tags, body } = props;

    const index = this.notes.findIndex((note) => note.id === id);

    if (index === -1) {
      throw new NotFoundError('NOTE_NOT_EXISTS');
    }

    const updatedAt = new Date().toISOString();
    this.notes[index] = {
      ...this.notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
  }

  /**
   * delete note record using
   * @param {string} id
   * @returns {void}
   */
  deleteNoteById(id) {
    const index = this.notes.findIndex((note) => note.id === id);

    if (index === -1) {
      throw new NotFoundError('NOTE_NOT_EXISTS');
    }

    this.notes.splice(index, 1);
  }
}

module.exports = NoteService;
