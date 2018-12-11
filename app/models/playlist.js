// define database
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../config/knexfile')[environment];
const database = require('knex')(configuration);

const all = () => database('playlists')
    .join('playlists_favorites', {'playlists.id': 'playlists_favorites.playlist_id'} )
    .join('favorites', {'playlists_favorites.favorite_id': 'favorites.id'} )
    .select()
  
const find = (id) => database('playlists')
    .join('playlists_favorites', {'playlists.id': 'playlists_favorites.playlist_id'} )
    .join('favorites', {'playlists_favorites.favorite_id': 'favorites.id'} )
    .where('playlist_id', id)
    .select()
  



module.exports = {
  all, find,
}