class NotesHandler {
  constructor(service) {
    this.service = service;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  postNoteHandler(request, h) {
    try {
      const { title = 'untitled', tags, body } = request.payload;
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
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(400);
      return response;
    }
  }

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

  getNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;

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
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }

  putNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;
      this.service.updateNoteById(id, request.payload);

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil diperbarui',
      });
      response.code(200);
      return response;
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }

  deleteNoteByIdHandler(request, h) {
    try {
      const { id } = request.params;
      this.service.deleteNoteById(id);

      const response = h.response({
        status: 'success',
        message: 'Catatan berhasil dihapus',
      });
      return response;
    } catch (error) {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;
    }
  }
}

module.exports = NotesHandler;
