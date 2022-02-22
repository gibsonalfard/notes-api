const { ExportNotesPayload } = require('./schema');
const { InvariantError } = require('../../exceptions');

const ExportsValidator = {
  validateExportNotesPayload: (payload) => {
    const validateBody = ExportNotesPayload.validate(payload);

    if (validateBody.error) throw new InvariantError(validateBody.error.message);
    return validateBody.value;
  },
};

module.exports = ExportsValidator;
