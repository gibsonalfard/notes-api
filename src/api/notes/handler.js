const { ClientError } = require('../../exceptions');

class NotesHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  /**
   * Handler to save note
   * @param {object} request
   * @param {object} h
   * @returns {object}
   */
  postNoteHandler(request, h) {
    try {
      const { title = 'untitled', tags, body } = this.validator.validateNotePayload(request.payload);
      const noteId = this.service.addNotes({ title, body, tags });

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil ditambahkan',
        data: {
          noteId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'INTERNAL_SERVER_ERROR',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  /**
   * Handler to get all note that already recorded
   * @param {object} request
   * @param {object} h
   * @returns {object}
   */
  getNotesHandler(request, h) {
    const notes = this.service.getNotes();
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diambil',
      data: {
        notes,
      },
    });
    response.code(200);

    return response;
  }

  /**
   * Handler to get one note by id
   * @param {object} request
   * @param {object} h
   * @returns {object}
   */
  getNoteByIdHandler(request, h) {
    try {
      const { id } = this.validator.validateNoteParams(request.params);

      const note = this.service.getNoteById(id);

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil diambil',
        data: {
          note,
        },
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'INTERNAL_SERVER_ERROR',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  /**
   * Handler to update note record
   * @param {object} request
   * @param {object} h
   * @returns {object}
   */
  putNoteByIdHandler(request, h) {
    try {
      const { id } = this.validator.validateNoteParams(request.params);
      const { title, tags, body } = this.validator.validateNotePayload(request.payload);
      this.service.updateNoteById(id, { title, tags, body });

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil diperbarui',
      });
      response.code(200);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'INTERNAL_SERVER_ERROR',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  /**
   * Handler to delete one note by id
   * @param {object} request
   * @param {object} h
   * @returns {object}
   */
  deleteNoteByIdHandler(request, h) {
    try {
      const { id } = this.validator.validateNoteParams(request.params);
      this.service.deleteNoteById(id);

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil dihapus',
      });
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'INTERNAL_SERVER_ERROR',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = NotesHandler;
