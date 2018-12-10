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

module.exports = {
  index,
}