require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
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
const ProducerService = require('./services/rabbitmq/Producer');
const ExportsValidator = require('./validator/exports');

const init = async () => {
  const collaborationsService = new Collaboration();
  const noteService = new Note(collaborationsService);
  const userService = new User();
  const authenticationsService = new Authentication();

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
        service: ProducerService,
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
