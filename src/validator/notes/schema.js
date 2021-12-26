const joi = require('joi');

const NotePayload = joi.object({
  title: joi.string().required(),
  body: joi.string().required(),
  tags: joi.array().items(joi.string()).required(),
});

module.exports = { NotePayload };
