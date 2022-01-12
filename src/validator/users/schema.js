const joi = require('joi');

const CreatePayload = joi.object({
  username: joi.string().required(),
  password: joi.string().required(),
  fullname: joi.string().required(),
});

const IdParam = joi.object({
  id: joi.string().length(21).required(),
});

module.exports = { CreatePayload, IdParam };
