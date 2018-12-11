const express = require('express');
const app = express();
const route = require('./config/routes')

app.use('/', route.welcomeRoute);
app.use('/api/v1/favorites', route.favoritesIndexRoute);

// app.use('/api/v1/playlists', route.playlistsIndexRoute);
// app.use('/api/v1/playlists/:id/songs', route.playlistsIndexRoute);


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





// POST NEW FAVORITE

app.post('/api/v1/favorites', (request, response) => {
  const song = request.body;

  for (let requiredParameter of ['song_title', 'artist_name', 'genre', 'song_rating']) {
    if (!song[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { song_title: <String>, artist_name: <String>, genre: <String>, song_rating: <Integer> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('favorites').insert(song, ['id', 'song_title', 'artist_name', 'song_rating'])
    .then(song => {
      response.status(201).json({ id: song[0], song_title: song[1], artist_name: song[2], genre: song[3], song_rating: song[4]})
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});


// PATCH FAVORITE

app.patch('/api/v1/favorites/:id', (request, response) => {
  const song = request.body;

  for (let requiredParameter of ['song_title', 'artist_name', 'genre', 'song_rating']) {
    if (!song[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { song_title: <String>, artist_name: <String>, genre: <String>, song_rating: <Integer> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('favorites').where({ id: request.params.id }).update(song, ['id', 'song_title', 'artist_name', 'song_rating'])
    .then(song => {
      response.status(200).json({ id: song[0], song_title: song[1], artist_name: song[2], genre: song[3], song_rating: song[4]})
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

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
