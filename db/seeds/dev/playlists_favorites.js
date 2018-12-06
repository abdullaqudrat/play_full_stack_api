exports.seed = function(knex, Promise) {

  return knex('playlists_favorites').del()
    .then(() => knex('playlists').del())
    .then(() => knex('favorites').del())
    .then(console.log('Deleted all'))
    .catch(error => console.log(`Error deleting: ${ error }`))

    .then(function () {
      return(Promise.all([

        knex('favorites').insert([
          { song_title: 'Roxanne', artist_name: 'The Police', genre: 'Rock', song_rating: '34' },
          { song_title: 'Cloudy', artist_name: 'Funkmammoth', genre: 'Funk', song_rating: '23' },
          { song_title: 'No Quarter', artist_name: 'Led Zeppelin', genre: 'Rock', song_rating: '45'}
        ]),
        knex('playlists').insert([
          { name: 'sleep now'}, { name: 'disco'}
        ])
      ]))
    })
    .then(function () {
      return knex('favorites').pluck('id').then(function(favoriteIds) {
        var faveIds = favoriteIds

        return knex('playlists').pluck('id').then(function(playlistIds) {
          var playIds = playlistIds

          var fave_play_ids = faveIds.map(function(faveId, index) {
            return [faveId, playIds[Math.floor(Math.random()*playIds.length)] ]
          });

          fave_play_ids.forEach(function(fave_play_id) {
            return Promise.all([knex('playlists_favorites').insert({ favorite_id: fave_play_id[0], playlist_id: fave_play_id[1] })]);
          })
        })
      })
    })
    .then(function() {
      return knex('playlists').pluck('id').then(function(ids) {
      })
    })
    .then(console.log('Seeded all data.'))
    .catch(error => console.log(`Error seeding: ${ error }`))
}
