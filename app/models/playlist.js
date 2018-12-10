// define database
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../config/knexfile')[environment];
const database = require('knex')(configuration);

const all = () => database('playlists')
  .select()


module.exports = {
  all,
}