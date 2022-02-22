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
  async postNoteHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { title = 'untitled', tags, body } = this.validator.validateNotePayload(request.payload);
    const noteId = await this.service.addNotes({
      title, body, tags, owner: credentialId,
    });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * Handler to get all note that already recorded
   * @param {object} request
   * @param {object} h
   * @returns {object}
   */
  async getNotesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const notes = await this.service.getNotes(credentialId);
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
  async getNoteByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = this.validator.validateNoteParams(request.params);

    await this.service.verifyNoteAccess(id, credentialId);
    const note = await this.service.getNoteById(id);

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diambil',
      data: {
        note,
      },
    });
    response.code(200);
    return response;
  }

  /**
   * Handler to update note record
   * @param {object} request
   * @param {object} h
   * @returns {object}
   */
  async putNoteByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = this.validator.validateNoteParams(request.params);
    const { title, tags, body } = this.validator.validateNotePayload(request.payload);

    await this.service.verifyNoteAccess(id, credentialId);
    await this.service.updateNoteById(id, { title, tags, body });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  /**
   * Handler to delete one note by id
   * @param {object} request
   * @param {object} h
   * @returns {object}
   */
  async deleteNoteByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { id } = this.validator.validateNoteParams(request.params);

    await this.service.verifyNoteAccess(id, credentialId);
    await this.service.deleteNoteById(id);

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    return response;
  }
}

module.exports = NotesHandler;
