const express = require('express');
const router = express.Router();

const welcomeController = require('../app/controllers/welcome-controller')
const welcomeRoute = router.get('/', welcomeController.index);

const favoritesController = require('../app/controllers/api/v1/favorites-controller')
const favoritesRoute = router.get('/api/v1/favorites', favoritesController.index)

module.exports = {
  welcomeRoute,
  favoritesIndexRoute,
}
