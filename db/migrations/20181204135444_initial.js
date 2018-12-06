exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.createTable('favorites', function(table) {
        table.increments('id').primary();
        table.string('song_title');
        table.string('artist_name');
        table.string('genre');
        table.integer('song_rating');

        table.timestamps(true, true);
      }),

      knex.schema.createTable('playlists', function(table) {
        table.increments('id').primary();
        table.string('name');

        table.timestamps(true, true);
      }),

      knex.schema.createTable('playlists_favorites', function(table) {
        table.increments('id').primary();
        table.integer('favorite_id').references('favorites.id');
        table.integer('playlist_id').references('playlists.id');

        table.timestamps(true, true);
      })
    ])
  };


  exports.down = function(knex, Promise) {
    return Promise.all([
      knex.schema.dropTable('playlists_favorites'),
      knex.schema.dropTable('playlists'),
      knex.schema.dropTable('favorites'),
    ]);
  }
