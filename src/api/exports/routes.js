const routes = (handler) => [
  {
    method: 'POST',
    path: '/exports/playlists/{id}',
    handler: handler.postExportPlaylistSongsHandler.bind(handler),
    options: {
      auth: 'musicsapp_jwt',
    },
  },
];

module.exports = routes;
