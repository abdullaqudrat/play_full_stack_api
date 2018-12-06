
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('playlists_favorites').del()
    .then(knex('playlists').del())
    .then(knex('favorites').del())
    .then(function () {

      const favorites =
          [{ song_title: 'Roxanne', artist_name: 'The Police', genre: 'Rock', song_rating: '34' },
          { song_title: 'Cloudy', artist_name: 'Funkmammoth', genre: 'Funk', song_rating: '23' },
          { song_title: 'No Quarter', artist_name: 'Led Zeppelin', genre: 'Rock', song_rating: '45'}]
      const playlists = [{name: 'sleep now'}, {name: 'disco'}]

      function makeFavorite(knex, favorite) {
        return knex('favorites').insert({ song_title: favorite.song_title, artist_name: favorite.artist_name, genre: favorite.genre, song_rating: favorite.song_rating}, 'id');
      }
      function makePlaylist(knex, playlist) {
        return knex('playlists').insert({ name: playlist.name}, 'id');
      }
      function makePlaylistsFavorite(knex, favorite_id, playlist_id) {
        return knex('playlists_favorites').insert({ favorite_id: favorite_id, playlist_id: playlist_id } , 'id');
      }

      return(Promise.all([

        knex('favorites').insert([
          { song_title: 'Roxanne', artist_name: 'The Police', genre: 'Rock', song_rating: '34' },
          { song_title: 'Cloudy', artist_name: 'Funkmammoth', genre: 'Funk', song_rating: '23' },
          { song_title: 'No Quarter', artist_name: 'Led Zeppelin', genre: 'Rock', song_rating: '45'}
        ]),
        knex('playlists').insert(
          [{ name: 'sleep now'}, { name: 'disco'}]
        )

      ]))
      // Inserts seed entries
    })
}
