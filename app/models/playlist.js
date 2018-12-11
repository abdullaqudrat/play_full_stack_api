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
  
const findJoin = (favoriteId, playlistId) => database('favorites')
    .join('playlists_favorites', {'favorites.id': 'playlists_favorites.favorite_id'} )
    .join('playlists', {'playlists_favorites.playlist_id': 'playlists.id'} )
    .where({ favorite_id: favoriteId, playlist_id: playlistId }).select().limit(1)
  
const deleteJoin = (favoriteId, playlistId) => database('playlists_favorites').where({ favorite_id: favoriteId, playlist_id: playlistId }).del()

const insertFavorite = (playlistId, favoriteId) => database('playlists_favorites').insert({ favorite_id: favoriteId, playlist_id: playlistId })

const findFavorite = (favoriteId) => database('favorites')
    .join('playlists_favorites', {'favorites.id': 'playlists_favorites.favorite_id'} )
    .join('playlists', {'playlists_favorites.playlist_id': 'playlists.id'} )
    .where('favorite_id', favoriteId)
    .select()
    .limit(1)


module.exports = {
  all, 
  find, 
  findJoin, 
  deleteJoin, 
  insertFavorite, 
  findFavorite,
}