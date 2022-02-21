const joi = require('joi');

const ExportNotesPayload = joi.object({
  targetEmail: joi.string().email({ tlds: true }).required(),
});

module.exports = { ExportNotesPayload };
