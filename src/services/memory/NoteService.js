const { nanoid } = require('nanoid');

class NoteService {
  constructor() {
    this.notes = [];
  }

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
      throw new Error('ERROR_WHILE_ADD_NOTE');
    }

    return id;
  }

  getNotes() {
    return this.notes;
  }

  getNoteById(id) {
    const note = this.notes.filter((n) => n.id === id)[0];

    if (!note) {
      throw new Error('NOTE_NOT_EXISTS');
    }

    return note;
  }

  updateNoteById(id, props) {
    const { title, tags, body } = props;

    const index = this.notes.findIndex((note) => note.id === id);

    if (index === -1) {
      throw new Error('NOTE_NOT_EXISTS');
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

  deleteNoteById(id) {
    const index = this.notes.findIndex((note) => note.id === id);

    if (index === -1) {
      throw new Error('NOTE_NOT_EXISTS');
    }

    this.notes.splice(index, 1);
  }
}

module.exports = NoteService;
