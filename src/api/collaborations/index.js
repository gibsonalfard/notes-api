const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: async (server, { service, noteService, validator }) => {
    const handler = new CollaborationsHandler(service, noteService, validator);
    server.route(routes(handler));
  },
};
