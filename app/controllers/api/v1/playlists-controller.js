const Playlist = require('../../../models/playlist')

const index = (request, response) => {
  Playlist.all()
    .then((playlists) => {
      response.status(200).json(playlists)
    })
    .catch((error) => {
      response.status(500).json({ error })
    })
}

const show = (request, response) => {
    Playlist.find(request.params.id)
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
}

module.exports = {
  index, show
}