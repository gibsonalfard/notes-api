class UploadsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.upload = this.upload.bind(this);
  }

  async upload(request, h) {
    const { data } = request.payload;
    this.validator.validateImageHeaders(data.hapi.headers);

    const fileLocation = await this.service.writeFile(data, data.hapi);
    const response = h.response({
      status: 'success',
      data: {
        fileLocation,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
