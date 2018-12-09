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

// GET FAVORITE SHOW

app.get('/api/v1/favorites/:id', (request, response) => {
  database('favorites').where('id', request.params.id).select()
    .then(favorites => {
      if (favorites.length) {
        response.status(200).json({ id: favorites[0], song_title: favorites[1], artist_name: favorites[2], genre: favorites[3], song_rating: favorites[4]});
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

// GET ALL PLAYLISTS

app.get('/api/v1/playlists', (request, response) => {
    database('playlists')
    .join('playlists_favorites', {'playlists.id': 'playlists_favorites.playlist_id'} )
    .join('favorites', {'playlists_favorites.favorite_id': 'favorites.id'} )
    .select()
    .then(playlists => {
      if (playlists.length) {

        var playlistInfo = []

        playlists.forEach(function(playlist) {
          playlistInfo.push(playlist["playlist_id"]);
          playlistInfo.push(playlist["name"]);
        })

        const uniqueValues = (value, index, self) => {
          return self.indexOf(value) === index;
        }

        const uniquePlaylistInfo = playlistInfo.filter(uniqueValues);

        var playlistIndex = []
        var eachPlaylistWithFavorites = {}
        var playlistFavorites = []

        const buildPlaylistIndex = () => {
          for (index = 0; index < uniquePlaylistInfo.length; index ++) {

            playlists.forEach(function(playlist) {
              if (playlist["playlist_id"] === uniquePlaylistInfo[index]) {
                playlistFavorites.push({
                  id: playlist["favorite_id"],
                  name: playlist["song_title"],
                  artist_name: playlist["artist_name"],
                  genre: playlist["genre"],
                  song_rating: playlist["song_rating"]
                })
              }
            })

            playlistWithFavorites = { id: uniquePlaylistInfo[index],
                                      playlist_name: uniquePlaylistInfo[index + 1],
                                      favorites: playlistFavorites }
            playlistIndex.push(playlistWithFavorites)
            index++
            playlistFavorites = []

          }
        }
        buildPlaylistIndex()
        response.status(200).json(playlistIndex)
      } else {
        response.status(404).json({
          error: `Could not find playlist with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
})
// GET PLAYLIST SHOW

app.get('/api/v1/playlists/:id/favorites', (request, response) => {
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

// DELETE FAVORITE FROM PLAYLIST
app.delete('/api/v1/playlists/:playlist_id/favorites/:id', (request, response) => {
  const favoriteId = request.params.id;
  const playlistId = request.params.playlist_id;
  
  async function deletePlaylistsFavorites() {database('favorites')
  .join('playlists_favorites', {'favorites.id': 'playlists_favorites.favorite_id'} )
  .join('playlists', {'playlists_favorites.playlist_id': 'playlists.id'} )
  .where({ favorite_id: favoriteId, playlist_id: playlistId }).select().limit(1)
  .then(returnedInfo => { return info = returnedInfo})
    .then(await database('playlists_favorites').where({ favorite_id: favoriteId, playlist_id: playlistId }).del())
    .then(x => { response.status(200).json({ "message": `Successfully removed ${info[0]["song_title"]} from ${info[0]["name"]} playlist`})
  })
    .catch(error => {
      response.status(404).json({ error });
    });}
    deletePlaylistsFavorites();
});

// POST FAVORITE TO PLAYLIST

app.post('/api/v1/playlists/:playlist_id/favorites/:id', (request, response) => {
  const favorite_id = request.params.id;
  const playlist_id = request.params.playlist_id;

  database('playlists_favorites').insert({ favorite_id: favorite_id, playlist_id: playlist_id })
    .then(
      database('favorites')
      .join('playlists_favorites', {'favorites.id': 'playlists_favorites.favorite_id'} )
      .join('playlists', {'playlists_favorites.playlist_id': 'playlists.id'} )
      .where('favorite_id', request.params.id).select().limit(1)
      .then(returnedInfo => {
        response.status(201).json({
          "message": `Successfully added ${returnedInfo[0]["song_title"]} to ${returnedInfo[0]["name"]} playlist`
        })
      })
      .catch(error => {
        response.status(500).json({ error });
      })
    )
});
