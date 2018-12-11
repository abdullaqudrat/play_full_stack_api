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

const destroy = (request, response) => {
    const favoriteId = request.params.id;
    const playlistId = request.params.playlist_id;
  
    async function deletePlaylistsFavorites() {Playlist.findJoin(favoriteId, playlistId)
    .then(returnedInfo => { return info = returnedInfo})
      .then(await Playlist.deleteJoin(favoriteId, playlistId))
      .then(x => { response.status(200).json({ "message": `Successfully removed ${info[0]["song_title"]} from ${info[0]["name"]} playlist`})
    })
      .catch(error => {
        response.status(404).json({ error });
      });}
      deletePlaylistsFavorites();
  }

module.exports = {
  index, show, destroy,
}