const {
  CollaborationPayloadSchema,
} = require('./schema');
const { InvariantError } = require('../../exceptions');

const CollaborationsValidator = {
  validateCollaborationPayload: (payload) => {
    const validateBody = CollaborationPayloadSchema.validate(payload);
    if (validateBody.error) throw new InvariantError(validateBody.error.message);
    return validateBody.value;
  },
};

module.exports = CollaborationsValidator;
