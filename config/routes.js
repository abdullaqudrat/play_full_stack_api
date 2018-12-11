const express = require('express');
const router = express.Router();

const welcomeController = require('../app/controllers/welcome-controller')
const welcomeRoute = router.get('/', welcomeController.index);

const favoritesController = require('../app/controllers/api/v1/favorites-controller')
const favoritesIndexRoute = router.get('/api/v1/favorites', favoritesController.index)
const favoritesShowRoute = router.get('/api/v1/favorites/:id', favoritesController.show)
const favoritesCreateRoute = router.post('/api/v1/favorites', favoritesController.create)
const favoritesUpdateRoute = router.patch('/api/v1/favorites/:id', favoritesController.update)

const playlistsController = require('../app/controllers/api/v1/playlists-controller')
const playlistsIndexRoute = router.get('/api/v1/playlists', playlistsController.index)
const playlistsShowRoute = router.get('/api/v1/playlists/:id/favorites', playlistsController.show)
const playlistsCreateRoute = router.post('/api/v1/playlists/:playlist_id/favorites/:id', playlistsController.create)
const playlistsDestroyRoute = router.delete('/api/v1/playlists/:playlist_id/favorites/:id', playlistsController.destroy)

module.exports = {
  welcomeRoute,
  favoritesIndexRoute,
  favoritesShowRoute,
  favoritesCreateRoute,
  favoritesUpdateRoute,
  playlistsIndexRoute,
  playlistsShowRoute,
  playlistsCreateRoute,
  playlistsDestroyRoute,
}
