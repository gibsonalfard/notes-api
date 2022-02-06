const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.create,
    options: {
      auth: 'notesapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.delete,
    options: {
      auth: 'notesapp_jwt',
    },
  },
];

module.exports = routes;
