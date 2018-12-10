const express = require('express');
const router = express.Router();

const welcomeController = require('../app/controllers/welcome-controller')

const welcomeRoute = router.get('/', welcomeController.index);

module.exports = {
  welcomeRoute,
}
