const { NotePayload, NoteIdParam } = require('./schema');
const { InvariantError } = require('../../exceptions');

const NotesValidator = {
  validateNotePayload: (payload) => {
    const validateBody = NotePayload.validate(payload);

    if (validateBody.error) throw new InvariantError(validateBody.error.message);
    return validateBody.value;
  },
  validateNoteParams: (param) => {
    const validateParams = NoteIdParam.validate(param);

    if (validateParams.error) throw new InvariantError(validateParams.error.message);
    return validateParams.value;
  },
};

module.exports = NotesValidator;
