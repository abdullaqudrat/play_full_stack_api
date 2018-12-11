const express = require('express');
const app = express();
const route = require('./config/routes')
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./config/knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Play API';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

app.use('/', route.welcomeRoute);
app.use('/api/v1/favorites', route.favoritesIndexRoute);
app.use('/api/v1/favorite/:id', route.favoritesShowRoute);
app.use('/api/v1/favorites', route.favoritesCreateRoute);
app.use('/api/v1/favorites/:id', route.favoritesUpdateRoute);

app.use('/api/v1/playlists', route.playlistsIndexRoute);
app.use('/api/v1/playlists/:playlist_id/favorites', route.playlistsShowRoute);
app.use('/api/v1/playlists/:playlist_id/favorites/:id', route.playlistsCreateRoute);
app.use('/api/v1/playlists/:playlist_id/favorites/:id', route.playlistsDestroyRoute);


// DELETE FAVORITES

app.delete('/api/v1/favorites/:id', (request, response) => {

  database('favorites').where({ id: request.params.id }).del()
    .then(song => {
      response.status(204).json()
    })
    .catch(error => {
      response.status(404).json({ error });
    });
});
