const routes = (handler) => [
  {
    method: 'POST',
    path: '/users',
    handler: handler.createHandler,
  },
  {
    method: 'GET',
    path: '/users/{id}',
    handler: handler.getOneByIdHandler,
  },
];

module.exports = routes;
