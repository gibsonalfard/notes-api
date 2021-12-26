const joi = require('joi');

const NotePayload = joi.object({
  title: joi.string().required(),
  body: joi.string().required(),
  tags: joi.array().items(joi.string()).required(),
});

const NoteIdParam = joi.object({
  id: joi.string().length(16).required(),
});

module.exports = { NotePayload, NoteIdParam };
