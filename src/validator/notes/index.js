const { NotePayload } = require('./schema');
const { InvariantError } = require('../../exceptions');

const NotesValidator = {
  validateNotePayload: (payload) => {
    const validateBody = NotePayload.validate(payload);

    if (validateBody.error) throw new InvariantError(validateBody.error.message);
    return validateBody.value;
  },
};

module.exports = NotesValidator;
