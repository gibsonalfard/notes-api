require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const { ClientError, AuthenticationError } = require('./exceptions');

const notes = require('./api/notes');
const Note = require('./services/postgres/Note');
const NotesValidator = require('./validator/notes');

const users = require('./api/users');
const User = require('./services/postgres/User');
const UsersValidator = require('./validator/users');

const authentications = require('./api/authentications');
const Authentication = require('./services/postgres/Authentication');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationValidator = require('./validator/authentications');

const collaborations = require('./api/collaborations');
const Collaboration = require('./services/postgres/Collaborations');
const CollaborationsValidator = require('./validator/collaborations');

// Exports
const exportsHandler = require('./api/exports');
const Producer = require('./services/rabbitmq/Producer');
const ExportsValidator = require('./validator/exports');

// Uploads
const uploads = require('./api/uploads');
const Storage = require('./services/s3/Storage');
const UploadsValidator = require('./validator/uploads');

// Cache
const Cache = require('./services/redis/Cache');

const init = async () => {
  const cacheService = new Cache();
  const collaborationsService = new Collaboration(cacheService);
  const noteService = new Note(collaborationsService, cacheService);
  const userService = new User();
  const authenticationsService = new Authentication();
  const storageService = new Storage();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('notesapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacs) => ({
      isValid: true,
      credentials: {
        id: artifacs.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: notes,
      options: {
        service: noteService,
        validator: NotesValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService: userService,
        tokenManager: TokenManager,
        validator: AuthenticationValidator,
      },
    },
    {
      plugin: exportsHandler,
      options: {
        service: Producer,
        validator: ExportsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        service: collaborationsService,
        noteService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    } if (response instanceof AuthenticationError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    } if (response instanceof Error) {
      const newResponse = h.response({
        status: 'error',
        message: 'INTERNAL_SERVER_ERROR',
      });
      newResponse.code(500);
      console.error(response);
      return newResponse;
    }

    return response.continue || response;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
