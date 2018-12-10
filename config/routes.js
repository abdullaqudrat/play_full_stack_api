const express = require('express');
const router = express.Router();

const welcomeController = require('../app/controllers/welcome-controller')
const welcomeRoute = router.get('/', welcomeController.index);

const favoritesController = require('../app/controllers/api/v1/favorites-controller')
const favoritesIndexRoute = router.get('/api/v1/favorites', favoritesController.index)

const playlistsController = require('../app/controllers/api/v1/playlists-controller')
const playlistsIndexRoute = router.get('/api/v1/playlists', playlistsController.index)

module.exports = {
  welcomeRoute,
  favoritesIndexRoute,
  playlistsIndexRoute,
}
