const routes = (handler) => [
  {
    method: 'POST',
    path: '/songs',
    handler: handler.postSongHandler.bind(handler),
  },
  {
    method: 'GET',
    path: '/songs',
    handler: handler.getSongsHandler.bind(handler),
  },
  {
    method: 'GET',
    path: '/songs/{id}',
    handler: handler.getSongByIdHandler.bind(handler),
  },
  {
    method: 'PUT',
    path: '/songs/{id}',
    handler: handler.putSongByIdHandler.bind(handler),
  },
  {
    method: 'DELETE',
    path: '/songs/{id}',
    handler: handler.deleteSongByIdHandler.bind(handler),
  },
];

module.exports = routes;
