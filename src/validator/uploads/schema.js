const joi = require('joi');

const ImageHeadersSchema = joi.object({
  'content-type': joi.string().valid(
    'image/apng',
    'image/avif',
    'image/gif',
    'image/jpeg',
    'image/png',
    'image/webp',
  ).required(),
}).unknown();

module.exports = { ImageHeadersSchema };
