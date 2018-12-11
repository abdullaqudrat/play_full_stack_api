// define database
const environment = process.env.NODE_ENV || 'development';
const configuration = require('../../config/knexfile')[environment];
const database = require('knex')(configuration);

const all = () => database('favorites')
  .select()

const find = (id) => database('favorites')
  .where('id', id)
  .select()


module.exports = {
  all,
  find,
}
