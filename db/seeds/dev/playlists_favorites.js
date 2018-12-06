pry = require('pryjs')
// eval(pry.it)



exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries

  return knex('playlists_favorites').del()
    .then(() => knex('playlists').del())
    .then(() => knex('favorites').del())
    .then(console.log('Deleted all'))
    .catch(error => console.log(`Error deleting: ${ error }`))

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

        // favorites.forEach(function(favorite) {
        //   makeFavorite(knex, favorite)
        // }),
        knex('favorites').insert([
          { song_title: 'Roxanne', artist_name: 'The Police', genre: 'Rock', song_rating: '34' },
          { song_title: 'Cloudy', artist_name: 'Funkmammoth', genre: 'Funk', song_rating: '23' },
          { song_title: 'No Quarter', artist_name: 'Led Zeppelin', genre: 'Rock', song_rating: '45'}
        ]),
        knex('playlists').insert([
          { name: 'sleep now'}, { name: 'disco'}
        ])
      ]))
      // Inserts seed entries
    })
    .then(function () {
      return knex('favorites').pluck('id').then(function(favoriteIds) {
        console.log(favoriteIds)
        var faveIds = favoriteIds
        console.log(faveIds)
        return knex('playlists').pluck('id').then(function(playlistIds) {
          var playIds = playlistIds
          console.log(faveIds)
          console.log(playIds)

          var fave_play_ids = faveIds.map(function(faveId, index) {
            return [faveId, playIds[Math.floor(Math.random()*playIds.length)] ]
          });
          console.log(fave_play_ids)
          var favyId = fave_play_ids.forEach(function(fave_play_id) {
            console.log(fave_play_id[0])
            console.log(fave_play_id[1])
            return knex('playlists_favorites').insert({ favorite_id: fave_play_id[0], playlist_id: fave_play_id[1] }, 'id');
          })
          console.log(favyId)

        })

        // eval(pry.it)
        console.log(fave_play_ids)
        // faveIds.forEach(function(favorite_id) {
        //
        //   return knex('playlists_favorites').insert({ favorite_id: favorite_id });
        // })
      })
    })
    .then(function() {
      return knex('playlists').pluck('id').then(function(ids) {
        console.log(ids)
      })
    })

}