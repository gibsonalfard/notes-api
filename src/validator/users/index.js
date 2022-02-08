const { CreatePayload, IdParam, indexQuery } = require('./schema');
const { InvariantError } = require('../../exceptions');

const UsersValidator = {
  validateCreatePayload: (payload) => {
    const validateBody = CreatePayload.validate(payload);

    if (validateBody.error) throw new InvariantError(validateBody.error.message);
    return validateBody.value;
  },
  validateIdParams: (param) => {
    const validateParams = IdParam.validate(param);

    if (validateParams.error) throw new InvariantError(validateParams.error.message);
    return validateParams.value;
  },
  validateQuery: (query) => {
    const validateQuery = indexQuery.validate(query);

    if (validateQuery.error) throw new InvariantError(validateQuery.error.message);
    return validateQuery.value;
  },
};

module.exports = UsersValidator;
