const joi = require('joi');

const CollaborationPayloadSchema = joi.object({
  noteId: joi.string().required(),
  userId: joi.string().required(),
});

module.exports = {
  CollaborationPayloadSchema,
};
