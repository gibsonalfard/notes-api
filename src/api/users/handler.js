class UsersHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.createHandler = this.createHandler.bind(this);
    this.getOneByIdHandler = this.getOneByIdHandler.bind(this);
    this.getOneByUsernameHandler = this.getOneByUsernameHandler.bind(this);
  }

  /**
   * Handler to save users
   * @param {object} request
   * @param {object} h
   * @returns {object}
   */
  async createHandler(request, h) {
    const { username, password, fullname } = this.validator.validateCreatePayload(request.payload);
    const userId = await this.service.addUsers({ username, password, fullname });

    const response = h.response({
      status: 'success',
      message: 'USER_ADDED',
      data: {
        userId,
      },
    });
    response.code(201);
    return response;
  }

  /**
   * Handler to get one user by id
   * @param {object} request
   * @param {object} h
   * @returns {object}
   */
  async getOneByIdHandler(request, h) {
    const { id } = this.validator.validateIdParams(request.params);

    const user = await this.service.getOneById(id);

    const response = h.response({
      status: 'success',
      message: 'USER_FOUND',
      data: {
        user,
      },
    });
    response.code(200);
    return response;
  }

  async getOneByUsernameHandler(request, h) {
    const { username } = this.validator.validateQuery(request.query);

    const users = await this.service.getUserByUsername(username);

    const response = h.response({
      status: 'success',
      message: 'USER_FOUND',
      data: {
        users,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = UsersHandler;
