class ExportsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
  }

  async postExportNotesHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { targetEmail } = this.validator.validateExportNotesPayload(request.payload);

    const message = {
      userId: credentialId,
      targetEmail,
    };

    await this.service.sendMessage('export:notes', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda dalam antrean',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
