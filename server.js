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

// GET SONG SHOW

app.get('/api/v1/songs/:id', (request, response) => {
  database('favorites').where('id', request.params.id).select()
    .then(favorites => {
      if (favorites.length) {
        response.status(200).json(favorites);
      } else {
        response.status(404).json({
          error: `Could not find song with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

// PATCH SONG

app.patch('/api/v1/songs/:id', (request, response) => {
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

// Delete song
app.delete('/api/v1/songs/:id', (request, response) => {
  const song = request.body;

  database('favorites').where({ id: request.params.id }).del()
    .then(song => {
      response.status(204).json({ id: song[0], song_title: song[1], artist_name: song[2], genre: song[3], song_rating: song[4]})
    })
    .catch(error => {
      response.status(404).json({ error });
    });
});

// GET PLAYLIST SHOW

app.get('/api/v1/playlists/:id/songs', (request, response) => {
  database('playlists')
  .join('playlists_favorites', {'playlists.id': 'playlists_favorites.playlist_id'} )
  .join('favorites', {'playlists_favorites.favorite_id': 'favorites.id'} )
  .where('playlist_id', request.params.id).select()
    .then(playlist => {
      if (playlist.length) {
        var favorites = playlist.map(function(p, index) {
          return { song_title: p["song_title"],
                   artist_name: p["artist_name"],
                   genre: p["genre"],
                   song_rating: p["song_rating"]
                 }
        })

        response.status(200).json({
          id: playlist[0]["playlist_id"],
          playlist_name: playlist[0]["name"],
          favorites
        })
      } else {
        response.status(404).json({
          error: `Could not find playlist with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});
