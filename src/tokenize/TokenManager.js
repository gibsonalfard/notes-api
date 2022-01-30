const Jwt = require('@hapi/jwt');
const { InvariantError } = require('../exceptions');

const { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } = process.env;

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, REFRESH_TOKEN_KEY);
      return artifacts.decoded.payload;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },
};

module.exports = TokenManager;
