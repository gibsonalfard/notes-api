class CollaborationsHandler {
  constructor(service, noteService, validator) {
    this.service = service;
    this.validator = validator;
    this.noteService = noteService;

    this.create = this.create.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { noteId, userId } = this.validator.validateCollaborationPayload(request.payload);

    await this.noteService.verifyNoteOwner(noteId, credentialId);
    const collaborationId = await this.service.create({ noteId, userId });

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async delete(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { noteId, userId } = this.validator.validateCollaborationPayload(request.payload);

    await this.noteService.verifyNoteOwner(noteId, credentialId);
    await this.service.delete({ noteId, userId });

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    });
    response.code(201);
    return response;
  }
}

module.exports = CollaborationsHandler;
