const InvariantError = require('../../exceptions/InvariantError');
const { ImageHeadersSchema } = require('./schema');

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const validateBody = ImageHeadersSchema.validate(headers);

    if (validateBody.error) throw new InvariantError(validateBody.error.message);
    return validateBody.value;
  },
};

module.exports = UploadsValidator;
