require('dotenv').config();

const Hapi = require('@hapi/hapi');
const { ClientError } = require('./exceptions');

const notes = require('./api/notes');
const Note = require('./services/postgres/Note');
const NotesValidator = require('./validator/notes');

const users = require('./api/users');
const User = require('./services/postgres/User');
const UsersValidator = require('./validator/users');

const init = async () => {
  const noteService = new Note();
  const userService = new User();
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([{
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
  }]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof ClientError) {
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
