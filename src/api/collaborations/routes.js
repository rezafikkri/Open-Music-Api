const routes = (handler) => [
  {
    method: 'POST',
    path: '/collaborations',
    handler: handler.postCollaborationHandler.bind(handler),
    options: {
      auth: 'musicsapp_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/collaborations',
    handler: handler.deleteCollaborationHandler.bind(handler),
    options: {
      auth: 'musicsapp_jwt',
    },
  },
];

module.exports = routes;
