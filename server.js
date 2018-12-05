const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 3000);
app.locals.title = 'Play API';

app.get('/', (request, response) => {
  response.send('Welcome to Play API');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});


// GET ALL FAVORITES

app.get('/api/v1/favorites', (request, response) => {
  database('favorites').select()
    .then((favorites) => {
      response.status(200).json(favorites)
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
})


// POST NEW FAVORITE

app.post('/api/v1/songs', (request, response) => {
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